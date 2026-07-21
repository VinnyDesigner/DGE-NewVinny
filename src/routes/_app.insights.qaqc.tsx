import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  Search,
  Download,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Database,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
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

export const Route = createFileRoute("/_app/insights/qaqc")({
  head: () => ({
    meta: [
      { title: "QAQC Observations — Data Automation Studio" },
      { name: "description", content: "Track issues discovered during Quality Assurance and Quality Control processes." },
    ],
  }),
  component: QaqcObservationsPage,
});

// Mock QAQC observations data (12 records)
const initialObservations = [
  {
    id: "QAS-001",
    layer: "Road Network — Abu Dhabi Emirate",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    category: "Geometry",
    severity: "High",
    description: "Duplicate road segments detected in northern zone. Causes routing errors in GIS analysis.",
    detected: "2026-03-12",
    assignedTo: "Khalid Al Zaabi",
    status: "In Review",
  },
  {
    id: "QAS-002",
    layer: "Air Quality Monitoring Stations",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    category: "Attribute",
    severity: "Medium",
    description: "3 stations have missing sensor_type attribute. Required for sensor classification queries.",
    detected: "2026-03-10",
    assignedTo: "Noura Al Hamdan",
    status: "Open",
  },
  {
    id: "QAS-003",
    layer: "Distribution Grid Topology",
    entity: "ADDC",
    entityFullName: "Abu Dhabi Distribution Company",
    category: "Topology",
    severity: "Critical",
    description: "Disconnected network segments identified in Al Ain substation coverage area — affects load flow.",
    detected: "2026-03-09",
    assignedTo: "Omar Al Kindi",
    status: "Open",
  },
  {
    id: "QAS-004",
    layer: "Oil & Gas Pipeline Network",
    entity: "ADNOC",
    entityFullName: "Abu Dhabi National Oil Company",
    category: "Geometry",
    severity: "High",
    description: "Two pipeline segments overlap incorrectly near Habshan facility. Safety-critical layer.",
    detected: "2026-03-08",
    assignedTo: "Ahmed Al Mansouri",
    status: "In Review",
  },
  {
    id: "QAS-005",
    layer: "Building Permit Boundaries",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    category: "Completeness",
    severity: "High",
    description: "58% of records missing building_type attribute. Incomplete for urban analytics reporting.",
    detected: "2026-03-07",
    assignedTo: "Khalid Al Zaabi",
    status: "Open",
  },
  {
    id: "QAS-006",
    layer: "Terrain DEM — Al Dhafra Region",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    category: "Raster",
    severity: "Medium",
    description: "NoData cells exceeding 5% threshold in south-western extent. May affect hydrological modelling.",
    detected: "2026-03-06",
    assignedTo: "Mohammed Al Rashidi",
    status: "In Review",
  },
  {
    id: "QAS-007",
    layer: "Substations Network (Draft)",
    entity: "ADDC",
    entityFullName: "Abu Dhabi Distribution Company",
    category: "Schema",
    severity: "High",
    description: "Schema mismatch: voltage_level field type changed from integer to string in latest version.",
    detected: "2026-03-05",
    assignedTo: "Omar Al Kindi",
    status: "Open",
  },
  {
    id: "QAS-008",
    layer: "Smart City Sensor Network",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    category: "Geometry",
    severity: "Low",
    description: "14 point features have minor coordinate precision issues (>1m offset from reference survey).",
    detected: "2026-03-04",
    assignedTo: "Ahmed Al Mansouri",
    status: "Resolved",
  },
  {
    id: "QAS-009",
    layer: "Government Service Centres",
    entity: "DGE",
    entityFullName: "Digital Government Entity",
    category: "Attribute",
    severity: "Medium",
    description: "service_category field contains 1 null value. Needed for citizen portal classification.",
    detected: "2026-03-03",
    assignedTo: "Yousef Al Marzouqi",
    status: "Resolved",
  },
  {
    id: "QAS-010",
    layer: "Land Use Zoning — Al Ain",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    category: "Completeness",
    severity: "Low",
    description: "12 polygons missing Arabic name attribute. Required for bilingual map output.",
    detected: "2026-03-01",
    assignedTo: "Ahmed Al Mansouri",
    status: "Closed",
  },
  {
    id: "QAS-011",
    layer: "Healthcare Facilities Register",
    entity: "ADHA",
    entityFullName: "Abu Dhabi Health Authority",
    category: "Topology",
    severity: "Low",
    description: "Minor overlap between two hospital service zone boundaries in central Abu Dhabi.",
    detected: "2026-02-28",
    assignedTo: "Fatima Al Hashemi",
    status: "Resolved",
  },
  {
    id: "QAS-012",
    layer: "Population Census Blocks 2025",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    category: "Schema",
    severity: "Medium",
    description: "Date format inconsistency: survey_date field uses two different formats across records.",
    detected: "2026-02-25",
    assignedTo: "Khalid Al Zaabi",
    status: "Closed",
  },
];

