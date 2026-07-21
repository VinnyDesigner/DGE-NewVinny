import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Layers,
  BarChart3,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  FileText,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Download,
  Activity,
  Globe,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  Bar,
  BarChart,
} from "recharts";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/metadata/")({
  head: () => ({
    meta: [
      { title: "Metadata Dashboard — Data Automation Studio" },
      { name: "description", content: "Metadata health, completeness, compliance, and workflow status." },
    ],
  }),
  component: MetadataDashboardPage,
});

// Trend line chart data (Overview Tab)
const completenessTrendData = [
  { month: "Sep", AvgPercent: 55, Published: 15 },
  { month: "Oct", AvgPercent: 60, Published: 18 },
  { month: "Nov", AvgPercent: 68, Published: 22 },
  { month: "Dec", AvgPercent: 71, Published: 24 },
  { month: "Jan", AvgPercent: 74, Published: 26 },
  { month: "Feb", AvgPercent: 78, Published: 27 },
  { month: "Mar", AvgPercent: 82, Published: 29 },
];

// Donut chart template usage data (Overview Tab)
const templateUsageData = [
  { name: "ESRI", value: 11, color: "#3b82f6" },
  { name: "ISO 19115", value: 6, color: "#a855f7" },
  { name: "Organization Custom", value: 8, color: "#10b981" },
  { name: "Simplified", value: 4, color: "#f97316" },
  { name: "Full Metadata", value: 3, color: "#06b6d4" },
];

// Entity Compliance Tab Data
const entityComplianceData = [
  { name: "DMT", value: 94, layers: 6, color: "#10b981" },
  { name: "ADHA", value: 91, layers: 8, color: "#10b981" },
  { name: "EAD", value: 88, layers: 4, color: "#3b82f6" },
  { name: "ALDAR", value: 85, layers: 5, color: "#3b82f6" },
  { name: "DGE", value: 79, layers: 7, color: "#3b82f6" },
  { name: "ADDA", value: 76, layers: 4, color: "#3b82f6" },
  { name: "ADNOC", value: 62, layers: 3, color: "#eab308" },
  { name: "ADDC", value: 48, layers: 5, color: "#ef4444" },
];

// Field Coverage Tab Data
const fieldCoverageData = [
  { name: "Title", value: 100, color: "#10b981" },
  { name: "Description", value: 96, color: "#10b981" },
  { name: "Owner", value: 94, color: "#10b981" },
  { name: "Tags / Keywords", value: 88, color: "#3b82f6" },
  { name: "Coordinate Sys", value: 85, color: "#3b82f6" },
  { name: "Update Freq.", value: 78, color: "#3b82f6" },
  { name: "License", value: 71, color: "#3b82f6" },
  { name: "Data Standard", value: 64, color: "#eab308" },
  { name: "Contact Info", value: 58, color: "#eab308" },
  { name: "Lineage", value: 43, color: "#ef4444" },
];

// Workflow Status Tab Data
const approvalStatesData = [
  { name: "Approved", value: 24, color: "#10b981" },
  { name: "In Review", value: 5, color: "#3b82f6" },
  { name: "Draft", value: 9, color: "#64748b" },
  { name: "Rejected", value: 2, color: "#ef4444" },
  { name: "Needs Update", value: 2, color: "#eab308" },
];

const validationHistoryData = [
  { day: "Mar 8", Passed: 38, Failed: 4 },
  { day: "Mar 9", Passed: 39, Failed: 3 },
  { day: "Mar 10", Passed: 40, Failed: 3 },
  { day: "Mar 11", Passed: 40, Failed: 2 },
  { day: "Mar 12", Passed: 41, Failed: 2 },
  { day: "Mar 13", Passed: 42, Failed: 0 },
  { day: "Mar 14", Passed: 42, Failed: 1 },
];

