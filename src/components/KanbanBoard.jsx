import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Banknote, CalendarDays, MapPin } from "lucide-react";
import { STATUSES } from "../lib/data";
import KanbanColumn from "./KanbanColumn";

function DragPreview({ app }) {
  if (!app) return null;
  return (
    <div className="w-72 rotate-2 rounded-xl border border-emerald-300 bg-white p-3.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)] sm:w-80">
      <h3 className="truncate text-[13.5px] font-bold text-slate-900">{app.company}</h3>
      <p className="truncate text-[12.5px] font-medium text-slate-500">{app.role}</p>
      <div className="mt-2 flex items-center gap-3 text-[12px] text-slate-500">
        {app.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {app.location}
          </span>
        )}
        {app.salary && (
          <span className="flex items-center gap-1">
            <Banknote className="h-3.5 w-3.5" /> {app.salary}
          </span>
        )}
        {app.dateApplied && (
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" /> {app.dateApplied}
          </span>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ applications, visibleStatuses, onStatusChange, onOpen }) {
  const [activeId, setActiveId] = useState(null);
  const [overColumnId, setOverColumnId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const activeApp = useMemo(
    () => applications.find((a) => a.id === activeId) || null,
    [applications, activeId]
  );

  const grouped = useMemo(() => {
    const map = {};
    for (const s of STATUSES) map[s.id] = [];
    for (const app of applications) {
      if (map[app.status]) map[app.status].push(app);
    }
    return map;
  }, [applications]);

  const columns = STATUSES.filter((s) => visibleStatuses.includes(s.id));

  const resolveTarget = (overId) => {
    if (!overId) return null;
    if (STATUSES.some((s) => s.id === overId)) return { status: overId, beforeId: null };
    const overApp = applications.find((a) => a.id === overId);
    if (!overApp) return null;
    return { status: overApp.status, beforeId: overApp.id };
  };

  const handleDragOver = ({ over }) => {
    const target = resolveTarget(over?.id);
    setOverColumnId(target ? target.status : null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    setOverColumnId(null);
    if (!over) return;
    const target = resolveTarget(over.id);
    if (!target) return;
    onStatusChange(active.id, target.status, target.beforeId);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverColumnId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:snap-none">
        {columns.map((status) => (
          <KanbanColumn
            key={status.id}
            status={status}
            apps={grouped[status.id]}
            isOver={overColumnId === status.id}
            onOpen={onOpen}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.22,1,0.36,1)" }}>
        <DragPreview app={activeApp} />
      </DragOverlay>
    </DndContext>
  );
}
