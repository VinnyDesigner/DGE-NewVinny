import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Activity,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Edit3,
  Eye,
  LayoutGrid,
  List,
  Pause,
  Plus,
  Search,
  XCircle,
  Zap,
  Trash2,
  Lock,
  FolderOpen,
  ChevronRight,
  Check,
  Building2,
  Layers,
  Wrench,
  GitFork,
  X
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/operations/manage-schedules")({
  head: () => ({
    meta: [
      { title: "Manage Schedules — Data Automation Studio" },
      { name: "description", content: "Monitor and manage all automated delivery pipeline schedules across all flow types." },
    ],
  }),
  component: ManageSchedulesPage,
});

const metrics = [
  { label: "Total Executions", value: "1", hint: "All time", icon: Activity, tone: "info" },
  { label: "Active Schedules", value: "1", hint: "0 inactive", icon: Calendar, tone: "primary" },
  { label: "Total Success Deliveries", value: "0", hint: "All time", icon: CheckCircle2, tone: "success" },
  { label: "Failed Deliveries", value: "0", hint: "All time", icon: XCircle, tone: "danger" },
] as const;

interface ScheduleItem {
  id: string;
  status: string;
  name: string;
  priority: string;
  entity: string;
  dataSource: string;
  connector: string;
  layers: number;
  flowType: string;
  frequency: string;
  lastRun: string;
  nextRun: string;
  runs: number;
  timezone: string;
  startTime: string;
  notifications: string;
  lastJob: string;
  lastJobStatus: string;
  createdAt: string;
}

const initialSchedules: ScheduleItem[] = [
  {
    id: "13",
    status: "Active",
    name: "Test",
    priority: "Medium",
    entity: "ADDA",
    dataSource: "—",
    connector: "—",
    layers: 0,
    flowType: "Full Pipeline",
    frequency: "daily",
    lastRun: "2026-07-28 17:41",
    nextRun: "2026-06-21 09:30",
    runs: 1,
    timezone: "Asia/Dubai (UTC+4)",
    startTime: "08:00",
    notifications: "On (success & failure)",
    lastJob: "data-collection",
    lastJobStatus: "pending",
    createdAt: "2026-06-20 15:27"
  },
];

const tabs = ["All", "Active", "Inactive"];

function ManageSchedulesPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  // App views
  const [isEditing, setIsEditing] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);

  // Modal Dialogs state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingSchedule, setDeletingSchedule] = useState<ScheduleItem | null>(null);

  const [tab, setTab] = useState("All");
  const [view, setView] = useState<"grid" | "list">("list");
  const [query, setQuery] = useState("");

  const filteredSchedules = useMemo(() => {
    return initialSchedules.filter((s) => {
      if (tab !== "All" && s.status !== tab) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.entity.toLowerCase().includes(q) &&
          !s.id.toLowerCase().includes(q) &&
          !s.flowType.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [tab, query]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tab, query]);

  const paginatedSchedules = useMemo(() => {
    return filteredSchedules.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredSchedules, currentPage, pageSize]);

  const handleOpenView = (s: ScheduleItem) => {
    setSelectedSchedule(s);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (s: ScheduleItem) => {
    setEditingSchedule(s);
    setIsEditing(true);
  };

  const handleOpenDelete = (s: ScheduleItem) => {
    setDeletingSchedule(s);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    toast.success(`Schedule "${deletingSchedule?.name}" deleted successfully.`);
    setIsDeleteOpen(false);
    setDeletingSchedule(null);
  };

  // If in Edit mode, render the layout matching the 2nd Image
  if (isEditing && editingSchedule) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title={`Edit: ${editingSchedule.name}`}
          description="Update the wizard steps below — all changes will be reflected in the schedule configuration."
          actions={
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-bold text-foreground/80 hover:text-foreground cursor-pointer transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" /> Manage Schedules
            </button>
          }
        />

        {/* Edit View Stepper layout */}
        <Surface className="!p-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 min-w-[600px] select-none text-[13px] font-bold">
            <div className="flex flex-1 items-center gap-2 text-blue-500">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Layers className="h-3.5 w-3.5" />
              </span>
              Layers
            </div>
            <span className="h-px flex-1 bg-border/60 mx-2" />
            <div className="flex flex-1 items-center gap-2 text-muted-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border">
                <Calendar className="h-3.5 w-3.5" />
              </span>
              Schedule
            </div>
            <span className="h-px flex-1 bg-border/60 mx-2" />
            <div className="flex flex-1 items-center gap-2 text-muted-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border">
                <Check className="h-3.5 w-3.5" />
              </span>
              Review
            </div>
          </div>
        </Surface>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
          
          {/* Main Select Layers card */}
          <div className="space-y-4">
            
            {/* Locked summary info ribbon */}
            <div className="border border-border/80 bg-foreground/[0.03] rounded-xl px-4 py-3 text-xs font-semibold text-muted-foreground flex items-start gap-2.5 leading-relaxed select-none">
              <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-foreground">Locked — editing layers & schedule only:</span>{" "}
                Entity: <span className="text-foreground">Abu Dhabi Digital Authority</span>,{" "}
                Source: <span className="text-foreground">—</span>,{" "}
                Tool: <span className="text-foreground">Full Pipeline Flow</span>,{" "}
                Runtime: <span className="text-foreground">ArcGIS Pro Runtime</span>,{" "}
                Target: <span className="text-foreground">Internal Database</span>
              </div>
            </div>

            {/* Select Layers configuration step details */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Select Layers</h3>
                <p className="text-xs text-muted-foreground font-semibold">
                  Choose one or more data layers to include in this schedule. All selected layers will be processed by the same tool.
                </p>
              </div>

              {/* Filtering row */}
              <div className="flex gap-2.5 items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search layers by name or code..."
                    className="h-9 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
                <button className="h-9 px-3.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-soft">
                  Select All
                </button>
                <button className="h-9 px-3.5 bg-transparent border border-border hover:bg-muted text-muted-foreground font-bold text-xs rounded-lg cursor-pointer transition-colors">
                  Clear
                </button>
              </div>

              {/* No layers card content */}
              <div className="border border-dashed border-border rounded-2xl p-12 bg-card/20 flex flex-col items-center justify-center text-center gap-3 select-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted border border-border text-muted-foreground/60">
                  <FolderOpen className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold text-foreground">No layers found</div>
              </div>

              {/* Flow Action */}
              <div className="flex justify-end pt-4 border-t border-border/20">
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Right Preview Column (matching 2nd Image) */}
          <Surface className="!p-5 h-fit lg:sticky lg:top-4 shadow-soft border border-border text-xs font-semibold">
            <div className="flex items-start justify-between pb-3 border-b border-border/30 mb-4 select-none">
              <div>
                <div className="text-[13px] font-bold text-foreground">Schedule Preview</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">Live configuration</div>
              </div>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              <div className="text-muted-foreground">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                  <span>Step 4 of 7</span>
                  <span className="text-primary">57% complete</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: "57%" }} />
                </div>
              </div>

              <div className="space-y-3.5">
                {/* Entity */}
                <div className="rounded-lg border border-border bg-card/45 p-3.5">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Building2 className="h-4 w-4 text-primary" /> Entity
                  </div>
                  <div className="mt-1.5 font-bold text-foreground/90 leading-normal">
                    Abu Dhabi Digital Authority
                  </div>
                  <div className="mt-1.5 text-[10px] text-muted-foreground font-bold font-mono bg-muted/80 w-fit px-1.5 py-0.5 rounded border border-border/60">
                    2 deliveries
                  </div>
                </div>

                {/* Layers */}
                <div className="rounded-lg border border-border bg-card/45 p-3.5">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Layers className="h-4 w-4 text-primary" /> Layers
                  </div>
                  <div className="mt-1.5 font-bold text-foreground/90">
                    Not configured
                  </div>
                </div>

                {/* Tool */}
                <div className="rounded-lg border border-primary/25 bg-primary/5 p-3.5 space-y-2 text-primary">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Wrench className="h-4 w-4 text-primary" /> Tool
                  </div>
                  <div className="font-bold text-foreground">
                    Full Pipeline Flow
                  </div>
                  <div className="text-[10px] text-muted-foreground/90 font-bold leading-normal">
                    ~10 min · 96.5% success
                  </div>
                  
                  {/* Detailed list steps */}
                  <div className="space-y-1.5 pl-2 border-l border-primary/20 pt-1 text-[11px] font-semibold text-foreground/90">
                    <div className="flex justify-between">
                      <span>Data Collection</span>
                      <span className="text-muted-foreground/80 font-bold">~5 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Quality</span>
                      <span className="text-muted-foreground/80 font-bold">~8 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Internal Data Sync</span>
                      <span className="text-muted-foreground/80 font-bold">~6 min</span>
                    </div>
                  </div>

                  <div className="mt-2 w-fit bg-primary/10 border border-primary/20 text-primary font-bold text-[9px] uppercase px-1.5 py-0.5 rounded">
                    delivery
                  </div>
                </div>
                
                {/* Schedule details */}
                <div className="rounded-lg border border-border bg-card/45 p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" /> Schedule
                  </div>
                  <div className="space-y-2 text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Frequency</span>
                      <span className="font-bold text-foreground">Daily</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Start</span>
                      <span className="font-bold text-foreground">2028-06-14 · 09:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Timezone</span>
                      <span className="font-bold text-foreground">Asia/Dubai (UTC+4)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3.5 py-2.5 text-xs font-bold text-blue-400 select-none shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" /> Will be active on save
            </div>
          </Surface>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* List Page Header */}
      <PageHeader
        title="Manage Schedules"
        description="Monitor and manage all automated delivery pipeline schedules across all flow types"
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-[14px] font-bold text-white shadow-soft transition-colors cursor-pointer">
            <Plus className="h-4 w-4" /> New Schedule
          </button>
        }
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Surface
            key={m.label}
            className="!p-3.5 relative overflow-hidden group hover:border-accent/30 transition duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset",
                m.tone === "info" && (isLight ? "bg-info/10 text-info ring-info/20" : "bg-info/10 text-info ring-info/20"),
                m.tone === "primary" && (isLight ? "bg-primary/10 text-accent ring-primary/20" : "bg-primary/10 text-accent ring-primary/20"),
                m.tone === "success" && (isLight ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"),
                m.tone === "danger" && (isLight ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-rose-500/10 text-rose-400 border-rose-500/20"),
              )}>
                <m.icon className="h-4 w-4" />
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-2.5">
              <div className="text-[12px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">{m.label}</div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-[26px] font-black leading-none tracking-tight text-foreground">{m.value}</span>
                <span className="text-[11px] text-muted-foreground/75 font-semibold leading-none">{m.hint}</span>
              </div>
            </div>
          </Surface>
        ))}
      </div>

      <Surface className="!p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border/60 p-4">
          <div className="relative w-full sm:w-[300px] shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, tool, entity or ID..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card/40 p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-md px-3 py-1 text-[13px] font-medium transition cursor-pointer",
                  tab === t ? "bg-accent/20 text-accent ring-1 ring-inset ring-accent/40" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 text-[13px] font-bold text-foreground/80 cursor-pointer">
            All Frequencies <ChevronDown className="h-4 w-4 opacity-70" />
          </button>
          
          <div className="flex-1 min-w-[10px]" />

          <span className="text-[14px] text-muted-foreground font-bold">
            {filteredSchedules.length} {filteredSchedules.length === 1 ? "schedule" : "schedules"}
          </span>
          <div className="inline-flex items-center rounded-lg border border-border/60 bg-card/40 p-1">
            <button
              onClick={() => setView("grid")}
              className={cn("flex h-8 w-8 items-center justify-center rounded-md cursor-pointer", view === "grid" ? "bg-accent/20 text-accent" : "text-muted-foreground")}
            ><LayoutGrid className="h-4 w-4" /></button>
            <button
              onClick={() => setView("list")}
              className={cn("flex h-8 w-8 items-center justify-center rounded-md cursor-pointer", view === "list" ? "bg-accent/20 text-accent" : "text-muted-foreground")}
            ><List className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70 uppercase">
                <th className="px-5 py-3 table-sticky-col-1-wide"><input type="checkbox" className="rounded border-border/60 bg-card/60 accent-accent" /></th>
                <SortTh className="table-sticky-col-2-wide w-full">Scheduler Name</SortTh>
                <SortTh>Entity</SortTh>
                <SortTh>Data Source</SortTh>
                <SortTh>Connector</SortTh>
                <th className="px-5 py-3 whitespace-nowrap">Layers</th>
                <th className="px-5 py-3 whitespace-nowrap">Flow Type</th>
                <SortTh>Frequency</SortTh>
                <SortTh>Last Run</SortTh>
                <th className="px-5 py-3 whitespace-nowrap">Next Run</th>
                <SortTh>Runs</SortTh>
                <th className="px-5 py-3 whitespace-nowrap table-sticky-actions text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSchedules.map((s) => (
                <tr key={s.name} className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition">
                  <td className="px-5 py-4 table-sticky-col-1-wide"><input type="checkbox" className="rounded border-border/60 bg-card/60 accent-accent" /></td>
                  <td className="px-5 py-4 table-sticky-col-2-wide">
                    <div className="font-extrabold text-foreground">{s.name}</div>
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-500">{s.priority}</span>
                  </td>
                  <td className="px-5 py-4 font-bold text-foreground/80">{s.entity}</td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold">{s.dataSource}</td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold">{s.connector}</td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold">{s.layers}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-1 text-xs font-bold text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> {s.flowType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold uppercase">{s.frequency}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground font-semibold">
                      <Clock className="h-3.5 w-3.5" /> {s.lastRun}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold font-mono">{s.nextRun}</td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold">{s.runs}</td>
                  <td className="px-5 py-4 table-sticky-actions text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toast.info("Schedule paused successfully.")}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/15 cursor-pointer transition"
                        title="Pause schedule"
                      >
                        <Pause className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => toast.success("Manual execution triggered successfully.")}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-blue-500/10 text-primary hover:bg-blue-500/20 border border-blue-500/15 cursor-pointer transition"
                        title="Run now"
                      >
                        <Zap className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenView(s)}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-blue-500/10 text-primary hover:bg-blue-500/20 border border-blue-500/15 cursor-pointer transition"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-blue-500/10 text-primary hover:bg-blue-500/20 border border-blue-500/15 cursor-pointer transition"
                        title="Edit schedule"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(s)}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/15 cursor-pointer transition"
                        title="Delete schedule"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          totalItems={filteredSchedules.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="schedule"
          itemNamePlural="schedules"
        />
      </Surface>

      {/* 1. VIEW SCHEDULE DIALOG MODAL (1st Image) */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-xl bg-card border border-border p-6 shadow-2xl rounded-2xl text-xs font-semibold text-muted-foreground select-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/30 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center bg-primary/10 border border-primary/20 text-primary rounded-lg shadow-soft">
                <RefreshCw className="h-4 w-4" />
              </span>
              <div>
                <DialogTitle className="text-sm font-bold text-foreground leading-none">
                  {selectedSchedule?.name}
                </DialogTitle>
                <div className="text-[10px] text-muted-foreground font-mono mt-1">
                  {selectedSchedule?.id}
                </div>
              </div>
            </div>
            
            {/* Native Radix close handled. Custom close button inside header should be avoided to prevent double close icons */}
          </div>

          {/* Grid Layout of Details */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs">
            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Entity</span>
                <span className="text-foreground font-bold mt-1 block">Abu Dhabi Digital Authority</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Frequency</span>
                <span className="text-foreground font-bold mt-1 block uppercase">{selectedSchedule?.frequency}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Status</span>
                <div className="mt-1 flex items-center gap-1.5 w-fit rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-primary font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Active
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Notifications</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.notifications}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Next Run</span>
                <span className="text-foreground font-bold mt-1 block font-mono">{selectedSchedule?.nextRun}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Last Job</span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-foreground font-bold">{selectedSchedule?.lastJob}</span>
                  <span className="bg-muted border border-border text-foreground/70 text-[9px] font-extrabold px-1 py-0.2 rounded uppercase">
                    {selectedSchedule?.lastJobStatus}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 block">{selectedSchedule?.lastRun}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Timezone</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.timezone}</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Flow Type</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.flowType}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Priority</span>
                <span className="mt-1 inline-flex items-center rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-500">
                  {selectedSchedule?.priority}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Start Time</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.startTime}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Last Run</span>
                <span className="text-foreground font-bold mt-1 block font-mono">{selectedSchedule?.lastRun}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Runs</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.runs}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Layers</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.layers} layer(s)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Created At</span>
                <span className="text-foreground font-bold mt-1 block font-mono">{selectedSchedule?.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Close button aligned right */}
          <div className="flex justify-end pt-5 border-t border-border/30 mt-5">
            <button
              onClick={() => setIsViewOpen(false)}
              className="px-4.5 py-1.5 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. DELETE SCHEDULE CONFIRMATION DIALOG (3rd Image) */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-card border border-border p-6 shadow-2xl rounded-2xl select-none">
          <div className="flex flex-col items-center text-center gap-4 py-2">
            
            {/* Warning Avatar */}
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
              <XCircle className="h-6 w-6" />
            </span>

            {/* Description */}
            <div className="space-y-1.5">
              <DialogTitle className="text-[15px] font-black text-foreground">
                Delete this schedule?
              </DialogTitle>
              <p className="text-xs font-semibold text-muted-foreground/90 leading-relaxed max-w-[280px]">
                This permanently deletes the schedule and its layer/target links. Delivery history is kept.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3.5 w-full mt-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 h-9 rounded-lg border border-border bg-transparent text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 h-9 rounded-lg bg-rose-500 hover:bg-rose-500/95 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-soft transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Record
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Minimal ArrowLeft icon utility
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
