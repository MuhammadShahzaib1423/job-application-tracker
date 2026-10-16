import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  CalendarCheck,
  Inbox,
  Percent,
  Send,
  Trophy,
} from "lucide-react";

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = from + (target - from) * eased;
      setValue(current);
      fromRef.current = current;
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

function StatCard({ icon: Icon, label, value, suffix = "", accent, index }) {
  const animated = useCountUp(value);
  const display =
    suffix === "%"
      ? `${Math.round(animated)}%`
      : `${Math.round(animated)}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" strokeWidth={2.1} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="text-2xl font-extrabold tabular-nums tracking-tight text-slate-900">
          {display}
        </p>
      </div>
    </motion.div>
  );
}

export default function StatsRow({ stats }) {
  const cards = [
    { icon: Inbox, label: "Total", value: stats.total, accent: "bg-slate-100 text-slate-600" },
    { icon: Send, label: "Applied", value: stats.applied, accent: "bg-blue-50 text-blue-600" },
    { icon: CalendarCheck, label: "Interviews", value: stats.interviews, accent: "bg-amber-50 text-amber-600" },
    { icon: Trophy, label: "Offers", value: stats.offers, accent: "bg-emerald-50 text-emerald-600" },
    { icon: Archive, label: "Rejected", value: stats.rejected, accent: "bg-rose-50 text-rose-500" },
    { icon: Percent, label: "Response rate", value: stats.responseRate, suffix: "%", accent: "bg-emerald-600/10 text-emerald-700" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((c, i) => (
        <StatCard key={c.label} {...c} index={i} />
      ))}
    </div>
  );
}
