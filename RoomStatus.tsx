import { useState, useEffect } from "react";
import { BLOCKS, TIMETABLE_SLOTS, SUBJECTS, PERIODS } from "../data/campusData";
import type { Room, RoomType } from "../data/campusData";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getCurrentDayAndPeriod() {
  const now = new Date();
  const day = DAYS_OF_WEEK[now.getDay()];
  const h = now.getHours();
  const m = now.getMinutes();
  const totalMin = h * 60 + m;

  const periodTimes = [
    { period: 1, start: 8 * 60, end: 8 * 60 + 50 },
    { period: 2, start: 8 * 60 + 50, end: 9 * 60 + 40 },
    { period: 3, start: 9 * 60 + 40, end: 10 * 60 + 30 },
    { period: 4, start: 10 * 60 + 45, end: 11 * 60 + 35 },
    { period: 5, start: 11 * 60 + 35, end: 12 * 60 + 25 },
    { period: 6, start: 12 * 60 + 25, end: 13 * 60 + 15 },
    { period: 7, start: 14 * 60, end: 14 * 60 + 50 },
    { period: 8, start: 14 * 60 + 50, end: 15 * 60 + 40 },
  ];

  const current = periodTimes.find(p => totalMin >= p.start && totalMin < p.end);
  return { day, period: current?.period ?? null };
}

function getRoomOccupancy(roomId: string, day: string, period: number | null) {
  if (!period) return null;
  const slot = TIMETABLE_SLOTS.find(s => s.roomId === roomId && s.day === day && s.period === period);
  if (!slot) return null;
  const subject = SUBJECTS.find(s => s.id === slot.subjectId);
  return { slot, subject };
}

function RoomStatusCard({ room, day, period }: { room: Room; day: string; period: number | null }) {
  const occupancy = getRoomOccupancy(room.id, day, period);
  const isOccupied = !!occupancy;
  const isWeekend = day === "Saturday" || day === "Sunday";
  const isOutsideHours = !period;

  let status: "free" | "occupied" | "weekend" | "closed";
  if (isWeekend || isOutsideHours) status = "closed";
  else if (isOccupied) status = "occupied";
  else status = "free";

  const statusStyles = {
    free: { dot: "#38A169", bg: "#F0FFF4", border: "#9AE6B4", label: "Free" },
    occupied: { dot: "#E53E3E", bg: "#FFF5F5", border: "#FC8181", label: "Occupied" },
    weekend: { dot: "#9CA3AF", bg: "#F9FAFB", border: "#E5E7EB", label: "Closed" },
    closed: { dot: "#9CA3AF", bg: "#F9FAFB", border: "#E5E7EB", label: "Outside Hours" },
  };

  const style = statusStyles[status];

  return (
    <div
      className="p-3 rounded-sm border transition-all hover:shadow-sm"
      style={{ backgroundColor: style.bg, borderColor: style.border }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <span className="font-mono-data text-xs font-bold text-[#F4A12A]">{room.id}</span>
          <p className="text-sm font-semibold text-[#0F1623] leading-tight mt-0.5 truncate">{room.name}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: style.dot }} />
          <span className="text-xs font-mono-data font-semibold" style={{ color: style.dot }}>{style.label}</span>
        </div>
      </div>

      {status === "occupied" && occupancy && (
        <div className="text-xs text-[#6B7280] space-y-0.5 mt-2 pt-2 border-t border-[#FC8181]/30">
          <p className="font-medium text-[#0F1623]">{occupancy.subject?.name}</p>
          <p>Faculty: {occupancy.subject?.faculty}</p>
          <p className="font-mono-data">{occupancy.slot.section !== "ALL" ? `Sec ${occupancy.slot.section}` : "All Sections"}</p>
        </div>
      )}

      {status === "free" && (
        <p className="text-xs text-[#38A169] mt-1">Available · Cap {room.capacity}</p>
      )}

      {status === "closed" && (
        <p className="text-xs text-[#9CA3AF] mt-1">Cap {room.capacity}</p>
      )}
    </div>
  );
}

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  classroom: "Classrooms",
  lab: "Laboratories",
  office: "Offices",
  auditorium: "Auditoriums",
  canteen: "Canteen",
  library: "Library",
};

