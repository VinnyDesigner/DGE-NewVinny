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
  Eye,
  Globe,
  Compass,
  FileSpreadsheet,
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
  description: string;
  code: string;
  category: string;
  layerCount: number;
  active: boolean;
}

interface DataType {
  id: string;
  name: string;
  description: string;
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

// Initial seed data lists matching screenshots exactly
const seedCoverage: CoverageArea[] = [
  { id: "cov_1", name: "Abu Dhabi Island", level: "Region", layerCount: 0, active: true },
  { id: "cov_2", name: "United Arab Emirates", level: "Country", layerCount: 0, active: true },
  { id: "cov_3", name: "Abu Dhabi Municipality", level: "Emirate", layerCount: 0, active: true },
  { id: "cov_4", name: "Al Ain Municipality", level: "Region", layerCount: 0, active: true },
  { id: "cov_5", name: "Al Dhafra Municipality", level: "Region", layerCount: 0, active: true },
];

const seedGeometry: GeometryType[] = [
  { id: "geom_1", name: "Point", description: "Point geometry", code: "POINT", category: "Vector", layerCount: 0, active: true },
  { id: "geom_2", name: "Polyline", description: "Line / polyline geometry", code: "POLYLINE", category: "Vector", layerCount: 0, active: true },
  { id: "geom_3", name: "Polygon", description: "Polygon geometry", code: "POLYGON", category: "Vector", layerCount: 0, active: true },
  { id: "geom_4", name: "Multipatch", description: "Multipatch / 3D geometry", code: "MULTIPATCH", category: "Vector", layerCount: 0, active: true },
  { id: "geom_5", name: "Tabular", description: "Tabular / non-spatial data", code: "TABULAR", category: "- None", layerCount: 0, active: true },
  { id: "geom_6", name: "Raster", description: "Raster / image dataset", code: "RASTER", category: "Raster", layerCount: 0, active: true },
  { id: "geom_7", name: "None", description: "No geometry / unknown", code: "NONE", category: "- None", layerCount: 0, active: true },
];

const seedDataTypes: DataType[] = [
  { id: "dt_1", name: "Vector", description: "Vector / spatial layer (points, lines, polygons...)", code: "VECTOR", layerCount: 0, active: true },
  { id: "dt_2", name: "Table", description: "Tabular / non-spatial dataset (no geometry)...", code: "TABLE", layerCount: 0, active: true },
  { id: "dt_3", name: "Raster", description: "Raster / image dataset", code: "RASTER", layerCount: 0, active: true },
];

const seedSensitivity: SensitivityLevel[] = [
  { id: "sens_1", name: "Open Data", description: "Publishable to the public", level: "L1", layerCount: 0, active: true },
  { id: "sens_2", name: "Restricted", description: "Internal use only", level: "L2", layerCount: 0, active: true },
  { id: "sens_3", name: "Sensitive", description: "Limited internal distribution", level: "L3", layerCount: 0, active: true },
  { id: "sens_4", name: "Secured", description: "Controlled / NDA required", level: "L4", layerCount: 0, active: true },
  { id: "sens_5", name: "Secret", description: "Classified, Restricted Distribution", level: "L5", layerCount: 0, active: true },
];

const seedThemes: DataTheme[] = [
  { id: "thm_1", name: "Dark Gray Canvas", description: "Dark gray canvas basemap", layerCount: 0, active: true },
  { id: "thm_2", name: "Environmental", description: "Environmental thematic", layerCount: 0, active: true },
  { id: "thm_3", name: "Government Standard", description: "Government standard thematic", layerCount: 0, active: true },
  { id: "thm_4", name: "Human Geography", description: "Human geography thematic", layerCount: 0, active: true },
  { id: "thm_5", name: "Imagery", description: "Aerial / satellite imagery", layerCount: 0, active: true },
  { id: "thm_6", name: "Infrastructure", description: "Infrastructure analytical", layerCount: 0, active: true },
  { id: "thm_7", name: "Light Gray Canvas", description: "Light gray canvas basemap", layerCount: 0, active: true },
  { id: "thm_8", name: "National Geographic", description: "National Geographic cartographic", layerCount: 0, active: true },
  { id: "thm_9", name: "Navigation", description: "Navigation basemap", layerCount: 0, active: true },
  { id: "thm_10", name: "Nova", description: "Nova dark canvas", layerCount: 0, active: true },
  { id: "thm_11", name: "Utility Networks", description: "Utility Networks basemap", layerCount: 0, active: true },
];

const STORAGE_KEYS = {
  COVERAGE: "dge_lc_coverage_v2",
  GEOMETRY: "dge_lc_geometry_v2",
  DATATYPES: "dge_lc_datatypes_v2",
  SENSITIVITY: "dge_lc_sensitivity_v2",
  THEMES: "dge_lc_themes_v2",
};

function LayerConfiguration() {
  const [activeTab, setActiveTab] = useState<"coverage" | "geometry" | "datatypes" | "sensitivity" | "themes">(
    "coverage"
  );

  // State managed collections (Initialize populated lists on first load)
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Reset filters & pagination on tab change
  useEffect(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  }, [activeTab]);