// Charts Data
const severityDistribution = [
  { name: "Critical", value: 1, color: "#ef4444" },
  { name: "High", value: 4, color: "#f97316" },
  { name: "Medium", value: 4, color: "#f59e0b" },
  { name: "Low", value: 3, color: "#64748b" },
];

const entityObservations = [
  { name: "ADDA", value: 4 },
  { name: "DMT", value: 3 },
  { name: "EAD", value: 2 },
  { name: "ADDC", value: 2 },
  { name: "ADHA", value: 1 },
  { name: "ADNOC", value: 1 },
  { name: "DGE", value: 1 },
];

const observationTrend = [
  { month: "Oct '25", open: 4, inReview: 2, resolved: 3 },
  { month: "Nov '25", open: 8, inReview: 3, resolved: 5 },
  { month: "Dec '25", open: 6, inReview: 4, resolved: 6 },
  { month: "Jan '26", open: 9, inReview: 3, resolved: 8 },
  { month: "Feb '26", open: 5, inReview: 5, resolved: 9 },
  { month: "Mar '26", open: 7, inReview: 3, resolved: 11 },
];

function QaqcObservationsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [observations, setObservations] = useState(initialObservations);
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all-severity");
  const [statusFilter, setStatusFilter] = useState("all-statuses");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleResetFilters = () => {
    setQuery("");
    setSeverityFilter("all-severity");
    setStatusFilter("all-statuses");
    setCurrentPage(1);
  };

  const filteredObservations = useMemo(() => {
    return observations.filter((o) => {
      // Severity Filter
      if (severityFilter !== "all-severity") {
        if (o.severity.toLowerCase() !== severityFilter.toLowerCase()) return false;
      }

      // Status Filter
      if (statusFilter !== "all-statuses") {
        const s = statusFilter.toLowerCase();
        if (s === "open" && o.status !== "Open") return false;
        if (s === "in-review" && o.status !== "In Review") return false;
        if (s === "resolved" && o.status !== "Resolved") return false;
        if (s === "closed" && o.status !== "Closed") return false;
      }

      // Search query
      if (query) {
        const q = query.toLowerCase();
        if (
          !o.id.toLowerCase().includes(q) &&
          !o.layer.toLowerCase().includes(q) &&
          !o.category.toLowerCase().includes(q) &&
          !o.description.toLowerCase().includes(q) &&
          !o.assignedTo.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [observations, query, severityFilter, statusFilter]);

  const paginatedObservations = useMemo(() => {
    return filteredObservations.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredObservations, currentPage, pageSize]);

  // Badge styles
  const getSeverityBadge = (sev: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      Critical: {
        dark: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
        light: "bg-rose-100 text-rose-800 border border-rose-200",
      },
      High: {
        dark: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
        light: "bg-orange-100 text-orange-800 border border-orange-200",
      },
      Medium: {
        dark: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
        light: "bg-amber-100 text-amber-800 border border-amber-200",
      },
      Low: {
        dark: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
        light: "bg-slate-100 text-slate-700 border border-slate-200",
      },
    };
    return styles[sev] ? (isLight ? styles[sev].light : styles[sev].dark) : "";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      Open: {
        dark: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        light: "bg-rose-50 text-rose-700 border border-rose-200",
      },
      "In Review": {
        dark: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        light: "bg-amber-50 text-amber-700 border border-amber-200",
      },
      Resolved: {
        dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      Closed: {
        dark: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
        light: "bg-slate-100 text-slate-700 border border-slate-200",
      },
    };
    return styles[status] ? (isLight ? styles[status].light : styles[status].dark) : "";
  };

  const getCategoryBadge = (cat: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      Geometry: {
        dark: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        light: "bg-blue-50 text-blue-700 border border-blue-200",
      },
      Attribute: {
        dark: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        light: "bg-purple-50 text-purple-700 border border-purple-200",
      },
      Topology: {
        dark: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
        light: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      },
      Completeness: {
        dark: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
        light: "bg-teal-50 text-teal-700 border border-teal-200",
      },
      Raster: {
        dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      Schema: {
        dark: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
        light: "bg-pink-50 text-pink-700 border border-pink-200",
      },
    };
    return styles[cat] ? (isLight ? styles[cat].light : styles[cat].dark) : "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="QAQC Observations"
        description="Track issues discovered during Quality Assurance and Quality Control processes across all data layers."
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

      {/* Summary Ribbon */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {/* Open */}
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
            <div className="text-[20px] font-black leading-none text-foreground">4</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Open</div>
          </div>
        </div>

        {/* In Review */}
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
            <Clock className="h-4.5 w-4.5" />
          </span>
          <div>
            <div className="text-[20px] font-black leading-none text-foreground">3</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">In Review</div>
          </div>
        </div>

        {/* Resolved */}
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
            <div className="text-[20px] font-black leading-none text-foreground">3</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Resolved</div>
          </div>
        </div>

        {/* Closed */}
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
            <CheckCircle className="h-4.5 w-4.5 opacity-60" />
          </span>
          <div>
            <div className="text-[20px] font-black leading-none text-foreground">2</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Closed</div>
          </div>
        </div>
      </div>

      {/* Visualizations row (3 columns) */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Issues by Severity */}
        <Surface className="min-w-0">
          <div className="mb-4">
            <div className="text-h4 text-foreground">Issues by Severity</div>
            <div className="text-[13px] text-muted-foreground">Distribution of observation severity levels</div>
          </div>
          <div className="flex h-[220px] items-center justify-between gap-1">
            <div className="h-full flex-1 min-w-[110px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityDistribution}
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {severityDistribution.map((entry, index) => (
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
            <div className="flex flex-col gap-1.5 text-[11.5px] pr-1 shrink-0">
              {severityDistribution.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="font-semibold text-foreground">{d.name}:</span>
                  <span className="text-muted-foreground font-mono ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Surface>

        {/* Issues by Entity */}
        <Surface className="min-w-0">
          <div className="mb-4">
            <div className="text-h4 text-foreground">Issues by Entity</div>
            <div className="text-[13px] text-muted-foreground">Total observations per entity</div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={entityObservations} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <RTooltip
                  cursor={{ fill: "rgba(100,116,139,0.08)" }}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Issues" barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        {/* Observations Trend */}
        <Surface className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-h4 text-foreground">Observations Trend</div>
              <div className="text-[13px] text-muted-foreground">Open, in-review, and resolved — 6 months</div>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={observationTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <RTooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Line type="monotone" dataKey="open" stroke="#ef4444" strokeWidth={2.5} name="Open" dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="inReview" stroke="#f59e0b" strokeWidth={2.5} name="In Review" dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} name="Resolved" dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Legend (dots and text) */}
          <div className="mt-4 flex items-center justify-center gap-4 text-[12px] font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
              <span className="text-muted-foreground">Open</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              <span className="text-muted-foreground">In Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              <span className="text-muted-foreground">Resolved</span>
            </div>
          </div>
        </Surface>
      </div>

      {/* Observation Register Table */}
      <Surface padded={false}>
        <div className="flex flex-col gap-3 border-b border-border/60 p-4.5 sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
            <div>
              <span className="font-bold text-[16px] text-foreground">QAQC Observation Register</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                12 observations
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
                placeholder="Search observations..."
                className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <Select value={severityFilter} onValueChange={(val) => {
              setSeverityFilter(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-8.5 w-[120px] border-border/60 bg-card/60 text-[12.5px] text-foreground/80 hover:bg-card/90 transition-all font-semibold cursor-pointer">
                <SelectValue placeholder="All Severity" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="all-severity" className="cursor-pointer text-[12.5px]">All Severity</SelectItem>
                <SelectItem value="critical" className="cursor-pointer text-[12.5px]">Critical</SelectItem>
                <SelectItem value="high" className="cursor-pointer text-[12.5px]">High</SelectItem>
                <SelectItem value="medium" className="cursor-pointer text-[12.5px]">Medium</SelectItem>
                <SelectItem value="low" className="cursor-pointer text-[12.5px]">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-8.5 w-[120px] border-border/60 bg-card/60 text-[12.5px] text-foreground/80 hover:bg-card/90 transition-all font-semibold cursor-pointer">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="all-statuses" className="cursor-pointer text-[12.5px]">All Statuses</SelectItem>
                <SelectItem value="open" className="cursor-pointer text-[12.5px]">Open</SelectItem>
                <SelectItem value="in-review" className="cursor-pointer text-[12.5px]">In Review</SelectItem>
                <SelectItem value="resolved" className="cursor-pointer text-[12.5px]">Resolved</SelectItem>
                <SelectItem value="closed" className="cursor-pointer text-[12.5px]">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table list */}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">LAYER</th>
                <th className="px-5 py-3">ENTITY</th>
                <th className="px-5 py-3">CATEGORY</th>
                <th className="px-5 py-3">SEVERITY</th>
                <th className="px-5 py-3">DESCRIPTION</th>
                <th className="px-5 py-3">DETECTED</th>
                <th className="px-5 py-3">ASSIGNED TO</th>
                <th className="px-5 py-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedObservations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-muted-foreground">
                    No observations found matching the filters.
                  </td>
                </tr>
              ) : (
                paginatedObservations.map((o) => (
                  <tr key={o.id} className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02]">
                    {/* ID */}
                    <td className="px-5 py-3.5 align-middle font-mono font-bold text-foreground/80 whitespace-nowrap">
                      {o.id}
                    </td>

                    {/* Layer Link */}
                    <td className="px-5 py-3.5 align-middle font-semibold whitespace-nowrap max-w-[180px] truncate">
                      <Link to="/data-management/layers" className="text-accent hover:underline">
                        {o.layer}
                      </Link>
                    </td>

                    {/* Entity text */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap text-[13px] font-bold text-foreground/80">
                      {o.entity}
                    </td>

                    {/* Category text */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap text-[13px] font-bold text-foreground/80">
                      {o.category}
                    </td>

                    {/* Severity */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <span className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-semibold", getSeverityBadge(o.severity))}>
                        {o.severity}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-3.5 align-middle max-w-xs">
                      <span className="text-muted-foreground text-[13px] block truncate" title={o.description}>
                        {o.description}
                      </span>
                    </td>

                    {/* Detected Date */}
                    <td className="px-5 py-3.5 align-middle font-mono text-[13px] text-foreground/80 whitespace-nowrap">
                      {o.detected}
                    </td>

                    {/* Assigned To */}
                    <td className="px-5 py-3.5 align-middle text-foreground/90 whitespace-nowrap">
                      {o.assignedTo}
                    </td>

                    {/* Status Pill */}
                    <td className="px-5 py-3.5 align-middle text-right whitespace-nowrap">
                      <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold", getStatusBadge(o.status))}>
                        {o.status}
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
          totalItems={filteredObservations.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="observation"
          itemNamePlural="observations"
        />
      </Surface>
    </div>
  );
}
