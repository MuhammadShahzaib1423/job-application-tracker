import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { STATUSES, WORK_TYPES, newApplication } from "../lib/data";

const inputCls =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-[11.5px] font-medium text-rose-600">{error}</span>}
    </label>
  );
}

export default function ApplicationModal({ open, initial, onClose, onSave }) {
  const [form, setForm] = useState(() => newApplication());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial } : newApplication());
      setErrors({});
    }
  }, [open, initial]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.company.trim()) errs.company = "Company is required";
    if (!form.role.trim()) errs.role = "Role is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      location: form.location.trim(),
      salary: form.salary.trim(),
      jobUrl: form.jobUrl.trim(),
      contact: form.contact.trim(),
      notes: form.notes.trim(),
    });
  };

  const isEdit = Boolean(initial?.id);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-[17px] font-extrabold tracking-tight text-slate-900">
                  {isEdit ? "Edit application" : "Add application"}
                </h2>
                <p className="text-[12.5px] text-slate-400">
                  {isEdit ? "Update the details below." : "Track a new opportunity."}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
              <Field label="Company" required error={errors.company}>
                <input className={inputCls} value={form.company} onChange={set("company")} placeholder="e.g. Northbeam Labs" autoFocus />
              </Field>
              <Field label="Role" required error={errors.role}>
                <input className={inputCls} value={form.role} onChange={set("role")} placeholder="e.g. Frontend Engineer" />
              </Field>
              <Field label="Location">
                <input className={inputCls} value={form.location} onChange={set("location")} placeholder="e.g. Islamabad, Pakistan" />
              </Field>
              <Field label="Work type">
                <select className={inputCls} value={form.workType} onChange={set("workType")}>
                  {WORK_TYPES.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </Field>
              <Field label="Salary">
                <input className={inputCls} value={form.salary} onChange={set("salary")} placeholder="e.g. Rs 200,000 / month" />
              </Field>
              <Field label="Date applied">
                <input type="date" className={inputCls} value={form.dateApplied} onChange={set("dateApplied")} />
              </Field>
              <Field label="Status">
                <select className={inputCls} value={form.status} onChange={set("status")}>
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Interview date & time">
                <input type="datetime-local" className={inputCls} value={form.interviewDate} onChange={set("interviewDate")} />
              </Field>
              <Field label="Job URL">
                <input className={inputCls} value={form.jobUrl} onChange={set("jobUrl")} placeholder="https://…" inputMode="url" />
              </Field>
              <Field label="Contact person">
                <input className={inputCls} value={form.contact} onChange={set("contact")} placeholder="e.g. Ayesha Khan — Hiring Manager" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Notes">
                  <textarea
                    className={`${inputCls} h-24 resize-none py-2.5 leading-relaxed`}
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Interview prep, follow-ups, impressions…"
                  />
                </Field>
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200/60"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={submit}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                {isEdit ? "Save changes" : "Add application"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
