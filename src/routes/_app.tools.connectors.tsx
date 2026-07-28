import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash,
  ArrowUp,
  ArrowDown,
  Database,
  Globe,
  Layers,
  FileCode,
  FileSpreadsheet,
  FileText,
  Wifi,
  X,
  Check,
  AlertOctagon,
  ArrowLeft,
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

export const Route = createFileRoute("/_app/tools/connectors")({
  head: () => ({
    meta: [
      { title: "Data Source Connectors — Data Automation Studio" },
      { name: "description", content: "Managed connectors for databases, APIs and files." },
    ],
  }),
  component: DataConnectors,
});

interface ConnectorItem {
  id: string;
  name: string;
  code: string;
  description: string;
  sourcesCount: number;
  active: boolean;
  order: number;
  iconName: string;
  formats: string;
}

interface SubtypeItem {
  id: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
  order: number;
}

const defaultConnectors: ConnectorItem[] = [
  {
    id: "1",
    name: "Database",
    code: "DB_DIRECT",
    description: "Connect to a database including PostGIS, SQL Server, Oracle.",
    sourcesCount: 0,
    active: true,
    order: 10,
    iconName: "database",
    formats: "PostgreSQL, SQL Server, Oracle",
  },
  {
    id: "2",
    name: "REST / OGC API",
    code: "REST_API",
    description: "Connect to REST API, OGC WFS, or WMS endpoints returning geospatial ... REST API, OGC WFS, WMS",
    sourcesCount: 0,
    active: false,
    order: 11,
    iconName: "globe",
    formats: "REST API, OGC WFS, WMS",
  },
  {
    id: "3",
    name: "ESRI Services",
    code: "ARCGIS_SERVICE",
    description: "Connect to ArcGIS Feature Service, Map Service, or GeoData Service end... Feature Service, Map Service, GeoData Service",
    sourcesCount: 0,
    active: true,
    order: 12,
    iconName: "layers",
    formats: "ArcGIS Feature Service, Map Service, GeoData Service",
  },
  {
    id: "4",
    name: "File Geodatabase (FGDB)",
    code: "FILE_GDB",
    description: "Upload or reference an ESRI File Geodatabase (.gdb) containing feature cl... ESRI .gdb",
    sourcesCount: 0,
    active: true,
    order: 13,
    iconName: "filecode",
    formats: "ESRI .gdb",
  },
  {
    id: "5",
    name: "Shapefile (SHP)",
    code: "SHAPEFILE",
    description: "Upload and validate Shapefile with geometry and projection checks. .shp, .shx, .dbf, .prj",
    sourcesCount: 0,
    active: true,
    order: 14,
    iconName: "filecode",
    formats: ".shp, .shx, .dbf, .prj",
  },
  {
    id: "6",
    name: "Excel",
    code: "EXCEL",
    description: "Import structured tabular or geographic data from Excel workbooks with v... .xlsx, .xlsm, .xls",
    sourcesCount: 0,
    active: true,
    order: 15,
    iconName: "excel",
    formats: ".xlsx, .xlsm, .xls",
  },
  {
    id: "7",
    name: "CSV",
    code: "CSV",
    description: "Import geographic or tabular data from CSV or delimited text files. .csv",
    sourcesCount: 0,
    active: true,
    order: 16,
    iconName: "csv",
    formats: ".csv",
  },
];

