import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

export const STATUSES = [
  {
    id: "wishlist",
    label: "Wishlist",
    dot: "bg-slate-400",
    chip: "bg-slate-100 text-slate-700 border-slate-200",
    headerText: "text-slate-600",
    columnBg: "bg-slate-100/60",
  },
  {
    id: "applied",
    label: "Applied",
    dot: "bg-blue-500",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
    headerText: "text-blue-700",
    columnBg: "bg-blue-50/50",
  },
  {
    id: "interview",
    label: "Interview",
    dot: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    headerText: "text-amber-700",
    columnBg: "bg-amber-50/50",
  },
  {
    id: "offer",
    label: "Offer",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    headerText: "text-emerald-700",
    columnBg: "bg-emerald-50/50",
  },
  {
    id: "rejected",
    label: "Rejected",
    dot: "bg-rose-500",
    chip: "bg-rose-50 text-rose-700 border-rose-200",
    headerText: "text-rose-700",
    columnBg: "bg-rose-50/50",
  },
];

export const statusById = (id) => STATUSES.find((s) => s.id === id) || STATUSES[0];

export const WORK_TYPES = ["Remote", "On-site", "Hybrid"];

const uid = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const newApplication = (overrides = {}) => ({
  id: uid(),
  company: "",
  role: "",
  location: "",
  workType: "Remote",
  salary: "",
  dateApplied: new Date().toISOString().slice(0, 10),
  status: "wishlist",
  jobUrl: "",
  contact: "",
  notes: "",
  interviewDate: "",
  createdAt: Date.now(),
  order: Date.now(),
  ...overrides,
});

export function seedApplications() {
  const now = Date.now();
  const mk = (overrides, createdOffsetDays) =>
    newApplication({
      ...overrides,
      createdAt: now - createdOffsetDays * 86400000,
      order: now - createdOffsetDays * 86400000,
    });

  return [
    mk(
      {
        company: "Northbeam Labs",
        role: "React Developer",
        location: "Islamabad, Pakistan",
        workType: "On-site",
        salary: "Rs 180,000 / month",
        dateApplied: "2026-10-12",
        status: "interview",
        jobUrl: "https://northbeamlabs.example.com/careers/react-dev",
        contact: "Ayesha Khan — Engineering Manager",
        notes: "Second round scheduled. They liked the portfolio walkthrough — prepare system design basics.",
        interviewDate: "2026-10-21T11:00",
      },
      4
    ),
    mk(
      {
        company: "Vertexa",
        role: "Frontend Engineer",
        location: "Islamabad, Pakistan",
        workType: "Hybrid",
        salary: "Rs 220,000 / month",
        dateApplied: "2026-10-05",
        status: "interview",
        jobUrl: "https://vertexa.example.com/jobs/frontend",
        contact: "Bilal Ahmed — Talent Partner",
        notes: "Technical round on Friday. Expect a live React coding exercise on state management.",
        interviewDate: "2026-10-18T15:30",
      },
      11
    ),
    mk(
      {
        company: "Cloudhaven",
        role: "Full Stack Developer",
        location: "Lahore, Pakistan",
        workType: "Hybrid",
        salary: "Rs 250,000 / month",
        dateApplied: "2026-09-28",
        status: "offer",
        jobUrl: "https://cloudhaven.example.com/careers",
        contact: "Sarah Malik — HR Lead",
        notes: "Offer received! Reviewing terms — ask about remote flexibility before signing.",
      },
      18
    ),
    mk(
      {
        company: "Loom & Lark",
        role: "Senior Frontend Engineer",
        location: "Remote",
        workType: "Remote",
        salary: "$3,500 / month",
        dateApplied: "2026-10-10",
        status: "applied",
        jobUrl: "https://loomandlark.example.com/jobs/senior-frontend",
        contact: "",
        notes: "Applied via their careers page. Tailored CV around the design-system work.",
      },
      6
    ),
    mk(
      {
        company: "Brightline Tech",
        role: "Full Stack Developer",
        location: "Remote",
        workType: "Remote",
        salary: "$2,800 / month",
        dateApplied: "2026-10-08",
        status: "applied",
        jobUrl: "https://brightlinetech.example.com/careers",
        contact: "Danish Raza — CTO",
        notes: "Connected with the CTO on LinkedIn after applying. Follow up next week.",
      },
      8
    ),
    mk(
      {
        company: "Datawise Systems",
        role: "Software Engineer",
        location: "Karachi, Pakistan",
        workType: "On-site",
        salary: "Rs 160,000 / month",
        dateApplied: "2026-09-15",
        status: "rejected",
        jobUrl: "https://datawise.example.com/jobs",
        contact: "",
        notes: "Rejected after first round — they wanted deeper Python experience. Good practice regardless.",
      },
      31
    ),
    mk(
      {
        company: "Pixelforge Studio",
        role: "Frontend Engineer",
        location: "Remote",
        workType: "Remote",
        salary: "$3,000 / month",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://pixelforge.example.com/careers",
        contact: "",
        notes: "Design-led studio, great culture reviews. Waiting for the role to open to applications.",
      },
      2
    ),
    mk(
      {
        company: "Quantia",
        role: "React Developer",
        location: "Rawalpindi, Pakistan",
        workType: "On-site",
        salary: "Rs 150,000 / month",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://quantia.example.com/jobs/react",
        contact: "Hira Shah — Recruiter",
        notes: "Recruiter reached out on LinkedIn. Role looks like a strong match — apply this week.",
      },
      1
    ),
  ];
}

// ---------------------------------------------------------------------------
// Firestore data layer — per-user collection at users/{uid}/applications.
// Document IDs from Firestore become the app `id`; the local `id` is never
// written. Dates stay ISO strings (no Firestore Timestamps).
// ---------------------------------------------------------------------------

const appsRef = (uid) => collection(db, "users", uid, "applications");
const appDoc = (uid, id) => doc(db, "users", uid, "applications", id);

const stripId = ({ id, ...rest }) => rest;

const byOrder = (a, b) => (a.order ?? a.createdAt ?? 0) - (b.order ?? b.createdAt ?? 0);

export function subscribeApplications(uid, onUpdate) {
  return onSnapshot(appsRef(uid), (snap) => {
    const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    apps.sort(byOrder);
    onUpdate(apps);
  });
}

export async function addApplication(uid, data) {
  const payload = stripId({
    ...data,
    createdAt: Date.now(),
    order: Date.now(),
  });
  const ref = await addDoc(appsRef(uid), payload);
  return ref.id;
}

export function updateApplication(uid, id, data) {
  return updateDoc(appDoc(uid, id), stripId(data));
}

export function deleteApplication(uid, id) {
  return deleteDoc(appDoc(uid, id));
}

/** Writes the fictional seed applications for first-time users. */
export async function seedIfEmpty(uid) {
  const snap = await getDocs(appsRef(uid));
  if (!snap.empty) return false;
  const batch = writeBatch(db);
  for (const seed of seedApplications()) {
    const { id, ...rest } = seed;
    batch.set(doc(appsRef(uid)), rest);
  }
  await batch.commit();
  return true;
}
