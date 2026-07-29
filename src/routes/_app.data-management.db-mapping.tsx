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
  RefreshCw,
  XCircle,
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
    id: "inst_1",
    name: "Internal Database",
    type: "SQL Server",
    environment: "Production",
    hostname: "Test",
    ipAddress: "10.10.10.10",
    remarks: "SDI Internal Database",
  },
  {
    id: "inst_2",
    name: "External Database",
    type: "SQL Server",
    environment: "Production",
    hostname: "External",
    ipAddress: "10.10.10.10",
    remarks: "—",
  },
];

const initialDatabases: DatabaseItem[] = [
  {
    id: "db_1",
    instanceId: "inst_1",
    name: "DMT",
    remarks: "This database contains the information landbase data from the Department of Municipalities and Transportation.",
  },
  {
    id: "db_2",
    instanceId: "inst_1",
    name: "EAD",
    remarks: "Environment Agency - Abu Dhabi data repository.",
  },
  {
    id: "db_3",
    instanceId: "inst_1",
    name: "COMPFAC",
    remarks: "Company Facilities database.",
  },
  {
    id: "db_4",
    instanceId: "inst_1",
    name: "TAQA",
    remarks: "Abu Dhabi National Energy Company database.",
  },
];

const initialSchemas: SchemaItem[] = [
  {
    id: "sch_1",
    dbId: "db_1",
    name: "DMT",
    remarks: "Auto-mapped main schema",
  },
];

