import { useRef } from "react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Banknote, CalendarDays, ExternalLink, MapPin, StickyNote } from "lucide-react";
import { statusById } from "../lib/data";
import { avatarHue, formatDate, initials } from "../lib/utils";

export default function ApplicationCard({ app, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: app.id });
  const downPos = useRef(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const openLink = (e) => {
    e.stopPropagation();
    if (app.jobUrl) window.open(app.jobUrl, "_blank", "noopener,noreferrer");
  };

  const handleClick = (e) => {
    // Ignore clicks that were actually drags
    const d = downPos.current;
    if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) return;
    onOpen(app);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-manipulation"
      onPointerDown={(e) => {
        downPos.current = { x: e.clientX, y: e.clientY };
      }}
    >
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3 }}
        onClick={handleClick}
        className="group cursor-grab rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)] active:cursor-grabbing"
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-white"
            style={{ backgroundColor: `hsl(${avatarHue(app.company)}, 42%, 46%)` }}
          >
            {initials(app.company)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[13.5px] font-bold tracking-tight text-slate-900">
              {app.company}
            </h3>
            <p className="truncate text-[12.5px] font-medium text-slate-500">{app.role}</p>
          </div>
          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${statusById(app.status).dot}`} />
        </div>

        <div className="mt-3 space-y-1.5 text-[12px] text-slate-500">
          {app.location && (
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">
                {app.location} · {app.workType}
              </span>
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            {app.salary ? (
              <p className="flex min-w-0 items-center gap-1.5">
                <Banknote className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate font-medium text-slate-600">{app.salary}</span>
              </p>
            ) : (
              <span />
            )}
            {app.dateApplied && (
              <p className="flex shrink-0 items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                {formatDate(app.dateApplied)}
              </p>
            )}
          </div>
        </div>

        {(app.notes || app.jobUrl) && (
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
            {app.notes ? (
              <p className="flex min-w-0 items-center gap-1.5 text-[11.5px] text-slate-400">
                <StickyNote className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{app.notes}</span>
              </p>
            ) : (
              <span />
            )}
            {app.jobUrl && (
              <button
                onClick={openLink}
                aria-label="Open job posting"
                className="shrink-0 rounded-lg p-1.5 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </motion.article>
    </div>
  );
}
