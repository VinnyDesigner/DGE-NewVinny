import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Activity,
  Briefcase,
  CheckCircle2,
  Clock,
  Edit3,
  GitBranch,
  Layers,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
  Eye,
  ChevronDown,
  AlertTriangle,
  Pencil,
  Check,
  ArrowLeft,
  Play,
  ExternalLink,
  Calendar,
  FileText,
  Sliders,
  Globe,
  Database,
  AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export const Route = createFileRoute("/_app/operations/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs — Data Automation Studio" },
      { name: "description", content: "Track, manage and monitor all data processing jobs across all flow types." },
    ],
  }),
  component: JobsPage,
});

interface JobItem {
  delivery: string;
  subtitle: string;
  type: string;
  entity: string;
  layers: number;
  pipeline: string[];
  pipelineLabel: string;
  status: string;
  submitted: string;
}

// Single row of job matching the screenshot exactly
const initialJobs: JobItem[] = [
  {
    delivery: "Del-3",
    subtitle: "3 steps",
    type: "Data Collection",
    entity: "ADDA",
    layers: 4,
    pipeline: ["done", "done", "pending"],
    pipelineLabel: "At: qa-qc",
    status: "Running",
    submitted: "27/06/2026, 10:25 PM",
  },
];

function JobsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [jobsList, setJobsList] = useState<JobItem[]>(initialJobs);
  const [query, setQuery] = useState("");
  const [flowFilter, setFlowFilter] = useState("all-flow-types");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [viewingJobId, setViewingJobId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog / Pop-up states
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Edit fields states
  const [editStatus, setEditStatus] = useState("Running");
  const [editRemarks, setEditRemarks] = useState("");
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return jobsList.filter((j) => {
      if (flowFilter !== "all-flow-types" && j.type.toLowerCase().replace(" ", "-") !== flowFilter) return false;
      if (statusFilter !== "all-statuses" && j.status.toLowerCase() !== statusFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !j.delivery.toLowerCase().includes(q) &&
          !j.type.toLowerCase().includes(q) &&
          !j.entity.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [jobsList, query, flowFilter, statusFilter]);

  const paginatedJobs = useMemo(() => {
    return filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  const handleOpenEdit = (job: JobItem) => {
    setSelectedJob(job);
    setEditStatus(job.status);
    setEditRemarks("");
    setShowErrorBanner(false);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJob) {
      setJobsList(
        jobsList.map((j) =>
          j.delivery === selectedJob.delivery
            ? { ...j, status: editStatus }
            : j
        )
      );
      toast.success("Job changes saved successfully.");
    }
    setIsEditModalOpen(false);
  };

  const handleOpenDelete = (job: JobItem) => {
    setSelectedJob(job);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedJob) {
      setJobsList(jobsList.filter((j) => j.delivery !== selectedJob.delivery));
      toast.success(`Job "${selectedJob.delivery}" deleted successfully.`);
      setIsDeleteModalOpen(false);
      setSelectedJob(null);
    }
  };

  if (viewingJobId) {
    return (
      <div className="space-y-6">
        {/* Detail view header ribbon */}
        <Surface className="!p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <button
                onClick={() => setViewingJobId(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground transition cursor-pointer"
                title="Back to jobs list"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white shadow-soft">
                <Layers className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[17px] font-black text-foreground">{viewingJobId}</h2>
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase select-none">
                    Running
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase select-none">
                    Primary
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground/85 font-semibold">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> Abu Dhabi Digital Authority
                  </span>
                  <span className="flex items-center gap-1">
                    <GitBranch className="h-3.5 w-3.5" /> Scheduled pipeline
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> 27/06/2026, 10:25 PM
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> 759h 24m
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                onClick={() => toast.info("Job run scheduled.")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Run Again
              </button>
              <Link
                to="/operations/workflow"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
              >
                <Eye className="h-3.5 w-3.5" /> Live Monitor
              </Link>
            </div>
          </div>
        </Surface>

        {/* Content Layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Pipeline Stages */}
            <Surface className="!p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-border/30 pb-3">
                <h3 className="text-sm font-bold text-foreground">Pipeline Stages</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/80 font-bold">1/3 done</span>
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground cursor-pointer">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Stepper Progress Visualizer */}
              <div className="relative flex items-center justify-between px-6 sm:px-12 py-3 select-none">
                {/* Horizontal connective track line */}
                <div className="absolute left-[12%] right-[12%] top-[24px] h-0.5 bg-border/60 -translate-y-1/2" />
                <div className="absolute left-[12%] w-[38%] top-[24px] h-0.5 bg-blue-500 -translate-y-1/2" />

                {/* Step 1: Data Collection */}
                <div className="relative z-10 flex flex-col items-center gap-1 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white border-4 border-card shadow-soft">
                    <Check className="h-5 w-5" />
                  </div>
                  <span className="text-[12.5px] font-bold text-emerald-500 mt-1">Data Collection</span>
                  <span className="text-[10px] text-muted-foreground font-semibold">Completed</span>
                </div>

                {/* Step 2: Data Quality */}
                <div className="relative z-10 flex flex-col items-center gap-1 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 border-4 border-blue-500 text-blue-500 bg-card shadow-soft">
                    <span className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <span className="text-[12.5px] font-bold text-blue-500 mt-1">Data Quality</span>
                  <span className="text-[10px] text-blue-400 font-semibold">Running</span>
                </div>

                {/* Step 3: Data Loading */}
                <div className="relative z-10 flex flex-col items-center gap-1 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/35" />
                  </div>
                  <span className="text-[12.5px] font-bold text-muted-foreground/60 mt-1">Data Loading</span>
                  <span className="text-[10px] text-muted-foreground/60 font-semibold">Pending</span>
                </div>
              </div>

              {/* Progress bar info */}
              <div className="space-y-1.5 pt-2 border-t border-border/20">
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground/90 uppercase tracking-wide">
                  <span>Overall Progress</span>
                  <span className="text-blue-500">53%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-border/40 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "53%" }} />
                </div>
              </div>
            </Surface>

            {/* Stage Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground pl-1">Stage Details</h3>
              
              {/* Step 1 Details */}
              <div className="rounded-xl border border-border/70 bg-card overflow-hidden border-l-4 border-l-emerald-500">
                <div className="p-4 flex items-center justify-between border-b border-border/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                    <span className="font-bold text-foreground text-[13px]">Step 1 Data Collection</span>
                    <span className="inline-flex items-center rounded bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 text-[9.5px] font-black uppercase select-none leading-none">
                      Completed
                    </span>
                  </div>
                  <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2.5 text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer">
                    <FileText className="h-3.5 w-3.5" /> Logs
                  </button>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Started</span>
                    <span className="font-bold text-foreground">27/06/2026, 10:15 PM</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Finished</span>
                    <span className="font-bold text-foreground">27/06/2026, 10:18 PM</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Duration</span>
                    <span className="font-bold text-foreground">3m</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Node</span>
                    <span className="font-bold text-muted-foreground">—</span>
                  </div>
                </div>
              </div>

              {/* Step 2 Details */}
              <div className="rounded-xl border border-border/70 bg-card overflow-hidden border-l-4 border-l-blue-500">
                <div className="p-4 flex items-center justify-between border-b border-border/20">
                  <div className="flex items-center gap-2">
                    <span className="h-4.5 w-4.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="font-bold text-foreground text-[13px]">Step 2 Data Quality</span>
                    <span className="inline-flex items-center rounded bg-blue-500/10 text-blue-400 px-1.5 py-0.5 text-[9.5px] font-black uppercase select-none leading-none">
                      Running
                    </span>
                  </div>
                  <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2.5 text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer">
                    <FileText className="h-3.5 w-3.5" /> Logs
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Started</span>
                      <span className="font-bold text-foreground">27/06/2026, 10:18 PM</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Finished</span>
                      <span className="font-bold text-muted-foreground">—</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Duration</span>
                      <span className="font-bold text-foreground">759h 21m</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Node</span>
                      <span className="font-bold text-muted-foreground">—</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded-full bg-border/45 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "60%" }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-blue-500">rule:TOPOLOGY</span>
                      <span className="text-[11px] font-bold text-blue-400">60%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 Details */}
              <div className="rounded-xl border border-border/70 bg-card overflow-hidden border-l-4 border-l-border">
                <div className="p-4 flex items-center justify-between border-b border-border/20">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-muted-foreground" />
                    <span className="font-bold text-foreground text-[13px]">Step 3 Data Loading</span>
                    <span className="inline-flex items-center rounded bg-foreground/5 text-muted-foreground px-1.5 py-0.5 text-[9.5px] font-black uppercase select-none leading-none border border-border/20">
                      Pending
                    </span>
                  </div>
                  <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2.5 text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer">
                    <FileText className="h-3.5 w-3.5" /> Logs
                  </button>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Started</span>
                    <span className="font-bold text-muted-foreground">—</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Finished</span>
                    <span className="font-bold text-muted-foreground">—</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Duration</span>
                    <span className="font-bold text-muted-foreground">—</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Node</span>
                    <span className="font-bold text-muted-foreground">—</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            
            {/* Delivery Details */}
            <Surface className="!p-5">
              <h3 className="text-[11.5px] font-extrabold text-muted-foreground uppercase tracking-wider border-b border-border/30 pb-3 select-none">
                Delivery Details
              </h3>

              <div className="mt-4 space-y-5">
                {/* PIPELINE SECTION */}
                <div className="space-y-3.5">
                  <span className="text-[9px] font-extrabold text-muted-foreground/75 tracking-wider uppercase block select-none">Pipeline</span>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/80 font-bold"># DELIVERY ID</span>
                      <span className="font-bold text-foreground">Del-3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/80 font-bold">FLOW TYPE</span>
                      <span className="font-bold text-foreground">Collect</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/80 font-bold">SCHEDULE</span>
                      <span className="font-bold text-foreground">Ad-hoc</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/80 font-bold">DATA CONNECTOR</span>
                      <span className="font-bold text-muted-foreground">—</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/80 font-bold">LAYERS</span>
                      <span className="font-bold text-foreground">4</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/80 font-bold">MAX ATTEMPT</span>
                      <span className="font-bold text-foreground">#1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/80 font-bold">TRIGGERED BY</span>
                      <span className="font-bold text-foreground">Scheduler</span>
                    </div>
                  </div>
                </div>

                {/* SOURCE & TARGET SECTION */}
                <div className="space-y-3.5 pt-4 border-t border-border/20">
                  <span className="text-[9px] font-extrabold text-muted-foreground/75 tracking-wider uppercase block select-none">Source & Target</span>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/80 font-bold">SOURCE NAME</span>
                      <span className="font-bold text-muted-foreground">—</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/80 font-bold">TARGET DATABASE</span>
                      <span className="font-bold text-foreground">DMT</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/80 font-bold">TARGET SDE</span>
                      <span className="font-bold text-muted-foreground">—</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/80 font-bold">REGISTER PATH</span>
                      <span className="font-bold text-blue-500 hover:underline cursor-pointer select-all break-all text-right">
                        Deliveries/DEMO-WF-1042
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Surface>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Jobs"
        description="Track, manage and monitor all data processing jobs across all flow types"
      />

      {/* 4 Summary Stats Cards with exact colors from Image 2 */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {/* TOTAL */}
        <div
          className={cn(
            "p-4 rounded-xl border flex flex-col justify-between h-[96px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
            isLight
              ? "bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/50 border-slate-200/90 text-slate-800 hover:border-indigo-300/60 shadow-xs"
              : "bg-gradient-to-br from-slate-950 via-slate-900/95 to-indigo-950/30 border-border/60 text-foreground hover:border-indigo-500/30"
          )}
        >
          <div className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground/80">Total</div>
          <div className="text-[32px] font-black leading-none mt-1">1</div>
        </div>

        {/* RUNNING */}
        <div
          className={cn(
            "p-4 rounded-xl border flex flex-col justify-between h-[96px]",
            isLight
              ? "bg-blue-50/70 border-blue-200 text-blue-900"
              : "bg-blue-500/5 border-blue-500/20 text-blue-400"
          )}
        >
          <div className="text-[12px] font-bold uppercase tracking-wider opacity-85">Running</div>
          <div className="text-[32px] font-black leading-none mt-1">1</div>
        </div>

        {/* COMPLETED */}
        <div
          className={cn(
            "p-4 rounded-xl border flex flex-col justify-between h-[96px]",
            isLight
              ? "bg-blue-50/70 border-blue-200 text-blue-900"
              : "bg-blue-500/5 border-blue-500/20 text-blue-400"
          )}
        >
          <div className="text-[12px] font-bold uppercase tracking-wider opacity-85">Completed</div>
          <div className="text-[32px] font-black leading-none mt-1">0</div>
        </div>

        {/* FAILED */}
        <div
          className={cn(
            "p-4 rounded-xl border flex flex-col justify-between h-[96px]",
            isLight
              ? "bg-rose-50/70 border-rose-200 text-rose-900"
              : "bg-rose-500/5 border-rose-500/20 text-rose-400"
          )}
        >
          <div className="text-[12px] font-bold uppercase tracking-wider opacity-85">Failed</div>
          <div className="text-[32px] font-black leading-none mt-1">0</div>
        </div>
      </div>

      {/* Main Table Workspace */}
      <Surface className="!p-0 overflow-hidden">
        {/* Filters ribbon matching Image 2 dropdown layout */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border/60 p-4">
          <div className="relative flex-grow min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by code or entity..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

          {/* Right-aligned filters group */}
          <div className="flex items-center gap-3 ml-auto flex-wrap shrink-0">
            {/* Flow Types Dropdown */}
            <Select value={flowFilter} onValueChange={setFlowFilter}>
              <SelectTrigger className="h-9 w-auto min-w-[140px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer">
                <SelectValue placeholder="All Flow Types" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="all-flow-types" className="cursor-pointer text-[13px]">All Flow Types</SelectItem>
                <SelectItem value="data-collection" className="cursor-pointer text-[13px]">Data Collection</SelectItem>
                <SelectItem value="primary-delivery" className="cursor-pointer text-[13px]">Primary Delivery</SelectItem>
                <SelectItem value="delta-sync" className="cursor-pointer text-[13px]">Delta Sync</SelectItem>
              </SelectContent>
            </Select>

            {/* Statuses Dropdown */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-auto min-w-[130px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="all-statuses" className="cursor-pointer text-[13px]">All Statuses</SelectItem>
                <SelectItem value="running" className="cursor-pointer text-[13px]">Running</SelectItem>
                <SelectItem value="completed" className="cursor-pointer text-[13px]">Completed</SelectItem>
                <SelectItem value="warning" className="cursor-pointer text-[13px]">Warning</SelectItem>
                <SelectItem value="failed" className="cursor-pointer text-[13px]">Failed</SelectItem>
                <SelectItem value="pending" className="cursor-pointer text-[13px]">Pending</SelectItem>
              </SelectContent>
            </Select>

            {/* Reload action */}
            <button
              onClick={() => {
                setQuery("");
                setFlowFilter("all-flow-types");
                setStatusFilter("all-statuses");
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/50 text-muted-foreground hover:text-foreground transition cursor-pointer"
              title="Reload table"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Record counter indicator */}
            <span className="text-[12.5px] font-semibold text-muted-foreground ml-1">
              {filteredJobs.length} of {jobsList.length}
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground/80">
                <th className="px-5 py-3.5 table-sticky-single-left">Delivery</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Entity</th>
                <th className="px-5 py-3.5">Layers</th>
                <th className="px-5 py-3.5">Pipeline</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Submitted</th>
                <th className="px-5 py-3.5 text-right table-sticky-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((j) => (
                  <tr key={j.delivery} className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition">
                    {/* Delivery */}
                    <td className="px-5 py-4 table-sticky-single-left">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                          <Layers className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <div className="font-extrabold text-foreground">{j.delivery}</div>
                          <div className="text-[11.5px] text-muted-foreground mt-0.5">{j.subtitle}</div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 text-[13.5px] text-foreground font-semibold">
                      {j.type}
                    </td>

                    {/* Entity Acronym */}
                    <td className="px-5 py-4 text-[13.5px] text-foreground font-bold font-mono">
                      {j.entity}
                    </td>

                    {/* Layers Count */}
                    <td className="px-5 py-4 text-[13.5px] text-foreground font-semibold">
                      {j.layers}
                    </td>

                    {/* Pipeline Status Dot Ribbon */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {j.pipeline.map((s, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <span className={cn(
                              "h-2 w-2 rounded-full",
                              s === "done" ? "bg-blue-500" : "bg-slate-400"
                            )} />
                            {i < j.pipeline.length - 1 && <span className="h-px w-2 bg-border/80" />}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1 text-[11px] font-semibold text-muted-foreground">{j.pipelineLabel}</div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className="text-[13px] font-bold text-blue-500">
                        {j.status}
                      </span>
                    </td>

                    {/* Submitted Timestamp */}
                    <td className="px-5 py-4 text-[13px] text-muted-foreground font-semibold">
                      {j.submitted}
                    </td>

                    {/* Actions formatted perfectly to match Image 2 colors */}
                    <td className="px-5 py-4 table-sticky-actions text-right !overflow-visible">
                      <TooltipProvider delayDuration={50}>
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* View details */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setViewingJobId(j.delivery)}
                                className="h-7 w-7 flex items-center justify-center rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/15 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={5}
                              className="bg-white text-slate-800 font-bold border border-slate-200 shadow-md text-xs py-1.5 px-3 rounded-lg select-none pointer-events-none"
                            >
                              View details
                            </TooltipContent>
                          </Tooltip>

                          {/* Edit details */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleOpenEdit(j)}
                                className="h-7 w-7 flex items-center justify-center rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/15 cursor-pointer"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={5}
                              className="bg-white text-slate-800 font-bold border border-slate-200 shadow-md text-xs py-1.5 px-3 rounded-lg select-none pointer-events-none"
                            >
                              Edit details
                            </TooltipContent>
                          </Tooltip>
                          
                          {/* Monitor Link */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                to="/operations/workflow"
                                className="h-7 w-7 flex items-center justify-center rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/15 cursor-pointer"
                              >
                                <GitBranch className="h-3.5 w-3.5" />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={5}
                              className="bg-white text-slate-800 font-bold border border-slate-200 shadow-md text-xs py-1.5 px-3 rounded-lg select-none pointer-events-none"
                            >
                              View Monitor
                            </TooltipContent>
                          </Tooltip>

                          {/* Delete */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleOpenDelete(j)}
                                className="h-7 w-7 flex items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/15 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={5}
                              className="bg-white text-slate-800 font-bold border border-slate-200 shadow-md text-xs py-1.5 px-3 rounded-lg select-none pointer-events-none"
                            >
                              Delete
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    No jobs matching active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginator */}
        <TablePagination
          totalItems={filteredJobs.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="job"
          itemNamePlural="jobs"
        />
      </Surface>

      {/* ============================================== */}
      {/* EDIT JOB DIALOG MODAL (1st Image)              */}
      {/* ============================================== */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[460px] border border-border bg-card text-foreground p-0 shadow-glow rounded-2xl overflow-hidden">
          <div className="p-6 space-y-5">
            {/* Title with edit icon */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-inner">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-[16px] font-bold text-foreground">Edit Job</DialogTitle>
                <span className="text-[11px] font-bold text-muted-foreground block mt-0.5 uppercase tracking-wide">
                  {selectedJob ? `${selectedJob.delivery === "Del-3" ? "DEMO-WF-1042" : selectedJob.delivery} - #3` : "DEMO-WF-1042 - #3"}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveChanges} className="space-y-4">
              {/* Status Selector */}
              <div className="space-y-1.5 text-xs font-bold">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="h-10 border-border bg-background text-xs cursor-pointer">
                    <SelectValue placeholder="Running" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border font-bold text-xs">
                    <SelectItem value="Pending" className="cursor-pointer">Pending</SelectItem>
                    <SelectItem value="Running" className="cursor-pointer">Running</SelectItem>
                    <SelectItem value="Completed" className="cursor-pointer">Completed</SelectItem>
                    <SelectItem value="Failed" className="cursor-pointer">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Remarks Textarea */}
              <div className="space-y-1.5 text-xs font-bold">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Remarks</label>
                <textarea
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="Optional notes..."
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none font-semibold"
                />
              </div>

              {/* Error banner block exactly as in 1st image */}
              {showErrorBanner && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-2.5 flex items-center gap-2.5 text-xs font-bold shadow-soft">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>Request failed (HTTP 500).</span>
                </div>
              )}

              {/* Footer actions */}
              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="h-9 px-4 font-bold text-xs bg-transparent border-border hover:bg-muted text-muted-foreground rounded-lg cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-soft"
                >
                  <Check className="h-4 w-4 text-white" /> Save Changes
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================== */}
      {/* DELETE JOB CONFIRMATION MODAL (4th Image)       */}
      {/* ============================================== */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-[420px] border border-border bg-card text-foreground p-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-6 space-y-4">
            {/* Red alert container header */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-[15px] font-bold text-foreground">Delete this job?</DialogTitle>
                <span className="text-[12px] font-bold text-muted-foreground/80 block">
                  {selectedJob ? selectedJob.delivery : "Del-3"}
                </span>
              </div>
            </div>

            <p className="text-[12px] text-muted-foreground/85 leading-relaxed font-semibold">
              This permanently deletes the delivery and all its pipeline jobs. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border/20">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="h-9 px-4 font-bold text-xs bg-transparent border-border hover:bg-muted text-muted-foreground rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="h-9 px-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer rounded-lg shadow-soft"
              >
                <Trash2 className="h-3.5 w-3.5 text-white" /> Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
