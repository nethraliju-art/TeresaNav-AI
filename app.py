import os
import json
import time
import hashlib
import secrets
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

# Load API key from .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is missing. Add it to backend/.env")

print(f"🔑 API key loaded: {api_key[:8]}...{api_key[-4:]} (length={len(api_key)})")

# ---- Paths ----
BASE_DIR = os.path.dirname(__file__)
COLLEGE_DATA_FILE = os.path.join(BASE_DIR, "college_data.txt")
TIMETABLE_FILE = os.path.join(BASE_DIR, "timetable.json")
USERS_FILE = os.path.join(BASE_DIR, "users.json")

# ---- Load college data ----
with open(COLLEGE_DATA_FILE, "r", encoding="utf-8") as f:
    FULL_DATA = f.read()

print(f"📄 Full college data: {len(FULL_DATA)} characters")

# ---- Prioritise important sections, then truncate ----
PRIORITY_HEADERS = ["contact-us", "admissions", "about-us", "vision-mission", "departments"]

def build_prioritized_data(full_data: str, max_chars: int = 45000) -> str:
    sections = full_data.split("=== SOURCE: ")

    priority, other = [], []
    for section in sections:
        header = section.split(" ===")[0] if " ===" in section else ""
        if any(p in header for p in PRIORITY_HEADERS):
            priority.append(section)
        else:
            other.append(section)

    combined = "=== SOURCE: ".join(priority + other)
    return combined[:max_chars]

COLLEGE_DATA = build_prioritized_data(FULL_DATA, 45000)
print(f"📄 Prioritized college data: {len(COLLEGE_DATA)} characters")

# ---- System prompt ----
SYSTEM_PROMPT = f"""You are TeresaBot, the assistant for St. Teresa's College (Autonomous), Kochi.

Answer using ONLY the info below. If not in the info, say:
"I don't have that information yet. Please visit https://teresas.ac.in or contact the college office."

Keep answers short and complete. Use plain text without markdown.
Always finish your sentences.

--- COLLEGE INFO ---
{COLLEGE_DATA}
--- END ---
"""

# ---- Gemini client ----
client = genai.Client(api_key=api_key)

app = Flask(__name__)
CORS(app)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "multi-model", "assistant": "TeresaBot"})


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = (data.get("message") or "").strip()

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    print(f"💬 User asked: {user_message[:100]}")

    # Models tried in order — if one is overloaded (503) or gone (404), fall back to the next
    MODELS = [
        "gemini-3.8-flash",
        "gemini-2.5-pro",
        "gemini-2.0-pro",
        "gemini-1.5-pro",
        "gemini-2.5-flash",
    ]

    last_error = None

    for model_name in MODELS:
        for attempt in range(3):
            try:
                print(f"   → {model_name} (attempt {attempt + 1})")

                response = client.models.generate_content(
                    model=model_name,
                    contents=user_message,
                    config={
                        "system_instruction": SYSTEM_PROMPT,
                        "max_output_tokens": 800,
                        "temperature": 0.3,
                    },
                )

                # Extract reply safely (handles blocked content)
                reply_text = None
                try:
                    reply_text = response.text
                except Exception:
                    if response.candidates and len(response.candidates) > 0:
                        parts = response.candidates[0].content.parts
                        reply_text = " ".join([p.text for p in parts if hasattr(p, "text")])

                if not reply_text:
                    reply_text = "I couldn't generate a response. Please try rephrasing."

                print(f"   ✅ {model_name} replied ({len(reply_text)} chars)")
                return jsonify({"reply": reply_text})

            except Exception as e:
                error_msg = str(e)
                last_error = error_msg
                print(f"   ⚠️ {model_name} failed: {error_msg[:120]}")

                # 503 → server overloaded, wait and retry the same model
                if "503" in error_msg or "UNAVAILABLE" in error_msg:
                    time.sleep(1.5 * (attempt + 1))  # 1.5s, 3s, 4.5s
                    continue
                # 404 → model not available, move to next model
                elif "404" in error_msg or "NOT_FOUND" in error_msg:
                    break
                # Other errors → move to next model
                else:
                    break

    # All models failed
    return jsonify({
        "error": "Google's AI servers are busy. Please try again in a moment.",
        "details": last_error,
    }), 503


