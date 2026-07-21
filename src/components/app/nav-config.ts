import {
  LayoutDashboard,
  Building2,
  UserCheck,
  Database,
  PlugZap,
  Layers,
  Briefcase,
  CalendarClock,
  CalendarPlus,
  Activity,
  BarChart3,
  FileText,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  ClipboardCheck,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ListChecks,
  Wrench,
  Shield,
  UserCog,
  Lock,
  Server,
  Wifi,
  DatabaseZap,
  Bell,
  Network,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
};

export type NavColor =
  | "sky"
  | "violet"
  | "emerald"
  | "cyan"
  | "amber"
  | "fuchsia"
  | "blue"
  | "rose"
  | "lime"
  | "orange";

export type NavGroup = {
  label: string;
  color: NavColor;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    color: "sky",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Entities",
    color: "violet",
    items: [
      { title: "Entity", url: "/entities/entity", icon: Building2 },
      { title: "Representatives", url: "/entities/representatives", icon: UserCheck },
    ],
  },
  {
    label: "Data Sources",
    color: "emerald",
    items: [
      { title: "Data Sources", url: "/data-sources", icon: Server },
      { title: "Onboard Source", url: "/data-sources/onboard", icon: PlugZap },
    ],
  },
  {
    label: "Data Management",
    color: "cyan",
    items: [
      { title: "Jobs", url: "/operations/jobs", icon: Briefcase },
      { title: "Data Layers", url: "/data-management/layers", icon: Layers },
    ],
  },
  {
    label: "Operations",
    color: "amber",
    items: [
      { title: "Workflow Monitor", url: "/operations/workflow", icon: Activity, badge: "Live" },
      { title: "Create Schedule", url: "/operations/create-schedule", icon: CalendarPlus },
      { title: "Manage Schedules", url: "/operations/manage-schedules", icon: CalendarClock },
    ],
  },
  {
    label: "Metadata Management",
    color: "fuchsia",
    items: [
      { title: "Dashboard", url: "/metadata", icon: BarChart3 },
      { title: "Registry", url: "/metadata/templates", icon: FileText },
    ],
  },
  {
    label: "Data Insights",
    color: "blue",
    items: [
      { title: "Governance Dashboard", url: "/insights/reports", icon: BarChart3 },
      { title: "CTT vs Layers", url: "/insights/analytics", icon: TrendingUp },
      { title: "Layer Freshness", url: "/insights/dashboards", icon: Clock },
      { title: "Data Review Assessment", url: "/insights/review", icon: ClipboardCheck },
      { title: "QAQC Observations", url: "/insights/qaqc", icon: AlertTriangle },
      { title: "Metadata Compliance", url: "/insights/compliance", icon: ShieldCheck },
    ],
  },
  {
    label: "Quality Rules",
    color: "rose",
    items: [
      { title: "Data Quality", url: "/quality/monitor", icon: ShieldCheck },
      { title: "Quality Rules", url: "/quality/rules", icon: ListChecks },
      { title: "Rule Enforcement", url: "/quality/enforcement", icon: Shield },
    ],
  },
  {
    label: "Tool Management",
    color: "lime",
    items: [
      { title: "Automation Tools", url: "/tools/automation", icon: Wrench },
      { title: "Tool Parameters", url: "/tools/parameters", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Administration",
    color: "orange",
    items: [
      { title: "Admin", url: "/admin/settings", icon: Shield },
      { title: "Access Control", url: "/admin/users", icon: UserCog },
      { title: "Security & Authentication", url: "/admin/permissions", icon: Lock },
      { title: "System Services", url: "/admin/health", icon: Server },
      { title: "Data Source Connectors", url: "/tools/connectors", icon: Wifi },
      { title: "Database Mapping", url: "/data-management/db-mapping", icon: DatabaseZap },
      { title: "Layer Configuration", url: "/data-management/layer-config", icon: SlidersHorizontal },
      { title: "Job notifications", url: "/admin/notifications", icon: Bell },
      { title: "Node Orchestration", url: "/admin/orchestration", icon: Network },
      { title: "Audit Logs", url: "/admin/audit", icon: ScrollText },
    ],
  },
];

export const navColorClass: Record<NavColor, string> = {
  sky: "text-sky-400",
  violet: "text-violet-400",
  emerald: "text-emerald-400",
  cyan: "text-cyan-400",
  amber: "text-amber-400",
  fuchsia: "text-fuchsia-400",
  blue: "text-blue-400",
  rose: "text-rose-400",
  lime: "text-lime-400",
  orange: "text-orange-400",
};

export const navColorClassLight: Record<NavColor, string> = {
  sky: "text-sky-600",
  violet: "text-violet-600",
  emerald: "text-emerald-600",
  cyan: "text-cyan-600",
  amber: "text-amber-600",
  fuchsia: "text-fuchsia-600",
  blue: "text-blue-600",
  rose: "text-rose-600",
  lime: "text-lime-600",
  orange: "text-orange-600",
};

export function findCrumb(pathname: string): { group: string; title: string } | null {
  for (const g of navGroups) {
    for (const i of g.items) {
      if (i.url === pathname) return { group: g.label, title: i.title };
    }
  }
  return null;
}
