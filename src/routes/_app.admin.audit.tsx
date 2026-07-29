import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  RefreshCw,
  Download,
  Search,
  FileText,
  Calendar,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  User,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/_app/admin/audit")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Data Automation Studio" },
      { name: "description", content: "Immutable audit trail across the platform." },
    ],
  }),
  component: AuditLogsComponent,
});

interface AuditEvent {
  id: string;
  method: "POST" | "PUT" | "DELETE" | "PATCH" | "VALIDATE" | "EXECUTE";
  actionType: "CREATE - C" | "UPDATE - U" | "DELETE - D" | "VALIDATE" | "EXECUTE";
  module: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "success" | "failed" | "warning";
  details: string;
  user: string;
  timestamp: string;
  ip: string;
  duration: string;
}

const ALL_EVENTS: AuditEvent[] = [
  // Page 1 (15 events)
  {
    id: "AUD-2026-04925",
    method: "POST",
    actionType: "CREATE - C",
    module: "Automation Tools",
    severity: "medium",
    status: "warning",
    details: "POST /DataAutomationAPI/admin/nodes — 400 (2ms)",
    user: "DAPortalAdmin",
    timestamp: "2026-07-28 14:05:30",
    ip: "unknown",
    duration: "2ms",
  },
  {
    id: "AUD-2026-04926",
    method: "PUT",
    actionType: "UPDATE - U",
    module: "Authentication",
    severity: "low",
    status: "success",
    details: "PUT /DataAutomationAPI/admin/setup-status/scenario — 200 (10ms)",
    user: "DAPortalAdmin",
    timestamp: "2026-07-28 14:05:30",
    ip: "unknown",
    duration: "10ms",
  },
  {
    id: "AUD-2026-04925",
    method: "POST",
    actionType: "CREATE - C",
    module: "Entities",
    severity: "medium",
    status: "warning",
    details: "POST /DataAutomationAPI/admin/nodes — 400 (3ms)",
    user: "DAPortalAdmin",
    timestamp: "2026-07-28 14:05:20",
    ip: "unknown",
    duration: "3ms",
  },
  {
    id: "AUD-2026-04922",
    method: "PUT",
    actionType: "UPDATE - U",
    module: "Representatives",
    severity: "low",
    status: "success",
    details: "PUT /DataAutomationAPI/admin/setup-status/scenario — 200 (10ms)",
    user: "DAPortalAdmin",
    timestamp: "2026-07-28 14:05:20",
    ip: "unknown",
    duration: "10ms",
  },
  {
    id: "AUD-2026-04921",
    method: "POST",
    actionType: "CREATE - C",
    module: "Data Layers",
    severity: "medium",
    status: "warning",
    details: "POST /DataAutomationAPI/admin/nodes — 400 (4ms)",
    user: "DAPortalAdmin",
    timestamp: "2026-07-28 14:05:12",
    ip: "unknown",
    duration: "4ms",
  },
  {
    id: "AUD-2026-04920",
    method: "PUT",
    actionType: "UPDATE - U",
    module: "Data Sources",
    severity: "low",
    status: "success",
    details: "PUT /DataAutomationAPI/admin/setup-status/scenario — 200 (120ms)",
    user: "DAPortalAdmin",
    timestamp: "2026-07-28 14:05:12",
    ip: "unknown",
    duration: "120ms",
  },
  {
    id: "AUD-2026-04919",
    method: "POST",
    actionType: "CREATE - C",
    module: "Deliveries",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/schedules/13/trigger — 201 (121ms)",
    user: "DAPortalAdmin",
    timestamp: "2026-07-28 12:11:29",
    ip: "unknown",
    duration: "121ms",
  },
  {
    id: "AUD-2026-04918",
    method: "PATCH",
    actionType: "UPDATE - U",
    module: "Schedules",
    severity: "medium",
    status: "warning",
    details: "PATCH /DataAutomationAPI/schedules/13/toggle — 400 (181ms)",
    user: "DAPortalAdmin",
    timestamp: "2026-07-28 12:11:26",
    ip: "unknown",
    duration: "181ms",
  },
  {
    id: "AUD-2026-04917",
    method: "POST",
    actionType: "CREATE - C",
    module: "Workflow",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/onboarding-data-sources/test-connection — 200 (3279ms)",
    user: "—",
    timestamp: "2026-07-28 11:53:27",
    ip: "unknown",
    duration: "3.3s",
  },
  {
    id: "AUD-2026-04915",
    method: "EXECUTE",
    actionType: "EXECUTE",
    module: "Layer Processing",
    severity: "medium",
    status: "failed",
    details: "Engine TEST_CONNECTION: TCP connect failed: [Errno 11001] getaddrinfo failed",
    user: "—",
    timestamp: "2026-07-28 11:53:27",
    ip: "unknown",
    duration: "3.3s",
  },
  {
    id: "AUD-2026-04916",
    method: "VALIDATE",
    actionType: "VALIDATE",
    module: "Quality Rules",
    severity: "medium",
    status: "failed",
    details: "aedfv\nTest Connection Failed",
    user: "—",
    timestamp: "2026-07-28 11:53:27",
    ip: "unknown",
    duration: "3.3s",
  },
  {
    id: "AUD-2026-04914",
    method: "VALIDATE",
    actionType: "VALIDATE",
    module: "Metadata",
    severity: "low",
    status: "success",
    details: "aedfv\nTest Connection Started",
    user: "—",
    timestamp: "2026-07-28 11:53:24",
    ip: "unknown",
    duration: "3.3s",
  },
  {
    id: "AUD-2026-04913",
    method: "POST",
    actionType: "CREATE - C",
    module: "Geodatabase",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (163ms)",
    user: "—",
    timestamp: "2026-07-28 08:50:47",
    ip: "unknown",
    duration: "163ms",
  },
  {
    id: "AUD-2026-04912",
    method: "POST",
    actionType: "CREATE - C",
    module: "DB Mapping",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (140ms)",
    user: "—",
    timestamp: "2026-07-28 08:43:09",
    ip: "unknown",
    duration: "140ms",
  },
  {
    id: "AUD-2026-04911",
    method: "POST",
    actionType: "CREATE - C",
    module: "Schema",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (140ms)",
    user: "—",
    timestamp: "2026-07-28 05:49:18",
    ip: "unknown",
    duration: "140ms",
  },
  // Page 2 (15 events)
  {
    id: "AUD-2026-04910",
    method: "POST",
    actionType: "CREATE - C",
    module: "Settings",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (158ms)",
    user: "—",
    timestamp: "2026-07-28 05:12:11",
    ip: "unknown",
    duration: "158ms",
  },
  {
    id: "AUD-2026-04909",
    method: "POST",
    actionType: "CREATE - C",
    module: "Users",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (171ms)",
    user: "—",
    timestamp: "2026-07-28 04:51:08",
    ip: "unknown",
    duration: "171ms",
  },
  {
    id: "AUD-2026-04908",
    method: "POST",
    actionType: "CREATE - C",
    module: "Roles",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (145ms)",
    user: "—",
    timestamp: "2026-07-27 07:08:14",
    ip: "unknown",
    duration: "145ms",
  },
  {
    id: "AUD-2026-04907",
    method: "POST",
    actionType: "CREATE - C",
    module: "Lookups",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (124ms)",
    user: "—",
    timestamp: "2026-07-24 06:18:29",
    ip: "unknown",
    duration: "124ms",
  },
  {
    id: "AUD-2026-04906",
    method: "POST",
    actionType: "CREATE - C",
    module: "System",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (142ms)",
    user: "—",
    timestamp: "2026-07-22 14:35:52",
    ip: "unknown",
    duration: "142ms",
  },
  {
    id: "AUD-2026-04905",
    method: "PATCH",
    actionType: "UPDATE - U",
    module: "System",
    severity: "low",
    status: "success",
    details: "PATCH /DataAutomationAPI/quality-rules/11/toggle — 200 (33ms)",
    user: "DAPortalAdmin",
    timestamp: "2026-07-22 13:10:32",
    ip: "unknown",
    duration: "33ms",
  },
  {
    id: "AUD-2026-04904",
    method: "PATCH",
    actionType: "UPDATE - U",
    module: "System",
    severity: "low",
    status: "success",
    details: "PATCH /DataAutomationAPI/quality-rules/11/toggle — 200 (233ms)",
    user: "DAPortalAdmin",
    timestamp: "2026-07-22 13:10:29",
    ip: "unknown",
    duration: "233ms",
  },
  {
    id: "AUD-2026-04903",
    method: "POST",
    actionType: "CREATE - C",
    module: "System",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (150ms)",
    user: "—",
    timestamp: "2026-07-22 13:00:24",
    ip: "unknown",
    duration: "150ms",
  },
  {
    id: "AUD-2026-04902",
    method: "POST",
    actionType: "CREATE - C",
    module: "System",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (146ms)",
    user: "—",
    timestamp: "2026-07-22 11:43:59",
    ip: "unknown",
    duration: "146ms",
  },
  {
    id: "AUD-2026-04901",
    method: "POST",
    actionType: "CREATE - C",
    module: "System",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (145ms)",
    user: "—",
    timestamp: "2026-07-22 10:40:10",
    ip: "unknown",
    duration: "145ms",
  },
  {
    id: "AUD-2026-04900",
    method: "POST",
    actionType: "CREATE - C",
    module: "System",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (187ms)",
    user: "—",
    timestamp: "2026-07-22 09:24:20",
    ip: "unknown",
    duration: "187ms",
  },
  {
    id: "AUD-2026-04899",
    method: "POST",
    actionType: "CREATE - C",
    module: "System",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (113ms)",
    user: "—",
    timestamp: "2026-07-22 08:23:38",
    ip: "unknown",
    duration: "113ms",
  },
  {
    id: "AUD-2026-04898",
    method: "POST",
    actionType: "CREATE - C",
    module: "System",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (170ms)",
    user: "—",
    timestamp: "2026-07-22 08:23:23",
    ip: "unknown",
    duration: "170ms",
  },
  {
    id: "AUD-2026-04897",
    method: "POST",
    actionType: "CREATE - C",
    module: "System",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (170ms)",
    user: "—",
    timestamp: "2026-07-22 08:15:42",
    ip: "unknown",
    duration: "170ms",
  },
  {
    id: "AUD-2026-04896",
    method: "POST",
    actionType: "CREATE - C",
    module: "System",
    severity: "low",
    status: "success",
    details: "POST /DataAutomationAPI/auth/login — 200 (129ms)",
    user: "—",
    timestamp: "2026-07-22 07:29:45",
    ip: "unknown",
    duration: "129ms",
  },
];

function AuditLogsComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("7days");
  const [pageSize, setPageSize] = useState(15);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Audit logs refreshed");
    }, 600);
  };

  const handleExport = () => {
    toast.success("CSV export initiated");
  };

  // Filter events based on criteria
  const filteredEvents = ALL_EVENTS.filter((evt) => {
    // Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        evt.id.toLowerCase().includes(q) ||
        evt.details.toLowerCase().includes(q) ||
        evt.user.toLowerCase().includes(q) ||
        evt.module.toLowerCase().includes(q) ||
        evt.actionType.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }
    // Module filter
    if (selectedModule !== "all" && evt.module.toLowerCase() !== selectedModule.toLowerCase()) {
      return false;
    }
    // Action filter
    if (selectedAction !== "all") {
      const act = selectedAction.toLowerCase();
      const method = evt.method.toLowerCase();
      const actionType = evt.actionType.toLowerCase();
      const isMatch =
        method === act ||
        actionType.includes(act) ||
        (act === "create" && (method === "post" || actionType.includes("create"))) ||
        (act === "update" && (method === "put" || method === "patch" || actionType.includes("update")));
      if (!isMatch) return false;
    }
    // Severity filter
    if (selectedSeverity !== "all" && evt.severity.toLowerCase() !== selectedSeverity.toLowerCase()) {
      return false;
    }
    // Status filter
    if (selectedStatus !== "all" && evt.status.toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }
    return true;
  });

  // Paginated events
  const totalCount = filteredEvents.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-5 p-6 animate-fade-in">
      {/* Top Header Block */}
      <div className="flex items-center justify-between select-none">
        <PageHeader
          eyebrow="Administration"
          title="Audit Logs"
          description="Complete immutable audit trail of all system actions across every module"
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="h-9 w-9 bg-card cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className={cn("h-4 w-4 text-muted-foreground", isRefreshing && "animate-spin")} />
          </Button>

          <Button
            onClick={handleExport}
            className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-soft"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Statistics Row (8 boxes matching images) */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 select-none text-xs font-semibold">
        {/* Total Events */}
        <Surface className="bg-card text-foreground !rounded-xl border border-border shadow-sm shrink-0" padded={false}>
          <div className="flex items-center justify-between gap-2.5 px-4 h-[62px] w-full">
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wide block leading-none truncate">Total Events</span>
              <span className="text-xs font-extrabold text-foreground mt-1.5 block leading-none">4925</span>
            </div>
            <FileText className="h-4.5 w-4.5 text-primary shrink-0" />
          </div>
        </Surface>

        {/* Today */}
        <Surface className="bg-card text-foreground !rounded-xl border border-border shadow-sm shrink-0" padded={false}>
          <div className="flex items-center justify-between gap-2.5 px-4 h-[62px] w-full">
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wide block leading-none truncate">Today</span>
              <span className="text-xs font-extrabold text-foreground mt-1.5 block leading-none">17</span>
            </div>
            <Calendar className="h-4.5 w-4.5 text-purple-400 shrink-0" />
          </div>
        </Surface>

        {/* Critical */}
        <Surface className="bg-card text-foreground !rounded-xl border border-border shadow-sm shrink-0" padded={false}>
          <div className="flex items-center justify-between gap-2.5 px-4 h-[62px] w-full">
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wide block leading-none truncate">Critical</span>
              <span className="text-xs font-extrabold text-foreground mt-1.5 block leading-none">0</span>
            </div>
            <AlertTriangle className="h-4.5 w-4.5 text-red-500 shrink-0" />
          </div>
        </Surface>

        {/* Failed */}
        <Surface className="bg-card text-foreground !rounded-xl border border-border shadow-sm shrink-0" padded={false}>
          <div className="flex items-center justify-between gap-2.5 px-4 h-[62px] w-full">
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wide block leading-none truncate">Failed</span>
              <span className="text-xs font-extrabold text-foreground mt-1.5 block leading-none">171</span>
            </div>
            <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
          </div>
        </Surface>

        {/* Success Rate */}
        <Surface className="bg-card text-foreground !rounded-xl border border-border shadow-sm shrink-0" padded={false}>
          <div className="flex items-center justify-between gap-2.5 px-4 h-[62px] w-full">
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wide block leading-none truncate">Success Rate</span>
              <span className="text-xs font-extrabold text-emerald-400 mt-1.5 block leading-none">94%</span>
            </div>
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          </div>
        </Surface>

        {/* Data Changes */}
        <Surface className="bg-card text-foreground !rounded-xl border border-border shadow-sm shrink-0" padded={false}>
          <div className="flex items-center justify-between gap-2.5 px-4 h-[62px] w-full">
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wide block leading-none truncate">Data Changes</span>
              <span className="text-xs font-extrabold text-foreground mt-1.5 block leading-none">14</span>
            </div>
            <RefreshCw className="h-4.5 w-4.5 text-violet-400 shrink-0" />
          </div>
        </Surface>

        {/* Active Users */}
        <Surface className="bg-card text-foreground !rounded-xl border border-border shadow-sm shrink-0" padded={false}>
          <div className="flex items-center justify-between gap-2.5 px-4 h-[62px] w-full">
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wide block leading-none truncate">Active Users</span>
              <span className="text-xs font-extrabold text-foreground mt-1.5 block leading-none">1</span>
            </div>
            <User className="h-4.5 w-4.5 text-primary shrink-0" />
          </div>
        </Surface>

        {/* Avg Response */}
        <Surface className="bg-card text-foreground !rounded-xl border border-border shadow-sm shrink-0" padded={false}>
          <div className="flex items-center justify-between gap-2.5 px-4 h-[62px] w-full">
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wide block leading-none truncate">Avg Response</span>
              <span className="text-xs font-extrabold text-teal-400 mt-1.5 block leading-none">288ms</span>
            </div>
            <Clock className="h-4.5 w-4.5 text-teal-400 shrink-0" />
          </div>
        </Surface>
      </div>

      {/* Operations Metric Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 select-none text-xs font-semibold pt-1">
        {/* CREATE */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4.5 flex items-center justify-between h-[64px] relative overflow-hidden shadow-sm">
          <span className="text-[11px] text-emerald-500 font-extrabold uppercase tracking-wider">CREATE</span>
          <span className="text-2xl font-black text-emerald-500">10</span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500/20">
            <div className="h-full bg-emerald-400 w-1/3 rounded-r" />
          </div>
        </div>

        {/* READ */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4.5 flex items-center justify-between h-[64px] relative overflow-hidden shadow-sm">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">READ</span>
          <span className="text-2xl font-black text-slate-400 dark:text-slate-500">0</span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800" />
        </div>

        {/* UPDATE */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4.5 flex items-center justify-between h-[64px] relative overflow-hidden shadow-sm">
          <span className="text-[11px] text-blue-500 font-extrabold uppercase tracking-wider">UPDATE</span>
          <span className="text-2xl font-black text-blue-500">4</span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500/20">
            <div className="h-full bg-blue-500 w-1/4 rounded-r" />
          </div>
        </div>

        {/* DELETE */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-4.5 flex items-center justify-between h-[64px] relative overflow-hidden shadow-sm">
          <span className="text-[11px] text-red-500 font-extrabold uppercase tracking-wider">DELETE</span>
          <span className="text-2xl font-black text-red-500">0</span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500/20" />
        </div>
      </div>

      {/* Live & active user count row */}
      <div className="flex items-center justify-between gap-3 select-none text-xs font-bold pt-1">
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground/80 font-bold">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live — 17 events today
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground/60" />
            1 active user today
          </div>
        </div>
      </div>

      {/* Search & Filters Row */}
      <div className="flex flex-wrap gap-2.5 items-center select-none">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search event ID, user, resource, IP..."
            className="h-9.5 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-semibold"
          />
        </div>

        {/* Filters dropdowns */}
        <div className="flex flex-wrap gap-2 items-center text-xs font-bold text-foreground">
          <select
            value={selectedModule}
            onChange={(e) => {
              setSelectedModule(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9.5 rounded-lg border border-border bg-card pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground appearance-none bg-no-repeat bg-[right_10px_center] bg-[size:14px_14px]"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`
            }}
          >
            <option value="all">All Modules</option>
            <option value="Authentication">Authentication</option>
            <option value="Entities">Entities</option>
            <option value="Representatives">Representatives</option>
            <option value="Data Layers">Data Layers</option>
            <option value="Data Sources">Data Sources</option>
            <option value="Deliveries">Deliveries</option>
            <option value="Schedules">Schedules</option>
            <option value="Workflow">Workflow</option>
            <option value="Layer Processing">Layer Processing</option>
            <option value="Quality Rules">Quality Rules</option>
            <option value="Metadata">Metadata</option>
            <option value="Geodatabase">Geodatabase</option>
            <option value="DB Mapping">DB Mapping</option>
            <option value="Schema">Schema</option>
            <option value="Settings">Settings</option>
            <option value="Users">Users</option>
            <option value="Roles">Roles</option>
            <option value="System">System</option>
            <option value="Lookups">Lookups</option>
            <option value="Insights">Insights</option>
            <option value="Data Themes">Data Themes</option>
            <option value="Automation Tools">Automation Tools</option>
          </select>

          <select
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9.5 rounded-lg border border-border bg-card pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground appearance-none bg-no-repeat bg-[right_10px_center] bg-[size:14px_14px]"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`
            }}
          >
            <option value="all">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="BULK DELETE">BULK DELETE</option>
            <option value="VIEW">VIEW</option>
            <option value="EXPORT">EXPORT</option>
            <option value="IMPORT">IMPORT</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="LOGIN FAILED">LOGIN FAILED</option>
            <option value="SESSION EXPIRED">SESSION EXPIRED</option>
            <option value="SYNC">SYNC</option>
            <option value="EXECUTE">EXECUTE</option>
            <option value="SUBMIT">SUBMIT</option>
            <option value="VALIDATE">VALIDATE</option>
            <option value="PUBLISH">PUBLISH</option>
            <option value="CONFIGURE">CONFIGURE</option>
            <option value="COMPRESS">COMPRESS</option>
            <option value="REGISTER">REGISTER</option>
            <option value="LOCK">LOCK</option>
            <option value="UNLOCK">UNLOCK</option>
            <option value="SECURITY ALERT">SECURITY ALERT</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => {
              setSelectedSeverity(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9.5 rounded-lg border border-border bg-card pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground appearance-none bg-no-repeat bg-[right_10px_center] bg-[size:14px_14px]"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`
            }}
          >
            <option value="all">All Severities</option>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="critical">critical</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9.5 rounded-lg border border-border bg-card pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground appearance-none bg-no-repeat bg-[right_10px_center] bg-[size:14px_14px]"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`
            }}
          >
            <option value="all">All Statuses</option>
            <option value="success">success</option>
            <option value="failed">failed</option>
            <option value="warning">warning</option>
          </select>

          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="h-9.5 rounded-lg border border-border bg-card pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground appearance-none bg-no-repeat bg-[right_10px_center] bg-[size:14px_14px]"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`
            }}
          >
            <option value="7days">Last 7 days</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="30days">Last 30 days</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-9.5 rounded-lg border border-border bg-card pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground appearance-none bg-no-repeat bg-[right_10px_center] bg-[size:14px_14px]"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`
            }}
          >
            <option value={15}>15 events</option>
            <option value={30}>30 events</option>
            <option value={50}>50 events</option>
          </select>
        </div>
      </div>

      {/* Main Audit Logs events feed */}
      <div className="space-y-2.5">
        {paginatedEvents.length === 0 ? (
          <Surface className="p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60">
            <Info className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            No audit logs match the current search or filtration criteria.
          </Surface>
        ) : (
          paginatedEvents.map((evt) => (
            <Surface key={evt.id} className="p-3.5 border border-border/50 hover:bg-[#070b13]/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {/* Event identifier and tags */}
                <div className="flex flex-wrap items-center gap-2 font-extrabold">
                  {/* Status dot */}
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      evt.status === "success" && "bg-emerald-500",
                      evt.status === "warning" && "bg-amber-500",
                      evt.status === "failed" && "bg-rose-500"
                    )}
                  />

                  {/* ID */}
                  <span className="text-muted-foreground font-mono text-[11px]">{evt.id}</span>

                  {/* Method */}
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wide",
                      evt.method === "POST" && "bg-blue-600/10 text-primary border border-blue-600/25",
                      evt.method === "PUT" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
                      evt.method === "DELETE" && "bg-rose-500/10 text-rose-400 border border-rose-500/25",
                      evt.method === "PATCH" && "bg-amber-500/10 text-amber-400 border border-amber-500/25",
                      evt.method === "VALIDATE" && "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25",
                      evt.method === "EXECUTE" && "bg-purple-500/10 text-purple-400 border border-purple-500/25"
                    )}
                  >
                    {evt.method}
                  </span>

                  {/* Action Type */}
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-extrabold",
                      evt.actionType.startsWith("CREATE") && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
                      evt.actionType.startsWith("UPDATE") && "bg-blue-500/10 text-primary border border-blue-500/25",
                      evt.actionType.startsWith("EXECUTE") && "bg-purple-500/10 text-purple-400 border border-purple-500/25",
                      evt.actionType.startsWith("VALIDATE") && "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                    )}
                  >
                    {evt.actionType}
                  </span>

                  {/* Module */}
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/25 uppercase">
                    {evt.module}
                  </span>

                  {/* Severity */}
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] border uppercase",
                      evt.severity === "low" && "border-blue-500/20 text-primary bg-blue-500/5",
                      evt.severity === "medium" && "border-amber-500/20 text-amber-500 bg-amber-500/5",
                      evt.severity === "high" && "border-orange-500/20 text-orange-500 bg-orange-500/5",
                      evt.severity === "critical" && "border-red-500/20 text-red-500 bg-red-500/5"
                    )}
                  >
                    {evt.severity}
                  </span>

                  {/* Status if warn or failed */}
                  {evt.status !== "success" && (
                    <span
                      className={cn(
                        "px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase",
                        evt.status === "warning" && "bg-amber-500/15 text-amber-500 border border-amber-500/30",
                        evt.status === "failed" && "bg-red-500/15 text-red-400 border border-red-500/30"
                      )}
                    >
                      {evt.status === "warning" ? "WARN" : "FAILED"}
                    </span>
                  )}
                </div>

                {/* Duration */}
                <div className="text-[10px] text-muted-foreground/80 font-semibold font-mono">
                  {evt.duration}
                </div>
              </div>

              {/* Event detail description */}
              <div className="mt-2.5 pl-4 text-xs font-semibold text-foreground/90 whitespace-pre-line leading-relaxed">
                {evt.details}
              </div>

              {/* Event metadata footer */}
              <div className="mt-2 pl-4 flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground font-semibold">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground/50" />
                  {evt.user}
                </div>
                <div>
                  🕒 {evt.timestamp}
                </div>
                <div>
                  IP: {evt.ip}
                </div>
              </div>
            </Surface>
          ))
        )}
      </div>

      {/* Pagination Row */}
      <div className="flex items-center justify-between select-none pt-3 border-t border-border/40 text-xs font-semibold">
        <span className="text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + pageSize, totalCount)} of {totalCount} events
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="h-8.5 px-3 flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.ceil(totalCount / pageSize) }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "h-8.5 w-8.5 p-0 font-extrabold",
                  currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                )}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, Math.ceil(totalCount / pageSize)))}
            disabled={currentPage === Math.ceil(totalCount / pageSize)}
            className="h-8.5 px-3 flex items-center gap-1 transition-colors"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
