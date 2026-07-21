import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Braces,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Clock,
  Database,
  ExternalLink,
  FileText,
  Gauge,
  GitBranch,
  Layers,
  MapPin,
  Plus,
  RefreshCw,
  ShieldCheck,
  Send,
  Users,
  Wand2,
  Zap,
  Server,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface, GlowSurface, GlowCircle } from "@/components/app/Surface";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";



export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Data Automation Studio" },
      { name: "description", content: "Executive analytics for your enterprise data platform." },
    ],
  }),
  component: Dashboard,
});

// ── DATA (unchanged from reference) ────────────────────────────────────────
const trend = Array.from({ length: 12 }).map((_, i) => {
  const d = new Date(2026, 5, 28 + i); // Jun 28 → Jul 9, 2026
  const month = d.toLocaleString("en-US", { month: "short" });
  return {
    day: `${month} ${d.getDate()}`,
    success: 22 + Math.round(Math.sin(i / 2) * 6) + i * 1.4,
    failed: 4 + Math.round(Math.cos(i / 3) * 2),
    warn: 3 + Math.round(Math.sin(i / 1.7) * 1.6),
  };
});

const entities = [
  { name: "DMT", value: 487, color: "#10b981" },
  { name: "EAD", value: 312, color: "#22c55e" },
  { name: "ADNOC", value: 248, color: "#5b8cff" },
  { name: "ADHA", value: 195, color: "#a855f7" },
  { name: "ADDC", value: 178, color: "#f59e0b" },
  { name: "ADDA", value: 143, color: "#2563eb" },
  { name: "DGE", value: 98, color: "#10b981" },
  { name: "Aldar", value: 64, color: "#ef4444" },
];

const layers = [
  { name: "DMT_ROADS_V3", pct: 99.4 },
  { name: "ADHA_HOUSING_V4", pct: 98.7 },
  { name: "EAD_AIR_STAT_V2", pct: 97.9 },
  { name: "INFRA_PIPELINES", pct: 96.2 },
  { name: "GOV_SERVICES_V2", pct: 94.1 },
  { name: "DMT_PARCELS_V2", pct: 91.6 },
  { name: "INFRA_ELEC_GRID", pct: 86.4 },
  { name: "BASEMAP_DB", pct: 83.2 },
];

const activity = [
  { icon: GitBranch, title: "DMT Roads Network sync", meta: "DEL-0947 · DMT", tag: "running", tone: "info", time: "just now" },
  { icon: Database, title: "ADGE_SYNC_SQL health check", meta: "INST-002 · 35ms latency", tag: "success", tone: "success", time: "12m ago" },
  { icon: GitBranch, title: "EAD Wetlands enrichment", meta: "DEL-0945 · EAD", tag: "warning", tone: "warning", time: "28m ago" },
  { icon: ShieldCheck, title: "CRS Projection Check", meta: "DMT_ROADS · 3,210 failed", tag: "failed", tone: "danger", time: "1h ago" },
  { icon: FileText, title: "ADNOC Pipeline GeoData sync", meta: "Connection timeout", tag: "failed", tone: "danger", time: "2h ago" },
  { icon: MapPin, title: "ADHA mapping validated", meta: "ADGE_MAIN_SQL / ADHA_DB", tag: "success", tone: "success", time: "3h ago" },
  { icon: GitBranch, title: "SHARED_INFRA_DB sync complete", meta: "DEL-0943 · ADDC", tag: "success", tone: "success", time: "5h ago" },
  { icon: FileText, title: "Metadata sync — 8 records updated", meta: "Avg completeness: 82%", tag: "success", tone: "success", time: "7h ago" },
];

