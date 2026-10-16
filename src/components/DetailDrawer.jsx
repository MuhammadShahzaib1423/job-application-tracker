import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Building2,
  CalendarDays,
  Clock,
  ExternalLink,
  MapPin,
  Pencil,
  StickyNote,
  Trash2,
  User,
  X,
} from "lucide-react";
import { statusById } from "../lib/data";
import { avatarHue, formatDate, formatDateTime, initials } from "../lib/utils";

function Row({ icon: Icon, label, value, action }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <div className="mt-0.5 text-[13.5px] font-medium text-slate-800">{value}</div>
      </div>
      {action}
    </div>
  );
}

export default function DetailDrawer({ app, onClose, onEdit, onDelete }) {
  const status = app ? statusById(app.status) : null;

  return (
    <AnimatePresence>
      {app && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white"
                    style={{ backgroundColor: `hsl(${avatarHue(app.company)}, 42%, 46%)` }}
                  >
                    {initials(app.company)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-[18px] font-extrabold tracking-tight text-slate-900">
                      {app.company}
                    </h2>
                    <p className="truncate text-[13.5px] font-medium text-slate-500">{app.role}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close details"
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold ${status.chip}`}>
                  <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-semibold text-slate-600">
                  {app.workType}
                </span>
              </div>
            </div>

            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto px-6">
              <Row icon={Building2} label="Company" value={app.company} />
              <Row icon={MapPin} label="Location" value={app.location} />
              <Row icon={Banknote} label="Salary" value={app.salary} />
              <Row icon={CalendarDays} label="Date applied" value={app.dateApplied ? formatDate(app.dateApplied) : ""} />
              <Row icon={Clock} label="Interview" value={app.interviewDate ? formatDateTime(app.interviewDate) : ""} />
              <Row icon={User} label="Contact" value={app.contact} />
              <Row
                icon={ExternalLink}
                label="Job posting"
                value={
                  app.jobUrl ? (
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      Open posting <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    ""
                  )
                }
              />
              {app.notes && (
                <div className="flex items-start gap-3 py-2.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <StickyNote className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Notes</p>
                    <p className="mt-0.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-slate-700">
                      {app.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <button
                onClick={() => onEdit(app)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => onDelete(app)}
                className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
