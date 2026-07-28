import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Database,
  Search,
  Plus,
  Pencil,
  Trash,
  ChevronDown,
  ArrowRight,
  DatabaseZap,
  Globe,
  SlidersHorizontal,
  TableProperties,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Check,
  X,
  Server,
  User,
  Users,
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

export const Route = createFileRoute("/_app/data-management/db-mapping")({
  head: () => ({
    meta: [
      { title: "Database Mapping — Data Automation Studio" },
      { name: "description", content: "Link registry instances to entity schemas." },
    ],
  }),
  component: DatabaseMapping,
});

interface DBInstance {
  id: string;
  name: string;
  type: string;
  environment: string;
  hostname: string;
  ipAddress: string;
  remarks: string;
}

interface DatabaseItem {
  id: string;
  instanceId: string;
  name: string;
  remarks: string;
}

interface SchemaItem {
  id: string;
  dbId: string;
  name: string;
  remarks: string;
}

interface MappingItem {
  id: string;
  instanceId: string;
  dbId: string;
  entityName: string;
  tableName: string;
  mappedColumnsCount: number;
  active: boolean;
}

// Initial seed data
const initialInstances: DBInstance[] = [
  {
    id: "inst1",
    name: "DGE-PROD-POSTGRES",
    type: "PostgreSQL",
    environment: "Production",
    hostname: "prod-pg.dge.gov.ae",
    ipAddress: "10.200.45.12",
    remarks: "Primary production geodatabase server",
  },
  {
    id: "inst2",
    name: "DGE-STAGE-SQLSERVER",
    type: "SQL Server",
    environment: "Staging",
    hostname: "stage-ms.dge.gov.ae",
    ipAddress: "10.200.46.25",
    remarks: "Staging/QA spatial database server",
  },
];

const initialDatabases: DatabaseItem[] = [
  { id: "db1", instanceId: "inst1", name: "dge_spatial_prod", remarks: "Geospatial data storage" },
  { id: "db2", instanceId: "inst1", name: "dge_metadata_prod", remarks: "Metadata catalog registries" },
  { id: "db3", instanceId: "inst2", name: "dge_spatial_stage", remarks: "Staging sandbox database" },
];

const initialSchemas: SchemaItem[] = [
  { id: "sch1", dbId: "db1", name: "public", remarks: "General objects" },
  { id: "sch2", dbId: "db1", name: "onboarding", remarks: "Data source staging schemas" },
  { id: "sch3", dbId: "db1", name: "layers", remarks: "Active operational layers" },
  { id: "sch4", dbId: "db2", name: "registry", remarks: "Standard catalog tables" },
  { id: "sch5", dbId: "db3", name: "dbo", remarks: "Default schema" },
  { id: "sch6", dbId: "db3", name: "staging", remarks: "Staged raw buffers" },
];

const initialMappings: MappingItem[] = [
  {
    id: "map1",
    instanceId: "inst1",
    dbId: "db1",
    entityName: "LandParcel",
    tableName: "layers.land_parcel",
    mappedColumnsCount: 8,
    active: true,
  },
  {
    id: "map2",
    instanceId: "inst1",
    dbId: "db1",
    entityName: "BuildingFootprint",
    tableName: "layers.building_footprints",
    mappedColumnsCount: 12,
    active: true,
  },
];

const STORAGE_KEYS = {
  INSTANCES: "dge_db_instances_data_v1",
  DATABASES: "dge_databases_data_v1",
  SCHEMAS: "dge_schemas_data_v1",
  MAPPINGS: "dge_mappings_data_v1",
};

