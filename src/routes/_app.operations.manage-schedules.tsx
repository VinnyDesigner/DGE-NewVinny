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
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

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
  { label: "Total Executions", value: "0", hint: "All time", icon: Activity, tone: "info" },
  { label: "Active Schedules", value: "1", hint: "0 inactive", icon: Calendar, tone: "primary" },
  { label: "Total Success Deliveries", value: "0", hint: "All time", icon: CheckCircle2, tone: "success" },
  { label: "Failed Deliveries", value: "0", hint: "All time", icon: XCircle, tone: "danger" },
] as const;

const schedules = [
  {
    id: "SCH-001",
    status: "Active",
    name: "Test",
    priority: "Medium",
    entity: "ADDA",
    dataSource: "—",
    connector: "—",
    layers: 0,
    flowType: "Primary Delivery",
    frequency: "daily",
    lastRun: "—",
    nextRun: "2026-06-21 09:30",
    runs: 0,
  },
];

const tabs = ["All", "Active", "Inactive"];

function ManageSchedulesPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [tab, setTab] = useState("All");
  const [view, setView] = useState<"grid" | "list">("list");
  const [query, setQuery] = useState("");

  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
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

  return (
    <div className="space-y-6">
      <PageHeader

        title="Manage Schedules"
        description="Monitor and manage all automated delivery pipeline schedules across all flow types"
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-linear-to-r from-primary to-accent px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(59,130,246,0.5)]">
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
                  "rounded-md px-3 py-1 text-[13px] font-medium transition",
                  tab === t ? "bg-accent/20 text-accent ring-1 ring-inset ring-accent/40" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 text-[13px] font-medium text-foreground/80">
            All Frequencies <ChevronDown className="h-4 w-4 opacity-70" />
          </button>
          
          <div className="flex-1 min-w-[10px]" />

          <span className="text-[15px] text-muted-foreground">
            {filteredSchedules.length} {filteredSchedules.length === 1 ? "schedule" : "schedules"}
          </span>
          <div className="inline-flex items-center rounded-lg border border-border/60 bg-card/40 p-1">
            <button
              onClick={() => setView("grid")}
              className={cn("flex h-8 w-8 items-center justify-center rounded-md", view === "grid" ? "bg-accent/20 text-accent" : "text-muted-foreground")}
            ><LayoutGrid className="h-4 w-4" /></button>
            <button
              onClick={() => setView("list")}
              className={cn("flex h-8 w-8 items-center justify-center rounded-md", view === "list" ? "bg-accent/20 text-accent" : "text-muted-foreground")}
            ><List className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70">
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
                <th className="px-5 py-3 whitespace-nowrap table-sticky-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSchedules.map((s) => (
                <tr key={s.name} className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02]">
                  <td className="px-5 py-4 table-sticky-col-1-wide"><input type="checkbox" className="rounded border-border/60 bg-card/60 accent-accent" /></td>
                  <td className="px-5 py-4 table-sticky-col-2-wide">
                    <div className="font-semibold text-foreground">{s.name}</div>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-warning/15 px-1.5 py-0.5 text-[15px] font-medium text-warning ring-1 ring-inset ring-warning/25">{s.priority}</span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[16px] text-foreground/80">{s.entity}</td>
                  <td className="px-5 py-4 text-[15px] font-semibold text-foreground/80">{s.dataSource}</td>
                  <td className="px-5 py-4 text-[15px] font-semibold text-foreground/80">{s.connector}</td>
                  <td className="px-5 py-4 text-[15px] font-semibold text-foreground/80">{s.layers}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-info/15 px-2 py-1 text-[15px] font-medium text-info ring-1 ring-inset ring-info/25">
                      <span className="h-1.5 w-1.5 rounded-full bg-info" /> {s.flowType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[15px] font-semibold text-foreground/80">{s.frequency}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-[16px] text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {s.lastRun}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[16px] text-foreground/80">{s.nextRun}</td>
                  <td className="px-5 py-4 text-[16px] text-foreground/80">{s.runs}</td>
                  <td className="px-5 py-4 table-sticky-actions">
                    <div className="flex items-center gap-1">
                      <IconBtn tone="warning"><Pause className="h-4 w-4" /></IconBtn>
                      <IconBtn tone="success"><Zap className="h-4 w-4" /></IconBtn>
                      <IconBtn tone="info"><Eye className="h-4 w-4" /></IconBtn>
                      <IconBtn tone="primary"><Edit3 className="h-4 w-4" /></IconBtn>
                      <IconBtn tone="danger"><Trash2 className="h-4 w-4" /></IconBtn>
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
    </div>
  );
}

function SortTh({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn("px-5 py-3 whitespace-nowrap", className)}>
      <span className="inline-flex items-center gap-1">{children}<ChevronDown className="h-3 w-3 opacity-60" /></span>
    </th>
  );
}

function IconBtn({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <button className={cn(
      "flex h-8 w-8 items-center justify-center rounded-md ring-1 ring-inset transition",
      tone === "info" && "bg-info/10 text-info ring-info/25 hover:bg-info/20",
      tone === "success" && "bg-success/10 text-success ring-success/25 hover:bg-success/20",
      tone === "warning" && "bg-warning/10 text-warning ring-warning/25 hover:bg-warning/20",
      tone === "primary" && "bg-primary/10 text-accent ring-primary/25 hover:bg-primary/20",
      tone === "danger" && "bg-danger/10 text-danger ring-danger/25 hover:bg-danger/20",
    )}>{children}</button>
  );
}
