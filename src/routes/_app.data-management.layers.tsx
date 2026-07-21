import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Columns3,
  Download,
  Globe2,
  Layers,
  Plus,
  Search,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
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

export const Route = createFileRoute("/_app/data-management/layers")({
  head: () => ({
    meta: [
      { title: "Data Layers — Data Automation Studio" },
      { name: "description", content: "Register and manage spatial data layers — names, classification, schema mapping, sensitivity, and attribute-level access control." },
    ],
  }),
  component: LayersPage,
});

const metrics = [
  { label: "Total Layers", value: "0", hint: "All registered", icon: Layers, tone: "primary" },
  { label: "Active", value: "0", hint: "Accepting deliveries", icon: CheckCircle2, tone: "success" },
  { label: "Published", value: "0", hint: "Publicly accessible", icon: Globe2, tone: "info" },
  { label: "By Classification", value: "", hint: "No classifications", icon: ShieldCheck, tone: "secondary" },
] as const;

const columns = [
  "Layer Name",
  "DB Layer Name",
  "Entity",
  "Geometry",
  "Sensitivity",
  "Onboarded Date",
  "ACTIONS",
];

function LayersPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [query, setQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all-entities");
  const [sensitivityFilter, setSensitivityFilter] = useState("all-sensitivity");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [pageSize, setPageSize] = useState(10);

  const handleResetFilters = () => {
    setQuery("");
    setEntityFilter("all-entities");
    setSensitivityFilter("all-sensitivity");
    setStatusFilter("all-statuses");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Data Layers"
        description="Register and manage spatial data layers — names, classification, schema mapping, sensitivity, and attribute-level access control"
        actions={
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3.5 text-[14px] font-semibold text-foreground/80 hover:text-foreground cursor-pointer">
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[14px] font-semibold text-primary-foreground hover:bg-primary/95 transition cursor-pointer">
              <Plus className="h-4 w-4" /> Register Layer
            </button>
          </div>
        }
      />

      {/* Metrics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <Surface key={m.label} className="!p-5 relative overflow-hidden group hover:border-accent/35 transition duration-300">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">{m.label}</div>
                <div className="mt-2 text-[32px] font-black leading-none tracking-tight text-foreground">{m.value || "0"}</div>
                <div className="mt-2 text-[12.5px] font-semibold text-muted-foreground/85">{m.hint}</div>
              </div>
              <span className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border",
                m.tone === "primary" && (isLight ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-blue-500/10 text-blue-400 border-blue-500/20"),
                m.tone === "success" && (isLight ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"),
                m.tone === "info" && (isLight ? "bg-info/10 text-info border-info/20" : "bg-info/10 text-info border-info/20"),
                m.tone === "secondary" && (isLight ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-purple-500/10 text-purple-400 border-purple-500/20")
              )}>
                <m.icon className="h-4.5 w-4.5" />
              </span>
            </div>
          </Surface>
        ))}
      </div>

      {/* Table Workspace */}
      <Surface className="!p-0 overflow-hidden">
        {/* Filters ribbon matching Image 3 dropdown layout */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border/60 p-4">
          <div className="relative w-full sm:w-[300px] shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search layers, DB name, entity..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

          {/* Entities Select dropdown */}
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[130px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer">
              <SelectValue placeholder="All Entities" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all-entities" className="cursor-pointer text-[13px]">All Entities</SelectItem>
              <SelectItem value="adda" className="cursor-pointer text-[13px]">ADDA</SelectItem>
              <SelectItem value="ead" className="cursor-pointer text-[13px]">EAD</SelectItem>
              <SelectItem value="dge" className="cursor-pointer text-[13px]">DGE</SelectItem>
              <SelectItem value="addc" className="cursor-pointer text-[13px]">ADDC</SelectItem>
              <SelectItem value="adha" className="cursor-pointer text-[13px]">ADHA</SelectItem>
            </SelectContent>
          </Select>

          {/* Sensitivity Select dropdown */}
          <Select value={sensitivityFilter} onValueChange={setSensitivityFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[140px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer">
              <SelectValue placeholder="All Sensitivity" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all-sensitivity" className="cursor-pointer text-[13px]">All Sensitivity</SelectItem>
              <SelectItem value="public" className="cursor-pointer text-[13px]">Public</SelectItem>
              <SelectItem value="restricted" className="cursor-pointer text-[13px]">Restricted</SelectItem>
              <SelectItem value="confidential" className="cursor-pointer text-[13px]">Confidential</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[130px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all-statuses" className="cursor-pointer text-[13px]">All Statuses</SelectItem>
              <SelectItem value="active" className="cursor-pointer text-[13px]">Active</SelectItem>
              <SelectItem value="inactive" className="cursor-pointer text-[13px]">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1 min-w-[10px]" />

          {/* Action buttons columns & reload */}
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-3 text-[13px] font-bold text-muted-foreground hover:text-foreground transition cursor-pointer">
            <Columns3 className="h-4 w-4" /> Columns
          </button>

          <button
            onClick={handleResetFilters}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/50 text-muted-foreground hover:text-foreground transition cursor-pointer"
            title="Reload table"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Data Table */}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground/80">
                <th className="py-3 px-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-border/65 cursor-pointer" />
                </th>
                {columns.map((c) => (
                  <th
                    key={c}
                    className={cn(
                      "px-5 py-3 whitespace-nowrap",
                      c === "Layer Name" && "table-sticky-single-left",
                      c === "ACTIONS" && "table-sticky-actions text-right"
                    )}
                  >
                    <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground transition">
                      {c}
                      {c !== "ACTIONS" && <ChevronDown className="h-3 w-3 opacity-60" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Empty state matches Image 3 exactly */}
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-20">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.04] border border-border/60 text-muted-foreground">
                      <Layers className="h-6.5 w-6.5" />
                    </span>
                    <div className="text-[16px] font-bold text-foreground">No layers match the current filters.</div>
                    <div className="text-[13.5px] text-muted-foreground max-w-md">
                      Onboard a data source and run Save Mapping to populate this list, or click <span className="font-bold text-primary hover:underline cursor-pointer">Register Layer</span> above.
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <TablePagination
          totalItems={0}
          pageSize={pageSize}
          currentPage={1}
          onPageChange={() => {}}
          onPageSizeChange={setPageSize}
          itemNameSingular="layer"
          itemNamePlural="layers"
        />
      </Surface>
    </div>
  );
}