const alerts = [
  { title: "CRS mismatch in DMT_ROADS_NETWORK", meta: "3,210 records: EPSG:32632 → EPSG:4326", tone: "danger", tag: "error", time: "1h ago" },
  { title: "ADNOC Pipeline source timeout", meta: "DS-005 · Connection refused after 5000ms", tone: "danger", tag: "error", time: "2h ago" },
  { title: "JOB-0942 transform failed", meta: "INFRA_ELEC_GRID · invalid CRS EPSG:99999", tone: "danger", tag: "error", time: "10h ago" },
  { title: "EAD metadata completeness 38%", meta: "EAD_WETLANDS_V1 · below 50% threshold", tone: "warning", tag: "warning", time: "3h ago" },
  { title: "BASEMAP_DB sync delayed 14h", meta: "ADGE_PUBLISH_SQL · last sync 2026-07-08 18:00", tone: "warning", tag: "warning", time: "14h ago" },
  { title: "ADDC meter layer null geometries", meta: "INFRA_METERS_V2 · 3 null geometry records", tone: "warning", tag: "warning", time: "34m ago" },
];

const recent = [
  { title: "Layer registered", meta: "DMT_ROADS_NETWORK_V4", tag: "Data Layers", tone: "success", time: "2m ago" },
  { title: "Job submitted", meta: "JOB-0924 · EAD", tag: "Jobs", tone: "info", time: "12m ago" },
  { title: "Schedule created", meta: "EAD Air Quality — Daily", tag: "Schedules", tone: "info", time: "35m ago" },
  { title: "Source onboarded", meta: "ADNOC GeoServer WFS", tag: "Data Sources", tone: "success", time: "1h ago" },
  { title: "Quality rule updated", meta: "CRS Projection Check", tag: "Quality Rules", tone: "warning", time: "2h ago" },
  { title: "Metadata published", meta: "DMT Roads Metadata v3", tag: "Metadata", tone: "info", time: "4h ago" },
];

const quickNav = [
  { l: "Data Sources", to: "/data-sources/index", i: Server },
  { l: "Data Layers", to: "/data-management/layers", i: Layers },
  { l: "Deliveries", to: "/operations/deliveries", i: Send },
  { l: "Workflow Monitor", to: "/operations/workflow", i: Activity },
  { l: "Data Quality", to: "/quality/rules", i: ShieldCheck },
  { l: "Automation Tools", to: "/tools/automation", i: Wand2 },
  { l: "Schedules", to: "/operations/schedules", i: Clock },
  { l: "Metadata", to: "/metadata", i: FileText },
  { l: "Data Insights", to: "/insights/analytics", i: Braces },
  { l: "Entity", to: "/entities/entity", i: Users },
  { l: "Layer Config", to: "/data-management/layer-config", i: Layers },
  { l: "Database Mapping", to: "/data-management/db-mapping", i: GitBranch },
  { l: "Representatives", to: "/entities/representatives", i: Users },
];

function toneClass(t: string) {
  return t === "success"
    ? "bg-success/15 text-success ring-success/25"
    : t === "warning"
    ? "bg-warning/15 text-warning ring-warning/25"
    : t === "danger"
    ? "bg-danger/15 text-danger ring-danger/25"
    : "bg-accent/15 text-accent ring-accent/25";
}

function toneDot(t: string) {
  return t === "success" ? "bg-success" : t === "warning" ? "bg-warning" : t === "danger" ? "bg-danger" : "bg-accent";
}

