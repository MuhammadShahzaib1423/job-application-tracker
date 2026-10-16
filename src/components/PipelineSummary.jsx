import { motion } from "framer-motion";
import { STATUSES } from "../lib/data";

export default function PipelineSummary({ applications }) {
  const total = applications.length || 1;
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
        Pipeline
      </h2>
      <div className="mt-4 flex flex-1 flex-col justify-center gap-3.5">
        {STATUSES.map((s, i) => {
          const count = applications.filter((a) => a.status === s.id).length;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={s.id}>
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
                <span className="font-bold tabular-nums text-slate-800">{count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full ${s.dot}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