  // Reset current page when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  // Modal open states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected item reference for view / edit / delete
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form Fields
  const [nameField, setNameField] = useState("");
  const [levelField, setLevelField] = useState("");
  const [codeField, setCodeField] = useState("");
  const [categoryField, setCategoryField] = useState("");
  const [descriptionField, setDescriptionField] = useState("");
  const [activeField, setActiveField] = useState(true);

  // Helpers for badge mappings
  const getLevelBadge = (level: string) => {
    const normalized = level.toLowerCase();
    if (normalized === "country") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Globe className="h-3 w-3" /> Country
        </span>
      );
    }
    if (normalized === "emirate") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Compass className="h-3 w-3" /> Emirate
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
        <MapPin className="h-3 w-3" /> Region
      </span>
    );
  };

  const getGeometryCategoryBadge = (category: string) => {
    const normalized = category.toLowerCase();
    if (normalized === "vector") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Shapes className="h-3 w-3" /> Vector
        </span>
      );
    }
    if (normalized === "raster") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Layers className="h-3 w-3" /> Raster
        </span>
      );
    }
    return <span className="text-xs text-muted-foreground/60 font-semibold">— None</span>;
  };

  const getDataTypeCodeBadge = (code: string) => {
    const normalized = code.toLowerCase();
    if (normalized === "vector") {
      return (
        <span className="inline-block font-mono text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          VECTOR
        </span>
      );
    }
    if (normalized === "table") {
      return (
        <span className="inline-block font-mono text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          TABLE
        </span>
      );
    }
    return (
      <span className="inline-block font-mono text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
        RASTER
      </span>
    );
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Inactive
      </span>
    );
  };

  // Open modals & populate details
  const handleOpenAddModal = () => {
    setNameField("");
    setLevelField("");
    setCodeField("");
    setCategoryField("");
    setDescriptionField("");
    setActiveField(true);

    if (activeTab === "geometry") {
      setCategoryField("Vector");
    } else if (activeTab === "sensitivity") {
      setLevelField("L1");
    }
    setIsAddModalOpen(true);
  };

  const handleOpenViewModal = (item: any) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setSelectedItem(item);
    setNameField(item.name || "");
    setLevelField(item.level || "");
    setCodeField(item.code || "");
    setCategoryField(item.category || "");
    setDescriptionField(item.description || "");
    setActiveField(item.active);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (item: any) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  // Submission CRUD Actions
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
        level: levelField.trim() || "Region",
        layerCount: 0,
        active: activeField,
      };
      saveCoverages([...coverages, newCov]);
      toast.success(`Coverage Area "${newCov.name}" added successfully`);
    } else if (activeTab === "geometry") {
      const newGeom: GeometryType = {
        id: "geom_" + Math.random().toString(),
        name: nameField.trim(),
        description: descriptionField.trim() || "Geometry layer shape description",
        code: codeField.trim().toUpperCase() || "GEOM",
        category: categoryField,
        layerCount: 0,
        active: activeField,
      };
      saveGeometries([...geometries, newGeom]);
      toast.success(`Geometry Type "${newGeom.name}" added successfully`);
    } else if (activeTab === "datatypes") {
      const newDt: DataType = {
        id: "dt_" + Math.random().toString(),
        name: nameField.trim(),
        description: descriptionField.trim() || "File format type classification",
        code: codeField.trim().toUpperCase() || "CODE",
        layerCount: 0,
        active: activeField,
      };
      saveDataTypes([...dataTypes, newDt]);
      toast.success(`Data Type "${newDt.name}" added successfully`);
    } else if (activeTab === "sensitivity") {
      const newSens: SensitivityLevel = {
        id: "sens_" + Math.random().toString(),
        name: nameField.trim(),
        description: descriptionField.trim() || "Sensitivity classification rule",
        level: levelField || "L1",
        layerCount: 0,
        active: activeField,
      };
      saveSensitivities([...sensitivities, newSens]);
      toast.success(`Sensitivity Level "${newSens.name}" added successfully`);
    } else if (activeTab === "themes") {
      const newThm: DataTheme = {
        id: "thm_" + Math.random().toString(),
        name: nameField.trim(),
        description: descriptionField.trim() || "Visual mapping basemap grouping theme",
        layerCount: 0,
        active: activeField,
      };
      saveThemes([...themes, newThm]);
      toast.success(`Data Theme "${newThm.name}" added successfully`);
    }

    setIsAddModalOpen(false);
  };

  const handleEditConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (activeTab === "coverage") {
      const updated = coverages.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: nameField.trim(),
              level: levelField.trim() || "Region",
              active: activeField,
            }
          : item
      );
      saveCoverages(updated);
      toast.success("Coverage Area updated successfully");
    } else if (activeTab === "geometry") {
      const updated = geometries.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: nameField.trim(),
              description: descriptionField.trim(),
              code: codeField.trim().toUpperCase(),
              category: categoryField,
              active: activeField,
            }
          : item
      );
      saveGeometries(updated);
      toast.success("Geometry Type updated successfully");
    } else if (activeTab === "datatypes") {
      const updated = dataTypes.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: nameField.trim(),
              description: descriptionField.trim(),
              code: codeField.trim().toUpperCase(),
              active: activeField,
            }
          : item
      );
      saveDataTypes(updated);
      toast.success("Data Type updated successfully");
    } else if (activeTab === "sensitivity") {
      const updated = sensitivities.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: nameField.trim(),
              description: descriptionField.trim(),
              level: levelField,
              active: activeField,
            }
          : item
      );
      saveSensitivities(updated);
      toast.success("Sensitivity Level updated successfully");
    } else if (activeTab === "themes") {
      const updated = themes.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: nameField.trim(),
              description: descriptionField.trim(),
              active: activeField,
            }
          : item
      );
      saveThemes(updated);
      toast.success("Data Theme updated successfully");
    }

    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;

    if (activeTab === "coverage") {
      saveCoverages(coverages.filter((c) => c.id !== selectedItem.id));
    } else if (activeTab === "geometry") {
      saveGeometries(geometries.filter((g) => g.id !== selectedItem.id));
    } else if (activeTab === "datatypes") {
      saveDataTypes(dataTypes.filter((d) => d.id !== selectedItem.id));
    } else if (activeTab === "sensitivity") {
      saveSensitivities(sensitivities.filter((s) => s.id !== selectedItem.id));
    } else if (activeTab === "themes") {
      saveThemes(themes.filter((t) => t.id !== selectedItem.id));
    }

    toast.success(`"${selectedItem.name}" deleted successfully`);
    setIsDeleteModalOpen(false);
  };

  // Filter lists dynamically
  const filteredCoverage = useMemo(() => {
    return coverages.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.level.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" || (statusFilter === "active" ? item.active : !item.active);
      return matchSearch && matchStatus;
    });
  }, [coverages, searchQuery, statusFilter]);

  const filteredGeometry = useMemo(() => {
    return geometries.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" || (statusFilter === "active" ? item.active : !item.active);
      const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [geometries, searchQuery, statusFilter, categoryFilter]);

  const filteredDataTypes = useMemo(() => {
    return dataTypes.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" || (statusFilter === "active" ? item.active : !item.active);
      return matchSearch && matchStatus;
    });
  }, [dataTypes, searchQuery, statusFilter]);

  const filteredSensitivity = useMemo(() => {
    return sensitivities.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.level.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" || (statusFilter === "active" ? item.active : !item.active);
      const matchLevel = categoryFilter === "all" || item.level === categoryFilter;
      return matchSearch && matchStatus && matchLevel;
    });
  }, [sensitivities, searchQuery, statusFilter, categoryFilter]);

  const filteredThemes = useMemo(() => {
    return themes.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" || (statusFilter === "active" ? item.active : !item.active);
      return matchSearch && matchStatus;
    });
  }, [themes, searchQuery, statusFilter]);

  // Paginated Slices
  const getPaginatedList = (list: any[]) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return list.slice(startIndex, startIndex + rowsPerPage);
  };

  const getPageCount = (listLength: number) => {
    return Math.max(1, Math.ceil(listLength / rowsPerPage));
  };

  const paginatedCoverage = useMemo(() => getPaginatedList(filteredCoverage), [
    filteredCoverage,
    currentPage,
    rowsPerPage,
  ]);
  const paginatedGeometry = useMemo(() => getPaginatedList(filteredGeometry), [
    filteredGeometry,
    currentPage,
    rowsPerPage,
  ]);
  const paginatedDataTypes = useMemo(() => getPaginatedList(filteredDataTypes), [
    filteredDataTypes,
    currentPage,
    rowsPerPage,
  ]);
  const paginatedSensitivity = useMemo(() => getPaginatedList(filteredSensitivity), [
    filteredSensitivity,
    currentPage,
    rowsPerPage,
  ]);
  const paginatedThemes = useMemo(() => getPaginatedList(filteredThemes), [
    filteredThemes,
    currentPage,
    rowsPerPage,
  ]);

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
          className="h-9.5 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5 font-semibold text-xs shrink-0 self-start sm:self-center cursor-pointer"
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
            <Info className="h-4 w-4 shrink-0 mt-0.5 animate-pulse text-blue-400" />
            <div>
              <span className="font-bold text-foreground">Coverage Areas</span> define the geographic scope of data layers — from country level down to individual zones and districts. These become selectable options when configuring data layers, deliveries, and workflows.
            </div>
          </div>
        )}
        {activeTab === "geometry" && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 text-xs font-semibold leading-relaxed">
            <Info className="h-4 w-4 shrink-0 mt-0.5 animate-pulse text-purple-400" />
            <div>
              <span className="font-bold text-foreground">Geometry Types</span> define the spatial shape/structure of data layers — Vector (Points, Lines, Polygons), Raster grids, or Non-spatial. These populate the Geometry Type selector in Data Layers.
            </div>
          </div>
        )}
        {activeTab === "datatypes" && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold leading-relaxed">
            <Info className="h-4 w-4 shrink-0 mt-0.5 animate-pulse text-emerald-400" />
            <div>
              <span className="font-bold text-foreground">Data Types</span> categorise data layers by their file format and spatial nature — Vector, Raster, Ortho, LiDAR, DEM, DSM, Tabular, and more. These populate the Data Type selector in Data Layers.
            </div>
          </div>
        )}
        {activeTab === "sensitivity" && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-semibold leading-relaxed">
            <Info className="h-4 w-4 shrink-0 mt-0.5 animate-pulse text-blue-400" />
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
                  <SelectItem value="- None">- None</SelectItem>
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
                  <SelectItem value="L1">L1</SelectItem>
                  <SelectItem value="L2">L2</SelectItem>
                  <SelectItem value="L3">L3</SelectItem>
                  <SelectItem value="L4">L4</SelectItem>
                  <SelectItem value="L5">L5</SelectItem>
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
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary"
                  />
                </TableHead>
                {activeTab === "coverage" && (
                  <>
                    <TableHead className="font-semibold text-muted-foreground text-xs">
                      COVERAGE AREA
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">LEVEL</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">
                      LAYER COUNT
                    </TableHead>
                  </>
                )}
                {activeTab === "geometry" && (
                  <>
                    <TableHead className="font-semibold text-muted-foreground text-xs">
                      GEOMETRY TYPE
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">CODE</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">
                      CATEGORY
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">
                      LAYER COUNT
                    </TableHead>
                  </>
                )}
                {activeTab === "datatypes" && (
                  <>
                    <TableHead className="font-semibold text-muted-foreground text-xs">
                      DATA TYPE
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">CODE</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">
                      LAYER COUNT
                    </TableHead>
                  </>
                )}
                {activeTab === "sensitivity" && (
                  <>
                    <TableHead className="font-semibold text-muted-foreground text-xs">NAME</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">
                      DESCRIPTION
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">LEVEL</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">
                      LAYER COUNT
                    </TableHead>
                  </>
                )}
                {activeTab === "themes" && (
                  <>
                    <TableHead className="font-semibold text-muted-foreground text-xs">THEME</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">
                      DESCRIPTION
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">
                      LAYERS
                    </TableHead>
                  </>
                )}
                <TableHead className="font-semibold text-muted-foreground text-xs text-center">
                  STATUS
                </TableHead>
                <TableHead className="font-semibold text-muted-foreground text-xs text-center">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Body Rendering */}
            <TableBody>
              {/* COVERAGE TABLE */}
              {activeTab === "coverage" &&
                (paginatedCoverage.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-muted-foreground text-xs hover:bg-transparent"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.03] border border-border/40 text-muted-foreground/75">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                          No coverage areas found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCoverage.map((item) => (
                    <TableRow key={item.id} className="hover:bg-foreground/[0.01]">
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary"
                        />
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">{item.name}</TableCell>
                      <TableCell className="text-xs">{getLevelBadge(item.level)}</TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs text-muted-foreground">
                        {item.layerCount}
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.active)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-1.5 justify-center">
                          <button
                            onClick={() => handleOpenViewModal(item)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20 rounded-md cursor-pointer transition-colors"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 rounded-md cursor-pointer transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(item)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-md cursor-pointer transition-colors"
                            title="Delete"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ))}

              {/* GEOMETRY TABLE */}
              {activeTab === "geometry" &&
                (paginatedGeometry.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-16 text-muted-foreground text-xs hover:bg-transparent"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.03] border border-border/40 text-muted-foreground/75">
                          <Shapes className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                          No geometry types found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedGeometry.map((item) => (
                    <TableRow key={item.id} className="hover:bg-foreground/[0.01]">
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary"
                        />
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">
                        <div>{item.name}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">
                          {item.description}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        <span className="px-1.5 py-0.5 rounded bg-muted font-bold border text-[10px]">
                          {item.code}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">
                        {getGeometryCategoryBadge(item.category)}
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs text-muted-foreground">
                        {item.layerCount}
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.active)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-1.5 justify-center">
                          <button
                            onClick={() => handleOpenViewModal(item)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20 rounded-md cursor-pointer transition-colors"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 rounded-md cursor-pointer transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(item)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-md cursor-pointer transition-colors"
                            title="Delete"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ))}

              {/* DATA TYPES TABLE */}
              {activeTab === "datatypes" &&
                (paginatedDataTypes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-muted-foreground text-xs hover:bg-transparent"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.03] border border-border/40 text-muted-foreground/75">
                          <FileCog className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                          No data types found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDataTypes.map((item) => (
                    <TableRow key={item.id} className="hover:bg-foreground/[0.01]">
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary"
                        />
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">
                        <div>{item.name}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">
                          {item.description}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {getDataTypeCodeBadge(item.code)}
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs text-muted-foreground">
                        {item.layerCount}
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.active)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-1.5 justify-center">
                          <button
                            onClick={() => handleOpenViewModal(item)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20 rounded-md cursor-pointer transition-colors"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 rounded-md cursor-pointer transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(item)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-md cursor-pointer transition-colors"
                            title="Delete"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ))}

              {/* LAYER SENSITIVITY TABLE */}
              {activeTab === "sensitivity" &&
                (paginatedSensitivity.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-16 text-muted-foreground text-xs hover:bg-transparent"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.03] border border-border/40 text-muted-foreground/75">
                          <Shield className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                          No sensitivity levels found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSensitivity.map((item) => (
                    <TableRow key={item.id} className="hover:bg-foreground/[0.01]">
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary"
                        />
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.name === "Open Data"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : item.name === "Restricted"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : item.name === "Sensitive"
                                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                  : item.name === "Secured"
                                    ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {item.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-semibold">
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="text-xs font-mono font-bold text-muted-foreground/80">
                        {item.level}
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs text-muted-foreground">
                        {item.layerCount}
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.active)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-1.5 justify-center">
                          <button
                            onClick={() => handleOpenViewModal(item)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20 rounded-md cursor-pointer transition-colors"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 rounded-md cursor-pointer transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(item)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-md cursor-pointer transition-colors"
                            title="Delete"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ))}

              {/* DATA THEMES TABLE */}
              {activeTab === "themes" &&
                (paginatedThemes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-muted-foreground text-xs hover:bg-transparent"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.03] border border-border/40 text-muted-foreground/75">
                          <Tags className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                          No data themes found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedThemes.map((item) => (
                    <TableRow key={item.id} className="hover:bg-foreground/[0.01]">
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary"
                        />
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">{item.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-semibold">
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-xs text-muted-foreground">
                        {item.layerCount}
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(item.active)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-1.5 justify-center">
                          <button
                            onClick={() => handleOpenViewModal(item)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20 rounded-md cursor-pointer transition-colors"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 rounded-md cursor-pointer transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(item)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-md cursor-pointer transition-colors"
                            title="Delete"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Custom Pagination Footer matching Screenshots */}
        <div className="flex items-center justify-between border-t border-border/30 pt-4 mt-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[11px]">Rows per page</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(val) => {
                setRowsPerPage(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[70px] h-8 text-[11px] font-bold">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-border/40 hover:bg-foreground/[0.02] text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              Previous
            </button>

            {/* Current Page Number Buttons */}
            {Array.from(
              {
                length: getPageCount(
                  activeTab === "coverage"
                    ? filteredCoverage.length
                    : activeTab === "geometry"
                      ? filteredGeometry.length
                      : activeTab === "datatypes"
                        ? filteredDataTypes.length
                        : activeTab === "sensitivity"
                          ? filteredSensitivity.length
                          : filteredThemes.length
                ),
              },
              (_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold transition-all border cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border/40 hover:bg-foreground/[0.02] hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}

            <span className="text-muted-foreground px-1">
              of{" "}
              {getPageCount(
                activeTab === "coverage"
                  ? filteredCoverage.length
                  : activeTab === "geometry"
                    ? filteredGeometry.length
                    : activeTab === "datatypes"
                      ? filteredDataTypes.length
                      : activeTab === "sensitivity"
                        ? filteredSensitivity.length
                        : filteredThemes.length
              )}
            </span>

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(
                    getPageCount(
                      activeTab === "coverage"
                        ? filteredCoverage.length
                        : activeTab === "geometry"
                          ? filteredGeometry.length
                          : activeTab === "datatypes"
                            ? filteredDataTypes.length
                            : activeTab === "sensitivity"
                              ? filteredSensitivity.length
                              : filteredThemes.length
                    ),
                    p + 1
                  )
                )
              }
              disabled={
                currentPage ===
                getPageCount(
                  activeTab === "coverage"
                    ? filteredCoverage.length
                    : activeTab === "geometry"
                      ? filteredGeometry.length
                      : activeTab === "datatypes"
                        ? filteredDataTypes.length
                        : activeTab === "sensitivity"
                          ? filteredSensitivity.length
                          : filteredThemes.length
                )
              }
              className="px-3 py-1.5 rounded-lg border border-border/40 hover:bg-foreground/[0.02] text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </Surface>

      {/* ========================================== */}
      {/* MODAL: ADD / CREATE REFERENCE FIELD        */}
      {/* ========================================== */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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
                    ? "e.g. Al Dhafra Municipality"
                    : activeTab === "geometry"
                      ? "e.g. Polygon"
                      : activeTab === "datatypes"
                        ? "e.g. GeoJSON"
                        : activeTab === "sensitivity"
                          ? "e.g. Confidential"
                          : "e.g. Navigation"
                }
                value={nameField}
                onChange={(e) => setNameField(e.target.value)}
                required
                className="h-9.5"
              />
            </div>

            {activeTab === "coverage" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Level</label>
                <Select value={levelField} onValueChange={setLevelField}>
                  <SelectTrigger className="h-9.5">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Region">Region</SelectItem>
                    <SelectItem value="Country">Country</SelectItem>
                    <SelectItem value="Emirate">Emirate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {(activeTab === "geometry" || activeTab === "datatypes") && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Short Code <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder={activeTab === "geometry" ? "e.g. PL" : "e.g. VECTOR"}
                  value={codeField}
                  onChange={(e) => setCodeField(e.target.value)}
                  required
                  maxLength={12}
                  className="h-9.5 uppercase font-mono"
                />
              </div>
            )}

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
                    <SelectItem value="- None">- None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "sensitivity" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Classification Rank
                </label>
                <Select value={levelField} onValueChange={setLevelField}>
                  <SelectTrigger className="h-9.5">
                    <SelectValue placeholder="L1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L1">L1</SelectItem>
                    <SelectItem value="L2">L2</SelectItem>
                    <SelectItem value="L3">L3</SelectItem>
                    <SelectItem value="L4">L4</SelectItem>
                    <SelectItem value="L5">L5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab !== "coverage" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <textarea
                  placeholder="Detail explanation..."
                  value={descriptionField}
                  onChange={(e) => setDescriptionField(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Active Status</label>
                <Switch checked={activeField} onCheckedChange={setActiveField} />
              </div>
              <div className="flex gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 px-4 font-semibold text-xs cursor-pointer"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================== */}
      {/* MODAL: VIEW ITEM DETAILS                   */}
      {/* ========================================== */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-[440px] border border-border/85 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-2.5">
              <Eye className="h-4.5 w-4.5 text-blue-400" />
              Reference Details
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <div className="text-muted-foreground font-semibold">Name:</div>
                <div className="col-span-2 text-foreground font-bold">{selectedItem.name}</div>
              </div>

              {selectedItem.description && (
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <div className="text-muted-foreground font-semibold">Description:</div>
                  <div className="col-span-2 text-muted-foreground font-medium whitespace-pre-wrap leading-relaxed">
                    {selectedItem.description}
                  </div>
                </div>
              )}

              {selectedItem.level && (
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <div className="text-muted-foreground font-semibold">Level / Rank:</div>
                  <div className="col-span-2">{getLevelBadge(selectedItem.level)}</div>
                </div>
              )}

              {selectedItem.code && (
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <div className="text-muted-foreground font-semibold">Code:</div>
                  <div className="col-span-2 font-mono font-bold text-foreground bg-foreground/[0.04] border border-border/40 px-2 py-0.5 rounded w-max">
                    {selectedItem.code}
                  </div>
                </div>
              )}

              {selectedItem.category && (
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <div className="text-muted-foreground font-semibold">Category:</div>
                  <div className="col-span-2">{getGeometryCategoryBadge(selectedItem.category)}</div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <div className="text-muted-foreground font-semibold">Layer Count:</div>
                <div className="col-span-2 font-mono font-bold text-foreground">
                  {selectedItem.layerCount}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-xs border-t border-border/30 pt-3">
                <div className="text-muted-foreground font-semibold">Status:</div>
                <div className="col-span-2">{getStatusBadge(selectedItem.active)}</div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => setIsViewModalOpen(false)}
              className="h-8.5 px-4 font-semibold text-xs cursor-pointer"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================== */}
      {/* MODAL: EDIT ITEM DETAILS                   */}
      {/* ========================================== */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[460px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-2.5">
              <Pencil className="h-4.5 w-4.5 text-amber-400" />
              Edit Reference Item
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditConfiguration} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Name</label>
              <Input
                value={nameField}
                onChange={(e) => setNameField(e.target.value)}
                required
                className="h-9.5 font-bold"
              />
            </div>

            {activeTab === "coverage" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Level</label>
                <Select value={levelField} onValueChange={setLevelField}>
                  <SelectTrigger className="h-9.5">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Region">Region</SelectItem>
                    <SelectItem value="Country">Country</SelectItem>
                    <SelectItem value="Emirate">Emirate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {(activeTab === "geometry" || activeTab === "datatypes") && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Short Code</label>
                <Input
                  value={codeField}
                  onChange={(e) => setCodeField(e.target.value)}
                  required
                  maxLength={12}
                  className="h-9.5 uppercase font-mono font-bold"
                />
              </div>
            )}

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
                    <SelectItem value="- None">- None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "sensitivity" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Classification Rank
                </label>
                <Select value={levelField} onValueChange={setLevelField}>
                  <SelectTrigger className="h-9.5">
                    <SelectValue placeholder="L1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L1">L1</SelectItem>
                    <SelectItem value="L2">L2</SelectItem>
                    <SelectItem value="L3">L3</SelectItem>
                    <SelectItem value="L4">L4</SelectItem>
                    <SelectItem value="L5">L5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab !== "coverage" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <textarea
                  value={descriptionField}
                  onChange={(e) => setDescriptionField(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-muted-foreground">Active Status</label>
                <Switch checked={activeField} onCheckedChange={setActiveField} />
              </div>
              <div className="flex gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 px-4 font-semibold text-xs cursor-pointer"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs cursor-pointer"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================== */}
      {/* MODAL: DELETE CONFIRMATION                 */}
      {/* ========================================== */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-[400px] border border-red-500/30 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-400 flex items-center gap-2">
              <Trash className="h-4.5 w-4.5" />
              Confirm Delete
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-3 py-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to delete the reference item{" "}
                <span className="font-bold text-foreground">"{selectedItem.name}"</span>? This
                action cannot be undone and may affect configurations linked to this record.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="h-8.5 px-4 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="h-8.5 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs cursor-pointer"
            >
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
