import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Settings,
  X,
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

export const Route = createFileRoute("/_app/tools/parameters")({
  head: () => ({
    meta: [
      { title: "Tool Parameters — Data Automation Studio" },
      { name: "description", content: "General and tool-specific runtime parameters." },
    ],
  }),
  component: ToolParametersPage,
});

// Mock parameters list matching screenshot
const initialParameters = [
  {
    id: "param-1",
    name: "Longitude Alias Names",
    key: "FELC_CONNECTOR_X_COLUMN_ALIASES",
    tool: "Global Parameters",
    description: "We will store all possible column names for non-gis format files",
    status: "Active",
  },
  {
    id: "param-2",
    name: "Latitude Alias Names",
    key: "FELC_CONNECTOR_Y_COLUMN_ALIASES",
    tool: "Global Parameters",
    description: "—",
    status: "Active",
  },
  {
    id: "param-3",
    name: "Spatial Reference",
    key: "Spatial_Reference",
    tool: "Global Parameters",
    description: "This value sets the default spatial reference used to convert non-GIS data formats into GIS formats.",
    status: "Active",
  },
  {
    id: "param-4",
    name: "Target Spatial Reference",
    key: "Target_Spatial_Reference",
    tool: "Global Parameters",
    description: "This parameter is used to convert all the source data into WGS 1984 coordinate system",
    status: "Active",
  },
  {
    id: "param-5",
    name: "Count-guard threshold (percent)",
    key: "DATA_LOAD_DIFFPER",
    tool: "Data Loading",
    description: "Abort or warn if a layer's row-count change exceeds this percent (e.g. 10, 20, 50 = 50%). Legacy f...",
    status: "Active",
  },
  {
    id: "param-6",
    name: "Source lock lease (minutes)",
    key: "SOURCE_LOCK_LEASE_MINS",
    tool: "Data Collection Engine",
    description: "Lease for the per-source lock during DB/ESRI extract; heartbeat renews. Fallback 15.",
    status: "Active",
  },
  {
    id: "param-7",
    name: "Workspace base path",
    key: "WORKSPACE_BASE_PATH",
    tool: "Global Parameters",
    description: "Root automation workspace (entity folders live under DataDiscoveryEngine subpath).",
    status: "Active",
  },
  {
    id: "param-8",
    name: "Count-guard action",
    key: "DATA_LOAD_COUNT_GUARD_ACTION",
    tool: "Data Loading",
    description: "On a count-guard breach: abort (do not commit) | warn (commit but flag).",
    status: "Active",
  },
  {
    id: "param-9",
    name: "Source lock renew interval (min...",
    key: "SOURCE_LOCK_RENEW_MINS",
    tool: "Data Collection Engine",
    description: "Heartbeat renew interval (=lease/3). Fallback 5.",
    status: "Active",
  },
  {
    id: "param-10",
    name: "Backup before load",
    key: "BACKUP_ENABLED",
    tool: "Data Loading",
    description: "Back up the target feature class before mutating it (the recovery net).",
    status: "Active",
  },
];

function ToolParametersPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [parameters, setParameters] = useState(initialParameters);
  const [query, setQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState("all-tools");
  const [selectedStatus, setSelectedStatus] = useState("all-status");

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for adding parameter
  const [paramTool, setParamTool] = useState("Select a tool...");
  const [paramKey, setParamKey] = useState("");
  const [paramName, setParamName] = useState("");
  const [paramDescription, setParamDescription] = useState("");
  const [paramValue, setParamValue] = useState("");
  const [paramCategory, setParamCategory] = useState("");
  const [paramDataType, setParamDataType] = useState("string");
  const [paramDefaultValue, setParamDefaultValue] = useState("");
  const [paramRequired, setParamRequired] = useState(false);

  // Filters logic
  const filteredParams = useMemo(() => {
    return parameters.filter((p) => {
      // Filter by tool dropdown
      if (selectedTool !== "all-tools") {
        if (selectedTool === "global" && p.tool !== "Global Parameters") return false;
        if (selectedTool === "loading" && p.tool !== "Data Loading") return false;
        if (selectedTool === "collection" && p.tool !== "Data Collection Engine") return false;
      }

      // Filter by status dropdown
      if (selectedStatus !== "all-status") {
        if (p.status !== selectedStatus) return false;
      }

      // Filter by search query
      if (query) {
        const q = query.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.key.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q) &&
          !p.tool.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [parameters, query, selectedTool, selectedStatus]);

  const paginatedParams = useMemo(() => {
    return filteredParams.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredParams, currentPage, pageSize]);

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedParams.map((p) => p.id);
      setSelectedRowIds(allIds);
    } else {
      setSelectedRowIds([]);
    }
  };

  // Handle single select checkbox
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowIds((prev) => [...prev, id]);
    } else {
      setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  // Badge styles based on dark/light themes
  const getToolBadgeClass = (tool: string) => {
    const styles: Record<string, { dark: string; light: string }> = {
      "Global Parameters": {
        dark: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
        light: "bg-slate-100 text-slate-700 border border-slate-200",
      },
      "Data Loading": {
        dark: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        light: "bg-blue-50 text-blue-700 border border-blue-200",
      },
      "Data Collection Engine": {
        dark: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        light: "bg-purple-50 text-purple-700 border border-purple-200",
      },
    };
    return styles[tool] ? (isLight ? styles[tool].light : styles[tool].dark) : "";
  };

  const handleAddParameter = () => {
    if (paramTool === "Select a tool...") {
      toast.error("Please select a tool");
      return;
    }
    if (!paramKey) {
      toast.error("Please enter a parameter key");
      return;
    }

    const newParam = {
      id: `param-${parameters.length + 1}`,
      name: paramName || paramKey.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
      key: paramKey,
      tool: paramTool,
      description: paramDescription || "—",
      status: "Active",
    };

    setParameters((prev) => [...prev, newParam]);

    // Reset form states
    setParamTool("Select a tool...");
    setParamKey("");
    setParamName("");
    setParamDescription("");
    setParamValue("");
    setParamCategory("");
    setParamDataType("string");
    setParamDefaultValue("");
    setParamRequired(false);
    setIsAddModalOpen(false);

    toast.success("New parameter added successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tool Parameters"
        description="General and tool-specific runtime parameters"
      />

      {/* Main Parameters View */}
      <Surface padded={false}>
        {/* Header Ribbon of Table Section */}
        <div className="flex flex-wrap items-center justify-between border-b border-border/60 p-5 gap-4">
          <div className="flex items-center gap-3">
            <span className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset",
              isLight ? "bg-slate-100 ring-slate-200 text-slate-700" : "bg-accent/15 text-accent ring-accent/25"
            )}>
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </span>
            <div>
              <span className="font-bold text-[16px] text-foreground">All Tools</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                12 tools
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-b from-primary to-primary/90 px-3.5 py-2 text-[14px] font-medium text-white shadow-sm hover:from-primary/95 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add parameter
          </button>
        </div>

        {/* Filters Ribbon */}
        <div className="flex flex-col gap-3 border-b border-border/60 bg-foreground/[0.01] p-4 sm:flex-row sm:items-center justify-between">
          <div className="relative w-full sm:w-[300px] shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search key, label, value, description..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

          <div className="flex-1 min-w-[10px]" />

          <div className="flex items-center gap-3 flex-wrap">
            {/* Tool Selector Dropdown */}
            <Select value={selectedTool} onValueChange={(val) => {
              setSelectedTool(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-9 w-[150px] border-border/60 bg-card/60 text-[13px] text-foreground/80 hover:bg-card/90 transition-all font-semibold cursor-pointer">
                <SelectValue placeholder="All tools" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60 min-w-[150px]">
                <SelectItem value="all-tools" className="cursor-pointer hover:bg-muted font-semibold text-foreground/80 text-[13px]">All tools</SelectItem>
                <SelectItem value="global" className="cursor-pointer hover:bg-muted font-semibold text-foreground/80 text-[13px]">Global Parameters</SelectItem>
                <SelectItem value="loading" className="cursor-pointer hover:bg-muted font-semibold text-foreground/80 text-[13px]">Data Loading</SelectItem>
                <SelectItem value="collection" className="cursor-pointer hover:bg-muted font-semibold text-foreground/80 text-[13px]">Data Collection Engine</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Selector Dropdown */}
            <Select value={selectedStatus} onValueChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-9 w-[130px] border-border/60 bg-card/60 text-[13px] text-foreground/80 hover:bg-card/90 transition-all font-semibold cursor-pointer">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60 min-w-[130px]">
                <SelectItem value="all-status" className="cursor-pointer hover:bg-muted font-semibold text-foreground/80 text-[13px]">All status</SelectItem>
                <SelectItem value="Active" className="cursor-pointer hover:bg-muted font-semibold text-foreground/80 text-[13px]">Active</SelectItem>
                <SelectItem value="Inactive" className="cursor-pointer hover:bg-muted font-semibold text-foreground/80 text-[13px]">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Parameters Table */}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70">
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedParams.length > 0 && paginatedParams.every((p) => selectedRowIds.includes(p.id))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-foreground/20 bg-foreground/5 accent-primary cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3">Parameter Name</th>
                <th className="px-5 py-3">Parameter Key</th>
                <th className="px-5 py-3">Tool</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedParams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    No parameters found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedParams.map((p) => (
                  <tr key={p.id} className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02]">
                    {/* Checkbox */}
                    <td className="px-5 py-4 align-middle">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(p.id)}
                        onChange={(e) => handleSelectRow(p.id, e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-foreground/20 bg-foreground/5 accent-primary cursor-pointer"
                      />
                    </td>

                    {/* Parameter Name */}
                    <td className="px-5 py-4 align-middle font-semibold text-foreground whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-success" />
                        {p.name}
                      </div>
                    </td>

                    {/* Parameter Key */}
                    <td className="px-5 py-4 align-middle whitespace-nowrap">
                      <span className={cn(
                        "font-mono px-2 py-0.5 rounded text-[12px] border",
                        isLight 
                          ? "bg-slate-50 text-slate-800 border-slate-200" 
                          : "bg-slate-900/50 text-slate-300 border-slate-800/80"
                      )}>
                        {p.key}
                      </span>
                    </td>

                    {/* Tool Badge */}
                    <td className="px-5 py-4 align-middle whitespace-nowrap">
                      <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold", getToolBadgeClass(p.tool))}>
                        {p.tool}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4 align-middle max-w-xs">
                      <span className="text-muted-foreground block truncate" title={p.description}>
                        {p.description}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 align-middle text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          title="View parameter"
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md ring-1 ring-inset transition cursor-pointer",
                            isLight
                              ? "bg-blue-50 text-blue-700 ring-blue-200 hover:bg-blue-100"
                              : "bg-info/10 text-info ring-info/25 hover:bg-info/20"
                          )}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          title="Edit parameter"
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md ring-1 ring-inset transition cursor-pointer",
                            isLight
                              ? "bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100"
                              : "bg-warning/10 text-warning ring-warning/25 hover:bg-warning/20"
                          )}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete parameter"
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md ring-1 ring-inset transition cursor-pointer",
                            isLight
                              ? "bg-rose-50 text-rose-700 ring-rose-200 hover:bg-rose-100"
                              : "bg-danger/10 text-danger ring-danger/25 hover:bg-danger/20"
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination at bottom */}
        <TablePagination
          totalItems={filteredParams.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="parameter"
          itemNamePlural="parameters"
        />
      </Surface>

      {/* Add Parameter Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border/80 bg-card/95 text-foreground shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <SlidersHorizontal className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-foreground">Add parameter</h3>
                  <p className="text-[11.5px] text-muted-foreground/80 mt-0.5 leading-relaxed">
                    Choose the tool, then define the parameter. Values are stored as text; engines parse types on read.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground/75 hover:bg-muted/10 hover:text-foreground transition cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Form Fields Grid */}
            <div className="space-y-4 py-1">
              
              {/* SCOPE & IDENTITY */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-muted-foreground/75 uppercase tracking-wider block">Scope & Identity</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-extrabold text-muted-foreground/90 uppercase tracking-wider block">Tool <span className="text-destructive">*</span></label>
                    <select
                      value={paramTool}
                      onChange={(e) => setParamTool(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/60 bg-background/50 pl-3 pr-8 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 8px center",
                        backgroundSize: "14px"
                      }}
                    >
                      <option value="Select a tool...">Select a tool...</option>
                      <option value="Global Parameters">Global Parameters</option>
                      <option value="Data Analyzer">Data Analyzer</option>
                      <option value="Data Collection Engine">Data Collection Engine</option>
                      <option value="Data Discovery Engine">Data Discovery Engine</option>
                      <option value="Data Loading">Data Loading</option>
                      <option value="Data Quality Engine">Data Quality Engine</option>
                      <option value="Database Compress">Database Compress</option>
                      <option value="Delta Sync Engine">Delta Sync Engine</option>
                      <option value="External Data Sync Engine">External Data Sync Engine</option>
                      <option value="Internal Data Sync Engine">Internal Data Sync Engine</option>
                      <option value="Metadata Validation Engine">Metadata Validation Engine</option>
                      <option value="Scheduling Service">Scheduling Service</option>
                      <option value="Workspace Setup Engine">Workspace Setup Engine</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-extrabold text-muted-foreground/90 uppercase tracking-wider block">Parameter key <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      value={paramKey}
                      onChange={(e) => setParamKey(e.target.value)}
                      placeholder="e.g. WORKSPACE_BASE_PATH"
                      className="h-9 w-full rounded-lg border border-border/60 bg-background/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-extrabold text-muted-foreground/90 uppercase tracking-wider block">Parameter name</label>
                  <input
                    type="text"
                    value={paramName}
                    onChange={(e) => setParamName(e.target.value)}
                    placeholder="Operator-friendly name (optional)"
                    className="h-9 w-full rounded-lg border border-border/60 bg-background/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-extrabold text-muted-foreground/90 uppercase tracking-wider block">Description</label>
                  <input
                    type="text"
                    value={paramDescription}
                    onChange={(e) => setParamDescription(e.target.value)}
                    placeholder="What this parameter controls..."
                    className="h-9 w-full rounded-lg border border-border/60 bg-background/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* VALUE & TYPE */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-extrabold text-muted-foreground/75 uppercase tracking-wider block">Value & Type</span>
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-extrabold text-muted-foreground/90 uppercase tracking-wider block">Value</label>
                  <input
                    type="text"
                    value={paramValue}
                    onChange={(e) => setParamValue(e.target.value)}
                    placeholder="Stored as VARCHAR(4000)"
                    className="h-9 w-full rounded-lg border border-border/60 bg-background/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-extrabold text-muted-foreground/90 uppercase tracking-wider block">Category</label>
                    <input
                      type="text"
                      value={paramCategory}
                      onChange={(e) => setParamCategory(e.target.value)}
                      placeholder="Pick an existing category or type a new one"
                      className="h-9 w-full rounded-lg border border-border/60 bg-background/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-extrabold text-muted-foreground/90 uppercase tracking-wider block">Data type</label>
                    <select
                      value={paramDataType}
                      onChange={(e) => setParamDataType(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/60 bg-background/50 pl-3 pr-8 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer appearance-none font-semibold"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 8px center",
                        backgroundSize: "14px"
                      }}
                    >
                      <option value="— none —">— none —</option>
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                      <option value="json">json</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-extrabold text-muted-foreground/90 uppercase tracking-wider block">Default value</label>
                  <input
                    type="text"
                    value={paramDefaultValue}
                    onChange={(e) => setParamDefaultValue(e.target.value)}
                    placeholder="Optional fallback value (operator-shown)"
                    className="h-9 w-full rounded-lg border border-border/60 bg-background/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono"
                  />
                </div>
              </div>

              {/* FLAGS */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-extrabold text-muted-foreground/75 uppercase tracking-wider block">Flags</span>
                <div 
                  onClick={() => setParamRequired(!paramRequired)}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-background/50 cursor-pointer hover:bg-muted/5 transition select-none animate-in duration-200"
                >
                  <span className="text-[13px] font-semibold text-foreground">Required</span>
                  <div className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center transition",
                    paramRequired 
                      ? "bg-primary border-primary text-white" 
                      : "border-border bg-card"
                  )}>
                    {paramRequired && <span className="text-[9px] font-black">✓</span>}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2.5 border-t border-border/40 pt-4 mt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/80 bg-background hover:bg-muted/10 px-4 text-[13px] font-bold text-foreground transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddParameter}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-500 px-4 text-[13px] font-bold text-white transition cursor-pointer shadow-soft"
              >
                Add parameter
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
