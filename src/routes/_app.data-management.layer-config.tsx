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
  AlertTriangle,
  FolderOpen,
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

// Interfaces with detailed fields matching screenshot history & metadata
interface CoverageArea {
  id: string;
  name: string;
  level: string;
  displayOrder: number;
  active: boolean;
  layerCount: number;
  created: string;
  createdBy: string;
  updated: string;
  updatedBy: string;
}

interface GeometryType {
  id: string;
  name: string;
  description: string;
  code: string;
  category: string;
  displayOrder: number;
  active: boolean;
  layerCount: number;
  created: string;
  createdBy: string;
  updated: string;
  updatedBy: string;
}

interface DataType {
  id: string;
  name: string;
  description: string;
  code: string;
  displayOrder: number;
  active: boolean;
  layerCount: number;
  created: string;
  createdBy: string;
  updated: string;
  updatedBy: string;
}

interface SensitivityLevel {
  id: string;
  name: string;
  description: string;
  level: string;
  displayOrder: number;
  active: boolean;
  layerCount: number;
  created: string;
  createdBy: string;
  updated: string;
  updatedBy: string;
}

interface DataTheme {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  active: boolean;
  layerCount: number;
  created: string;
  createdBy: string;
  updated: string;
  updatedBy: string;
}

// Initial seed data lists matching screenshots exactly
const seedCoverage: CoverageArea[] = [
  { id: "cov_1", name: "Abu Dhabi Island", level: "Region", displayOrder: 1, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "cov_2", name: "United Arab Emirates", level: "Country", displayOrder: 2, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "cov_3", name: "Abu Dhabi Municipality", level: "Emirate", displayOrder: 3, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "cov_4", name: "Al Ain Municipality", level: "Region", displayOrder: 4, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "cov_5", name: "Al Dhafra Municipality", level: "Region", displayOrder: 5, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
];

const seedGeometry: GeometryType[] = [
  { id: "geom_1", name: "Point", description: "Point geometry", code: "POINT", category: "Vector", displayOrder: 1, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "geom_2", name: "Polyline", description: "Line / polyline geometry", code: "POLYLINE", category: "Vector", displayOrder: 2, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "geom_3", name: "Polygon", description: "Polygon geometry", code: "POLYGON", category: "Vector", displayOrder: 3, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "geom_4", name: "Multipatch", description: "Multipatch / 3D geometry", code: "MULTIPATCH", category: "Vector", displayOrder: 4, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "geom_5", name: "Tabular", description: "Tabular / non-spatial data", code: "TABULAR", category: "- None", displayOrder: 5, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "geom_6", name: "Raster", description: "Raster / image dataset", code: "RASTER", category: "Raster", displayOrder: 6, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "geom_7", name: "None", description: "No geometry / unknown", code: "NONE", category: "- None", displayOrder: 7, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
];

const seedDataTypes: DataType[] = [
  { id: "dt_1", name: "Vector", description: "Vector / spatial layer (points, lines, polygons...)", code: "VECTOR", displayOrder: 1, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "dt_2", name: "Table", description: "Tabular / non-spatial dataset (no geometry)...", code: "TABLE", displayOrder: 2, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "dt_3", name: "Raster", description: "Raster / image dataset", code: "RASTER", displayOrder: 3, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
];

const seedSensitivity: SensitivityLevel[] = [
  { id: "sens_1", name: "Open Data", description: "Publishable to the public", level: "L1", displayOrder: 1, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "sens_2", name: "Restricted", description: "Internal use only", level: "L2", displayOrder: 2, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "sens_3", name: "Sensitive", description: "Limited internal distribution", level: "L3", displayOrder: 3, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "sens_4", name: "Secured", description: "Controlled / NDA required", level: "L4", displayOrder: 4, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "sens_5", name: "Secret", description: "Classified, Restricted Distribution", level: "L5", displayOrder: 5, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
];

const seedThemes: DataTheme[] = [
  { id: "thm_1", name: "Dark Gray Canvas", description: "Dark gray canvas basemap", displayOrder: 1, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "thm_2", name: "Environmental", description: "Environmental thematic", displayOrder: 2, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "thm_3", name: "Government Standard", description: "Government standard thematic", displayOrder: 3, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "thm_4", name: "Human Geography", description: "Human geography thematic", displayOrder: 4, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "thm_5", name: "Imagery", description: "Aerial / satellite imagery", displayOrder: 5, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "thm_6", name: "Infrastructure", description: "Infrastructure analytical", displayOrder: 6, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "thm_7", name: "Light Gray Canvas", description: "Light gray canvas basemap", displayOrder: 7, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "thm_8", name: "National Geographic", description: "National Geographic cartographic", displayOrder: 8, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "thm_9", name: "Navigation", description: "Navigation basemap", displayOrder: 9, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "thm_10", name: "Nova", description: "Nova dark canvas", displayOrder: 10, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
  { id: "thm_11", name: "Utility Networks", description: "Utility Networks basemap", displayOrder: 11, active: true, layerCount: 0, created: "02/05/2026, 01:19 PM", createdBy: "system", updated: "07/05/2026, 10:49 PM", updatedBy: "api" },
];

const STORAGE_KEYS = {
  COVERAGE: "dge_lc_coverage_v3",
  GEOMETRY: "dge_lc_geometry_v3",
  DATATYPES: "dge_lc_datatypes_v3",
  SENSITIVITY: "dge_lc_sensitivity_v3",
  THEMES: "dge_lc_themes_v3",
};

function LayerConfiguration() {
  const [activeTab, setActiveTab] = useState<"coverage" | "geometry" | "datatypes" | "sensitivity" | "themes">(
    "coverage"
  );

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

  // Form Fields matching screenshot inputs exactly
  const [nameField, setNameField] = useState("");
  const [levelField, setLevelField] = useState("Region");
  const [codeField, setCodeField] = useState("");
  const [categoryField, setCategoryField] = useState("");
  const [descriptionField, setDescriptionField] = useState("");
  const [activeField, setActiveField] = useState(true);
  const [displayOrderField, setDisplayOrderField] = useState(1);

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
    setLevelField("Emirate"); // Default level selected in dropdown
    setCodeField("");
    setCategoryField("Vector");
    setDescriptionField("");
    setActiveField(true);
    setDisplayOrderField(1);
    setIsAddModalOpen(true);
  };

  const handleOpenViewModal = (item: any) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setSelectedItem(item);
    setNameField(item.name || "");
    setLevelField(item.level || "Region");
    setCodeField(item.code || "");
    setCategoryField(item.category || "Vector");
    setDescriptionField(item.description || "");
    setActiveField(item.active);
    setDisplayOrderField(item.displayOrder || 1);
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

    const createdTime = new Date().toLocaleString();

    if (activeTab === "coverage") {
      const newCov: CoverageArea = {
        id: "cov_" + Math.random().toString(),
        name: nameField.trim(),
        level: levelField,
        displayOrder: displayOrderField,
        active: activeField,
        layerCount: 0,
        created: createdTime,
        createdBy: "system",
        updated: createdTime,
        updatedBy: "api",
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
        displayOrder: displayOrderField,
        layerCount: 0,
        active: activeField,
        created: createdTime,
        createdBy: "system",
        updated: createdTime,
        updatedBy: "api",
      };
      saveGeometries([...geometries, newGeom]);
      toast.success(`Geometry Type "${newGeom.name}" added successfully`);
    } else if (activeTab === "datatypes") {
      const newDt: DataType = {
        id: "dt_" + Math.random().toString(),
        name: nameField.trim(),
        description: descriptionField.trim() || "File format type classification",
        code: codeField.trim().toUpperCase() || "CODE",
        displayOrder: displayOrderField,
        layerCount: 0,
        active: activeField,
        created: createdTime,
        createdBy: "system",
        updated: createdTime,
        updatedBy: "api",
      };
      saveDataTypes([...dataTypes, newDt]);
      toast.success(`Data Type "${newDt.name}" added successfully`);
    } else if (activeTab === "sensitivity") {
      const newSens: SensitivityLevel = {
        id: "sens_" + Math.random().toString(),
        name: nameField.trim(),
        description: descriptionField.trim() || "Sensitivity classification rule",
        level: levelField || "L1",
        displayOrder: displayOrderField,
        layerCount: 0,
        active: activeField,
        created: createdTime,
        createdBy: "system",
        updated: createdTime,
        updatedBy: "api",
      };
      saveSensitivities([...sensitivities, newSens]);
      toast.success(`Sensitivity Level "${newSens.name}" added successfully`);
    } else if (activeTab === "themes") {
      const newThm: DataTheme = {
        id: "thm_" + Math.random().toString(),
        name: nameField.trim(),
        description: descriptionField.trim() || "Visual mapping basemap grouping theme",
        displayOrder: displayOrderField,
        layerCount: 0,
        active: activeField,
        created: createdTime,
        createdBy: "system",
        updated: createdTime,
        updatedBy: "api",
      };
      saveThemes([...themes, newThm]);
      toast.success(`Data Theme "${newThm.name}" added successfully`);
    }

    setIsAddModalOpen(false);
  };

  const handleEditConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const updatedTime = new Date().toLocaleString();

    if (activeTab === "coverage") {
      const updated = coverages.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: nameField.trim(),
              level: levelField,
              displayOrder: displayOrderField,
              active: activeField,
              updated: updatedTime,
              updatedBy: "api",
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
              displayOrder: displayOrderField,
              active: activeField,
              updated: updatedTime,
              updatedBy: "api",
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
              displayOrder: displayOrderField,
              active: activeField,
              updated: updatedTime,
              updatedBy: "api",
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
              displayOrder: displayOrderField,
              active: activeField,
              updated: updatedTime,
              updatedBy: "api",
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
              displayOrder: displayOrderField,
              active: activeField,
              updated: updatedTime,
              updatedBy: "api",
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
      <div className="flex flex-col gap-4 pb-1">
        <PageHeader
          title="Layer Configuration"
          description="Manage configurable reference data for Data Layers — Coverage Areas, Geometry Types, Data Types, and Sensitivity Levels"
          className="mb-0!"
        />
      </div>

      {/* Main Container Surface wrapping Tabs, Instruction & Table */}
      <Surface className="p-0 border border-border/40 bg-card overflow-hidden rounded-2xl shadow-glow">
        
        {/* Tabs navigation at the top inside the container card */}
        <div className="flex flex-wrap gap-1 bg-foreground/[0.02] border-b border-border/30 px-4 pt-3.5">
          <button
            onClick={() => setActiveTab("coverage")}
            className={`px-4 pb-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "coverage"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" /> Coverage Areas
          </button>
          <button
            onClick={() => setActiveTab("geometry")}
            className={`px-4 pb-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "geometry"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shapes className="h-3.5 w-3.5" /> Geometry Types
          </button>
          <button
            onClick={() => setActiveTab("datatypes")}
            className={`px-4 pb-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "datatypes"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCog className="h-3.5 w-3.5" /> Data Types
          </button>
          <button
            onClick={() => setActiveTab("sensitivity")}
            className={`px-4 pb-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "sensitivity"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="h-3.5 w-3.5" /> Layer Sensitivity
          </button>
          <button
            onClick={() => setActiveTab("themes")}
            className={`px-4 pb-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "themes"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Tags className="h-3.5 w-3.5" /> Data Themes
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Tabs instruction cards inside the container */}
          {activeTab === "coverage" && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-semibold leading-relaxed">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-400" />
              <div>
                <span className="font-bold text-foreground">Coverage Areas</span> define the geographic scope of data layers — from country level down to individual zones and districts. These become selectable options when configuring data layers, deliveries, and workflows.
              </div>
            </div>
          )}
          {activeTab === "geometry" && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 text-xs font-semibold leading-relaxed">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-purple-400" />
              <div>
                <span className="font-bold text-foreground">Geometry Types</span> define the spatial shape/structure of data layers — Vector (Points, Lines, Polygons), Raster grids, or Non-spatial. These populate the Geometry Type selector in Data Layers.
              </div>
            </div>
          )}
          {activeTab === "datatypes" && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold leading-relaxed">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <span className="font-bold text-foreground">Data Types</span> categorise data layers by their file format and spatial nature — Vector, Raster, Ortho, LiDAR, DEM, DSM, Tabular, and more. These populate the Data Type selector in Data Layers.
              </div>
            </div>
          )}
          {activeTab === "sensitivity" && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-semibold leading-relaxed">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-400" />
              <div>
                <span className="font-bold text-foreground">Layer Sensitivity</span> defines who can access data layers — from fully public Open Data through to Secret classified layers. These populate the Sensitivity selector in the Data Layer form and control access policies.
              </div>
            </div>
          )}

          {/* Table Filter Bar & Add button on right side */}
          <div className="flex flex-wrap items-center justify-between gap-3">
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
                  <SelectTrigger className="w-[140px] h-9.5 text-xs font-semibold">
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
                  <SelectTrigger className="w-[140px] h-9.5 text-xs font-semibold">
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
                <SelectTrigger className="w-[130px] h-9.5 text-xs font-semibold">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleOpenAddModal}
                className="h-9.5 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5 font-semibold text-xs shrink-0 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                {activeTab === "coverage" && "Add Coverage Area"}
                {activeTab === "geometry" && "Add Geometry Type"}
                {activeTab === "datatypes" && "Add Data Type"}
                {activeTab === "sensitivity" && "Add Sensitivity Level"}
                {activeTab === "themes" && "New Theme"}
              </Button>
            </div>
          </div>

          {/* Dynamic tables */}
          <div className="w-full overflow-x-auto rounded-xl border border-border/30 bg-background/50">
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
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">
                        COVERAGE AREA
                      </TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">LEVEL</TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs text-center">
                        LAYER COUNT
                      </TableHead>
                    </>
                  )}
                  {activeTab === "geometry" && (
                    <>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">
                        GEOMETRY TYPE
                      </TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">CODE</TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">
                        CATEGORY
                      </TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs text-center">
                        LAYER COUNT
                      </TableHead>
                    </>
                  )}
                  {activeTab === "datatypes" && (
                    <>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">
                        DATA TYPE
                      </TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">CODE</TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs text-center">
                        LAYER COUNT
                      </TableHead>
                    </>
                  )}
                  {activeTab === "sensitivity" && (
                    <>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">NAME</TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">
                        DESCRIPTION
                      </TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">LEVEL</TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs text-center">
                        LAYER COUNT
                      </TableHead>
                    </>
                  )}
                  {activeTab === "themes" && (
                    <>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">THEME</TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs">
                        DESCRIPTION
                      </TableHead>
                      <TableHead className="font-bold text-muted-foreground/90 text-xs text-center">
                        LAYERS
                      </TableHead>
                    </>
                  )}
                  <TableHead className="font-bold text-muted-foreground/90 text-xs text-center">
                    STATUS
                  </TableHead>
                  <TableHead className="font-bold text-muted-foreground/90 text-xs text-center">
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
                            className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold ${
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
          <div className="flex items-center justify-between border-t border-border/30 pt-4 mt-2 text-xs font-semibold">
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
                className="px-3 py-1.5 rounded-lg border border-border/40 hover:bg-foreground/[0.02] text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer text-xs"
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
                      className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold transition-all border cursor-pointer text-xs ${
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
                className="px-3 py-1.5 rounded-lg border border-border/40 hover:bg-foreground/[0.02] text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer text-xs"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </Surface>

      {/* ============================================== */}
      {/* 1st & 2nd IMAGE: ADD/CREATE COVERAGE AREA MODAL */}
      {/* ============================================== */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-[500px] border border-border bg-[#0B1220] p-0 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#131C2E] px-6 py-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-[14px] font-bold text-foreground leading-normal">
                  Add Coverage Area
                </DialogTitle>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                  {levelField || "EMIRATE"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <form onSubmit={handleAddConfiguration} className="p-6 space-y-5">
            {/* Identity section */}
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold text-muted-foreground/75 tracking-wider uppercase">
                Identity
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[10px] text-muted-foreground/50">{nameField.length}/200</span>
                </div>
                <Input
                  placeholder="e.g. Abu Dhabi Island"
                  value={nameField}
                  onChange={(e) => setNameField(e.target.value.slice(0, 200))}
                  required
                  className="h-10 bg-[#0E1726]/75 border-border/60 text-xs focus:ring-primary"
                />
              </div>
            </div>

            {/* Classification Section (2nd image drop-down content) */}
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold text-muted-foreground/75 tracking-wider uppercase">
                Classification
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Coverage Level <span className="text-red-400">*</span>
                </label>
                <Select value={levelField} onValueChange={setLevelField}>
                  <SelectTrigger className="h-10 bg-[#0E1726]/75 border-border/60 text-xs text-foreground cursor-pointer">
                    <SelectValue placeholder="Emirate" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111A2C] border-border text-xs">
                    <SelectItem value="Country">Country</SelectItem>
                    <SelectItem value="Emirate">Emirate</SelectItem>
                    <SelectItem value="City">City</SelectItem>
                    <SelectItem value="Region">Region</SelectItem>
                    <SelectItem value="District">District</SelectItem>
                    <SelectItem value="Zone">Zone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Visibility Section */}
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold text-muted-foreground/75 tracking-wider uppercase">
                Visibility
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Status</label>
                  <Select
                    value={activeField ? "active" : "inactive"}
                    onValueChange={(val) => setActiveField(val === "active")}
                  >
                    <SelectTrigger className="h-10 bg-[#0E1726]/75 border-border/60 text-xs text-foreground cursor-pointer">
                      <SelectValue placeholder="Active" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111A2C] border-border text-xs">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground/50 mt-1 leading-normal">
                    Inactive areas are hidden from operational dropdowns.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Display Order</label>
                  <Input
                    type="number"
                    value={displayOrderField}
                    onChange={(e) => setDisplayOrderField(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-10 bg-[#0E1726]/75 border-border/60 text-xs focus:ring-primary"
                  />
                  <p className="text-[10px] text-muted-foreground/50 mt-1 leading-normal">
                    Lower numbers appear first in dropdowns.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-border/30">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 font-bold text-xs bg-transparent border-border/80 hover:bg-[#131C2E] hover:text-foreground cursor-pointer text-muted-foreground rounded-lg transition-colors"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs rounded-lg cursor-pointer transition-colors"
              >
                Add Coverage Area
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================== */}
      {/* 3rd IMAGE: VIEW COVERAGE AREA DETAILS     */}
      {/* ========================================== */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-[500px] border border-border bg-[#0B1220] p-0 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#131C2E] px-6 py-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-[14px] font-bold text-foreground leading-normal">
                  View Coverage Area
                </DialogTitle>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wider">
                  <span>{selectedItem?.level || "REGION"}</span>
                  <span className="text-muted-foreground/45">•</span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {selectedItem && (
            <div className="p-6 space-y-5">
              {/* Identity view */}
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-muted-foreground/75 tracking-wider uppercase">
                  Identity
                </div>
                <div className="text-[15px] font-bold text-foreground">{selectedItem.name}</div>
                
                {/* Linked Layers container */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/50 bg-[#121A2A] text-xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                    <FolderOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-indigo-400 tracking-wider uppercase leading-none">
                      Linked Layers
                    </div>
                    <div className="text-xs text-muted-foreground/90 font-bold mt-1.5 leading-none">
                      {selectedItem.layerCount} linked layers
                    </div>
                  </div>
                </div>
              </div>

              {/* Classification view */}
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-muted-foreground/75 tracking-wider uppercase">
                  Classification
                </div>
                <div className="flex items-center justify-between border-b border-border/20 pb-2 text-xs">
                  <span className="text-muted-foreground font-semibold">Coverage Level</span>
                  <span>{getLevelBadge(selectedItem.level)}</span>
                </div>
              </div>

              {/* Visibility view */}
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-muted-foreground/75 tracking-wider uppercase">
                  Visibility
                </div>
                <div className="flex items-center justify-between border-b border-border/20 pb-2 text-xs">
                  <span className="text-muted-foreground font-semibold">Status</span>
                  <span>{getStatusBadge(selectedItem.active)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/20 pb-2 text-xs">
                  <span className="text-muted-foreground font-semibold">Display Order</span>
                  <span className="font-bold text-foreground font-mono">{selectedItem.displayOrder}</span>
                </div>
              </div>

              {/* History view */}
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-muted-foreground/75 tracking-wider uppercase">
                  History
                </div>
                <div className="border border-border/40 rounded-xl overflow-hidden text-xs bg-foreground/[0.01]">
                  <div className="flex justify-between border-b border-border/20 px-3.5 py-2">
                    <span className="text-muted-foreground font-semibold">Created</span>
                    <span className="text-foreground font-medium font-mono">{selectedItem.created}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/20 px-3.5 py-2">
                    <span className="text-muted-foreground font-semibold">Created By</span>
                    <span className="text-foreground font-bold">{selectedItem.createdBy}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/20 px-3.5 py-2">
                    <span className="text-muted-foreground font-semibold">Updated</span>
                    <span className="text-foreground font-medium font-mono">{selectedItem.updated}</span>
                  </div>
                  <div className="flex justify-between px-3.5 py-2">
                    <span className="text-muted-foreground font-semibold">Updated By</span>
                    <span className="text-foreground font-bold">{selectedItem.updatedBy}</span>
                  </div>
                </div>
              </div>

              {/* Footer buttons with Edit & Delete on left and Close on right */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleOpenEditModal(selectedItem);
                    }}
                    className="h-8.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer rounded-lg transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleOpenDeleteModal(selectedItem);
                    }}
                    className="h-8.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:text-red-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer rounded-lg transition-colors"
                  >
                    <Trash className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
                <Button
                  onClick={() => setIsViewModalOpen(false)}
                  variant="outline"
                  className="h-8.5 px-4 font-bold text-xs border-border/80 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg transition-colors"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================== */}
      {/* 4th IMAGE: EDIT COVERAGE AREA DETAILS     */}
      {/* ========================================== */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[500px] border border-border bg-[#0B1220] p-0 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#131C2E] px-6 py-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-[14px] font-bold text-foreground leading-normal">
                  Edit Coverage Area
                </DialogTitle>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wider">
                  <span>{selectedItem?.level || "REGION"}</span>
                  <span className="text-muted-foreground/45">•</span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <form onSubmit={handleEditConfiguration} className="p-6 space-y-5">
            {/* Identity section */}
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold text-muted-foreground/75 tracking-wider uppercase">
                Identity
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[10px] text-muted-foreground/50">{nameField.length}/200</span>
                </div>
                <Input
                  value={nameField}
                  onChange={(e) => setNameField(e.target.value.slice(0, 200))}
                  required
                  className="h-10 bg-[#0E1726]/75 border-border/60 text-xs font-bold focus:ring-primary"
                />
              </div>
            </div>

            {/* Classification Section */}
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold text-muted-foreground/75 tracking-wider uppercase">
                Classification
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Coverage Level <span className="text-red-400">*</span>
                </label>
                <Select value={levelField} onValueChange={setLevelField}>
                  <SelectTrigger className="h-10 bg-[#0E1726]/75 border-border/60 text-xs text-foreground cursor-pointer">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111A2C] border-border text-xs">
                    <SelectItem value="Country">Country</SelectItem>
                    <SelectItem value="Emirate">Emirate</SelectItem>
                    <SelectItem value="City">City</SelectItem>
                    <SelectItem value="Region">Region</SelectItem>
                    <SelectItem value="District">District</SelectItem>
                    <SelectItem value="Zone">Zone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Visibility Section */}
            <div className="space-y-2">
              <div className="text-[10px] font-extrabold text-muted-foreground/75 tracking-wider uppercase">
                Visibility
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Status</label>
                  <Select
                    value={activeField ? "active" : "inactive"}
                    onValueChange={(val) => setActiveField(val === "active")}
                  >
                    <SelectTrigger className="h-10 bg-[#0E1726]/75 border-border/60 text-xs text-foreground cursor-pointer">
                      <SelectValue placeholder="Active" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111A2C] border-border text-xs">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground/50 mt-1 leading-normal">
                    Inactive areas are hidden from operational dropdowns.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Display Order</label>
                  <Input
                    type="number"
                    value={displayOrderField}
                    onChange={(e) => setDisplayOrderField(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-10 bg-[#0E1726]/75 border-border/60 text-xs focus:ring-primary"
                  />
                  <p className="text-[10px] text-muted-foreground/50 mt-1 leading-normal">
                    Lower numbers appear first in dropdowns.
                  </p>
                </div>
              </div>
            </div>

            {/* History grid Section */}
            {selectedItem && (
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-muted-foreground/75 tracking-wider uppercase">
                  History
                </div>
                <div className="border border-border/40 rounded-xl overflow-hidden text-xs bg-foreground/[0.01]">
                  <div className="flex justify-between border-b border-border/20 px-3.5 py-2">
                    <span className="text-muted-foreground font-semibold">Created</span>
                    <span className="text-foreground font-medium font-mono">
                      {selectedItem.created} <span className="text-muted-foreground/60 ml-2">By</span>{" "}
                      <span className="font-bold text-foreground/90">{selectedItem.createdBy}</span>
                    </span>
                  </div>
                  <div className="flex justify-between px-3.5 py-2">
                    <span className="text-muted-foreground font-semibold">Updated</span>
                    <span className="text-foreground font-medium font-mono">
                      {selectedItem.updated} <span className="text-muted-foreground/60 ml-2">By</span>{" "}
                      <span className="font-bold text-foreground/90">{selectedItem.updatedBy}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Cancel & Save Changes */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-border/30">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 font-bold text-xs bg-transparent border-border/80 hover:bg-[#131C2E] hover:text-foreground cursor-pointer text-muted-foreground rounded-lg transition-colors"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs rounded-lg cursor-pointer transition-colors"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================== */}
      {/* 5th IMAGE: DELETE CONFIRMATION MODAL           */}
      {/* ============================================== */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-[440px] border border-red-500/30 bg-[#0B1220] p-0 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
          {/* Subtle top red alert border line */}
          <div className="h-1 bg-red-500 w-full" />
          
          <div className="p-6 flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>

            <div className="space-y-2 flex-1">
              <DialogTitle className="text-[15px] font-bold text-foreground">
                Delete this record?
              </DialogTitle>
              <p className="text-[12px] text-muted-foreground/80 leading-relaxed font-semibold">
                This record will be permanently deleted.
                <br />
                This action cannot be undone.
              </p>
            </div>

            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-muted-foreground/60 hover:text-foreground cursor-pointer transition-colors p-1 self-start"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex justify-end gap-2.5 p-4 bg-[#0E1624] border-t border-border/20">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="h-9 px-4 font-bold text-xs bg-transparent border-border/80 hover:bg-[#131C2E] hover:text-foreground cursor-pointer text-muted-foreground rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="h-9 px-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer rounded-lg transition-colors"
            >
              <Trash className="h-3.5 w-3.5 text-white" /> Delete Record
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
