import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  SlidersHorizontal,
  Search,
  Download,
  Plus,
  Eye,
  Pencil,
  Shield,
  Clock,
  Columns,
  ChevronDown,
  ChevronUp,
  Database,
  Check,
  FileText,
  RefreshCw,
  LayoutDashboard,
  Filter,
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
import { toast } from "sonner";

export const Route = createFileRoute("/_app/metadata/templates")({
  head: () => ({
    meta: [
      { title: "Metadata Registry — Data Automation Studio" },
      { name: "description", content: "All registered metadata records across data layers." },
    ],
  }),
  component: MetadataRegistryPage,
});

interface RegistryRecord {
  id: string;
  layerName: string;
  entity: string;
  entityAcronym: string;
  standard: string;
  template: string;
  completeness: number;
  validation: string;
  lastUpdated: string;
  status: string;
  sourceType: string;
  owner: string;
  languageCoverage: string;
  reviewDate: string;
}

// Initial records matching the 3rd image exactly
const initialRegistryRecords: RegistryRecord[] = [
  {
    id: "L_DMAUDM_MUNICIPALITYBOUNDARY",
    layerName: "L_DMAUDM_MUNICIPALITYBOUNDARY",
    entity: "Abu Dhabi Digital Authority",
    entityAcronym: "ADDA",
    standard: "ESRI",
    template: "ESRI",
    completeness: 81,
    validation: "Passed",
    lastUpdated: "2026-07-21",
    status: "Draft",
    sourceType: "FGDB1",
    owner: "Abu Dhabi Digital Authority",
    languageCoverage: "English",
    reviewDate: "2027-07-21",
  },
  {
    id: "L_DMAUDM_DISTRICTBOUNDARY",
    layerName: "L_DMAUDM_DISTRICTBOUNDARY",
    entity: "Abu Dhabi Digital Authority",
    entityAcronym: "ADDA",
    standard: "ISO 19115",
    template: "ISO 19115",
    completeness: 49,
    validation: "Warning",
    lastUpdated: "2026-07-20",
    status: "Draft",
    sourceType: "FGDB1",
    owner: "Abu Dhabi Digital Authority",
    languageCoverage: "English",
    reviewDate: "2027-07-20",
  },
  {
    id: "L_DMAUDM_DISTRICT",
    layerName: "L_DMAUDM_DISTRICT",
    entity: "Abu Dhabi Digital Authority",
    entityAcronym: "ADDA",
    standard: "Organization Custom",
    template: "Organization Custom",
    completeness: 95,
    validation: "Passed",
    lastUpdated: "2026-07-21",
    status: "Draft",
    sourceType: "FGDB1",
    owner: "Abu Dhabi Digital Authority",
    languageCoverage: "English",
    reviewDate: "2027-07-21",
  },
  {
    id: "L_DMAUDM_MUNICIPALITY",
    layerName: "L_DMAUDM_MUNICIPALITY",
    entity: "Abu Dhabi Digital Authority",
    entityAcronym: "ADDA",
    standard: "Simplified",
    template: "Simplified",
    completeness: 72,
    validation: "Passed",
    lastUpdated: "2026-07-21",
    status: "Draft",
    sourceType: "FGDB1",
    owner: "Abu Dhabi Digital Authority",
    languageCoverage: "English",
    reviewDate: "2027-07-21",
  },
];