const initialMappings: MappingItem[] = [
  {
    id: "map_1",
    instanceId: "inst_1",
    dbId: "db_1",
    entityName: "Abu Dhabi Digital Authority",
    tableName: "DMT",
    mappedColumnsCount: 8,
    active: true,
  },
  {
    id: "map_2",
    instanceId: "inst_1",
    dbId: "db_1",
    entityName: "Dept of Government Enablement",
    tableName: "DMT",
    mappedColumnsCount: 8,
    active: true,
  },
  {
    id: "map_3",
    instanceId: "inst_1",
    dbId: "db_1",
    entityName: "Abu Dhabi Distribution Company",
    tableName: "DMT",
    mappedColumnsCount: 8,
    active: true,
  },
  {
    id: "map_4",
    instanceId: "inst_1",
    dbId: "db_1",
    entityName: "Abu Dhabi Housing Authority",
    tableName: "DMT",
    mappedColumnsCount: 8,
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
      if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    }
    return initialInstances;
  });

  const [databases, setDatabases] = useState<DatabaseItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.DATABASES);
      if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    }
    return initialDatabases;
  });

  const [schemas, setSchemas] = useState<SchemaItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEMAS);
      if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    }
    return initialSchemas;
  });

  const [mappings, setMappings] = useState<MappingItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.MAPPINGS);
      if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    }
    return initialMappings;
  });

  // Selection states
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>("inst_1");
  const [mappingInstanceId, setMappingInstanceId] = useState<string>("inst_1");
  const [mappingDbId, setMappingDbId] = useState<string>("db_1");
  const [expandedDbIds, setExpandedDbIds] = useState<Record<string, boolean>>({ db_1: true });

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
            className="h-9.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 font-bold text-xs shrink-0 self-start sm:self-center rounded-lg shadow-sm"
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
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Database className="h-4 w-4" /> DB Instances
            <span className="ml-1 px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-mono">2</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab("schemas")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "schemas"
              ? "border-primary text-primary font-bold"
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
              ? "border-primary text-primary font-bold"
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
                <SelectItem value="SQL Server">SQL Server</SelectItem>
                <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                <SelectItem value="Oracle">Oracle</SelectItem>
                <SelectItem value="MySQL">MySQL</SelectItem>
                <SelectItem value="PostGIS">PostGIS</SelectItem>
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
                <SelectItem value="UAT">UAT</SelectItem>
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
                    <TableCell colSpan={8} className="text-center py-16 text-muted-foreground text-xs hover:bg-transparent">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.03] border border-border/40 text-muted-foreground/75">
                          <Database className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                          No DB instances yet — click Create DB Instance.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInstances.map((item) => {
                    const dbCount = databases.filter((d) => d.instanceId === item.id).length;
                    return (
                      <TableRow key={item.id} className="hover:bg-foreground/[0.01] whitespace-nowrap">
                        <TableCell className="px-4 py-3 text-xs text-foreground">
                          <div className="flex items-center gap-3 select-none">
                            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0">
                              <Database className="h-4.5 w-4.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-extrabold text-foreground leading-normal block">{item.name}</span>
                              <span className="text-[9.5px] text-muted-foreground font-mono leading-none tracking-wide uppercase mt-0.5">{item.name.replace(/\s+/g, "_").toUpperCase()}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/80 bg-foreground/[0.02] text-[10px] font-extrabold text-foreground tracking-wide select-none">
                            <Server className="h-3 w-3 text-muted-foreground" />
                            {item.type}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-[10px] font-extrabold text-blue-500 uppercase tracking-wider select-none">
                            {item.environment}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 font-mono text-[11px] text-muted-foreground">{item.hostname}</TableCell>
                        <TableCell className="py-3 font-mono text-[11px] text-muted-foreground">{item.ipAddress}</TableCell>
                        <TableCell className="py-3 text-xs text-muted-foreground max-w-[200px] truncate" title={item.remarks}>
                          {item.remarks || "—"}
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          <span className="inline-flex h-5.5 w-5.5 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-800 text-[10.5px] font-extrabold font-mono select-none">
                            {dbCount}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <div className="flex justify-center items-center gap-2 select-none">
                            <button
                              onClick={() => {
                                setSelectedInstanceId(item.id);
                                setActiveTab("schemas");
                              }}
                              className="p-1.5 text-amber-500 hover:bg-amber-500/10 border border-amber-500/30 rounded cursor-pointer transition-colors"
                              title="Manage Databases & Schemas"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteInstance(item.id, item.name)}
                              className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-border rounded cursor-pointer transition-colors"
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
                <SelectTrigger className="w-[320px] h-9">
                  <SelectValue placeholder="— Select a DB instance —" />
                </SelectTrigger>
                <SelectContent>
                  {instances.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name} • {i.type} • {i.environment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => toast.success("Refreshed databases successfully")}
                className="h-9 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </Button>
            </div>
          </Surface>

          {/* Selected Instance Summary Header (2nd screenshot) */}
          {selectedInstanceId && (
            (() => {
              const instObj = instances.find(i => i.id === selectedInstanceId);
              const dbCount = databases.filter((d) => d.instanceId === selectedInstanceId).length;
              if (!instObj) return null;
              return (
                <Surface className="p-4 flex items-center justify-between border border-border shadow-sm">
                  {/* Left block info */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0 shadow-sm">
                      <Database className="h-5.5 w-5.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-foreground leading-none">{instObj.name}</h3>
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/25 text-[8.5px] font-black text-blue-500 uppercase tracking-wide">
                          {instObj.type}
                        </span>
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[8.5px] font-black text-emerald-500 uppercase tracking-wide">
                          {instObj.environment}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-3">
                        <span>Hostname: <strong className="text-foreground">{instObj.hostname}</strong></span>
                        <span>IP: <strong className="text-foreground">{instObj.ipAddress}</strong></span>
                      </div>
                      <p className="text-[10px] text-muted-foreground/80 font-medium">
                        {instObj.remarks}
                      </p>
                    </div>
                  </div>

                  {/* Right block count & Add button */}
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-950 dark:bg-slate-800 text-white border border-slate-800 rounded-xl px-4 py-2 flex flex-col items-center justify-center shrink-0 min-w-[90px] shadow-sm select-none">
                      <span className="text-[8px] font-black tracking-wider uppercase text-slate-400">DATABASES</span>
                      <span className="text-xl font-black text-white leading-none mt-1">{dbCount}</span>
                    </div>
                    <Button
                      onClick={() => setIsDbModalOpen(true)}
                      className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 rounded-lg shadow-sm"
                    >
                      <Plus className="h-4 w-4" /> Add Database
                    </Button>
                  </div>
                </Surface>
              );
            })()
          )}

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
                    const isExpanded = expandedDbIds[db.id];
                    return (
                      <Surface key={db.id} className="p-4 space-y-4">
                        {/* Database Row Header */}
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex items-center gap-3.5 cursor-pointer select-none"
                            onClick={() => setExpandedDbIds(prev => ({ ...prev, [db.id]: !prev[db.id] }))}
                          >
                            <span className="text-muted-foreground font-black text-xs">
                              {isExpanded ? "▼" : "▶"}
                            </span>
                            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
                              <Database className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h4 className="text-xs font-bold text-foreground">{db.name}</h4>
                                <span className="inline-flex px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-extrabold text-blue-500 uppercase ml-2 select-none">
                                  owner: {db.name}
                                </span>
                              </div>
                              <p className="text-[10px] text-muted-foreground/80 leading-normal font-semibold mt-0.5">
                                {db.remarks || "No remarks provided"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-semibold text-muted-foreground select-none">
                              {dbSchemas.length} schemas
                            </span>
                            <div className="flex items-center gap-1.5 select-none">
                              <Button
                                onClick={() => {
                                  setTargetDbId(db.id);
                                  setIsSchemaModalOpen(true);
                                }}
                                className="h-8 px-2.5 bg-foreground/[0.04] border border-border hover:bg-foreground/[0.07] text-foreground font-semibold text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" /> Add Schema
                              </Button>
                              <button
                                onClick={() => toast.success(`Edit action for DB "${db.name}"`)}
                                className="p-1.5 text-amber-500 hover:bg-amber-500/10 border border-amber-500/30 rounded cursor-pointer transition-colors"
                                title="Edit Database"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDb(db.id, db.name)}
                                className="p-1.5 text-red-500 hover:bg-red-500/10 border border-red-500/30 rounded cursor-pointer transition-colors"
                                title="Delete Database"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Collapsible Schema list table */}
                        {isExpanded && (
                          <div className="w-full rounded-xl border border-border/30 overflow-hidden pt-2">
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
                        )}
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

          {/* Breadcrumb Links (3rd screenshot) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none pb-1">
            <span className="text-blue-500 hover:underline cursor-pointer">Internal Database</span>
            <span>&rsaquo;</span>
            <span className="text-blue-500 hover:underline cursor-pointer">DMT</span>
            <span>&rsaquo;</span>
            <span className="text-pink-500 font-bold">Entity</span>
            <span>&rsaquo;</span>
            <span className="text-muted-foreground">Schema Mapping</span>
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
                {mappingInstanceId && (
                  <div className="text-[10px] text-muted-foreground font-semibold px-0.5">
                    Test — 10.10.10.10
                  </div>
                )}
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
                {mappingDbId && (
                  <div className="text-[10px] text-muted-foreground font-semibold px-0.5">
                    DMT
                  </div>
                )}
              </div>

              {/* Selected Context Card (3rd screenshot) */}
              {mappingInstanceId && mappingDbId && (
                <div className="bg-slate-50 dark:bg-slate-950/40 border border-border/80 rounded-xl p-3.5 space-y-2.5 mt-2 shadow-sm select-none">
                  <div className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wide border-b border-border/40 pb-1.5">
                    Selected Context
                  </div>
                  <div className="space-y-1.5 text-[10.5px] font-semibold text-foreground">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Instance</span>
                      <span className="font-bold">Internal Database</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Database</span>
                      <span className="font-bold">DMT</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">DB Owner</span>
                      <span className="bg-slate-950 text-white dark:bg-slate-800 dark:text-slate-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase leading-none">
                        DMT
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Schemas available</span>
                      <span className="font-mono font-extrabold text-blue-500">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Existing mappings</span>
                      <span className="font-mono font-extrabold text-pink-500">4</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border/40 text-center">
                    <button 
                      onClick={() => setActiveTab("schemas")}
                      className="text-[10px] font-extrabold text-blue-500 hover:text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      Manage schemas in Tab 2 <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="h-8.5 px-3 font-semibold text-xs flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      toast.success("Database schemas and mappings refreshed successfully");
                    }}
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                  </Button>
                  <Button
                    variant="default"
                    className="h-8.5 px-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer rounded-lg shadow-sm border-0"
                    onClick={() => {
                      if (!mappingInstanceId || !mappingDbId) {
                        toast.error("Please select a DB instance and database first");
                        return;
                      }
                      setIsMappingModalOpen(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Entity
                  </Button>
                </div>
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
                        <TableHead className="font-semibold text-muted-foreground text-xs">CODE</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-xs">SCHEMA</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-xs">REMARKS</TableHead>
                        <TableHead className="font-semibold text-muted-foreground text-xs">UPDATED</TableHead>
                        <TableHead className="px-4 font-semibold text-muted-foreground text-xs text-center">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeMappingsList.map((item) => (
                        <TableRow key={item.id} className="hover:bg-foreground/[0.01] whitespace-nowrap">
                          <TableCell className="px-4 py-3 text-xs text-foreground">
                            <div className="flex items-center gap-2 select-none">
                              <Users className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                              <span className="font-bold text-foreground">{item.entityName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="px-2 py-0.5 rounded bg-muted border border-border/60 text-[10px] font-extrabold font-mono text-muted-foreground uppercase select-none">
                              {item.entityName === "Abu Dhabi Digital Authority" ? "ADDA" : item.entityName === "Dept of Government Enablement" ? "DGE" : item.entityName === "Abu Dhabi Distribution Company" ? "ADDC" : "ADHA"}
                            </span>
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-1.5 select-none">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9.5px] font-extrabold text-emerald-500">
                                <Database className="h-3 w-3" /> DMT
                              </span>
                              <span className="text-[9px] text-muted-foreground font-semibold">owner: DMT</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-xs text-muted-foreground select-none font-semibold">
                            {item.entityName === "Abu Dhabi Digital Authority" ? "—" : "Auto-bound by Save Mapping"}
                          </TableCell>
                          <TableCell className="py-3 text-xs text-muted-foreground select-none font-semibold font-mono">
                            {item.entityName === "Abu Dhabi Digital Authority" ? "21/05/2026" : item.entityName === "Dept of Government Enablement" ? "24/05/2026" : item.entityName === "Abu Dhabi Distribution Company" ? "24/05/2026" : "04/06/2026"}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            <div className="flex justify-center items-center select-none">
                              <button
                                onClick={() => toast.success(`Edit action for "${item.entityName}"`)}
                                className="p-1 text-amber-500 hover:bg-amber-500/10 border border-amber-500/30 rounded cursor-pointer transition-colors mr-2"
                                title="Edit Mapping"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMapping(item.id, item.entityName)}
                                className="p-1 text-red-500 hover:bg-red-500/10 border border-red-500/30 rounded cursor-pointer transition-colors"
                                title="Delete Mapping"
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
                    <SelectItem value="SQL Server">SQL Server</SelectItem>
                    <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                    <SelectItem value="Oracle">Oracle</SelectItem>
                    <SelectItem value="MySQL">MySQL</SelectItem>
                    <SelectItem value="PostGIS">PostGIS</SelectItem>
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
                    <SelectItem value="UAT">UAT</SelectItem>
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
