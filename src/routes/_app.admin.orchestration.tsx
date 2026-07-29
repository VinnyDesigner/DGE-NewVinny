import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Server,
  Network,
  Sliders,
  Check,
  X,
  Play,
  Database,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Trash2,
  AlertCircle,
  Cpu,
  ChevronDown,
  Building2,
  Workflow,
  HelpCircle,
  SlidersHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/_app/admin/orchestration")({
  head: () => ({
    meta: [
      { title: "Node Orchestration — Data Automation Studio" },
      { name: "description", content: "Orchestration worker nodes configuration" },
    ],
  }),
  component: NodeOrchestrationComponent,
});

interface ExecutionNode {
  name: string;
  ip: string;
  status: "Online" | "Offline";
  jobTypes: string;
  utilization: string;
  enabled: boolean;
  compatibility: "Compatible" | "Deprecated" | "Incompatible" | "Unknown";
}

interface ManagementNode {
  name: string;
  hostname: string;
  ip: string;
  status: "Online" | "Offline";
}

function NodeOrchestrationComponent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Active topology: 'standalone' | 'standard' | 'ha'
  const [topology, setTopology] = useState<"standalone" | "standard" | "ha">("standalone");
  
  // Tab: 'registry' | 'penalties' | 'distribution'
  const [activeTab, setActiveTab] = useState<"registry" | "penalties" | "distribution">("registry");

  // Topology Modal Trigger
  const [showTopologyModal, setShowTopologyModal] = useState(false);
  const [pendingTopology, setPendingTopology] = useState<"standalone" | "standard" | "ha">("standalone");

  // Standalone Node State
  const [standaloneNodeName, setStandaloneNodeName] = useState("da-standalone");
  const [standaloneHostName, setStandaloneHostName] = useState("da-host-01");
  const [standaloneIpAddress, setStandaloneIpAddress] = useState("10.0.0.10");

  // Management Tier State
  const [mgmtNodes, setMgmtNodes] = useState<ManagementNode[]>([]);
  const [showAddMgmtModal, setShowAddMgmtModal] = useState(false);
  const [newMgmtName, setNewMgmtName] = useState("");
  const [newMgmtHostname, setNewMgmtHostname] = useState("");
  const [newMgmtIp, setNewMgmtIp] = useState("");

  // Execution Tier State
  const [execNodes, setExecNodes] = useState<ExecutionNode[]>([]);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeIp, setNewNodeIp] = useState("");
  const [newNodeJobs, setNewNodeJobs] = useState("Pipeline, Delta Sync");
  const [newNodeCompat, setNewNodeCompat] = useState<"Compatible" | "Deprecated" | "Incompatible" | "Unknown">("Compatible");

  // Filter States
  const [execSearchQuery, setExecSearchQuery] = useState("");
  const [execStatusFilter, setExecStatusFilter] = useState("All statuses");
  const [execCompatFilter, setExecCompatFilter] = useState("All compatibility");
  const [isVisibilityOff, setIsVisibilityOff] = useState(false);

  // Dropdown States
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [compatDropdownOpen, setCompatDropdownOpen] = useState(false);

  // Save standalone form
  const handleSaveStandalone = () => {
    if (!standaloneNodeName.trim() || !standaloneHostName.trim() || !standaloneIpAddress.trim()) {
      toast.error("Please fill in all node details.");
      return;
    }
    toast.success("Standalone node settings updated.");
  };

  // Add management node
  const handleAddMgmtNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMgmtName.trim() || !newMgmtHostname.trim() || !newMgmtIp.trim()) {
      toast.error("Please fill in all management node details.");
      return;
    }
    const maxMgmt = topology === "ha" ? 2 : 1;
    if (mgmtNodes.length >= maxMgmt) {
      toast.error(`Maximum of ${maxMgmt} management nodes allowed in ${topology.toUpperCase()} topology.`);
      return;
    }
    setMgmtNodes((prev) => [
      ...prev,
      {
        name: newMgmtName,
        hostname: newMgmtHostname,
        ip: newMgmtIp,
        status: "Online",
      },
    ]);
    setShowAddMgmtModal(false);
    setNewMgmtName("");
    setNewMgmtHostname("");
    setNewMgmtIp("");
    toast.success("Management node registered successfully.");
  };

  // Add execution node
  const handleAddExecNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim() || !newNodeIp.trim()) {
      toast.error("Please fill in node name and IP address.");
      return;
    }
    if (execNodes.length >= 5) {
      toast.error("Maximum of 5 execution nodes reached.");
      return;
    }
    setExecNodes((prev) => [
      ...prev,
      {
        name: newNodeName,
        ip: newNodeIp,
        status: "Online",
        jobTypes: newNodeJobs,
        utilization: "0%",
        enabled: true,
        compatibility: newNodeCompat,
      },
    ]);
    setShowAddNodeModal(false);
    setNewNodeName("");
    setNewNodeIp("");
    setNewNodeJobs("Pipeline, Delta Sync");
    setNewNodeCompat("Compatible");
    toast.success("Execution node registered successfully.");
  };

  // Remove nodes
  const handleRemoveMgmtNode = (name: string) => {
    setMgmtNodes((prev) => prev.filter((n) => n.name !== name));
    toast.success("Management node removed.");
  };

  const handleRemoveExecNode = (name: string) => {
    setExecNodes((prev) => prev.filter((n) => n.name !== name));
    toast.success("Execution node removed.");
  };

  // Apply Topology
  const handleApplyTopology = () => {
    setTopology(pendingTopology);
    setShowTopologyModal(false);
    setActiveTab("registry");
    toast.success(`Topology set to ${pendingTopology === "ha" ? "HA" : pendingTopology.toUpperCase()}.`);
  };

  // Filtered Execution Nodes list
  const filteredExecNodes = useMemo(() => {
    return execNodes.filter((n) => {
      if (isVisibilityOff) return false;
      
      const q = execSearchQuery.toLowerCase();
      if (q && !n.name.toLowerCase().includes(q) && !n.ip.toLowerCase().includes(q)) {
        return false;
      }
      if (execStatusFilter !== "All statuses" && n.status !== execStatusFilter) {
        return false;
      }
      if (execCompatFilter !== "All compatibility" && n.compatibility !== execCompatFilter) {
        return false;
      }
      return true;
    });
  }, [execNodes, execSearchQuery, execStatusFilter, execCompatFilter, isVisibilityOff]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Node Orchestration"
        description="Manage execution nodes, monitor health, and configure load distribution"
        actions={
          <div className="flex items-center gap-3">
            <div className="inline-flex h-[30px] items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 select-none">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="capitalize">{topology === "ha" ? "High Availability" : topology} - active</span>
            </div>
            <button
              onClick={() => {
                setPendingTopology(topology);
                setShowTopologyModal(true);
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card hover:bg-card/90 px-3.5 text-xs font-extrabold text-foreground shadow-soft transition-colors cursor-pointer select-none"
            >
              <Network className="h-3.5 w-3.5" /> Choose Deployment Topology
            </button>
          </div>
        }
      />

      {/* METRIC CARDS ROW */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {/* Card 1: Topology */}
        <Surface className="!p-4 relative overflow-hidden group hover:border-primary/30 transition duration-300 flex flex-col justify-between h-[100px] border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">Topology</span>
            <Network className="h-4.5 w-4.5 text-purple-500" />
          </div>
          <div className="mt-2.5">
            <div className="text-[20px] font-black leading-none text-foreground capitalize">
              {topology === "standalone" ? "Standalone" : topology === "standard" ? "Standard" : "High Availability"}
            </div>
            <p className="text-[11px] text-muted-foreground/75 font-semibold mt-1 truncate font-medium">
              {topology === "standalone"
                ? "One node runs all agents"
                : "Management + execution tiers"}
            </p>
          </div>
        </Surface>

        {/* Card 2: Standalone or Management Nodes */}
        {topology === "standalone" ? (
          <Surface className="!p-4 relative overflow-hidden group hover:border-primary/30 transition duration-300 flex flex-col justify-between h-[100px] border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">Standalone Node</span>
              <Server className="h-4.5 w-4.5 text-emerald-500" />
            </div>
            <div className="mt-2.5">
              <div className="text-[20px] font-black leading-none text-foreground">0 of 1</div>
              <p className="text-[11px] text-muted-foreground/75 font-semibold mt-1 truncate font-medium">
                Scheduler + Dispatcher + Execution
              </p>
            </div>
          </Surface>
        ) : (
          <Surface className="!p-4 relative overflow-hidden group hover:border-primary/30 transition duration-300 flex flex-col justify-between h-[100px] border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">Management Nodes</span>
              <Server className="h-4.5 w-4.5 text-blue-500" />
            </div>
            <div className="mt-2.5">
              <div className="text-[20px] font-black leading-none text-foreground">
                {mgmtNodes.length} of {topology === "ha" ? 2 : 1}
              </div>
              <p className="text-[11px] text-muted-foreground/75 font-semibold mt-1 truncate font-medium">
                Scheduler + Dispatcher tier
              </p>
            </div>
          </Surface>
        )}

        {/* Card 3: Execution Nodes (standard/ha) or Active Jobs */}
        {topology !== "standalone" && (
          <Surface className="!p-4 relative overflow-hidden group hover:border-primary/30 transition duration-300 flex flex-col justify-between h-[100px] border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">Execution Nodes</span>
              <Cpu className="h-4.5 w-4.5 text-amber-500" />
            </div>
            <div className="mt-2.5">
              <div className="text-[20px] font-black leading-none text-foreground">{execNodes.length} of 5</div>
              <p className="text-[11px] text-muted-foreground/75 font-semibold mt-1 truncate font-medium">
                Job-running tier
              </p>
            </div>
          </Surface>
        )}

        {/* Card 4: Active Jobs */}
        <Surface className="!p-4 relative overflow-hidden group hover:border-primary/30 transition duration-300 flex flex-col justify-between h-[100px] border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">Active Jobs</span>
            <Play className="h-4 w-4 text-sky-500 shrink-0" />
          </div>
          <div className="mt-2.5">
            <div className="text-[20px] font-black leading-none text-foreground">0</div>
            <p className="text-[11px] text-muted-foreground/75 font-semibold mt-1 truncate font-medium">
              Currently running across nodes
            </p>
          </div>
        </Surface>
      </div>

      {/* TABS ROW */}
      <div className="flex border-b border-border/60">
        <button
          onClick={() => setActiveTab("registry")}
          className={cn(
            "px-5 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-all flex items-center gap-2 cursor-pointer",
            activeTab === "registry"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Database className={cn("h-4 w-4", activeTab === "registry" ? "text-primary" : "text-muted-foreground")} />
          Node Registry
        </button>
        <button
          onClick={() => setActiveTab("penalties")}
          className={cn(
            "px-5 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-all flex items-center gap-2 cursor-pointer",
            activeTab === "penalties"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <AlertCircle className={cn("h-4 w-4", activeTab === "penalties" ? "text-rose-500" : "text-muted-foreground")} />
          Node Penalties
        </button>
        {topology !== "standalone" && (
          <button
            onClick={() => setActiveTab("distribution")}
            className={cn(
              "px-5 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-all flex items-center gap-2 cursor-pointer",
              activeTab === "distribution"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <SlidersHorizontal className={cn("h-4 w-4", activeTab === "distribution" ? "text-primary" : "text-muted-foreground")} />
            Distribution Config
          </button>
        )}
      </div>

      {/* TAB CONTENTS */}
      <div className="space-y-6">
        {activeTab === "registry" && (
          <div className="space-y-6">
            {/* Standalone node registry view */}
            {topology === "standalone" ? (
              <Surface className="!p-5 space-y-5">
                <div className="flex gap-3 pb-4 border-b border-border/40 select-none">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary border border-border">
                    <Database className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <h3 className="text-xs font-extrabold text-foreground">Standalone node</h3>
                    <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed mt-0.5 max-w-4xl">
                      One machine runs all agents (Scheduler + Dispatcher + Execution). Enter its host and address, then Save. The Node ID is assigned and resolved automatically at first startup — no manual entry.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4.5 sm:grid-cols-3 max-w-5xl text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground block font-bold">Node name</label>
                    <input
                      type="text"
                      value={standaloneNodeName}
                      onChange={(e) => setStandaloneNodeName(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border bg-card/60 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground block font-bold">Host name</label>
                    <input
                      type="text"
                      value={standaloneHostName}
                      onChange={(e) => setStandaloneHostName(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border bg-card/60 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground block font-bold">IP address (VM)</label>
                    <input
                      type="text"
                      value={standaloneIpAddress}
                      onChange={(e) => setStandaloneIpAddress(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border bg-card/60 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={handleSaveStandalone}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 text-xs font-extrabold text-white shadow-soft transition cursor-pointer select-none"
                  >
                    <Check className="h-3.5 w-3.5" /> Save node
                  </button>
                </div>
              </Surface>
            ) : (
              // Standard / HA registry view
              <div className="space-y-6">
                {/* MANAGEMENT TIER BLOCK */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      MANAGEMENT TIER
                      <span className="text-muted-foreground/60 ml-1">
                        {mgmtNodes.length} of {topology === "ha" ? 2 : 1}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {mgmtNodes.map((n) => (
                      <Surface key={n.name} className="!p-4 border border-border hover:border-primary/20 transition relative">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="text-xs font-extrabold text-foreground">{n.name}</div>
                            <div className="text-[10.5px] text-muted-foreground font-semibold font-mono">{n.hostname} · {n.ip}</div>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-500 uppercase leading-none">
                            Online
                          </span>
                        </div>
                        <div className="flex justify-end mt-3 pt-3 border-t border-border/30">
                          <button
                            onClick={() => handleRemoveMgmtNode(n.name)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/5 p-1 rounded-md transition cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </Surface>
                    ))}

                    {mgmtNodes.length < (topology === "ha" ? 2 : 1) && (
                      <div
                        onClick={() => setShowAddMgmtModal(true)}
                        className="border border-dashed border-border/85 rounded-xl hover:border-primary/40 hover:bg-card/45 transition cursor-pointer h-[108px] flex items-center justify-center select-none"
                      >
                        <span className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                          <Plus className="h-4 w-4" /> Add management node
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* EXECUTION TIER BLOCK */}
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    EXECUTION TIER
                    <span className="text-muted-foreground/60 ml-1">{execNodes.length} of 5</span>
                  </div>

                  <Surface className="!p-0 border border-border/80">
                    {/* Control Bar inside surface container */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 p-4">
                      {/* Search box */}
                      <div className="relative w-full sm:w-[260px] shrink-0">
                        <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground rotate-90" />
                        <input
                          type="text"
                          value={execSearchQuery}
                          onChange={(e) => setExecSearchQuery(e.target.value)}
                          placeholder="Search name / IP..."
                          className="h-9 w-full rounded-lg border border-border bg-card/60 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
                        />
                      </div>

                      {/* Dropdowns row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => {
                              setStatusDropdownOpen(!statusDropdownOpen);
                              setCompatDropdownOpen(false);
                            }}
                            className="inline-flex h-9 items-center justify-between gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-bold text-foreground cursor-pointer select-none w-[110px]"
                          >
                            <span className="truncate">{execStatusFilter}</span>
                            <ChevronDown className="h-3.5 w-3.5 opacity-60 shrink-0" />
                          </button>
                          {statusDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setStatusDropdownOpen(false)} />
                              <div className="absolute left-0 top-full mt-1.5 w-[140px] rounded-lg border border-border bg-popover py-1 shadow-soft z-50 text-xs font-semibold text-foreground">
                                {["All statuses", "Online", "Offline"].map((item) => (
                                  <button
                                    key={item}
                                    onClick={() => {
                                      setExecStatusFilter(item);
                                      setStatusDropdownOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer",
                                      execStatusFilter === item && "bg-primary/5 text-primary font-bold"
                                    )}
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Compatibility Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => {
                              setCompatDropdownOpen(!compatDropdownOpen);
                              setStatusDropdownOpen(false);
                            }}
                            className="inline-flex h-9 items-center justify-between gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-bold text-foreground cursor-pointer select-none w-[140px]"
                          >
                            <span className="truncate">{execCompatFilter}</span>
                            <ChevronDown className="h-3.5 w-3.5 opacity-60 shrink-0" />
                          </button>
                          {compatDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setCompatDropdownOpen(false)} />
                              <div className="absolute left-0 top-full mt-1.5 w-[145px] rounded-lg border border-border bg-popover py-1 shadow-soft z-50 text-xs font-semibold text-foreground">
                                {["All compatibility", "Compatible", "Deprecated", "Incompatible", "Unknown"].map((item) => (
                                  <button
                                    key={item}
                                    onClick={() => {
                                      setExecCompatFilter(item);
                                      setCompatDropdownOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer",
                                      execCompatFilter === item && "bg-primary/5 text-primary font-bold"
                                    )}
                                  >
                                    {item}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Visibility Toggle */}
                        <button
                          onClick={() => setIsVisibilityOff(!isVisibilityOff)}
                          className={cn(
                            "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition cursor-pointer select-none",
                            isVisibilityOff 
                              ? "border-primary/30 bg-primary/5 text-primary" 
                              : "border-border bg-card text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {isVisibilityOff ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          <span>{isVisibilityOff ? "On" : "Off"}</span>
                        </button>

                        {/* Reload Button */}
                        <button
                          onClick={() => {
                            toast.success("List refreshed.");
                          }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition cursor-pointer"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>

                        {/* Add Node Button */}
                        <button
                          onClick={() => setShowAddNodeModal(true)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 text-xs font-extrabold text-white shadow-soft transition cursor-pointer select-none"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add node
                        </button>
                      </div>
                    </div>

                    {/* Table / Empty state block */}
                    {filteredExecNodes.length === 0 ? (
                      <div className="py-20 select-none text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/[0.04] border border-border text-muted-foreground mx-auto mb-3.5">
                          <Cpu className="h-5.5 w-5.5 text-muted-foreground" />
                        </span>
                        <h4 className="text-xs font-extrabold text-foreground">No execution nodes registered.</h4>
                        <p className="text-[10.5px] text-muted-foreground font-semibold max-w-sm mx-auto mt-1">
                          Register worker hosts to process scheduled geodatabase deliveries and validations.
                        </p>
                      </div>
                    ) : (
                      <div className="table-container-scrollable scrollbar-thin">
                        <table className="w-full text-left text-xs font-semibold">
                          <thead>
                            <tr className="border-b border-border bg-foreground/[0.03] text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                              <th className="px-5 py-3.5">Node</th>
                              <th className="px-5 py-3.5">Status</th>
                              <th className="px-5 py-3.5">Job types</th>
                              <th className="px-5 py-3.5">Utilization</th>
                              <th className="px-5 py-3.5">Compatibility</th>
                              <th className="px-5 py-3.5 text-right pr-8">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40">
                            {filteredExecNodes.map((n) => (
                              <tr key={n.name} className="hover:bg-foreground/[0.015] transition-colors">
                                <td className="px-5 py-3.5">
                                  <div className="font-bold text-foreground">{n.name}</div>
                                  <div className="text-[10.5px] text-muted-foreground font-mono mt-0.5">{n.ip}</div>
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-500 uppercase leading-none">
                                    {n.status}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-foreground/80 truncate max-w-[200px] font-medium">{n.jobTypes}</td>
                                <td className="px-5 py-3.5 font-mono font-bold text-foreground/75">{n.utilization}</td>
                                <td className="px-5 py-3.5">
                                  <span
                                    className={cn(
                                      "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold border uppercase select-none leading-none",
                                      n.compatibility === "Compatible" && "bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
                                      n.compatibility === "Deprecated" && "bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
                                      n.compatibility === "Incompatible" && "bg-rose-50 text-rose-700 border-rose-250 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
                                      n.compatibility === "Unknown" && "bg-slate-50 text-slate-700 border-slate-250 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20"
                                    )}
                                  >
                                    {n.compatibility}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-right pr-8">
                                  <button
                                    onClick={() => handleRemoveExecNode(n.name)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/5 p-1 rounded transition cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Surface>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Node Penalties Tab Content (matches 2nd Image) */}
        {activeTab === "penalties" && (
          <div className="space-y-6">
            <Surface className="!p-5 space-y-6">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40 select-none">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <Check className="h-5 w-5 text-emerald-500 stroke-[2.5]" />
                  </span>
                  <div>
                    <h3 className="text-xs font-extrabold text-foreground">Dispatcher node-penalty mode</h3>
                    <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed mt-0.5 max-w-3xl">
                      Controls whether retryable node-scoped execution failures temporarily exclude the affected node from Dispatcher selection.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <span className="inline-flex h-[28px] items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
                    Enabled
                  </span>
                  <button className="h-[28px] w-[28px] flex items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground transition cursor-pointer">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Penalty values Grid */}
              <div className="grid gap-5 grid-cols-2 md:grid-cols-4 text-xs font-semibold text-foreground/90">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Effective value</span>
                  <div className="text-[13px] font-extrabold text-foreground">true</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Configuration source</span>
                  <div className="text-[13px] font-extrabold text-foreground font-mono">env:DISPATCHER_NODE_PENALTY_ENABLED</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Consuming component</span>
                  <div className="text-[13px] font-extrabold text-foreground">DataAutomationAPI (DispatcherService)</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Restart required</span>
                  <div className="text-[13px] font-extrabold text-foreground">Yes (API)</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Base / Max backoff</span>
                  <div className="text-[13px] font-extrabold text-foreground font-mono">30s / 900s</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Window</span>
                  <div className="text-[13px] font-extrabold text-foreground font-mono">1800s</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Max failures</span>
                  <div className="text-[13px] font-extrabold text-foreground font-mono">5</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Topology</span>
                  <div className="text-[13px] font-extrabold text-foreground capitalize font-bold">
                    {topology === "ha" ? "HA" : topology}
                  </div>
                </div>
              </div>

              {/* Info alert box */}
              <div className="flex items-start gap-3 p-4 rounded-xl border border-border/80 bg-foreground/[0.015] leading-normal text-muted-foreground text-xs font-semibold">
                <AlertCircle className="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
                <span className="font-medium">
                  <strong>Standalone:</strong> penalty, same-node suppression, expiry and recovery are supported. <strong>Standard/HA:</strong> penalty also supports steering work toward another eligible node. Alternate-node steering is automated/integration tested. Live alternate-node steering requires Standard infrastructure.
                </span>
              </div>

              {/* List placeholder */}
              <div className="py-14 select-none text-center border-t border-border/40">
                <div className="text-muted-foreground font-bold text-xs uppercase tracking-wide">No nodes registered.</div>
              </div>

              {/* Status information bottom line */}
              <div className="text-[10.5px] text-muted-foreground/75 font-semibold pt-1 text-left border-t border-border/20 select-none">
                Authoritative status as of 11:38:17 · penalty state and eligibility are API-derived.
              </div>
            </Surface>
          </div>
        )}

        {/* Distribution Tab Content (Standard/HA only) */}
        {activeTab === "distribution" && topology !== "standalone" && (
          <Surface className="!p-5 space-y-4">
            <div className="flex gap-3 pb-4 border-b border-border/40 select-none">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary border border-border">
                <Sliders className="h-5 w-5 text-primary" />
              </span>
              <div>
                <h3 className="text-xs font-extrabold text-foreground">Load distribution configurations</h3>
                <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed mt-0.5">
                  Configure queue limits, prioritization, and failover behavior across execution nodes.
                </p>
              </div>
            </div>

            <div className="py-10 text-center select-none">
              <div className="text-xs font-bold text-muted-foreground">No active queues configured. Load balance metrics will appear once nodes receive work.</div>
            </div>
          </Surface>
        )}
      </div>

      {/* POPUP MODAL: CHOOSE TOPOLOGY (matches 3rd Image) */}
      {showTopologyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="fixed inset-0 cursor-pointer" onClick={() => setShowTopologyModal(false)} />
          
          <div className="bg-card border border-border/80 rounded-xl max-w-lg w-full p-6 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-200 z-50">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Network className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">Choose Deployment Topology</h3>
              </div>
              <button
                onClick={() => setShowTopologyModal(false)}
                className="text-muted-foreground hover:text-foreground transition p-1 hover:bg-foreground/[0.04] rounded-md cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs font-semibold text-muted-foreground/90 mb-5 leading-normal">
              Current: <span className="font-bold text-foreground uppercase">{topology === "ha" ? "HA" : topology}</span>. Changing this re-scopes the management/execution tiers.
            </p>

            {/* Options cards list */}
            <div className="space-y-3 mb-6">
              {[
                {
                  key: "standalone",
                  title: "Standalone",
                  desc: "One machine runs all 3 agents (Scheduler + Dispatcher + Execution).",
                },
                {
                  key: "standard",
                  title: "Standard enterprise",
                  desc: "Dedicated management + execution nodes, no failover pair.",
                },
                {
                  key: "ha",
                  title: "High availability",
                  desc: "Two management nodes (failover) + execution tier. Requires a shared database.",
                },
              ].map((opt) => {
                const isSelected = pendingTopology === opt.key;
                const isActive = topology === opt.key;
                return (
                  <label
                    key={opt.key}
                    onClick={() => setPendingTopology(opt.key as any)}
                    className={cn(
                      "flex items-start gap-3 p-4.5 rounded-xl border text-left cursor-pointer transition-all bg-card select-none",
                      isSelected
                        ? "border-primary ring-2 ring-primary/10 shadow-soft"
                        : "border-border/60 hover:bg-foreground/[0.015]"
                    )}
                  >
                    <input
                      type="radio"
                      name="deploymentTopology"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-0.5 h-4.5 w-4.5 border-border/60 bg-card accent-primary shrink-0 cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-foreground">{opt.title}</span>
                        {isActive && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wider ml-1">
                            current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-semibold leading-normal mt-1">
                        {opt.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
              <button
                onClick={() => setShowTopologyModal(false)}
                className="inline-flex h-9.5 items-center gap-1.5 rounded-lg border border-border/60 bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyTopology}
                className="inline-flex h-9.5 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 text-xs font-extrabold text-white shadow-soft transition cursor-pointer"
              >
                Apply topology
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: ADD MANAGEMENT NODE */}
      {showAddMgmtModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="fixed inset-0 cursor-pointer" onClick={() => setShowAddMgmtModal(false)} />
          
          <div className="bg-card border border-border/80 rounded-xl max-w-md w-full p-6 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-200 z-50">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Server className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">Add Management Node</h3>
              </div>
              <button
                onClick={() => setShowAddMgmtModal(false)}
                className="text-muted-foreground hover:text-foreground transition p-1 hover:bg-foreground/[0.04] rounded-md cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddMgmtNode} className="space-y-4 text-xs font-semibold text-foreground/90">
              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">Node Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. da-mgmt-01"
                  value={newMgmtName}
                  onChange={(e) => setNewMgmtName(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">Host Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. da-host-mgt-01"
                  value={newMgmtHostname}
                  onChange={(e) => setNewMgmtHostname(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">IP Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10.0.0.12"
                  value={newMgmtIp}
                  onChange={(e) => setNewMgmtIp(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/30 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddMgmtModal(false)}
                  className="inline-flex h-9.5 items-center gap-1.5 rounded-lg border border-border/60 bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9.5 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 text-xs font-extrabold text-white shadow-soft transition cursor-pointer"
                >
                  Add Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: ADD EXECUTION NODE */}
      {showAddNodeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="fixed inset-0 cursor-pointer" onClick={() => setShowAddNodeModal(false)} />
          
          <div className="bg-card border border-border/80 rounded-xl max-w-md w-full p-6 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-200 z-50">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">Add Execution Node</h3>
              </div>
              <button
                onClick={() => setShowAddNodeModal(false)}
                className="text-muted-foreground hover:text-foreground transition p-1 hover:bg-foreground/[0.04] rounded-md cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddExecNode} className="space-y-4 text-xs font-semibold text-foreground/90">
              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">Node Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. da-node-01"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">IP Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10.0.0.15"
                  value={newNodeIp}
                  onChange={(e) => setNewNodeIp(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">Job Types</label>
                <input
                  type="text"
                  placeholder="e.g. Pipeline, Delta Sync, Metadata"
                  value={newNodeJobs}
                  onChange={(e) => setNewNodeJobs(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">Compatibility Status</label>
                <select
                  value={newNodeCompat}
                  onChange={(e: any) => setNewNodeCompat(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                >
                  <option value="Compatible">Compatible</option>
                  <option value="Deprecated">Deprecated</option>
                  <option value="Incompatible">Incompatible</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/30 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddNodeModal(false)}
                  className="inline-flex h-9.5 items-center gap-1.5 rounded-lg border border-border/60 bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9.5 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 text-xs font-extrabold text-white shadow-soft transition cursor-pointer"
                >
                  Add Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
