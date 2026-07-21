import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  RefreshCw,
  Search,
  Filter,
  Package,
  PieChart,
  Percent,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ListChecks,
  ShieldAlert,
  Repeat,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/quality/monitor")({
  head: () => ({
    meta: [
      { title: "Data Quality — Data Automation Studio" },
      {
        name: "description",
        content:
          "QA/QC results across all deliveries — status, metrics, and per-delivery detail.",
      },
    ],
  }),
  component: DataQualityPage,
});

type Tone =
  | "neutral"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "primary"
  | "secondary";

type Stat = {
  label: string;
  value: string;
  sub?: string;
  tone: Tone;
  icon: React.ComponentType<{ className?: string }>;
};

const statsRow1: Stat[] = [
  { label: "Deliveries", value: "1", tone: "neutral", icon: Package },
  { label: "QA Coverage", value: "0%", sub: "0/1", tone: "neutral", icon: PieChart },
  { label: "Pass Rate", value: "—", tone: "success", icon: Percent },
  { label: "Passed", value: "0", tone: "neutral", icon: CheckCircle2 },
  { label: "Failed", value: "0", tone: "danger", icon: XCircle },
  { label: "Partial", value: "0", tone: "warning", icon: AlertTriangle },
];

const statsRow2: Stat[] = [
  { label: "Pending QA", value: "1", tone: "neutral", icon: Clock },
  { label: "Rules Run", value: "0", tone: "neutral", icon: ListChecks },
  { label: "Failures", value: "0", tone: "danger", icon: ShieldAlert },
  { label: "Transforms", value: "0", tone: "secondary", icon: Repeat },
];

const rows = [
  {
    delivery: "DEMO-WF-1042",
    stakeholder: "Abu Dhabi Digital Authority",
    status: "QA not run",
  },
];

function toneClasses(tone: Tone) {
  switch (tone) {
    case "success":
      return {
        card: "glossy-card--success",
        icon: "text-success",
        value: "text-success",
      };
    case "danger":
      return {
        card: "glossy-card--danger",
        icon: "text-danger",
        value: "text-danger",
      };
    case "warning":
      return {
        card: "glossy-card--warning",
        icon: "text-warning",
        value: "text-warning",
      };
    case "info":
      return {
        card: "glossy-card--info",
        icon: "text-info",
        value: "text-info",
      };
    case "primary":
      return {
        card: "glossy-card--primary",
        icon: "text-accent",
        value: "text-accent",
      };
    case "secondary":
      return {
        card: "glossy-card--secondary",
        icon: "text-[color:var(--secondary-accent)]",
        value: "text-[color:var(--secondary-accent)]",
      };
    default:
      return {
        card: "",
        icon: "text-muted-foreground",
        value: "text-foreground",
      };
  }
}

function StatCard({ s }: { s: Stat }) {
  const t = toneClasses(s.tone);
  return (
    <Surface className={cn("glossy-card !p-4", t.card)}>
      <div className="flex items-start justify-between">
        <div className="text-[13px] font-semibold tracking-wide text-muted-foreground">
          {s.label}
        </div>
        <s.icon className={cn("h-4 w-4", t.icon)} />
      </div>
      <div
        className={cn(
          "mt-2 font-numeric text-[32px] font-bold leading-none tracking-tight",
          t.value,
        )}
      >
        {s.value}
      </div>
      {s.sub && (
        <div className="mt-1 font-numeric text-[13px] text-muted-foreground">
          {s.sub}
        </div>
      )}
    </Surface>
  );
}

function DataQualityPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.delivery.toLowerCase().includes(q) &&
          !r.stakeholder.toLowerCase().includes(q)
        )
          return false;
      }
      if (statusFilter !== "All Statuses" && r.status !== statusFilter) return false;
      return true;
    });
  }, [query, statusFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter]);

  const paginatedRows = useMemo(() => {
    return filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredRows, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Quality"
        description="QA/QC results across all deliveries — status, metrics, and per-delivery detail"
        actions={
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 text-[14px] font-medium text-foreground/80 transition hover:text-foreground hover:bg-card/80">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />

      {/* KPI Row 1 */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {statsRow1.map((s) => (
          <StatCard key={s.label} s={s} />
        ))}
      </div>

      {/* KPI Row 2 */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {statsRow2.map((s) => (
          <StatCard key={s.label} s={s} />
        ))}
      </div>

      {/* Search + Filter */}
      <Surface className="!p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-[300px] shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search delivery code or stakeholder..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-border/60 bg-card/50 pl-9 pr-8 text-[13px] font-medium text-foreground focus:outline-none appearance-none cursor-pointer"
            >
              <option>All Statuses</option>
              <option>QA not run</option>
              <option>Passed</option>
              <option>Failed</option>
              <option>Partial</option>
            </select>
          </div>
        </div>
      </Surface>

      {/* Table */}
      <Surface className="!p-0">
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/80">
                <Th className="table-sticky-single-left">Delivery</Th>
                <Th>Stakeholder</Th>
                <Th>Status</Th>
                <Th>Pass Rate</Th>
                <Th>Passed</Th>
                <Th>Failed</Th>
                <Th>Warned</Th>
                <Th>Failures</Th>
                <Th>Transforms</Th>
                <Th>Completed</Th>
                <Th className="table-sticky-actions">Export</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((r) => (
                <tr
                  key={r.delivery}
                  className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02]"
                >
                  <Td className="table-sticky-single-left">
                    <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {r.delivery}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-foreground/90">{r.stakeholder}</span>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted-foreground/15 px-2 py-1 text-[12px] font-medium text-muted-foreground ring-1 ring-inset ring-border/60">
                      {r.status}
                    </span>
                  </Td>
                  <Td><Dash /></Td>
                  <Td><Dash /></Td>
                  <Td><Dash /></Td>
                  <Td><Dash /></Td>
                  <Td><Dash /></Td>
                  <Td><Dash /></Td>
                  <Td><Dash /></Td>
                  <Td className="table-sticky-actions"><Dash /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          totalItems={filteredRows.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="delivery"
          itemNamePlural="deliveries"
        />
      </Surface>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("px-5 py-3 text-left whitespace-nowrap", className)}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-5 py-4 align-middle whitespace-nowrap", className)}>{children}</td>;
}
function Dash() {
  return <span className="text-muted-foreground/60">—</span>;
}
