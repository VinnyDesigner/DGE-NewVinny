import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Columns3,
  Download,
  Layers,
  Plus,
  Search,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  Trash2,
  Pencil,
  Eye,
  Globe2,
  FileText,
  AlertCircle,
  Database,
  Tag,
  Share2,
  Check,
  X,
  Briefcase,
  GitBranch,
  Lock,
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

const PolygonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" />
  </svg>
);

const PolylineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 16 4-6 5 7 5-11 4 5" />
  </svg>
);

export const Route = createFileRoute("/_app/data-management/layers")({
  head: () => ({
    meta: [
      { title: "Data Layers — Data Automation Studio" },
      { name: "description", content: "Register and manage spatial data layers — names, classification, schema mapping, sensitivity, and attribute-level access control." },
    ],
  }),
  component: LayersPage,
});

interface DataLayerItem {
  alias: string;
  dbName: string;
  entity: string;
  geometry: string;
  sensitivity: string;
  status: string;
  layerType: string;
  schema: string;
  remarks: string;
  onboardedDate: string;
}

const STORAGE_KEY_LAYERS = "dge_layers_data";

const initialLayers: DataLayerItem[] = [
  {
    alias: "L_DMAUDM_DISTRICT",
    dbName: "L_DMAUDM_DISTRICT",
    entity: "ADDA",
    geometry: "Polygon",
    sensitivity: "Open Data",
    status: "Active",
    layerType: "Vector",
    schema: "DMT dmt",
    remarks: "Not provided",
    onboardedDate: "20/06/2026",
  },
  {
    alias: "L_DMAUDM_DISTRICTBOUNDARY",
    dbName: "L_DMAUDM_DISTRICTBOUNDARY",
    entity: "ADDA",
    geometry: "Polyline",
    sensitivity: "Open Data",
    status: "Active",
    layerType: "Vector",
    schema: "DMT dmt",
    remarks: "Not provided",
    onboardedDate: "20/06/2026",
  },
  {
    alias: "L_DMAUDM_MUNICIPALITY",
    dbName: "L_DMAUDM_MUNICIPALITY",
    entity: "ADDA",
    geometry: "Polygon",
    sensitivity: "Open Data",
    status: "Active",
    layerType: "Vector",
    schema: "DMT dmt",
    remarks: "Not provided",
    onboardedDate: "20/06/2026",
  },
  {
    alias: "L_DMAUDM_MUNICIPALITYBOUNDARY",
    dbName: "L_DMAUDM_MUNICIPALITYBOUNDARY",
    entity: "ADDA",
    geometry: "Polyline",
    sensitivity: "Open Data",
    status: "Active",
    layerType: "Vector",
    schema: "DMT dmt",
    remarks: "Not provided",
    onboardedDate: "20/06/2026",
  },
];

const columns = [
  "Layer Name",
  "DB Layer Name",
  "Entity",
  "Geometry",
  "Sensitivity",
  "Onboarded Date",
  "ACTIONS",
];

const ENTITIES = [
  { code: "ADDA", name: "Abu Dhabi Digital Authority" },
  { code: "ADDC", name: "Abu Dhabi Distribution Company" },
  { code: "ADHA", name: "Abu Dhabi Housing Authority" },
  { code: "DGE", name: "Dept of Government Enablement" },
  { code: "DMT", name: "Department of Municipalities" },
  { code: "EAD", name: "Environment Agency Abu Dhabi" },
];

const GEOMETRIES = ["Point", "Line", "Polygon", "Multipoint", "Raster"];
const LAYER_TYPES = ["Vector", "Raster", "Point Cloud", "Table (Non-Spatial)"];
const SENSITIVITIES = ["Open Data", "Restricted", "Sensitive", "Secured", "Secret"];
const STATUSES = ["Active", "Inactive"];

function LayersPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Dynamic layers list state
  const [layersList, setLayersList] = useState<DataLayerItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_LAYERS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.error("Failed to parse saved layers:", e);
        }
      }
    }
    return initialLayers;
  });

  const saveLayers = (newList: DataLayerItem[]) => {
    setLayersList(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_LAYERS, JSON.stringify(newList));
    }
  };

  // Navigation state
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedLayerNames, setSelectedLayerNames] = useState<string[]>([]);
  const [isColumnsMenuOpen, setIsColumnsMenuOpen] = useState(false);
  const [viewingLayerDbName, setViewingLayerDbName] = useState<string | null>(null);
  const [editingLayerDbName, setEditingLayerDbName] = useState<string | null>(null);
  const [layerTab, setLayerTab] = useState("overview");
  const [editTab, setEditTab] = useState("info");
  const [deleteLayerDbName, setDeleteLayerDbName] = useState<string | null>(null);

  const [editAlias, setEditAlias] = useState("");
  const [editAgencyName, setEditAgencyName] = useState("");
  const [editRemarks, setEditRemarks] = useState("");
  const [editSensitivity, setEditSensitivity] = useState("");
  const [editGeometry, setEditGeometry] = useState("");
  const [editStatus, setEditStatus] = useState("Active");
  const [editPublished, setEditPublished] = useState(false);

  useEffect(() => {
    if (editingLayerDbName) {
      const selected = layersList.find(l => l.dbName === editingLayerDbName);
      if (selected) {
        setEditAlias(selected.alias);
        setEditAgencyName(selected.alias);
        setEditRemarks(selected.remarks || "Not provided");
        setEditSensitivity(selected.sensitivity);
        setEditGeometry(selected.geometry);
        setEditStatus(selected.status);
        setEditPublished(selected.sensitivity === "Open Data");
      }
    }
  }, [editingLayerDbName, layersList]);
  
  const [visibleCols, setVisibleCols] = useState({
    layerName: true,
    dbLayerName: true,
    entity: true,
    type: false,
    geometry: true,
    coverage: false,
    sensitivity: true,
    onboardedDate: true,
  });

  const activeHeaders = useMemo(() => {
    const list: string[] = ["Layer Name"];
    if (visibleCols.dbLayerName) list.push("DB Layer Name");
    if (visibleCols.entity) list.push("Entity");
    if (visibleCols.type) list.push("Type");
    if (visibleCols.geometry) list.push("Geometry");
    if (visibleCols.coverage) list.push("Coverage");
    if (visibleCols.sensitivity) list.push("Sensitivity");
    if (visibleCols.onboardedDate) list.push("Onboarded Date");
    list.push("ACTIONS");
    return list;
  }, [visibleCols]);



  // Filters state
  const [query, setQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all-entities");
  const [sensitivityFilter, setSensitivityFilter] = useState("all-sensitivity");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync pagination index with active page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, entityFilter, sensitivityFilter, statusFilter]);

  // Form Fields state
  const [formEntity, setFormEntity] = useState("");
  const [formSchema, setFormSchema] = useState("");
  const [formDbName, setFormDbName] = useState("");
  const [formAlias, setFormAlias] = useState("");
  const [formAgencyLayerName, setFormAgencyLayerName] = useState("");
  const [formLayerType, setFormLayerType] = useState("");
  const [formGeometry, setFormGeometry] = useState("");
  const [formCoverageArea, setFormCoverageArea] = useState("");
  const [formSensitivity, setFormSensitivity] = useState("");
  const [formStatus, setFormStatus] = useState("Active");
  const [formRemarks, setFormRemarks] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Dynamic Schema options based on selected Entity
  const schemaOptions = useMemo(() => {
    if (!formEntity || formEntity === "-- Select entity --") return [];
    return [
      `${formEntity}_SPATIAL_DB`,
      `${formEntity}_SCH_CORE`,
      `${formEntity}_STAGING_GEO`,
      `${formEntity}_ANALYTICS`,
    ];
  }, [formEntity]);

  // Sync schema resets when Entity changes
  useEffect(() => {
    setFormSchema("");
  }, [formEntity]);

  const handleResetFilters = () => {
    setQuery("");
    setEntityFilter("all-entities");
    setSensitivityFilter("all-sensitivity");
    setStatusFilter("all-statuses");
    setCurrentPage(1);
  };

  // Filtered layers logic
  const filteredLayers = useMemo(() => {
    return layersList.filter((layer) => {
      // Query check
      if (query) {
        const q = query.toLowerCase();
        const matchesQuery =
          layer.alias.toLowerCase().includes(q) ||
          layer.dbName.toLowerCase().includes(q) ||
          layer.entity.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      // Entity check
      if (entityFilter !== "all-entities") {
        if (layer.entity.toLowerCase() !== entityFilter.toLowerCase()) return false;
      }
      // Sensitivity check
      if (sensitivityFilter !== "all-sensitivity") {
        if (layer.sensitivity.toLowerCase() !== sensitivityFilter.toLowerCase()) return false;
      }
      // Status check
      if (statusFilter !== "all-statuses") {
        if (layer.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }
      return true;
    });
  }, [layersList, query, entityFilter, sensitivityFilter, statusFilter]);

  const paginatedLayers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLayers.slice(start, start + pageSize);
  }, [filteredLayers, currentPage, pageSize]);

  // Metrics counters
  const metrics = useMemo(() => {
    const total = layersList.length;
    const activeCount = layersList.filter((l) => l.status === "Active").length;
    const publishedCount = layersList.filter((l) => l.sensitivity === "Open Data").length;
    const confidentialCount = layersList.filter((l) => l.sensitivity === "Sensitive" || l.sensitivity === "Restricted" || l.sensitivity === "Secured" || l.sensitivity === "Secret").length;

    return [
      { label: "Total Layers", value: String(total), hint: "All registered", icon: Layers, tone: "primary" },
      { label: "Active", value: String(activeCount), hint: "Accepting deliveries", icon: CheckCircle2, tone: "success" },
      { label: "Published", value: String(publishedCount), hint: "Publicly accessible", icon: Globe2, tone: "info" },
      { label: "By Classification", value: String(confidentialCount), hint: "Restricted or higher", icon: ShieldCheck, tone: "secondary" },
    ] as const;
  }, [layersList]);

  // Form validations
  const errors = useMemo(() => {
    return {
      entity: !formEntity || formEntity === "-- Select entity --",
      schema: !formSchema || formSchema === "Select an entity first",
      dbName: !formDbName.trim(),
      alias: !formAlias.trim(),
      agencyName: !formAgencyLayerName.trim(),
      layerType: !formLayerType || formLayerType === "-- Select type --",
      geometry: !formGeometry || formGeometry === "-- Select geometry --",
      sensitivity: !formSensitivity || formSensitivity === "-- Select sensitivity --",
    };
  }, [
    formEntity,
    formSchema,
    formDbName,
    formAlias,
    formAgencyLayerName,
    formLayerType,
    formGeometry,
    formSensitivity,
  ]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    const hasErrors = Object.values(errors).some((err) => err);
    if (hasErrors) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    const newLayer: DataLayerItem = {
      alias: formAlias.trim(),
      dbName: formDbName.trim(),
      entity: formEntity,
      geometry: formGeometry,
      sensitivity: formSensitivity,
      status: formStatus,
      layerType: formLayerType,
      schema: formSchema,
      remarks: formRemarks.trim(),
      onboardedDate: formattedDate,
    };

    if (layersList.some((l) => l.dbName === newLayer.dbName)) {
      toast.error(`Database layer name "${newLayer.dbName}" is already registered.`);
      return;
    }

    const updated = [newLayer, ...layersList];
    saveLayers(updated);
    toast.success(`Data layer "${newLayer.alias}" registered successfully!`);

    // Reset Form
    setFormEntity("");
    setFormSchema("");
    setFormDbName("");
    setFormAlias("");
    setFormAgencyLayerName("");
    setFormLayerType("");
    setFormGeometry("");
    setFormCoverageArea("");
    setFormSensitivity("");
    setFormStatus("Active");
    setFormRemarks("");
    setHasSubmitted(false);
    setIsRegistering(false);
  };

  if (isRegistering) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb link */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80">
          <button
            onClick={() => {
              setHasSubmitted(false);
              setIsRegistering(false);
            }}
            className="hover:text-foreground transition cursor-pointer flex items-center gap-1.5"
          >
            <Layers className="h-3.5 w-3.5" /> Data Layers
          </button>
          <span>&gt;</span>
          <span className="text-foreground">Register Layer</span>
        </div>

        {/* Full Card Container */}
        <div className="bg-card/30 border border-border/50 rounded-xl shadow-soft flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-3 border-b border-border/50 bg-elevated/40 rounded-t-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-accent">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-foreground">Register a new layer</h2>
              <p className="text-[12px] text-muted-foreground">Register a spatial data layer inside the system</p>
            </div>
          </div>

          {/* Form Content Area */}
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-5 bg-surface/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Entity Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Entity <span className="text-danger ml-0.5">*</span>
                </label>
                <Select value={formEntity} onValueChange={setFormEntity}>
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                    <SelectValue placeholder="-- Select entity --" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="-- Select entity --" disabled className="cursor-pointer text-[13px] text-muted-foreground">-- Select entity --</SelectItem>
                    {ENTITIES.map((ent) => (
                      <SelectItem key={ent.code} value={ent.code} className="cursor-pointer text-[13px]">
                        {ent.name} ({ent.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasSubmitted && errors.entity && (
                  <span className="text-red-500 text-[11px] font-bold mt-1 block">Entity is required.</span>
                )}
              </div>

              {/* Data Schema Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Data Schema <span className="text-danger ml-0.5">*</span>
                </label>
                <Select
                  value={formSchema}
                  onValueChange={setFormSchema}
                  disabled={!formEntity || formEntity === "-- Select entity --"}
                >
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer disabled:opacity-50">
                    <SelectValue placeholder={formEntity ? "-- Select schema --" : "Select an entity first"} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="Select an entity first" disabled className="cursor-pointer text-[13px] text-muted-foreground">Select an entity first</SelectItem>
                    {schemaOptions.map((sch) => (
                      <SelectItem key={sch} value={sch} className="cursor-pointer text-[13px]">
                        {sch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasSubmitted && errors.schema && (
                  <span className="text-red-500 text-[11px] font-bold mt-1 block">Schema is required.</span>
                )}
              </div>

              {/* Layer DB Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Layer DB Name <span className="text-danger ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. dat_parcel_boundary_as"
                  value={formDbName}
                  onChange={(e) => setFormDbName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                {hasSubmitted && errors.dbName && (
                  <span className="text-red-500 text-[11px] font-bold mt-1 block">Db name is required.</span>
                )}
              </div>

              {/* Alias */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Alias <span className="text-danger ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Alias"
                  value={formAlias}
                  onChange={(e) => setFormAlias(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                {hasSubmitted && errors.alias && (
                  <span className="text-red-500 text-[11px] font-bold mt-1 block">Alias is required.</span>
                )}
              </div>

              {/* Agency Layer Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Agency Layer Name <span className="text-danger ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Agency Layer Name"
                  value={formAgencyLayerName}
                  onChange={(e) => setFormAgencyLayerName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                {hasSubmitted && errors.agencyName && (
                  <span className="text-red-500 text-[11px] font-bold mt-1 block">Agency name is required.</span>
                )}
              </div>

              {/* Layer Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Layer Type <span className="text-danger ml-0.5">*</span>
                </label>
                <Select value={formLayerType} onValueChange={setFormLayerType}>
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                    <SelectValue placeholder="-- Select type --" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="-- Select type --" disabled className="cursor-pointer text-[13px] text-muted-foreground">-- Select type --</SelectItem>
                    {LAYER_TYPES.map((lt) => (
                      <SelectItem key={lt} value={lt} className="cursor-pointer text-[13px]">
                        {lt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasSubmitted && errors.layerType && (
                  <span className="text-red-500 text-[11px] font-bold mt-1 block">Layer type is required.</span>
                )}
              </div>

              {/* Geometry */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Geometry <span className="text-danger ml-0.5">*</span>
                </label>
                <Select value={formGeometry} onValueChange={setFormGeometry}>
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                    <SelectValue placeholder="-- Select geometry --" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="-- Select geometry --" disabled className="cursor-pointer text-[13px] text-muted-foreground">-- Select geometry --</SelectItem>
                    {GEOMETRIES.map((g) => (
                      <SelectItem key={g} value={g} className="cursor-pointer text-[13px]">
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasSubmitted && errors.geometry && (
                  <span className="text-red-500 text-[11px] font-bold mt-1 block">Geometry is required.</span>
                )}
              </div>

              {/* Coverage Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Coverage Area
                </label>
                <Select value={formCoverageArea} onValueChange={setFormCoverageArea}>
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                    <SelectValue placeholder="-- None --" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="-- None --" className="cursor-pointer text-[13px]">-- None --</SelectItem>
                    <SelectItem value="Abu Dhabi Emirate" className="cursor-pointer text-[13px]">Abu Dhabi Emirate</SelectItem>
                    <SelectItem value="Al Ain Region" className="cursor-pointer text-[13px]">Al Ain Region</SelectItem>
                    <SelectItem value="Al Dhafra Region" className="cursor-pointer text-[13px]">Al Dhafra Region</SelectItem>
                    <SelectItem value="UAE National" className="cursor-pointer text-[13px]">UAE National</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sensitivity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Sensitivity <span className="text-danger ml-0.5">*</span>
                </label>
                <Select value={formSensitivity} onValueChange={setFormSensitivity}>
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                    <SelectValue placeholder="-- Select sensitivity --" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="-- Select sensitivity --" disabled className="cursor-pointer text-[13px] text-muted-foreground">-- Select sensitivity --</SelectItem>
                    {SENSITIVITIES.map((s) => (
                      <SelectItem key={s} value={s} className="cursor-pointer text-[13px]">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasSubmitted && errors.sensitivity && (
                  <span className="text-red-500 text-[11px] font-bold mt-1 block">Sensitivity is required.</span>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Status
                </label>
                <Select value={formStatus} onValueChange={setFormStatus}>
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                    <SelectValue placeholder="Active" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status} className="cursor-pointer text-[13px]">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Remarks (Full width) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                Remarks
              </label>
              <textarea
                placeholder="Remarks"
                rows={4}
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 p-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
              />
            </div>

            {/* Form Footer Action Buttons */}
            <div className="flex justify-end gap-3 border-t border-border/50 bg-elevated/20 pt-5 mt-4">
              <button
                type="button"
                onClick={() => {
                  setFormEntity("");
                  setFormSchema("");
                  setFormDbName("");
                  setFormAlias("");
                  setFormAgencyLayerName("");
                  setFormLayerType("");
                  setFormGeometry("");
                  setFormCoverageArea("");
                  setFormSensitivity("");
                  setFormStatus("Active");
                  setFormRemarks("");
                  setHasSubmitted(false);
                  setIsRegistering(false);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-4 text-[13.5px] font-semibold text-foreground/80 hover:text-foreground cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13.5px] font-semibold text-primary-foreground hover:bg-primary/95 transition cursor-pointer shadow-soft"
              >
                Create Layer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (editingLayerDbName) {
    const selectedLayer = layersList.find((l) => l.dbName === editingLayerDbName) || layersList[0];

    const handleEditSave = (e: React.FormEvent) => {
      e.preventDefault();
      
      const updated = layersList.map((l) => {
        if (l.dbName === editingLayerDbName) {
          return {
            ...l,
            alias: editAlias.trim(),
            remarks: editRemarks.trim(),
            sensitivity: editSensitivity,
            geometry: editGeometry,
            status: editStatus,
          };
        }
        return l;
      });
      
      saveLayers(updated);
      toast.success("Layer changes saved successfully.");
      setViewingLayerDbName(editingLayerDbName);
      setEditingLayerDbName(null);
    };

    return (
      <div className="space-y-6">
        {/* Header Ribbon card */}
        <Surface className="!p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white shadow-soft">
                <Database className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-[17px] font-black text-foreground">Edit Data Layer</h2>
                <span className="text-[11px] font-bold text-muted-foreground block uppercase tracking-wide">
                  Editing {selectedLayer?.alias || editingLayerDbName}
                </span>
              </div>
            </div>

            {/* Cancel & Save Action Buttons */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                type="button"
                onClick={() => {
                  setViewingLayerDbName(editingLayerDbName);
                  setEditingLayerDbName(null);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted px-4 text-xs font-bold text-foreground cursor-pointer transition-colors shadow-soft"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
              >
                <Check className="h-3.5 w-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </Surface>

        {/* Entity and Status Fields block */}
        <Surface className="!p-5 space-y-4">
          <div className="flex items-center gap-3.5 pb-3 border-b border-border/20">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">
              AD
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Abu Dhabi Digital Authority</div>
              <div className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider">ADDA</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {/* Entity Select dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                Entity <span className="text-danger ml-0.5">*</span>
              </label>
              <Select value={selectedLayer?.entity || "ADDA"} disabled>
                <SelectTrigger className="h-9 w-full border-border/60 bg-muted/30 dark:bg-muted/10 text-[13px] text-foreground font-semibold cursor-not-allowed">
                  <SelectValue placeholder="ADDA — Abu Dhabi Digital Authority" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/60">
                  <SelectItem value="ADDA">ADDA — Abu Dhabi Digital Authority</SelectItem>
                  <SelectItem value="ADDC">ADDC — Abu Dhabi Distribution Company</SelectItem>
                  <SelectItem value="ADHA">ADHA — Abu Dhabi Housing Authority</SelectItem>
                  <SelectItem value="DGE">DGE — Dept of Government Enablement</SelectItem>
                  <SelectItem value="DMT">DMT — Department of Municipalities</SelectItem>
                  <SelectItem value="EAD">EAD — Environment Agency Abu Dhabi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Select dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                Status <span className="text-danger ml-0.5">*</span>
              </label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground cursor-pointer focus:ring-1 focus:ring-primary/40">
                  <SelectValue placeholder="Active" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/60">
                  <SelectItem value="Active" className="cursor-pointer">Active</SelectItem>
                  <SelectItem value="Inactive" className="cursor-pointer">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Surface>

        {/* Tab selector inside form */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-px text-xs font-bold select-none">
          <button
            onClick={() => setEditTab("info")}
            className={cn(
              "px-4 py-2.5 border-b-2 -mb-px transition-colors cursor-pointer",
              editTab === "info"
                ? "border-blue-500 text-blue-500 font-extrabold"
                : "border-transparent text-muted-foreground/85 hover:text-foreground"
            )}
          >
            1 Layer Info
          </button>
          <button
            onClick={() => setEditTab("attributes")}
            className={cn(
              "px-4 py-2.5 border-b-2 -mb-px transition-colors cursor-pointer",
              editTab === "attributes"
                ? "border-blue-500 text-blue-500 font-extrabold"
                : "border-transparent text-muted-foreground/85 hover:text-foreground"
            )}
          >
            2 Attributes (17)
          </button>
        </div>

        {/* Dynamic Tab Edit Contents */}
        {editTab === "info" ? (
          <Surface className="!p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              
              {/* Alias Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Alias Layer Name <span className="text-danger ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={editAlias}
                  onChange={(e) => setEditAlias(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              {/* Agency Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Agency Layer Name <span className="text-danger ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={editAgencyName}
                  onChange={(e) => setEditAgencyName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              {/* DB Layer Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  DB Layer Name <span className="text-danger ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={selectedLayer?.dbName}
                  disabled
                  className="h-9 w-full rounded-lg border border-border/40 bg-muted/30 dark:bg-muted/10 px-3 text-[13px] text-muted-foreground cursor-not-allowed font-mono font-medium"
                />
              </div>

              {/* Coordinate System */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Coordinate System
                </label>
                <input
                  type="text"
                  value="WGS 1984"
                  disabled
                  className="h-9 w-full rounded-lg border border-border/40 bg-muted/30 dark:bg-muted/10 px-3 text-[13px] text-muted-foreground cursor-not-allowed font-medium"
                />
              </div>

              {/* Layer Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Layer Type <span className="text-danger ml-0.5">*</span>
                </label>
                <Select value={selectedLayer?.layerType} disabled>
                  <SelectTrigger className="h-9 w-full border-border/40 bg-muted/30 dark:bg-muted/10 text-[13px] text-muted-foreground cursor-not-allowed">
                    <SelectValue placeholder="Vector" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="Vector">Vector</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Layer Sensitivity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Layer Sensitivity <span className="text-danger ml-0.5">*</span>
                </label>
                <Select value={editSensitivity} onValueChange={setEditSensitivity}>
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground cursor-pointer focus:ring-1 focus:ring-primary/40">
                    <SelectValue placeholder="Open Data" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="Open Data" className="cursor-pointer">Open Data</SelectItem>
                    <SelectItem value="Restricted" className="cursor-pointer">Restricted</SelectItem>
                    <SelectItem value="Sensitive" className="cursor-pointer">Sensitive</SelectItem>
                    <SelectItem value="Confidential" className="cursor-pointer">Confidential</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Geometry Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Layer Geometry Type <span className="text-danger ml-0.5">*</span>
                </label>
                <Select value={editGeometry} onValueChange={setEditGeometry}>
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground cursor-pointer focus:ring-1 focus:ring-primary/40">
                    <SelectValue placeholder="Polygon" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="Polygon" className="cursor-pointer">Polygon</SelectItem>
                    <SelectItem value="Point" className="cursor-pointer">Point</SelectItem>
                    <SelectItem value="Polyline" className="cursor-pointer">Polyline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Coverage Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Coverage Area
                </label>
                <Select defaultValue="Abu Dhabi Island">
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground cursor-pointer focus:ring-1 focus:ring-primary/40">
                    <SelectValue placeholder="Abu Dhabi Island" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="Abu Dhabi Island" className="cursor-pointer">Abu Dhabi Island</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Database Name */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                    Database Name
                  </label>
                  <span className="inline-flex items-center rounded bg-blue-500/10 text-blue-500 border border-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold">
                    from Data Mapping
                  </span>
                </div>
                <input
                  type="text"
                  value={selectedLayer?.entity}
                  disabled
                  className="h-9 w-full rounded-lg border border-border/45 bg-muted/30 dark:bg-muted/10 px-3 text-[13px] text-muted-foreground cursor-not-allowed font-medium"
                />
              </div>

              {/* Schema Name */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                    Schema Name
                  </label>
                  <span className="inline-flex items-center rounded bg-blue-500/10 text-blue-500 border border-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold">
                    from Data Mapping
                  </span>
                </div>
                <input
                  type="text"
                  value="DMT"
                  disabled
                  className="h-9 w-full rounded-lg border border-border/45 bg-muted/30 dark:bg-muted/10 px-3 text-[13px] text-muted-foreground cursor-not-allowed font-medium"
                />
              </div>

              {/* Record Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Record Count
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value="193"
                    disabled
                    className="h-9 w-full rounded-lg border border-border/45 bg-muted/30 dark:bg-muted/10 pl-3 pr-20 text-[13px] text-muted-foreground cursor-not-allowed font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold uppercase text-muted-foreground/85 tracking-wider">
                    RECORDS
                  </span>
                </div>
              </div>

              {/* Data Theme */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Data Theme
                </label>
                <Select defaultValue="Dark Gray Canvas">
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground cursor-pointer focus:ring-1 focus:ring-primary/40">
                    <SelectValue placeholder="Dark Gray Canvas" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="Dark Gray Canvas" className="cursor-pointer">Dark Gray Canvas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Remarks textarea */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">
                  Remarks / Service URL
                </label>
                <textarea
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 p-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none font-semibold"
                />
              </div>

              {/* Is Published Toggle */}
              <div className="md:col-span-2 border border-border/60 bg-foreground/[0.01] rounded-xl p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[12.5px] font-bold text-foreground block">Is Published</span>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    When ON, the layer's data is published and accessible to authorised users.
                  </span>
                </div>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={editPublished}
                    onChange={(e) => setEditPublished(e.target.checked)}
                    className="sr-only peer"
                    id="is-published-toggle"
                  />
                  <div
                    onClick={() => setEditPublished(!editPublished)}
                    className="w-9 h-5 bg-border/60 dark:bg-border/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 cursor-pointer"
                  />
                </div>
              </div>

            </div>
          </Surface>
        ) : (
          /* Attributes list edit tab */
          <Surface className="!p-0 overflow-hidden">
            <div className="p-5 border-b border-border/30 bg-foreground/[0.01]">
              <h3 className="text-[13.5px] font-bold text-foreground">Attribute Classification</h3>
              <p className="text-[11.5px] text-muted-foreground font-semibold mt-0.5">
                Set alias, sensitivity and PII per attribute. Edits save when you click Save Changes.
              </p>
              
              <div className="mt-3.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-3 py-1 text-xs font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Distribution: • Total: 17</span>
                </span>
              </div>
            </div>

            <div className="table-container-scrollable scrollbar-thin">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-border/60 bg-foreground/[0.04] text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    <th className="px-5 py-3 whitespace-nowrap">Attribute Name</th>
                    <th className="px-5 py-3 whitespace-nowrap">Data Type</th>
                    <th className="px-5 py-3 whitespace-nowrap">Alias Name</th>
                    <th className="px-5 py-3 whitespace-nowrap">Sensitivity</th>
                    <th className="px-5 py-3 whitespace-nowrap">PII / Info</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "ENGID", type: "String", alias: "ENGID" },
                    { name: "POSITIONALACCURACY", type: "Double", alias: "POSITIONALACCURACY" },
                    { name: "TYPEOFDATASOURCE", type: "String", alias: "TYPEOFDATASOURCE" },
                    { name: "PROJECTLIST", type: "String", alias: "PROJECTLIST" },
                    { name: "SOURCEOFORIGIN", type: "String", alias: "SOURCEOFORIGIN" },
                    { name: "MUNICIPALITYNAME", type: "String", alias: "MUNICIPALITYNAME" },
                    { name: "AD_FGDREPRESENTATION", type: "String", alias: "AD_FGDREPRESENTATION" },
                    { name: "DISTRICTID", type: "Integer", alias: "DISTRICTID" },
                    { name: "NAMEARABIC", type: "String", alias: "NAMEARABIC" },
                    { name: "NAMEENGLISH", type: "String", alias: "NAMEENGLISH" },
                    { name: "NAMEPOPULARARABIC", type: "String", alias: "NAMEPOPULARARABIC" },
                    { name: "NAMEPOPULARENGLISH", type: "String", alias: "NAMEPOPULARENGLISH" },
                    { name: "POPULATION", type: "Double", alias: "POPULATION" },
                    { name: "CH_FID", type: "String", alias: "CH_FID" },
                    { name: "SHAPE", type: "Geometry", alias: "SHAPE" },
                    { name: "SHAPE_Length", type: "Double", alias: "SHAPE_Length" },
                    { name: "SHAPE_Area", type: "Double", alias: "SHAPE_Area" },
                  ].map((attr) => (
                    <tr key={attr.name} className="border-b border-border/40 hover:bg-foreground/[0.01] transition-colors">
                      <td className="px-5 py-3 font-semibold text-muted-foreground/90 text-xs">{attr.name}</td>
                      <td className="px-5 py-3 text-xs">
                        <span className="px-2 py-0.5 rounded bg-muted border border-border/30 font-mono text-[10.5px] font-bold text-muted-foreground/80">
                          {attr.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs">
                        <input
                          type="text"
                          defaultValue={attr.alias}
                          className="h-8 w-60 rounded border border-border/60 bg-card px-2.5 text-[12.5px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                        />
                      </td>
                      <td className="px-5 py-3 text-xs">
                        <Select defaultValue="inherit">
                          <SelectTrigger className="h-8 w-44 border-border/60 bg-card text-[12px] text-foreground font-semibold cursor-pointer">
                            <SelectValue placeholder="— Inherit layer —" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/60">
                            <SelectItem value="inherit" className="cursor-pointer">— Inherit layer —</SelectItem>
                            <SelectItem value="Open Data" className="cursor-pointer">Open Data</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-5 py-3 text-xs">
                        <label className="flex items-center gap-1.5 font-bold text-muted-foreground/85 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded border-border/65 h-3.5 w-3.5 cursor-pointer accent-primary"
                          />
                          <span>Not PII</span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>
        )}
      </div>
    );
  }

  if (viewingLayerDbName) {
    const selectedLayer = layersList.find((l) => l.dbName === viewingLayerDbName) || layersList[0];
    
    return (
      <div className="space-y-6">
        {/* Header & Tabs Ribbon */}
        <Surface className="!p-4 pb-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <button
                onClick={() => setViewingLayerDbName(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground transition cursor-pointer"
                title="Back to layers list"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white shadow-soft">
                <Database className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[17px] font-black text-foreground">{selectedLayer?.alias || viewingLayerDbName}</h2>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase select-none font-mono">
                    Active
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground/85 font-semibold">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> {selectedLayer?.entity === "ADDA" ? "Abu Dhabi Digital Authority" : "Department of Municipalities"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe2 className="h-3.5 w-3.5" /> Abu Dhabi Island
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:ml-auto">
              {layerTab === "overview" && (
                <button
                  onClick={() => toast.info("Workflow monitor opened")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted px-3.5 text-xs font-bold text-foreground cursor-pointer transition-colors shadow-soft"
                >
                  <GitBranch className="h-3.5 w-3.5 text-purple-500/80" /> Open Workflow Monitor
                </button>
              )}
              {layerTab === "attributes" && (
                <button
                  onClick={() => toast.info("Outdated layers updated")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted px-3.5 text-xs font-bold text-foreground cursor-pointer transition-colors shadow-soft"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-amber-500" /> Show outdated layers
                </button>
              )}
              {layerTab === "metadata" && (
                <button
                  onClick={() => toast.info("DMT deliveries filtering active")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted px-3.5 text-xs font-bold text-foreground cursor-pointer transition-colors shadow-soft"
                >
                  <Search className="h-3.5 w-3.5 text-blue-500" /> Find DMT deliveries
                </button>
              )}
              {layerTab === "status" && (
                <button
                  onClick={() => toast.info("Navigating to Metadata Registry")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted px-3.5 text-xs font-bold text-foreground cursor-pointer transition-colors shadow-soft"
                >
                  <Database className="h-3.5 w-3.5 text-emerald-500" /> Go to Metadata Registry
                </button>
              )}
              
              <button
                onClick={() => {
                  setEditingLayerDbName(selectedLayer.dbName);
                  setEditTab("info");
                  setViewingLayerDbName(null);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit Layer
              </button>
            </div>
          </div>

          <div className="border-t border-border/20 mt-4" />

          {/* Tab Selection Row */}
          <div className="flex items-center gap-2 text-xs font-bold select-none -mb-[2px]">
            <button
              onClick={() => setLayerTab("overview")}
              className={cn(
                "px-4 py-3 border-b-2 transition-colors cursor-pointer",
                layerTab === "overview"
                  ? "border-blue-500 text-blue-500 font-extrabold"
                  : "border-transparent text-muted-foreground/85 hover:text-foreground"
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setLayerTab("attributes")}
              className={cn(
                "px-4 py-3 border-b-2 transition-colors cursor-pointer",
                layerTab === "attributes"
                  ? "border-blue-500 text-blue-500 font-extrabold"
                  : "border-transparent text-muted-foreground/85 hover:text-foreground"
              )}
            >
              # Attributes (17)
            </button>
            <button
              onClick={() => setLayerTab("metadata")}
              className={cn(
                "px-4 py-3 border-b-2 transition-colors cursor-pointer",
                layerTab === "metadata"
                  ? "border-blue-500 text-blue-500 font-extrabold"
                  : "border-transparent text-muted-foreground/85 hover:text-foreground"
              )}
            >
              Metadata
            </button>
            <button
              onClick={() => setLayerTab("status")}
              className={cn(
                "px-4 py-3 border-b-2 transition-colors cursor-pointer",
                layerTab === "status"
                  ? "border-blue-500 text-blue-500 font-extrabold"
                  : "border-transparent text-muted-foreground/85 hover:text-foreground"
              )}
            >
              Processing Status
            </button>
          </div>
        </Surface>

        {/* Dynamic Tab Contents */}
        {layerTab === "overview" ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
            
            {/* Left Column Card: Layer Info */}
            <Surface className="!p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Layer Info</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-border/20 pt-4">
                {/* ALIAS NAME */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Alias Name (Display)</span>
                  <span className="text-xs font-semibold text-foreground">{selectedLayer?.alias}</span>
                </div>

                {/* AGENCY LAYER NAME */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Agency Layer Name</span>
                  <span className="text-xs font-semibold text-foreground">{selectedLayer?.alias}</span>
                </div>

                {/* DB LAYER NAME */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">DB Layer Name</span>
                  <span className="text-xs font-mono font-semibold text-foreground">{selectedLayer?.dbName}</span>
                </div>

                {/* LAYER TYPE */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Layer Type</span>
                  <span className="text-xs font-semibold text-foreground">{selectedLayer?.layerType}</span>
                </div>

                {/* COORDINATE SYSTEM */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Coordinate System</span>
                  <div className="rounded-lg border border-border bg-foreground/[0.02] p-2 font-mono text-[11px] leading-relaxed text-foreground/80 w-fit">
                    WGS 1984<br />EPSG:4326
                  </div>
                </div>

                {/* GEOMETRY */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Geometry</span>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="h-3 w-3 bg-blue-500/10 border border-blue-500/35 rounded" /> {selectedLayer?.geometry}
                  </span>
                </div>

                {/* SENSITIVITY */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Sensitivity</span>
                  <div>
                    <span className="inline-flex items-center rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2 py-0.5 text-[10.5px] font-extrabold uppercase">
                      {selectedLayer?.sensitivity}
                    </span>
                  </div>
                </div>

                {/* SCHEMA NAME */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Schema Name</span>
                  <div>
                    <span className="inline-flex items-center rounded bg-blue-500/10 text-blue-500 border border-blue-500/25 px-2 py-0.5 text-[10.5px] font-mono font-bold">
                      {selectedLayer?.schema}
                    </span>
                  </div>
                </div>

                {/* DATABASE NAME */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Database Name</span>
                  <span className="text-xs font-semibold text-foreground">{selectedLayer?.entity}</span>
                </div>

                {/* REGISTERED DATA SOURCE */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Registered Data Source</span>
                  <span className="text-xs font-bold text-blue-500 hover:underline cursor-pointer">FGDB1</span>
                </div>

                {/* DATA THEME */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Data Theme</span>
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Dark Gray Canvas
                  </span>
                </div>

                {/* IS PUBLISHED */}
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Is Published</span>
                  <div>
                    <span className="inline-flex items-center gap-1 rounded border border-border bg-foreground/[0.03] text-muted-foreground px-2 py-0.5 text-[10.5px] font-bold">
                      <AlertCircle className="h-3 w-3" /> Not Published
                    </span>
                  </div>
                </div>

                {/* REMARKS */}
                <div className="space-y-1 md:col-span-2">
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block">Remarks / Service URL</span>
                  <span className="text-xs font-semibold text-muted-foreground/85">{selectedLayer?.remarks}</span>
                </div>
              </div>
            </Surface>

            {/* Right Column (Stats) */}
            <div className="space-y-6">
              <Surface className="!p-5 space-y-4">
                <h3 className="text-[11.5px] font-extrabold text-muted-foreground uppercase tracking-wider border-b border-border/30 pb-3 select-none">
                  Stats
                </h3>

                <div className="space-y-3.5 text-xs font-semibold pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground/85"># Attributes</span>
                    <span className="font-extrabold text-foreground">17</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground/85">Record Count</span>
                    <span className="font-extrabold text-foreground">193</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground/85">Onboarded</span>
                    <span className="font-extrabold text-foreground">{selectedLayer?.onboardedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground/85">Last Sync</span>
                    <span className="font-extrabold text-foreground">{selectedLayer?.onboardedDate}</span>
                  </div>
                </div>
              </Surface>
            </div>
          </div>
        ) : layerTab === "attributes" ? (
          <Surface className="!p-0 overflow-hidden">
            <div className="table-container-scrollable scrollbar-thin">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-border/60 bg-foreground/[0.04] text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    <th className="px-5 py-3 whitespace-nowrap">Attribute Name</th>
                    <th className="px-5 py-3 whitespace-nowrap">Data Type</th>
                    <th className="px-5 py-3 whitespace-nowrap">Alias</th>
                    <th className="px-5 py-3 whitespace-nowrap">Sensitivity</th>
                    <th className="px-5 py-3 whitespace-nowrap">PII</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "ENGID", type: "String", alias: "ENGID", sensitivity: "Inherit layer", pii: "—" },
                    { name: "POSITIONALACCURACY", type: "Double", alias: "POSITIONALACCURACY", sensitivity: "Inherit layer", pii: "—" },
                    { name: "TYPEOFDATASOURCE", type: "String", alias: "TYPEOFDATASOURCE", sensitivity: "Inherit layer", pii: "—" },
                    { name: "PROJECTLIST", type: "String", alias: "PROJECTLIST", sensitivity: "Inherit layer", pii: "—" },
                    { name: "SOURCEOFORIGIN", type: "String", alias: "SOURCEOFORIGIN", sensitivity: "Inherit layer", pii: "—" },
                    { name: "MUNICIPALITYNAME", type: "String", alias: "MUNICIPALITYNAME", sensitivity: "Inherit layer", pii: "—" },
                    { name: "AD_FGDREPRESENTATION", type: "String", alias: "AD_FGDREPRESENTATION", sensitivity: "Inherit layer", pii: "—" },
                    { name: "DISTRICTID", type: "Integer", alias: "DISTRICTID", sensitivity: "Inherit layer", pii: "—" },
                    { name: "NAMEARABIC", type: "String", alias: "NAMEARABIC", sensitivity: "Inherit layer", pii: "—" },
                    { name: "NAMEENGLISH", type: "String", alias: "NAMEENGLISH", sensitivity: "Inherit layer", pii: "—" },
                    { name: "NAMEPOPULARARABIC", type: "String", alias: "NAMEPOPULARARABIC", sensitivity: "Inherit layer", pii: "—" },
                    { name: "NAMEPOPULARENGLISH", type: "String", alias: "NAMEPOPULARENGLISH", sensitivity: "Inherit layer", pii: "—" },
                    { name: "POPULATION", type: "Double", alias: "POPULATION", sensitivity: "Inherit layer", pii: "—" },
                    { name: "CH_FID", type: "String", alias: "CH_FID", sensitivity: "Inherit layer", pii: "—" },
                    { name: "SHAPE", type: "Geometry", alias: "SHAPE", sensitivity: "Inherit layer", pii: "—" },
                    { name: "SHAPE_Length", type: "Double", alias: "SHAPE_Length", sensitivity: "Inherit layer", pii: "—" },
                    { name: "SHAPE_Area", type: "Double", alias: "SHAPE_Area", sensitivity: "Inherit layer", pii: "—" },
                  ].map((attr) => (
                    <tr key={attr.name} className="border-b border-border/40 hover:bg-foreground/[0.01] transition-colors">
                      <td className="px-5 py-3 font-bold text-foreground text-xs">{attr.name}</td>
                      <td className="px-5 py-3 text-xs">
                        <span className="px-1.5 py-0.5 rounded bg-muted border border-border/30 font-mono text-[10.5px] font-bold text-muted-foreground">
                          {attr.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-foreground/80 font-semibold">{attr.alias}</td>
                      <td className="px-5 py-3 text-xs text-amber-600/90 dark:text-amber-500/90 font-bold">{attr.sensitivity}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground/75 font-semibold">{attr.pii}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>
        ) : layerTab === "metadata" ? (
          <Surface className="p-12">
            <div className="flex flex-col items-center justify-center text-center py-6 space-y-4 max-w-lg mx-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/[0.04] border border-border/50 text-muted-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-[15px] font-bold text-foreground">No metadata records linked to this layer.</h4>
                <p className="text-[12px] text-muted-foreground/85 leading-relaxed font-semibold">
                  Metadata records live in <code className="font-mono bg-muted/70 px-1.5 py-0.5 rounded text-[11px] text-blue-400">daf__mk.metadata_record</code>; wire the metadata module to populate this tab.
                </p>
              </div>
            </div>
          </Surface>
        ) : (
          <Surface className="p-12">
            <div className="flex flex-col items-center justify-center text-center py-6 space-y-4 max-w-lg mx-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/[0.04] border border-border/50 text-muted-foreground">
                <Database className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-[15px] font-bold text-foreground">No processing-status entries yet.</h4>
                <p className="text-[12px] text-muted-foreground/85 leading-relaxed font-semibold">
                  Wire to <code className="font-mono bg-muted/70 px-1.5 py-0.5 rounded text-[11px] text-blue-400">daf__mk.layer_processing_status</code> when the workflow monitor module lands.
                </p>
              </div>
              
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-4 py-2 text-xs font-bold shadow-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Layer is currently active and accepting deliveries.</span>
                </div>
              </div>
            </div>
          </Surface>
        )}
      </div>
    );
  }

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
            <button
              onClick={() => setIsRegistering(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[14px] font-semibold text-primary-foreground hover:bg-primary/95 transition cursor-pointer"
            >
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
                m.tone === "secondary" && (isLight ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-blue-500/10 text-blue-400 border-blue-500/20")
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
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search layers, DB name, entity..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

          {/* Right-aligned filters group */}
          <div className="flex items-center gap-3 ml-auto flex-wrap shrink-0">
            {/* Entities Select dropdown */}
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="h-9 w-auto min-w-[130px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer">
                <SelectValue placeholder="All Entities" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="all-entities" className="cursor-pointer text-[13px]">All Entities</SelectItem>
                <SelectItem value="adda" className="cursor-pointer text-[13px]">ADDA — Abu Dhabi Digital Authority</SelectItem>
                <SelectItem value="addc" className="cursor-pointer text-[13px]">ADDC — Abu Dhabi Distribution Company</SelectItem>
                <SelectItem value="adha" className="cursor-pointer text-[13px]">ADHA — Abu Dhabi Housing Authority</SelectItem>
                <SelectItem value="dge" className="cursor-pointer text-[13px]">DGE — Dept of Government Enablement</SelectItem>
                <SelectItem value="dmt" className="cursor-pointer text-[13px]">DMT — Department of Municipalities</SelectItem>
                <SelectItem value="ead" className="cursor-pointer text-[13px]">EAD — Environment Agency Abu Dhabi</SelectItem>
              </SelectContent>
            </Select>

            {/* Sensitivity Select dropdown */}
            <Select value={sensitivityFilter} onValueChange={setSensitivityFilter}>
              <SelectTrigger className="h-9 w-auto min-w-[140px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer">
                <SelectValue placeholder="All Sensitivity" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="all-sensitivity" className="cursor-pointer text-[13px]">All Sensitivity</SelectItem>
                <SelectItem value="open data" className="cursor-pointer text-[13px]">Open Data</SelectItem>
                <SelectItem value="restricted" className="cursor-pointer text-[13px]">Restricted</SelectItem>
                <SelectItem value="sensitive" className="cursor-pointer text-[13px]">Sensitive</SelectItem>
                <SelectItem value="secured" className="cursor-pointer text-[13px]">Secured</SelectItem>
                <SelectItem value="secret" className="cursor-pointer text-[13px]">Secret</SelectItem>
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

            {/* Action buttons columns & reload */}
            <div className="relative">
              <button
                onClick={() => setIsColumnsMenuOpen(!isColumnsMenuOpen)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-3 text-[13px] font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <Columns3 className="h-4 w-4" /> Columns
              </button>
              
              {isColumnsMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsColumnsMenuOpen(false)} />
                  <div className={cn(
                    "absolute right-0 mt-1.5 w-60 rounded-xl border z-50 p-4 space-y-3.5 shadow-lg select-none",
                    isLight ? "bg-white border-slate-200 text-slate-800" : "bg-slate-950 border-border text-foreground"
                  )}>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground/80">Toggle Columns</div>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-semibold opacity-70">
                        <span className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-muted text-[9px] font-extrabold uppercase text-muted-foreground">Lock</span>
                          Layer Name
                        </span>
                        <input type="checkbox" checked disabled className="rounded border-border/65 h-3.5 w-3.5 cursor-not-allowed opacity-60" />
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold cursor-pointer" onClick={() => setVisibleCols(prev => ({ ...prev, dbLayerName: !prev.dbLayerName }))}>
                        <span>DB Layer Name</span>
                        <input type="checkbox" checked={visibleCols.dbLayerName} readOnly className="rounded border-border/65 h-3.5 w-3.5 cursor-pointer accent-primary" />
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold cursor-pointer" onClick={() => setVisibleCols(prev => ({ ...prev, entity: !prev.entity }))}>
                        <span>Entity</span>
                        <input type="checkbox" checked={visibleCols.entity} readOnly className="rounded border-border/65 h-3.5 w-3.5 cursor-pointer accent-primary" />
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold cursor-pointer" onClick={() => setVisibleCols(prev => ({ ...prev, type: !prev.type }))}>
                        <span>Type</span>
                        <input type="checkbox" checked={visibleCols.type} readOnly className="rounded border-border/65 h-3.5 w-3.5 cursor-pointer accent-primary" />
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold cursor-pointer" onClick={() => setVisibleCols(prev => ({ ...prev, geometry: !prev.geometry }))}>
                        <span>Geometry</span>
                        <input type="checkbox" checked={visibleCols.geometry} readOnly className="rounded border-border/65 h-3.5 w-3.5 cursor-pointer accent-primary" />
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold cursor-pointer" onClick={() => setVisibleCols(prev => ({ ...prev, coverage: !prev.coverage }))}>
                        <span>Coverage</span>
                        <input type="checkbox" checked={visibleCols.coverage} readOnly className="rounded border-border/65 h-3.5 w-3.5 cursor-pointer accent-primary" />
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold cursor-pointer" onClick={() => setVisibleCols(prev => ({ ...prev, sensitivity: !prev.sensitivity }))}>
                        <span>Sensitivity</span>
                        <input type="checkbox" checked={visibleCols.sensitivity} readOnly className="rounded border-border/65 h-3.5 w-3.5 cursor-pointer accent-primary" />
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold cursor-pointer" onClick={() => setVisibleCols(prev => ({ ...prev, onboardedDate: !prev.onboardedDate }))}>
                        <span>Onboarded Date</span>
                        <input type="checkbox" checked={visibleCols.onboardedDate} readOnly className="rounded border-border/65 h-3.5 w-3.5 cursor-pointer accent-primary" />
                      </div>
                    </div>

                    <div className="border-t border-border/20 pt-2 text-[10px] text-muted-foreground/80 leading-relaxed font-semibold italic">
                      Locked columns cannot be deselected.
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/50 text-muted-foreground hover:text-foreground transition cursor-pointer"
              title="Reload table"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        {selectedLayerNames.length > 0 && (
          <div className="mx-4 mb-4 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 py-2 px-4 rounded-lg flex items-center justify-between text-xs font-bold border border-blue-200/50 dark:border-blue-900/30">
            <span>{selectedLayerNames.length} {selectedLayerNames.length === 1 ? "layer" : "layers"} selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const updated = layersList.filter((layer) => !selectedLayerNames.includes(layer.alias));
                  saveLayers(updated);
                  setSelectedLayerNames([]);
                  toast.success("Selected layers deleted successfully.");
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-soft"
              >
                Delete selected
              </button>
              <button
                onClick={() => setSelectedLayerNames([])}
                className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-soft"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </div>
        )}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground/80">
                <th className="py-3 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedLayers.length > 0 && paginatedLayers.every((l) => selectedLayerNames.includes(l.alias))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newSelected = [...selectedLayerNames];
                        paginatedLayers.forEach((l) => {
                          if (!newSelected.includes(l.alias)) newSelected.push(l.alias);
                        });
                        setSelectedLayerNames(newSelected);
                      } else {
                        const pageAliases = paginatedLayers.map((l) => l.alias);
                        setSelectedLayerNames((prev) => prev.filter((alias) => !pageAliases.includes(alias)));
                      }
                    }}
                    className="rounded border-border/65 cursor-pointer"
                  />
                </th>
                {activeHeaders.map((c) => (
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
              {paginatedLayers.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-20">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.04] border border-border/60 text-muted-foreground">
                        <Layers className="h-6.5 w-6.5" />
                      </span>
                      <div className="text-[16px] font-bold text-foreground">No layers match the current filters.</div>
                      <div className="text-[13.5px] text-muted-foreground max-w-md">
                        Onboard a data source and run Save Mapping to populate this list, or click{" "}
                        <span
                          onClick={() => setIsRegistering(true)}
                          className="font-bold text-primary hover:underline cursor-pointer"
                        >
                          Register Layer
                        </span>{" "}
                        above.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLayers.map((layer) => (
                  <tr key={layer.dbName} className={`group transition-colors hover:bg-foreground/[0.02] border-b border-border/40 ${selectedLayerNames.includes(layer.alias) ? "bg-slate-500/5 dark:bg-slate-500/10" : ""}`}>
                    <td className="py-3 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedLayerNames.includes(layer.alias)}
                        onChange={() => {
                          setSelectedLayerNames((prev) =>
                            prev.includes(layer.alias) ? prev.filter((a) => a !== layer.alias) : [...prev, layer.alias]
                          );
                        }}
                        className="rounded border-border/65 cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap table-sticky-single-left bg-card group-hover:bg-foreground/[0.02] transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary/30 to-secondary-accent/30 text-accent ring-1 ring-inset ring-white/10">
                          <Layers className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{layer.alias}</div>
                          <div className="text-[11px] text-muted-foreground">{layer.layerType}</div>
                        </div>
                      </div>
                    </td>
                    
                    {visibleCols.dbLayerName && (
                      <td className="px-5 py-3 font-mono text-[13px] text-foreground/80">{layer.dbName}</td>
                    )}
                    
                    {visibleCols.entity && (
                      <td className="px-5 py-3 font-mono text-[13.5px] font-semibold text-foreground/80">
                        <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-accent text-[11px] uppercase">
                          {layer.entity}
                        </span>
                      </td>
                    )}

                    {visibleCols.type && (
                      <td className="px-5 py-3 text-foreground/80">{layer.layerType}</td>
                    )}

                    {visibleCols.geometry && (
                      <td className="px-5 py-3 text-foreground/80 animate-fade-in">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold border shadow-xs select-none",
                          layer.geometry === "Polygon"
                            ? "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40"
                            : "bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border-teal-200/60 dark:border-teal-800/40"
                        )}>
                          {layer.geometry === "Polygon" ? (
                            <PolygonIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <PolylineIcon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                          )}
                          <span>{layer.geometry}</span>
                        </span>
                      </td>
                    )}

                    {visibleCols.coverage && (
                      <td className="px-5 py-3 text-foreground/80">—</td>
                    )}

                    {visibleCols.sensitivity && (
                      <td className="px-5 py-3">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[11px] font-bold border",
                          (layer.sensitivity === "Public" || layer.sensitivity === "Open Data") && "bg-success/15 border-success/35 text-success",
                          layer.sensitivity === "Restricted" && "bg-warning/15 border-warning/35 text-warning",
                          layer.sensitivity === "Sensitive" && "bg-amber-500/15 border-amber-500/35 text-amber-500",
                          layer.sensitivity === "Confidential" && "bg-danger/15 border-danger/35 text-danger"
                        )}>
                          {layer.sensitivity}
                        </span>
                      </td>
                    )}

                    {visibleCols.onboardedDate && (
                      <td className="px-5 py-3 text-muted-foreground">{layer.onboardedDate}</td>
                    )}

                    <td className="px-5 py-3 table-sticky-actions text-right bg-card group-hover:bg-foreground/[0.02] transition-colors">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setViewingLayerDbName(layer.dbName)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-blue-200/60 dark:border-blue-800/40 bg-blue-50/70 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100/80 hover:text-blue-700 transition cursor-pointer"
                          title="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingLayerDbName(layer.dbName);
                            setEditTab("info");
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/70 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100/80 hover:text-amber-700 transition cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteLayerDbName(layer.dbName);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-rose-200/60 dark:border-rose-800/40 bg-rose-50/70 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100/80 hover:text-rose-700 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/10 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                          title="Locked"
                        >
                          <Lock className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <TablePagination
          totalItems={filteredLayers.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="layer"
          itemNamePlural="layers"
        />
        {/* Delete Confirmation Modal Overlay */}
        {deleteLayerDbName && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-fade-in">
            <div className="relative w-full max-w-[440px] rounded-2xl bg-card border border-border/80 p-5 shadow-2xl overflow-hidden border-t-4 border-t-rose-600 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setDeleteLayerDbName(null)}
                className="absolute top-4 right-4 text-muted-foreground/80 hover:text-foreground cursor-pointer transition-colors"
                title="Close"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                  <AlertCircle className="h-5.5 w-5.5" />
                </div>
                
                <div className="space-y-1.5 flex-1 pt-1.5">
                  <h3 className="text-[15.5px] font-bold text-foreground">Permanently delete this layer?</h3>
                  
                  {/* Confirmed Value Textbox matching Image 2 */}
                  <div className="pt-2">
                    <div className="w-full h-9 rounded-lg border border-border/70 bg-foreground/[0.02] px-3 font-mono text-[12.5px] font-bold text-foreground/80 select-all flex items-center">
                      "{deleteLayerDbName}"
                    </div>
                  </div>

                  {/* Informational checklist description */}
                  <div className="pt-3 text-[11.5px] text-muted-foreground/90 font-semibold space-y-1.5 leading-normal">
                    <p>This will delete the layer configuration and related mappings.</p>
                    <p>The original data source will not be deleted.</p>
                    <p className="text-muted-foreground/75 italic">Audit logs will be preserved.</p>
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteLayerDbName(null)}
                  className="h-9 px-4 rounded-lg border border-border/80 bg-card hover:bg-muted text-xs font-bold text-foreground cursor-pointer transition-colors shadow-soft"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const updated = layersList.filter((l) => l.dbName !== deleteLayerDbName);
                    saveLayers(updated);
                    toast.success("Layer deleted successfully.");
                    setDeleteLayerDbName(null);
                  }}
                  className="h-9 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-soft"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Layer
                </button>
              </div>
            </div>
          </div>
        )}
      </Surface>
    </div>
  );
}
