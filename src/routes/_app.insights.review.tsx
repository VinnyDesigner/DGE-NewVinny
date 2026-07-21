import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  Search,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
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

export const Route = createFileRoute("/_app/insights/review")({
  head: () => ({
    meta: [
      { title: "Data Review Assessment — Data Automation Studio" },
      { name: "description", content: "Validation results from the Data Quality Engine." },
    ],
  }),
  component: DataReviewPage,
});

// Mock Validation Results (16 records)
const initialValidationResults = [
  {
    id: "VR-001",
    layerName: "Road Network — Abu Dhabi Emirate",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    validationRule: "Topology Consistency Check",
    errors: 0,
    warnings: 7,
    reviewer: "Khalid Al Zaabi",
    reviewDate: "2026-03-14",
    status: "Warning",
  },
  {
    id: "VR-002",
    layerName: "Land Use Zoning — Al Ain",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    validationRule: "Coordinate Reference Validation",
    errors: 0,
    warnings: 0,
    reviewer: "Ahmed Al Mansouri",
    reviewDate: "2026-03-13",
    status: "Pass",
  },
  {
    id: "VR-003",
    layerName: "Ortho Imagery 2025 — Abu Dhabi",
    entity: "DGE",
    entityFullName: "Digital Government Entity",
    validationRule: "Resolution & Coverage Check",
    errors: 0,
    warnings: 1,
    reviewer: "Yousef Al Marzouqi",
    reviewDate: "2026-03-12",
    status: "Pass",
  },
  {
    id: "VR-004",
    layerName: "Air Quality Monitoring Stations",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    validationRule: "Attribute Completeness Check",
    errors: 3,
    warnings: 0,
    reviewer: "Noura Al Hamdan",
    reviewDate: "2026-03-11",
    status: "Fail",
  },
  {
    id: "VR-005",
    layerName: "Distribution Grid Topology",
    entity: "ADDC",
    entityFullName: "Abu Dhabi Distribution Company",
    validationRule: "Network Connectivity Check",
    errors: 1,
    warnings: 4,
    reviewer: "Omar Al Kindi",
    reviewDate: "2026-03-10",
    status: "Fail",
  },
  {
    id: "VR-006",
    layerName: "Terrain DEM — Al Dhafra Region",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    validationRule: "NoData Threshold Validation",
    errors: 0,
    warnings: 3,
    reviewer: "Mohammed Al Rashidi",
    reviewDate: "2026-03-09",
    status: "Warning",
  },
  {
    id: "VR-007",
    layerName: "Healthcare Facilities Register",
    entity: "ADHA",
    entityFullName: "Abu Dhabi Health Authority",
    validationRule: "Attribute Completeness Check",
    errors: 0,
    warnings: 0,
    reviewer: "Fatima Al Hashemi",
    reviewDate: "2026-03-08",
    status: "Pass",
  },
  {
    id: "VR-008",
    layerName: "Oil & Gas Pipeline Network",
    entity: "ADNOC",
    entityFullName: "Abu Dhabi National Oil Company",
    validationRule: "Geometry Validity Check",
    errors: 2,
    warnings: 1,
    reviewer: "Ahmed Al Mansouri",
    reviewDate: "2026-03-07",
    status: "Fail",
  },
  {
    id: "VR-009",
    layerName: "Master Plan Boundaries — Yas Island",
    entity: "ALDAR",
    entityFullName: "Aldar Properties",
    validationRule: "Coordinate Reference Validation",
    errors: 0,
    warnings: 0,
    reviewer: "Sara Al Dhaheri",
    reviewDate: "2026-03-06",
    status: "Pass",
  },
  {
    id: "VR-010",
    layerName: "Population Census Blocks 2025",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    validationRule: "Schema Compliance Check",
    errors: 0,
    warnings: 2,
    reviewer: "Khalid Al Zaabi",
    reviewDate: "2026-03-05",
    status: "Warning",
  },
  {
    id: "VR-011",
    layerName: "Building Permit Boundaries",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    validationRule: "Topology Consistency Check",
    errors: 5,
    warnings: 2,
    reviewer: "Khalid Al Zaabi",
    reviewDate: "2026-03-03",
    status: "Fail",
  },
  {
    id: "VR-012",
    layerName: "Protected Natural Areas",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    validationRule: "Attribute Completeness Check",
    errors: 0,
    warnings: 0,
    reviewer: "Noura Al Hamdan",
    reviewDate: "2026-03-01",
    status: "Pass",
  },
  {
    id: "VR-013",
    layerName: "Substations Network (Draft)",
    entity: "ADDC",
    entityFullName: "Abu Dhabi Distribution Company",
    validationRule: "Schema Compliance Check",
    errors: 4,
    warnings: 1,
    reviewer: "Omar Al Kindi",
    reviewDate: "2026-02-28",
    status: "Fail",
  },
  {
    id: "VR-014",
    layerName: "Smart City Sensor Network",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    validationRule: "Geometry Validity Check",
    errors: 0,
    warnings: 0,
    reviewer: "Ahmed Al Mansouri",
    reviewDate: "2026-02-25",
    status: "Pass",
  },
  {
    id: "VR-015",
    layerName: "Government Service Centres",
    entity: "DGE",
    entityFullName: "Digital Government Entity",
    validationRule: "Attribute Completeness Check",
    errors: 1,
    warnings: 0,
    reviewer: "Yousef Al Marzouqi",
    reviewDate: "2026-02-20",
    status: "Fail",
  },
  {
    id: "VR-016",
    layerName: "Ambulance Coverage Zones",
    entity: "ADHA",
    entityFullName: "Abu Dhabi Health Authority",
    validationRule: "Coordinate Reference Validation",
    errors: 0,
    warnings: 0,
    reviewer: "Fatima Al Hashemi",
    reviewDate: "2026-02-18",
    status: "Pending",
  },
];

