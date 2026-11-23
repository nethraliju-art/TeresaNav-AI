import { useState, useEffect, Fragment } from "react";
import { SUBJECTS, PERIODS_BY_DAY, DAYS, BLOCKS } from "../data/campusData";
import type { TimetableSlot, SubjectType } from "../data/campusData";

const TYPE_COLORS: Record<SubjectType, { bg: string; text: string; border: string }> = {
  Major:  { bg: "#E8EDF5", text: "#1A2B5E", border: "#1A2B5E" },
  Minor:  { bg: "#EDE8F5", text: "#6B46C1", border: "#6B46C1" },
  MDC:    { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  AEC:    { bg: "#D1FAE5", text: "#065F46", border: "#10B981" },
  SEC:    { bg: "#FCE7F3", text: "#831843", border: "#EC4899" },
  VAC:    { bg: "#F3F4F6", text: "#374151", border: "#9CA3AF" },
};

const PROGRAMMES = ["BSc CA", "BVoc SWD"];
const YEARS = [1, 2, 3];
const API_URL = "http://localhost:5000/api/timetable";

function getRoom(roomId: string) {
  for (const block of BLOCKS) {
    const room = block.rooms.find(r => r.id === roomId);
    if (room) return room;
  }
  return null;
}

function SlotCell({
  slot,
  isAdmin,
  editMode,
  onClick,
}: {
  slot: TimetableSlot | undefined;
  isAdmin: boolean;
  editMode: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);

  if (!slot) {
    return (
      <td
        className={`border border-[#D4D4CC] p-1 bg-[#F2F2EE] min-w-32 ${
          isAdmin && editMode ? "cursor-pointer hover:bg-[#E8EDF5]" : ""
        }`}
        onClick={isAdmin && editMode ? onClick : undefined}
      >
        {isAdmin && editMode && (
          <span className="text-[10px] text-[#9CA3AF] font-mono-data">+ add</span>
        )}
      </td>
    );
  }

  const subject = SUBJECTS.find(s => s.id === slot.subjectId);
  const colors = subject ? TYPE_COLORS[subject.type] : TYPE_COLORS.VAC;
  const room = getRoom(slot.roomId);

  return (
    <td
      className={`border border-[#D4D4CC] p-1 min-w-32 relative transition-all ${
        isAdmin && editMode ? "cursor-pointer hover:opacity-90" : "cursor-pointer"
      }`}
      style={{ backgroundColor: colors.bg }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={isAdmin && editMode ? onClick : undefined}
    >
      <div className="relative">
        <div className="flex items-center gap-1 mb-0.5">
          {subject && (
            <span
              className="text-[9px] font-mono-data font-semibold px-1 rounded-sm text-white flex-shrink-0"
              style={{ backgroundColor: colors.border }}
            >
              {subject.type}
            </span>
          )}
          {slot.batch && (
            <span className="text-[9px] font-mono-data text-[#6B7280]">⚗</span>
          )}
        </div>
        <p className="text-xs font-semibold leading-tight" style={{ color: colors.text }}>
          {subject?.name ?? slot.subjectId}
        </p>
        <p className="text-[10px] font-mono-data text-[#6B7280] mt-0.5">
          {subject?.code ?? "—"}
        </p>
        <p className="text-[10px] text-[#6B7280]">{room?.id ?? slot.roomId}</p>

        {hover && !editMode && subject && (
          <div className="absolute z-20 top-full left-0 mt-1 w-52 bg-white border border-[#1A2B5E] shadow-lg rounded-sm p-3 pointer-events-none">
            <p className="font-semibold text-sm text-[#0F1623] mb-1">{subject.name}</p>
            <div className="space-y-1 text-xs text-[#6B7280]">
              <p>Code: <span className="font-mono-data text-[#0F1623]">{subject.code}</span></p>
              <p>Faculty: {subject.faculty}</p>
              <p>Room: <span className="font-mono-data text-[#0F1623]">{room?.name ?? slot.roomId}</span></p>
              <p>Credits: {subject.credits}</p>
              {slot.batch && <p>Batch: {slot.batch}</p>}
            </div>
          </div>
        )}

        {isAdmin && editMode && hover && (
          <div className="absolute z-20 top-0 right-0 bg-[#F4A12A] text-[#0F1623] text-[9px] font-mono-data font-bold px-1.5 py-0.5 rounded-sm">
            ✎ edit
          </div>
        )}
      </div>
    </td>
  );
}

function EditSlotModal({
  slot,
  day,
  period,
  onClose,
  onSave,
  onDelete,
}: {
  slot: TimetableSlot | undefined;
  day: string;
  period: number;
  onClose: () => void;
  onSave: (updated: TimetableSlot) => void;
  onDelete: () => void;
}) {
  const [subjectId, setSubjectId] = useState(slot?.subjectId ?? SUBJECTS[0].id);
  const [roomId, setRoomId] = useState(slot?.roomId ?? "D103");
  const periodInfo = PERIODS_BY_DAY[day]?.find(p => p.period === period);
  const allRooms = BLOCKS.flatMap(b => b.rooms);

  function handleSave() {
    const updated: TimetableSlot = {
      id: slot?.id ?? `TT-${Date.now()}`,
      day,
      period,
      startTime: periodInfo?.start ?? "1:00",
      endTime: periodInfo?.end ?? "1:55",
      subjectId,
      roomId,
      semester: slot?.semester ?? 1,
      section: slot?.section ?? "A",
      batch: slot?.batch,
    };
    onSave(updated);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-sm border border-[#D4D4CC] shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4D4CC]">
          <div>
            <h3 className="font-display font-bold text-[#0F1623] text-sm">{slot ? "Edit Slot" : "Add Slot"}</h3>
            <p className="text-[10px] font-mono-data text-[#6B7280] mt-0.5">
              {day} · Period {period} · {periodInfo?.start}–{periodInfo?.end}
            </p>
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#0F1623] text-lg leading-none">×</button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Subject</label>
            <select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              className="w-full px-3 py-2 border border-[#D4D4CC] rounded-sm text-sm focus:outline-none focus:border-[#1A2B5E] bg-[#F2F2EE]"
            >
              {SUBJECTS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.programme} · Yr {s.semester} · {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">Room</label>
            <select
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              className="w-full px-3 py-2 border border-[#D4D4CC] rounded-sm text-sm focus:outline-none focus:border-[#1A2B5E] bg-[#F2F2EE]"
            >
              {allRooms.map(r => (
                <option key={r.id} value={r.id}>{r.id} — {r.name} (Block {r.block})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-5 pb-5 flex items-center justify-between gap-2 border-t border-[#D4D4CC] pt-4">
          {slot ? (
            <button
              onClick={onDelete}
              className="text-xs px-3 py-2 rounded-sm border border-red-300 text-red-600 hover:bg-red-50 transition-colors font-semibold"
            >
              Delete Slot
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-xs px-4 py-2 rounded-sm border border-[#D4D4CC] text-[#6B7280] hover:border-[#1A2B5E] hover:text-[#0F1623] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-xs px-4 py-2 rounded-sm bg-[#1A2B5E] text-white font-semibold hover:bg-[#243d80] transition-colors font-display"
            >
              {slot ? "Save Change" : "Add Slot"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Timetable({ isAdmin = false }: { isAdmin?: boolean }) {
  const [programme, setProgramme] = useState("BSc CA");
  const [semester, setSemester] = useState(1);
  const section = "A";
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [editMode, setEditMode] = useState(false);
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingSlot, setEditingSlot] = useState<{
    day: string;
    period: number;
    slot: TimetableSlot | undefined;
  } | null>(null);

  useEffect(() => {
    async function fetchTimetable() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setSlots(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not load timetable from server. Is the backend running?");
        setSlots([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTimetable();
  }, []);

  async function saveSlots(nextSlots: TimetableSlot[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: isAdmin ? "admin" : "user", slots: nextSlots }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSlots(nextSlots);
    } catch (e) {
      setError(`Save failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  const programmeSubjects = SUBJECTS.filter(s => s.programme === programme && s.semester === semester);
  const relevantSlots = slots.filter(s => {
    const subj = SUBJECTS.find(sub => sub.id === s.subjectId);
    return subj && subj.programme === programme && subj.semester === semester && (s.section === section || s.section === "ALL");
  });

  const periodsForDay = PERIODS_BY_DAY[selectedDay] ?? [];

  const getSlot = (period: number) =>
    relevantSlots.find(s => s.day === selectedDay && s.period === period);

  const typeLegend: SubjectType[] = ["Major", "Minor", "MDC", "AEC", "SEC", "VAC"];

  function handleSlotClick(period: number, slot: TimetableSlot | undefined) {
    if (!isAdmin || !editMode) return;
    setEditingSlot({ day: selectedDay, period, slot });
  }

  function handleSaveEdit(updated: TimetableSlot) {
    const exists = slots.some(s => s.id === updated.id);
    const nextSlots = exists
      ? slots.map(s => (s.id === updated.id ? updated : s))
      : [...slots, updated];
    saveSlots(nextSlots);
    setEditingSlot(null);
  }

  function handleDeleteEdit() {
    if (!editingSlot?.slot) return;
    const nextSlots = slots.filter(s => s.id !== editingSlot.slot!.id);
    saveSlots(nextSlots);
    setEditingSlot(null);
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-[#D4D4CC] bg-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F1623]">Timetable</h1>
            
          </div>

          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-[#6B7280] font-mono-data">saving…</span>}
            {isAdmin && (
              <button
                onClick={() => setEditMode(e => !e)}
                className="text-sm px-4 py-2 rounded-sm border transition-colors"
                style={{
                  backgroundColor: editMode ? "#1A2B5E" : "white",
                  borderColor: editMode ? "#1A2B5E" : "#D4D4CC",
                  color: editMode ? "white" : "#0F1623",
                }}
              >
                {editMode ? "✓ Done Editing" : "✎ Edit Timetable"}
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Programme</label>
            <div className="flex gap-1">
              {PROGRAMMES.map(p => (
                <button
                  key={p}
                  onClick={() => { setProgramme(p); setSemester(1); }}
                  className="text-xs px-3 py-1.5 rounded-sm border transition-colors"
                  style={{
                    backgroundColor: programme === p ? "#1A2B5E" : "white",
                    borderColor: programme === p ? "#1A2B5E" : "#D4D4CC",
                    color: programme === p ? "white" : "#6B7280",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Year</label>
            <div className="flex gap-1">
              {YEARS.map(y => (
                <button
                  key={y}
                  onClick={() => setSemester(y)}
                  className="w-9 h-7 text-xs rounded-sm border transition-colors font-mono-data"
                  style={{
                    backgroundColor: semester === y ? "#F4A12A" : "white",
                    borderColor: semester === y ? "#F4A12A" : "#D4D4CC",
                    color: semester === y ? "#0F1623" : "#6B7280",
                    fontWeight: semester === y ? 700 : 400,
                  }}
                >
                  Y{y}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Day</label>
            <div className="flex gap-1 flex-wrap">
              {DAYS.slice(0, 5).map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className="text-xs px-2.5 py-1.5 rounded-sm border transition-colors"
                  style={{
                    backgroundColor: selectedDay === d ? "#1A2B5E" : "white",
                    borderColor: selectedDay === d ? "#1A2B5E" : "#D4D4CC",
                    color: selectedDay === d ? "white" : "#6B7280",
                  }}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {programmeSubjects.length > 0 && (
        <div className="px-6 py-3 bg-[#F2F2EE] border-b border-[#D4D4CC] flex gap-3 flex-wrap items-center">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#6B7280]">This Year:</span>
          {programmeSubjects.map(s => {
            const colors = TYPE_COLORS[s.type];
            return (
              <span
                key={s.id}
                className="text-xs px-2 py-1 border rounded-sm font-medium"
                style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
              >
                {s.name} <span className="font-mono-data opacity-70">·{s.credits}cr</span>
              </span>
            );
          })}
        </div>
      )}

      <div className="px-6 py-2 bg-white border-b border-[#D4D4CC] flex gap-4 items-center flex-wrap">
        <span className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider">Legend:</span>
        {typeLegend.map(t => {
          const colors = TYPE_COLORS[t];
          return (
            <div key={t} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.border }} />
              <span className="text-xs text-[#6B7280]">{t}</span>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="px-6 py-2 bg-red-50 border-b border-red-200 text-xs text-red-700 font-mono-data">
          ⚠ {error}
        </div>
      )}

      {isAdmin && editMode && (
        <div className="px-6 py-2 bg-[#FEF3C7] border-b border-[#F4A12A] text-xs text-[#92400E] font-semibold">
          ✎ Edit mode — click any slot to edit or add
        </div>
      )}

      {/* Grid — single day table */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#6B7280]">
            <p className="text-sm font-mono-data">Loading timetable…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="border-collapse text-sm min-w-full">
              <thead>
                <tr>
                  <th className="border border-[#D4D4CC] bg-[#1A2B5E] text-white p-2 text-left min-w-20 font-mono-data text-xs">
                    Period
                  </th>
                  <th className="border border-[#D4D4CC] bg-[#1A2B5E] text-white p-2 text-left min-w-24 font-mono-data text-xs">
                    Time
                  </th>
                  <th className="border border-[#D4D4CC] bg-[#1A2B5E] text-white p-2 text-center font-display text-xs">
                    {selectedDay.toUpperCase()}
                  </th>
                </tr>
              </thead>
              <tbody>
                {periodsForDay.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="border border-[#D4D4CC] p-6 text-center text-[#6B7280]">
                      No schedule defined for {selectedDay}.
                    </td>
                  </tr>
                ) : (
                  periodsForDay.map(p => {
                    const slot = getSlot(p.period);
                    return (
                      <Fragment key={p.period}>
                        <tr>
                          <td className="border border-[#D4D4CC] bg-[#F2F2EE] p-2 font-mono-data text-xs font-semibold text-[#1A2B5E] text-center">
                            P{p.period}
                          </td>
                          <td className="border border-[#D4D4CC] bg-[#F2F2EE] p-2 font-mono-data text-xs text-[#6B7280] whitespace-nowrap">
                            {p.start}–{p.end}
                          </td>
                          <SlotCell
                            slot={slot}
                            isAdmin={isAdmin}
                            editMode={editMode}
                            onClick={() => handleSlotClick(p.period, slot)}
                          />
                        </tr>
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>

            <p className="text-[10px] text-[#9CA3AF] mt-3 font-mono-data">
              Showing <strong>{selectedDay}</strong> — {programme} · Year {semester} · Section {section}
            </p>
          </div>
        )}
      </div>

      {editingSlot && (
        <EditSlotModal
          slot={editingSlot.slot}
          day={editingSlot.day}
          period={editingSlot.period}
          onClose={() => setEditingSlot(null)}
          onSave={handleSaveEdit}
          onDelete={handleDeleteEdit}
        />
      )}
    </div>
  );
}