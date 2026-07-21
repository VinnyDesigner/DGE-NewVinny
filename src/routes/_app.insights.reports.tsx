import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Database,
  RefreshCw,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Package,
  ArrowRight,
  Download,
  AlertCircle,
  BookOpen,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/insights/reports")({
  head: () => ({
    meta: [
      { title: "Governance Dashboard — Data Automation Studio" },
      { name: "description", content: "Platform-wide data governance overview." },
    ],
  }),
  component: GovernanceDashboardPage,
});

// Mock data for visualizations
const updateTrendsData = [
  { month: "Aug", updated: 14, newLayers: 3 },
  { month: "Sep", updated: 22, newLayers: 5 },
  { month: "Oct", updated: 18, newLayers: 2 },
  { month: "Nov", updated: 29, newLayers: 8 },
  { month: "Dec", updated: 35, newLayers: 6 },
  { month: "Jan", updated: 20, newLayers: 4 },
  { month: "Feb", updated: 25, newLayers: 7 },
  { month: "Mar", updated: 32, newLayers: 5 },
  { month: "Apr", updated: 28, newLayers: 3 },
  { month: "May", updated: 42, newLayers: 9 },
  { month: "Jun", updated: 38, newLayers: 4 },
  { month: "Jul", updated: 45, newLayers: 8 },
];

const qaqcIssuesData = [
  { month: "Jan", open: 8, resolved: 14 },
  { month: "Feb", open: 12, resolved: 16 },
  { month: "Mar", open: 15, resolved: 22 },
  { month: "Apr", open: 9, resolved: 18 },
  { month: "May", open: 18, resolved: 24 },
  { month: "Jun", open: 22, resolved: 30 },
  { month: "Jul", open: 14, resolved: 28 },
];

const completenessData = [
  { month: "Feb", score: 81.5 },
  { month: "Mar", score: 83.2 },
  { month: "Apr", score: 86.8 },
  { month: "May", score: 85.0 },
  { month: "Jun", score: 89.4 },
  { month: "Jul", score: 92.6 },
];

const stakeholderActivityData = [
  { entity: "ADDA", deliveries: 42, updates: 68 },
  { entity: "DMAT", deliveries: 25, updates: 48 },
  { entity: "DoT", deliveries: 31, updates: 54 },
  { entity: "EAD", deliveries: 18, updates: 30 },
  { entity: "AD Police", deliveries: 12, updates: 22 },
  { entity: "Health Auth", deliveries: 19, updates: 35 },
];

function GovernanceDashboardPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // 7 Metric Cards Definition
  const metrics = [
    { label: "Total Data Layers", value: 0, tone: "purple", icon: Database },
    { label: "Updated This Month", value: 0, tone: "green", icon: RefreshCw },
    { label: "Outdated Layers", value: 0, tone: "red", icon: Clock },
    { label: "Layers With QAQC Issues", value: 0, tone: "yellow", icon: AlertTriangle },
    { label: "Missing Metadata", value: 0, tone: "purple-light", icon: FileText },
    { label: "Active Stakeholders", value: 0, tone: "blue", icon: Users },
    { label: "Deliveries This Month", value: 0, tone: "teal", icon: Package },
  ];

  // Helper styles for metrics
  const getIconWrapperClass = (tone: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      purple: {
        dark: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        light: "bg-purple-50 text-purple-700 border border-purple-200",
      },
      green: {
        dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      red: {
        dark: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        light: "bg-rose-50 text-rose-700 border border-rose-200",
      },
      yellow: {
        dark: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        light: "bg-amber-50 text-amber-700 border border-amber-200",
      },
      "purple-light": {
        dark: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
        light: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      },
      blue: {
        dark: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        light: "bg-blue-50 text-blue-700 border border-blue-200",
      },
      teal: {
        dark: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
        light: "bg-teal-50 text-teal-700 border border-teal-200",
      },
    };
    return styles[tone] ? (isLight ? styles[tone].light : styles[tone].dark) : "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Governance Dashboard"
        description="Platform-wide data governance overview — live data from data layers, stakeholders, and deliveries; sample data shown where the underlying module has not shipped."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3.5 py-2 text-[14px] font-semibold text-foreground transition-all cursor-pointer hover:bg-card/80",
                isRefreshing && "opacity-60"
              )}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} /> Refresh
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3.5 py-2 text-[14px] font-semibold text-foreground transition-all cursor-pointer hover:bg-card/80">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
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
          <button className={cn(
            "ml-auto h-9 rounded-lg px-3 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
          )}>
            Reset All
          </button>
        </div>
      )}

      {/* Ribbon stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
        {metrics.map((m, index) => {
          const IconComponent = m.icon;
          return (
            <Surface
              key={index}
              className="!p-3.5 relative overflow-hidden group hover:border-accent/30 transition duration-300 flex flex-col justify-between h-[88px]"
            >
              <div className="flex items-start justify-between gap-1.5 w-full">
                <span
                  className="text-[11px] font-black text-muted-foreground uppercase tracking-wider truncate block flex-1"
                  title={m.label}
                >
                  {m.label}
                </span>
                <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md border -mt-0.5", getIconWrapperClass(m.tone))}>
                  <IconComponent className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="text-[26px] font-black leading-none text-foreground mt-2">
                {m.value}
              </div>
            </Surface>
          );
        })}
      </div>

      {/* Visualizations row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Layer Update Trends */}
        <Surface>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-h4 text-foreground">Layer Update Trends</div>
              <div className="text-[14px] text-muted-foreground">Monthly layer updates and new additions over the last 12 months</div>
            </div>
            <div className="flex items-center gap-3 text-[13px]">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-muted-foreground">Updated</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-muted-foreground">New Layers</span>
              </div>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={updateTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUpdated" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#5b8cff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#5b8cff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNew" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 12, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <RTooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Area type="monotone" dataKey="updated" stroke="#5b8cff" strokeWidth={2} fillOpacity={1} fill="url(#colorUpdated)" name="Updated" />
                <Area type="monotone" dataKey="newLayers" stroke="#10b981" strokeWidth={1.8} fillOpacity={1} fill="url(#colorNew)" name="New Layers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        {/* QAQC Issues Trend */}
        <Surface>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-h4 text-foreground">QAQC Issues Trend</div>
              <div className="text-[14px] text-muted-foreground">Open vs resolved observations (Current Yr)</div>
            </div>
            <div className="flex items-center gap-3 text-[13px]">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-warning" />
                <span className="text-muted-foreground">Open</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-muted-foreground">Resolved</span>
              </div>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qaqcIssuesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 12, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <RTooltip
                  cursor={{ fill: "rgba(100,116,139,0.08)" }}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Bar dataKey="open" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Open" barSize={12} />
                <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved" barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </div>

      {/* Visualizations row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Metadata Completeness */}
        <Surface>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-h4 text-foreground">Metadata Completeness</div>
              <div className="text-[14px] text-muted-foreground">Average completeness score (%) — last 6 months</div>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completenessData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleteness" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 12, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis domain={[70, 100]} stroke="var(--muted-foreground)" tick={{ fontSize: 12, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
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

        {/* Stakeholder Activity */}
        <Surface>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-h4 text-foreground">Stakeholder Activity</div>
              <div className="text-[14px] text-muted-foreground">Deliveries and layer updates by entity this month</div>
            </div>
            <div className="flex items-center gap-3 text-[13px]">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-info" />
                <span className="text-muted-foreground">Deliveries</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-purple" style={{ backgroundColor: "#7c3aed" }} />
                <span className="text-muted-foreground">Layer Updates</span>
              </div>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stakeholderActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
                <XAxis dataKey="entity" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <RTooltip
                  cursor={{ fill: "rgba(100,116,139,0.08)" }}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                  itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                />
                <Bar dataKey="deliveries" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Deliveries" barSize={10} />
                <Bar dataKey="updates" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Layer Updates" barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </div>

      {/* Quick Actions Header */}
      <div>
        <h3 className="text-[16px] font-bold text-foreground mb-3">Quick Actions</h3>
        <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
          {/* Card 1: View Outdated Layers */}
          <div className={cn(
            "rounded-xl border p-4.5 flex items-center justify-between transition group cursor-pointer",
            isLight
              ? "bg-rose-50/50 hover:bg-rose-50 border-rose-200 text-rose-950"
              : "bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/15 text-foreground"
          )}>
            <div className="flex items-center gap-3">
              <span className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
                isLight ? "bg-rose-100 ring-rose-200 text-rose-700" : "bg-rose-500/15 ring-rose-500/25 text-rose-400"
              )}>
                <AlertCircle className="h-4.5 w-4.5" />
              </span>
              <div>
                <div className="font-semibold text-[14px]">View Outdated Layers</div>
                <div className="text-[13px] text-muted-foreground mt-0.5">0 layers not updated in 30+ days</div>
              </div>
            </div>
            <ArrowRight className="h-4.5 w-4.5 text-muted-foreground group-hover:translate-x-1 transition" />
          </div>

          {/* Card 2: View QAQC Issues */}
          <div className={cn(
            "rounded-xl border p-4.5 flex items-center justify-between transition group cursor-pointer",
            isLight
              ? "bg-amber-50/50 hover:bg-amber-50 border-amber-200 text-amber-950"
              : "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/15 text-foreground"
          )}>
            <div className="flex items-center gap-3">
              <span className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
                isLight ? "bg-amber-100 ring-amber-200 text-amber-700" : "bg-amber-500/15 ring-amber-500/25 text-amber-400"
              )}>
                <AlertTriangle className="h-4.5 w-4.5" />
              </span>
              <div>
                <div className="font-semibold text-[14px]">View QAQC Issues</div>
                <div className="text-[13px] text-muted-foreground mt-0.5">0 layers with open QAQC observations (sample)</div>
              </div>
            </div>
            <ArrowRight className="h-4.5 w-4.5 text-muted-foreground group-hover:translate-x-1 transition" />
          </div>

          {/* Card 3: Metadata Compliance */}
          <div className={cn(
            "rounded-xl border p-4.5 flex items-center justify-between transition group cursor-pointer",
            isLight
              ? "bg-purple-50/50 hover:bg-purple-50 border-purple-200 text-purple-950"
              : "bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/15 text-foreground"
          )}>
            <div className="flex items-center gap-3">
              <span className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
                isLight ? "bg-purple-100 ring-purple-200 text-purple-700" : "bg-purple-500/15 ring-purple-500/25 text-purple-400"
              )}>
                <BookOpen className="h-4.5 w-4.5" />
              </span>
              <div>
                <div className="font-semibold text-[14px]">Metadata Compliance</div>
                <div className="text-[13px] text-muted-foreground mt-0.5">0 layers missing mandatory metadata (sample)</div>
              </div>
            </div>
            <ArrowRight className="h-4.5 w-4.5 text-muted-foreground group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Recent Layer Activity table */}
      <Surface padded={false}>
        <div className="border-b border-border/60 p-5">
          <div className="text-h4 text-foreground">Recent Layer Activity</div>
          <div className="text-[14px] text-muted-foreground mt-0.5">Last 10 layer updates across all entities</div>
        </div>

        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70">
                <th className="px-5 py-3">LAYER NAME</th>
                <th className="px-5 py-3">ENTITY</th>
                <th className="px-5 py-3">TYPE</th>
                <th className="px-5 py-3">LAST UPDATED</th>
                <th className="px-5 py-3">UPDATED BY</th>
                <th className="px-5 py-3 text-right">STATUS</th>
              </tr>
            </thead>
          </table>
          
          {/* Empty state placeholder */}
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.03] ring-1 ring-inset ring-foreground/10">
              <Database className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-[15px] font-medium text-muted-foreground">No layer activity recorded yet.</div>
          </div>
        </div>
      </Surface>
    </div>
  );
}