const defaultSubtypes: Record<string, SubtypeItem[]> = {
  DB_DIRECT: [
    { id: "s1", name: "PostgreSQL", code: "POSTGRESQL", description: "ArcGIS Pro database connection platform for PostgreSQL and PostGIS.", active: true, order: 110 },
    { id: "s2", name: "Microsoft SQL Server", code: "SQL_SERVER", description: "ArcGIS Pro database connection platform for SQL Server and SQL Server-compatible cloud databases.", active: true, order: 111 },
    { id: "s3", name: "Oracle Database", code: "ORACLE", description: "ArcGIS Pro database connection platform for Oracle, RDS for Oracle, and Autonomous Transaction Processing.", active: true, order: 112 },
    { id: "s4", name: "IBM Db2", code: "DB2", description: "ArcGIS Pro database connection platform for IBM Db2.", active: false, order: 113 },
    { id: "s5", name: "Google BigQuery", code: "BIGQUERY", description: "ArcGIS Pro database connection platform for Google BigQuery cloud data warehouse.", active: false, order: 114 },
    { id: "s6", name: "Amazon Redshift", code: "REDSHIFT", description: "ArcGIS Pro database connection platform for Amazon Redshift cloud data warehouse.", active: false, order: 115 },
    { id: "s7", name: "Snowflake", code: "SNOWFLAKE", description: "ArcGIS Pro database connection platform for Snowflake cloud data warehouse.", active: false, order: 116 },
    { id: "s8", name: "SAP HANA", code: "SAP_HANA", description: "ArcGIS Pro database connection platform for SAP HANA and SAP HANA Cloud.", active: false, order: 117 },
    { id: "s9", name: "Teradata", code: "TERADATA", description: "ArcGIS Pro database connection platform for Teradata Vantage.", active: false, order: 118 },
    { id: "s10", name: "Dameng", code: "DAMENG", description: "ArcGIS Pro database connection platform for Dameng.", active: false, order: 119 },
    { id: "s11", name: "Elasticsearch", code: "ELASTICSEARCH", description: "ArcGIS Pro database connection platform for Elasticsearch. Uses ArcGIS database connection behavior where applicable.", active: false, order: 120 },
    { id: "s12", name: "OpenSearch", code: "OPENSEARCH", description: "ArcGIS Pro database connection platform for OpenSearch. Uses ArcGIS database connection behavior where applicable.", active: false, order: 121 },
  ],
  REST_API: [
    { id: "s13", name: "OGC WFS", code: "OGC_WFS", description: "Open Geospatial Consortium Web Feature Service endpoint.", active: true, order: 210 },
    { id: "s14", name: "OGC WMS", code: "OGC_WMS", description: "Open Geospatial Consortium Web Map Service endpoint.", active: true, order: 211 },
    { id: "s15", name: "GeoJSON", code: "GEOJSON", description: "Static or dynamic GeoJSON payload URL.", active: false, order: 212 },
  ],
  ARCGIS_SERVICE: [
    { id: "s16", name: "ArcGIS MapServer", code: "MAP_SERVER", description: "ArcGIS map tile and spatial layers service.", active: true, order: 310 },
    { id: "s17", name: "ArcGIS FeatureServer", code: "FEATURE_SERVER", description: "ArcGIS vector objects and attributes collection service.", active: true, order: 311 },
  ],
};

const STORAGE_KEY_CONNECTORS = "dge_data_source_connectors_v3";
const STORAGE_KEY_SUBTYPES = "dge_data_source_subtypes_v3";

