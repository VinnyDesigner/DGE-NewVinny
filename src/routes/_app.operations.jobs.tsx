import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/operations/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs — Data Automation Studio" },
      { name: "description", content: "Track, manage and monitor all data processing jobs across all flow types." },
    ],
  }),
  component: JobsPage,
});

// Single row of job matching the screenshot exactly
const initialJobs = [
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

  const [jobsList, setJobsList] = useState(initialJobs);
  const [query, setQuery] = useState("");
  const [flowFilter, setFlowFilter] = useState("all-flow-types");
  const [statusFilter, setStatusFilter] = useState("all-statuses");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
              : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
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
          <div className="relative w-full sm:w-[300px] shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by code or entity..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

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
              <SelectItem value="failed" className="cursor-pointer text-[13px]">Failed</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1 min-w-[10px]" />

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
          <span className="text-[12.5px] font-semibold text-muted-foreground ml-auto">
            1 of 1
          </span>
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
                              s === "done" ? "bg-emerald-500" : "bg-slate-400"
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
                    <td className="px-5 py-4 table-sticky-actions text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/15 cursor-pointer">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/15 cursor-pointer">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/15 cursor-pointer">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                        <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/15 cursor-pointer">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
    </div>
  );
}
