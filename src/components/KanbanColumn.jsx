import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import ApplicationCard from "./ApplicationCard";

export default function KanbanColumn({ status, apps, isOver, onOpen }) {
  const { setNodeRef } = useDroppable({ id: status.id });

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex w-72 shrink-0 snap-start flex-col rounded-2xl border p-3 transition-colors sm:w-80 ${
        isOver
          ? "border-emerald-400 bg-emerald-50/60"
          : `border-slate-200/80 ${status.columnBg}`
      }`}
    >
      <header className="flex items-center justify-between px-1 pb-3 pt-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
          <h2 className={`text-[13px] font-bold tracking-tight ${status.headerText}`}>
            {status.label}
          </h2>
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold tabular-nums text-slate-500 shadow-sm ring-1 ring-slate-200/70">
          {apps.length}
        </span>
      </header>

      <div ref={setNodeRef} className="flex min-h-[120px] flex-1 flex-col gap-2.5">
        <SortableContext items={apps.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {apps.map((app) => (
            <ApplicationCard key={app.id} app={app} onOpen={onOpen} />
          ))}
        </SortableContext>

        {apps.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300/80 bg-white/40 px-4 py-10 text-center">
            <MousePointerClick className="h-5 w-5 text-slate-300" />
            <p className="text-xs font-medium text-slate-400">
              {isOver ? "Drop to move here" : "No applications yet"}
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
