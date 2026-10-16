import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, LogOut, Plus, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function UserMenu() {
  const { user, logout } = useAuth();
  const [armed, setArmed] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!user) return null;

  const handleClick = () => {
    if (armed) {
      clearTimeout(timer.current);
      setArmed(false);
      logout().catch((err) => console.error("Logout failed:", err));
    } else {
      setArmed(true);
      timer.current = setTimeout(() => setArmed(false), 3000);
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <span
        title={user.email}
        className="hidden max-w-[140px] truncate text-[12.5px] font-medium text-slate-500 md:block"
      >
        {user.email}
      </span>
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={handleClick}
        title={armed ? "Click again to confirm log out" : "Log out"}
        className={`flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-[12.5px] font-semibold transition ${
          armed
            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        }`}
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">{armed ? "Sure?" : "Log out"}</span>
      </motion.button>
    </div>
  );
}

export default function Header({ query, onQueryChange, onAdd }) {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
            <Briefcase className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-extrabold tracking-tight text-slate-900">
              JobPilot
            </p>
            <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Application Tracker
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search company, role, location…"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md px-1.5 py-0.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-600"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAdd}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:px-4"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Application</span>
          <span className="sm:hidden">Add</span>
        </motion.button>

        <UserMenu />
      </div>
    </motion.header>
  );
}
