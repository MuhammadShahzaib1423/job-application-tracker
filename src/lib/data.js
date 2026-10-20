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

  // Real openings from the 2026-10-16 job search (LinkedIn + Indeed,
  // Islamabad/Rawalpindi). All start in the Wishlist for triage.
  return [
    mk(
      {
        company: "AZKY Tech Labs",
        role: "Full Stack Developer (Backend focused)",
        location: "Islamabad, Pakistan",
        workType: "Remote",
        salary: "",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://www.linkedin.com/jobs/view/4478872039/",
        contact: "",
        notes: "100% remote. React/Node/PostgreSQL, Next.js, REST APIs, strong DSA. Posted 1 day ago. Strongest match for your stack.",
      },
      0
    ),
    mk(
      {
        company: "Comtanix",
        role: "Full Stack Developer",
        location: "Rawalpindi, Pakistan",
        workType: "On-site",
        salary: "Rs 100,000-150,000 / month",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://pk.indeed.com/jobs?q=full+stack+developer&l=Islamabad&fromage=14&radius=25&from=searchOnDesktopSerp&vjk=0e38df806fe302d2",
        contact: "",
        notes: "Bahria Town Phase 8. 2+ years, PHP/Laravel + MERN, MySQL/PostgreSQL/MongoDB, REST APIs. Night shift 6PM-3AM - a real lifestyle trade-off to weigh. Link opens the Indeed search page; the direct job page may need a fresh search.",
      },
      1
    ),
    mk(
      {
        company: "Kodifly",
        role: "Software Engineer",
        location: "Islamabad, Pakistan",
        workType: "On-site",
        salary: "",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://www.linkedin.com/jobs/view/4469892843/",
        contact: "",
        notes: "BS/MS CS, 2+ years backend (Django/Flask), Python, React, PostgreSQL/MySQL. Posted 3 weeks ago.",
      },
      2
    ),
    mk(
      {
        company: "Mailin.ai",
        role: "Senior Full Stack Developer (PHP/Python + DevOps)",
        location: "South Asia",
        workType: "Remote",
        salary: "$500-1,500 / month",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://www.linkedin.com/jobs/view/4479263664/",
        contact: "",
        notes: "Laravel/Django, React/Next, MySQL/PostgreSQL/MongoDB, DevOps. Posted 2 days ago. Asks 4+ years (you have 2+) - a stretch, but your Laravel + React overlap is real.",
      },
      3
    ),
    mk(
      {
        company: "DPL",
        role: "Full Stack .NET Developer",
        location: "Islamabad, Pakistan",
        workType: "Hybrid",
        salary: "",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://www.linkedin.com/jobs/view/4471910213/",
        contact: "",
        notes: "2-4 yrs, .NET Core + React, TypeScript. 100+ applicants - competitive, apply with a tailored CV.",
      },
      4
    ),
    mk(
      {
        company: "Huzzle.com",
        role: "Fullstack Engineer - HealthTech",
        location: "Pakistan",
        workType: "Remote",
        salary: "",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://www.linkedin.com/jobs/view/4471899186/",
        contact: "",
        notes: "5+ yrs, React/Next/Node, Firebase. 100+ applicants. A stretch on years, but fully remote.",
      },
      5
    ),
    mk(
      {
        company: "PackageX",
        role: "Senior Backend Engineer - Full Stack",
        location: "Islamabad, Pakistan",
        workType: "On-site",
        salary: "",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://www.linkedin.com/jobs/view/4480106547/",
        contact: "",
        notes: "5+ yrs, Node/TypeScript, AWS/Docker. Posted 16 hrs ago. 100+ applicants. Stretch on years.",
      },
      6
    ),
    mk(
      {
        company: "RCG",
        role: "Full Stack Developer",
        location: "Islamabad, Pakistan",
        workType: "On-site",
        salary: "Competitive",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://pk.indeed.com/jobs?q=full+stack+developer&l=Islamabad&fromage=14&radius=25&from=searchOnDesktopSerp&vjk=fbbb72b2f7c20651",
        contact: "",
        notes: "Mon-Fri, UK hours 8:30am-5:30pm. Link opens the Indeed search page; the direct job page may need a fresh search.",
      },
      7
    ),
    mk(
      {
        company: "The 7 Technologies",
        role: "Backend Developer",
        location: "Rawalpindi, Pakistan",
        workType: "On-site",
        salary: "",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://pk.indeed.com/jobs?q=full+stack+developer&l=Islamabad&fromage=14&radius=25&from=searchOnDesktopSerp&vjk=0a5cc541c97f9958",
        contact: "",
        notes: "2+ years backend experience. Link opens the Indeed search page; the direct job page may need a fresh search.",
      },
      8
    ),
    mk(
      {
        company: "Vizzwebsolutions",
        role: "AI / Full Stack Engineer",
        location: "Islamabad, Pakistan",
        workType: "On-site",
        salary: "",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://pk.indeed.com/jobs?q=full+stack+developer&l=Islamabad&fromage=14&radius=25&from=searchOnDesktopSerp&vjk=2059e88b8c8f2243",
        contact: "",
        notes: "Full-stack with AI integration focus. Link opens the Indeed search page; the direct job page may need a fresh search.",
      },
      9
    ),
    mk(
      {
        company: "Avenue Mall office (DHA Phase 1, Rawalpindi)",
        role: "Full Stack PHP Developer",
        location: "DHA Phase 1, Rawalpindi, Pakistan",
        workType: "On-site",
        salary: "Competitive, exceeds market standards (per listing)",
        dateApplied: "",
        status: "wishlist",
        jobUrl: "https://www.apnijobs.pk/30/full-stack-php-developer.html",
        contact: "",
        notes: "PHP/Laravel, JavaScript, MySQL, Git; React/Vue a plus. 3–4 yrs (stretch vs his 2+). Advertises a 10-year job contract. Board category header says Lahore but listing body says DHA Phase 1, Rawalpindi — confirm if applying. Small board; apply via email on the listing.",
      },
      10
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

async function writeSeeds(uid, batch) {
  for (const seed of seedApplications()) {
    const { id, ...rest } = seed;
    batch.set(doc(appsRef(uid)), rest);
  }
}

const isDemoEntry = (d) => (d.jobUrl || "").includes("example.com");

/**
 * Seeds first-time users with the starter wishlist. One-time upgrade: if an
 * existing account holds only the old demo entries, they are replaced too.
 */
export async function seedIfEmpty(uid) {
  const snap = await getDocs(appsRef(uid));
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (docs.length === 0) {
    const batch = writeBatch(db);
    await writeSeeds(uid, batch);
    await batch.commit();
    return true;
  }
  if (docs.every(isDemoEntry)) {
    const batch = writeBatch(db);
    for (const d of docs) batch.delete(appDoc(uid, d.id));
    await writeSeeds(uid, batch);
    await batch.commit();
    return true;
  }
  return false;
}
