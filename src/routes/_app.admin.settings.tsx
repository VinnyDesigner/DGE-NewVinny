import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  Activity,
  Database,
  ShieldAlert,
  ArrowUpRight,
  Server,
  AlertTriangle,
  Clock,
  Wifi,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/_app/admin/settings")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Data Automation Studio" },
      { name: "description", content: "System overview, health monitoring, and administrative metrics." },
    ],
  }),
  component: AdminDashboard,
});

// Mock chart data for Login Activity Today
const chartData = [
  { hour: "01:00", events: 1.2 },
  { hour: "03:00", events: 0.5 },
  { hour: "05:00", events: 0.8 },
  { hour: "07:00", events: 1.9 },
  { hour: "09:00", events: 3.2 },
  { hour: "11:00", events: 2.7 },
  { hour: "13:00", events: 3.1 },
  { hour: "15:00", events: 2.4 },
  { hour: "17:00", events: 1.6 },
  { hour: "19:00", events: 2.0 },
  { hour: "21:00", events: 1.1 },
  { hour: "23:00", events: 0.7 },
];

function AdminDashboard() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Admin Dashboard"
        description="System overview, health monitoring, and administrative metrics"
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Surface padded={false} className="py-4 px-5">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                TOTAL USERS
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-foreground">154</span>
                <span className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <ArrowUpRight className="h-2.5 w-2.5" /> 8
                </span>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400 shrink-0 shadow-sm mt-0.5">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
        </Surface>

        {/* Active Sessions */}
        <Surface padded={false} className="py-4 px-5">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                ACTIVE SESSIONS
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-foreground">47</span>
                <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.2 text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
                </span>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shrink-0 shadow-sm mt-0.5">
              <Activity className="h-4.5 w-4.5" />
            </div>
          </div>
        </Surface>

        {/* Identity Providers */}
        <Surface padded={false} className="py-4 px-5">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                IDENTITY PROVIDERS
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-foreground">3</span>
                <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.2 text-[10px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                  1 inactive
                </span>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-400 shrink-0 shadow-sm mt-0.5">
              <Database className="h-4.5 w-4.5" />
            </div>
          </div>
        </Surface>

        {/* Security Events */}
        <Surface padded={false} className="py-4 px-5">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                SECURITY EVENTS
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-foreground">0</span>
                <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.2 text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Secured
                </span>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 shrink-0 shadow-sm mt-0.5">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
          </div>
        </Surface>
      </div>

      {/* Charts and Identity Providers Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1.1fr]">
        {/* Login Activity Today Chart */}
        <Surface>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-foreground">Login Activity Today</h3>
            <p className="text-xs text-muted-foreground">Authentication events over 24 hours</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="gActivity" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#5b8cff" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#5b8cff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(100,116,139,0.12)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 4]}
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <RTooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: isLight ? "#0f172a" : "#fff" }}
                  itemStyle={{ color: isLight ? "#0f172a" : "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="#5b8cff"
                  strokeWidth={2}
                  fill="url(#gActivity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        {/* Identity Store Status */}
        <Surface className="flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-foreground">Identity Store Status</h3>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {/* Built-In Identity Store */}
            <div className="flex items-center justify-between p-3 border border-border/50 rounded-xl bg-foreground/[0.01] hover:bg-foreground/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/[0.04] border border-border/50 text-muted-foreground">
                  <Database className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Built-In Identity Store</div>
                  <div className="text-xs text-muted-foreground">42 users</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
                Active
              </div>
            </div>

            {/* LDAP / Active Directory */}
            <div className="flex items-center justify-between p-3 border border-border/50 rounded-xl bg-foreground/[0.01] hover:bg-foreground/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/[0.04] border border-border/50 text-muted-foreground">
                  <Database className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">LDAP / Active Directory</div>
                  <div className="text-xs text-muted-foreground">98 users</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
                Active
              </div>
            </div>

          </div>
        </Surface>
      </div>

      {/* System Health and Recent Audit Events Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.10fr_1.15fr]">
        {/* System Health */}
        <Surface>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-foreground">System Health</h3>
          </div>
          <div className="space-y-3.5">
            {[
              { name: "API Gateway", latency: "42ms", uptime: "99.98% uptime", status: "Active", dot: "success" },
              { name: "Workflow Engine", latency: "120ms", uptime: "99.94% uptime", status: "Active", dot: "success" },
              { name: "Data Store", latency: "8ms", uptime: "100% uptime", status: "Active", dot: "success" },
              { name: "Identity Provider", latency: "55ms", uptime: "99.99% uptime", status: "Active", dot: "dot-green" },
              { name: "Notification Service", latency: "380ms", uptime: "98.2% uptime", status: "Warning", dot: "warning" },
              { name: "Export Service", latency: "210ms", uptime: "99.91% uptime", status: "Active", dot: "success" },
            ].map((srv) => (
              <div key={srv.name} className="flex items-center justify-between border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                    srv.status === "Warning" ? "bg-warning" : "bg-success"
                  }`} />
                  <div>
                    <div className="text-sm font-semibold text-foreground">{srv.name}</div>
                    <div className="text-[12px] text-muted-foreground">Latency: {srv.latency}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[13px] text-muted-foreground">{srv.uptime}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                    srv.status === "Warning"
                      ? "bg-warning/15 text-warning border-warning/20"
                      : "bg-success/15 text-success border-success/20"
                  }`}>
                    {srv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        {/* Recent Audit Events */}
        <Surface>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Recent Audit Events</h3>
            <Link
              to="/admin/audit"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-0.5"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { route: "/DataAutomationAPI/auth/login", method: "POST", code: 200, time: "140ms", stamp: "28/07/2026, 11:19 AM", origin: "system" },
              { route: "/DataAutomationAPI/auth/login", method: "POST", code: 200, time: "158ms", stamp: "28/07/2026, 10:42 AM", origin: "system" },
              { route: "/DataAutomationAPI/auth/login", method: "POST", code: 200, time: "171ms", stamp: "28/07/2026, 10:21 AM", origin: "system" },
              { route: "/DataAutomationAPI/auth/login", method: "POST", code: 200, time: "145ms", stamp: "27/07/2026, 12:38 PM", origin: "system" },
              { route: "/DataAutomationAPI/auth/login", method: "POST", code: 200, time: "124ms", stamp: "27/07/2026, 11:48 AM", origin: "system" },
              { route: "/DataAutomationAPI/auth/login", method: "POST", code: 200, time: "142ms", stamp: "22/07/2026, 08:05 PM", origin: "system" },
            ].map((evt, idx) => (
              <div key={idx} className="flex items-start justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <div className="text-[12px] font-semibold text-muted-foreground uppercase">{evt.origin}</div>
                  <div className="text-sm font-semibold text-foreground">
                    <span className="text-accent">{evt.method}</span> {evt.route} · {evt.code} ({evt.time})
                  </div>
                  <div className="text-[12px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {evt.stamp}
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/15">
                  low
                </span>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

