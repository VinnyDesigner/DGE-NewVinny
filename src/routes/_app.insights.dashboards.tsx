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
  ArrowUpRight,
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

export const Route = createFileRoute("/_app/insights/dashboards")({
  head: () => ({
    meta: [
      { title: "Layer Freshness — Data Automation Studio" },
      { name: "description", content: "Monitor how recently data layers have been updated." },
    ],
  }),
  component: LayerFreshnessPage,
});

// Mock Layer Freshness records (15 layers)
const initialLayers = [
  {
    id: "layer-1",
    name: "Road Network — Abu Dhabi Emirate",
    code: "L-001",
    type: "Vector",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    stakeholder: "Khalid Al Zaabi",
    lastUpdate: "2026-03-14",
    frequency: "Weekly",
    daysSinceUpdate: 0,
    status: "Fresh",
  },
  {
    id: "layer-2",
    name: "Land Use Zoning — Al Ain",
    code: "L-002",
    type: "Vector",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    stakeholder: "Ahmed Al Mansouri",
    lastUpdate: "2026-03-13",
    frequency: "Monthly",
    daysSinceUpdate: 1,
    status: "Fresh",
  },
  {
    id: "layer-3",
    name: "Ortho Imagery 2025 — Abu Dhabi",
    code: "L-003",
    type: "Ortho",
    entity: "DGE",
    entityFullName: "Digital Government Entity",
    stakeholder: "Yousef Al Marzouqi",
    lastUpdate: "2026-03-12",
    frequency: "Yearly",
    daysSinceUpdate: 2,
    status: "Fresh",
  },
  {
    id: "layer-4",
    name: "Air Quality Monitoring Stations",
    code: "L-004",
    type: "Vector",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    stakeholder: "Noura Al Hamdan",
    lastUpdate: "2026-03-11",
    frequency: "Daily",
    daysSinceUpdate: 3,
    status: "Fresh",
  },
  {
    id: "layer-5",
    name: "Distribution Grid Topology",
    code: "L-005",
    type: "Vector",
    entity: "ADDC",
    entityFullName: "Abu Dhabi Distribution Comp...",
    stakeholder: "Omar Al Kindi",
    lastUpdate: "2026-03-10",
    frequency: "Monthly",
    daysSinceUpdate: 4,
    status: "Fresh",
  },
  {
    id: "layer-6",
    name: "Healthcare Facilities Register",
    code: "L-006",
    type: "Vector",
    entity: "ADHA",
    entityFullName: "Abu Dhabi Health Authority",
    stakeholder: "Fatima Al Hashemi",
    lastUpdate: "2026-03-08",
    frequency: "Quarterly",
    daysSinceUpdate: 6,
    status: "Fresh",
  },
  {
    id: "layer-7",
    name: "Oil & Gas Pipeline Network",
    code: "L-007",
    type: "Vector",
    entity: "ADNOC",
    entityFullName: "Abu Dhabi National Oil Comp...",
    stakeholder: "Ahmed Al Mansouri",
    lastUpdate: "2026-03-07",
    frequency: "Monthly",
    daysSinceUpdate: 7,
    status: "Fresh",
  },
  {
    id: "layer-8",
    name: "Population Census Blocks 2025",
    code: "L-008",
    type: "Tabular",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    stakeholder: "Khalid Al Zaabi",
    lastUpdate: "2026-03-05",
    frequency: "Yearly",
    daysSinceUpdate: 9,
    status: "Fresh",
  },
  {
    id: "layer-9",
    name: "Terrain DEM — Al Dhafra Region",
    code: "L-009",
    type: "DEM",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    stakeholder: "Mohammed Al Rashidi",
    lastUpdate: "2026-02-28",
    frequency: "Quarterly",
    daysSinceUpdate: 14,
    status: "Warning",
  },
  {
    id: "layer-10",
    name: "Protected Natural Areas",
    code: "L-010",
    type: "Vector",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    stakeholder: "Noura Al Hamdan",
    lastUpdate: "2026-02-20",
    frequency: "Quarterly",
    daysSinceUpdate: 22,
    status: "Warning",
  },
  {
    id: "layer-11",
    name: "Substations Network (Draft)",
    code: "L-011",
    type: "Vector",
    entity: "ADDC",
    entityFullName: "Abu Dhabi Distribution Comp...",
    stakeholder: "Omar Al Kindi",
    lastUpdate: "2026-02-10",
    frequency: "Monthly",
    daysSinceUpdate: 32,
    status: "Outdated",
  },
  {
    id: "layer-12",
    name: "Building Permit Boundaries",
    code: "L-012",
    type: "Vector",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    stakeholder: "Khalid Al Zaabi",
    lastUpdate: "2026-01-15",
    frequency: "Monthly",
    daysSinceUpdate: 58,
    status: "Outdated",
  },
  {
    id: "layer-13",
    name: "Wastewater Network Map",
    code: "L-013",
    type: "Vector",
    entity: "ADDC",
    entityFullName: "Abu Dhabi Distribution Comp...",
    stakeholder: "Sara Al Dhaheri",
    lastUpdate: "2026-01-05",
    frequency: "Monthly",
    daysSinceUpdate: 69,
    status: "Outdated",
  },
  {
    id: "layer-14",
    name: "Industrial Zone Land Use",
    code: "L-014",
    type: "Vector",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    stakeholder: "Mohammed Al Rashidi",
    lastUpdate: "2025-12-20",
    frequency: "Quarterly",
    daysSinceUpdate: 85,
    status: "Outdated",
  },
  {
    id: "layer-15",
    name: "Ambulance Coverage Zones",
    code: "L-015",
    type: "Vector",
    entity: "ADHA",
    entityFullName: "Abu Dhabi Health Authority",
    stakeholder: "Fatima Al Hashemi",
    lastUpdate: "2025-12-01",
    frequency: "Quarterly",
    daysSinceUpdate: 103,
    status: "Outdated",
  },
];

