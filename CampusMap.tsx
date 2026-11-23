import { useState } from "react";
import { BLOCKS } from "../data/campusData";
import type { Room, RoomType } from "../data/campusData";

const ROOM_TYPE_COLOR: Record<RoomType, string> = {
  classroom: "#1A2B5E",
  lab: "#6B46C1",
  office: "#2D6A4F",
  auditorium: "#C05621",
  canteen: "#B7791F",
  library: "#0E7490",
};

const BLOCK_GRID_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  A: { bg: "#E8EDF5", border: "#1A2B5E", text: "#1A2B5E" },
  B: { bg: "#E8F0EC", border: "#2D6A4F", text: "#2D6A4F" },
  C: { bg: "#EDE8F5", border: "#6B46C1", text: "#6B46C1" },
  D: { bg: "#F5EDE8", border: "#C05621", text: "#C05621" },
  E: { bg: "#F5F0E8", border: "#B7791F", text: "#B7791F" },
};

function RoomCard({ room, onClick }: { room: Room; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left w-full p-3 border border-[#D4D4CC] bg-white hover:border-[#1A2B5E] hover:bg-[#E8EDF5] transition-colors rounded-sm group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-data text-xs font-semibold text-[#F4A12A]">{room.id}</span>
            <span
              className="text-[10px] font-mono-data px-1.5 py-0.5 rounded-sm text-white"
              style={{ backgroundColor: ROOM_TYPE_COLOR[room.type] }}
            >
              {room.type}
            </span>
          </div>
          <p className="text-sm font-medium text-[#0F1623] leading-tight truncate">{room.name}</p>
          <p className="text-xs text-[#6B7280] mt-0.5">Floor {room.floor} · Cap. {room.capacity}</p>
        </div>
      </div>
      {room.features.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {room.features.slice(0, 3).map(f => (
            <span key={f} className="text-[10px] px-1.5 py-0.5 bg-[#F2F2EE] border border-[#D4D4CC] text-[#6B7280] rounded-sm">{f}</span>
          ))}
          {room.features.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 bg-[#F2F2EE] border border-[#D4D4CC] text-[#6B7280] rounded-sm">+{room.features.length - 3}</span>
          )}
        </div>
      )}
    </button>
  );
}

export default function CampusMap() {
  const [selectedBlock, setSelectedBlock] = useState<string | null>("A");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filterType, setFilterType] = useState<RoomType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const block = BLOCKS.find(b => b.id === selectedBlock) ?? null;

  const filteredRooms = (block?.rooms ?? []).filter(r => {
    const matchType = filterType === "all" || r.type === filterType;
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const roomTypes: (RoomType | "all")[] = ["all", "classroom", "lab", "office", "auditorium", "canteen", "library"];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-[#D4D4CC] bg-white">
        <h1 className="font-display text-2xl font-bold text-[#0F1623]">Campus Map</h1>
        <p className="text-sm text-[#6B7280] mt-0.5">Navigate blocks, rooms, and facilities</p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Block list only (SVG removed) */}
        <div className="w-full lg:w-80 border-r border-[#D4D4CC] bg-white flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {BLOCKS.map(b => {
              const colors = BLOCK_GRID_COLORS[b.id];
              return (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBlock(b.id); setSelectedRoom(null); }}
                  className="w-full text-left px-4 py-3 border-b border-[#D4D4CC] flex items-center gap-3 transition-colors hover:bg-[#F2F2EE]"
                  style={{ backgroundColor: selectedBlock === b.id ? colors.bg : undefined, borderLeft: selectedBlock === b.id ? `3px solid ${colors.border}` : "3px solid transparent" }}
                >
                  <div className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold font-display text-white flex-shrink-0" style={{ backgroundColor: colors.border }}>
                    {b.id}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0F1623] leading-tight">{b.name}</p>
                  </div>
                  <span className="ml-auto text-xs font-mono-data text-[#6B7280] flex-shrink-0">{b.rooms.length}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Block detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {block ? (
            <>
              <div className="px-6 py-4 border-b border-[#D4D4CC]" style={{ backgroundColor: BLOCK_GRID_COLORS[block.id].bg }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold" style={{ color: BLOCK_GRID_COLORS[block.id].text }}>{block.fullName}</h2>
                    <p className="text-sm text-[#6B7280] mt-1 max-w-lg">{block.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-display text-3xl font-black" style={{ color: BLOCK_GRID_COLORS[block.id].text }}>{block.id}</span>
                    <p className="text-xs text-[#6B7280]">{block.floors} floors</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {block.departments.map(d => (
                    <span key={d} className="text-xs px-2 py-1 bg-white border border-[#D4D4CC] text-[#0F1623] rounded-sm">{d}</span>
                  ))}
                </div>
              </div>

              <div className="px-6 py-3 border-b border-[#D4D4CC] bg-white flex flex-wrap gap-3 items-center">
                <input
                  type="search"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-40 text-sm px-3 py-1.5 border border-[#D4D4CC] rounded-sm focus:outline-none focus:border-[#1A2B5E] bg-[#F2F2EE] font-mono-data"
                />
                <div className="flex gap-1 flex-wrap">
                  {roomTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className="text-xs px-2.5 py-1 rounded-sm border transition-colors capitalize"
                      style={{
                        backgroundColor: filterType === t ? "#1A2B5E" : "#FFFFFF",
                        borderColor: filterType === t ? "#1A2B5E" : "#D4D4CC",
                        color: filterType === t ? "#FFFFFF" : "#6B7280",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {filteredRooms.length === 0 ? (
                  <p className="text-sm text-[#6B7280] text-center py-8">No rooms match your filter.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredRooms.map(room => (
                      <RoomCard key={room.id} room={room} onClick={() => setSelectedRoom(room)} />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#6B7280]">
              <p>Select a block from the map</p>
            </div>
          )}
        </div>
      </div>

      {/* Room modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedRoom(null)}>
          <div className="bg-white rounded-sm border border-[#D4D4CC] shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono-data text-sm font-semibold text-[#F4A12A]">{selectedRoom.id}</span>
                <h3 className="font-display text-xl font-bold text-[#0F1623] mt-0.5">{selectedRoom.name}</h3>
              </div>
              <button onClick={() => setSelectedRoom(null)} className="text-[#6B7280] hover:text-[#0F1623] text-xl leading-none">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Block", value: `Block ${selectedRoom.block}` },
                { label: "Floor", value: `Floor ${selectedRoom.floor}` },
                { label: "Type", value: selectedRoom.type },
                { label: "Capacity", value: `${selectedRoom.capacity} persons` },
              ].map(item => (
                <div key={item.label} className="bg-[#F2F2EE] p-3 rounded-sm">
                  <p className="text-xs text-[#6B7280] mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-[#0F1623] capitalize">{item.value}</p>
                </div>
              ))}
            </div>
            {selectedRoom.features.length > 0 && (
              <div>
                <p className="text-xs text-[#6B7280] mb-2 uppercase tracking-wider font-semibold">Facilities</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoom.features.map(f => (
                    <span key={f} className="text-xs px-2 py-1 bg-[#E8EDF5] border border-[#1A2B5E]/20 text-[#1A2B5E] rounded-sm">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}