export default function RoomStatus() {
  const [simDay, setSimDay] = useState<string>(() => {
    const { day } = getCurrentDayAndPeriod();
    return ["Saturday", "Sunday"].includes(day) ? "Monday" : day;
  });
  const [simPeriod, setSimPeriod] = useState<number | null>(() => getCurrentDayAndPeriod().period);
  const [selectedBlock, setSelectedBlock] = useState<string | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "free" | "occupied">("all");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const allRooms: Room[] = BLOCKS.flatMap(b => b.rooms);
  const filteredRooms = allRooms.filter(r => {
    if (selectedBlock !== "all" && r.block !== selectedBlock) return false;
    if (filterStatus !== "all") {
      const occ = getRoomOccupancy(r.id, simDay, simPeriod);
      if (filterStatus === "free" && occ) return false;
      if (filterStatus === "occupied" && !occ) return false;
    }
    return true;
  });

  const freeCount = allRooms.filter(r => !getRoomOccupancy(r.id, simDay, simPeriod)).length;
  const occupiedCount = allRooms.filter(r => !!getRoomOccupancy(r.id, simDay, simPeriod)).length;

  const byType = Object.entries(ROOM_TYPE_LABELS).map(([type, label]) => {
    const rooms = filteredRooms.filter(r => r.type === type);
    return { type: type as RoomType, label, rooms };
  }).filter(g => g.rooms.length > 0);

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-[#D4D4CC] bg-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F1623]">Room Status</h1>
            <p className="text-sm text-[#6B7280] mt-0.5">Live occupancy across all campus blocks</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="font-mono-data text-2xl font-bold text-[#38A169]">{freeCount}</p>
              <p className="text-xs text-[#6B7280]">Free</p>
            </div>
            <div className="w-px bg-[#D4D4CC]" />
            <div className="text-center">
              <p className="font-mono-data text-2xl font-bold text-[#E53E3E]">{occupiedCount}</p>
              <p className="text-xs text-[#6B7280]">Occupied</p>
            </div>
            <div className="w-px bg-[#D4D4CC]" />
            <div className="text-center">
              <p className="font-mono-data text-2xl font-bold text-[#1A2B5E]">{allRooms.length}</p>
              <p className="text-xs text-[#6B7280]">Total</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Day</label>
            <div className="flex gap-1 flex-wrap">
              {weekdays.map(d => (
                <button
                  key={d}
                  onClick={() => setSimDay(d)}
                  className="text-xs px-2.5 py-1.5 rounded-sm border transition-colors"
                  style={{
                    backgroundColor: simDay === d ? "#1A2B5E" : "white",
                    borderColor: simDay === d ? "#1A2B5E" : "#D4D4CC",
                    color: simDay === d ? "white" : "#6B7280",
                  }}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Period</label>
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setSimPeriod(null)}
                className="text-xs px-2.5 py-1.5 rounded-sm border transition-colors"
                style={{
                  backgroundColor: !simPeriod ? "#1A2B5E" : "white",
                  borderColor: !simPeriod ? "#1A2B5E" : "#D4D4CC",
                  color: !simPeriod ? "white" : "#6B7280",
                }}
              >
                —
              </button>
              {[1,2,3,4,5,6,7,8].map(p => (
                <button
                  key={p}
                  onClick={() => setSimPeriod(p)}
                  className="w-8 h-7 text-xs rounded-sm border transition-colors font-mono-data"
                  style={{
                    backgroundColor: simPeriod === p ? "#F4A12A" : "white",
                    borderColor: simPeriod === p ? "#F4A12A" : "#D4D4CC",
                    color: simPeriod === p ? "#0F1623" : "#6B7280",
                    fontWeight: simPeriod === p ? 700 : 400,
                  }}
                >
                  P{p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Block</label>
            <div className="flex gap-1">
              {["all", "A", "B", "C", "D", "E"].map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBlock(b as string)}
                  className="text-xs px-2.5 py-1.5 rounded-sm border transition-colors font-mono-data"
                  style={{
                    backgroundColor: selectedBlock === b ? "#1A2B5E" : "white",
                    borderColor: selectedBlock === b ? "#1A2B5E" : "#D4D4CC",
                    color: selectedBlock === b ? "white" : "#6B7280",
                    fontWeight: 600,
                  }}
                >
                  {b === "all" ? "All" : b}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Status</label>
            <div className="flex gap-1">
              {(["all", "free", "occupied"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className="text-xs px-3 py-1.5 rounded-sm border transition-colors capitalize"
                  style={{
                    backgroundColor: filterStatus === s ? (s === "free" ? "#38A169" : s === "occupied" ? "#E53E3E" : "#1A2B5E") : "white",
                    borderColor: filterStatus === s ? (s === "free" ? "#38A169" : s === "occupied" ? "#E53E3E" : "#1A2B5E") : "#D4D4CC",
                    color: filterStatus === s ? "white" : "#6B7280",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {simPeriod && (
          <p className="text-xs text-[#6B7280] mt-3 font-mono-data">
            Showing: {simDay} · Period {simPeriod} ·{" "}
            {PERIODS.find(p => p.period === simPeriod)?.start}–{PERIODS.find(p => p.period === simPeriod)?.end}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {byType.map(({ type, label, rooms }) => (
          <div key={type}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-display text-base font-bold text-[#0F1623]">{label}</h2>
              <div className="flex-1 h-px bg-[#D4D4CC]" />
              <span className="font-mono-data text-xs text-[#6B7280]">{rooms.length} rooms</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {rooms.map(room => (
                <RoomStatusCard key={room.id} room={room} day={simDay} period={simPeriod} />
              ))}
            </div>
          </div>
        ))}

        {filteredRooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[#6B7280]">No rooms match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}