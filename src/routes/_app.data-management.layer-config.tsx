import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  Search,
  Plus,
  Pencil,
  Trash,
  SlidersHorizontal,
  Shield,
  Layers,
  Shapes,
  FileCog,
  Tags,
  Check,
  X,
  Sparkles,
  Info,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_app/data-management/layer-config")({
  head: () => ({
    meta: [
      { title: "Layer Configuration — Data Automation Studio" },
      { name: "description", content: "Configure geospatial and tabular reference layers." },
    ],
  }),
  component: LayerConfiguration,
});

// Interfaces
interface CoverageArea {
  id: string;
  name: string;
  level: string;
  layerCount: number;
  active: boolean;
}

interface GeometryType {
  id: string;
  name: string;
  code: string;
  category: string;
  layerCount: number;
  active: boolean;
}

interface DataType {
  id: string;
  name: string;
  code: string;
  layerCount: number;
  active: boolean;
}

interface SensitivityLevel {
  id: string;
  name: string;
  description: string;
  level: string;
  layerCount: number;
  active: boolean;
}

interface DataTheme {
  id: string;
  name: string;
  description: string;
  layerCount: number;
  active: boolean;
}

// Initial seed data lists
const seedCoverage: CoverageArea[] = [
  { id: "cov1", name: "Abu Dhabi Emirate", level: "Emirate", layerCount: 14, active: true },
  { id: "cov2", name: "Al Ain Region", level: "Region", layerCount: 8, active: true },
  { id: "cov3", name: "Al Dhafra Region", level: "Region", layerCount: 5, active: true },
  { id: "cov4", name: "United Arab Emirates", level: "Country", layerCount: 22, active: true },
];

const seedGeometry: GeometryType[] = [
  { id: "geom1", name: "Point", code: "PT", category: "Vector", layerCount: 12, active: true },
  { id: "geom2", name: "LineString", code: "LN", category: "Vector", layerCount: 6, active: true },
  { id: "geom3", name: "Polygon", code: "PL", category: "Vector", layerCount: 24, active: true },
  { id: "geom4", name: "Raster Grid", code: "RS", category: "Raster", layerCount: 4, active: true },
  { id: "geom5", name: "Non-Spatial", code: "NS", category: "Tabular", layerCount: 15, active: true },
];

const seedDataTypes: DataType[] = [
  { id: "dt1", name: "Shapefile", code: "SHP", layerCount: 18, active: true },
  { id: "dt2", name: "GeoJSON", code: "JSON", layerCount: 9, active: true },
  { id: "dt3", name: "File Geodatabase", code: "GDB", layerCount: 32, active: true },
  { id: "dt4", name: "GeoTIFF", code: "TIFF", layerCount: 4, active: true },
  { id: "dt5", name: "CSV/XLSX", code: "TBL", layerCount: 15, active: true },
];

const seedSensitivity: SensitivityLevel[] = [
  { id: "sens1", name: "Public", description: "Fully open data, visible to all external portals.", level: "Low", layerCount: 14, active: true },
  { id: "sens2", name: "Restricted", description: "Internal government access only, requires basic roles.", level: "Medium", layerCount: 18, active: true },
  { id: "sens3", name: "Confidential", description: "Highly sensitive spatial data, requires manager sign-off.", level: "High", layerCount: 22, active: true },
  { id: "sens4", name: "Secret", description: "State-level protected records, critical security clearance.", level: "Critical", layerCount: 5, active: true },
];

const seedThemes: DataTheme[] = [
  { id: "thm1", name: "Base Map & Imagery", description: "Reference grid maps, high-res ortho-imagery, and elevation models.", layerCount: 12, active: true },
  { id: "thm2", name: "Transportation", description: "Road networks, public transit routes, railways, and nodes.", layerCount: 18, active: true },
  { id: "thm3", name: "Utilities", description: "Water lines, electricity grids, telecommunications, and gas lines.", layerCount: 22, active: true },
  { id: "thm4", name: "Environment", description: "Protected reserves, soil type boundaries, and forest cover.", layerCount: 8, active: true },
];