// Charts Mock Data
const freshnessDistribution = [
  { name: "Fresh", value: 8, color: "#10b981" },
  { name: "Warning", value: 2, color: "#f59e0b" },
  { name: "Outdated", value: 5, color: "#ef4444" },
];

const updateTrends = [
  { month: "Oct '25", updates: 30 },
  { month: "Nov '25", updates: 48 },
  { month: "Dec '25", updates: 34 },
  { month: "Jan '26", updates: 28 },
  { month: "Feb '26", updates: 42 },
  { month: "Mar '26", updates: 38 },
];

const stakeholderUpdates = [
  { name: "K. Al Zaabi", value: 11 },
  { name: "A. Al Mansouri", value: 10 },
  { name: "Y. Al Marzouqi", value: 9 },
  { name: "N. Al Hamdan", value: 7 },
  { name: "O. Al Kindi", value: 6 },
  { name: "F. Al Hashemi", value: 5 },
  { name: "M. Al Rashidi", value: 4 },
  { name: "S. Al Dhaheri", value: 3 },
];

function LayerFreshnessPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [layers, setLayers] = useState(initialLayers);
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

  const filteredLayers = useMemo(() => {
    return layers.filter((l) => {
      // Filter status
      if (statusFilter !== "all-status") {
        if (l.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      // Search query
      if (query) {
        const q = query.toLowerCase();
        if (
          !l.name.toLowerCase().includes(q) &&
          !l.code.toLowerCase().includes(q) &&
          !l.entity.toLowerCase().includes(q) &&
          !l.stakeholder.toLowerCase().includes(q) &&
          !l.frequency.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [layers, query, statusFilter]);

  const paginatedLayers = useMemo(() => {
    return filteredLayers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredLayers, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Layer Freshness"
        description="Monitor how recently data layers have been updated and identify outdated or stale datasets."
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
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
        {/* Freshsummary */}
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
            <div className="text-[20px] font-black leading-none text-foreground">8</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Fresh Layers</div>
          </div>
        </div>

        {/* Warningsummary */}
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
            <div className="text-[20px] font-black leading-none text-foreground">2</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Warning Layers</div>
          </div>
        </div>

        {/* Outdatedsummary */}
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
            <Clock className="h-4.5 w-4.5" />
          </span>
          <div>
            <div className="text-[20px] font-black leading-none text-foreground">5</div>
            <div className="text-[13px] text-muted-foreground mt-0.5 font-bold">Outdated Layers</div>
          </div>
        </div>
      </div>

      {/* Visualizations row (3 columns) */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Freshness Distribution */}
        <Surface>
          <div className="mb-4">
            <div className="text-h4 text-foreground">Freshness Distribution</div>
            <div className="text-[13px] text-muted-foreground">Current freshness breakdown of all layers</div>
          </div>
          <div className="flex h-[220px] items-center justify-between gap-1">
            <div className="h-full flex-1 min-w-[110px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={freshnessDistribution}
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {freshnessDistribution.map((entry, index) => (
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
              {freshnessDistribution.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="font-semibold text-foreground">{d.name}</span>
                  <span className="text-muted-foreground font-mono ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Surface>

        {/* Update Trend */}
        <Surface>
          <div className="mb-4">
            <div className="text-h4 text-foreground">Update Trend</div>
            <div className="text-[13px] text-muted-foreground">Monthly layer updates over the last 6 months</div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={updateTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUpdates" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 60]} stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <RTooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Area type="monotone" dataKey="updates" stroke="#7c3aed" strokeWidth={2.2} fillOpacity={1} fill="url(#colorUpdates)" name="Updates" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        {/* Updates by Stakeholder */}
        <Surface>
          <div className="mb-4">
            <div className="text-h4 text-foreground">Updates by Stakeholder</div>
            <div className="text-[13px] text-muted-foreground">Layer updates submitted this month</div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stakeholderUpdates} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" tick={{ fontSize: 10, fontWeight: 600, fill: "var(--foreground)" }} tickLine={false} axisLine={false} width={80} />
                <RTooltip
                  cursor={{ fill: "rgba(100,116,139,0.08)" }}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} name="Updates" barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </div>

      {/* Freshness Register Table */}
      <Surface padded={false}>
        <div className="flex flex-col gap-3 border-b border-border/60 p-4.5 sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-[16px] text-foreground">Layer Freshness Register</span>
            <span className="inline-flex items-center rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
              {filteredLayers.length} layers
            </span>
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
            <Select value={statusFilter} onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-8.5 w-[110px] border-border/60 bg-card/60 text-[12.5px] text-foreground/80 hover:bg-card/90 transition-all font-semibold cursor-pointer">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="all-status" className="cursor-pointer text-[12.5px]">All</SelectItem>
                <SelectItem value="fresh" className="cursor-pointer text-[12.5px]">Fresh</SelectItem>
                <SelectItem value="warning" className="cursor-pointer text-[12.5px]">Warning</SelectItem>
                <SelectItem value="outdated" className="cursor-pointer text-[12.5px]">Outdated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table representation */}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70">
                <th className="px-5 py-3">LAYER NAME</th>
                <th className="px-5 py-3">ENTITY</th>
                <th className="px-5 py-3">STAKEHOLDER</th>
                <th className="px-5 py-3">LAST UPDATE</th>
                <th className="px-5 py-3">FREQUENCY</th>
                <th className="px-5 py-3">DAYS SINCE UPDATE</th>
                <th className="px-5 py-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLayers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    No layer freshness records found.
                  </td>
                </tr>
              ) : (
                paginatedLayers.map((l) => (
                  <tr key={l.id} className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02]">
                    {/* Layer Name & code */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-foreground">{l.name}</div>
                        <div className="text-[12px] text-muted-foreground mt-0.5">
                          {l.code} · {l.type}
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
                          {l.entity}
                        </span>
                        <span className="text-[12.5px] text-muted-foreground truncate max-w-[120px]" title={l.entityFullName}>
                          {l.entityFullName}
                        </span>
                      </div>
                    </td>

                    {/* Stakeholder */}
                    <td className="px-5 py-3.5 align-middle text-foreground/90 whitespace-nowrap">
                      {l.stakeholder}
                    </td>

                    {/* Last Update */}
                    <td className="px-5 py-3.5 align-middle font-mono text-[13px] text-foreground/80 whitespace-nowrap">
                      {l.lastUpdate}
                    </td>

                    {/* Frequency */}
                    <td className="px-5 py-3.5 align-middle text-muted-foreground/80 whitespace-nowrap">
                      {l.frequency}
                    </td>

                    {/* Days since update */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "h-2 w-2 rounded-full",
                          l.status === "Fresh" && "bg-emerald-500",
                          l.status === "Warning" && "bg-amber-500",
                          l.status === "Outdated" && "bg-rose-500"
                        )} />
                        <span className="font-semibold text-foreground/80">{l.daysSinceUpdate}d</span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="px-5 py-3.5 align-middle text-right whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold",
                        l.status === "Fresh" && (isLight ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"),
                        l.status === "Warning" && (isLight ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"),
                        l.status === "Outdated" && (isLight ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-rose-500/10 text-rose-400 border border-rose-500/20")
                      )}>
                        {l.status}
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
          totalItems={filteredLayers.length}
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
