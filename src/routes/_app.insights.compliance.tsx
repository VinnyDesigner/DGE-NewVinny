import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  Search,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
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

export const Route = createFileRoute("/_app/insights/compliance")({
  head: () => ({
    meta: [
      { title: "Metadata Compliance — Data Automation Studio" },
      { name: "description", content: "Monitor metadata completeness scores and standards compliance." },
    ],
  }),
  component: MetadataCompliancePage,
});

// Mock Metadata Compliance Records (15 layers)
const initialComplianceRecords = [
  {
    id: "ML-001",
    layerName: "Road Network — Abu Dhabi Emirate",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    standard: "ISO 19115",
    completeness: 92,
    missingFields: [],
    lastUpdated: "2026-03-14",
    status: "Compliant",
  },
  {
    id: "ML-002",
    layerName: "Land Use Zoning — Al Ain",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    standard: "ISO 19115",
    completeness: 100,
    missingFields: [],
    lastUpdated: "2026-03-13",
    status: "Compliant",
  },
  {
    id: "ML-003",
    layerName: "Ortho Imagery 2025 — Abu Dhabi",
    entity: "DGE",
    entityFullName: "Digital Government Entity",
    standard: "ISO 19115-2",
    completeness: 94,
    missingFields: [],
    lastUpdated: "2026-03-12",
    status: "Compliant",
  },
  {
    id: "ML-004",
    layerName: "Air Quality Monitoring Stations",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    standard: "ISO 19115",
    completeness: 70,
    missingFields: ["updateFrequency", "contactOrganization"],
    lastUpdated: "2026-03-11",
    status: "Partial",
  },
  {
    id: "ML-005",
    layerName: "Distribution Grid Topology",
    entity: "ADDC",
    entityFullName: "Abu Dhabi Distribution Company",
    standard: "ISO 19115",
    completeness: 80,
    missingFields: ["dataLineage"],
    lastUpdated: "2026-03-10",
    status: "Partial",
  },
  {
    id: "ML-006",
    layerName: "Terrain DEM — Al Dhafra Region",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    standard: "ISO 19115-2",
    completeness: 72,
    missingFields: ["dataLineage", "processingSteps"],
    lastUpdated: "2026-03-09",
    status: "Partial",
  },
  {
    id: "ML-007",
    layerName: "Healthcare Facilities Register",
    entity: "ADHA",
    entityFullName: "Abu Dhabi Health Authority",
    standard: "ISO 19115",
    completeness: 96,
    missingFields: [],
    lastUpdated: "2026-03-08",
    status: "Compliant",
  },
  {
    id: "ML-008",
    layerName: "Oil & Gas Pipeline Network",
    entity: "ADNOC",
    entityFullName: "Abu Dhabi National Oil Company",
    standard: "ISO 19115",
    completeness: 91,
    missingFields: [],
    lastUpdated: "2026-03-07",
    status: "Compliant",
  },
  {
    id: "ML-009",
    layerName: "Master Plan Boundaries — Yas Island",
    entity: "ALDAR",
    entityFullName: "Aldar Properties",
    standard: "INSPIRE",
    completeness: 83,
    missingFields: ["contactOrganization", "languageCode"],
    lastUpdated: "2026-03-06",
    status: "Partial",
  },
  {
    id: "ML-010",
    layerName: "Population Census Blocks 2025",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    standard: "ISO 19115",
    completeness: 100,
    missingFields: [],
    lastUpdated: "2026-03-05",
    status: "Compliant",
  },
  {
    id: "ML-011",
    layerName: "Building Permit Boundaries",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    standard: "ISO 19115",
    completeness: 52,
    missingFields: ["abstract", "dataLineage"],
    lastUpdated: "2026-03-03",
    status: "Non-Compliant",
  },
  {
    id: "ML-012",
    layerName: "Protected Natural Areas",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    standard: "ISO 19115",
    completeness: 89,
    missingFields: ["updateFrequency"],
    lastUpdated: "2026-03-01",
    status: "Partial",
  },
  {
    id: "ML-013",
    layerName: "Substations Network (Draft)",
    entity: "ADDC",
    entityFullName: "Abu Dhabi Distribution Company",
    standard: "ISO 19115",
    completeness: 44,
    missingFields: ["abstract", "dataLineage"],
    lastUpdated: "2026-02-28",
    status: "Non-Compliant",
  },
  {
    id: "ML-014",
    layerName: "Smart City Sensor Network",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    standard: "ISO 19115",
    completeness: 96,
    missingFields: [],
    lastUpdated: "2026-02-25",
    status: "Compliant",
  },
  {
    id: "ML-015",
    layerName: "Government Service Centres",
    entity: "DGE",
    entityFullName: "Digital Government Entity",
    standard: "ISO 19115",
    completeness: 78,
    missingFields: ["dataLineage", "processingSteps"],
    lastUpdated: "2026-02-20",
    status: "Partial",
  },
];

