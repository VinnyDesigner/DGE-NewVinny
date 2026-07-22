import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
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
  ArrowLeft,
  Tag,
  Calendar,
  User,
  Users,
  Globe,
  Settings,
  ShieldCheck,
  List,
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

const ALL_TOPIC_CATEGORIES = [
  "Farming and Agriculture",
  "Flora and Fauna",
  "Administrative and Legal Boundaries",
  "Climate, Meteorology and Atmosphere",
  "Economy and Industry",
  "Elevation and Bathymetry",
  "Environment",
  "Geoscientific Information",
  "Health and Safety",
  "Imagery, Basemaps and Land Cover",
  "Intelligence and Military",
  "Inland Waters",
  "Location and Positioning",
  "Oceans and Coastal Waters",
  "Planning and Cadastre",
  "Society and Culture",
  "Buildings and Structures",
  "Transportation",
  "Utilities and Communication",
  "Extra-Terrestrial",
  "Disaster Information"
];

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

  // Detailed View state
  const [viewingRecord, setViewingRecord] = useState<RegistryRecord | null>(null);
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState("ISO 19139 Metadata Implementation Specification");
  const [activeViewTab, setActiveViewTab] = useState("overview");

  // Extensive form states prefilled for selected record
  const [formData, setFormData] = useState({
    title: "",
    titleAr: "",
    tags: "",
    tagsAr: "",
    summary: "",
    summaryAr: "",
    description: "",
    descriptionAr: "",
    useLimit: "",
    useLimitAr: "",
    topicCategories: "",
    themeKeywords: "",
    securityClassification: "",
    created: "",
    published: "",
    revised: "",
    contactName: "",
    contactOrg: "",
    contactPosition: "",
    contactRole: "",
    contactEmail: "",
    contactPhone: "",
    locale: "",
    localeAbstract: "",
    resourceStatus: "",
    resourceCharSet: "",
    west: "",
    east: "",
    south: "",
    north: "",
    geographicExtent: "",
    geometryType: "",
    scale: "",
    updateFrequency: "",
    customFrequency: "",
    nextUpdate: "",
    lastUpdated: "",
    reviewDate: "",
    spatialCode: "",
    spatialCodeName: "",
    dataQuality: "",
    accuracyNotes: "",
    validationNotes: "",
    lineageSource: "",
    lineageMedium: "",
    lineageRefSystem: "",
    entityAttribute: "",
    metaStandard: "",
    metaOwner: "",
    metaSourceType: "",
    metaPublished: "",
  });

  useEffect(() => {
    if (viewingRecord) {
      setFormData({
        title: viewingRecord.layerName || "",
        titleAr: "—",
        tags: "highways, arterials",
        tagsAr: "—",
        summary: "Transport planning and navigation",
        summaryAr: "—",
        description: "Comprehensive road network dataset covering all classified roads within the emirate.",
        descriptionAr: "—",
        useLimit: "Not for commercial use",
        useLimitAr: "—",
        topicCategories: "Transportation",
        themeKeywords: "test keyword",
        securityClassification: "Official",
        created: "2026-07-17",
        published: "—",
        revised: "—",
        contactName: "Mohammed Al Shamsi",
        contactOrg: "Dept of Municipalities & Transport",
        contactPosition: "GIS Manager",
        contactRole: "Resource Provider",
        contactEmail: "m.shamsi@dmt.gov.ae",
        contactPhone: "+971 45112448",
        locale: "English (en), Arabic (ar)",
        localeAbstract: "—",
        resourceStatus: "Ongoing",
        resourceCharSet: "UTF-8",
        west: "51.4971",
        east: "56.0181",
        south: "22.6315",
        north: "25.2512",
        geographicExtent: "Emirate",
        geometryType: "Polyline",
        scale: "1:25000",
        updateFrequency: "Quarterly",
        customFrequency: "90",
        nextUpdate: "2026-07-30",
        lastUpdated: viewingRecord.lastUpdated || "2026-07-21",
        reviewDate: "—",
        spatialCode: "4326",
        spatialCodeName: "WGS 1984 (EPSG:4326)",
        dataQuality: "Positional accuracy ±2m.",
        accuracyNotes: "—",
        validationNotes: "—",
        lineageSource: "GPS survey 2023",
        lineageMedium: "—",
        lineageRefSystem: "WGS 1946",
        entityAttribute: "—",
        metaStandard: "ESRI",
        metaOwner: "Abu Dhabi Digital Authority",
        metaSourceType: "FGDB1",
        metaPublished: "No",
      });
    }
  }, [viewingRecord]);

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClose = () => {
      setIsColumnsOpen(false);
      setIsExportOpen(false);
      setIsTopicDropdownOpen(false);
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

  const handleSaveMetadata = () => {
    if (!viewingRecord) return;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === viewingRecord.id
          ? {
              ...r,
              layerName: formData.title,
              lastUpdated: formData.lastUpdated,
            }
          : r
      )
    );
    setIsEditingMetadata(false);
    toast.success("Metadata record updated successfully!");
  };

  if (viewingRecord) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb / Back Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/85">
          <button
            onClick={() => {
              setViewingRecord(null);
              setIsEditingMetadata(false);
            }}
            className="hover:text-foreground transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Metadata Registry
          </button>
          <span>&gt;</span>
          <span className="text-foreground">View Metadata</span>
        </div>

        {/* Detailed Header Card Container */}
        <div className="bg-card/35 border border-border/50 rounded-xl p-5 shadow-soft space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/30 to-secondary-accent/30 text-accent border border-primary/20">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-[20px] font-black text-foreground tracking-tight leading-none">
                    {formData.title}
                  </h2>
                  <span className={cn("px-2 py-0.5 rounded text-[11px] font-extrabold border uppercase", getStatusBadge(viewingRecord.status))}>
                    {viewingRecord.status}
                  </span>
                </div>
                
                {/* Secondary Meta Row */}
                <div className="flex items-center gap-4 text-[12px] font-semibold text-muted-foreground/90 flex-wrap">
                  <span className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded border border-border/50">
                    <Database className="h-3.5 w-3.5 text-primary" /> {viewingRecord.entity}
                  </span>
                  <span>Layer #165</span>
                  <span>{viewingRecord.standard}</span>
                  <span>Updated {formData.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Dropdown standards & Edit Button */}
            <div className="flex items-center gap-2">
              <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                <SelectTrigger className="h-9 w-[260px] border-border/60 bg-card/60 text-[12.5px] font-semibold text-foreground/80 hover:bg-card/90 transition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border/60 max-w-[280px]">
                  <SelectItem value="FGDC CSDGM Metadata" className="cursor-pointer text-[12.5px]">FGDC CSDGM Metadata</SelectItem>
                  <SelectItem value="INSPIRE Metadata Directive" className="cursor-pointer text-[12.5px]">INSPIRE Metadata Directive</SelectItem>
                  <SelectItem value="ISO 19139 Metadata Implementation Specification" className="cursor-pointer text-[12.5px]">ISO 19139 Metadata Implementation Specification</SelectItem>
                  <SelectItem value="ISO 19139 Metadata Implementation Specification (Arabic)" className="cursor-pointer text-[12.5px]">ISO 19139 Metadata Implementation Spec (AR)</SelectItem>
                  <SelectItem value="North American Profile of ISO19115 2003" className="cursor-pointer text-[12.5px]">North American Profile of ISO19115 2003</SelectItem>
                  <SelectItem value="ISO 19115-3 XML Schema Implementation" className="cursor-pointer text-[12.5px]">ISO 19115-3 XML Schema Implementation</SelectItem>
                </SelectContent>
              </Select>

              {isEditingMetadata ? (
                <button
                  onClick={handleSaveMetadata}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13.5px] font-bold text-primary-foreground hover:bg-primary/95 transition cursor-pointer shadow-soft"
                >
                  <Check className="h-4 w-4" /> Save Metadata
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingMetadata(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13.5px] font-bold text-primary-foreground hover:bg-primary/95 transition cursor-pointer shadow-soft"
                >
                  <Pencil className="h-4 w-4" /> Edit Metadata
                </button>
              )}
            </div>
          </div>

          {/* Completeness Bar */}
          <div className="pt-2 border-t border-border/40 space-y-1.5">
            <div className="flex items-center justify-between text-[11.5px] font-bold text-muted-foreground uppercase tracking-wider">
              <span>Completeness</span>
              <span className="text-foreground font-black">{viewingRecord.completeness}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border/40 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${viewingRecord.completeness}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab selection pill bar */}
        <div className="flex items-center gap-1 bg-card/45 dark:bg-card/25 border border-border/60 p-1.5 rounded-xl w-fit">
          <button
            onClick={() => setActiveViewTab("overview")}
            className={cn(
              "inline-flex h-8.5 items-center gap-1.5 px-4 rounded-lg text-[13px] font-bold cursor-pointer transition-all",
              activeViewTab === "overview"
                ? "bg-card text-foreground shadow-soft border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Globe className="h-4 w-4" /> Overview
          </button>
          <button
            onClick={() => setActiveViewTab("versions")}
            className={cn(
              "inline-flex h-8.5 items-center gap-1.5 px-4 rounded-lg text-[13px] font-bold cursor-pointer transition-all",
              activeViewTab === "versions"
                ? "bg-card text-foreground shadow-soft border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="h-4 w-4" /> Versions
          </button>
        </div>

        {/* Content Tabs Area */}
        {activeViewTab === "overview" ? (
          <div className="bg-card/20 border border-border/50 rounded-xl p-6 shadow-soft space-y-6">
            
            {/* 1. Item Description */}
            <div className="space-y-4">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <FileText className="h-4.5 w-4.5 text-emerald-500" /> Item Description
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Title</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Title (Arabic)</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.titleAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Tags</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Tags (Arabic)</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.tagsAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagsAr: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Summary (Purpose)</label>
                  <textarea
                    rows={2}
                    disabled={!isEditingMetadata}
                    value={formData.summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    className="w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 p-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85 resize-none"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Summary (Arabic)</label>
                  <textarea
                    rows={2}
                    disabled={!isEditingMetadata}
                    value={formData.summaryAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, summaryAr: e.target.value }))}
                    className="w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 p-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85 resize-none"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Description (Abstract)</label>
                  <textarea
                    rows={3}
                    disabled={!isEditingMetadata}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 p-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85 resize-none"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Description (Arabic)</label>
                  <textarea
                    rows={3}
                    disabled={!isEditingMetadata}
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    className="w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 p-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85 resize-none"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Use Limitation</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.useLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, useLimit: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Use Limitation (Arabic)</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.useLimitAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, useLimitAr: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 2. Topics and Keywords */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <Tag className="h-4.5 w-4.5 text-purple-500" /> Topics and Keywords
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                    Topic Categories <span className="text-destructive">*</span>
                  </label>
                  
                  {/* Dropdown Trigger */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTopicDropdownOpen(prev => !prev);
                    }}
                    className={cn(
                      "h-9 w-full rounded-lg border px-3 text-[13px] font-semibold text-foreground flex items-center justify-between transition-all select-none cursor-pointer bg-card/60 dark:bg-card/20 border-border/70 hover:border-primary/50",
                      isTopicDropdownOpen && "border-primary ring-1 ring-primary/45"
                    )}
                  >
                    <span className="truncate">
                      {formData.topicCategories || "Select topic categories..."}
                    </span>
                    {isTopicDropdownOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </div>

                  {/* Dropdown Menu Portal positioned absolute */}
                  {isTopicDropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-[calc(100%+4px)] w-full rounded-xl border border-border bg-popover text-popover-foreground shadow-glow p-2 z-[60] space-y-0.5"
                    >
                      <div className="max-h-60 overflow-y-auto pr-1">
                        {ALL_TOPIC_CATEGORIES.map((topic) => {
                          const selectedList = formData.topicCategories
                            ? formData.topicCategories.split(", ").filter(Boolean)
                            : [];
                          const isChecked = selectedList.includes(topic);
                          
                          return (
                            <button
                              key={topic}
                              type="button"
                              disabled={!isEditingMetadata}
                              onClick={() => {
                                if (!isEditingMetadata) return;
                                let updated: string[];
                                if (isChecked) {
                                  updated = selectedList.filter(t => t !== topic);
                                } else {
                                  updated = [...selectedList, topic];
                                }
                                setFormData(prev => ({
                                  ...prev,
                                  topicCategories: updated.join(", ")
                                }));
                              }}
                              className={cn(
                                "flex w-full items-center gap-3 px-2.5 py-2 hover:bg-foreground/[0.04] rounded-lg transition text-left text-[13px] font-semibold text-foreground/90",
                                !isEditingMetadata ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                              )}
                            >
                              <div
                                className={cn(
                                  "h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-all",
                                  isChecked
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-card/50"
                                )}
                              >
                                {isChecked && <Check className="h-3 w-3 stroke-[3.5]" />}
                              </div>
                              <span className="truncate">{topic}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Theme Keywords</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.themeKeywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, themeKeywords: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Security Classification</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.securityClassification}
                    onChange={(e) => setFormData(prev => ({ ...prev, securityClassification: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 3. Citation — Dates */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <Calendar className="h-4.5 w-4.5 text-orange-500" /> Citation — Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Created</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.created}
                    onChange={(e) => setFormData(prev => ({ ...prev, created: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Published</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Revised</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.revised}
                    onChange={(e) => setFormData(prev => ({ ...prev, revised: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 4. Citation Contacts */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <User className="h-4.5 w-4.5 text-blue-500" /> Citation Contacts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Name</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Organization</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.contactOrg}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactOrg: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Position</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.contactPosition}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPosition: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Role</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.contactRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactRole: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Email</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85 text-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Phone</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 5. Locales — Language */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <Globe className="h-4.5 w-4.5 text-teal-500" /> Locales — Language
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Locale</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.locale}
                    onChange={(e) => setFormData(prev => ({ ...prev, locale: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Abstract (locale)</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.localeAbstract}
                    onChange={(e) => setFormData(prev => ({ ...prev, localeAbstract: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 6. Resource Details */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <Database className="h-4.5 w-4.5 text-slate-500" /> Resource Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Status</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.resourceStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, resourceStatus: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Character Set</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.resourceCharSet}
                    onChange={(e) => setFormData(prev => ({ ...prev, resourceCharSet: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 7. Extents — Bounding Box */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <Globe className="h-4.5 w-4.5 text-purple-500" /> Extents — Bounding Box
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">West</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.west}
                    onChange={(e) => setFormData(prev => ({ ...prev, west: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">East</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.east}
                    onChange={(e) => setFormData(prev => ({ ...prev, east: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">South</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.south}
                    onChange={(e) => setFormData(prev => ({ ...prev, south: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">North</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.north}
                    onChange={(e) => setFormData(prev => ({ ...prev, north: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Geographic Extent</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.geographicExtent}
                    onChange={(e) => setFormData(prev => ({ ...prev, geographicExtent: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Geometry Type</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.geometryType}
                    onChange={(e) => setFormData(prev => ({ ...prev, geometryType: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Scale</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.scale}
                    onChange={(e) => setFormData(prev => ({ ...prev, scale: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 8. Maintenance */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <RefreshCw className="h-4.5 w-4.5 text-orange-500" /> Maintenance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Update Frequency</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.updateFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, updateFrequency: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Custom Frequency</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.customFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, customFrequency: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Next Update</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.nextUpdate}
                    onChange={(e) => setFormData(prev => ({ ...prev, nextUpdate: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Last Updated</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.lastUpdated}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastUpdated: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Review Date</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.reviewDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, reviewDate: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 9. Spatial Reference — Reference System */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <Globe className="h-4.5 w-4.5 text-blue-500" /> Spatial Reference — Reference System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Code</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.spatialCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, spatialCode: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Code Name</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.spatialCodeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, spatialCodeName: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 10. Quality */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <Shield className="h-4.5 w-4.5 text-emerald-500" /> Quality
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Data Quality</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.dataQuality}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataQuality: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Accuracy Notes</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.accuracyNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, accuracyNotes: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Validation Notes</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.validationNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, validationNotes: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 11. Lineage / Data Source */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <Database className="h-4.5 w-4.5 text-emerald-500" /> Lineage / Data Source
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Source</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.lineageSource}
                    onChange={(e) => setFormData(prev => ({ ...prev, lineageSource: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Medium Name</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.lineageMedium}
                    onChange={(e) => setFormData(prev => ({ ...prev, lineageMedium: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Source Reference System</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.lineageRefSystem}
                    onChange={(e) => setFormData(prev => ({ ...prev, lineageRefSystem: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 12. Fields — Entity and Attribute Information */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <List className="h-4.5 w-4.5 text-slate-500" /> Fields — Entity and Attribute Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Entity and Attribute Information</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.entityAttribute}
                    onChange={(e) => setFormData(prev => ({ ...prev, entityAttribute: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>

            {/* 13. Standards & Compliance */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h3 className="text-[14.5px] font-extrabold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-500" /> Standards & Compliance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Metadata Standard</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.metaStandard}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaStandard: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Owner</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.metaOwner}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaOwner: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Source Type</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.metaSourceType}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaSourceType: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Published</label>
                  <input
                    type="text"
                    disabled={!isEditingMetadata}
                    value={formData.metaPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaPublished: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-border/70 bg-card/60 dark:bg-card/20 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-85"
                  />
                </div>
              </div>
            </div>
            
          </div>
        ) : (
          /* Versions Tab */
          <div className="bg-card/20 border border-border/50 rounded-xl p-6 shadow-soft space-y-4">
            <h3 className="text-[15px] font-bold text-foreground">Metadata Version History</h3>
            <div className="relative border-l-2 border-border/60 pl-5 ml-2.5 space-y-5">
              <div className="relative">
                <span className="absolute -left-7.5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white ring-4 ring-background">
                  <Check className="h-2.5 w-2.5" />
                </span>
                <div className="text-[13px] font-bold text-foreground">Version 1.2 (Active Draft)</div>
                <div className="text-[12px] text-muted-foreground mt-0.5">Updated on {formData.lastUpdated} by Mohammed Al Shamsi</div>
                <div className="text-[12.5px] text-foreground/80 mt-1.5">Modified tags and bounding box coordinates for accuracy.</div>
              </div>
              <div className="relative">
                <span className="absolute -left-7.5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-background">
                  <Check className="h-2.5 w-2.5" />
                </span>
                <div className="text-[13px] font-bold text-foreground">Version 1.1</div>
                <div className="text-[12px] text-muted-foreground mt-0.5">Approved on 2026-07-15 by QAQC reviewer</div>
                <div className="text-[12.5px] text-foreground/80 mt-1.5">First official metadata compliance check passed.</div>
              </div>
              <div className="relative">
                <span className="absolute -left-7.5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-500 text-white ring-4 ring-background">
                  <Check className="h-2.5 w-2.5" />
                </span>
                <div className="text-[13px] font-bold text-foreground">Version 1.0</div>
                <div className="text-[12px] text-muted-foreground mt-0.5">Created on 2026-07-10 by Systems Automation</div>
                <div className="text-[12.5px] text-foreground/80 mt-1.5">Initial ingestion from source FGDB schema mapping.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

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
                          onClick={() => setViewingRecord(rec)}
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
                          onClick={() => setViewingRecord(rec)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition cursor-pointer" 
                          title="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            setViewingRecord(rec);
                            setIsEditingMetadata(true);
                          }}
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
