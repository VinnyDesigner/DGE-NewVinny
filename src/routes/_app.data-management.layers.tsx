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
    alias: "EAD Boundary Map",
    dbName: "ead_boundary_map_as",
    entity: "EAD",
    geometry: "Polygon",
    sensitivity: "Restricted",
    status: "Active",
    layerType: "Vector",
    schema: "EAD_SPATIAL_DB",
    remarks: "Initial boundary reference layers",
    onboardedDate: "22/07/2026",
  },
  {
    alias: "ADDA Fiber Network",
    dbName: "adda_fiber_net_as",
    entity: "ADDA",
    geometry: "Line",
    sensitivity: "Confidential",
    status: "Active",
    layerType: "Vector",
    schema: "ADDA_NETWORK_SCHEMA",
    remarks: "Telecommunications backbone routes",
    onboardedDate: "21/07/2026",
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
  { code: "EAD", name: "Environment Agency Abu Dhabi" },
  { code: "DGE", name: "Dept of Government Enablement" },
  { code: "ADDC", name: "Abu Dhabi Distribution Company" },
  { code: "ADHA", name: "Abu Dhabi Housing Authority" },
];

const GEOMETRIES = ["Point", "Line", "Polygon", "Multipoint", "Raster"];
const LAYER_TYPES = ["Vector", "Raster", "Point Cloud", "Table (Non-Spatial)"];
const SENSITIVITIES = ["Public", "Restricted", "Confidential"];
const STATUSES = ["Active", "Inactive"];

function LayersPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Navigation state
  const [isRegistering, setIsRegistering] = useState(false);

  // Dynamic layers list state
  const [layersList, setLayersList] = useState<DataLayerItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_LAYERS);
      if (saved) {
        try {
          return JSON.parse(saved);
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

  // Filters state
  const [query, setQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all-entities");
  const [sensitivityFilter, setSensitivityFilter] = useState("all-sensitivity");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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
    const publishedCount = layersList.filter((l) => l.sensitivity === "Public").length;
    const confidentialCount = layersList.filter((l) => l.sensitivity === "Confidential" || l.sensitivity === "Restricted").length;

    return [
      { label: "Total Layers", value: String(total), hint: "All registered", icon: Layers, tone: "primary" },
      { label: "Active", value: String(activeCount), hint: "Accepting deliveries", icon: CheckCircle2, tone: "success" },
      { label: "Published", value: String(publishedCount), hint: "Publicly accessible", icon: Globe2, tone: "info" },
      { label: "By Classification", value: String(confidentialCount), hint: "Confidential or Restricted", icon: ShieldCheck, tone: "secondary" },
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

  // List search filtering
  const [currentPageIndex, setCurrentPageIndex] = useState(1);

  // Sync pagination index with active page changes
  useEffect(() => {
    setCurrentPageIndex(1);
  }, [query, entityFilter, sensitivityFilter, statusFilter]);

  const finalFilteredLayers = useMemo(() => {
    return filteredLayers;
  }, [filteredLayers]);

  const finalPaginatedLayers = useMemo(() => {
    const start = (currentPageIndex - 1) * pageSize;
    return finalFilteredLayers.slice(start, start + pageSize);
  }, [finalFilteredLayers, currentPageIndex, pageSize]);

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
              {finalPaginatedLayers.length === 0 ? (
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
                finalPaginatedLayers.map((layer) => (
                  <tr key={layer.dbName} className="group transition-colors hover:bg-foreground/[0.02] border-b border-border/40">
                    <td className="py-3 px-4 w-12 text-center">
                      <input type="checkbox" className="rounded border-border/65 cursor-pointer" />
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
                    <td className="px-5 py-3 font-mono text-[13px] text-foreground/80">{layer.dbName}</td>
                    <td className="px-5 py-3 font-mono text-[13.5px] font-semibold text-foreground/80">
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-accent text-[11px] uppercase">
                        {layer.entity}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-foreground/80">{layer.geometry}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[11px] font-bold border",
                        layer.sensitivity === "Public" && "bg-success/15 border-success/35 text-success",
                        layer.sensitivity === "Restricted" && "bg-warning/15 border-warning/35 text-warning",
                        layer.sensitivity === "Confidential" && "bg-danger/15 border-danger/35 text-danger"
                      )}>
                        {layer.sensitivity}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{layer.onboardedDate}</td>
                    <td className="px-5 py-3 table-sticky-actions text-right bg-card group-hover:bg-foreground/[0.02] transition-colors">
                      <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                        <button className="flex h-7 w-7 items-center justify-center rounded-md border border-foreground/10 bg-foreground/[0.03] text-muted-foreground hover:text-foreground hover:border-accent/45 hover:bg-foreground/[0.06] cursor-pointer">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-md border border-foreground/10 bg-foreground/[0.03] text-muted-foreground hover:text-foreground hover:border-accent/45 hover:bg-foreground/[0.06] cursor-pointer">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const updated = layersList.filter((l) => l.dbName !== layer.dbName);
                            saveLayers(updated);
                            toast.success(`Data layer "${layer.alias}" deleted successfully.`);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-foreground/10 bg-foreground/[0.03] text-danger hover:bg-danger/10 hover:border-danger/40 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
          currentPage={currentPageIndex}
          onPageChange={setCurrentPageIndex}
          onPageSizeChange={setPageSize}
          itemNameSingular="layer"
          itemNamePlural="layers"
        />
      </Surface>
    </div>
  );
}