// Recharts Charts Data
const passRateData = [
  { name: "Pass", value: 6, color: "#10b981" },
  { name: "Warning", value: 3, color: "#f59e0b" },
  { name: "Fail", value: 6, color: "#ef4444" },
  { name: "Pending", value: 1, color: "#64748b" },
];

const failingRulesData = [
  { name: "Topology Consistency", value: 8 },
  { name: "Attribute Completeness", value: 6 },
  { name: "Schema Compliance", value: 5 },
  { name: "Geometry Validity", value: 4 },
  { name: "Network Connectivity", value: 3 },
  { name: "NoData Threshold", value: 2 },
];

const entityIssuesData = [
  { name: "DMT", Errors: 5, Warnings: 9 },
  { name: "ADDC", Errors: 5, Warnings: 5 },
  { name: "FAD", Errors: 0, Warnings: 0 },
  { name: "ADNOC", Errors: 2, Warnings: 1 },
  { name: "ADHA", Errors: 0, Warnings: 0 },
  { name: "ADDA", Errors: 0, Warnings: 2 },
  { name: "DGE", Errors: 1, Warnings: 1 },
];

function DataReviewPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [results, setResults] = useState(initialValidationResults);
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleResetFilters = () => {
    setQuery("");
    setStatusFilter("all-status");
    setCurrentPage(1);
  };

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      // Status filter
      if (statusFilter !== "all-status") {
        if (r.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      // Search query
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.layerName.toLowerCase().includes(q) &&
          !r.entity.toLowerCase().includes(q) &&
          !r.reviewer.toLowerCase().includes(q) &&
          !r.validationRule.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [results, query, statusFilter]);

  const paginatedResults = useMemo(() => {
    return filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredResults, currentPage, pageSize]);

  // Badge styles
  const getStatusBadge = (status: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      Pass: {
        dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      Warning: {
        dark: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        light: "bg-amber-50 text-amber-700 border border-amber-200",
      },
      Fail: {
        dark: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        light: "bg-rose-50 text-rose-700 border border-rose-200",
      },
      Pending: {
        dark: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
        light: "bg-slate-100 text-slate-700 border border-slate-200",
      },
    };
    return styles[status] ? (isLight ? styles[status].light : styles[status].dark) : "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Data Review Assessment"
        description="Validation results from the Data Quality Engine — rule compliance, errors, and review status across all layers."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3.5 py-2 text-[14px] font-semibold text-foreground hover:bg-card/85 transition cursor-pointer">
            <Download className="h-4 w-4" /> Export
          </button>
        }
      />

      {/* Filters Toggle Button */}
      <div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-semibold transition-all cursor-pointer",
            isLight
              ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              : "bg-slate-900 border-slate-800 text-foreground hover:bg-slate-800"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Filters Bar */}
      {showFilters && (
        <div className={cn(
          "flex flex-wrap items-center gap-2 p-2 rounded-xl border",
          isLight ? "bg-slate-100/85 border-slate-200" : "bg-card/40 border-border/60"
        )}>
          {/* Entity Selector */}
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-auto min-w-[95px] max-w-[130px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 transition-all font-medium cursor-pointer">
              <SelectValue placeholder="Entity" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all" className="cursor-pointer text-[13px]">Entity</SelectItem>
              <SelectItem value="adda" className="cursor-pointer text-[13px]">ADDA</SelectItem>
              <SelectItem value="dmt" className="cursor-pointer text-[13px]">DMAT</SelectItem>
              <SelectItem value="ead" className="cursor-pointer text-[13px]">EAD</SelectItem>
            </SelectContent>
          </Select>

          {/* Stakeholder Selector */}
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-auto min-w-[110px] max-w-[150px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 transition-all font-medium cursor-pointer">
              <SelectValue placeholder="Stakeholder" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all" className="cursor-pointer text-[13px]">Stakeholder</SelectItem>
              <SelectItem value="khalid" className="cursor-pointer text-[13px]">Khalid Al Zaabi</SelectItem>
              <SelectItem value="ahmed" className="cursor-pointer text-[13px]">Ahmed Al Mansouri</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Selector */}
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-auto min-w-[110px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 transition-all font-medium cursor-pointer">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all" className="cursor-pointer text-[13px]">All Statuses</SelectItem>
              <SelectItem value="active" className="cursor-pointer text-[13px]">Active</SelectItem>
              <SelectItem value="warning" className="cursor-pointer text-[13px]">Warning</SelectItem>
              <SelectItem value="outdated" className="cursor-pointer text-[13px]">Outdated</SelectItem>
            </SelectContent>
          </Select>

          {/* Layer Type Selector */}
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-auto min-w-[120px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 transition-all font-medium cursor-pointer">
              <SelectValue placeholder="All Layer Types" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all" className="cursor-pointer text-[13px]">All Layer Types</SelectItem>
              <SelectItem value="vector" className="cursor-pointer text-[13px]">Vector</SelectItem>
              <SelectItem value="raster" className="cursor-pointer text-[13px]">Raster</SelectItem>
              <SelectItem value="tabular" className="cursor-pointer text-[13px]">Tabular</SelectItem>
            </SelectContent>
          </Select>

          {/* Sensitivity Selector */}
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-auto min-w-[110px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 transition-all font-medium cursor-pointer">
              <SelectValue placeholder="All Sensitivity" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all" className="cursor-pointer text-[13px]">All Sensitivity</SelectItem>
              <SelectItem value="public" className="cursor-pointer text-[13px]">Public</SelectItem>
              <SelectItem value="restricted" className="cursor-pointer text-[13px]">Restricted</SelectItem>
              <SelectItem value="confidential" className="cursor-pointer text-[13px]">Confidential</SelectItem>
            </SelectContent>
          </Select>

          {/* Coverage Selector */}
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-auto min-w-[130px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 transition-all font-medium cursor-pointer">
              <SelectValue placeholder="All Coverage Areas" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all" className="cursor-pointer text-[13px]">All Coverage Areas</SelectItem>
              <SelectItem value="ad" className="cursor-pointer text-[13px]">Abu Dhabi</SelectItem>
              <SelectItem value="al" className="cursor-pointer text-[13px]">Al Ain</SelectItem>
              <SelectItem value="df" className="cursor-pointer text-[13px]">Al Dhafra</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Inputs */}
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              className="h-9 w-[95px] rounded-lg border border-border/60 bg-card/50 px-2 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <span className="text-[12px] text-muted-foreground">—</span>
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              className="h-9 w-[95px] rounded-lg border border-border/60 bg-card/50 px-2 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetFilters}
            className={cn(
              "ml-auto h-9 rounded-lg px-3 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
            )}
          >
            Reset All
          </button>
        </div>
      )}

      {/* Freshness Status Ribbon */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {/* Pass Summary */}
        <div className={cn(
          "rounded-xl border p-4.5 flex items-center gap-3 transition",
          isLight
            ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
            : "bg-emerald-500/5 border-emerald-500/15 text-foreground"
        )}>
          <span className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
            isLight ? "bg-emerald-100 ring-emerald-200 text-emerald-700" : "bg-emerald-500/15 ring-emerald-500/25 text-emerald-400"
          )}>
            <CheckCircle className="h-4.5 w-4.5" />
          </span>
          <div>
            <div className="text-[20px] font-black leading-none text-foreground">6</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Pass</div>
          </div>
        </div>

        {/* Warning Summary */}
        <div className={cn(
          "rounded-xl border p-4.5 flex items-center gap-3 transition",
          isLight
            ? "bg-amber-50/50 border-amber-200 text-amber-950"
            : "bg-amber-500/5 border-amber-500/15 text-foreground"
        )}>
          <span className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
            isLight ? "bg-amber-100 ring-amber-200 text-amber-700" : "bg-amber-500/15 ring-amber-500/25 text-amber-400"
          )}>
            <AlertTriangle className="h-4.5 w-4.5" />
          </span>
          <div>
            <div className="text-[20px] font-black leading-none text-foreground">3</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Warning</div>
          </div>
        </div>

        {/* Fail Summary */}
        <div className={cn(
          "rounded-xl border p-4.5 flex items-center gap-3 transition",
          isLight
            ? "bg-rose-50/50 border-rose-200 text-rose-950"
            : "bg-rose-500/5 border-rose-500/15 text-foreground"
        )}>
          <span className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
            isLight ? "bg-rose-100 ring-rose-200 text-rose-700" : "bg-rose-500/15 ring-rose-500/25 text-rose-400"
          )}>
            <AlertTriangle className="h-4.5 w-4.5" />
          </span>
          <div>
            <div className="text-[20px] font-black leading-none text-foreground">6</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Fail</div>
          </div>
        </div>

        {/* Pending Summary */}
        <div className={cn(
          "rounded-xl border p-4.5 flex items-center gap-3 transition",
          isLight
            ? "bg-slate-50 border-slate-200 text-slate-800"
            : "bg-card/60 border-border/60 text-foreground"
        )}>
          <span className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
            isLight ? "bg-slate-100 ring-slate-200 text-slate-600" : "bg-slate-800 ring-slate-700/60 text-slate-400"
          )}>
            <Clock className="h-4.5 w-4.5 opacity-60" />
          </span>
          <div>
            <div className="text-[20px] font-black leading-none text-foreground">1</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Pending</div>
          </div>
        </div>
      </div>

      {/* Visualizations row (3 columns) */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Validation Pass Rate */}
        <Surface>
          <div className="mb-4">
            <div className="text-h4 text-foreground">Validation Pass Rate</div>
            <div className="text-[13px] text-muted-foreground">Overall pass/fail/warning distribution</div>
          </div>
          <div className="flex h-[220px] items-center justify-between gap-1">
            <div className="h-full flex-1 min-w-[110px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={passRateData}
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {passRateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RTooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                    itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex flex-col gap-1.5 text-[12px] pr-1 shrink-0">
              {passRateData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="font-semibold text-foreground">{d.name}</span>
                  <span className="text-muted-foreground font-mono ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Surface>

        {/* Most Failing Validation Rules */}
        <Surface>
          <div className="mb-4">
            <div className="text-h4 text-foreground">Most Failing Validation Rules</div>
            <div className="text-[13px] text-muted-foreground">Failure frequency by rule type</div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failingRulesData} layout="vertical" margin={{ top: 0, right: 10, left: 15, bottom: 0 }}>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" tick={{ fontSize: 9.5, fontWeight: 600, fill: "var(--foreground)" }} tickLine={false} axisLine={false} width={105} />
                <RTooltip
                  cursor={{ fill: "rgba(100,116,139,0.08)" }}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} name="Failures" barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        {/* Issues by Entity */}
        <Surface>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-h4 text-foreground">Issues by Entity</div>
              <div className="text-[13px] text-muted-foreground">Errors and warnings per entity</div>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={entityIssuesData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" tick={{ fontSize: 10, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <RTooltip
                  cursor={{ fill: "rgba(100,116,139,0.08)" }}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Errors" fill="#ef4444" radius={[3, 3, 0, 0]} name="Errors" barSize={8} />
                <Bar dataKey="Warnings" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Warnings" barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </div>

      {/* Validation Results Table */}
      <Surface padded={false}>
        <div className="flex flex-col gap-3 border-b border-border/60 p-4.5 sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ClipboardCheck className="h-5 w-5 text-accent shrink-0" />
            <div>
              <span className="font-bold text-[16px] text-foreground">Validation Results</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                16 of 16 records
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-[300px] shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search layers, entities..."
                className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <Select value={statusFilter} onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-8.5 w-[120px] border-border/60 bg-card/60 text-[12.5px] text-foreground/80 hover:bg-card/90 transition-all font-semibold cursor-pointer">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="all-status" className="cursor-pointer text-[12.5px]">All Statuses</SelectItem>
                <SelectItem value="pass" className="cursor-pointer text-[12.5px]">Pass</SelectItem>
                <SelectItem value="warning" className="cursor-pointer text-[12.5px]">Warning</SelectItem>
                <SelectItem value="fail" className="cursor-pointer text-[12.5px]">Fail</SelectItem>
                <SelectItem value="pending" className="cursor-pointer text-[12.5px]">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table list */}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70">
                <th className="px-5 py-3">LAYER NAME</th>
                <th className="px-5 py-3">ENTITY</th>
                <th className="px-5 py-3">VALIDATION RULE</th>
                <th className="px-5 py-3">ERRORS</th>
                <th className="px-5 py-3">WARNINGS</th>
                <th className="px-5 py-3">REVIEWER</th>
                <th className="px-5 py-3">REVIEW DATE</th>
                <th className="px-5 py-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    No validation results found.
                  </td>
                </tr>
              ) : (
                paginatedResults.map((r) => (
                  <tr key={r.id} className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02]">
                    {/* Layer Name & code */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-foreground">{r.layerName}</div>
                        <div className="text-[12px] text-muted-foreground mt-0.5">
                          {r.id}
                        </div>
                      </div>
                    </td>

                    {/* Entity text */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap text-[13px] font-bold text-foreground/80">
                      {r.entity}
                    </td>

                    {/* Validation Rule */}
                    <td className="px-5 py-3.5 align-middle text-foreground/80 whitespace-nowrap font-medium max-w-[200px] truncate" title={r.validationRule}>
                      {r.validationRule}
                    </td>

                    {/* Errors Count */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap text-[13.5px] font-black">
                      <span className={r.errors > 0 ? "text-rose-500" : "text-muted-foreground/60"}>
                        {r.errors}
                      </span>
                    </td>

                    {/* Warnings Count */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap text-[13.5px] font-black">
                      <span className={r.warnings > 0 ? "text-amber-500" : "text-muted-foreground/60"}>
                        {r.warnings}
                      </span>
                    </td>

                    {/* Reviewer */}
                    <td className="px-5 py-3.5 align-middle text-foreground/90 whitespace-nowrap">
                      {r.reviewer}
                    </td>

                    {/* Review Date */}
                    <td className="px-5 py-3.5 align-middle font-mono text-[13px] text-foreground/80 whitespace-nowrap">
                      {r.reviewDate}
                    </td>

                    {/* Status Pill */}
                    <td className="px-5 py-3.5 align-middle text-right whitespace-nowrap">
                      <span className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-semibold", getStatusBadge(r.status))}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          totalItems={filteredResults.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="record"
          itemNamePlural="records"
        />
      </Surface>
    </div>
  );
}