function Dashboard() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <div className="space-y-6">
      {/* HERO strip with inline metrics */}
      <GlowSurface className="!p-0" accent="success" variant="corners">
        {/* Light theme hero gradient is handled by the GlowSurface;
            dark mode keeps the original overlay glows. */}
        {!isLight && (
          <>
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#a855f7]/25 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#a855f7]/15 blur-[100px]" />
          </>
        )}

        <div className="relative flex flex-col gap-6 py-6 px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
            <InlineMetric label="Records today" value="2.4M" hint="↑ 12.3%" hintTone="success" />
            <InlineMetric label="Composite success" value="94.8%" hint="Composite" />
            <InlineMetric label="Avg cycle time" value="42m" hint="Per workflow" />
            <InlineMetric label="Alerts" value="6" hint="3 Errors · 3 Warnings" hintTone="danger" isCount />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-start lg:self-center">
            <button className={cn(
              "group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-all hover:-translate-y-px",
              isLight
                ? "bg-linear-to-r from-[#2563eb] to-[#3b82f6] text-white shadow-[0_8px_24px_-6px_rgba(37,99,235,0.35)] ring-1 ring-inset ring-white/20 hover:shadow-[0_10px_30px_-6px_rgba(37,99,235,0.45)]"
                : "bg-linear-to-r from-[#3b82f6] to-[#1d4ed8] text-white shadow-[0_8px_24px_-6px_rgba(59,130,246,0.6)] ring-1 ring-inset ring-white/15 hover:shadow-[0_10px_30px_-6px_rgba(59,130,246,0.75)]"
            )}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <Activity className="h-3.5 w-3.5" /> Live Monitor
            </button>
            <button className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium transition-all",
              isLight
                ? "border-border/60 bg-white/70 text-foreground/70 hover:border-[#a855f7]/30 hover:bg-white hover:text-foreground"
                : "border-border/60 bg-card/60 text-foreground/70 hover:border-[#a855f7]/40 hover:text-foreground"
            )}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
        </div>
      </GlowSurface>


      {/* QUICK NAV */}
      <Surface className="!p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-1 inline-flex items-center gap-1.5 text-[15px] font-semibold tracking-wide text-muted-foreground">
            <Zap className="h-3 w-3 text-accent" /> Quick Nav
          </div>
          {quickNav.map((q) => (
            <Link
              key={q.l}
              to={q.to}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-foreground/[0.02] px-2.5 py-1.5 text-[15px] text-foreground/80 transition-all hover:-translate-y-px hover:border-accent/40 hover:bg-accent/10 hover:text-foreground"
            >
              <q.i className="h-3.5 w-3.5 text-accent/80 group-hover:text-accent" />
              {q.l}
            </Link>
          ))}
          <span className="ml-auto text-[15px] text-muted-foreground">13 modules</span>
        </div>
      </Surface>

      {/* MODULE KPI CARDS (row 1) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ModuleCard
          icon={<Layers className="h-4 w-4" />}
          label="Data Layers"
          value="0"
          unit="Registered"
          accent="info"
          chips={[
            { l: "0 active", tone: "success" },
            { l: "0 warn", tone: "warning" },
            { l: "0 error", tone: "danger" },
          ]}
          progress={0}
        />
        <ModuleCard
          icon={<Server className="h-4 w-4" />}
          label="Data Sources"
          value="0"
          unit="Sources"
          accent="primary"
          chips={[
            { l: "0 connected", tone: "success" },
            { l: "0 error", tone: "danger" },
            { l: "0 pending", tone: "warning" },
          ]}
          progress={0}
        />
        <ModuleCard
          icon={<Briefcase className="h-4 w-4" />}
          label="Jobs"
          value="47"
          unit="This Cycle"
          accent="secondary"
          chips={[
            { l: "31 done", tone: "success" },
            { l: "3 live", tone: "info" },
            { l: "4 fail", tone: "danger" },
          ]}
          progress={72}
        />
        <ModuleCard
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Data Quality"
          value="94.8%"
          unit="Avg Pass Rate"
          accent="success"
          chips={[
            { l: "19 pass", tone: "success" },
            { l: "3 warn", tone: "warning" },
            { l: "2 fail", tone: "danger" },
          ]}
          progress={94.8}
        />
      </div>

      {/* MODULE KPI CARDS (row 2) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ModuleCard
          icon={<Database className="h-4 w-4" />}
          label="Registered Database Instances"
          value="2"
          unit="Instances"
          accent="success"
          chips={[
            { l: "2 with databases", tone: "success" },
            { l: "7 databases", tone: "info" },
            { l: "5 entities", tone: "secondary" },
          ]}
          progress={100}
        />
        <ModuleCard
          icon={<GitBranch className="h-4 w-4" />}
          label="Data Mapping"
          value="5"
          unit="Mappings"
          accent="secondary"
          chips={[
            { l: "5 active", tone: "success" },
            { l: "1 instances", tone: "info" },
            { l: "5 entities", tone: "secondary" },
          ]}
          progress={100}
        />
        <ModuleCard
          icon={<Users className="h-4 w-4" />}
          label="Entities"
          value="5"
          unit="Entities"
          accent="primary"
          chips={[{ l: "5 active", tone: "success" }]}
          progress={100}
        />
        <ModuleCard
          icon={<FileText className="h-4 w-4" />}
          label="Metadata Management"
          value="42"
          unit="Records"
          accent="info"
          chips={[
            { l: "28 published", tone: "success" },
            { l: "5 review", tone: "warning" },
            { l: "3 errors", tone: "danger" },
          ]}
          progress={82}
        />
      </div>

      {/* SMALL KPI ROW */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat i={<Database className="h-3.5 w-3.5" />} l="Records Today" v="2.4M" h="+12.3% vs yesterday" tone="primary" up />
        <MiniStat i={<CheckCircle2 className="h-3.5 w-3.5" />} l="Composite Success" v="94.8%" h="Tools · Schedules · QA" tone="success" up />
        <MiniStat i={<Clock className="h-3.5 w-3.5" />} l="Avg Cycle Time" v="42m" h="Per completed workflow" tone="info" />
        <MiniStat i={<Gauge className="h-3.5 w-3.5" />} l="SLA Compliance" v="31/47" h="Deliveries on schedule" tone="warning" />
        <MiniStat i={<Users className="h-3.5 w-3.5" />} l="Active Entities" v="8" h="With ≥1 delivery this week" tone="secondary" />
        <MiniStat i={<Database className="h-3.5 w-3.5" />} l="Data Volume" v="142 GB" h="Total ingested today" tone="info" />
        <MiniStat i={<ShieldCheck className="h-3.5 w-3.5" />} l="Metadata Coverage" v="82%" h="28 published records" tone="success" />
        <MiniStat i={<Zap className="h-3.5 w-3.5" />} l="Registry Instances" v="0" h="2 total · 7 databases" tone="primary" />
      </div>

      {/* CHART ROW */}
      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <Surface>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-h4 text-foreground">Execution Volume Trend</div>
              <div className="text-[15px] text-muted-foreground">Success · Failed · Warning — last 12 days</div>
            </div>
            <div className="flex items-center gap-3 text-[15px]">
              <Legend c="#5b8cff" l="Success" />
              <Legend c="#ef4444" l="Failed" />
              <Legend c="#f59e0b" l="Warn" />
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer>
              <AreaChart data={trend} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSuccess" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#5b8cff" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#5b8cff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gFail" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="4 4" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" tick={{ fontSize: 15, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 15, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <RTooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 15 }} labelStyle={{ color: isLight ? "#1e293b" : "#fff" }} itemStyle={{ color: isLight ? "#1e293b" : "#fff" }} />
                <Area type="monotone" dataKey="success" stroke="#5b8cff" strokeWidth={2.2} fill="url(#gSuccess)" />
                <Area type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={1.8} fill="url(#gFail)" />
                <Area type="monotone" dataKey="warn" stroke="#f59e0b" strokeWidth={1.6} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <Surface>
          <div className="mb-2">
            <div className="text-h4 text-foreground">Deliveries by Entity</div>
            <div className="text-[15px] text-muted-foreground">All-time volume per Abu Dhabi entity</div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer>
              <BarChart data={entities} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="4 4" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fontSize: 15, fill: "var(--foreground)" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" tick={{ fontSize: 15, fontWeight: 700, fill: "var(--foreground)" }} tickLine={false} axisLine={false} width={72} />
                <RTooltip cursor={{ fill: "rgba(100,116,139,0.08)" }} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 15 }} labelStyle={{ color: isLight ? "#1e293b" : "#fff" }} itemStyle={{ color: isLight ? "#1e293b" : "#fff" }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={16}>
                  {entities.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </div>

      {/* QUALITY PASS RATE BY LAYER */}
      <Surface>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-h4 text-foreground">Data Quality Pass Rate by Layer</div>
            <div className="text-[15px] text-muted-foreground">Latest validation run — top 8 layers across all entities</div>
          </div>
          <Link to="/quality/rules" className="inline-flex items-center gap-1 text-[15px] text-accent hover:underline">
            View all rules <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {layers.map((l) => (
            <div key={l.name} className="rounded-xl border border-foreground/5 bg-foreground/[0.02] p-3">
              <div className="flex items-center justify-between text-[15px]">
                <span className="font-mono text-foreground/80">{l.name}</span>
                <span className={l.pct >= 95 ? "text-success" : l.pct >= 90 ? "text-warning" : "text-danger"}>
                  {l.pct}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${l.pct}%`,
                    background:
                      l.pct >= 95
                        ? "linear-gradient(90deg,#10b981,#5b8cff)"
                        : l.pct >= 90
                        ? "linear-gradient(90deg,#f59e0b,#f5b649)"
                        : "linear-gradient(90deg,#ef4444,#f97316)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Surface>

      {/* LIVE ACTIVITY + ISSUES */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Surface>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-h4 text-foreground">Live Activity Feed</div>
              <div className="text-[15px] text-muted-foreground">System-wide events, real-time</div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[15px] font-medium text-success ring-1 ring-inset ring-success/25">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Live
            </span>
          </div>
          <div className="space-y-2">
            {activity.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3 rounded-xl border border-foreground/5 bg-foreground/[0.02] p-3 transition-colors hover:bg-foreground/[0.04]"
              >
                <span className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg ring-1 ring-inset ${toneClass(a.tone)}`}>
                  <a.icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[16px] font-medium text-foreground">{a.title}</span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[14px] font-medium ring-1 ring-inset ${toneClass(a.tone)}`}>{a.tag}</span>
                  </div>
                  <div className="truncate text-[15px] text-muted-foreground">{a.meta}</div>
                </div>
                <span className="whitespace-nowrap text-[15px] text-muted-foreground">{a.time}</span>
              </motion.div>
            ))}
          </div>
          <Link to="/operations/workflow" className="mt-3 inline-flex items-center gap-1 text-[15px] text-accent hover:underline">
            View full pipeline monitor <ExternalLink className="h-3 w-3" />
          </Link>
        </Surface>

        <Surface>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-h4 text-foreground">Issues &amp; Alerts</div>
              <div className="text-[15px] text-muted-foreground">Items requiring attention</div>
            </div>
            <div className="flex items-center gap-2 text-[15px]">
              <span className="rounded-full bg-danger/10 px-2 py-0.5 text-danger ring-1 ring-inset ring-danger/25">3 critical</span>
              <span className="rounded-full bg-warning/10 px-2 py-0.5 text-warning ring-1 ring-inset ring-warning/25">3 warning</span>
            </div>
          </div>
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-foreground/5 bg-foreground/[0.02] p-3">
                <span className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg ring-1 ring-inset ${toneClass(a.tone)}`}>
                  <AlertTriangle className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[16px] font-medium text-foreground">{a.title}</span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[14px] font-medium ring-1 ring-inset ${toneClass(a.tone)}`}>{a.tag}</span>
                  </div>
                  <div className="truncate text-[15px] text-muted-foreground">{a.meta}</div>
                </div>
                <span className="whitespace-nowrap text-[15px] text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[15px] text-muted-foreground">Click any issue to navigate to the relevant module</div>
        </Surface>
      </div>

      {/* ADD NEW + RECENT ACTIONS */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Surface>
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent ring-1 ring-inset ring-accent/25">
              <Plus className="h-4 w-4" />
            </span>
            <div>
              <div className="text-h4 text-foreground">Add New</div>
              <div className="text-[15px] text-muted-foreground">Create and register items quickly</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <QuickTile to="/data-sources/onboard" l="Register Source" s="Connect a new DB, API or file" i={Database} tone="primary" />
            <QuickTile to="/data-management/layers" l="Add Data Layer" s="Register a new geospatial layer" i={Layers} tone="info" />
            <QuickTile to="/operations/jobs" l="Submit Job" s="Submit a new processing job" i={Activity} tone="warning" />
            <QuickTile to="/operations/schedules" l="Create Schedule" s="Set up a recurring run" i={Clock} tone="secondary" />
            <QuickTile to="/entities/entity" l="New Entity" s="Onboard a government entity" i={Users} tone="success" />
            <QuickTile to="/metadata" l="Add Metadata" s="Document a layer" i={FileText} tone="info" />
            <QuickTile to="/quality/rules" l="Quality Rule" s="Define a QA validation rule" i={ShieldCheck} tone="success" />
            <QuickTile to="/data-management/db-mapping" l="Map Database" s="Link instance to entity schema" i={GitBranch} tone="danger" />
          </div>
        </Surface>

        <Surface>
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--secondary-accent)]/15 text-[color:var(--secondary-accent)] ring-1 ring-inset ring-[color:var(--secondary-accent)]/25">
              <ClipboardList className="h-4 w-4" />
            </span>
            <div>
              <div className="text-h4 text-foreground">Recent Actions</div>
              <div className="text-[15px] text-muted-foreground">Your latest activity across modules</div>
            </div>
          </div>
          <div className="space-y-2">
            {recent.map((r, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-foreground/5 bg-foreground/[0.02] p-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${toneDot(r.tone)}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[16px] font-medium text-foreground">{r.title}</div>
                  <div className="truncate text-[15px] text-muted-foreground">{r.meta}</div>
                  <span className={`mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[14px] font-medium ring-1 ring-inset ${toneClass(r.tone)}`}>
                    {r.tag}
                  </span>
                </div>
                <span className="whitespace-nowrap text-[15px] text-muted-foreground">{r.time}</span>
              </div>
            ))}
          </div>
          <Link to="/admin/audit" className="mt-3 inline-flex items-center gap-1 text-[15px] text-accent hover:underline">
            Full audit log <ExternalLink className="h-3 w-3" />
          </Link>
        </Surface>
      </div>

      {/* Hidden default header (kept for import parity) */}
      <div className="sr-only">
        <PageHeader title="Dashboard" />
      </div>
    </div>
  );
}

