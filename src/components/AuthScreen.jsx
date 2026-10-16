import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  KanbanSquare,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: KanbanSquare,
    title: "Visual pipeline",
    text: "Drag applications from wishlist to offer across a live kanban board.",
  },
  {
    icon: CalendarDays,
    title: "Interview tracking",
    text: "Never miss a round — upcoming interviews surface automatically.",
  },
  {
    icon: BarChart3,
    title: "Stats & insights",
    text: "Response rates, weekly activity and pipeline health at a glance.",
  },
];

function friendlyError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email. Try creating one.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try logging in.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again in a little while.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

const inputCls =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const em = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "login") await login(em, password);
      else await signup(em, password);
    } catch (err) {
      setError(friendlyError(err?.code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Branding panel */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-slate-900 px-10 py-10 lg:flex"
      >
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
            <Briefcase className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <p className="text-[16px] font-extrabold tracking-tight text-white">
              JobPilot
            </p>
            <p className="text-[11px] font-medium text-slate-400">
              Application Tracker
            </p>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-white">
              Stay on top of
              <br />
              every application.
            </h1>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-slate-400">
              Your job hunt, organised — pipeline, interviews and stats in one
              calm workspace that syncs everywhere you sign in.
            </p>
          </div>
          <ul className="space-y-5">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.12, duration: 0.45 }}
                className="flex gap-3.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/8 text-emerald-400 ring-1 ring-white/10">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-white">{f.title}</p>
                  <p className="mt-0.5 max-w-xs text-[13px] leading-relaxed text-slate-400">
                    {f.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative text-[12px] text-slate-500">
          Free forever for your personal job search.
        </p>
      </motion.aside>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
              <Briefcase className="h-5 w-5 text-white" strokeWidth={2.2} />
            </div>
            <p className="text-[15px] font-extrabold tracking-tight text-slate-900">
              JobPilot
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-8">
            {/* Mode toggle */}
            <div className="relative mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              {["login", "signup"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setError("");
                  }}
                  className={`relative z-10 h-9 rounded-lg text-sm font-semibold transition ${
                    mode === m ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {mode === m && (
                    <motion.span
                      layoutId="auth-tab"
                      className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {m === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            <h2 className="text-[20px] font-extrabold tracking-tight text-slate-900">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-[13.5px] text-slate-500">
              {mode === "login"
                ? "Pick up your pipeline right where you left it."
                : "Start tracking applications in under a minute."}
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputCls}
                />
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min. 6 characters)"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className={inputCls}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-xl bg-rose-50 px-3.5 py-2.5 text-[13px] font-medium text-rose-700 ring-1 ring-rose-200/70"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting
                  ? "Please wait…"
                  : mode === "login"
                    ? "Log in"
                    : "Create account"}
              </motion.button>
            </form>
          </div>

          <p className="mt-5 text-center text-[12px] text-slate-400">
            Your applications sync securely to your private account.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
