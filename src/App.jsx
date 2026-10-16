import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, KanbanSquare, Loader2, SearchX } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import AuthScreen from "./components/AuthScreen";
import Header from "./components/Header";
import StatsRow from "./components/StatsRow";
import InterviewStrip from "./components/InterviewStrip";
import WeeklyChart from "./components/WeeklyChart";
import PipelineSummary from "./components/PipelineSummary";
import FilterChips from "./components/FilterChips";
import KanbanBoard from "./components/KanbanBoard";
import ApplicationModal from "./components/ApplicationModal";
import DetailDrawer from "./components/DetailDrawer";
import ConfirmDialog from "./components/ConfirmDialog";
import {
  STATUSES,
  addApplication,
  deleteApplication,
  seedIfEmpty,
  subscribeApplications,
  updateApplication,
} from "./lib/data";

function LoadingSplash() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 shadow-sm">
        <Briefcase className="h-6 w-6 text-white" strokeWidth={2.2} />
      </div>
      <p className="text-[15px] font-extrabold tracking-tight text-slate-900">
        JobPilot
      </p>
      <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
    </motion.div>
  );
}

function Tracker({ user }) {
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [drawerApp, setDrawerApp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const seededRef = useRef(null);

  useEffect(() => {
    setApplications([]);
    seededRef.current = null;
    const unsub = subscribeApplications(user.uid, (apps) => {
      setApplications(apps);
      if (apps.length === 0 && seededRef.current !== user.uid) {
        seededRef.current = user.uid;
        seedIfEmpty(user.uid).catch((err) =>
          console.error("Failed to seed applications:", err)
        );
      }
    });
    return unsub;
  }, [user.uid]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((a) =>
      [a.company, a.role, a.location, a.notes, a.contact]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [applications, query]);

  const visibleStatuses = useMemo(
    () =>
      statusFilter === "all"
        ? STATUSES.map((s) => s.id)
        : [statusFilter],
    [statusFilter]
  );

  const stats = useMemo(() => {
    const by = (id) => applications.filter((a) => a.status === id).length;
    const submitted = applications.filter((a) => a.status !== "wishlist").length;
    const responded =
      by("interview") + by("offer") + by("rejected");
    return {
      total: applications.length,
      applied: by("applied"),
      interviews: by("interview"),
      offers: by("offer"),
      rejected: by("rejected"),
      responseRate: submitted === 0 ? 0 : Math.round((responded / submitted) * 100),
    };
  }, [applications]);

  const interviews = useMemo(
    () =>
      applications
        .filter((a) => a.status === "interview")
        .sort((a, b) => {
          if (!a.interviewDate) return 1;
          if (!b.interviewDate) return -1;
          return new Date(a.interviewDate) - new Date(b.interviewDate);
        }),
    [applications]
  );

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (app) => {
    setDrawerApp(null);
    setEditing(app);
    setModalOpen(true);
  };

  const saveApplication = async (data) => {
    const { id, ...rest } = data;
    try {
      const exists = applications.some((a) => a.id === id);
      if (exists) {
        await updateApplication(user.uid, id, rest);
      } else {
        await addApplication(user.uid, rest);
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error("Failed to save application:", err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteApplication(user.uid, deleteTarget.id);
      setDeleteTarget(null);
      setDrawerApp(null);
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  const handleStatusChange = (appId, newStatus, beforeId) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    // Compute a persistent order value so the drop position survives the
    // Firestore round-trip, then apply it optimistically for instant UI.
    const column = applications
      .filter((a) => a.status === newStatus && a.id !== appId)
      .sort((x, y) => (x.order ?? 0) - (y.order ?? 0));
    let newOrder;
    if (beforeId) {
      const idx = column.findIndex((a) => a.id === beforeId);
      if (idx === -1) {
        newOrder = column.length ? (column[column.length - 1].order ?? 0) + 1 : 0;
      } else if (idx === 0) {
        newOrder = (column[0].order ?? 0) - 1;
      } else {
        newOrder = ((column[idx - 1].order ?? 0) + (column[idx].order ?? 0)) / 2;
      }
    } else {
      newOrder = column.length ? (column[column.length - 1].order ?? 0) + 1 : 0;
    }
    if (app.status === newStatus && newOrder === app.order) return;

    const moved = { ...app, status: newStatus, order: newOrder };
    setApplications((prev) =>
      [...prev.filter((a) => a.id !== appId), moved].sort(
        (x, y) => (x.order ?? 0) - (y.order ?? 0)
      )
    );
    updateApplication(user.uid, appId, { status: newStatus, order: newOrder }).catch(
      (err) => console.error("Failed to move application:", err)
    );
  };

  const showEmptySearch = query.trim() && filtered.length === 0;

  return (
    <div className="min-h-screen">
      <Header query={query} onQueryChange={setQuery} onAdd={openAdd} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8"
      >
        <StatsRow stats={stats} />

        <InterviewStrip interviews={interviews} onOpen={setDrawerApp} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WeeklyChart applications={applications} />
          </div>
          <PipelineSummary applications={applications} />
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <KanbanSquare className="h-4 w-4 text-slate-400" />
              <h2 className="text-[15px] font-extrabold tracking-tight text-slate-900">
                Pipeline
              </h2>
              {query.trim() && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11.5px] font-bold text-emerald-700">
                  {filtered.length} match{filtered.length === 1 ? "" : "es"}
                </span>
              )}
            </div>
            <FilterChips active={statusFilter} onChange={setStatusFilter} />
          </div>

          <AnimatePresence mode="wait">
            {showEmptySearch ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <SearchX className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-800">No matches found</p>
                  <p className="mt-1 text-[13px] text-slate-500">
                    Nothing matches “{query.trim()}”. Try a different keyword or clear the search.
                  </p>
                </div>
                <button
                  onClick={() => setQuery("")}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Clear search
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`board-${statusFilter}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <KanbanBoard
                  applications={filtered}
                  visibleStatuses={visibleStatuses}
                  onStatusChange={handleStatusChange}
                  onOpen={setDrawerApp}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <footer className="flex items-center justify-between border-t border-slate-200/70 pt-5 text-[12px] text-slate-400">
          <p>
            <span className="font-bold text-slate-500">JobPilot</span> — stay on top of every
            application.
          </p>
          <p className="hidden sm:block">Your data syncs securely to your private account.</p>
        </footer>
      </motion.main>

      <ApplicationModal
        open={modalOpen}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={saveApplication}
      />

      <DetailDrawer
        app={drawerApp}
        onClose={() => setDrawerApp(null)}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <ConfirmDialog
        app={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSplash />;
  if (!user) return <AuthScreen />;
  return <Tracker user={user} />;
}
