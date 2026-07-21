import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Wrench,
  Search,
  Download,
  Eye,
  Sliders,
  Upload,
  RefreshCw,
  Globe,
  Database,
  CheckCircle2,
  Calendar,
  BarChart3,
  Minimize2,
  FolderOpen,
  Eye as ViewIcon,
  Edit3,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { Switch } from "@/components/ui/switch";
import { TablePagination } from "@/components/app/TablePagination";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/tools/automation")({
  head: () => ({
    meta: [
      { title: "Automation Tools — Data Automation Studio" },
      { name: "description", content: "Manage and monitor automated data processing engines and utility tools." },
    ],
  }),
  component: AutomationToolsPage,
});

// Mock initial data for 12 tools
const initialTools = [
  {
    id: "data-collection",
    name: "Data Collection Engine",
    description: "Collects and ingests data from registered sources.",
    category: "Collection",
    tier: "Primary Engine",
    group: "Full Pipeline",
    schedule: true,
    icon: Download,
  },
  {
    id: "data-discovery",
    name: "Data Discovery Engine",
    description: "Validates sources, discovers layers and fields, and orchestrates workspace setup and standardization.",
    category: "Discovery",
    tier: "Primary Engine",
    group: "Standalone",
    schedule: false,
    icon: Eye,
  },
  {
    id: "data-quality",
    name: "Data Quality Engine",
    description: "Executes comprehensive quality rule checks.",
    category: "Quality",
    tier: "Primary Engine",
    group: "Full Pipeline",
    schedule: true,
    icon: Sliders,
  },
  {
    id: "data-loading",
    name: "Data Loading",
    description: "Loads QA-qualified data into the target enterprise geodatabase (full or delta) with backup + count-guard.",
    category: "Sync",
    tier: "Primary Engine",
    group: "Full Pipeline",
    schedule: true,
    icon: Upload,
  },
  {
    id: "delta-sync",
    name: "Delta Sync Engine",
    description: "Detects and loads only changed records.",
    category: "Sync",
    tier: "Primary Engine",
    group: "Standalone",
    schedule: true,
    icon: RefreshCw,
  },
  {
    id: "external-sync",
    name: "External Data Sync Engine",
    description: "Publishes and synchronises processed data externally.",
    category: "Sync",
    tier: "Primary Engine",
    group: "Standalone",
    schedule: true,
    icon: Globe,
  },
  {
    id: "internal-sync",
    name: "Internal Data Sync Engine",
    description: "Synchronises data internally between systems.",
    category: "Sync",
    tier: "Primary Engine",
    group: "Full Pipeline",
    schedule: true,
    icon: Database,
  },
  {
    id: "metadata-val",
    name: "Metadata Validation Engine",
    description: "Validates metadata completeness and standards.",
    category: "Validation",
    tier: "Primary Engine",
    group: "Standalone",
    schedule: true,
    icon: CheckCircle2,
  },
  {
    id: "scheduling-service",
    name: "Scheduling Service",
    description: "Configurator for the orchestration worker services (Scheduler, Dispatcher, Execution) and the data-collection.",
    category: "Orchestration",
    tier: "Primary Engine",
    group: "Standalone",
    schedule: false,
    icon: Calendar,
  },
  {
    id: "data-analyzer",
    name: "Data Analyzer",
    description: "Performs statistical analysis and profiling.",
    category: "Analytics",
    tier: "Utility",
    group: "Standalone",
    schedule: true,
    icon: BarChart3,
  },
  {
    id: "database-compress",
    name: "Database Compress",
    description: "Compresses and optimises database storage.",
    category: "Utility",
    tier: "Utility",
    group: "Standalone",
    schedule: true,
    icon: Minimize2,
  },
  {
    id: "workspace-setup",
    name: "Workspace Setup Engine",
    description: "Creates and manages standard workspace folder structures.",
    category: "Utility",
    tier: "Utility",
    group: "Standalone",
    schedule: false,
    icon: FolderOpen,
  },
];

function AutomationToolsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [tools, setTools] = useState(initialTools);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Toggle Schedule
  const toggleSchedule = (id: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, schedule: !t.schedule } : t))
    );
  };

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      // Filter by tab
      if (activeTab === "Primary Engines" && t.tier !== "Primary Engine") return false;
      if (activeTab === "Utility Tools" && t.tier !== "Utility") return false;

      // Filter by search query
      if (query) {
        const q = query.toLowerCase();
        if (
          !t.name.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q) &&
          !t.category.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [tools, activeTab, query]);

  const paginatedTools = useMemo(() => {
    return filteredTools.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredTools, currentPage, pageSize]);

  // Statistics counters
  const totalCount = tools.length;
  const primaryCount = tools.filter((t) => t.tier === "Primary Engine").length;
  const utilityCount = tools.filter((t) => t.tier === "Utility").length;
  const activeCount = tools.filter((t) => t.schedule).length;

  // Category badge styles based on dark/light theme
  const getCategoryBadgeClass = (category: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      Collection: {
        dark: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        light: "bg-blue-50 text-blue-700 border border-blue-200",
      },
      Discovery: {
        dark: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        light: "bg-purple-50 text-purple-700 border border-purple-200",
      },
      Quality: {
        dark: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        light: "bg-amber-50 text-amber-700 border border-amber-200",
      },
      Sync: {
        dark: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
        light: "bg-teal-50 text-teal-700 border border-teal-200",
      },
      Validation: {
        dark: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        light: "bg-rose-50 text-rose-700 border border-rose-200",
      },
      Orchestration: {
        dark: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
        light: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      },
      Analytics: {
        dark: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
        light: "bg-orange-50 text-orange-700 border border-orange-200",
      },
      Utility: {
        dark: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
        light: "bg-slate-100 text-slate-700 border border-slate-200",
      },
    };
    return styles[category] ? (isLight ? styles[category].light : styles[category].dark) : "";
  };

  const getTierBadgeClass = (tier: string) => {
    if (tier === "Primary Engine") {
      return isLight
        ? "bg-blue-50 text-blue-700 border border-blue-200/50"
        : "bg-slate-800 text-slate-300 border border-slate-700/60";
    }
    return isLight
      ? "bg-slate-50 text-slate-600 border border-slate-100"
      : "bg-slate-900/40 text-slate-400 border border-slate-800/60";
  };

  const getGroupBadgeClass = (group: string) => {
    if (group === "Full Pipeline") {
      return isLight
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    return isLight
      ? "bg-slate-50 text-slate-500 border border-slate-200"
      : "bg-slate-800/40 text-slate-400 border border-slate-800/60";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automation Tools"
        description="Manage and monitor automated data processing engines and utility tools"
      />

      {/* Stats Cards Section */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tools */}
        <div className={cn(
          "rounded-2xl border p-5 shadow-sm backdrop-blur-xl transition-all",
          isLight 
            ? "bg-white border-border/80 text-foreground" 
            : "bg-card/60 border-border/60 text-foreground"
        )}>
          <div className="text-[15px] font-semibold text-muted-foreground">Total Tools</div>
          <div className="mt-2 text-[32px] font-bold leading-none tracking-tight">{totalCount}</div>
        </div>

        {/* Primary Engines */}
        <div className={cn(
          "rounded-2xl border p-5 shadow-sm backdrop-blur-xl transition-all",
          isLight 
            ? "bg-blue-50/70 border-blue-200 text-blue-900" 
            : "bg-blue-500/10 border-blue-500/20 text-blue-400"
        )}>
          <div className="text-[15px] font-semibold text-muted-foreground">Primary Engines</div>
          <div className="mt-2 text-[32px] font-bold leading-none tracking-tight">{primaryCount}</div>
        </div>

        {/* Utility Tools */}
        <div className={cn(
          "rounded-2xl border p-5 shadow-sm backdrop-blur-xl transition-all",
          isLight 
            ? "bg-white border-border/80 text-foreground" 
            : "bg-card/60 border-border/60 text-foreground"
        )}>
          <div className="text-[15px] font-semibold text-muted-foreground">Utility Tools</div>
          <div className="mt-2 text-[32px] font-bold leading-none tracking-tight">{utilityCount}</div>
        </div>

        {/* Active Tools */}
        <div className={cn(
          "rounded-2xl border p-5 shadow-sm backdrop-blur-xl transition-all",
          isLight 
            ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" 
            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        )}>
          <div className="text-[15px] font-semibold text-muted-foreground">Active Tools</div>
          <div className="mt-2 text-[32px] font-bold leading-none tracking-tight">{activeCount}</div>
        </div>
      </div>

      {/* Surface wrapper with search and table list */}
      <Surface padded={false}>
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center justify-between">
          <div className="relative w-full sm:w-[300px] shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search tools..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

          <div className="flex-1 min-w-[10px]" />

          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card/40 p-1">
              {["All", "Primary Engines", "Utility Tools"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "rounded-md px-3 py-1 text-[13px] font-medium transition cursor-pointer",
                    activeTab === tab
                      ? (isLight 
                          ? "bg-slate-200 text-slate-900" 
                          : "bg-foreground/10 text-foreground")
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-[14px] text-muted-foreground ml-2">
              {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
            </span>
          </div>
        </div>

        {/* Table representation */}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70">
                <th className="px-5 py-3">Tool</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Tier</th>
                <th className="px-5 py-3">Group</th>
                <th className="px-5 py-3">Schedule</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    No tools found matching search criteria.
                  </td>
                </tr>
              ) : (
                paginatedTools.map((t) => {
                  const ToolIcon = t.icon;
                  return (
                    <tr key={t.id} className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02]">
                      {/* Tool name & icon */}
                      <td className="px-5 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
                            isLight
                              ? "bg-slate-100 ring-slate-200 text-slate-700"
                              : "bg-accent/15 text-accent ring-accent/25"
                          )}>
                            <ToolIcon className="h-4.5 w-4.5" />
                          </span>
                          <span className="font-semibold text-foreground">{t.name}</span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-5 py-4 align-middle max-w-xs">
                        <span className="text-muted-foreground block truncate" title={t.description}>
                          {t.description}
                        </span>
                      </td>

                      {/* Category Badge */}
                      <td className="px-5 py-4 align-middle whitespace-nowrap">
                        <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold", getCategoryBadgeClass(t.category))}>
                          {t.category}
                        </span>
                      </td>

                      {/* Tier Badge */}
                      <td className="px-5 py-4 align-middle whitespace-nowrap">
                        <span className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-semibold", getTierBadgeClass(t.tier))}>
                          {t.tier}
                        </span>
                      </td>

                      {/* Group Badge */}
                      <td className="px-5 py-4 align-middle whitespace-nowrap">
                        <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold", getGroupBadgeClass(t.group))}>
                          {t.group}
                        </span>
                      </td>

                      {/* Schedule Switch */}
                      <td className="px-5 py-4 align-middle whitespace-nowrap">
                        <div className="flex items-center">
                          <Switch
                            checked={t.schedule}
                            onCheckedChange={() => toggleSchedule(t.id)}
                            className="cursor-pointer"
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 align-middle text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            title="View details"
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-md border border-border/60 transition cursor-pointer",
                              isLight ? "bg-white text-slate-700 hover:bg-slate-50" : "bg-card/60 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <ViewIcon className="h-4 w-4" />
                          </button>
                          <button
                            title="Edit parameter"
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-md border border-border/60 transition cursor-pointer",
                              isLight ? "bg-white text-slate-700 hover:bg-slate-50" : "bg-card/60 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Reuse existing pagination */}
        <TablePagination
          totalItems={filteredTools.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="tool"
          itemNamePlural="tools"
        />
      </Surface>
    </div>
  );
}
