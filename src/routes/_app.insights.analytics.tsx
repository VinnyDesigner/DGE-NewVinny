import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  Search,
  Download,
  Plus,
  Bookmark,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FolderSync,
  TrendingUp,
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

export const Route = createFileRoute("/_app/insights/analytics")({
  head: () => ({
    meta: [
      { title: "CTT vs Layers — Data Automation Studio" },
      { name: "description", content: "Compare expected layers from CTT registry against actual registered layers." },
    ],
  }),
  component: CttVsLayersPage,
});

// Mock CTT comparison records
const initialRecords = [
  {
    id: "rec-1",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    expectedLayer: "Digital Infrastructure Inventory",
    registeredLayer: "Digital Infrastructure Inventory",
    status: "Available",
    lastUpdate: "2026-03-10",
    owner: "Ahmed Al Mansouri",
    metadataStatus: "Complete",
  },
  {
    id: "rec-2",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    expectedLayer: "Smart City Sensor Network",
    registeredLayer: "Smart City Sensor Network (v2)",
    status: "Available",
    lastUpdate: "2026-02-28",
    owner: "Ahmed Al Mansouri",
    metadataStatus: "Incomplete",
  },
  {
    id: "rec-3",
    entity: "ADDA",
    entityFullName: "Abu Dhabi Digital Authority",
    expectedLayer: "Broadband Fibre Footprint",
    registeredLayer: "Not registered",
    status: "Missing",
    lastUpdate: "—",
    owner: "Unassigned",
    metadataStatus: "Missing",
  },
  {
    id: "rec-4",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    expectedLayer: "Emirate Road Network",
    registeredLayer: "Road Network — Abu Dhabi Emirate",
    status: "Available",
    lastUpdate: "2026-03-14",
    owner: "Khalid Al Zaabi",
    metadataStatus: "Complete",
  },
  {
    id: "rec-5",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    expectedLayer: "Public Transport Routes",
    registeredLayer: "Bus & Metro Routes 2026",
    status: "Available",
    lastUpdate: "2026-02-20",
    owner: "Khalid Al Zaabi",
    metadataStatus: "Complete",
  },
  {
    id: "rec-6",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    expectedLayer: "Building Permit Boundaries",
    registeredLayer: "Building Permits (Partial Upload)",
    status: "Partial",
    lastUpdate: "2026-01-15",
    owner: "Khalid Al Zaabi",
    metadataStatus: "Incomplete",
  },
  {
    id: "rec-7",
    entity: "DMT",
    entityFullName: "Dept. of Municipalities & Transport",
    expectedLayer: "Parking Zone Management",
    registeredLayer: "Not registered",
    status: "Missing",
    lastUpdate: "—",
    owner: "Unassigned",
    metadataStatus: "Missing",
  },
  {
    id: "rec-8",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    expectedLayer: "Protected Natural Areas",
    registeredLayer: "Protected Areas — UAE",
    status: "Available",
    lastUpdate: "2026-03-01",
    owner: "Noura Al Hamdan",
    metadataStatus: "Complete",
  },
  {
    id: "rec-9",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    expectedLayer: "Air Quality Monitoring Network",
    registeredLayer: "Air Quality Monitoring Stations",
    status: "Available",
    lastUpdate: "2026-03-11",
    owner: "Mohammed Al Rashidi",
    metadataStatus: "Complete",
  },
  {
    id: "rec-10",
    entity: "EAD",
    entityFullName: "Environment Agency Abu Dhabi",
    expectedLayer: "Terrain DEM — Western Region",
    registeredLayer: "Terrain DEM — Al Dhafra Region",
    status: "Partial",
    lastUpdate: "2026-03-09",
    owner: "Mohammed Al Rashidi",
    metadataStatus: "Incomplete",
  },
  {
    id: "rec-11",
    entity: "ADNOC",
    entityFullName: "Abu Dhabi National Oil Company",
    expectedLayer: "Oil & Gas Pipeline Network",
    registeredLayer: "Oil & Gas Pipeline Network",
    status: "Available",
    lastUpdate: "2026-03-07",
    owner: "Ahmed Al Mansouri",
    metadataStatus: "Complete",
  },
  {
    id: "rec-12",
    entity: "ADNOC",
    entityFullName: "Abu Dhabi National Oil Company",
    expectedLayer: "Offshore Facility Boundaries",
    registeredLayer: "Not registered",
    status: "Missing",
    lastUpdate: "—",
    owner: "Unassigned",
    metadataStatus: "Missing",
  },
  {
    id: "rec-13",
    entity: "ADHA",
    entityFullName: "Abu Dhabi Health Authority",
    expectedLayer: "Healthcare Facilities Register",
    registeredLayer: "Healthcare Facilities Register",
    status: "Available",
    lastUpdate: "2026-03-08",
    owner: "Fatima Al Hashemi",
    metadataStatus: "Complete",
  },
  {
    id: "rec-14",
    entity: "ADHA",
    entityFullName: "Abu Dhabi Health Authority",
    expectedLayer: "Ambulance Coverage Zones",
    registeredLayer: "Not registered",
    status: "Missing",
    lastUpdate: "—",
    owner: "Unassigned",
    metadataStatus: "Missing",
  },
  {
    id: "rec-15",
    entity: "ADDC",
    entityFullName: "Abu Dhabi Distribution Company",
    expectedLayer: "Distribution Grid Topology",
    registeredLayer: "Distribution Grid Topology",
    status: "Available",
    lastUpdate: "2026-03-10",
    owner: "Omar Al Kindi",
    metadataStatus: "Complete",
  },
  {
    id: "rec-16",
    entity: "ADDC",
    entityFullName: "Abu Dhabi Distribution Company",
    expectedLayer: "Substations & Transformers",
    registeredLayer: "Substations Network (Draft)",
    status: "Partial",
    lastUpdate: "2026-02-10",
    owner: "Omar Al Kindi",
    metadataStatus: "Incomplete",
  },
  {
    id: "rec-17",
    entity: "Aldar",
    entityFullName: "Aldar Properties",
    expectedLayer: "Master Plan Boundaries",
    registeredLayer: "Master Plan Boundaries — Yas Island",
    status: "Available",
    lastUpdate: "2026-03-08",
    owner: "Sara Al Dhaheri",
    metadataStatus: "Complete",
  },
  {
    id: "rec-18",
    entity: "DGE",
    entityFullName: "Digital Government Entity",
    expectedLayer: "Government Service Centres",
    registeredLayer: "Gov. Service Centres (2025)",
    status: "Available",
    lastUpdate: "2026-03-12",
    owner: "Yousef Al Marzouqi",
    metadataStatus: "Complete",
  },
  {
    id: "rec-19",
    entity: "DGE",
    entityFullName: "Digital Government Entity",
    expectedLayer: "Ortho Imagery 2025 — Emirate",
    registeredLayer: "Ortho Imagery 2025 — Abu Dhabi",
    status: "Partial",
    lastUpdate: "2026-03-12",
    owner: "Yousef Al Marzouqi",
    metadataStatus: "Incomplete",
  },
];

