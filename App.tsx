import { useState } from "react";
import CampusMap from "./components/CampusMap";
import Timetable from "./components/Timetable";
import RoomStatus from "./components/RoomStatus";
import Chatbot from "./components/Chatbot";
import { BLOCKS, TIMETABLE_SLOTS, SUBJECTS } from "./data/campusData";

type Tab = "home" | "map" | "timetable" | "rooms";
export type UserRole = "user" | "admin";
export interface LoggedInUser { name: string; role: UserRole; }

const NAV_ITEMS: { id: Tab; label: string; icon: string; short: string }[] = [
  { id: "home",      label: "Dashboard",   icon: "⊞", short: "Home"     },
  { id: "map",       label: "Campus Map",  icon: "◎", short: "Map"      },
  { id: "timetable", label: "Timetable",   icon: "▦", short: "Schedule" },
  { id: "rooms",     label: "Room Status", icon: "◫", short: "Rooms"    },
];

const ROLE_BADGE: Record<UserRole, { bg: string; text: string; label: string }> = {
  user:  { bg: "#E8EDF5", text: "#1A2B5E", label: "User"  },
  admin: { bg: "#FEF3C7", text: "#92400E", label: "Admin" },
};

/* ============================================================
   Login / Signup Modal
   ============================================================ */
function LoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: (u: LoggedInUser) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000/api";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password;

    // ---- Signup mode ----
    if (mode === "signup") {
      if (trimmedPass !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail, password: trimmedPass, name }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Signup failed.");
          return;
        }
        setInfo("Account created! Please sign in.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      } catch {
        setError("Could not reach server. Is the backend running?");
      } finally {
        setLoading(false);
      }
      return;
    }

    // ---- Login mode ----
    if (!trimmedEmail || !trimmedPass) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      localStorage.setItem("teresanav_token", data.token);
      onLogin({ name: data.user.name, role: data.user.role });
      onClose();
    } catch {
      setError("Could not reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(newMode: "login" | "signup") {
    setMode(newMode);
    setError("");
    setInfo("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-sm border border-[#D4D4CC] shadow-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4D4CC]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1A2B5E] rounded-sm flex items-center justify-center">
              <span className="font-display font-black text-[#F4A12A] text-[10px]">TN</span>
            </div>
            <span className="font-display font-bold text-[#0F1623] text-sm">
              {mode === "login" ? "Sign in to TeresaNav" : "Create your account"}
            </span>
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#0F1623] transition-colors text-lg leading-none">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#D4D4CC]">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className="flex-1 py-2.5 text-xs font-semibold transition-colors"
            style={{
              color: mode === "login" ? "#1A2B5E" : "#9CA3AF",
              borderBottom: mode === "login" ? "2px solid #1A2B5E" : "2px solid transparent",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className="flex-1 py-2.5 text-xs font-semibold transition-colors"
            style={{
              color: mode === "signup" ? "#1A2B5E" : "#9CA3AF",
              borderBottom: mode === "signup" ? "2px solid #1A2B5E" : "2px solid transparent",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError(""); }}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-[#D4D4CC] rounded-sm text-sm focus:outline-none focus:border-[#1A2B5E] bg-[#F2F2EE] placeholder:text-[#9CA3AF]"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-[#D4D4CC] rounded-sm text-sm focus:outline-none focus:border-[#1A2B5E] bg-[#F2F2EE] placeholder:text-[#9CA3AF]"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-[#D4D4CC] rounded-sm text-sm focus:outline-none focus:border-[#1A2B5E] bg-[#F2F2EE] placeholder:text-[#9CA3AF] pr-14"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#9CA3AF] hover:text-[#6B7280] font-mono-data"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-[#D4D4CC] rounded-sm text-sm focus:outline-none focus:border-[#1A2B5E] bg-[#F2F2EE] placeholder:text-[#9CA3AF]"
                required
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">{error}</p>
          )}

          {info && (
            <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-sm px-3 py-2">{info}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#1A2B5E] text-white text-sm font-semibold rounded-sm hover:bg-[#243d80] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-display"
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="px-5 pb-5 border-t border-[#D4D4CC] pt-4">
          <p className="text-[10px] text-[#9CA3AF] text-center font-mono-data">
            {mode === "login"
              ? "New here? Click Sign Up to create an account."
              : "Already have an account? Click Sign In."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Home / Dashboard
   ============================================================ */
function Home({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const now = new Date();

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative bg-[#1A2B5E] px-6 py-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-white/30"
              style={{
                left: `${(i % 4) * 25}%`,
                top: `${Math.floor(i / 4) * 50}%`,
                width: "25%",
                height: "50%",
              }}
            />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="font-mono-data text-xs text-[#F4A12A] tracking-widest uppercase mb-2">Campus Intelligence Platform</p>
              <h1 className="font-display text-4xl font-black text-white leading-tight">
                TeresaNav<br />
                <span className="text-[#F4A12A]">AI</span>
              </h1>
              <p className="text-[#93A6D4] text-sm mt-3 max-w-md leading-relaxed">
                Navigate classrooms, check room availability, view your FYUGP timetable, and get instant answers — all in one place.
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono-data text-xs text-[#93A6D4]">
                {now.toLocaleDateString("en-IN", { weekday: "long" })}
              </p>
              <p className="font-mono-data text-3xl font-bold text-white">
                {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="font-mono-data text-xs text-[#93A6D4] mt-1">
                {now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { label: "Find a Room", tab: "map" as Tab, desc: "Campus navigation" },
              { label: "View Timetable", tab: "timetable" as Tab, desc: "FYUGP schedule" },
              { label: "Room Availability", tab: "rooms" as Tab, desc: "Live occupancy" },
            ].map(action => (
              <button
                key={action.tab}
                onClick={() => onNavigate(action.tab)}
                className="flex flex-col items-start px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-sm transition-all text-left"
              >
                <span className="text-sm font-semibold text-white font-display">{action.label}</span>
                <span className="text-xs text-[#93A6D4] font-mono-data">{action.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display text-lg font-bold text-[#0F1623]">Campus Blocks</h2>
          <div className="flex-1 h-px bg-[#D4D4CC]" />
          <button onClick={() => onNavigate("map")} className="text-xs text-[#1A2B5E] hover:underline font-semibold">View Map →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 items-stretch">
          {BLOCKS.map(b => (
            <button
              key={b.id}
              onClick={() => onNavigate("map")}
              className="text-left bg-white border border-[#D4D4CC] rounded-sm p-4 hover:border-[#1A2B5E] hover:shadow-sm transition-all group flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-9 h-9 rounded flex items-center justify-center text-base font-black font-display text-white flex-shrink-0"
                  style={{ backgroundColor: b.color }}
                >
                  {b.id}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0F1623] font-display truncate">{b.name}</p>
                  <p className="text-xs text-[#6B7280]">{b.floors}F · {b.rooms.length} rooms</p>
                </div>
              </div>

              <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed flex-1">
                {b.description}
              </p>

              <div className="flex flex-wrap gap-1 mt-3 min-h-[2.25rem] content-start">
                {b.departments.slice(0, 3).map(d => (
                  <span key={d} className="text-[10px] px-1.5 py-0.5 bg-[#F2F2EE] text-[#6B7280] rounded-sm whitespace-nowrap">
                    {d}
                  </span>
                ))}
                {b.departments.length > 3 && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#F2F2EE] text-[#6B7280] rounded-sm whitespace-nowrap">
                    +{b.departments.length - 3}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display text-lg font-bold text-[#0F1623]">FYUGP Course Structure</h2>
          <div className="flex-1 h-px bg-[#D4D4CC]" />
          <button onClick={() => onNavigate("timetable")} className="text-xs text-[#1A2B5E] hover:underline font-semibold">View Timetable →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { type: "Major", desc: "Core discipline papers", color: "#1A2B5E", bg: "#E8EDF5" },
            { type: "Minor", desc: "Secondary discipline", color: "#6B46C1", bg: "#EDE8F5" },
            { type: "MDC", desc: "Multidisciplinary Course", color: "#92400E", bg: "#FEF3C7" },
            { type: "AEC", desc: "Ability Enhancement", color: "#065F46", bg: "#D1FAE5" },
            { type: "SEC", desc: "Skill Enhancement", color: "#831843", bg: "#FCE7F3" },
            { type: "VAC", desc: "Value Added Course", color: "#374151", bg: "#F3F4F6" },
          ].map(c => (
            <div key={c.type} className="rounded-sm p-3 border" style={{ backgroundColor: c.bg, borderColor: c.color + "40" }}>
              <p className="font-mono-data text-sm font-bold" style={{ color: c.color }}>{c.type}</p>
              <p className="text-xs text-[#6B7280] mt-1 leading-snug">{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-white border border-[#D4D4CC] rounded-sm">
          <p className="text-sm font-semibold text-[#0F1623] mb-1">Four Year Undergraduate Programme (FYUGP) — NEP 2020</p>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Multiple exit options: <strong>Certificate</strong> after Semester 2 · <strong>Diploma</strong> after Semester 4 · <strong>Degree</strong> after Semester 6 · <strong>Honours Degree</strong> after Semester 8.
            Total credits: 160 for Honours. Course types include Major, Minor, MDC, AEC, SEC, and VAC as per UGC guidelines.
          </p>
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display text-lg font-bold text-[#0F1623]">Today's Classes</h2>
          <div className="flex-1 h-px bg-[#D4D4CC]" />
          <button onClick={() => onNavigate("timetable")} className="text-xs text-[#1A2B5E] hover:underline font-semibold">Full Schedule →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#1A2B5E] text-white">
                {["Period", "Time", "Subject", "Type", "Room", "Faculty", "Section"].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-xs font-mono-data font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMETABLE_SLOTS.filter(s => s.day === "Monday").slice(0, 8).map((slot, i) => {
                const subject = SUBJECTS.find(s => s.id === slot.subjectId);
                if (!subject) return null;
                const typeColors: Record<string, string> = {
                  Major: "#1A2B5E", Minor: "#6B46C1", MDC: "#92400E", AEC: "#065F46", SEC: "#831843", VAC: "#374151"
                };
                return (
                  <tr key={slot.id} className={i % 2 === 0 ? "bg-white" : "bg-[#F2F2EE]"}>
                    <td className="px-3 py-2 font-mono-data text-xs font-semibold text-[#1A2B5E]">P{slot.period}</td>
                    <td className="px-3 py-2 font-mono-data text-xs text-[#6B7280] whitespace-nowrap">{slot.startTime}–{slot.endTime}</td>
                    <td className="px-3 py-2 text-xs font-medium text-[#0F1623]">{subject.name}</td>
                    <td className="px-3 py-2">
                      <span className="text-[10px] font-mono-data font-semibold px-1.5 py-0.5 rounded-sm text-white" style={{ backgroundColor: typeColors[subject.type] }}>
                        {subject.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono-data text-xs text-[#F4A12A] font-semibold">{slot.roomId}</td>
                    <td className="px-3 py-2 text-xs text-[#6B7280]">{subject.faculty}</td>
                    <td className="px-3 py-2 font-mono-data text-xs text-[#6B7280]">{slot.section}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Main App
   ============================================================ */
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [showChat, setShowChat] = useState(false);

  const isAdmin = user?.role === "admin";

  function handleSignOut() {
    localStorage.removeItem("teresanav_token");
    setUser(null);
  }

  return (
    <div className="h-full flex flex-col bg-[#F2F2EE]">
      <header className="bg-[#0F1623] border-b border-white/10 flex-shrink-0">
        <div className="flex items-center px-4 h-12 gap-1">
          <div className="flex items-center gap-2 mr-4 flex-shrink-0">
            <div className="w-7 h-7 bg-[#F4A12A] rounded-sm flex items-center justify-center">
              <span className="font-display font-black text-[#0F1623] text-xs">TN</span>
            </div>
            <span className="font-display font-bold text-white text-sm hidden sm:inline">TeresaNav</span>
          </div>

          <nav className="flex gap-0.5 flex-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: activeTab === item.id ? "#F4A12A" : "transparent",
                  color: activeTab === item.id ? "#0F1623" : "rgba(255,255,255,0.6)",
                }}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.short}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {user ? (
              <>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm"
                  style={{ backgroundColor: ROLE_BADGE[user.role].bg }}>
                  <span className="text-[10px] font-semibold hidden sm:inline" style={{ color: ROLE_BADGE[user.role].text }}>{user.name}</span>
                  <span className="text-[10px] font-mono-data font-bold" style={{ color: ROLE_BADGE[user.role].text }}>{ROLE_BADGE[user.role].label}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-[10px] text-white/40 hover:text-white/80 transition-colors font-mono-data px-1"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-xs px-3 py-1.5 bg-[#F4A12A] text-[#0F1623] font-semibold rounded-sm hover:bg-[#e8941f] transition-colors font-display"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {activeTab === "home" && <Home onNavigate={setActiveTab} />}
        {activeTab === "map" && <CampusMap />}
        {activeTab === "timetable" && <Timetable isAdmin={isAdmin} />}
        {activeTab === "rooms" && <RoomStatus isAdmin={isAdmin} />}
      </main>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={setUser} />
      )}

      {/* Floating chatbot button */}
      <button
        onClick={() => setShowChat(s => !s)}
        aria-label="Open TeresaBot"
        className="fixed bottom-6 right-6 z-40 w-28 h-28 hover:scale-110 transition-transform flex items-center justify-center"
      >
        <img
          src="/images/chatbot-icon.png"
          alt="TeresaBot"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </button>

      {/* Chatbot drawer */}
      {showChat && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setShowChat(false)}
          />
          <div className="fixed bottom-28 right-6 z-50 w-[500px] max-w-[calc(100vw-3rem)] h-[680px] max-h-[calc(100vh-8rem)] bg-white border border-[#D4D4CC] shadow-2xl rounded-sm overflow-hidden flex flex-col">
            <Chatbot onClose={() => setShowChat(false)} />
          </div>
        </>
      )}
    </div>
  );
}