function DatabaseMapping() {
  const [activeTab, setActiveTab] = useState<"instances" | "schemas" | "mapping">("instances");

  // State managed collections
  const [instances, setInstances] = useState<DBInstance[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.INSTANCES);
      if (saved) return JSON.parse(saved);
    }
    return initialInstances;
  });

  const [databases, setDatabases] = useState<DatabaseItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.DATABASES);
      if (saved) return JSON.parse(saved);
    }
    return initialDatabases;
  });

  const [schemas, setSchemas] = useState<SchemaItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEMAS);
      if (saved) return JSON.parse(saved);
    }
    return initialSchemas;
  });

  const [mappings, setMappings] = useState<MappingItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.MAPPINGS);
      if (saved) return JSON.parse(saved);
    }
    return initialMappings;
  });

  // Selection states
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>("");
  const [mappingInstanceId, setMappingInstanceId] = useState<string>("");
  const [mappingDbId, setMappingDbId] = useState<string>("");

  // Search & Filter state for Tab 1
  const [searchQuery, setSearchQuery] = useState("");
  const [dbTypeFilter, setDbTypeFilter] = useState("all");
  const [envFilter, setEnvFilter] = useState("all");

  // Modals state
  const [isInstanceModalOpen, setIsInstanceModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);

  // Form states
  const [instName, setInstName] = useState("");
  const [instType, setInstType] = useState("PostgreSQL");
  const [instEnv, setInstEnv] = useState("Production");
  const [instHost, setInstHost] = useState("");
  const [instIp, setInstIp] = useState("");
  const [instRemarks, setInstRemarks] = useState("");

  const [dbName, setDbName] = useState("");
  const [dbRemarks, setDbRemarks] = useState("");

  const [schemaName, setSchemaName] = useState("");
  const [schemaRemarks, setSchemaRemarks] = useState("");

  const [mapEntity, setMapEntity] = useState("");
  const [mapTable, setMapTable] = useState("");
  const [mapCols, setMapCols] = useState("8");

  // Selected parent DB for schema add
  const [targetDbId, setTargetDbId] = useState<string>("");

  // Helper storage savers
  const saveInstances = (newList: DBInstance[]) => {
    setInstances(newList);
    localStorage.setItem(STORAGE_KEYS.INSTANCES, JSON.stringify(newList));
  };
  const saveDatabases = (newList: DatabaseItem[]) => {
    setDatabases(newList);
    localStorage.setItem(STORAGE_KEYS.DATABASES, JSON.stringify(newList));
  };
  const saveSchemas = (newList: SchemaItem[]) => {
    setSchemas(newList);
    localStorage.setItem(STORAGE_KEYS.SCHEMAS, JSON.stringify(newList));
  };
  const saveMappings = (newList: MappingItem[]) => {
    setMappings(newList);
    localStorage.setItem(STORAGE_KEYS.MAPPINGS, JSON.stringify(newList));
  };

  // Tab 1 filters
  const filteredInstances = useMemo(() => {
    return instances.filter((inst) => {
      const matchSearch =
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.ipAddress.includes(searchQuery);
      const matchType = dbTypeFilter === "all" || inst.type === dbTypeFilter;
      const matchEnv = envFilter === "all" || inst.environment === envFilter;
      return matchSearch && matchType && matchEnv;
    });
  }, [instances, searchQuery, dbTypeFilter, envFilter]);

  // Tab 3 derived mappings count for instance + db
  const activeMappingsList = useMemo(() => {
    return mappings.filter(
      (m) => m.instanceId === mappingInstanceId && m.dbId === mappingDbId
    );
  }, [mappings, mappingInstanceId, mappingDbId]);

  // Handlers for adding items
  const handleCreateInstance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName.trim() || !instHost.trim()) {
      toast.error("Instance Name and Hostname are required");
      return;
    }
    const newInst: DBInstance = {
      id: "inst_" + Math.random().toString(),
      name: instName.toUpperCase(),
      type: instType,
      environment: instEnv,
      hostname: instHost.toLowerCase(),
      ipAddress: instIp || "127.0.0.1",
      remarks: instRemarks,
    };
    saveInstances([...instances, newInst]);
    setIsInstanceModalOpen(false);
    // Reset form
    setInstName("");
    setInstHost("");
    setInstIp("");
    setInstRemarks("");
    toast.success(`Database Instance "${newInst.name}" created successfully`);
  };

  const handleAddDatabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbName.trim()) {
      toast.error("Database name is required");
      return;
    }
    const newDb: DatabaseItem = {
      id: "db_" + Math.random().toString(),
      instanceId: selectedInstanceId,
      name: dbName.toLowerCase(),
      remarks: dbRemarks,
    };
    saveDatabases([...databases, newDb]);
    setIsDbModalOpen(false);
    setDbName("");
    setDbRemarks("");
    toast.success(`Database "${newDb.name}" added successfully`);
  };

  const handleAddSchema = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemaName.trim()) {
      toast.error("Schema name is required");
      return;
    }
    const newSch: SchemaItem = {
      id: "sch_" + Math.random().toString(),
      dbId: targetDbId,
      name: schemaName.toLowerCase(),
      remarks: schemaRemarks,
    };
    saveSchemas([...schemas, newSch]);
    setIsSchemaModalOpen(false);
    setSchemaName("");
    setSchemaRemarks("");
    toast.success(`Schema "${newSch.name}" added successfully`);
  };

  const handleAddMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapEntity.trim() || !mapTable.trim()) {
      toast.error("Entity and target schema table are required");
      return;
    }
    const newMap: MappingItem = {
      id: "map_" + Math.random().toString(),
      instanceId: mappingInstanceId,
      dbId: mappingDbId,
      entityName: mapEntity,
      tableName: mapTable,
      mappedColumnsCount: parseInt(mapCols) || 8,
      active: true,
    };
    saveMappings([...mappings, newMap]);
    setIsMappingModalOpen(false);
    setMapEntity("");
    setMapTable("");
    setMapCols("8");
    toast.success(`Entity "${newMap.entityName}" mapped to table successfully`);
  };

  const handleDeleteInstance = (id: string, name: string) => {
    if (confirm(`Delete instance "${name}"? This deletes all mapped databases & schemas.`)) {
      saveInstances(instances.filter((i) => i.id !== id));
      saveDatabases(databases.filter((d) => d.instanceId !== id));
      saveMappings(mappings.filter((m) => m.instanceId !== id));
      if (selectedInstanceId === id) setSelectedInstanceId("");
      toast.success(`Instance "${name}" deleted`);
    }
  };

  const handleDeleteDb = (id: string, name: string) => {
    if (confirm(`Delete database "${name}"?`)) {
      saveDatabases(databases.filter((d) => d.id !== id));
      saveSchemas(schemas.filter((s) => s.dbId !== id));
      saveMappings(mappings.filter((m) => m.dbId !== id));
      toast.success(`Database "${name}" deleted`);
    }
  };

  const handleDeleteSchema = (id: string, name: string) => {
    if (confirm(`Delete schema "${name}"?`)) {
      saveSchemas(schemas.filter((s) => s.id !== id));
      toast.success(`Schema "${name}" deleted`);
    }
  };

  const handleDeleteMapping = (id: string, name: string) => {
    if (confirm(`Delete mapping for "${name}"?`)) {
      saveMappings(mappings.filter((m) => m.id !== id));
      toast.success(`Mapping deleted`);
    }
  };

  // Metrics derived state
  const totalActiveMappings = useMemo(() => mappings.filter((m) => m.active).length, [mappings]);
  const totalEntitiesMapped = useMemo(() => new Set(mappings.map((m) => m.entityName)).size, [mappings]);
  const totalDbs = useMemo(() => databases.length, [databases]);
  const totalSchemas = useMemo(() => schemas.length, [schemas]);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Database Mapping"
          description="Register database instances, the databases that live under them, and the schemas inside each database. Logical mapping only — no credentials are collected."
          className="mb-0!"
        />
        {activeTab === "instances" && (
          <Button
            onClick={() => setIsInstanceModalOpen(true)}
            className="h-9.5 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5 font-semibold text-xs shrink-0 self-start sm:self-center"
          >
            <Plus className="h-4 w-4" /> Create DB Instance
          </Button>
        )}
      </div>

      {/* Tabs config (DB Instances, Databases & Schemas, Data Mapping) */}
      <div className="flex gap-6 border-b border-border/30 pb-0 mb-4">
        <button
          onClick={() => setActiveTab("instances")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "instances"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Database className="h-4 w-4" /> DB Instances
          </span>
        </button>
        <button
          onClick={() => setActiveTab("schemas")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "schemas"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4" /> Databases & Schemas
          </span>
        </button>
        <button
          onClick={() => setActiveTab("mapping")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "mapping"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <LinkIcon className="h-4 w-4" /> Data Mapping
          </span>
        </button>
      </div>

      {/* ========================================== */}
      {/* TAB 1: DB INSTANCES                        */}
      {/* ========================================== */}
      {activeTab === "instances" && (
        <Surface className="p-4 flex flex-col justify-start">
          {/* Header context */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3 mb-4">
            <span className="text-xs font-semibold text-muted-foreground leading-normal">
              Register database instances. Active connections allow mapping entities to target schemas.
            </span>
            <span className="text-[11px] bg-foreground/[0.04] border border-border px-2 py-0.5 rounded-full text-muted-foreground font-semibold">
              {filteredInstances.length} of {instances.length} instances
            </span>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative w-full max-w-xs sm:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, hostname, or IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9.5 pl-9 text-xs"
              />
            </div>

            <Select value={dbTypeFilter} onValueChange={setDbTypeFilter}>
              <SelectTrigger className="w-[140px] h-9.5">
                <SelectValue placeholder="All DB Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All DB Types</SelectItem>
                <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                <SelectItem value="SQL Server">SQL Server</SelectItem>
                <SelectItem value="Oracle">Oracle</SelectItem>
                <SelectItem value="MySQL">MySQL</SelectItem>
              </SelectContent>
            </Select>

            <Select value={envFilter} onValueChange={setEnvFilter}>
              <SelectTrigger className="w-[140px] h-9.5">
                <SelectValue placeholder="All Environments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="Production">Production</SelectItem>
                <SelectItem value="Staging">Staging</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Instances Table */}
          <div className="w-full overflow-x-auto rounded-xl border border-border/40">
            <Table>
              <TableHeader>
                <TableRow className="bg-foreground/[0.01] whitespace-nowrap">
                  <TableHead className="px-4 font-semibold text-muted-foreground text-xs">INSTANCE NAME</TableHead>
                  <TableHead className="font-semibold text-muted-foreground text-xs">DB TYPE</TableHead>
                  <TableHead className="font-semibold text-muted-foreground text-xs">ENVIRONMENT</TableHead>
                  <TableHead className="font-semibold text-muted-foreground text-xs">HOSTNAME</TableHead>
                  <TableHead className="font-semibold text-muted-foreground text-xs">IP ADDRESS</TableHead>
                  <TableHead className="font-semibold text-muted-foreground text-xs">REMARKS</TableHead>
                  <TableHead className="font-semibold text-muted-foreground text-xs text-center">DBS</TableHead>
                  <TableHead className="px-4 font-semibold text-muted-foreground text-xs text-center">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-xs">
                      No database instances found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInstances.map((item) => {
                    const dbCount = databases.filter((d) => d.instanceId === item.id).length;
                    return (
                      <TableRow key={item.id} className="hover:bg-foreground/[0.01] whitespace-nowrap">
                        <TableCell className="px-4 py-3 font-bold text-xs text-foreground">
                          <div className="flex items-center gap-2">
                            <Server className="h-3.5 w-3.5 text-muted-foreground/75" />
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-foreground font-semibold">{item.type}</TableCell>
                        <TableCell className="py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.environment === "Production"
                              ? "bg-red-500/10 text-red-400"
                              : item.environment === "Staging"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-blue-500/10 text-blue-400"
                          }`}>
                            {item.environment}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 font-mono text-[11px] text-muted-foreground">{item.hostname}</TableCell>
                        <TableCell className="py-3 font-mono text-[11px] text-muted-foreground">{item.ipAddress}</TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground max-w-[200px] truncate" title={item.remarks}>
                          {item.remarks || "—"}
                        </TableCell>
                        <TableCell className="py-3 text-center text-xs font-mono font-bold text-foreground">
                          {dbCount}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedInstanceId(item.id);
                                setActiveTab("schemas");
                              }}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-foreground/[0.02] rounded cursor-pointer"
                              title="Manage Databases & Schemas"
                            >
                              <SlidersHorizontal className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteInstance(item.id, item.name)}
                              className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                              title="Delete Instance"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Surface>
      )}

      {/* ========================================== */}
      {/* TAB 2: DATABASES & SCHEMAS                  */}
      {/* ========================================== */}
      {activeTab === "schemas" && (
        <div className="space-y-4">
          {/* Top Selector Card */}
          <Surface className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">Instance:</span>
              <Select value={selectedInstanceId} onValueChange={setSelectedInstanceId}>
                <SelectTrigger className="w-[280px] h-9">
                  <SelectValue placeholder="— Select a DB instance —" />
                </SelectTrigger>
                <SelectContent>
                  {instances.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name} ({i.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedInstanceId && (
              <Button
                onClick={() => setIsDbModalOpen(true)}
                className="h-8.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Database
              </Button>
            )}
          </Surface>

          {/* Databases Accordion List */}
          {!selectedInstanceId ? (
            <Surface className="py-12 text-center text-muted-foreground text-xs">
              Select a database instance from the dropdown above to manage its databases and table schemas.
            </Surface>
          ) : (
            <div className="space-y-4">
              {databases.filter((d) => d.instanceId === selectedInstanceId).length === 0 ? (
                <Surface className="py-12 text-center text-muted-foreground text-xs">
                  No databases registered under this instance. Click "Add Database" above to create one.
                </Surface>
              ) : (
                databases
                  .filter((d) => d.instanceId === selectedInstanceId)
                  .map((db) => {
                    const dbSchemas = schemas.filter((s) => s.dbId === db.id);
                    return (
                      <Surface key={db.id} className="p-5 space-y-4">
                        {/* Database Row Header */}
                        <div className="flex items-center justify-between border-b border-border/40 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
                              <Database className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-foreground">{db.name}</h4>
                              <p className="text-[10px] text-muted-foreground/80 leading-normal font-semibold">
                                {db.remarks || "No remarks provided"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Button
                              onClick={() => {
                                setTargetDbId(db.id);
                                setIsSchemaModalOpen(true);
                              }}
                              className="h-8 px-3 bg-foreground/[0.04] border border-border hover:bg-foreground/[0.07] text-foreground font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add Schema
                            </Button>
                            <button
                              onClick={() => handleDeleteDb(db.id, db.name)}
                              className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                              title="Delete Database"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Schema list table */}
                        <div className="w-full rounded-xl border border-border/30 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-foreground/[0.01]">
                                <TableHead className="px-4 py-2 font-semibold text-muted-foreground text-xs w-[250px]">SCHEMA</TableHead>
                                <TableHead className="py-2 font-semibold text-muted-foreground text-xs">REMARKS</TableHead>
                                <TableHead className="px-4 py-2 font-semibold text-muted-foreground text-xs text-center w-[100px]">ACTIONS</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dbSchemas.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground/80 text-[11px]">
                                    No schemas registered. Map a schema table logic under this database.
                                  </TableCell>
                                </TableRow>
                              ) : (
                                dbSchemas.map((sch) => (
                                  <TableRow key={sch.id} className="hover:bg-foreground/[0.01]">
                                    <TableCell className="px-4 py-2 font-bold text-xs text-foreground">
                                      <div className="flex items-center gap-1.5">
                                        <TableProperties className="h-3.5 w-3.5 text-muted-foreground/75" />
                                        {sch.name}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-2 text-[11px] text-muted-foreground">
                                      {sch.remarks || "—"}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 text-center">
                                      <button
                                        onClick={() => handleDeleteSchema(sch.id, sch.name)}
                                        className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                                        title="Delete Schema"
                                      >
                                        <Trash className="h-3.5 w-3.5" />
                                      </button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </Surface>
                    );
                  })
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: DATA MAPPING                         */}
      {/* ========================================== */}
      {activeTab === "mapping" && (
        <div className="space-y-6">
          {/* Premium Metric Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Surface className="p-4 flex items-center justify-between border border-border/40">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Mappings</span>
                <h3 className="text-xl font-bold text-foreground font-mono">{totalActiveMappings}</h3>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
                <LinkIcon className="h-4.5 w-4.5" />
              </div>
            </Surface>

            <Surface className="p-4 flex items-center justify-between border border-border/40">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mapped Entities</span>
                <h3 className="text-xl font-bold text-foreground font-mono">{totalEntitiesMapped}</h3>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                <Users className="h-4.5 w-4.5" />
              </div>
            </Surface>

            <Surface className="p-4 flex items-center justify-between border border-border/40">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Databases (Instance)</span>
                <h3 className="text-xl font-bold text-foreground font-mono">{totalDbs}</h3>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
                <Database className="h-4.5 w-4.5" />
              </div>
            </Surface>

            <Surface className="p-4 flex items-center justify-between border border-border/40">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Schemas (Database)</span>
                <h3 className="text-xl font-bold text-foreground font-mono">{totalSchemas}</h3>
              </div>
              <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/25 text-violet-400">
                <SlidersHorizontal className="h-4.5 w-4.5" />
              </div>
            </Surface>
          </div>

          {/* Mapping Grid Columns */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
            {/* Left selector pane */}
            <Surface className="p-4 flex flex-col justify-start space-y-4">
              <div className="border-b border-border/40 pb-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pick DB Source</span>
              </div>

              {/* DB Instance Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">DB Instance</label>
                <Select
                  value={mappingInstanceId}
                  onValueChange={(val) => {
                    setMappingInstanceId(val);
                    setMappingDbId(""); // Reset DB choice
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="— Select an Instance —" />
                  </SelectTrigger>
                  <SelectContent>
                    {instances.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Database Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Database</label>
                <Select
                  value={mappingDbId}
                  disabled={!mappingInstanceId}
                  onValueChange={setMappingDbId}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="— Select a DB —" />
                  </SelectTrigger>
                  <SelectContent>
                    {databases
                      .filter((d) => d.instanceId === mappingInstanceId)
                      .map((db) => (
                        <SelectItem key={db.id} value={db.id}>
                          {db.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </Surface>

            {/* Right Pane mapping details list */}
            <Surface className="p-5 flex flex-col justify-start">
              {/* Header block */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3.5 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 border border-pink-500/25 text-pink-400">
                    <LinkIcon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Map Entities to Schemas</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                      Map logical Entity columns to physical Database Schema table structures.
                    </p>
                  </div>
                </div>
                {mappingInstanceId && mappingDbId && (
                  <Button
                    onClick={() => setIsMappingModalOpen(true)}
                    className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Entity
                  </Button>
                )}
              </div>

              {/* Mappings dynamic rendering */}
              {!mappingInstanceId || !mappingDbId ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/5 text-blue-400">
                    <LinkIcon className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-blue-400/90 font-semibold">
                    Select a DB instance and database on the left to start mapping entities.
                  </p>
                </div>
              ) : activeMappingsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <p className="text-xs font-semibold">No mappings registered under this database database schema.</p>
                  <Button
                    onClick={() => setIsMappingModalOpen(true)}
                    className="h-8.5 px-3 bg-foreground/[0.04] border border-border hover:bg-foreground/[0.07] text-foreground font-semibold text-xs mt-3.5 flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Entity Mapping
                  </Button>
                </div>
              ) : (
                <div className="w-full overflow-x-auto rounded-xl border border-border/40">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-foreground/[0.01] whitespace-nowrap">
                        <TableHead className="px-4 font-semibold text-muted-foreground text-xs">ENTITY</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-xs">SCHEMA TABLE</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-xs text-center">MAPPED COLUMNS</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-xs text-center">STATUS</TableHead>
                        <TableHead className="px-4 font-semibold text-muted-foreground text-xs text-center">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeMappingsList.map((item) => (
                        <TableRow key={item.id} className="hover:bg-foreground/[0.01] whitespace-nowrap">
                          <TableCell className="px-4 py-3 font-bold text-xs text-foreground">
                            {item.entityName}
                          </TableCell>
                          <TableCell className="py-3 font-semibold font-mono text-xs text-muted-foreground">
                            {item.tableName}
                          </TableCell>
                          <TableCell className="py-3 text-center text-xs font-semibold font-mono text-foreground">
                            {item.mappedColumnsCount} columns
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex justify-center">
                              <Switch
                                checked={item.active}
                                onCheckedChange={(val) => {
                                  const updated = mappings.map((m) =>
                                    m.id === item.id ? { ...m, active: val } : m
                                  );
                                  saveMappings(updated);
                                  toast.success(`Mapping status updated`);
                                }}
                                className="cursor-pointer"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteMapping(item.id, item.entityName)}
                              className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                              title="Delete Mapping"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Surface>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: CREATE INSTANCE                     */}
      {/* ========================================== */}
      <Dialog open={isInstanceModalOpen} onOpenChange={setIsInstanceModalOpen}>
        <DialogContent className="max-w-[480px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Server className="h-4.5 w-4.5 text-blue-400" />
              Create Database Instance
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateInstance} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Instance Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="e.g. DGE-PROD-POSTGRES"
                value={instName}
                onChange={(e) => setInstName(e.target.value)}
                required
                className="h-9.5 uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">DB Type</label>
                <Select value={instType} onValueChange={setInstType}>
                  <SelectTrigger className="h-9.5">
                    <SelectValue placeholder="PostgreSQL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                    <SelectItem value="SQL Server">SQL Server</SelectItem>
                    <SelectItem value="Oracle">Oracle</SelectItem>
                    <SelectItem value="MySQL">MySQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Environment</label>
                <Select value={instEnv} onValueChange={setInstEnv}>
                  <SelectTrigger className="h-9.5">
                    <SelectValue placeholder="Production" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Staging">Staging</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Hostname <span className="text-red-400">*</span>
                </label>
                <Input
                  placeholder="e.g. prod-pg.dge.gov.ae"
                  value={instHost}
                  onChange={(e) => setInstHost(e.target.value)}
                  required
                  className="h-9.5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">IP Address</label>
                <Input
                  placeholder="e.g. 10.200.45.12"
                  value={instIp}
                  onChange={(e) => setInstIp(e.target.value)}
                  className="h-9.5"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Remarks</label>
              <textarea
                placeholder="Database instance description..."
                value={instRemarks}
                onChange={(e) => setInstRemarks(e.target.value)}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[70px] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 font-semibold text-xs"
                onClick={() => setIsInstanceModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================== */}
      {/* MODAL: ADD DATABASE                        */}
      {/* ========================================== */}
      <Dialog open={isDbModalOpen} onOpenChange={setIsDbModalOpen}>
        <DialogContent className="max-w-[440px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Database className="h-4.5 w-4.5 text-blue-400" />
              Add Database
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddDatabase} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Database Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="e.g. dge_spatial_prod"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
                required
                className="h-9.5"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Remarks</label>
              <textarea
                placeholder="What this database is used for..."
                value={dbRemarks}
                onChange={(e) => setDbRemarks(e.target.value)}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[70px] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 font-semibold text-xs"
                onClick={() => setIsDbModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================== */}
      {/* MODAL: ADD SCHEMA                          */}
      {/* ========================================== */}
      <Dialog open={isSchemaModalOpen} onOpenChange={setIsSchemaModalOpen}>
        <DialogContent className="max-w-[440px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <TableProperties className="h-4.5 w-4.5 text-blue-400" />
              Add Schema
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSchema} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Schema Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="e.g. layers"
                value={schemaName}
                onChange={(e) => setSchemaName(e.target.value)}
                required
                className="h-9.5"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Remarks</label>
              <textarea
                placeholder="Schema details..."
                value={schemaRemarks}
                onChange={(e) => setSchemaRemarks(e.target.value)}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[70px] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 font-semibold text-xs"
                onClick={() => setIsSchemaModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================== */}
      {/* MODAL: ADD MAPPING                         */}
      {/* ========================================== */}
      <Dialog open={isMappingModalOpen} onOpenChange={setIsMappingModalOpen}>
        <DialogContent className="max-w-[460px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <LinkIcon className="h-4.5 w-4.5 text-blue-400" />
              Add Entity Mapping
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddMapping} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-0.5">
                Entity Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="e.g. LandParcel"
                value={mapEntity}
                onChange={(e) => setMapEntity(e.target.value)}
                required
                className="h-9.5"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-0.5">
                Schema Table Path <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="e.g. layers.land_parcel"
                value={mapTable}
                onChange={(e) => setMapTable(e.target.value)}
                required
                className="h-9.5"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Mapped Columns Count</label>
              <Input
                type="number"
                placeholder="8"
                value={mapCols}
                onChange={(e) => setMapCols(e.target.value)}
                className="h-9.5"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 font-semibold text-xs"
                onClick={() => setIsMappingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Map Entity
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