// Coverage charts data
const entityCoverageData = [
  { name: "ADDA", Available: 2, Partial: 0, Missing: 1 },
  { name: "DMT", Available: 2, Partial: 1, Missing: 1 },
  { name: "EAD", Available: 2, Partial: 1, Missing: 0 },
  { name: "ADNOC", Available: 1, Partial: 0, Missing: 1 },
  { name: "ADHA", Available: 1, Partial: 0, Missing: 1 },
  { name: "ADDC", Available: 1, Partial: 1, Missing: 0 },
  { name: "Aldar", Available: 1, Partial: 0, Missing: 0 },
  { name: "DGE", Available: 1, Partial: 1, Missing: 0 },
];

const distributionData = [
  { name: "Available", value: 11, color: "#10b981" },
  { name: "Partial", value: 4, color: "#f59e0b" },
  { name: "Missing", value: 4, color: "#ef4444" },
];

function CttVsLayersPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [records, setRecords] = useState(initialRecords);
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [savedFilter, setSavedFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleResetFilters = () => {
    setQuery("");
    setStatusFilter("all-statuses");
    setSavedFilter("");
    setCurrentPage(1);
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Saved filters quick selections
      if (savedFilter === "missing" && r.status !== "Missing") return false;
      if (savedFilter === "adda" && r.entity !== "ADDA") return false;

      // Status selector
      if (statusFilter !== "all-statuses") {
        if (statusFilter === "available" && r.status !== "Available") return false;
        if (statusFilter === "partial" && r.status !== "Partial") return false;
        if (statusFilter === "missing" && r.status !== "Missing") return false;
      }

      // Search query
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.expectedLayer.toLowerCase().includes(q) &&
          !r.registeredLayer.toLowerCase().includes(q) &&
          !r.entity.toLowerCase().includes(q) &&
          !r.entityFullName.toLowerCase().includes(q) &&
          !r.owner.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [records, query, statusFilter, savedFilter]);

  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Badge colors
  const getStatusBadge = (status: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      Available: {
        dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      Partial: {
        dark: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        light: "bg-amber-50 text-amber-700 border border-amber-200",
      },
      Missing: {
        dark: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        light: "bg-rose-50 text-rose-700 border border-rose-200",
      },
    };
    return styles[status] ? (isLight ? styles[status].light : styles[status].dark) : "";
  };

  const getMetadataBadge = (meta: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      Complete: {
        dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      Incomplete: {
        dark: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        light: "bg-amber-50 text-amber-700 border border-amber-200",
      },
      Missing: {
        dark: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        light: "bg-rose-50 text-rose-700 border border-rose-200",
      },
    };
    return styles[meta] ? (isLight ? styles[meta].light : styles[meta].dark) : "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="CTT vs Layers"
        description="Compare expected layers from the Comprehensive Thematic Taxonomy registry against actual registered layers."
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

      {/* Saved filters ribbon */}
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-muted-foreground font-semibold">SAVED:</span>
        <button
          onClick={() => setSavedFilter(savedFilter === "missing" ? "" : "missing")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-semibold border transition cursor-pointer",
            savedFilter === "missing"
              ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
              : (isLight ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-card/60 border-border/60 text-muted-foreground hover:text-foreground")
          )}
        >
          <XCircle className="h-3.5 w-3.5" /> Missing Layers
        </button>

        <button
          onClick={() => setSavedFilter(savedFilter === "adda" ? "" : "adda")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-semibold border transition cursor-pointer",
            savedFilter === "adda"
              ? "bg-primary/15 border-primary/30 text-accent"
              : (isLight ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-card/60 border-border/60 text-muted-foreground hover:text-foreground")
          )}
        >
          <Bookmark className="h-3.5 w-3.5" /> ADDA Layers
        </button>

        <button className="text-accent hover:underline text-[12.5px] font-semibold ml-1 cursor-pointer">
          + Save current
        </button>
      </div>

      {/* Visualizations row */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Coverage by Entity */}
        <Surface>
          <div className="mb-4">
            <div className="text-h4 text-foreground">Coverage by Entity</div>
            <div className="text-[14px] text-muted-foreground">Expected vs registered vs missing layers per entity</div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={entityCoverageData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <RTooltip
                  cursor={{ fill: "rgba(100,116,139,0.08)" }}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Available" fill="#10b981" radius={[3, 3, 0, 0]} name="Available" barSize={12} />
                <Bar dataKey="Partial" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Partial" barSize={12} />
                <Bar dataKey="Missing" fill="#ef4444" radius={[3, 3, 0, 0]} name="Missing" barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        {/* Coverage Distribution */}
        <Surface>
          <div className="mb-4">
            <div className="text-h4 text-foreground">Coverage Distribution</div>
            <div className="text-[14px] text-muted-foreground">Overall platform-wide CTT coverage</div>
          </div>
          <div className="flex h-[240px] items-center justify-between gap-2">
            <div className="h-full flex-1 min-w-[130px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    innerRadius={55}
                    outerRadius={75}
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
            {/* Custom Legend */}
            <div className="flex flex-col gap-2.5 text-[13px] pr-2 shrink-0">
              {distributionData.map((d, i) => {
                const total = distributionData.reduce((acc, curr) => acc + curr.value, 0);
                const percent = Math.round((d.value / total) * 100);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="font-semibold text-foreground">{d.name}</span>
                    <span className="text-muted-foreground font-mono ml-auto">
                      {d.value} <span className="text-[11px]">({percent}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Surface>
      </div>

      {/* Comparison table */}
      <Surface padded={false}>
        <div className="flex flex-col gap-3 border-b border-border/60 p-4.5 sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-[16px] text-foreground">CTT Registry Comparison</span>
            <span className="inline-flex items-center rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
              {filteredRecords.length} of 19 records
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
              <SelectTrigger className="h-8.5 w-[130px] border-border/60 bg-card/60 text-[12.5px] text-foreground/80 hover:bg-card/90 transition-all font-semibold cursor-pointer">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="all-statuses" className="cursor-pointer text-[12.5px]">All Statuses</SelectItem>
                <SelectItem value="available" className="cursor-pointer text-[12.5px]">Available</SelectItem>
                <SelectItem value="partial" className="cursor-pointer text-[12.5px]">Partial</SelectItem>
                <SelectItem value="missing" className="cursor-pointer text-[12.5px]">Missing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table list */}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70">
                <th className="px-5 py-3">ENTITY</th>
                <th className="px-5 py-3">EXPECTED LAYER (CTT)</th>
                <th className="px-5 py-3">REGISTERED LAYER</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3">LAST UPDATE</th>
                <th className="px-5 py-3">OWNER</th>
                <th className="px-5 py-3 text-right">METADATA STATUS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    No registry matches found.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => (
                  <tr key={r.id} className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02]">
                    {/* Entity badge + fullname */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-bold border",
                          isLight 
                            ? "bg-slate-100 text-slate-700 border-slate-200" 
                            : "bg-slate-800 text-slate-300 border-slate-700/60"
                        )}>
                          {r.entity}
                        </span>
                        <span className="text-[12.5px] text-muted-foreground">{r.entityFullName}</span>
                      </div>
                    </td>

                    {/* Expected Layer name */}
                    <td className="px-5 py-3.5 align-middle font-semibold text-foreground whitespace-nowrap">
                      {r.expectedLayer}
                    </td>

                    {/* Registered Layer (clickable link or not registered text) */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      {r.registeredLayer === "Not registered" ? (
                        <span className="text-muted-foreground/60 italic">{r.registeredLayer}</span>
                      ) : (
                        <Link to="/data-management/layers" className="text-accent font-medium hover:underline">
                          {r.registeredLayer}
                        </Link>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold", getStatusBadge(r.status))}>
                        {r.status}
                      </span>
                    </td>

                    {/* Last Update */}
                    <td className="px-5 py-3.5 align-middle font-mono text-[13px] text-foreground/80 whitespace-nowrap">
                      {r.lastUpdate}
                    </td>

                    {/* Owner */}
                    <td className="px-5 py-3.5 align-middle text-foreground/90 whitespace-nowrap">
                      {r.owner}
                    </td>

                    {/* Metadata Status Badge */}
                    <td className="px-5 py-3.5 align-middle text-right whitespace-nowrap">
                      <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold", getMetadataBadge(r.metadataStatus))}>
                        {r.metadataStatus}
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
          itemNameSingular="record"
          itemNamePlural="records"
        />
      </Surface>
    </div>
  );
}