const STORAGE_KEYS = {
  COVERAGE: "dge_lc_coverage_v1",
  GEOMETRY: "dge_lc_geometry_v1",
  DATATYPES: "dge_lc_datatypes_v1",
  SENSITIVITY: "dge_lc_sensitivity_v1",
  THEMES: "dge_lc_themes_v1",
};

function LayerConfiguration() {
  const [activeTab, setActiveTab] = useState<"coverage" | "geometry" | "datatypes" | "sensitivity" | "themes">("coverage");

  // State managed collections
  const [coverages, setCoverages] = useState<CoverageArea[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.COVERAGE);
      if (saved) return JSON.parse(saved);
    }
    return seedCoverage;
  });

  const [geometries, setGeometries] = useState<GeometryType[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.GEOMETRY);
      if (saved) return JSON.parse(saved);
    }
    return seedGeometry;
  });

  const [dataTypes, setDataTypes] = useState<DataType[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.DATATYPES);
      if (saved) return JSON.parse(saved);
    }
    return seedDataTypes;
  });

  const [sensitivities, setSensitivities] = useState<SensitivityLevel[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.SENSITIVITY);
      if (saved) return JSON.parse(saved);
    }
    return seedSensitivity;
  });

  const [themes, setThemes] = useState<DataTheme[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.THEMES);
      if (saved) return JSON.parse(saved);
    }
    return seedThemes;
  });

  // Local storage save helpers
  const saveCoverages = (newList: CoverageArea[]) => {
    setCoverages(newList);
    localStorage.setItem(STORAGE_KEYS.COVERAGE, JSON.stringify(newList));
  };
  const saveGeometries = (newList: GeometryType[]) => {
    setGeometries(newList);
    localStorage.setItem(STORAGE_KEYS.GEOMETRY, JSON.stringify(newList));
  };
  const saveDataTypes = (newList: DataType[]) => {
    setDataTypes(newList);
    localStorage.setItem(STORAGE_KEYS.DATATYPES, JSON.stringify(newList));
  };
  const saveSensitivities = (newList: SensitivityLevel[]) => {
    setSensitivities(newList);
    localStorage.setItem(STORAGE_KEYS.SENSITIVITY, JSON.stringify(newList));
  };
  const saveThemes = (newList: DataTheme[]) => {
    setThemes(newList);
    localStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(newList));
  };

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Reset filters on tab change
  useEffect(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
  }, [activeTab]);

  // Modal open states
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic Add Fields
  const [nameField, setNameField] = useState("");
  const [levelField, setLevelField] = useState("");
  const [codeField, setCodeField] = useState("");
  const [categoryField, setCategoryField] = useState("");
  const [descriptionField, setDescriptionField] = useState("");

  const handleOpenAddModal = () => {
    setNameField("");
    setLevelField("");
    setCodeField("");
    setCategoryField("");
    setDescriptionField("");
    
    // Set default selections
    if (activeTab === "geometry") {
      setCategoryField("Vector");
    } else if (activeTab === "sensitivity") {
      setLevelField("Low");
    }
    setIsModalOpen(true);
  };

  // Submission handles
  const handleAddConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameField.trim()) {
      toast.error("Name field is required");
      return;
    }

    if (activeTab === "coverage") {
      const newCov: CoverageArea = {
        id: "cov_" + Math.random().toString(),
        name: nameField.trim(),
        level: levelField.trim() || "Emirate",
        layerCount: 0,
        active: true,
      };
      saveCoverages([...coverages, newCov]);
      toast.success(`Coverage Area "${newCov.name}" added successfully`);
    } else if (activeTab === "geometry") {
      const newGeom: GeometryType = {
        id: "geom_" + Math.random().toString(),
        name: nameField.trim(),
        code: codeField.trim().toUpperCase() || "PT",
        category: categoryField,
        layerCount: 0,
        active: true,
      };
      saveGeometries([...geometries, newGeom]);
      toast.success(`Geometry Type "${newGeom.name}" added successfully`);
    } else if (activeTab === "datatypes") {
      const newDt: DataType = {
        id: "dt_" + Math.random().toString(),
        name: nameField.trim(),
        code: codeField.trim().toUpperCase() || "SHP",
        layerCount: 0,
        active: true,
      };
      saveDataTypes([...dataTypes, newDt]);
      toast.success(`Data Type "${newDt.name}" added successfully`);
    } else if (activeTab === "sensitivity") {
      const newSens: SensitivityLevel = {
        id: "sens_" + Math.random().toString(),
        name: nameField.trim(),
        description: descriptionField.trim(),
        level: levelField,
        layerCount: 0,
        active: true,
      };
      saveSensitivities([...sensitivities, newSens]);
      toast.success(`Sensitivity Level "${newSens.name}" added successfully`);
    } else if (activeTab === "themes") {
      const newThm: DataTheme = {
        id: "thm_" + Math.random().toString(),
        name: nameField.trim(),
        description: descriptionField.trim(),
        layerCount: 0,
        active: true,
      };
      saveThemes([...themes, newThm]);
      toast.success(`Data Theme "${newThm.name}" added successfully`);
    }

    setIsModalOpen(false);
  };

  // Delete handles
  const handleDeleteItem = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    if (activeTab === "coverage") {
      saveCoverages(coverages.filter((c) => c.id !== id));
    } else if (activeTab === "geometry") {
      saveGeometries(geometries.filter((g) => g.id !== id));
    } else if (activeTab === "datatypes") {
      saveDataTypes(dataTypes.filter((d) => d.id !== id));
    } else if (activeTab === "sensitivity") {
      saveSensitivities(sensitivities.filter((s) => s.id !== id));
    } else if (activeTab === "themes") {
      saveThemes(themes.filter((t) => t.id !== id));
    }
    toast.success(`"${name}" deleted successfully`);
  };

  // Filter lists dynamically
  const filteredCoverage = useMemo(() => {
    return coverages.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.level.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || (statusFilter === "active" ? item.active : !item.active);
      return matchSearch && matchStatus;
    });
  }, [coverages, searchQuery, statusFilter]);

  const filteredGeometry = useMemo(() => {
    return geometries.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || (statusFilter === "active" ? item.active : !item.active);
      const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [geometries, searchQuery, statusFilter, categoryFilter]);

  const filteredDataTypes = useMemo(() => {
    return dataTypes.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || (statusFilter === "active" ? item.active : !item.active);
      return matchSearch && matchStatus;
    });
  }, [dataTypes, searchQuery, statusFilter]);

  const filteredSensitivity = useMemo(() => {
    return sensitivities.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.level.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || (statusFilter === "active" ? item.active : !item.active);
      const matchLevel = categoryFilter === "all" || item.level === categoryFilter;
      return matchSearch && matchStatus && matchLevel;
    });
  }, [sensitivities, searchQuery, statusFilter, categoryFilter]);

  const filteredThemes = useMemo(() => {
    return themes.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || (statusFilter === "active" ? item.active : !item.active);
      return matchSearch && matchStatus;
    });
  }, [themes, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Layer Configuration"
          description="Manage configurable reference data for Data Layers — Coverage Areas, Geometry Types, Data Types, and Sensitivity Levels"
          className="mb-0!"
        />
        <Button
          onClick={handleOpenAddModal}
          className="h-9.5 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5 font-semibold text-xs shrink-0 self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          {activeTab === "coverage" && "Add Coverage Area"}
          {activeTab === "geometry" && "Add Geometry Type"}
          {activeTab === "datatypes" && "Add Data Type"}
          {activeTab === "sensitivity" && "Add Sensitivity Level"}
          {activeTab === "themes" && "New Theme"}
        </Button>
      </div>

      {/* Tabs list (Coverage Areas, Geometry Types, Data Types, Layer Sensitivity, Data Themes) */}
      <div className="flex flex-wrap gap-6 border-b border-border/30 pb-0 mb-4">
        <button
          onClick={() => setActiveTab("coverage")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "coverage"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> Coverage Areas
          </span>
        </button>
        <button
          onClick={() => setActiveTab("geometry")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "geometry"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Shapes className="h-4 w-4" /> Geometry Types
          </span>
        </button>
        <button
          onClick={() => setActiveTab("datatypes")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "datatypes"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <FileCog className="h-4 w-4" /> Data Types
          </span>
        </button>
        <button
          onClick={() => setActiveTab("sensitivity")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "sensitivity"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" /> Layer Sensitivity
          </span>
        </button>
        <button
          onClick={() => setActiveTab("themes")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "themes"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Tags className="h-4 w-4" /> Data Themes
          </span>
        </button>
      </div>

      {/* Tabs instruction cards */}
      <div className="mb-4">
        {activeTab === "coverage" && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-semibold leading-relaxed">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground">Coverage Areas</span> define the geographic scope of data layers — from country level down to individual zones and districts. These become selectable options when configuring data layers, deliveries, and workflows.
            </div>
          </div>
        )}
        {activeTab === "geometry" && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 text-xs font-semibold leading-relaxed">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground">Geometry Types</span> define the spatial shape/structure of data layers — Vector (Points, Lines, Polygons), Raster grids, or Non-spatial. These populate the Geometry Type selector in Data Layers.
            </div>
          </div>
        )}
        {activeTab === "datatypes" && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold leading-relaxed">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground">Data Types</span> categorise data layers by their file format and spatial nature — Vector, Raster, Ortho, LiDAR, DEM, DSM, Tabular, and more. These populate the Data Type selector in Data Layers.
            </div>
          </div>
        )}
        {activeTab === "sensitivity" && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-400 text-xs font-semibold leading-relaxed">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground">Layer Sensitivity</span> defines who can access data layers — from fully public Open Data through to Secret classified layers. These populate the Sensitivity selector in the Data Layer form and control access policies.
            </div>
          </div>
        )}
      </div>

      {/* Main Table Surface */}
      <Surface className="p-4 flex flex-col justify-start">
        {/* Table Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs sm:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={
                  activeTab === "coverage"
                    ? "Search coverage areas..."
                    : activeTab === "geometry"
                      ? "Search geometry types..."
                      : activeTab === "datatypes"
                        ? "Search data types..."
                        : activeTab === "sensitivity"
                          ? "Search sensitivity levels..."
                          : "Search themes..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9.5 pl-9 text-xs"
              />
            </div>

            {/* Geometry tab specific category filter */}
            {activeTab === "geometry" && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px] h-9.5">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Vector">Vector</SelectItem>
                  <SelectItem value="Raster">Raster</SelectItem>
                  <SelectItem value="Tabular">Tabular</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Sensitivity levels filter */}
            {activeTab === "sensitivity" && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px] h-9.5">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-9.5">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-[11px] bg-foreground/[0.04] border border-border px-2 py-0.5 rounded-full text-muted-foreground font-semibold">
            {activeTab === "coverage" && `${filteredCoverage.length} of ${coverages.length}`}
            {activeTab === "geometry" && `${filteredGeometry.length} of ${geometries.length}`}
            {activeTab === "datatypes" && `${filteredDataTypes.length} of ${dataTypes.length}`}
            {activeTab === "sensitivity" && `${filteredSensitivity.length} of ${sensitivities.length}`}
            {activeTab === "themes" && `${filteredThemes.length} of ${themes.length}`}
          </span>
        </div>

        {/* Dynamic tables */}
        <div className="w-full overflow-x-auto rounded-xl border border-border/40">
          <Table>
            {/* Header Rendering */}
            <TableHeader>
              <TableRow className="bg-foreground/[0.01] whitespace-nowrap">
                <TableHead className="w-12 text-center">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary" />
                </TableHead>
                {activeTab === "coverage" && (
                  <>
                    <TableHead className="font-semibold text-muted-foreground text-xs">COVERAGE AREA</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">LEVEL</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">LAYER COUNT</TableHead>
                  </>
                )}
                {activeTab === "geometry" && (
                  <>
                    <TableHead className="font-semibold text-muted-foreground text-xs">GEOMETRY TYPE</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">CODE</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">CATEGORY</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">LAYER COUNT</TableHead>
                  </>
                )}
                {activeTab === "datatypes" && (
                  <>
                    <TableHead className="font-semibold text-muted-foreground text-xs">DATA TYPE</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">CODE</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">LAYER COUNT</TableHead>
                  </>
                )}
                {activeTab === "sensitivity" && (
                  <>
                    <TableHead className="font-semibold text-muted-foreground text-xs">NAME</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">DESCRIPTION</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">LEVEL</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">LAYER COUNT</TableHead>
                  </>
                )}
                {activeTab === "themes" && (
                  <>
                    <TableHead className="font-semibold text-muted-foreground text-xs">THEME</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">DESCRIPTION</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">LAYERS</TableHead>
                  </>
                )}
                <TableHead className="font-semibold text-muted-foreground text-xs text-center">STATUS</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-xs text-center">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>

            {/* Body Rendering */}
            <TableBody>
              {/* COVERAGE TABLE */}
              {activeTab === "coverage" && (
                filteredCoverage.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <MapPin className="h-6 w-6 text-muted-foreground/60" />
                        <p>No coverage areas found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoverage.map((item) => (
                    <TableRow key={item.id} className="hover:bg-foreground/[0.01]">
                      <TableCell className="text-center">
                        <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary" />
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">{item.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-semibold">{item.level}</TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs text-foreground">{item.layerCount}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            checked={item.active}
                            onCheckedChange={(val) => {
                              saveCoverages(coverages.map((c) => c.id === item.id ? { ...c, active: val } : c));
                              toast.success("Status updated");
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}

              {/* GEOMETRY TABLE */}
              {activeTab === "geometry" && (
                filteredGeometry.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Shapes className="h-6 w-6 text-muted-foreground/60" />
                        <p>No geometry types found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGeometry.map((item) => (
                    <TableRow key={item.id} className="hover:bg-foreground/[0.01]">
                      <TableCell className="text-center">
                        <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary" />
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">{item.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{item.code}</TableCell>
                      <TableCell className="text-xs text-foreground font-semibold">{item.category}</TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs text-foreground">{item.layerCount}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            checked={item.active}
                            onCheckedChange={(val) => {
                              saveGeometries(geometries.map((g) => g.id === item.id ? { ...g, active: val } : g));
                              toast.success("Status updated");
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}

              {/* DATA TYPES TABLE */}
              {activeTab === "datatypes" && (
                filteredDataTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FileCog className="h-6 w-6 text-muted-foreground/60" />
                        <p>No data types found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDataTypes.map((item) => (
                    <TableRow key={item.id} className="hover:bg-foreground/[0.01]">
                      <TableCell className="text-center">
                        <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary" />
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">{item.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{item.code}</TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs text-foreground">{item.layerCount}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            checked={item.active}
                            onCheckedChange={(val) => {
                              saveDataTypes(dataTypes.map((d) => d.id === item.id ? { ...d, active: val } : d));
                              toast.success("Status updated");
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}

              {/* LAYER SENSITIVITY TABLE */}
              {activeTab === "sensitivity" && (
                filteredSensitivity.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Shield className="h-6 w-6 text-muted-foreground/60" />
                        <p>No sensitivity levels found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSensitivity.map((item) => (
                    <TableRow key={item.id} className="hover:bg-foreground/[0.01]">
                      <TableCell className="text-center">
                        <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary" />
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">{item.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[280px] truncate" title={item.description}>
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.level === "Low"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : item.level === "Medium"
                              ? "bg-blue-500/10 text-blue-400"
                              : item.level === "High"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-red-500/10 text-red-400"
                        }`}>
                          {item.level}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs text-foreground">{item.layerCount}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            checked={item.active}
                            onCheckedChange={(val) => {
                              saveSensitivities(sensitivities.map((s) => s.id === item.id ? { ...s, active: val } : s));
                              toast.success("Status updated");
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}

              {/* DATA THEMES TABLE */}
              {activeTab === "themes" && (
                filteredThemes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Tags className="h-6 w-6 text-muted-foreground/60" />
                        <p>No data themes found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredThemes.map((item) => (
                    <TableRow key={item.id} className="hover:bg-foreground/[0.01]">
                      <TableCell className="text-center">
                        <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary" />
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">{item.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[320px] truncate" title={item.description}>
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs text-foreground">{item.layerCount}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            checked={item.active}
                            onCheckedChange={(val) => {
                              saveThemes(themes.map((t) => t.id === item.id ? { ...t, active: val } : t));
                              toast.success("Status updated");
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </div>
      </Surface>

      {/* ========================================== */}
      {/* MODAL: ADD / CREATE REFERENCE FIELD        */}
      {/* ========================================== */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[460px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-blue-400" />
              {activeTab === "coverage" && "Add Coverage Area"}
              {activeTab === "geometry" && "Add Geometry Type"}
              {activeTab === "datatypes" && "Add Data Type"}
              {activeTab === "sensitivity" && "Add Sensitivity Level"}
              {activeTab === "themes" && "Add Data Theme"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddConfiguration} className="space-y-4 mt-2">
            {/* Common Name/Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {activeTab === "coverage" && "Coverage Area Name"}
                {activeTab === "geometry" && "Geometry Type Name"}
                {activeTab === "datatypes" && "Data Type Name"}
                {activeTab === "sensitivity" && "Sensitivity Level Name"}
                {activeTab === "themes" && "Theme Title"}
                <span className="text-red-400"> *</span>
              </label>
              <Input
                placeholder={
                  activeTab === "coverage"
                    ? "e.g. Al Dhafra Region"
                    : activeTab === "geometry"
                      ? "e.g. Polygon"
                      : activeTab === "datatypes"
                        ? "e.g. GeoJSON"
                        : activeTab === "sensitivity"
                          ? "e.g. Confidential"
                          : "e.g. Base Map & Imagery"
                }
                value={nameField}
                onChange={(e) => setNameField(e.target.value)}
                required
                className="h-9.5"
              />
            </div>

            {/* Coverage Level Selector */}
            {activeTab === "coverage" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Level</label>
                <Input
                  placeholder="e.g. Emirate, Region, Sector, District"
                  value={levelField}
                  onChange={(e) => setLevelField(e.target.value)}
                  className="h-9.5"
                />
              </div>
            )}

            {/* Code (Short format) for Geometry & Data Types */}
            {(activeTab === "geometry" || activeTab === "datatypes") && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Short Code <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder={activeTab === "geometry" ? "e.g. PL" : "e.g. JSON"}
                  value={codeField}
                  onChange={(e) => setCodeField(e.target.value)}
                  required
                  maxLength={6}
                  className="h-9.5 uppercase font-mono"
                />
              </div>
            )}

            {/* Geometry Category Selector */}
            {activeTab === "geometry" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <Select value={categoryField} onValueChange={setCategoryField}>
                  <SelectTrigger className="h-9.5">
                    <SelectValue placeholder="Vector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vector">Vector</SelectItem>
                    <SelectItem value="Raster">Raster</SelectItem>
                    <SelectItem value="Tabular">Tabular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sensitivity Levels Selector */}
            {activeTab === "sensitivity" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Classification Rank</label>
                <Select value={levelField} onValueChange={setLevelField}>
                  <SelectTrigger className="h-9.5">
                    <SelectValue placeholder="Low" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Descriptions for Sensitivity & Themes */}
            {(activeTab === "sensitivity" || activeTab === "themes") && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <textarea
                  placeholder="Detail explanation for this classification..."
                  value={descriptionField}
                  onChange={(e) => setDescriptionField(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 font-semibold text-xs"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