// List of updated records (Always visible at bottom)
const updatedRecords = [
  {
    name: "Abu Dhabi Roads Network",
    score: "94%",
    validation: "Passed",
    date: "2024-03-12",
  },
  {
    name: "Housing Units Registry",
    score: "91%",
    validation: "Passed",
    date: "2024-03-11",
  },
  {
    name: "Environmental Monitoring Stations",
    score: "88%",
    validation: "Warning",
    date: "2024-03-10",
  },
  {
    name: "Real Estate Development Zones",
    score: "85%",
    validation: "Passed",
    date: "2024-03-08",
  },
  {
    name: "Digital Infrastructure Map",
    score: "76%",
    validation: "Warning",
    date: "2024-03-08",
  },
  {
    name: "Government Services Index",
    score: "79%",
    validation: "Warning",
    date: "2024-03-07",
  },
];

// List of records requiring attention (Always visible at bottom)
const attentionRecords = [
  {
    name: "Oil Pipeline Network",
    detail: "Validation error - 82% complete",
    errors: 2,
    warnings: 1,
    score: "62%",
  },
  {
    name: "Power Distribution Grid",
    detail: "Validation error - 48% complete",
    errors: 4,
    warnings: 2,
    score: "48%",
  },
];

function MetadataDashboardPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [activeTab, setActiveTab] = useState("overview");

  // Metrics configurations
  const metrics = [
    {
      label: "Layers with Metadata",
      sub: "8 total registered",
      value: "8",
      icon: Layers,
      tone: "blue",
      badge: "Up",
    },
    {
      label: "Avg. Completeness Score",
      sub: "Across all layers",
      value: "78%",
      icon: BarChart3,
      tone: "teal",
      badge: "Up",
    },
    {
      label: "High Quality Records",
      sub: "Completeness ≥ 80%",
      value: "4",
      icon: Star,
      tone: "emerald",
      badge: "Up",
    },
    {
      label: "Below 50% Completeness",
      sub: "Needs immediate attention",
      value: "1",
      icon: AlertTriangle,
      tone: "amber",
      badge: "Warn",
    },
    {
      label: "Published Records",
      sub: "50% publication rate",
      value: "4",
      icon: CheckCircle,
      tone: "green",
      badge: "Up",
    },
    {
      label: "In Review",
      sub: "Awaiting approval or changes",
      value: "2",
      icon: Clock,
      tone: "indigo",
      badge: null,
    },
    {
      label: "Validation Errors",
      sub: "3 warnings",
      value: "2",
      icon: Shield,
      tone: "rose",
      badge: "Low",
    },
    {
      label: "Active Templates",
      sub: "5 total templates",
      value: "5",
      icon: FileText,
      tone: "purple",
      badge: null,
    },
  ];

  const getIconWrapperClass = (tone: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      blue: {
        dark: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        light: "bg-blue-50 text-blue-700 border border-blue-200",
      },
      teal: {
        dark: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
        light: "bg-teal-50 text-teal-700 border border-teal-200",
      },
      emerald: {
        dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      amber: {
        dark: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        light: "bg-amber-50 text-amber-700 border border-amber-200",
      },
      green: {
        dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      indigo: {
        dark: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
        light: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      },
      rose: {
        dark: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        light: "bg-rose-50 text-rose-700 border border-rose-200",
      },
      purple: {
        dark: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        light: "bg-purple-50 text-purple-700 border border-purple-200",
      },
    };
    return styles[tone] ? (isLight ? styles[tone].light : styles[tone].dark) : "";
  };

  const getBadgeClass = (badge: string | null) => {
    if (!badge) return "";
    if (badge === "Up") {
      return isLight
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";
    }
    if (badge === "Warn") {
      return isLight
        ? "bg-amber-50 text-amber-700 border border-amber-200"
        : "bg-amber-500/10 text-amber-400 border border-amber-500/25";
    }
    return isLight
      ? "bg-rose-50 text-rose-700 border border-rose-200"
      : "bg-rose-500/10 text-rose-400 border border-rose-500/25";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="Metadata Management"
        title="Metadata Dashboard"
        description="Metadata health, completeness, compliance, and workflow status across all registered data layers."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/metadata/templates"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3.5 py-2 text-[14px] font-semibold text-foreground transition hover:bg-card/85 cursor-pointer"
            >
              <Layers className="h-4 w-4" /> Registry
            </Link>
            <Link
              to="/metadata/validation"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/95 cursor-pointer"
            >
              <FileText className="h-4 w-4" /> Templates
            </Link>
          </div>
        }
      />

      {/* Intelligence Banner */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 group/banner",
          isLight
            ? "bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200 text-slate-900 shadow-md hover:border-slate-300 hover:shadow-lg"
            : "bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 border-border/70 text-foreground hover:border-accent/35 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-12px_rgba(91,140,255,0.25)]"
        )}
      >
        {/* Depth elements: Mesh grid backdrop & ambient blur orbs */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] rounded-2xl"
          style={{
            backgroundImage:
              "linear-gradient(var(--muted-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--muted-foreground) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        <div className="absolute left-[15%] top-[-40%] h-36 w-60 rounded-full bg-primary/8 blur-[80px] pointer-events-none" />
        <div className="absolute right-[25%] bottom-[-40%] h-32 w-52 rounded-full bg-accent/6 blur-[80px] pointer-events-none" />

        <div className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full blur-3xl",
          isLight ? "bg-primary/5 opacity-60" : "bg-primary/10"
        )} />

        {/* Left: Title & metadata */}
        <div className="relative space-y-1 md:w-[35%] shrink-0">
          <div className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
            isLight
              ? "bg-blue-50 border border-blue-200 text-blue-700"
              : "bg-primary/15 border border-primary/30 text-accent"
          )}>
            <span className="relative flex h-1.5 w-1.5">
              <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full", isLight ? "bg-blue-400" : "bg-accent/70")} />
              <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", isLight ? "bg-blue-600" : "bg-accent")} />
            </span>
            Metadata Intelligence
          </div>
          <h3 className="text-[20px] font-black tracking-tight mt-1.5">Metadata Management</h3>
          <p className={cn("text-[13.5px]", isLight ? "text-slate-500" : "text-muted-foreground/80")}>
            8 records · 3 active templates · Mar 14, 2026
          </p>
        </div>

        {/* Middle: Centered metrics */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-center relative md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 px-4 w-full md:w-auto">
          <div>
            <div className="text-[28px] font-black group-hover/banner:text-accent transition duration-300">{`78%`}</div>
            <div className={cn("text-[11px] font-bold uppercase tracking-wider", isLight ? "text-slate-400" : "text-muted-foreground")}>
              Avg Completeness
            </div>
          </div>
          <div className="h-8 w-px bg-border/40 hidden sm:block" />
          <div>
            <div className="text-[28px] font-black group-hover/banner:text-accent transition duration-300">{`4`}</div>
            <div className={cn("text-[11px] font-bold uppercase tracking-wider", isLight ? "text-slate-400" : "text-muted-foreground")}>
              Published
            </div>
          </div>
          <div className="h-8 w-px bg-border/40 hidden sm:block" />
          <div>
            <div className="text-[28px] font-black text-rose-500">{`2`}</div>
            <div className={cn("text-[11px] font-bold uppercase tracking-wider", isLight ? "text-slate-400" : "text-muted-foreground")}>
              Validation Errors
            </div>
          </div>
        </div>

        {/* Right: Action button */}
        <div className="shrink-0 flex items-center justify-end md:w-[15%] w-full md:w-auto">
          <Link
            to="/metadata/templates"
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-xl px-4 py-2 text-[13px] font-bold transition cursor-pointer w-full md:w-auto",
              isLight
                ? "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                : "bg-white/[0.08] hover:bg-white/[0.14] text-white"
            )}
          >
            All Records <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 8 Grid Metric Cards */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {metrics.map((m, idx) => {
          const IconComp = m.icon;
          return (
            <Surface
              key={idx}
              padded={false}
              className="flex flex-col p-4 relative overflow-hidden group hover:border-accent/30 transition duration-300"
            >
              <div className="flex items-center justify-between gap-3">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", getIconWrapperClass(m.tone))}>
                  <IconComp className="h-4.5 w-4.5" />
                </div>
                {m.badge && (
                  <span className={cn("px-2 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wide border", getBadgeClass(m.badge))}>
                    {m.badge}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <div className="text-[26px] font-black text-foreground leading-none">{m.value}</div>
                <div className="mt-2 text-[13px] font-bold text-foreground/80 leading-tight">
                  {m.label}
                </div>
                <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                  {m.sub}
                </div>
              </div>
              <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition duration-300">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Surface>
          );
        })}
      </div>

      {/* Tabs Sub-navigation */}
      <div className="border-b border-border/60">
        <div className="flex items-center gap-2">
          {["overview", "entity-compliance", "field-coverage", "workflow-status"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-2.5 px-3 text-[14px] font-bold relative transition cursor-pointer capitalize -mb-px",
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Visualizations inside ONE SINGLE BIG CONTAINER */}
      <Surface className="p-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid gap-8 md:grid-cols-3">
            {/* Completeness Trend */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-[15.5px] font-bold text-foreground">Completeness Trend</h4>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  Avg completeness score & published records — 7 months
                </p>
              </div>

              <div className="h-[270px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={completenessTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      stroke="var(--muted-foreground)"
                      tick={{ fontSize: 11, fill: "var(--foreground)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      tick={{ fontSize: 11, fill: "var(--foreground)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <RTooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        fontSize: 13,
                      }}
                      labelStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                      itemStyle={{ color: isLight ? "#1e293b" : "#fff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="AvgPercent"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      name="Avg %"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Published"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      name="Published"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Template Usage */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-[15.5px] font-bold text-foreground">Template Usage</h4>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  Metadata template distribution across all active layers
                </p>
              </div>

              <div className="h-[180px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={templateUsageData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {templateUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[22px] font-black text-foreground">32</span>
                  <span className="text-[9.5px] text-muted-foreground font-semibold">Total Layers</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-semibold text-muted-foreground/80 mt-1">
                {templateUsageData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate leading-none">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ENTITY COMPLIANCE */}
        {activeTab === "entity-compliance" && (
          <div className="grid gap-8 md:grid-cols-2 divide-x divide-dashed divide-border/40">
            {/* Left side: Horizontal Chart */}
            <div className="space-y-4 pr-0 md:pr-8">
              <div>
                <h4 className="text-[15.5px] font-bold text-foreground">Metadata Completeness by Entity</h4>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  Compliance score across all 8 Abu Dhabi entities
                </p>
              </div>

              <div className="h-[270px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={entityComplianceData}
                    layout="vertical"
                    margin={{ top: 5, right: 15, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fontWeight: "bold" }} />
                    <RTooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="value" name="Completeness (%)" radius={[0, 4, 4, 0]} barSize={12}>
                      {entityComplianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right side: detail list with proper colored cards and thick progress bars matching reference (Image 2) */}
            <div className="space-y-4 pl-0 md:pl-8">
              <div>
                <h4 className="text-[15.5px] font-bold text-foreground">Compliance Detail List</h4>
                <p className="text-[13px] text-muted-foreground mt-0.5">Scores & registered layers count</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[280px] pr-1 pt-1">
                {entityComplianceData.map((ent, idx) => {
                  // Determine theme colors dynamically based on percentage threshold
                  const isExcellent = ent.value >= 90;
                  const isGood = ent.value >= 70 && ent.value < 90;
                  const isFair = ent.value >= 50 && ent.value < 70;

                  const cardClass = isExcellent
                    ? (isLight ? "bg-emerald-50/70 border-emerald-200 text-emerald-950" : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400")
                    : isGood
                    ? (isLight ? "bg-blue-50/70 border-blue-200 text-blue-950" : "bg-blue-500/5 border-blue-500/20 text-blue-400")
                    : isFair
                    ? (isLight ? "bg-amber-50/70 border-amber-200 text-amber-950" : "bg-amber-500/5 border-amber-500/20 text-amber-400")
                    : (isLight ? "bg-rose-50/70 border-rose-200 text-rose-950" : "bg-rose-500/5 border-rose-500/20 text-rose-400");

                  const progressColor = isExcellent
                    ? "bg-emerald-500"
                    : isGood
                    ? "bg-blue-500"
                    : isFair
                    ? "bg-amber-500"
                    : "bg-rose-500";

                  const scoreTextColor = isExcellent
                    ? (isLight ? "text-emerald-700" : "text-emerald-400")
                    : isGood
                    ? (isLight ? "text-blue-700" : "text-blue-400")
                    : isFair
                    ? (isLight ? "text-amber-700" : "text-amber-400")
                    : (isLight ? "text-rose-700" : "text-rose-400");

                  return (
                    <div
                      key={idx}
                      className={cn(
                        "p-3.5 rounded-xl border flex flex-col gap-2 transition duration-300",
                        cardClass
                      )}
                    >
                      {/* Top row acronym and score percentage */}
                      <div className="flex items-center justify-between text-[12.5px] font-bold">
                        <span className={isLight ? "text-slate-700" : "text-foreground"}>{ent.name}</span>
                        <span className={cn("font-black text-[13px]", scoreTextColor)}>{ent.value}%</span>
                      </div>

                      {/* Middle thick progress bar */}
                      <div className={cn("w-full h-2 rounded-full overflow-hidden", isLight ? "bg-slate-200/80" : "bg-slate-800/80")}>
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", progressColor)}
                          style={{ width: `${ent.value}%` }}
                        />
                      </div>

                      {/* Bottom row layer count */}
                      <div className={cn("text-[10.5px] font-semibold", isLight ? "text-slate-500" : "text-muted-foreground/80")}>
                        {ent.layers} layers
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FIELD COVERAGE */}
        {activeTab === "field-coverage" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-[15.5px] font-bold text-foreground">Metadata Field Coverage</h4>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  Percentage of records with each field populated
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 pt-2">
                {fieldCoverageData.map((field, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <span className="w-[120px] text-[13px] font-semibold text-muted-foreground truncate">
                      {field.name}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-border/45 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${field.value}%`, backgroundColor: field.color }} />
                    </div>
                    <span className="w-10 text-right text-[12.5px] font-extrabold text-foreground">
                      {field.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 pt-2">
              <div className={cn("p-4 rounded-xl border flex flex-col justify-center items-center text-center", isLight ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400")}>
                <div className="text-[26px] font-black">3</div>
                <div className="text-[11.5px] font-bold mt-1">Excellent (≥ 90%)</div>
              </div>
              <div className={cn("p-4 rounded-xl border flex flex-col justify-center items-center text-center", isLight ? "bg-blue-50 border-blue-200 text-blue-950" : "bg-blue-500/5 border-blue-500/20 text-blue-400")}>
                <div className="text-[26px] font-black">4</div>
                <div className="text-[11.5px] font-bold mt-1">Good (70-89%)</div>
              </div>
              <div className={cn("p-4 rounded-xl border flex flex-col justify-center items-center text-center", isLight ? "bg-amber-50 border-amber-200 text-amber-950" : "bg-amber-500/5 border-amber-500/20 text-amber-400")}>
                <div className="text-[26px] font-black">2</div>
                <div className="text-[11.5px] font-bold mt-1">Fair (50-69%)</div>
              </div>
              <div className={cn("p-4 rounded-xl border flex flex-col justify-center items-center text-center", isLight ? "bg-rose-50 border-rose-200 text-rose-950" : "bg-rose-500/5 border-rose-500/20 text-rose-400")}>
                <div className="text-[26px] font-black">1</div>
                <div className="text-[11.5px] font-bold mt-1">Low (&lt; 50%)</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WORKFLOW STATUS */}
        {activeTab === "workflow-status" && (
          <div className="space-y-6">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Donut states */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-[15.5px] font-bold text-foreground">Workflow & Approval Status</h4>
                  <p className="text-[13px] text-muted-foreground mt-0.5">Metadata record lifecycle and approval states</p>
                </div>

                <div className="h-[140px] w-full flex items-center justify-center relative mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={approvalStatesData}
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {approvalStatesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[20px] font-black text-foreground">42</span>
                    <span className="text-[9px] text-muted-foreground font-semibold uppercase">Total</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px] font-semibold text-muted-foreground mt-2">
                  {approvalStatesData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name} {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation history bar chart */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="text-[15.5px] font-bold text-foreground">Validation Pass/Fail</h4>
                  <p className="text-[13px] text-muted-foreground mt-0.5">Activity results from last 7 days checks</p>
                </div>

                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={validationHistoryData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
                      <XAxis dataKey="day" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                      <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                      <RTooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 12,
                          fontSize: 13,
                        }}
                      />
                      <Bar dataKey="Passed" fill="#10b981" radius={[3, 3, 0, 0]} barSize={10} />
                      <Bar dataKey="Failed" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Workflow cards row */}
            <div className="grid gap-3 grid-cols-3 pt-2">
              <div className={cn("p-3.5 rounded-xl border flex flex-col items-center text-center", isLight ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400")}>
                <div className="text-[22px] font-black">4</div>
                <div className="text-[11.5px] font-bold mt-1">WF Approved</div>
              </div>
              <div className={cn("p-3.5 rounded-xl border flex flex-col items-center text-center", isLight ? "bg-blue-50 border-blue-200 text-blue-950" : "bg-blue-500/5 border-blue-500/20 text-blue-400")}>
                <div className="text-[22px] font-black">2</div>
                <div className="text-[11.5px] font-bold mt-1">In Review</div>
              </div>
              <div className={cn("p-3.5 rounded-xl border flex flex-col items-center text-center", isLight ? "bg-rose-50 border-rose-200 text-rose-950" : "bg-rose-500/5 border-rose-500/20 text-rose-400")}>
                <div className="text-[22px] font-black">1</div>
                <div className="text-[11.5px] font-bold mt-1">WF Rejected</div>
              </div>
            </div>
          </div>
        )}
      </Surface>

      {/* Activity Grid (ALWAYS VISIBLE AT BOTTOM) */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recently Updated Records */}
        <Surface className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-[15.5px] font-bold text-foreground">Recently Updated Records</h4>
                <p className="text-[13px] text-muted-foreground mt-0.5">Latest metadata activities</p>
              </div>
              <Link
                to="/metadata/templates"
                className="text-[12.5px] font-bold text-primary hover:underline flex items-center gap-0.5"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              {updatedRecords.map((rec, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-card/60 border border-border/60">
                      <FileText className="h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-[13.5px] font-bold text-foreground leading-tight">
                        {rec.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11.5px] text-muted-foreground">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-bold border leading-none uppercase",
                            rec.validation === "Passed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          )}
                        >
                          {rec.validation}
                        </span>
                        <span>Completeness: <strong className="text-foreground">{rec.score}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[12.5px] text-muted-foreground font-semibold shrink-0">
                    {rec.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Surface>

        {/* Attention Required */}
        <Surface className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-[15.5px] font-bold text-foreground">Attention Required</h4>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  Records with validation errors or low completeness
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                  2 errors
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                  1 low
                </span>
              </div>
            </div>

            <div className="divide-y divide-border/60">
              {attentionRecords.map((rec, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-rose-500/5 border border-rose-500/15">
                      <AlertTriangle className="h-4.5 w-4.5 text-rose-400" />
                    </div>
                    <div>
                      <div className="text-[13.5px] font-bold text-foreground leading-tight">
                        {rec.name}
                      </div>
                      <div className="text-[12px] text-muted-foreground mt-1 leading-none">
                        {rec.detail}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-[12px] text-muted-foreground/80 font-bold hidden sm:block">
                      {rec.errors} errors · {rec.warnings} warnings
                    </div>
                    <div className="text-[18px] font-extrabold text-rose-400">
                      {rec.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 mt-6">
            <Link
              to="/metadata/templates"
              className="text-[13px] font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              Manage all metadata records <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </Surface>
      </div>

      {/* Bottom Status Bar (ALWAYS VISIBLE AT BOTTOM) */}
      <Surface padded={false} className="p-3 bg-card/45 border-border/60">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-bold text-muted-foreground/90 justify-center sm:justify-start">
          <span className="text-foreground uppercase tracking-wide">Record Status:</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>4 Published</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span>2 In Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span>2 Draft</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span>4 WF Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>1 WF Rejected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>3 Warnings</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600" />
            <span>2 Errors</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            <span>5 Templates Active</span>
          </div>
        </div>
      </Surface>
    </div>
  );
}