// ── SUBCOMPONENTS ──────────────────────────────────────────────────────────
function InlineMetric({
  label,
  value,
  hint,
  hintTone,
  isCount,
}: {
  label: string;
  value: string;
  hint?: string;
  hintTone?: "success" | "danger";
  isCount?: boolean;
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <div className="min-w-0">
      <div className={`text-[24px] xs:text-[28px] sm:text-[32px] md:text-[36px] lg:text-[42px] xl:text-[48px] font-black leading-none tracking-tight ${isCount ? "text-danger" : "text-foreground"}`}>
        {value}
      </div>
      <div className="mt-1.5 text-[11.5px] xs:text-[12px] sm:text-[12.5px] font-bold tracking-wide text-foreground/70 lg:text-[13.5px]">
        {label}
      </div>
      {hint && (
        <div
          className={`mt-1 text-[10px] xs:text-[10.5px] sm:text-[11px] font-semibold lg:text-[12px] ${
            hintTone === "success" ? "text-success" : hintTone === "danger" ? "text-danger" : "text-muted-foreground"
          }`}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

function ModuleCard({
  icon,
  label,
  value,
  unit,
  accent,
  chips,
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  accent: "primary" | "success" | "warning" | "danger" | "info" | "secondary";
  chips: { l: string; tone: string }[];
  progress: number;
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const tint: Record<string, string> = {
    primary: "from-primary/25 via-primary/10",
    success: "from-success/25 via-success/10",
    warning: "from-warning/25 via-warning/10",
    danger: "from-danger/25 via-danger/10",
    info: "from-info/25 via-info/10",
    secondary: "from-[color:var(--secondary-accent)]/25 via-[color:var(--secondary-accent)]/10",
  };
  const bar: Record<string, string> = {
    primary: isLight ? "from-[#5b8cff] to-[#7c3aed]" : "from-primary to-accent",
    success: isLight ? "from-[#10b981] to-[#0ea5e9]" : "from-success to-accent",
    warning: isLight ? "from-[#f59e0b] to-[#f97316]" : "from-warning to-danger",
    danger: isLight ? "from-[#ef4444] to-[#f97316]" : "from-danger to-warning",
    info: isLight ? "from-[#06b6d4] to-[#5b8cff]" : "from-info to-accent",
    secondary: isLight ? "from-[#7c3aed] to-[#5b8cff]" : "from-[color:var(--secondary-accent)] to-accent",
  };
  const topGlow: Record<string, string> = {
    primary: "from-primary/30",
    success: "from-success/30",
    warning: "from-warning/30",
    danger: "from-danger/30",
    info: "from-info/30",
    secondary: "from-[color:var(--secondary-accent)]/30",
  };
  const topLine: Record<string, string> = {
    primary: "via-primary/50",
    success: "via-success/50",
    warning: "via-warning/50",
    danger: "via-danger/50",
    info: "via-info/50",
    secondary: "via-[color:var(--secondary-accent)]/50",
  };
  return (
    <div className={cn(
      "group relative flex h-full flex-col overflow-hidden rounded-2xl py-2.5 px-4 transition-all hover:-translate-y-0.5",
      isLight
        ? `glossy-card glossy-card--${accent}`
        : "border border-border/60 bg-card/60 shadow-card backdrop-blur-xl hover:border-accent/40 hover:shadow-elevated"
    )}>


      {/* Top edge glow wash — neutral in light theme so the card stays clean */}
      <div className={cn(
        "pointer-events-none absolute inset-x-0 -top-8 h-28 bg-linear-to-b to-transparent opacity-70 blur-2xl",
        isLight ? "from-slate-400/10" : topGlow[accent]
      )} />
      {/* Top highlight line — neutral in light theme */}
      <div className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-60",
        isLight ? "via-slate-400/25" : topLine[accent]
      )} />
      <div className={cn(
        "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-linear-to-br to-transparent blur-2xl",
        isLight ? "from-white/50" : tint[accent]
      )} />
      <div className="relative flex items-start justify-between">
        <GlowCircle accent={accent} size="sm">{icon}</GlowCircle>
        <div className="text-right">
          <div className="text-[26px] font-bold leading-none tracking-tight text-foreground lg:text-[30px]">{value}</div>
          <div className="mt-0.5 text-[13px] tracking-wide text-muted-foreground lg:text-[14px]">{unit}</div>
        </div>
      </div>
      <div className="relative mt-1.5 text-[13px] font-semibold text-foreground/90 lg:text-[14px]">{label}</div>
      <div className="relative mt-1.5 flex min-h-[24px] flex-wrap content-start gap-1.5">
        {chips.map((c, i) => (
          <span key={i} className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[12px] font-medium ring-1 ring-inset ${toneClass(c.tone)}`}>
            <span className={`h-1 w-1 rounded-full ${toneDot(c.tone)}`} />
            {c.l}
          </span>
        ))}
      </div>
      <div className="relative mt-auto pt-0.5">
        <div className="relative mt-1.5 h-1 overflow-hidden rounded-full bg-foreground/5">
          <div className={`h-full rounded-full bg-linear-to-r ${bar[accent]}`} style={{ width: `${Math.max(progress, 3)}%` }} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  i,
  l,
  v,
  h,
  tone,
  up,
}: {
  i: React.ReactNode;
  l: string;
  v: string;
  h: string;
  tone: "primary" | "success" | "warning" | "danger" | "info" | "secondary";
  up?: boolean;
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const iconTone: Record<string, string> = {
    primary: isLight ? "bg-primary/8 text-primary/80 ring-primary/15" : "bg-primary/15 text-accent ring-primary/25",
    success: isLight ? "bg-success/8 text-success/80 ring-success/15" : "bg-success/15 text-success ring-success/25",
    warning: isLight ? "bg-warning/8 text-warning/80 ring-warning/15" : "bg-warning/15 text-warning ring-warning/25",
    danger: isLight ? "bg-danger/8 text-danger/80 ring-danger/15" : "bg-danger/15 text-danger ring-danger/25",
    info: isLight ? "bg-info/8 text-info/80 ring-info/15" : "bg-info/15 text-info ring-info/25",
    secondary: isLight
      ? "bg-[color:var(--secondary-accent)]/8 text-[color:var(--secondary-accent)]/80 ring-[color:var(--secondary-accent)]/15"
      : "bg-[color:var(--secondary-accent)]/15 text-[color:var(--secondary-accent)] ring-[color:var(--secondary-accent)]/25",
  };
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl py-2.5 px-3 transition-all hover:-translate-y-0.5",
      isLight
        ? `glossy-card glossy-card--${tone}`
        : "border border-border/60 bg-card/50 backdrop-blur-xl hover:border-accent/30"
    )}>


      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ring-1 ring-inset ${iconTone[tone]}`}>{i}</span>
          <span className="text-[13px] font-semibold text-foreground/90 lg:text-[14px]">{l}</span>
        </div>
        {up !== undefined && <ArrowUpRight className={`h-3.5 w-3.5 ${up ? "text-success" : "text-danger rotate-90"}`} />}
      </div>
      <div className="mt-2 text-[20px] font-bold leading-none text-foreground lg:text-[24px]">{v}</div>
      <div className="mt-1 text-[12px] leading-snug text-muted-foreground lg:text-[13px]">{h}</div>
    </div>
  );
}

function QuickTile({
  to,
  l,
  s,
  i: Icon,
  tone,
}: {
  to: string;
  l: string;
  s: string;
  i: React.ComponentType<{ className?: string }>;
  tone: "primary" | "success" | "warning" | "danger" | "info" | "secondary";
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const bg: Record<string, string> = {
    primary: isLight ? "from-slate-200/30 via-slate-100/20 hover:from-slate-200/40" : "from-primary/15 via-primary/5 hover:from-primary/25",
    success: isLight ? "from-slate-200/30 via-slate-100/20 hover:from-slate-200/40" : "from-success/15 via-success/5 hover:from-success/25",
    warning: isLight ? "from-slate-200/30 via-slate-100/20 hover:from-slate-200/40" : "from-warning/15 via-warning/5 hover:from-warning/25",
    danger: isLight ? "from-slate-200/30 via-slate-100/20 hover:from-slate-200/40" : "from-danger/15 via-danger/5 hover:from-danger/25",
    info: isLight ? "from-slate-200/30 via-slate-100/20 hover:from-slate-200/40" : "from-info/15 via-info/5 hover:from-info/25",
    secondary: isLight
      ? "from-slate-200/30 via-slate-100/20 hover:from-slate-200/40"
      : "from-[color:var(--secondary-accent)]/15 via-[color:var(--secondary-accent)]/5 hover:from-[color:var(--secondary-accent)]/25",
  };
  const ic: Record<string, string> = {
    primary: isLight ? "bg-primary/10 text-primary/80" : "bg-primary/25 text-accent",
    success: isLight ? "bg-success/10 text-success/80" : "bg-success/25 text-success",
    warning: isLight ? "bg-warning/10 text-warning/80" : "bg-warning/25 text-warning",
    danger: isLight ? "bg-danger/10 text-danger/80" : "bg-danger/25 text-danger",
    info: isLight ? "bg-info/10 text-info/80" : "bg-info/25 text-info",
    secondary: isLight
      ? "bg-[color:var(--secondary-accent)]/10 text-[color:var(--secondary-accent)]/80"
      : "bg-[color:var(--secondary-accent)]/25 text-[color:var(--secondary-accent)]",
  };
  return (
    <Link
      to={to}
      className={cn(
        "group relative overflow-hidden rounded-xl p-4 transition-all hover:-translate-y-0.5",
        isLight
          ? `glossy-card glossy-card--${tone}`
          : `border border-foreground/5 bg-linear-to-br ${bg[tone]} to-transparent hover:border-foreground/10`
      )}

    >

      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${ic[tone]}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="mt-3 text-[16px] font-semibold text-foreground">{l}</div>
      <div className="mt-0.5 text-[15px] text-muted-foreground">{s}</div>
      <ArrowUpRight className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

function Legend({ c, l }: { c: string; l: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: c }} />
      {l}
    </span>
  );
}