function DataConnectors() {
  const [currentView, setCurrentView] = useState<"list" | "view" | "edit">("list");
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null);

  const [connectors, setConnectors] = useState<ConnectorItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_CONNECTORS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved connectors:", e);
        }
      }
    }
    return defaultConnectors;
  });

  const [subtypesMap, setSubtypesMap] = useState<Record<string, SubtypeItem[]>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_SUBTYPES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved subtypes:", e);
        }
      }
    }
    return defaultSubtypes;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<ConnectorItem | null>(null);

  // Add Connector Form states
  const [newCode, setNewCode] = useState("");
  const [newOrder, setNewOrder] = useState("8");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFormats, setNewFormats] = useState("");
  const [newVisibility, setNewVisibility] = useState("default");
  const [newActive, setNewActive] = useState(true);

  // Edit Connector Form states
  const [editName, setEditName] = useState("");
  const [editOrder, setEditOrder] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFormats, setEditFormats] = useState("");
  const [editVisibility, setEditVisibility] = useState("Explicit data_source tag");
  const [editActive, setEditActive] = useState(true);

  const saveConnectors = (newList: ConnectorItem[]) => {
    setConnectors(newList);
    localStorage.setItem(STORAGE_KEY_CONNECTORS, JSON.stringify(newList));
  };

  const saveSubtypes = (newMap: Record<string, SubtypeItem[]>) => {
    setSubtypesMap(newMap);
    localStorage.setItem(STORAGE_KEY_SUBTYPES, JSON.stringify(newMap));
  };

  const handleOpenAddModal = () => {
    setNewCode("");
    const maxOrder = connectors.length > 0 ? Math.max(...connectors.map((c) => c.order)) : 0;
    setNewOrder((maxOrder + 1).toString());
    setNewName("");
    setNewDescription("");
    setNewFormats("");
    setNewVisibility("default");
    setNewActive(true);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) {
      toast.error("Method Code and Display Name are required");
      return;
    }
    const dup = connectors.find((c) => c.code.toUpperCase() === newCode.trim().toUpperCase());
    if (dup) {
      toast.error("A connector with this Method Code already exists");
      return;
    }
    const nextOrder = parseInt(newOrder) || 1;
    const newItem: ConnectorItem = {
      id: Math.random().toString(),
      name: newName,
      code: newCode.toUpperCase(),
      description: newDescription || `Connect to ${newName} integration services.`,
      sourcesCount: 0,
      active: newActive,
      order: nextOrder,
      iconName: newName.toLowerCase().includes("database")
        ? "database"
        : newName.toLowerCase().includes("file")
          ? "filecode"
          : "globe",
      formats: newFormats,
    };
    saveConnectors([...connectors, newItem]);
    setIsAddModalOpen(false);
    toast.success(`Connector "${newName}" created successfully`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConnector) return;
    if (!editName.trim()) {
      toast.error("Display Name is required");
      return;
    }
    const updated = connectors.map((c) => {
      if (c.id === selectedConnector.id) {
        return {
          ...c,
          name: editName,
          description: editDescription,
          order: parseInt(editOrder) || c.order,
          active: editActive,
          formats: editFormats,
        };
      }
      return c;
    });
    saveConnectors(updated);
    // Sync current active connector state
    const current = updated.find((c) => c.id === selectedConnector.id);
    if (current) setSelectedConnector(current);
    setCurrentView("view");
    toast.success(`Changes to "${editName}" saved successfully`);
  };

  const executeDelete = () => {
    if (!deleteConfirmTarget) return;
    const updated = connectors.filter((c) => c.id !== deleteConfirmTarget.id);
    saveConnectors(updated);
    setDeleteConfirmTarget(null);
    setCurrentView("list");
    toast.success(`Connector "${deleteConfirmTarget.name}" deleted successfully`);
  };

  const handleToggleSubtype = (connectorCode: string, subtypeId: string, currentState: boolean) => {
    const subtypes = subtypesMap[connectorCode] || [];
    const updatedSubtypes = subtypes.map((s) => {
      if (s.id === subtypeId) return { ...s, active: !currentState };
      return s;
    });
    saveSubtypes({
      ...subtypesMap,
      [connectorCode]: updatedSubtypes,
    });
  };

  const handleSubtypeOrderChange = (connectorCode: string, subtypeId: string, val: string) => {
    const num = parseInt(val) || 0;
    const subtypes = subtypesMap[connectorCode] || [];
    const updatedSubtypes = subtypes.map((s) => {
      if (s.id === subtypeId) return { ...s, order: num };
      return s;
    });
    saveSubtypes({
      ...subtypesMap,
      [connectorCode]: updatedSubtypes,
    });
  };

  const handleEditConnectorTrigger = (item: ConnectorItem) => {
    setSelectedConnector(item);
    setEditName(item.name);
    setEditOrder(item.order.toString());
    setEditDescription(item.description);
    setEditFormats(item.formats);
    setEditVisibility("Explicit data_source tag");
    setEditActive(item.active);
    setCurrentView("edit");
  };

  const toggleConnectorActive = (id: string, name: string, currentState: boolean) => {
    const updated = connectors.map((c) => {
      if (c.id === id) return { ...c, active: !currentState };
      return c;
    });
    saveConnectors(updated);
    toast.success(`Connector "${name}" is now ${!currentState ? "active" : "inactive"}`);
  };

  const moveConnectorOrder = (index: number, direction: "up" | "down") => {
    const sorted = [...connectors].sort((a, b) => a.order - b.order);
    if (direction === "up" && index > 0) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index - 1].order;
      sorted[index - 1].order = temp;
    } else if (direction === "down" && index < sorted.length - 1) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index + 1].order;
      sorted[index + 1].order = temp;
    }
    saveConnectors(sorted);
  };

  const filteredConnectors = useMemo(() => {
    const list = connectors.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return [...list].sort((a, b) => a.order - b.order);
  }, [connectors, searchQuery]);

  const renderIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "database":
        return <Database className="h-4 w-4" />;
      case "globe":
        return <Globe className="h-4 w-4" />;
      case "layers":
        return <Layers className="h-4 w-4" />;
      case "filecode":
        return <FileCode className="h-4 w-4" />;
      case "excel":
        return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
      case "csv":
        return <FileText className="h-4 w-4 text-sky-500" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* 1. LIST VIEW */}
      {currentView === "list" && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <PageHeader
              title="Data Source Connectors"
              description="Control available onboarding connector types"
              className="mb-0!"
            />
            <Button
              onClick={handleOpenAddModal}
              className="h-9.5 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5 font-semibold text-xs shrink-0 self-start sm:self-center"
            >
              <Plus className="h-4 w-4" /> Add connector
            </Button>
          </div>

          <Surface className="p-4 flex flex-col justify-start">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3 mb-2.5">
              <span className="text-xs font-semibold text-muted-foreground leading-normal">
                Ordered list — same order as Data Source onboarding (by display order).
              </span>
              <span className="text-[11px] bg-foreground/[0.04] border border-border px-2 py-0.5 rounded-full text-muted-foreground font-semibold">
                {filteredConnectors.length} connectors
              </span>
            </div>

            <div className="flex max-w-sm items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter connectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9.5 pl-9 text-xs"
                />
              </div>
            </div>

            <div className="w-full overflow-x-auto rounded-xl border border-border/40">
              <Table>
                <TableHeader>
                  <TableRow className="bg-foreground/[0.01] whitespace-nowrap">
                    <TableHead className="px-4 font-semibold text-muted-foreground text-xs">CONNECTOR</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">CODE</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs">DESCRIPTION</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">SOURCES</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">ACTIVE</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center">ORDER</TableHead>
                    <TableHead className="px-4 font-semibold text-muted-foreground text-xs text-center">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConnectors.map((item, idx) => (
                    <TableRow key={item.id} className="hover:bg-foreground/[0.01] whitespace-nowrap">
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-foreground/[0.03] border border-border/40 text-muted-foreground shrink-0">
                            {renderIcon(item.iconName)}
                          </div>
                          <span className="font-bold text-xs text-foreground">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-[10px] font-semibold font-mono bg-foreground/[0.03] border border-border px-2 py-0.5 rounded text-muted-foreground">
                          {item.code}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 max-w-[320px] truncate text-xs text-muted-foreground" title={item.description}>
                        {item.description}
                      </TableCell>
                      <TableCell className="py-3 text-center text-xs font-semibold font-mono text-foreground">
                        {item.sourcesCount}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex justify-center">
                          <Switch
                            checked={item.active}
                            onCheckedChange={() => toggleConnectorActive(item.id, item.name, item.active)}
                            className="cursor-pointer"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex justify-center items-center gap-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => moveConnectorOrder(idx, "up")}
                            className="p-1 border border-border/55 rounded hover:bg-foreground/[0.02] disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            disabled={idx === filteredConnectors.length - 1}
                            onClick={() => moveConnectorOrder(idx, "down")}
                            className="p-1 border border-border/55 rounded hover:bg-foreground/[0.02] disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {/* View eye button */}
                          <button
                            onClick={() => {
                              setSelectedConnector(item);
                              setCurrentView("view");
                            }}
                            className="p-1 text-muted-foreground hover:text-foreground hover:bg-foreground/[0.02] rounded cursor-pointer transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditConnectorTrigger(item)}
                            className="p-1 text-muted-foreground hover:text-foreground hover:bg-foreground/[0.02] rounded cursor-pointer transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmTarget(item)}
                            className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                            title="Delete"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Surface>
        </div>
      )}

      {/* 2. VIEW VIEW (2nd Image) */}
      {currentView === "view" && selectedConnector && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{selectedConnector.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">Data Source Connector — details & subtypes</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentView("list")}
                className="h-8.5 px-3.5 font-semibold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <Button
                onClick={() => handleEditConnectorTrigger(selectedConnector)}
                className="h-8.5 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </div>
          </div>

          {/* Details Metadata Card */}
          <Surface className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/[0.03] border border-border/40 text-muted-foreground">
                  {renderIcon(selectedConnector.iconName)}
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    {selectedConnector.name}
                    <span className="text-[10px] font-semibold font-mono bg-foreground/[0.03] border border-border px-2 py-0.5 rounded text-muted-foreground">
                      {selectedConnector.code}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                selectedConnector.active
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                  : "bg-slate-500/10 text-muted-foreground border-slate-500/25"
              }`}>
                <span className={`h-1 w-1 rounded-full ${selectedConnector.active ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
                {selectedConnector.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 text-xs leading-normal">
              <div className="space-y-1 md:col-span-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Description</span>
                <p className="text-foreground font-semibold">{selectedConnector.description}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Supported Formats</span>
                <p className="text-foreground font-semibold font-mono">{selectedConnector.formats || "—"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Direction</span>
                <p className="text-foreground font-semibold">Both</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Category</span>
                <p className="text-foreground font-semibold font-mono">data_source</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Display Order</span>
                <p className="text-foreground font-semibold font-mono">{selectedConnector.order}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Used by Data Sources</span>
                <p className="text-foreground font-semibold font-mono">{selectedConnector.sourcesCount}</p>
              </div>
            </div>
          </Surface>

          {/* Subtypes Platforms Table */}
          <Surface className="p-4 space-y-4">
            {(() => {
              const subtypes = subtypesMap[selectedConnector.code] || [];
              const activeCount = subtypes.filter((s) => s.active).length;
              return (
                <>
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-foreground">
                        {selectedConnector.name} platforms
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        {activeCount} of {subtypes.length} enabled
                      </p>
                    </div>
                    <Button
                      variant="link"
                      onClick={() => handleEditConnectorTrigger(selectedConnector)}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Manage
                    </Button>
                  </div>

                  <div className="w-full overflow-x-auto rounded-xl border border-border/40">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-foreground/[0.01] whitespace-nowrap">
                          <TableHead className="px-4 font-semibold text-muted-foreground text-xs">SUBTYPE</TableHead>
                          <TableHead className="font-semibold text-muted-foreground text-xs">CODE</TableHead>
                          <TableHead className="font-semibold text-muted-foreground text-xs">DESCRIPTION</TableHead>
                          <TableHead className="px-4 font-semibold text-muted-foreground text-xs text-center">STATUS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subtypes.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-xs">
                              No platform subtypes configured for this connector.
                            </TableCell>
                          </TableRow>
                        ) : (
                          subtypes.map((sub) => (
                            <TableRow key={sub.id} className="hover:bg-foreground/[0.01] whitespace-nowrap">
                              <TableCell className="px-4 py-2.5 font-bold text-xs text-foreground">
                                {sub.name}
                              </TableCell>
                              <TableCell className="py-2.5 font-semibold font-mono text-[10px] text-muted-foreground">
                                {sub.code}
                              </TableCell>
                              <TableCell className="py-2.5 text-xs text-muted-foreground max-w-[400px] truncate" title={sub.description}>
                                {sub.description}
                              </TableCell>
                              <TableCell className="px-4 py-2.5">
                                <div className="flex justify-center">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold ${
                                    sub.active
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                                      : "bg-slate-500/10 text-muted-foreground border border-slate-500/25"
                                  }`}>
                                    {sub.active ? "Active" : "Inactive"}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </>
              );
            })()}
          </Surface>
        </div>
      )}

      {/* 3. EDIT VIEW (3rd Image) */}
      {currentView === "edit" && selectedConnector && (
        <form onSubmit={handleEditSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Edit: {selectedConnector.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Edit the connector and enable/disable its subtypes — drives onboarding pickers live.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentView("view")}
                className="h-8.5 px-3.5 font-semibold text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-8.5 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs"
              >
                Save changes
              </Button>
            </div>
          </div>

          {/* Form fields */}
          <Surface className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/[0.03] border border-border/40 text-muted-foreground">
                  {renderIcon(selectedConnector.iconName)}
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Connector</div>
                  <div className="text-[10px] text-muted-foreground font-semibold">
                    {selectedConnector.code} - code is fixed
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Active</span>
                <Switch
                  checked={editActive}
                  onCheckedChange={setEditActive}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">Display Name</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="h-9.5"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Display Order</label>
                <Input
                  type="number"
                  value={editOrder}
                  onChange={(e) => setEditOrder(e.target.value)}
                  className="h-9.5"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Description</label>
              <textarea
                placeholder="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[70px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Supported formats</label>
                <Input
                  value={editFormats}
                  onChange={(e) => setEditFormats(e.target.value)}
                  className="h-9.5"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Data Sources visibility</label>
                <Select value={editVisibility} onValueChange={setEditVisibility}>
                  <SelectTrigger className="h-9.5">
                    <SelectValue placeholder="Explicit data_source tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Explicit data_source tag">Explicit data_source tag</SelectItem>
                    <SelectItem value="Hidden tag">Hidden tag</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Surface>

          {/* Subtypes Platforms management */}
          <Surface className="p-4 space-y-4">
            {(() => {
              const subtypes = subtypesMap[selectedConnector.code] || [];
              const activeCount = subtypes.filter((s) => s.active).length;
              return (
                <>
                  <div className="border-b border-border/40 pb-3">
                    <h4 className="text-xs font-bold text-foreground">
                      {selectedConnector.name} platforms
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                      toggle to show / hide each in onboarding · {activeCount} of {subtypes.length} enabled
                    </p>
                  </div>

                  <div className="w-full overflow-x-auto rounded-xl border border-border/40">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-foreground/[0.01] whitespace-nowrap">
                          <TableHead className="px-4 font-semibold text-muted-foreground text-xs">SUBTYPE</TableHead>
                          <TableHead className="font-semibold text-muted-foreground text-xs">DESCRIPTION</TableHead>
                          <TableHead className="font-semibold text-muted-foreground text-xs text-center">ORDER</TableHead>
                          <TableHead className="px-4 font-semibold text-muted-foreground text-xs text-center">ACTIVE</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subtypes.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-xs">
                              No platform subtypes configured for this connector.
                            </TableCell>
                          </TableRow>
                        ) : (
                          subtypes.map((sub) => (
                            <TableRow key={sub.id} className="hover:bg-foreground/[0.01] whitespace-nowrap">
                              <TableCell className="px-4 py-2.5">
                                <div className="space-y-0.5">
                                  <div className="font-bold text-xs text-foreground">{sub.name}</div>
                                  <div className="font-mono text-[9px] text-muted-foreground">{sub.code}</div>
                                </div>
                              </TableCell>
                              <TableCell className="py-2.5 text-xs text-muted-foreground max-w-[400px] truncate" title={sub.description}>
                                {sub.description}
                              </TableCell>
                              <TableCell className="py-2.5">
                                <div className="flex justify-center">
                                  <Input
                                    type="number"
                                    value={sub.order}
                                    onChange={(e) => handleSubtypeOrderChange(selectedConnector.code, sub.id, e.target.value)}
                                    className="h-7 w-16 text-center text-[11px] font-mono"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-2.5">
                                <div className="flex justify-center">
                                  <Switch
                                    checked={sub.active}
                                    onCheckedChange={() => handleToggleSubtype(selectedConnector.code, sub.id, sub.active)}
                                    className="cursor-pointer"
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </>
              );
            })()}
          </Surface>
        </form>
      )}

      {/* Add Connector Dialog (Popup modal matching Image 2) */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-[480px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
                <Wifi className="h-4.5 w-4.5" />
              </div>
              Add data connector
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-0.5">
                  Method Code <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="E.G. REST_API"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required
                  className="h-9.5 uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Display Order
                </label>
                <Input
                  type="number"
                  placeholder="8"
                  value={newOrder}
                  onChange={(e) => setNewOrder(e.target.value)}
                  className="h-9.5"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-0.5">
                Display Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="e.g. REST API"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="h-9.5"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Description (optional)
              </label>
              <textarea
                placeholder="Short description of this integration method..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[70px] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Supported formats (optional)
              </label>
              <Input
                placeholder="e.g. PostgreSQL, SQL Server, Oracle, MySQL, SQLite"
                value={newFormats}
                onChange={(e) => setNewFormats(e.target.value)}
                className="h-9.5"
              />
              <p className="text-[10px] text-muted-foreground/75 leading-relaxed">
                Short comma-separated tag line shown beneath this connector card on Onboard Data Source and the admin grid.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Data Sources visibility
              </label>
              <Select value={newVisibility} onValueChange={setNewVisibility}>
                <SelectTrigger className="h-9.5">
                  <SelectValue placeholder="Default — include in Data Source picker" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default — include in Data Source picker</SelectItem>
                  <SelectItem value="hidden">Hidden — exclude from Data Source picker</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground/75 leading-relaxed">
                Maps to <code className="bg-foreground/[0.04] px-1 py-0.2 rounded font-mono text-[9.5px]">integration_method.category</code> for <code className="bg-foreground/[0.04] px-1 py-0.2 rounded font-mono text-[9.5px]">GET .../integration-methods?for=data_source</code> — the same list used on Data Sources and onboarding.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 border border-border/30 rounded-xl bg-foreground/[0.01]">
              <label className="text-xs font-semibold text-foreground cursor-pointer select-none">
                Active
              </label>
              <Switch
                checked={newActive}
                onCheckedChange={setNewActive}
                className="cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 font-semibold text-xs"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add connector
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal (Popup matching Image 4) */}
      <Dialog open={!!deleteConfirmTarget} onOpenChange={(open) => !open && setDeleteConfirmTarget(null)}>
        <DialogContent className="max-w-[420px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col items-center text-center space-y-4 pt-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/25 text-red-500">
              <AlertOctagon className="h-6 w-6" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-foreground">
                Delete connector "{deleteConfirmTarget?.name}"?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This will permanently delete the connector. Audit logs are preserved.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4 border-t border-border/40 mt-5">
            <Button
              type="button"
              variant="outline"
              className="h-9 px-4 font-semibold text-xs"
              onClick={() => setDeleteConfirmTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={executeDelete}
              className="h-9 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <Trash className="h-3.5 w-3.5" /> Delete Record
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
