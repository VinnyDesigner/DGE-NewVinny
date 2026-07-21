import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  Search,
  Download,
  Plus,
  Eye,
  Edit3,
  Shield,
  Clock,
  Columns,
  ChevronDown,
  ChevronUp,
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

export const Route = createFileRoute("/_app/metadata/templates")({
  head: () => ({
    meta: [
      { title: "Metadata Registry — Data Automation Studio" },
      { name: "description", content: "All registered metadata records across data layers." },
    ],
  }),
  component: MetadataRegistryPage,
});

// Mock records representing the screenshot exactly
const initialRegistryRecords = [
  {
    id: "RD-001",
    layerName: "Abu Dhabi Roads Network",
    entity: "Dept of Municipalities & Transport",
    entityAcronym: "DMT",
    standard: "ESRI",
    template: "ESRI",
    completeness: 94,
    validation: "Passed",
    lastUpdated: "2024-03-12",
    status: "Published",
  },
  {
    id: "RD-002",
    layerName: "Environmental Monitoring Stations",
    entity: "Environment Agency Abu Dhabi",
    entityAcronym: "EAD",
    standard: "ISO 19115",
    template: "ISO 19115",
    completeness: 88,
    validation: "Warning",
    lastUpdated: "2024-03-10",
    status: "Published",
  },
  {
    id: "RD-003",
    layerName: "Digital Infrastructure Map",
    entity: "Abu Dhabi Digital Authority",
    entityAcronym: "ADDA",
    standard: "Organization Custom",
    template: "Organization Custom",
    completeness: 76,
    validation: "Warning",
    lastUpdated: "2024-03-08",
    status: "In Review",
  },
  {
    id: "RD-004",
    layerName: "Oil Pipeline Network",
    entity: "Abu Dhabi National Oil Company",
    entityAcronym: "ADNOC",
    standard: "ESRI",
    template: "Full Metadata",
    completeness: 62,
    validation: "Error",
    lastUpdated: "2024-02-15",
    status: "Draft",
  },
  {
    id: "RD-005",
    layerName: "Housing Units Registry",
    entity: "Abu Dhabi Housing Authority",
    entityAcronym: "ADHA",
    standard: "ISO 19115",
    template: "ISO 19115",
    completeness: 91,
    validation: "Passed",
    lastUpdated: "2024-03-11",
    status: "Published",
  },
  {
    id: "RD-006",
    layerName: "Power Distribution Grid",
    entity: "Abu Dhabi Distribution Company",
    entityAcronym: "ADDC",
    standard: "Simplified",
    template: "Simplified",
    completeness: 48,
    validation: "Error",
    lastUpdated: "2024-02-21",
    status: "Draft",
  },
  {
    id: "RD-007",
    layerName: "Real Estate Development Zones",
    entity: "Aldar Properties PJSC",
    entityAcronym: "ALDAR",
    standard: "ESRI",
    template: "ESRI",
    completeness: 85,
    validation: "Passed",
    lastUpdated: "2024-03-09",
    status: "Published",
  },
  {
    id: "RD-008",
    layerName: "Government Services Index",
    entity: "Dept of Government Enablement",
    entityAcronym: "DGE",
    standard: "Organization Custom",
    template: "Organization Custom",
    completeness: 79,
    validation: "Warning",
    lastUpdated: "2024-03-07",
    status: "In Review",
  },
];

function MetadataRegistryPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [records, setRecords] = useState(initialRegistryRecords);
  const [query, setQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all-entities");
  const [standardFilter, setStandardFilter] = useState("all-standards");
  const [statusFilter, setStatusFilter] = useState("all-statuses");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleResetFilters = () => {
    setQuery("");
    setEntityFilter("all-entities");
    setStandardFilter("all-standards");
    setStatusFilter("all-statuses");
    setCurrentPage(1);
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Entity Filter
      if (entityFilter !== "all-entities") {
        if (r.entityAcronym.toLowerCase() !== entityFilter.toLowerCase()) return false;
      }
      // Standard Filter
      if (standardFilter !== "all-standards") {
        if (r.standard.toLowerCase().replace(" ", "-") !== standardFilter) return false;
      }
      // Status Filter
      if (statusFilter !== "all-statuses") {
        if (r.status.toLowerCase().replace(" ", "-") !== statusFilter) return false;
      }
      // Query Search
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.layerName.toLowerCase().includes(q) &&
          !r.id.toLowerCase().includes(q) &&
          !r.entity.toLowerCase().includes(q) &&
          !r.standard.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [records, query, entityFilter, standardFilter, statusFilter]);

  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Styling Helpers
  const getValidationBadge = (val: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      Passed: {
        dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      Warning: {
        dark: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        light: "bg-amber-50 text-amber-700 border border-amber-200",
      },
      Error: {
        dark: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        light: "bg-rose-50 text-rose-700 border border-rose-200",
      },
    };
    return styles[val] ? (isLight ? styles[val].light : styles[val].dark) : "";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      Published: {
        dark: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        light: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      },
      "In Review": {
        dark: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        light: "bg-blue-50 text-blue-700 border border-blue-200",
      },
      Draft: {
        dark: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
        light: "bg-slate-100 text-slate-700 border border-slate-200",
      },
    };
    return styles[status] ? (isLight ? styles[status].light : styles[status].dark) : "";
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const handleTemplateChange = (id: string, newTemplate: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, template: newTemplate } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="Metadata Management"
        title="Metadata Registry"
        description="All registered metadata records across data layers — search, edit inline with live preview, and validate."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/metadata"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3.5 py-2 text-[14px] font-semibold text-foreground transition hover:bg-card/85 cursor-pointer"
            >
              Dashboard
            </Link>
            <Link
              to="/metadata/validation"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3.5 py-2 text-[14px] font-semibold text-foreground transition hover:bg-card/85 cursor-pointer"
            >
              Templates
            </Link>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/95 cursor-pointer">
              <Plus className="h-4 w-4" /> Register Metadata
            </button>
          </div>
        }
      />

      {/* Main Container */}
      <Surface className="overflow-hidden">
        {/* Filters Ribbon */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Search box */}
          <div className="relative w-full sm:w-[300px] shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search layer, entity, owner, standard..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-9 pr-4 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

          {/* Entity Selector */}
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[120px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer">
              <SelectValue placeholder="All Entities" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all-entities" className="cursor-pointer text-[13px]">All Entities</SelectItem>
              <SelectItem value="dmt" className="cursor-pointer text-[13px]">DMT</SelectItem>
              <SelectItem value="ead" className="cursor-pointer text-[13px]">EAD</SelectItem>
              <SelectItem value="adda" className="cursor-pointer text-[13px]">ADDA</SelectItem>
              <SelectItem value="adnoc" className="cursor-pointer text-[13px]">ADNOC</SelectItem>
              <SelectItem value="adha" className="cursor-pointer text-[13px]">ADHA</SelectItem>
              <SelectItem value="addc" className="cursor-pointer text-[13px]">ADDC</SelectItem>
              <SelectItem value="aldar" className="cursor-pointer text-[13px]">ALDAR</SelectItem>
              <SelectItem value="dge" className="cursor-pointer text-[13px]">DGE</SelectItem>
            </SelectContent>
          </Select>

          {/* Standard Selector */}
          <Select value={standardFilter} onValueChange={setStandardFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[130px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer">
              <SelectValue placeholder="All Standards" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all-standards" className="cursor-pointer text-[13px]">All Standards</SelectItem>
              <SelectItem value="esri" className="cursor-pointer text-[13px]">ESRI</SelectItem>
              <SelectItem value="iso-19115" className="cursor-pointer text-[13px]">ISO 19115</SelectItem>
              <SelectItem value="organization-custom" className="cursor-pointer text-[13px]">Organization Custom</SelectItem>
              <SelectItem value="simplified" className="cursor-pointer text-[13px]">Simplified</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Selector */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[120px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all-statuses" className="cursor-pointer text-[13px]">All Statuses</SelectItem>
              <SelectItem value="published" className="cursor-pointer text-[13px]">Published</SelectItem>
              <SelectItem value="in-review" className="cursor-pointer text-[13px]">In Review</SelectItem>
              <SelectItem value="draft" className="cursor-pointer text-[13px]">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Filters */}
          {(query || entityFilter !== "all-entities" || standardFilter !== "all-standards" || statusFilter !== "all-statuses") && (
            <button
              onClick={handleResetFilters}
              className="text-[13px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Reset All
            </button>
          )}

          {/* Right Action buttons */}
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-3 text-[13px] font-bold text-muted-foreground hover:text-foreground transition cursor-pointer">
              <Columns className="h-4 w-4" /> Columns
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-3 text-[13px] font-bold text-muted-foreground hover:text-foreground transition cursor-pointer">
              <Download className="h-4 w-4" /> Export
            </button>
            <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block" />
            <span className="text-[12.5px] font-semibold text-muted-foreground/95 bg-card/40 border border-border/60 px-2.5 py-1.5 rounded-lg">
              {filteredRecords.length} records
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto relative rounded-xl border border-border/65">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className={cn("border-b border-border/70 text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground/90", isLight ? "bg-slate-50" : "bg-card/35")}>
                <th className="py-3 px-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-border/60 cursor-pointer" />
                </th>
                <th className="py-3 px-4 w-[240px]">Layer Name</th>
                <th className="py-3 px-4 w-[200px]">Entity</th>
                <th className="py-3 px-4 w-[110px]">Standard</th>
                <th className="py-3 px-4 w-[170px]">Template</th>
                <th className="py-3 px-4 w-[140px]">Completeness</th>
                <th className="py-3 px-4 w-[110px]">Validation</th>
                <th className="py-3 px-4 w-[120px]">Last Updated</th>
                <th className="py-3 px-4 w-[110px]">Status</th>
                <th className="py-3 px-4 w-[150px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/55 text-[13.5px]">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-card/25 transition-colors group"
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <input type="checkbox" className="rounded border-border/60 cursor-pointer" />
                    </td>

                    {/* Layer Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground truncate" title={rec.layerName}>
                        {rec.layerName}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                        {rec.id}
                      </div>
                      <button className="text-[11px] font-bold text-primary hover:underline mt-1 block">
                        View Layer
                      </button>
                    </td>

                    {/* Entity */}
                    <td className="py-3.5 px-4">
                      <div className="text-foreground leading-tight truncate" title={rec.entity}>
                        {rec.entity}
                      </div>
                      <div className="text-[11.5px] font-bold text-muted-foreground/80 mt-0.5">
                        {rec.entityAcronym}
                      </div>
                    </td>

                    {/* Standard */}
                    <td className="py-3.5 px-4 font-semibold text-foreground/90">
                      {rec.standard}
                    </td>

                    {/* Template Select Dropdown inline */}
                    <td className="py-3.5 px-4">
                      <Select
                        value={rec.template.replace(" ", "-")}
                        onValueChange={(val) => handleTemplateChange(rec.id, val.replace("-", " "))}
                      >
                        <SelectTrigger className="h-8.5 w-full border-border/60 bg-card/40 text-[12.5px] text-foreground/80 hover:bg-card/75 transition-all font-medium py-1 px-2.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/60">
                          <SelectItem value="ESRI" className="cursor-pointer text-[12.5px]">ESRI</SelectItem>
                          <SelectItem value="ISO-19115" className="cursor-pointer text-[12.5px]">ISO 19115</SelectItem>
                          <SelectItem value="Organization-Custom" className="cursor-pointer text-[12.5px]">Organization Custom</SelectItem>
                          <SelectItem value="Simplified" className="cursor-pointer text-[12.5px]">Simplified</SelectItem>
                          <SelectItem value="Full-Metadata" className="cursor-pointer text-[12.5px]">Full Metadata</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Completeness score + bar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-border/40 overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", getProgressBarColor(rec.completeness))}
                            style={{ width: `${rec.completeness}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-[12.5px] text-foreground shrink-0 w-8 text-right">
                          {rec.completeness}%
                        </span>
                      </div>
                    </td>

                    {/* Validation */}
                    <td className="py-3.5 px-4">
                      <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-bold border", getValidationBadge(rec.validation))}>
                        {rec.validation}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 text-muted-foreground font-semibold text-[12.5px]">
                      {rec.lastUpdated}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={cn("px-2 py-0.5 rounded text-[11px] font-extrabold border uppercase", getStatusBadge(rec.status))}>
                        {rec.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-card/75 border border-transparent hover:border-border/60 text-muted-foreground hover:text-foreground transition cursor-pointer" title="View details">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-card/75 border border-transparent hover:border-border/60 text-muted-foreground hover:text-foreground transition cursor-pointer" title="Edit record">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-card/75 border border-transparent hover:border-border/60 text-muted-foreground hover:text-foreground transition cursor-pointer" title="Run validation check">
                          <Shield className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-card/75 border border-transparent hover:border-border/60 text-muted-foreground hover:text-foreground transition cursor-pointer" title="View version history">
                          <Clock className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-muted-foreground text-[14px]">
                    No metadata records matching the selected search query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="mt-4">
          <TablePagination
            currentPage={currentPage}
            totalItems={filteredRecords.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      </Surface>
    </div>
  );
}