const columnsConfig = [
  { key: "layerName", label: "LAYER NAME", width: "w-[270px]", locked: true },
  { key: "entity", label: "ENTITY", width: "w-[220px]" },
  { key: "completeness", label: "COMPLETENESS", width: "w-[170px]" },
  { key: "lastUpdated", label: "LAST UPDATED", width: "w-[130px]" },
  { key: "publishStatus", label: "PUBLISH STATUS", width: "w-[140px]" },
  { key: "sourceType", label: "SOURCE", width: "w-[120px]" },
  { key: "owner", label: "OWNER", width: "w-[210px]" },
  { key: "languageCoverage", label: "LANGUAGE COVERAGE", width: "w-[170px]" },
  { key: "reviewDate", label: "REVIEW DATE", width: "w-[130px]" },
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

  // Popover Toggles state
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Column visibility state (Matches 2nd image defaults)
  const [visibleColumns, setVisibleColumns] = useState({
    layerName: true,
    entity: true,
    completeness: true,
    lastUpdated: true,
    publishStatus: true,
    sourceType: true,
    owner: true,
    languageCoverage: false,
    reviewDate: false,
  });

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClose = () => {
      setIsColumnsOpen(false);
      setIsExportOpen(false);
    };
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, []);

  const toggleColumns = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsColumnsOpen(!isColumnsOpen);
    setIsExportOpen(false);
  };

  const toggleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExportOpen(!isExportOpen);
    setIsColumnsOpen(false);
  };

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
          !r.entity.toLowerCase().includes(q) &&
          !r.standard.toLowerCase().includes(q) &&
          !r.owner.toLowerCase().includes(q)
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
    if (score >= 80) return "bg-blue-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-rose-500";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Metadata Registry"
        description="All registered metadata records across data layers — search, edit inline with live preview, and validate"
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/metadata"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3.5 text-[14px] font-semibold text-foreground transition hover:bg-card/85 cursor-pointer"
            >
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> Dashboard
            </Link>
          </div>
        }
      />

      {/* Main Container */}
      <Surface className="overflow-visible">
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

          {/* Entity Selector (Filtered list matching 1st image exactly) */}
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[130px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="All Entities" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all-entities" className="cursor-pointer text-[13px]">All Entities</SelectItem>
              <SelectItem value="adda" className="cursor-pointer text-[13px]">Abu Dhabi Digital Authority</SelectItem>
              <SelectItem value="addc" className="cursor-pointer text-[13px]">Abu Dhabi Distribution Company</SelectItem>
              <SelectItem value="adha" className="cursor-pointer text-[13px]">Abu Dhabi Housing Authority</SelectItem>
              <SelectItem value="dge" className="cursor-pointer text-[13px]">Dept of Government Enablement</SelectItem>
              <SelectItem value="ead" className="cursor-pointer text-[13px]">Environment Agency Abu Dhabi</SelectItem>
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
          <div className="ml-auto flex items-center gap-2 relative">
            {/* Columns Toggle Popover Button */}
            <div className="relative">
              <button
                onClick={toggleColumns}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-3.5 text-[13px] font-semibold text-foreground/85 hover:text-foreground transition cursor-pointer"
              >
                <Columns className="h-4 w-4 text-muted-foreground" /> Columns
              </button>

              {isColumnsOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-[210px] rounded-xl border border-border bg-popover text-popover-foreground shadow-glow p-3.5 z-50 text-[13px] space-y-2.5"
                >
                  <div className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider mb-1.5">
                    Toggle Columns
                  </div>
                  
                  {/* Layer Name (Locked) */}
                  <div className="flex items-center justify-between px-2 py-1 text-muted-foreground/60 select-none bg-muted/30 rounded-md">
                    <span className="font-semibold text-muted-foreground/50 text-[12.5px]">LOCK Layer Name</span>
                    <Check className="h-4 w-4 text-muted-foreground/45" />
                  </div>

                  {/* Toggle Items */}
                  {columnsConfig.slice(1).map((col) => {
                    const key = col.key as keyof typeof visibleColumns;
                    const isVisible = visibleColumns[key];
                    return (
                      <button
                        key={col.key}
                        onClick={() => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="flex w-full items-center justify-between px-2 py-1.5 hover:bg-foreground/[0.04] rounded-lg transition text-left cursor-pointer"
                      >
                        <span className="font-medium text-foreground/80 text-[12.5px]">{col.label.charAt(0) + col.label.slice(1).toLowerCase()}</span>
                        {isVisible ? (
                          <span className="flex h-4.5 w-4.5 items-center justify-center rounded border border-primary bg-primary text-primary-foreground">
                            <Check className="h-3 w-3" />
                          </span>
                        ) : (
                          <span className="h-4.5 w-4.5 rounded border border-border bg-card/50" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Template Download Button */}
            <button
              onClick={() => toast.success("Metadata template downloaded")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-3.5 text-[13px] font-semibold text-foreground/85 hover:text-foreground transition cursor-pointer"
            >
              <Download className="h-4 w-4 text-muted-foreground" /> Template
            </button>

            {/* Export Dropdown Popover Button */}
            <div className="relative">
              <button
                onClick={toggleExport}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-3.5 text-[13px] font-semibold text-foreground/85 hover:text-foreground transition cursor-pointer"
              >
                <Download className="h-4 w-4 text-muted-foreground" /> Export
                <span className="ml-1 px-1.5 py-0.5 text-[11px] font-bold bg-primary text-primary-foreground rounded-full leading-none">
                  {filteredRecords.length}
                </span>
              </button>

              {isExportOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-[250px] rounded-xl border border-border bg-popover text-popover-foreground shadow-glow p-3.5 z-50 text-[13px] text-left space-y-1.5"
                >
                  <div className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider px-2 py-1 mb-1.5">
                    Export {filteredRecords.length} records
                  </div>

                  {/* CSV option */}
                  <button
                    onClick={() => {
                      toast.success(`Exporting ${filteredRecords.length} records as CSV`);
                      setIsExportOpen(false);
                    }}
                    className="flex w-full items-start gap-3 p-2 hover:bg-foreground/[0.04] rounded-lg transition text-left cursor-pointer"
                  >
                    <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">CSV</div>
                      <div className="text-[11px] text-muted-foreground">Comma-separated values</div>
                    </div>
                  </button>

                  {/* Excel option */}
                  <button
                    onClick={() => {
                      toast.success(`Exporting ${filteredRecords.length} records as Excel`);
                      setIsExportOpen(false);
                    }}
                    className="flex w-full items-start gap-3 p-2 hover:bg-foreground/[0.04] rounded-lg transition text-left cursor-pointer"
                  >
                    <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">Excel (.xlsx)</div>
                      <div className="text-[11px] text-muted-foreground">Microsoft Excel workbook</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
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
                
                {/* Dynamic Table Headers */}
                {columnsConfig.map((col) => {
                  const key = col.key as keyof typeof visibleColumns;
                  if (col.locked || visibleColumns[key]) {
                    return (
                      <th key={col.key} className={cn("py-3 px-4", col.width)}>
                        {col.label}
                      </th>
                    );
                  }
                  return null;
                })}

                <th className="py-3 px-4 w-[160px] text-right">Actions</th>
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

                    {/* Layer Name Column */}
                    {(columnsConfig[0].locked || visibleColumns.layerName) && (
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-foreground text-[14px] truncate" title={rec.layerName}>
                          {rec.layerName}
                        </div>
                        <button 
                          onClick={() => toast.info(`Viewing ${rec.layerName} details`)}
                          className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline mt-1 cursor-pointer"
                        >
                          <Database className="h-3 w-3" />
                          <span>View Layer</span>
                        </button>
                      </td>
                    )}

                    {/* Entity Column */}
                    {visibleColumns.entity && (
                      <td className="py-3.5 px-4">
                        <div className="text-foreground leading-tight font-semibold truncate" title={rec.entity}>
                          {rec.entity}
                        </div>
                        <div className="inline-block px-1.5 py-0.5 rounded bg-warning/15 text-warning text-[10.5px] font-bold mt-1 uppercase border border-warning/25">
                          {rec.entityAcronym}
                        </div>
                      </td>
                    )}

                    {/* Completeness score + bar */}
                    {visibleColumns.completeness && (
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
                    )}

                    {/* Last Updated */}
                    {visibleColumns.lastUpdated && (
                      <td className="py-3.5 px-4 text-muted-foreground font-semibold text-[12.5px]">
                        {rec.lastUpdated}
                      </td>
                    )}

                    {/* Validation */}
                    {visibleColumns.publishStatus && (
                      <td className="py-3.5 px-4">
                        <span className={cn("px-2 py-0.5 rounded text-[11px] font-extrabold border uppercase", getStatusBadge(rec.status))}>
                          {rec.status}
                        </span>
                      </td>
                    )}

                    {/* Source */}
                    {visibleColumns.sourceType && (
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground/80">
                        {rec.sourceType}
                      </td>
                    )}

                    {/* Owner */}
                    {visibleColumns.owner && (
                      <td className="py-3.5 px-4 font-semibold text-foreground/80 leading-tight">
                        {rec.owner}
                      </td>
                    )}

                    {/* Language Coverage */}
                    {visibleColumns.languageCoverage && (
                      <td className="py-3.5 px-4 text-foreground/85 font-medium">
                        {rec.languageCoverage}
                      </td>
                    )}

                    {/* Review Date */}
                    {visibleColumns.reviewDate && (
                      <td className="py-3.5 px-4 text-muted-foreground font-semibold text-[12.5px]">
                        {rec.reviewDate}
                      </td>
                    )}

                    {/* Actions (Styled matching 3rd image circular buttons) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button 
                          onClick={() => toast.info(`Viewing ${rec.layerName}`)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition cursor-pointer" 
                          title="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => toast.info(`Editing ${rec.layerName}`)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition cursor-pointer" 
                          title="Edit record"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => toast.success(`Metadata validated for ${rec.layerName}`)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white transition cursor-pointer" 
                          title="Run validation check"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
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
