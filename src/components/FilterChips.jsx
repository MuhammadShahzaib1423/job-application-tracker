import { motion } from "framer-motion";
import { STATUSES } from "../lib/data";

export default function FilterChips({ active, onChange }) {
  const options = [{ id: "all", label: "All" }, ...STATUSES];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((opt) => {
        const isActive = active === opt.id;
        return (
          <motion.button
            key={opt.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt.id)}
            className={`relative rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
              isActive
                ? "text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="chip-bg"
                className="absolute inset-0 rounded-full bg-slate-900"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {opt.dot && <span className={`h-2 w-2 rounded-full ${opt.dot}`} />}
              {opt.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