// Recharts Charts Data
const completenessTrendData = [
  { month: "Oct '25", score: 80.2 },
  { month: "Nov '25", score: 82.5 },
  { month: "Dec '25", score: 83.8 },
  { month: "Jan '26", score: 85.9 },
  { month: "Feb '26", score: 87.4 },
  { month: "Mar '26", score: 89.8 },
];

const distributionData = [
  { name: "Compliant", value: 7, color: "#10b981" },
  { name: "Partial", value: 6, color: "#f59e0b" },
  { name: "Non-Compliant", value: 2, color: "#ef4444" },
];

const missingFieldsData = [
  { name: "dataLineage", value: 6 },
  { name: "updateFrequency", value: 5 },
  { name: "contactOrganization", value: 4 },
  { name: "processingSteps", value: 4 },
  { name: "contactEmail", value: 4 },
  { name: "languageCode", value: 2 },
  { name: "abstract", value: 1 },
];

function MetadataCompliancePage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [records, setRecords] = useState(initialComplianceRecords);
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [complianceFilter, setComplianceFilter] = useState("all-compliance");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleResetFilters = () => {
    setQuery("");
    setComplianceFilter("all-compliance");
    setCurrentPage(1);
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Compliance filter
      if (complianceFilter !== "all-compliance") {
        if (complianceFilter === "compliant" && r.status !== "Compliant") return false;
        if (complianceFilter === "partial" && r.status !== "Partial") return false;
        if (complianceFilter === "non-compliant" && r.status !== "Non-Compliant") return false;
      }

      // Search query
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.layerName.toLowerCase().includes(q) &&
          !r.entity.toLowerCase().includes(q) &&
          !r.standard.toLowerCase().includes(q) &&
          r.missingFields.every((f) => !f.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [records, query, complianceFilter]);

  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Badge styles
  const getStatusBadge = (status: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      Compliant: {
        dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      Partial: {
        dark: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        light: "bg-amber-50 text-amber-700 border border-amber-200",
      },
      "Non-Compliant": {
        dark: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        light: "bg-rose-50 text-rose-700 border border-rose-200",
      },
    };
    return styles[status] ? (isLight ? styles[status].light : styles[status].dark) : "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Metadata Compliance"
        description="Monitor metadata completeness scores and standards compliance (ISO 19115, INSPIRE) across all registered layers."
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
        {/* Completeness Summary */}
        <div className={cn(
          "rounded-xl border p-4.5 flex items-center gap-3 transition",
          isLight
            ? "bg-purple-50/50 border-purple-200 text-purple-950"
            : "bg-purple-500/5 border-purple-500/15 text-foreground"
        )}>
          <span className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
            isLight ? "bg-purple-100 ring-purple-200 text-purple-700" : "bg-purple-500/15 ring-purple-500/25 text-purple-400"
          )}>
            <Database className="h-4.5 w-4.5" />
          </span>
          <div>
            <div className="text-[20px] font-black leading-none text-foreground">84%</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Avg. Completeness</div>
          </div>
        </div>

        {/* Compliant Summary */}
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
            <div className="text-[20px] font-black leading-none text-foreground">7</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Compliant Layers</div>
          </div>
        </div>

        {/* Partially Compliant Summary */}
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
            <div className="text-[20px] font-black leading-none text-foreground">6</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Partially Compliant</div>
          </div>
        </div>

        {/* Non-Compliant Summary */}
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
            <div className="text-[20px] font-black leading-none text-foreground">2</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Non-Compliant</div>
          </div>
        </div>
      </div>

      {/* Visualizations row (3 columns) */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Completeness Trend */}
        <Surface className="min-w-0">
          <div className="mb-4">
            <div className="text-h4 text-foreground">Completeness Trend</div>
            <div className="text-[13px] text-muted-foreground">Average metadata completeness score over 6 months</div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completenessTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleteness" x1="0" x2="0" y1="0" x2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis domain={[50, 100]} stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <RTooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Area type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2.2} fillOpacity={1} fill="url(#colorCompleteness)" name="Completeness (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        {/* Compliance Distribution */}
        <Surface className="min-w-0">
          <div className="mb-4">
            <div className="text-h4 text-foreground">Compliance Distribution</div>
            <div className="text-[13px] text-muted-foreground">Compliant vs partial vs non-compliant</div>
          </div>
          <div className="flex h-[220px] items-center justify-between gap-1">
            <div className="h-full flex-1 min-w-[110px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
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
            {/* Legend */}
            <div className="flex flex-col gap-2 text-[12px] pr-1 shrink-0">
              {distributionData.map((d, i) => {
                const total = distributionData.reduce((acc, curr) => acc + curr.value, 0);
                const percent = Math.round((d.value / total) * 100);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="font-semibold text-foreground">{d.name}</span>
                    <span className="text-muted-foreground font-mono ml-auto">
                      {d.value} <span className="text-[10px]">({percent}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Surface>

        {/* Top Missing Metadata Fields */}
        <Surface className="min-w-0">
          <div className="mb-4">
            <div className="text-h4 text-foreground">Top Missing Metadata Fields</div>
            <div className="text-[13px] text-muted-foreground">Most frequently absent metadata fields</div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missingFieldsData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" tick={{ fontSize: 9, fontWeight: 600, fill: "var(--foreground)" }} tickLine={false} axisLine={false} width={95} />
                <RTooltip
                  cursor={{ fill: "rgba(100,116,139,0.08)" }}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Bar dataKey="value" fill="#7c3aed" radius={[0, 4, 4, 0]} name="Missing Count" barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </div>

      {/* Metadata Compliance Register Table */}
      <Surface padded={false}>
        <div className="flex flex-col gap-3 border-b border-border/60 p-4.5 sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCheck className="h-5 w-5 text-[#7c3aed] shrink-0" />
            <div>
              <span className="font-bold text-[16px] text-foreground">Metadata Compliance Register</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                15 layers - Avg. score: 84%
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
                placeholder="Search layers..."
                className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <Select value={complianceFilter} onValueChange={(val) => {
              setComplianceFilter(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-8.5 w-[140px] border-border/60 bg-card/60 text-[12.5px] text-foreground/80 hover:bg-card/90 transition-all font-semibold cursor-pointer">
                <SelectValue placeholder="All Compliance" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="all-compliance" className="cursor-pointer text-[12.5px]">All Compliance</SelectItem>
                <SelectItem value="compliant" className="cursor-pointer text-[12.5px]">Compliant</SelectItem>
                <SelectItem value="partial" className="cursor-pointer text-[12.5px]">Partial</SelectItem>
                <SelectItem value="non-compliant" className="cursor-pointer text-[12.5px]">Non-Compliant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table list */}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70">
                <th className="px-5 py-3">LAYER</th>
                <th className="px-5 py-3">ENTITY</th>
                <th className="px-5 py-3">METADATA STANDARD</th>
                <th className="px-5 py-3">COMPLETENESS</th>
                <th className="px-5 py-3">MISSING FIELDS</th>
                <th className="px-5 py-3">LAST UPDATED</th>
                <th className="px-5 py-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    No compliance records found.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => (
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

                    {/* Entity badge + fullname */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-bold border shrink-0",
                          isLight 
                            ? "bg-slate-100 text-slate-700 border-slate-200" 
                            : "bg-slate-800 text-slate-300 border-slate-700/60"
                        )}>
                          {r.entity}
                        </span>
                        <span className="text-[12.5px] text-muted-foreground max-w-[120px] truncate" title={r.entityFullName}>
                          {r.entityFullName}
                        </span>
                      </div>
                    </td>

                    {/* Metadata Standard */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap font-mono text-[13px] text-foreground/80">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded border text-[11.5px] font-semibold",
                        isLight ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-slate-900/40 border-slate-800 text-slate-300"
                      )}>
                        {r.standard}
                      </span>
                    </td>

                    {/* Completeness score + progress bar */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-16">
                          <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
                            <div className={cn(
                              "h-full rounded-full",
                              r.completeness >= 80 && "bg-emerald-500",
                              r.completeness >= 50 && r.completeness < 80 && "bg-amber-500",
                              r.completeness < 50 && "bg-rose-500"
                            )} style={{ width: `${r.completeness}%` }} />
                          </div>
                        </div>
                        <span className="font-semibold text-foreground/80 text-[13px]">{r.completeness}%</span>
                      </div>
                    </td>

                    {/* Missing Fields list */}
                    <td className="px-5 py-3.5 align-middle max-w-xs">
                      {r.missingFields.length === 0 ? (
                        <span className="text-muted-foreground/60">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {r.missingFields.map((f, idx) => (
                            <span key={idx} className={cn(
                              "text-[10.5px] font-mono px-1 py-0.2 rounded border",
                              isLight 
                                ? "bg-rose-50 text-rose-700 border-rose-200/50" 
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            )}>
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="px-5 py-3.5 align-middle font-mono text-[13px] text-foreground/80 whitespace-nowrap">
                      {r.lastUpdated}
                    </td>

                    {/* Status Pill */}
                    <td className="px-5 py-3.5 align-middle text-right whitespace-nowrap">
                      <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold", getStatusBadge(r.status))}>
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
          totalItems={filteredRecords.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="layer"
          itemNamePlural="layers"
        />
      </Surface>
    </div>
  );
}
