import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
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
  AlertTriangle,
  Cpu,
  ChevronDown,
  Building2,
  Workflow,
  HelpCircle,
  SlidersHorizontal,
  Scale,
  GitBranch,
  ArrowUpDown,
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
  const [newMgmtName, setNewMgmtName] = useState("MGMT-01");
  const [newMgmtHostname, setNewMgmtHostname] = useState("da-exec-01");
  const [newMgmtIp, setNewMgmtIp] = useState("10.0.0.21");
  const [newMgmtNotes, setNewMgmtNotes] = useState("");

  // Execution Tier State
  const [execNodes, setExecNodes] = useState<ExecutionNode[]>([]);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNodeName, setNewNodeName] = useState("EXEC-01");
  const [newNodeHostname, setNewNodeHostname] = useState("da-exec-01");
  const [newNodeIp, setNewNodeIp] = useState("10.0.0.21");
  const [newNodeJobs, setNewNodeJobs] = useState("Pipeline, Delta Sync");
  const [newNodeCompat, setNewNodeCompat] = useState<"Compatible" | "Deprecated" | "Incompatible" | "Unknown">("Compatible");
  const [newNodeMaxJobs, setNewNodeMaxJobs] = useState(3);
  const [newNodeNotes, setNewNodeNotes] = useState("");
  const [distStrategy, setDistStrategy] = useState<"load_balanced" | "dedicated" | "priority_based">("load_balanced");
  const [leaseCountdown, setLeaseCountdown] = useState(10);

  // Lease renewal timer loop (HA mode)
  useEffect(() => {
    const timer = setInterval(() => {
      setLeaseCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    setNewMgmtName("MGMT-01");
    setNewMgmtHostname("da-exec-01");
    setNewMgmtIp("10.0.0.21");
    setNewMgmtNotes("");
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
    setNewNodeName("EXEC-01");
    setNewNodeHostname("da-exec-01");
    setNewNodeIp("10.0.0.21");
    setNewNodeJobs("Pipeline, Delta Sync");
    setNewNodeCompat("Compatible");
    setNewNodeMaxJobs(3);
    setNewNodeNotes("");
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
      <div className={cn(
        "grid gap-3 grid-cols-1 w-full",
        topology === "standalone" ? "md:grid-cols-3" : "md:grid-cols-4"
      )}>
        {/* Card 1: Topology */}
        <Surface className="!p-5 relative overflow-hidden group hover:border-primary/25 transition duration-300 h-[110px] shadow-sm">
          <div className="flex items-center justify-between h-full w-full">
            <div className="space-y-1.5 min-w-0">
              <span className="text-[10px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">Topology</span>
              <div className="text-[22px] font-black leading-none text-foreground capitalize">
                {topology === "standalone" ? "Standalone" : topology === "standard" ? "Standard" : "High Availability"}
              </div>
              <p className="text-[11px] text-muted-foreground/75 font-semibold leading-none truncate font-medium">
                {topology === "standalone"
                  ? "One node runs all agents"
                  : "Management + execution tiers"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 border border-purple-500/15">
              <Network className="h-5 w-5" />
            </div>
          </div>
        </Surface>

        {/* Card 2: Standalone or Management Nodes */}
        {topology === "standalone" ? (
          <Surface className="!p-5 relative overflow-hidden group hover:border-primary/25 transition duration-300 h-[110px] shadow-sm">
            <div className="flex items-center justify-between h-full w-full">
              <div className="space-y-1.5 min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">Standalone Node</span>
                <div className="text-[22px] font-black leading-none text-foreground">0 of 1</div>
                <p className="text-[11px] text-muted-foreground/75 font-semibold leading-none truncate font-medium">
                  Scheduler + Dispatcher + Execution
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/15">
                <Server className="h-5 w-5" />
              </div>
            </div>
          </Surface>
        ) : (
          <Surface className="!p-5 relative overflow-hidden group hover:border-primary/25 transition duration-300 h-[110px] shadow-sm">
            <div className="flex items-center justify-between h-full w-full">
              <div className="space-y-1.5 min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">Management Nodes</span>
                <div className="text-[22px] font-black leading-none text-foreground">
                  {mgmtNodes.length} of {topology === "ha" ? 2 : 1}
                </div>
                <p className="text-[11px] text-muted-foreground/75 font-semibold leading-none truncate font-medium">
                  {topology === "ha" ? "Active + standby (failover)" : "Scheduler + Dispatcher tier"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/15">
                <Server className="h-5 w-5" />
              </div>
            </div>
          </Surface>
        )}

        {/* Card 3: Execution Nodes (standard/ha) or Active Jobs */}
        {topology !== "standalone" && (
          <Surface className="!p-5 relative overflow-hidden group hover:border-primary/25 transition duration-300 h-[110px] shadow-sm">
            <div className="flex items-center justify-between h-full w-full">
              <div className="space-y-1.5 min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">Execution Nodes</span>
                <div className="text-[22px] font-black leading-none text-foreground">{execNodes.length} of 5</div>
                <p className="text-[11px] text-muted-foreground/75 font-semibold leading-none truncate font-medium">
                  Job-running tier
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/15">
                <Cpu className="h-5 w-5" />
              </div>
            </div>
          </Surface>
        )}

        {/* Card 4: Active Jobs */}
        <Surface className="!p-5 relative overflow-hidden group hover:border-primary/25 transition duration-300 h-[110px] shadow-sm">
          <div className="flex items-center justify-between h-full w-full">
            <div className="space-y-1.5 min-w-0">
              <span className="text-[10px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">Active Jobs</span>
              <div className="text-[22px] font-black leading-none text-foreground">0</div>
              <p className="text-[11px] text-muted-foreground/75 font-semibold leading-none truncate font-medium">
                Currently running across nodes
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0 border border-sky-500/15">
              <Play className="h-5 w-5" />
            </div>
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

                  {topology === "ha" ? (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative py-2 w-full">
                      {/* Left Slot: Active Node or placeholder */}
                      <div className="w-full md:w-[calc(50%-100px)]">
                        {mgmtNodes[0] ? (
                          <Surface className="!p-4 border border-border hover:border-primary/20 transition relative h-[108px] flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  {mgmtNodes[0].name}
                                </div>
                                <div className="text-[10.5px] text-muted-foreground font-semibold font-mono">{mgmtNodes[0].hostname} · {mgmtNodes[0].ip}</div>
                              </div>
                              <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-blue-500 uppercase leading-none">
                                ACTIVE
                              </span>
                            </div>
                            <div className="flex justify-end pt-2 border-t border-border/30">
                              <button
                                onClick={() => handleRemoveMgmtNode(mgmtNodes[0].name)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/5 p-1 rounded-md transition cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </Surface>
                        ) : (
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

                      {/* Middle Animated Lease Renew Tracker (in blue theme) */}
                      <div className="w-[180px] shrink-0 flex flex-col items-center justify-center relative select-none">
                        {/* Horizontal connector lines */}
                        <div className="hidden md:block absolute left-0 right-[55%] top-[24px] border-t-2 border-dashed border-blue-500/30" />
                        <div className="hidden md:block absolute left-[55%] right-0 top-[24px] border-t-2 border-dashed border-blue-500/30" />

                        {/* Rotating blue icon circle */}
                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] border border-blue-400/20 transition-transform duration-500 hover:scale-110">
                          <RefreshCw className="h-5 w-5 animate-[spin_6s_linear_infinite]" />
                        </div>

                        {/* Countdown Box */}
                        <div className="mt-3.5 bg-card border border-border/80 px-4 py-1.5 rounded-lg shadow-sm text-center min-w-[70px]">
                          <span className="text-[12px] font-black text-foreground font-mono">{leaseCountdown} sec</span>
                        </div>

                        {/* Labels */}
                        <div className="text-center mt-2.5">
                          <div className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none">LEASE RENEW</div>
                          <div className="text-[8.5px] font-extrabold text-muted-foreground mt-0.5">of 30s TTL</div>
                        </div>
                      </div>

                      {/* Right Slot: Standby Node or placeholder */}
                      <div className="w-full md:w-[calc(50%-100px)]">
                        {mgmtNodes[1] ? (
                          <Surface className="!p-4 border border-border hover:border-primary/20 transition relative h-[108px] flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                  {mgmtNodes[1].name}
                                </div>
                                <div className="text-[10.5px] text-muted-foreground font-semibold font-mono">{mgmtNodes[1].hostname} · {mgmtNodes[1].ip}</div>
                              </div>
                              <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-blue-500 uppercase leading-none">
                                STANDBY
                              </span>
                            </div>
                            <div className="flex justify-end pt-2 border-t border-border/30">
                              <button
                                onClick={() => handleRemoveMgmtNode(mgmtNodes[1].name)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/5 p-1 rounded-md transition cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </Surface>
                        ) : (
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
                  ) : (
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
                  )}
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
                                {["All statuses", "Online", "Offline", "Disabled"].map((item) => (
                                  <button
                                    key={item}
                                    onClick={() => {
                                      setExecStatusFilter(item);
                                      setStatusDropdownOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-3.5 py-2 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer",
                                      execStatusFilter === item
                                        ? "bg-blue-600 text-white font-extrabold"
                                        : "text-foreground"
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
                                      "w-full text-left px-3.5 py-2 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer",
                                      execCompatFilter === item
                                        ? "bg-blue-600 text-white font-extrabold"
                                        : "text-foreground"
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
                    {topology === "ha" ? "High Availability" : topology === "standard" ? "Standard" : "Standalone"}
                  </div>
                </div>
              </div>

              {/* Info alert box */}
              <div className="flex items-start gap-3 p-4 rounded-xl border border-border/80 bg-foreground/[0.015] leading-normal text-muted-foreground text-xs font-semibold mt-5 mb-5">
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
          <div className="space-y-5">
            {/* Top Subtitle banner */}
            <div className="text-[11px] text-muted-foreground/80 font-bold leading-normal select-none">
              Pool-wide dispatch policy + execution-tier defaults. Per-node overrides live in Node Registry; management active/standby + HA heartbeat live in the Management tier.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: Distribution Strategy */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Distribution Strategy Card */}
                <Surface className="!p-5 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-border/40 select-none">
                    <h3 className="text-xs font-extrabold text-foreground flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      Distribution strategy
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-purple-500 leading-none">
                      Execution tier
                    </span>
                  </div>

                  {/* Three Strategy selection option cards */}
                  <div className="grid gap-3.5 sm:grid-cols-3">
                    {/* Option 1: Load balanced */}
                    <div
                      onClick={() => setDistStrategy("load_balanced")}
                      className={cn(
                        "border rounded-xl p-4 bg-card cursor-pointer relative transition duration-250 flex flex-col justify-between min-h-[105px]",
                        distStrategy === "load_balanced"
                          ? "border-blue-500 ring-2 ring-blue-500/10 shadow-soft"
                          : "border-border/60 hover:bg-foreground/[0.015]"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Scale className={cn("h-3.5 w-3.5 shrink-0", distStrategy === "load_balanced" ? "text-blue-500" : "text-muted-foreground/75")} />
                          <span className="text-xs font-extrabold text-foreground truncate">Load balanced</span>
                        </div>
                        <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider leading-none shrink-0">
                          DEFAULT
                        </span>
                      </div>
                      <p className="text-[10.5px] font-semibold text-muted-foreground mt-2 leading-relaxed">
                        Spread jobs across the least-busy nodes
                      </p>
                    </div>

                    {/* Option 2: Dedicated */}
                    <div
                      onClick={() => setDistStrategy("dedicated")}
                      className={cn(
                        "border rounded-xl p-4 bg-card cursor-pointer relative transition duration-250 flex flex-col justify-between min-h-[105px]",
                        distStrategy === "dedicated"
                          ? "border-blue-500 ring-2 ring-blue-500/10 shadow-soft"
                          : "border-border/60 hover:bg-foreground/[0.015]"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <GitBranch className={cn("h-3.5 w-3.5 shrink-0", distStrategy === "dedicated" ? "text-blue-500" : "text-muted-foreground/75")} />
                        <span className="text-xs font-extrabold text-foreground truncate">Dedicated</span>
                      </div>
                      <p className="text-[10.5px] font-semibold text-muted-foreground mt-2 leading-relaxed">
                        Pin job types to specific nodes
                      </p>
                    </div>

                    {/* Option 3: Priority based */}
                    <div
                      onClick={() => setDistStrategy("priority_based")}
                      className={cn(
                        "border rounded-xl p-4 bg-card cursor-pointer relative transition duration-250 flex flex-col justify-between min-h-[105px]",
                        distStrategy === "priority_based"
                          ? "border-blue-500 ring-2 ring-blue-500/10 shadow-soft"
                          : "border-border/60 hover:bg-foreground/[0.015]"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <ArrowUpDown className={cn("h-3.5 w-3.5 shrink-0", distStrategy === "priority_based" ? "text-blue-500" : "text-muted-foreground/75")} />
                        <span className="text-xs font-extrabold text-foreground truncate">Priority based</span>
                      </div>
                      <p className="text-[10.5px] font-semibold text-muted-foreground mt-2 leading-relaxed">
                        Honour per-node priority ordering
                      </p>
                    </div>
                  </div>
                </Surface>

                {/* 2. Dedicated assignments Card (conditional based on 3rd Image) */}
                {distStrategy === "dedicated" && (
                  <Surface className="!p-5 space-y-4 animate-in fade-in slide-in-from-top-3 duration-250">
                    <div className="flex items-center justify-between pb-3 border-b border-border/40 select-none">
                      <h3 className="text-xs font-extrabold text-foreground flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-primary" />
                        Dedicated assignments
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-purple-500 leading-none">
                        Execution tier
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                      Job-type &rarr; node assignments are managed per node &mdash; open an execution node's Assign job types action in the Node Registry tab. They persist per node and are honored by this strategy.
                    </p>
                  </Surface>
                )}

                {/* 3. Concurrency Card (Separate Card to align properly and maintain height) */}
                <Surface className="!p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/40 select-none">
                    <h4 className="text-xs font-extrabold text-foreground flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      Concurrency
                    </h4>
                    <span className="inline-flex items-center gap-1 rounded bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-purple-500 leading-none">
                      Execution tier
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                    Max concurrent jobs is set per node in the Node Registry tab (Configure resources).
                  </p>
                </Surface>
              </div>

              {/* Right Column: Heartbeat and thresholds */}
              <div className="lg:col-span-5 space-y-5">
                {/* Heartbeat Defaults Card */}
                <Surface className="!p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/40 select-none">
                    <h3 className="text-xs font-extrabold text-foreground">Heartbeat (defaults)</h3>
                    <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-blue-500 leading-none">
                      Pool-wide
                    </span>
                  </div>
                  <p className="text-[10.5px] text-muted-foreground font-semibold leading-relaxed select-none">
                    Interval is a default — override per execution node in Configure resources.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground font-bold block leading-tight">Default interval (secs) (5-300)</label>
                      <input
                        type="number"
                        defaultValue={30}
                        className="h-9 w-full rounded-lg border border-border bg-card/60 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground font-bold block leading-tight">Missed — offline (1-10)</label>
                      <input
                        type="number"
                        defaultValue={3}
                        className="h-9 w-full rounded-lg border border-border bg-card/60 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground font-bold block leading-tight">Fixed node wait (mins) (1-30)</label>
                      <input
                        type="number"
                        defaultValue={3}
                        className="h-9 w-full rounded-lg border border-border bg-card/60 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono font-bold"
                      />
                    </div>
                  </div>
                </Surface>

                {/* Hard block thresholds defaults Card */}
                <Surface className="!p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/40 select-none">
                    <h3 className="text-xs font-extrabold text-foreground">Hard block thresholds (defaults)</h3>
                    <span className="inline-flex items-center gap-1 rounded bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-purple-500 leading-none">
                      Execution tier
                    </span>
                  </div>
                  <p className="text-[10.5px] text-muted-foreground font-semibold leading-relaxed select-none">
                    Defaults — overridable per execution node in Configure resources.
                  </p>

                  <div className="grid gap-3.5 sm:grid-cols-2 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground font-bold block leading-tight">Default disk block % (50-100)</label>
                      <input
                        type="number"
                        defaultValue={95}
                        className="h-9 w-full rounded-lg border border-border bg-card/60 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground font-bold block leading-tight">Default memory block % (50-100)</label>
                      <input
                        type="number"
                        defaultValue={95}
                        className="h-9 w-full rounded-lg border border-border bg-card/60 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono font-bold"
                      />
                    </div>
                  </div>
                </Surface>
              </div>
            </div>

            {/* Action buttons row */}
            <div className="flex items-center justify-between pt-4 border-t border-border/45 select-none">
              <button
                onClick={() => {
                  toast.success("Defaults restored.");
                }}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition"
              >
                Reset to defaults
              </button>
              <button
                onClick={() => {
                  toast.success("Load distribution strategy and default parameters saved successfully.");
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 text-xs font-extrabold text-white shadow-soft transition cursor-pointer"
              >
                Save configuration
              </button>
            </div>
          </div>
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

            {pendingTopology === "ha" && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-200 leading-normal text-xs font-semibold mb-6">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span className="font-medium">
                  Switching <span className="font-extrabold">{topology.toUpperCase()}</span> &rarr; <span className="font-extrabold">HA</span> re-scopes the tiers. Any registered node that becomes invalid under HA is disabled and flagged (never deleted) &mdash; you'll see the list here.
                </span>
              </div>
            )}

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
          
          <div className="bg-card border border-border/80 rounded-xl max-w-lg w-full p-6 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-200 z-50">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Server className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">Register Node</h3>
              </div>
              <button
                onClick={() => setShowAddMgmtModal(false)}
                className="text-muted-foreground hover:text-foreground transition p-1 hover:bg-foreground/[0.04] rounded-md cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs font-semibold text-muted-foreground/90 mb-5 leading-normal">
              Add an orchestration node. It appears as PENDING until the agent sends its first heartbeat.
            </p>

            <form onSubmit={handleAddMgmtNode} className="space-y-4 text-xs font-semibold text-foreground/90">
              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">Management node name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MGMT-01"
                  value={newMgmtName}
                  onChange={(e) => setNewMgmtName(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">Role</label>
                <input
                  type="text"
                  disabled
                  value="Management"
                  className="h-9.5 w-full rounded-lg border border-border bg-muted/65 px-3 text-xs text-muted-foreground/80 focus:outline-none cursor-not-allowed font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">Hostname</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. da-exec-01"
                  value={newMgmtHostname}
                  onChange={(e) => setNewMgmtHostname(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">IP address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10.0.0.21"
                  value={newMgmtIp}
                  onChange={(e) => setNewMgmtIp(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">Notes (optional)</label>
                <textarea
                  placeholder=""
                  value={newMgmtNotes}
                  onChange={(e) => setNewMgmtNotes(e.target.value)}
                  className="min-h-[70px] w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 font-semibold"
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
                  Register Node
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
          
          <div className="bg-card border border-border/80 rounded-xl max-w-lg w-full p-6 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-200 z-50">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">Register Node</h3>
              </div>
              <button
                onClick={() => setShowAddNodeModal(false)}
                className="text-muted-foreground hover:text-foreground transition p-1 hover:bg-foreground/[0.04] rounded-md cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs font-semibold text-muted-foreground/90 mb-5 leading-normal">
              Add an orchestration node. It appears as PENDING until the agent sends its first heartbeat.
            </p>

            <form onSubmit={handleAddExecNode} className="space-y-4 text-xs font-semibold text-foreground/90">
              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">Node name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EXEC-01"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">Role</label>
                  <input
                    type="text"
                    disabled
                    value="Execution"
                    className="h-9.5 w-full rounded-lg border border-border bg-muted/65 px-3 text-xs text-muted-foreground/80 focus:outline-none cursor-not-allowed font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">Hostname</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. da-exec-01"
                    value={newNodeHostname}
                    onChange={(e) => setNewNodeHostname(e.target.value)}
                    className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">IP address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10.0.0.21"
                    value={newNodeIp}
                    onChange={(e) => setNewNodeIp(e.target.value)}
                    className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">Max concurrent jobs</label>
                  <input
                    type="number"
                    required
                    value={newNodeMaxJobs}
                    onChange={(e) => setNewNodeMaxJobs(parseInt(e.target.value) || 0)}
                    className="h-9.5 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground block font-bold">Notes (optional)</label>
                <textarea
                  placeholder=""
                  value={newNodeNotes}
                  onChange={(e) => setNewNodeNotes(e.target.value)}
                  className="min-h-[70px] w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/60 font-semibold"
                />
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
                  Register Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
