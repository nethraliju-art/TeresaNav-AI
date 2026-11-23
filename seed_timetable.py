"""
Seeds backend/timetable.json from src/data/campusData.ts

Run ONCE:
    cd backend
    .\\venv\\Scripts\\Activate.ps1
    python seed_timetable.py
"""

import os
import re
import json

BASE_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.dirname(BASE_DIR)
CAMPUS_DATA_FILE = os.path.join(PROJECT_ROOT, "src", "data", "campusData.tsx")
OUTPUT_FILE = os.path.join(BASE_DIR, "timetable.json")


def extract_timetable_slots(ts_text: str) -> list[dict]:
    """Find the TIMETABLE_SLOTS array and parse each object literal."""
    match = re.search(
        r"export\s+const\s+TIMETABLE_SLOTS\s*(?::\s*TimetableSlot\[\])?\s*=\s*\[(.*?)\n\];",
        ts_text,
        re.DOTALL,
    )
    if not match:
        raise RuntimeError(
            "Could not find TIMETABLE_SLOTS in campusData.ts. "
            "Check that the file contains:\n"
            "  export const TIMETABLE_SLOTS: TimetableSlot[] = [ ... ];"
        )

    body = match.group(1)
    object_pattern = re.compile(r"\{([^{}]*)\}", re.DOTALL)
    slots: list[dict] = []

    for obj_match in object_pattern.finditer(body):
        obj_body = obj_match.group(1)
        obj: dict = {}

        pair_pattern = re.compile(
            r'(\w+)\s*:\s*(?:"([^"]*)"|\'([^\']*)\'|(-?[\d.]+)|(true|false))'
        )
        for pair in pair_pattern.finditer(obj_body):
            key = pair.group(1)
            if pair.group(2) is not None:
                value = pair.group(2)
            elif pair.group(3) is not None:
                value = pair.group(3)
            elif pair.group(4) is not None:
                value = float(pair.group(4)) if "." in pair.group(4) else int(pair.group(4))
            elif pair.group(5) is not None:
                value = pair.group(5) == "true"
            else:
                continue
            obj[key] = value

        if {"id", "day", "period"}.issubset(obj.keys()):
            slots.append(obj)

    return slots


def main():
    print(f"📖 Reading {CAMPUS_DATA_FILE}")
    if not os.path.exists(CAMPUS_DATA_FILE):
        raise FileNotFoundError(
            f"Could not find campusData.ts at {CAMPUS_DATA_FILE}\n"
            f"Check that your project structure is correct."
        )

    with open(CAMPUS_DATA_FILE, "r", encoding="utf-8") as f:
        ts_text = f.read()

    print("🔍 Extracting TIMETABLE_SLOTS…")
    slots = extract_timetable_slots(ts_text)

    if not slots:
        print("⚠  No slots found — check your campusData.ts structure.")
        return

    print(f"✓ Found {len(slots)} slots")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(slots, f, indent=2, ensure_ascii=False)

    print(f"✓ Wrote {OUTPUT_FILE}")
    print(f"\n  Total slots: {len(slots)}")
    print("  Sample:")
    for s in slots[:3]:
        print(f"    {s}")


if __name__ == "__main__":
    main()