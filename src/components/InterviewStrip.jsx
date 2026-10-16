import { motion } from "framer-motion";
import { CalendarClock, Video } from "lucide-react";
import { avatarHue, formatDateTime, initials, relativeDay } from "../lib/utils";

export default function InterviewStrip({ interviews, onOpen }) {
  if (interviews.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-amber-600" />
        <h2 className="text-[13px] font-bold uppercase tracking-wider text-amber-800">
          Upcoming interviews
        </h2>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
          {interviews.length}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {interviews.map((app, i) => (
          <motion.button
            key={app.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.07, duration: 0.35 }}
            whileHover={{ y: -2 }}
            onClick={() => onOpen(app)}
            className="flex w-64 shrink-0 items-center gap-3 rounded-xl border border-amber-200/60 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold text-white"
              style={{ backgroundColor: `hsl(${avatarHue(app.company)}, 42%, 46%)` }}
            >
              {initials(app.company)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-slate-900">{app.company}</p>
              <p className="truncate text-[12px] text-slate-500">{app.role}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11.5px] font-semibold text-amber-700">
                <Video className="h-3.5 w-3.5" />
                {app.interviewDate ? formatDateTime(app.interviewDate) : "Date TBD"}
                {app.interviewDate && (
                  <span className="font-medium text-amber-600">
                    · {relativeDay(app.interviewDate)}
                  </span>
                )}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