@app.route("/api/timetable", methods=["GET"])
def get_timetable():
    try:
        return jsonify(load_timetable())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/timetable", methods=["POST"])
def update_timetable():
    data = request.get_json(silent=True) or {}
    role = (data.get("role") or "").strip()
    slots = data.get("slots")

    if role != "admin":
        return jsonify({"error": "Forbidden — admin only"}), 403
    if not isinstance(slots, list):
        return jsonify({"error": "Invalid payload"}), 400

    try:
        save_timetable(slots)
        return jsonify({"ok": True, "count": len(slots)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---- Timetable helpers ----
def load_timetable():
    if not os.path.exists(TIMETABLE_FILE):
        with open(TIMETABLE_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)
    with open(TIMETABLE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_timetable(slots):
    with open(TIMETABLE_FILE, "w", encoding="utf-8") as f:
        json.dump(slots, f, indent=2, ensure_ascii=False)


# ============================================================
# AUTHENTICATION
# ============================================================

# Sessions held in memory (cleared on restart — for demo)
ACTIVE_SESSIONS = {}

# Admin credentials (hashed)
ADMIN_EMAIL = "admin020@gmail.com"
ADMIN_PASSWORD_HASH = hashlib.sha256("admin@020".encode()).hexdigest()


def hash_password(password: str) -> str:
    """Simple SHA-256 hash (for demo — use bcrypt in production)."""
    return hashlib.sha256(password.encode()).hexdigest()


def load_users() -> list:
    """Load registered users from users.json."""
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_users(users: list):
    """Save users to users.json."""
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)


def generate_token() -> str:
    return secrets.token_urlsafe(32)


@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()
    name = (data.get("name") or "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"error": "Please enter a valid email address"}), 400

    if email == ADMIN_EMAIL:
        return jsonify({"error": "This email is reserved"}), 400

    users = load_users()

    if any(u["email"] == email for u in users):
        return jsonify({"error": "An account with this email already exists"}), 400

    users.append({
        "email": email,
        "name": name or email.split("@")[0].title(),
        "password_hash": hash_password(password),
        "role": "user",
        "created_at": datetime.utcnow().isoformat(),
    })
    save_users(users)

    return jsonify({"ok": True, "message": "Account created. Please sign in."})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = (data.get("password") or "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Admin check
    if email == ADMIN_EMAIL and hash_password(password) == ADMIN_PASSWORD_HASH:
        token = generate_token()
        ACTIVE_SESSIONS[token] = {
            "email": email,
            "name": "Admin",
            "role": "admin",
            "expires": (datetime.utcnow() + timedelta(hours=8)).isoformat(),
        }
        return jsonify({
            "ok": True,
            "token": token,
            "user": {"name": "Admin", "email": email, "role": "admin"},
        })

    # Regular user check
    users = load_users()
    match = next((u for u in users if u["email"] == email), None)

    if not match or match["password_hash"] != hash_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token()
    ACTIVE_SESSIONS[token] = {
        "email": email,
        "name": match["name"],
        "role": "user",
        "expires": (datetime.utcnow() + timedelta(hours=8)).isoformat(),
    }
    return jsonify({
        "ok": True,
        "token": token,
        "user": {"name": match["name"], "email": email, "role": "user"},
    })


@app.route("/api/logout", methods=["POST"])
def logout():
    data = request.get_json(silent=True) or {}
    token = (data.get("token") or "").strip()
    if token in ACTIVE_SESSIONS:
        del ACTIVE_SESSIONS[token]
    return jsonify({"ok": True})


@app.route("/api/me", methods=["GET"])
def me():
    token = request.headers.get("Authorization", "").replace("Bearer ", "").strip()
    session = ACTIVE_SESSIONS.get(token)
    if not session:
        return jsonify({"error": "Not authenticated"}), 401
    return jsonify({
        "name": session["name"],
        "email": session["email"],
        "role": session["role"],
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)