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
  Upload,
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState("ISO 19139 Metadata Implementation Specification");
  const [activeViewTab, setActiveViewTab] = useState("overview");

  const getInputClassName = (additionalClasses = "") => {
    return cn(
      "h-9 w-full rounded-lg border px-3 text-[13px] font-semibold transition-all focus:outline-none",
      isEditMode 
        ? "border-border/70 bg-card/65 dark:bg-card/25 text-foreground focus:ring-1 focus:ring-primary/40" 
        : "border-border/40 bg-muted/20 dark:bg-muted/10 text-muted-foreground/90 cursor-default select-text focus:ring-0",
      additionalClasses
    );
  };

  const getFieldViewValue = (val: string) => {
    return (
      <div className="w-full min-h-[36px] flex items-center rounded-lg border border-border/25 bg-muted/5 dark:bg-muted/10 px-3 text-[13.5px] font-semibold text-foreground dark:text-white select-text">
        {val || "—"}
      </div>
    );
  };

  const getFieldViewTextArea = (val: string) => {
    return (
      <div className="w-full min-h-[72px] py-2 rounded-lg border border-border/25 bg-muted/5 dark:bg-muted/10 px-3 text-[13.5px] font-semibold text-foreground dark:text-white select-text whitespace-pre-wrap leading-relaxed">
        {val || "—"}
      </div>
    );
  };

  const handleResetForm = () => {
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
        nextUpdate: "2026-10-17",
        lastUpdated: "2026-07-21",
        reviewDate: "2027-07-21",
        spatialCode: "EPSG:32640",
        spatialCodeName: "WGS 84 / UTM zone 40N",
        dataQuality: "Positional accuracy ±2m.",
        accuracyNotes: "",
        validationNotes: "",
        lineageSource: "GPS surveys",
        lineageMedium: "Online Link",
        lineageRefSystem: "WGS 84",
        entityAttribute: "Road centerlines with classifications",
        metaStandard: "ESRI",
        metaOwner: "Abu Dhabi Digital Authority",
        metaSourceType: "FGDB1",
        metaPublished: "—",
      });
    }
  };

  // Sections collapse/expand state
  const [openSections, setOpenSections] = useState({
    itemDescription: true,
    topicsKeywords: true,
    citationDates: true,
    citationContacts: true,
    localesLanguage: true,
    resourceDetails: true,
    extentsBoundingBox: true,
    maintenance: true,
    spatialReference: true,
    quality: true,
    lineageDataSource: true,
    fieldsInfo: true,
    standardsCompliance: true,
  });

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
    toast.success("Metadata record updated successfully!");
  };

  if (viewingRecord) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col overflow-hidden gap-4">
        {/* Fixed Header Content Block */}
        <div className="shrink-0 space-y-4">
          {/* Breadcrumb / Back Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/85">
            <button
              onClick={() => {
                setViewingRecord(null);
              }}
              className="hover:text-foreground transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Metadata Registry
            </button>
            <span>&gt;</span>
            <span className="text-foreground">{isEditMode ? "Edit Metadata" : "View Metadata"}</span>
          </div>

          {/* Detailed Header Card Container */}
          <div className="relative bg-card/30 border border-border/50 rounded-xl p-5 shadow-soft space-y-4 overflow-hidden">
            {/* Top Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
            
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <FileText className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-[18px] font-black text-foreground tracking-tight leading-none">
                      {formData.title}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                      {viewingRecord.status}
                    </span>
                  </div>
                  
                  {/* Secondary Meta Row */}
                  <div className="flex items-center gap-3.5 text-[12px] font-semibold text-muted-foreground/80 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-extrabold text-[9px]">
                        AD
                      </span>
                      <span>Abu Dhabi Digital Authority</span>
                    </div>
                    <span className="text-muted-foreground/45">•</span>
                    <div className="flex items-center gap-1">
                      <Database className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span>Layer #165</span>
                    </div>
                    <span className="text-muted-foreground/45">•</span>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span>{viewingRecord.standard}</span>
                    </div>
                    <span className="text-muted-foreground/45">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span>Updated {formData.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropdown standards & Edit Button */}
              {isEditMode ? (
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      toast.success("Metadata template imported successfully!");
                    }}
                    className="inline-flex h-9 items-center gap-2 rounded-full bg-[#008fa2] hover:bg-[#007a8c] px-4 text-[13px] font-bold text-white transition cursor-pointer shadow-soft border-none"
                  >
                    <Upload className="h-4 w-4" /> Import
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleResetForm();
                      setIsEditMode(false);
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/80 bg-background hover:bg-muted/10 px-4 text-[13px] font-bold text-foreground transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Select value={selectedStandard} onValueChange={setSelectedStandard} disabled={true}>
                    <SelectTrigger className="h-9 w-[260px] rounded-full border-border/60 bg-card/65 dark:bg-card/25 text-[12.5px] font-semibold text-foreground/85 hover:bg-card/90 transition disabled:opacity-90 disabled:cursor-default">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-muted-foreground/75 shrink-0" />
                        <SelectValue />
                      </div>
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
                  <button
                    onClick={() => {
                      setIsEditMode(true);
                      setActiveViewTab("overview");
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-500 px-4 text-[13px] font-extrabold text-white transition cursor-pointer shadow-soft border-none"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit Metadata
                  </button>
                </div>
              )}
            </div>

            {/* Completeness Bar in single line */}
            <div className="pt-3 border-t border-border/40 flex items-center gap-4">
              <span className="text-[10.5px] font-extrabold text-muted-foreground/75 uppercase tracking-wider shrink-0">
                Completeness
              </span>
              <div className="h-1.5 flex-1 rounded-full bg-border/40 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${viewingRecord.completeness}%` }}
                />
              </div>
              <span className="text-[13px] font-black text-foreground shrink-0">
                {viewingRecord.completeness}%
              </span>
            </div>
          </div>

          {/* Tab selection pill bar */}
          {!isEditMode && (
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
          )}
        </div>

        {/* Scrollable Content Sections Block */}
        <div className="flex-1 overflow-y-auto pr-1.5 pb-8 space-y-4 scrollbar-thin">
          {isEditMode || activeViewTab === "overview" ? (
            <div className="space-y-4">
            
            {/* 1. Item Description */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, itemDescription: !prev.itemDescription }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.itemDescription && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-emerald-500" /> Item Description
                </h3>
                {isEditMode && (openSections.itemDescription ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>
              
              {openSections.itemDescription && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Title</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.title)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Title (Arabic)</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.titleAr}
                        onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.titleAr)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Tags</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.tags)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Tags (Arabic)</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.tagsAr}
                        onChange={(e) => setFormData(prev => ({ ...prev, tagsAr: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.tagsAr)
                    )}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Summary (Purpose)</label>
                    {isEditMode ? (
                      <textarea
                        rows={2}
                        value={formData.summary}
                        onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                        className={cn(
                          "w-full rounded-lg border p-3 text-[13px] font-semibold focus:outline-none resize-none transition-colors",
                          "border-border/70 bg-card/65 dark:bg-card/25 text-foreground focus:ring-1 focus:ring-primary/40"
                        )}
                      />
                    ) : (
                      getFieldViewTextArea(formData.summary)
                    )}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Summary (Arabic)</label>
                    {isEditMode ? (
                      <textarea
                        rows={2}
                        value={formData.summaryAr}
                        onChange={(e) => setFormData(prev => ({ ...prev, summaryAr: e.target.value }))}
                        className={cn(
                          "w-full rounded-lg border p-3 text-[13px] font-semibold focus:outline-none resize-none transition-colors",
                          "border-border/70 bg-card/65 dark:bg-card/25 text-foreground focus:ring-1 focus:ring-primary/40"
                        )}
                      />
                    ) : (
                      getFieldViewTextArea(formData.summaryAr)
                    )}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Description (Abstract)</label>
                    {isEditMode ? (
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className={cn(
                          "w-full rounded-lg border p-3 text-[13px] font-semibold focus:outline-none resize-none transition-colors",
                          "border-border/70 bg-card/65 dark:bg-card/25 text-foreground focus:ring-1 focus:ring-primary/40"
                        )}
                      />
                    ) : (
                      getFieldViewTextArea(formData.description)
                    )}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Description (Arabic)</label>
                    {isEditMode ? (
                      <textarea
                        rows={3}
                        value={formData.descriptionAr}
                        onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                        className={cn(
                          "w-full rounded-lg border p-3 text-[13px] font-semibold focus:outline-none resize-none transition-colors",
                          "border-border/70 bg-card/65 dark:bg-card/25 text-foreground focus:ring-1 focus:ring-primary/40"
                        )}
                      />
                    ) : (
                      getFieldViewTextArea(formData.descriptionAr)
                    )}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Use Limitation</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.useLimit}
                        onChange={(e) => setFormData(prev => ({ ...prev, useLimit: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.useLimit)
                    )}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Use Limitation (Arabic)</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.useLimitAr}
                        onChange={(e) => setFormData(prev => ({ ...prev, useLimitAr: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.useLimitAr)
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Topics and Keywords */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, topicsKeywords: !prev.topicsKeywords }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.topicsKeywords && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <Tag className="h-4.5 w-4.5 text-purple-500" /> Topics and Keywords
                </h3>
                {isEditMode && (openSections.topicsKeywords ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.topicsKeywords && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200 overflow-visible">
                  <div className="space-y-1.5 relative">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Topic Categories <span className="text-destructive">*</span>
                    </label>
                    
                    {isEditMode ? (
                      <>
                        {/* Dropdown Trigger */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsTopicDropdownOpen(prev => !prev);
                          }}
                          className={cn(
                            "h-9 w-full rounded-lg border px-3 text-[13px] font-semibold text-foreground flex items-center justify-between transition-all select-none cursor-pointer bg-card/65 dark:bg-card/25 border-border/70 hover:border-primary/50",
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

                        {/* Dropdown Menu positioned absolute */}
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
                                    onClick={() => {
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
                                    className="flex w-full items-center gap-3 px-2.5 py-2 hover:bg-foreground/[0.04] rounded-lg transition text-left text-[13px] font-semibold text-foreground/90 cursor-pointer"
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
                      </>
                    ) : (
                      getFieldViewValue(formData.topicCategories)
                    )}
                  </div>

                  {/* Security Classification Select Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Security Classification <span className="text-destructive">*</span>
                    </label>
                    {isEditMode ? (
                      <Select
                        value={formData.securityClassification}
                        onValueChange={(val) => setFormData(prev => ({ ...prev, securityClassification: val }))}
                      >
                        <SelectTrigger className="h-9 w-full border-border/70 bg-card/65 dark:bg-card/25 text-[13px] font-semibold text-foreground">
                          <SelectValue placeholder="Select classification..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/60">
                          <SelectItem value="Unclassified" className="cursor-pointer text-[13px]">Unclassified</SelectItem>
                          <SelectItem value="Restricted" className="cursor-pointer text-[13px]">Restricted</SelectItem>
                          <SelectItem value="Confidential" className="cursor-pointer text-[13px]">Confidential</SelectItem>
                          <SelectItem value="Secret" className="cursor-pointer text-[13px]">Secret</SelectItem>
                          <SelectItem value="Top Secret" className="cursor-pointer text-[13px]">Top Secret</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getFieldViewValue(formData.securityClassification)
                    )}
                  </div>

                  {/* Theme Keywords Chip Component */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Theme Keywords</label>
                    <div className={cn(
                      "flex flex-wrap gap-2 items-center min-h-[38px] p-1.5 rounded-lg border transition-colors",
                      isEditMode
                        ? "border-border/70 bg-card/65 dark:bg-card/25"
                        : "border-border/25 bg-muted/5 dark:bg-muted/10 cursor-default"
                    )}>
                      {(formData.themeKeywords ? formData.themeKeywords.split(",").map(k => k.trim()).filter(Boolean) : []).map((kw, i, arr) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                          {kw}
                          {isEditMode && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = arr.filter((_, idx) => idx !== i);
                                setFormData(prev => ({ ...prev, themeKeywords: updated.join(", ") }));
                              }}
                              className="hover:text-rose-500 transition font-black ml-0.5 text-sm cursor-pointer leading-none"
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                      {isEditMode && (
                        <input
                          type="text"
                          placeholder="Add keyword (Press Enter)..."
                          className="flex-1 bg-transparent border-0 p-0 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-0 min-w-[150px]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              const current = formData.themeKeywords ? formData.themeKeywords.split(",").map(k => k.trim()).filter(Boolean) : [];
                              if (val && !current.includes(val)) {
                                const updated = [...current, val];
                                setFormData(prev => ({ ...prev, themeKeywords: updated.join(", ") }));
                                e.currentTarget.value = "";
                              }
                            }
                          }}
                        />
                      )}
                      {!isEditMode && !formData.themeKeywords && (
                        <span className="text-[13px] font-semibold text-muted-foreground/50 ml-1">—</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Citation — Dates */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, citationDates: !prev.citationDates }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.citationDates && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5 text-orange-500" /> Citation — Dates
                </h3>
                {isEditMode && (openSections.citationDates ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.citationDates && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Created</label>
                    {isEditMode ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.created}
                          onChange={(e) => setFormData(prev => ({ ...prev, created: e.target.value }))}
                          className={getInputClassName("pl-3 pr-10")}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                      </div>
                    ) : (
                      getFieldViewValue(formData.created)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Published</label>
                    {isEditMode ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.published}
                          onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.value }))}
                          className={getInputClassName("pl-3 pr-10")}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                      </div>
                    ) : (
                      getFieldViewValue(formData.published)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Revised</label>
                    {isEditMode ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.revised}
                          onChange={(e) => setFormData(prev => ({ ...prev, revised: e.target.value }))}
                          className={getInputClassName("pl-3 pr-10")}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                      </div>
                    ) : (
                      getFieldViewValue(formData.revised)
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Citation Contacts */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, citationContacts: !prev.citationContacts }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.citationContacts && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-blue-500" /> Citation Contacts
                </h3>
                {isEditMode && (openSections.citationContacts ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.citationContacts && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200 overflow-visible">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Name <span className="text-destructive">*</span>
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.contactName)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Organization <span className="text-destructive">*</span>
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.contactOrg}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactOrg: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.contactOrg)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Position <span className="text-destructive">*</span>
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.contactPosition}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactPosition: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.contactPosition)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Role <span className="text-destructive">*</span>
                    </label>
                    {isEditMode ? (
                      <Select
                        value={formData.contactRole}
                        onValueChange={(val) => setFormData(prev => ({ ...prev, contactRole: val }))}
                      >
                        <SelectTrigger className="h-9 w-full border-border/70 bg-card/65 dark:bg-card/25 text-[13px] font-semibold text-foreground">
                          <SelectValue placeholder="Select role..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/60 max-h-60 overflow-y-auto">
                          <SelectItem value="Resource Provider" className="cursor-pointer text-[13px]">Resource Provider</SelectItem>
                          <SelectItem value="Custodian" className="cursor-pointer text-[13px]">Custodian</SelectItem>
                          <SelectItem value="Owner" className="cursor-pointer text-[13px]">Owner</SelectItem>
                          <SelectItem value="User" className="cursor-pointer text-[13px]">User</SelectItem>
                          <SelectItem value="Distributor" className="cursor-pointer text-[13px]">Distributor</SelectItem>
                          <SelectItem value="Originator" className="cursor-pointer text-[13px]">Originator</SelectItem>
                          <SelectItem value="Point of Contact" className="cursor-pointer text-[13px]">Point of Contact</SelectItem>
                          <SelectItem value="Principal Investigator" className="cursor-pointer text-[13px]">Principal Investigator</SelectItem>
                          <SelectItem value="Processor" className="cursor-pointer text-[13px]">Processor</SelectItem>
                          <SelectItem value="Publisher" className="cursor-pointer text-[13px]">Publisher</SelectItem>
                          <SelectItem value="Author" className="cursor-pointer text-[13px]">Author</SelectItem>
                          <SelectItem value="Co-Author" className="cursor-pointer text-[13px]">Co-Author</SelectItem>
                          <SelectItem value="Collaborator" className="cursor-pointer text-[13px]">Collaborator</SelectItem>
                          <SelectItem value="Editor" className="cursor-pointer text-[13px]">Editor</SelectItem>
                          <SelectItem value="Mediator" className="cursor-pointer text-[13px]">Mediator</SelectItem>
                          <SelectItem value="Rights Holder" className="cursor-pointer text-[13px]">Rights Holder</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getFieldViewValue(formData.contactRole)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Email <span className="text-destructive">*</span>
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                        className={getInputClassName("text-primary")}
                      />
                    ) : (
                      <div className="w-full min-h-[36px] flex items-center rounded-lg border border-border/25 bg-muted/5 dark:bg-muted/10 px-3 text-[13.5px] font-semibold text-primary dark:text-cyan-400 select-text">
                        {formData.contactEmail || "—"}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Phone</label>
                    {isEditMode ? (
                      <div className="flex gap-2">
                        <Select defaultValue="+971 UAE">
                          <SelectTrigger className="h-9 w-[130px] shrink-0 border-border/70 bg-card/65 dark:bg-card/25 text-[13px] font-semibold text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/60">
                            <SelectItem value="+971 UAE" className="cursor-pointer text-[13px]">+971 UAE</SelectItem>
                            <SelectItem value="+966 KSA" className="cursor-pointer text-[13px]">+966 KSA</SelectItem>
                            <SelectItem value="+965 KWT" className="cursor-pointer text-[13px]">+965 KWT</SelectItem>
                            <SelectItem value="+968 OMN" className="cursor-pointer text-[13px]">+968 OMN</SelectItem>
                            <SelectItem value="+974 QTR" className="cursor-pointer text-[13px]">+974 QTR</SelectItem>
                            <SelectItem value="+973 BHR" className="cursor-pointer text-[13px]">+973 BHR</SelectItem>
                          </SelectContent>
                        </Select>
                        <input
                          type="text"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                          className={getInputClassName()}
                        />
                      </div>
                    ) : (
                      getFieldViewValue(formData.contactPhone)
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Locales — Language */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, localesLanguage: !prev.localesLanguage }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.localesLanguage && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <Globe className="h-4.5 w-4.5 text-teal-500" /> Locales — Language
                </h3>
                {isEditMode && (openSections.localesLanguage ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.localesLanguage && (
                <div className="p-5 grid grid-cols-1 gap-4 animate-in fade-in duration-200 overflow-visible">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Locale <span className="text-destructive">*</span>
                    </label>
                    {isEditMode ? (
                      <Select
                        value={formData.locale}
                        onValueChange={(val) => setFormData(prev => ({ ...prev, locale: val }))}
                      >
                        <SelectTrigger className="h-9 w-full border-border/70 bg-card/65 dark:bg-card/25 text-[13px] font-semibold text-foreground">
                          <SelectValue placeholder="Select locale..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/60">
                          <SelectItem value="English (en)" className="cursor-pointer text-[13px]">English (en)</SelectItem>
                          <SelectItem value="Arabic (ar)" className="cursor-pointer text-[13px]">Arabic (ar)</SelectItem>
                          <SelectItem value="English (en), Arabic (ar)" className="cursor-pointer text-[13px]">English (en), Arabic (ar)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getFieldViewValue(formData.locale)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Abstract (locale)</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.localeAbstract}
                        onChange={(e) => setFormData(prev => ({ ...prev, localeAbstract: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.localeAbstract)
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 6. Resource Details */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, resourceDetails: !prev.resourceDetails }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.resourceDetails && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <Database className="h-4.5 w-4.5 text-slate-500" /> Resource Details
                </h3>
                {isEditMode && (openSections.resourceDetails ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.resourceDetails && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200 overflow-visible">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Status</label>
                    {isEditMode ? (
                      <Select
                        value={formData.resourceStatus}
                        onValueChange={(val) => setFormData(prev => ({ ...prev, resourceStatus: val }))}
                      >
                        <SelectTrigger className="h-9 w-full border-border/70 bg-card/65 dark:bg-card/25 text-[13px] font-semibold text-foreground">
                          <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/60">
                          <SelectItem value="Completed" className="cursor-pointer text-[13px]">Completed</SelectItem>
                          <SelectItem value="Historical Archive" className="cursor-pointer text-[13px]">Historical Archive</SelectItem>
                          <SelectItem value="Obsolete" className="cursor-pointer text-[13px]">Obsolete</SelectItem>
                          <SelectItem value="On Going" className="cursor-pointer text-[13px]">On Going</SelectItem>
                          <SelectItem value="Planned" className="cursor-pointer text-[13px]">Planned</SelectItem>
                          <SelectItem value="Required" className="cursor-pointer text-[13px]">Required</SelectItem>
                          <SelectItem value="Under Development" className="cursor-pointer text-[13px]">Under Development</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getFieldViewValue(formData.resourceStatus)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Character Set <span className="text-destructive">*</span>
                    </label>
                    {isEditMode ? (
                      <Select
                        value={formData.resourceCharSet}
                        onValueChange={(val) => setFormData(prev => ({ ...prev, resourceCharSet: val }))}
                      >
                        <SelectTrigger className="h-9 w-full border-border/70 bg-card/65 dark:bg-card/25 text-[13px] font-semibold text-foreground">
                          <SelectValue placeholder="Select character set..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/60">
                          <SelectItem value="UTF-8" className="cursor-pointer text-[13px]">UTF-8</SelectItem>
                          <SelectItem value="UTF-16" className="cursor-pointer text-[13px]">UTF-16</SelectItem>
                          <SelectItem value="UCS-2" className="cursor-pointer text-[13px]">UCS-2</SelectItem>
                          <SelectItem value="UCS-4" className="cursor-pointer text-[13px]">UCS-4</SelectItem>
                          <SelectItem value="US-ASCII" className="cursor-pointer text-[13px]">US-ASCII</SelectItem>
                          <SelectItem value="ISO-8859-1" className="cursor-pointer text-[13px]">ISO-8859-1</SelectItem>
                          <SelectItem value="Windows-1256" className="cursor-pointer text-[13px]">Windows-1256</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getFieldViewValue(formData.resourceCharSet)
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 7. Extents — Bounding Box */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, extentsBoundingBox: !prev.extentsBoundingBox }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.extentsBoundingBox && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <Globe className="h-4.5 w-4.5 text-purple-500" /> Extents — Bounding Box
                </h3>
                {isEditMode && (openSections.extentsBoundingBox ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.extentsBoundingBox && (
                <div className="p-5 space-y-4 animate-in fade-in duration-200">
                  {/* First row: 4 coordinate columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">West</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          step="any"
                          value={formData.west}
                          onChange={(e) => setFormData(prev => ({ ...prev, west: e.target.value }))}
                          className={getInputClassName("cursor-pointer")}
                          style={{ appearance: 'auto', WebkitAppearance: 'auto' } as any}
                        />
                      ) : (
                        getFieldViewValue(formData.west)
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">East</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          step="any"
                          value={formData.east}
                          onChange={(e) => setFormData(prev => ({ ...prev, east: e.target.value }))}
                          className={getInputClassName("cursor-pointer")}
                          style={{ appearance: 'auto', WebkitAppearance: 'auto' } as any}
                        />
                      ) : (
                        getFieldViewValue(formData.east)
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">North</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          step="any"
                          value={formData.north}
                          onChange={(e) => setFormData(prev => ({ ...prev, north: e.target.value }))}
                          className={getInputClassName("cursor-pointer")}
                          style={{ appearance: 'auto', WebkitAppearance: 'auto' } as any}
                        />
                      ) : (
                        getFieldViewValue(formData.north)
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">South</label>
                      {isEditMode ? (
                        <input
                          type="number"
                          step="any"
                          value={formData.south}
                          onChange={(e) => setFormData(prev => ({ ...prev, south: e.target.value }))}
                          className={getInputClassName("cursor-pointer")}
                          style={{ appearance: 'auto', WebkitAppearance: 'auto' } as any}
                        />
                      ) : (
                        getFieldViewValue(formData.south)
                      )}
                    </div>
                  </div>

                  {/* Second row: 3 fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Geometry Type</label>
                      {isEditMode ? (
                        <Select
                          value={formData.geometryType}
                          onValueChange={(val) => setFormData(prev => ({ ...prev, geometryType: val }))}
                        >
                          <SelectTrigger className="h-9 w-full border-border/70 bg-card/65 dark:bg-card/25 text-[13px] font-semibold text-foreground">
                            <SelectValue placeholder="Select geometry type..." />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/60">
                            <SelectItem value="Point" className="cursor-pointer text-[13px]">Point</SelectItem>
                            <SelectItem value="Multipoint" className="cursor-pointer text-[13px]">Multipoint</SelectItem>
                            <SelectItem value="Polyline" className="cursor-pointer text-[13px]">Polyline</SelectItem>
                            <SelectItem value="Polygon" className="cursor-pointer text-[13px]">Polygon</SelectItem>
                            <SelectItem value="MultiPatch" className="cursor-pointer text-[13px]">MultiPatch</SelectItem>
                            <SelectItem value="Raster" className="cursor-pointer text-[13px]">Raster</SelectItem>
                            <SelectItem value="Table" className="cursor-pointer text-[13px]">Table</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getFieldViewValue(formData.geometryType)
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Geographic Extent</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.geographicExtent}
                          onChange={(e) => setFormData(prev => ({ ...prev, geographicExtent: e.target.value }))}
                          className={getInputClassName()}
                        />
                      ) : (
                        getFieldViewValue(formData.geographicExtent)
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Scale Denominator</label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={formData.scale}
                          onChange={(e) => setFormData(prev => ({ ...prev, scale: e.target.value }))}
                          className={getInputClassName()}
                        />
                      ) : (
                        getFieldViewValue(formData.scale)
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 8. Maintenance */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, maintenance: !prev.maintenance }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.maintenance && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <RefreshCw className="h-4.5 w-4.5 text-orange-500" /> Maintenance
                </h3>
                {isEditMode && (openSections.maintenance ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.maintenance && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Update Frequency <span className="text-destructive">*</span>
                    </label>
                    {isEditMode ? (
                      <Select
                        value={formData.updateFrequency}
                        onValueChange={(val) => setFormData(prev => ({ ...prev, updateFrequency: val }))}
                      >
                        <SelectTrigger className="h-9 w-full border-border/70 bg-card/65 dark:bg-card/25 text-[13px] font-semibold text-foreground">
                          <SelectValue placeholder="Select frequency..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/60 max-h-60 overflow-y-auto">
                          <SelectItem value="Continual" className="cursor-pointer text-[13px]">Continual</SelectItem>
                          <SelectItem value="Daily" className="cursor-pointer text-[13px]">Daily</SelectItem>
                          <SelectItem value="Weekly" className="cursor-pointer text-[13px]">Weekly</SelectItem>
                          <SelectItem value="Fortnightly" className="cursor-pointer text-[13px]">Fortnightly</SelectItem>
                          <SelectItem value="Monthly" className="cursor-pointer text-[13px]">Monthly</SelectItem>
                          <SelectItem value="Quarterly" className="cursor-pointer text-[13px]">Quarterly</SelectItem>
                          <SelectItem value="Biannually" className="cursor-pointer text-[13px]">Biannually</SelectItem>
                          <SelectItem value="Annually" className="cursor-pointer text-[13px]">Annually</SelectItem>
                          <SelectItem value="As Needed" className="cursor-pointer text-[13px]">As Needed</SelectItem>
                          <SelectItem value="Irregular" className="cursor-pointer text-[13px]">Irregular</SelectItem>
                          <SelectItem value="Not Planned" className="cursor-pointer text-[13px]">Not Planned</SelectItem>
                          <SelectItem value="Unknown" className="cursor-pointer text-[13px]">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getFieldViewValue(formData.updateFrequency)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Custom Frequency</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.customFrequency}
                        onChange={(e) => setFormData(prev => ({ ...prev, customFrequency: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.customFrequency)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Next Update</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.nextUpdate}
                        onChange={(e) => setFormData(prev => ({ ...prev, nextUpdate: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.nextUpdate)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Last Updated</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.lastUpdated}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastUpdated: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.lastUpdated)
                    )}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Review Date</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.reviewDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, reviewDate: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.reviewDate)
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 9. Spatial Reference — Reference System */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, spatialReference: !prev.spatialReference }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.spatialReference && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <Globe className="h-4.5 w-4.5 text-blue-500" /> Spatial Reference — Reference System
                </h3>
                {isEditMode && (openSections.spatialReference ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.spatialReference && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Code <span className="text-destructive">*</span>
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.spatialCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, spatialCode: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.spatialCode)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">
                      Code Name <span className="text-destructive">*</span>
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.spatialCodeName}
                        onChange={(e) => setFormData(prev => ({ ...prev, spatialCodeName: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.spatialCodeName)
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 10. Quality */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, quality: !prev.quality }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.quality && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <Shield className="h-4.5 w-4.5 text-emerald-500" /> Quality
                </h3>
                {isEditMode && (openSections.quality ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.quality && (
                <div className="p-5 grid grid-cols-1 gap-4 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Data Quality</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.dataQuality}
                        onChange={(e) => setFormData(prev => ({ ...prev, dataQuality: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.dataQuality)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Accuracy Notes</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.accuracyNotes}
                        onChange={(e) => setFormData(prev => ({ ...prev, accuracyNotes: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.accuracyNotes)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Validation Notes</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.validationNotes}
                        onChange={(e) => setFormData(prev => ({ ...prev, validationNotes: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.validationNotes)
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 11. Lineage / Data Source */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, lineageDataSource: !prev.lineageDataSource }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.lineageDataSource && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <Database className="h-4.5 w-4.5 text-emerald-500" /> Lineage / Data Source
                </h3>
                {isEditMode && (openSections.lineageDataSource ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.lineageDataSource && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Source</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.lineageSource}
                        onChange={(e) => setFormData(prev => ({ ...prev, lineageSource: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.lineageSource)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Medium Name</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.lineageMedium}
                        onChange={(e) => setFormData(prev => ({ ...prev, lineageMedium: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.lineageMedium)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Source Reference System</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.lineageRefSystem}
                        onChange={(e) => setFormData(prev => ({ ...prev, lineageRefSystem: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.lineageRefSystem)
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 12. Fields — Entity and Attribute Information */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, fieldsInfo: !prev.fieldsInfo }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.fieldsInfo && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <List className="h-4.5 w-4.5 text-slate-500" /> Fields — Entity and Attribute Information
                </h3>
                {isEditMode && (openSections.fieldsInfo ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.fieldsInfo && (
                <div className="p-5 grid grid-cols-1 gap-4 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Entity and Attribute Information</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.entityAttribute}
                        onChange={(e) => setFormData(prev => ({ ...prev, entityAttribute: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.entityAttribute)
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 13. Standards & Compliance */}
            <div className="border border-border/60 rounded-xl overflow-visible bg-card/10 dark:bg-card/5">
              <div
                onClick={() => setOpenSections(prev => ({ ...prev, standardsCompliance: !prev.standardsCompliance }))}
                className={cn(
                  "bg-primary/5 dark:bg-primary/10 border-b border-border/40 px-4 py-3 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-primary/8 dark:hover:bg-primary/15 rounded-t-xl",
                  !openSections.standardsCompliance && "rounded-b-xl"
                )}
              >
                <h3 className="text-[14px] font-extrabold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-blue-500" /> Standards & Compliance
                </h3>
                {isEditMode && (openSections.standardsCompliance ? (
                  <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />
                ))}
              </div>

              {openSections.standardsCompliance && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Metadata Standard</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.metaStandard}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaStandard: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.metaStandard)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Owner</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.metaOwner}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaOwner: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.metaOwner)
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-bold text-muted-foreground/90 uppercase tracking-wider block">Source Type</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={formData.metaSourceType}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaSourceType: e.target.value }))}
                        className={getInputClassName()}
                      />
                    ) : (
                      getFieldViewValue(formData.metaSourceType)
                    )}
                  </div>
                </div>
              )}
            </div>
            {isEditMode && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40 mt-6 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setIsEditMode(false);
                  }}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-[13px] font-bold text-foreground hover:bg-muted/10 transition cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSaveMetadata();
                    setIsEditMode(false);
                  }}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 px-4 text-[13px] font-bold text-white transition cursor-pointer shadow-soft"
                >
                  Save Metadata
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Versions Tab - Only shown when activeViewTab is versions and NOT in edit mode */
          <div className="bg-card/20 border border-border/50 rounded-xl p-6 shadow-soft space-y-5">
            <div className="space-y-1">
              <h3 className="text-[15px] font-extrabold text-foreground">Version History</h3>
              <p className="text-[12px] text-muted-foreground/80">8 versions - a version is captured on every save - supports governance and auditability</p>
            </div>
            
            <div className="relative border-l-2 border-border/60 pl-5 ml-2.5 space-y-6">
              {/* v8 */}
              <div className="relative">
                <span className="absolute -left-7.5 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 ring-4 ring-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-[13px] font-black text-foreground">v8</div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10.5px] font-extrabold border border-cyan-500/20">Current</span>
                </div>
                <div className="text-[12.5px] text-foreground/90 mt-1">Updated purpose ar, tags ar</div>
                <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground/75 mt-1">
                  <Clock className="h-3 w-3" /> 21 Jul 2026, 11:16
                  <span>•</span>
                  <User className="h-3 w-3" /> by portal
                </div>
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                    <span>Completeness at this version</span>
                    <span className="text-foreground">81%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "81%" }} />
                  </div>
                </div>
              </div>

              {/* v7 */}
              <div className="relative">
                <span className="absolute -left-7.5 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-border/40 ring-4 ring-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45" />
                </span>
                <div className="text-[13px] font-black text-foreground">v7</div>
                <div className="text-[12.5px] text-foreground/90 mt-1">Updated title ar</div>
                <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground/75 mt-1">
                  <Clock className="h-3 w-3" /> 21 Jul 2026, 11:16
                  <span>•</span>
                  <User className="h-3 w-3" /> by portal
                </div>
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                    <span>Completeness at this version</span>
                    <span className="text-foreground">81%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "81%" }} />
                  </div>
                </div>
              </div>

              {/* v6 */}
              <div className="relative">
                <span className="absolute -left-7.5 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-border/40 ring-4 ring-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45" />
                </span>
                <div className="text-[13px] font-black text-foreground">v6</div>
                <div className="text-[12.5px] text-foreground/90 mt-1">Updated title, supported languages, title ar</div>
                <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground/75 mt-1">
                  <Clock className="h-3 w-3" /> 20 Jul 2026, 15:53
                  <span>•</span>
                  <User className="h-3 w-3" /> by portal
                </div>
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                    <span>Completeness at this version</span>
                    <span className="text-foreground">81%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "81%" }} />
                  </div>
                </div>
              </div>

              {/* v5 */}
              <div className="relative">
                <span className="absolute -left-7.5 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-border/40 ring-4 ring-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45" />
                </span>
                <div className="text-[13px] font-black text-foreground">v5</div>
                <div className="text-[12.5px] text-foreground/90 mt-1">Updated contact phone</div>
                <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground/75 mt-1">
                  <Clock className="h-3 w-3" /> 20 Jul 2026, 15:20
                  <span>•</span>
                  <User className="h-3 w-3" /> by portal
                </div>
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                    <span>Completeness at this version</span>
                    <span className="text-foreground">81%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "81%" }} />
                  </div>
                </div>
              </div>

              {/* v4 */}
              <div className="relative">
                <span className="absolute -left-7.5 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-border/40 ring-4 ring-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45" />
                </span>
                <div className="text-[13px] font-black text-foreground">v4</div>
                <div className="text-[12.5px] text-foreground/90 mt-1">Updated contact role</div>
                <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground/75 mt-1">
                  <Clock className="h-3 w-3" /> 20 Jul 2026, 14:56
                  <span>•</span>
                  <User className="h-3 w-3" /> by portal
                </div>
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                    <span>Completeness at this version</span>
                    <span className="text-foreground">82%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "82%" }} />
                  </div>
                </div>
              </div>

              {/* v3 */}
              <div className="relative">
                <span className="absolute -left-7.5 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-border/40 ring-4 ring-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45" />
                </span>
                <div className="text-[13px] font-black text-foreground">v3</div>
                <div className="text-[12.5px] text-foreground/90 mt-1">Updated x min, x max, y min, y max</div>
                <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground/75 mt-1">
                  <Clock className="h-3 w-3" /> 20 Jul 2026, 11:44
                  <span>•</span>
                  <User className="h-3 w-3" /> by portal
                </div>
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                    <span>Completeness at this version</span>
                    <span className="text-foreground">82%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "82%" }} />
                  </div>
                </div>
              </div>

              {/* v2 */}
              <div className="relative">
                <span className="absolute -left-7.5 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-border/40 ring-4 ring-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45" />
                </span>
                <div className="text-[13px] font-black text-foreground">v2</div>
                <div className="text-[12.5px] text-foreground/90 mt-1">Updated contact phone, scale, geographic extent, bounding box +9 more</div>
                <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground/75 mt-1">
                  <Clock className="h-3 w-3" /> 20 Jul 2026, 08:57
                  <span>•</span>
                  <User className="h-3 w-3" /> by portal
                </div>
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                    <span>Completeness at this version</span>
                    <span className="text-foreground">82%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "82%" }} />
                  </div>
                </div>
              </div>

              {/* v1 */}
              <div className="relative">
                <span className="absolute -left-7.5 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-border/40 ring-4 ring-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/45" />
                </span>
                <div className="text-[13px] font-black text-foreground">1</div>
                <div className="text-[12.5px] text-foreground/90 mt-1">Imported from data layer #165</div>
                <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground/75 mt-1">
                  <Clock className="h-3 w-3" /> 14 Jul 2026, 05:30
                  <span>•</span>
                  <User className="h-3 w-3" /> by seed
                </div>
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground/75 uppercase tracking-wider">
                    <span>Completeness at this version</span>
                    <span className="text-foreground">0%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full bg-blue-500/20 rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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
          <div className="relative flex-1 min-w-[200px]">
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
          <div className="flex items-center gap-2 relative">
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
        <div className="table-container-scrollable overflow-x-auto relative rounded-xl border border-border/65">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className={cn("border-b border-border/70 text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground/90", isLight ? "bg-slate-50" : "bg-card/35")}>

                
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

                <th className="py-3 px-4 w-[160px] text-right table-sticky-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/55 text-[13.5px]">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-card/25 transition-colors group"
                  >


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
                    <td className="py-3.5 px-4 text-right table-sticky-actions bg-card group-hover:bg-muted/55 transition-colors">
                      <div className="flex items-center justify-end gap-2.5">
                        <button 
                          onClick={() => {
                            setViewingRecord(rec);
                            setIsEditMode(false);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition cursor-pointer" 
                          title="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            setViewingRecord(rec);
                            setIsEditMode(true);
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
