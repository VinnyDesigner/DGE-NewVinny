import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Activity,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Edit3,
  Eye,
  LayoutGrid,
  List,
  Pause,
  Plus,
  Search,
  XCircle,
  Zap,
  Trash2,
  Lock,
  FolderOpen,
  ChevronRight,
  Check,
  Building2,
  Layers,
  Wrench,
  GitFork,
  X,
  RefreshCw,
  ArrowLeft,
  Cog,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/operations/manage-schedules")({
  head: () => ({
    meta: [
      { title: "Manage Schedules — Data Automation Studio" },
      { name: "description", content: "Monitor and manage all automated delivery pipeline schedules across all flow types." },
    ],
  }),
  component: ManageSchedulesPage,
});

const metrics = [
  { label: "Total Executions", value: "1", hint: "All time", icon: Activity, tone: "info" },
  { label: "Active Schedules", value: "1", hint: "0 inactive", icon: Calendar, tone: "primary" },
  { label: "Total Success Deliveries", value: "0", hint: "All time", icon: CheckCircle2, tone: "success" },
  { label: "Failed Deliveries", value: "0", hint: "All time", icon: XCircle, tone: "danger" },
] as const;

interface ScheduleItem {
  id: string;
  status: string;
  name: string;
  priority: string;
  entity: string;
  dataSource: string;
  connector: string;
  layers: number;
  flowType: string;
  frequency: string;
  lastRun: string;
  nextRun: string;
  runs: number;
  timezone: string;
  startTime: string;
  notifications: string;
  lastJob: string;
  lastJobStatus: string;
  createdAt: string;
}

const initialSchedules: ScheduleItem[] = [
  {
    id: "13",
    status: "Active",
    name: "Test",
    priority: "Medium",
    entity: "ADDA",
    dataSource: "—",
    connector: "—",
    layers: 0,
    flowType: "Full Pipeline",
    frequency: "daily",
    lastRun: "2026-07-28 17:41",
    nextRun: "2026-06-21 09:30",
    runs: 1,
    timezone: "Asia/Dubai (UTC+4)",
    startTime: "08:00",
    notifications: "On (success & failure)",
    lastJob: "data-collection",
    lastJobStatus: "pending",
    createdAt: "2026-06-20 15:27"
  },
];

const tabs = ["All", "Active", "Inactive"];

const layersList = [
  { id: "layer_1", name: "L_DMAUDM_MUNICIPALITYBOUNDARY", agency: "L_DMAUDM_MUNICIPALITYBOUNDARY", db: "L_DMAUDM_MUNICIPALITYBOUNDARY", geomType: "POLYLINE", active: true },
  { id: "layer_2", name: "L_DMAUDM_DISTRICTBOUNDARY", agency: "L_DMAUDM_DISTRICTBOUNDARY", db: "L_DMAUDM_DISTRICTBOUNDARY", geomType: "POLYLINE", active: true },
  { id: "layer_3", name: "L_DMAUDM_DISTRICT", agency: "L_DMAUDM_DISTRICT", db: "L_DMAUDM_DISTRICT", geomType: "POLYGON", active: true },
  { id: "layer_4", name: "L_DMAUDM_MUNICIPALITY", agency: "L_DMAUDM_MUNICIPALITY", db: "L_DMAUDM_MUNICIPALITY", geomType: "POLYGON", active: true },
];

function ConfigTile({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-3.5 space-y-1">
      <span className="text-[9px] font-bold text-muted-foreground/80 tracking-wider uppercase block select-none">{label}</span>
      <div className={cn("font-extrabold text-foreground text-xs leading-tight", valueClassName)}>{value}</div>
    </div>
  );
}

function ManageSchedulesPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  // App views
  const [isEditing, setIsEditing] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);

  // Edit Step Wizard states
  const [editStep, setEditStep] = useState(1);
  const [selectedEditLayers, setSelectedEditLayers] = useState<string[]>(["layer_1", "layer_2", "layer_3", "layer_4"]);
  const [editLayersSearchQuery, setEditLayersSearchQuery] = useState("");
  
  // Schedule state fields
  const [editScheduleName, setEditScheduleName] = useState("Test");
  const [editScheduleDescription, setEditScheduleDescription] = useState("");
  const [editRecurrenceMode, setEditRecurrenceMode] = useState("simple"); // "simple" or "advanced"
  const [editFrequency, setEditFrequency] = useState("daily");
  const [editStartDate, setEditStartDate] = useState("2026-06-14");
  const [editStartTime, setEditStartTime] = useState("08:00");
  const [editEndDate, setEditEndDate] = useState("");
  const [editTimezone, setEditTimezone] = useState("Asia/Dubai (GST, UTC+4)");
  const [editPriority, setEditPriority] = useState("medium");
  const [editRetryOnFailure, setEditRetryOnFailure] = useState(true);
  const [editMaxAttempts, setEditMaxAttempts] = useState(3);
  const [editRetryInterval, setEditRetryInterval] = useState(60);
  const [editNotifyAdmin, setEditNotifyAdmin] = useState(false);
  const [editDefaultRulesBehavior, setEditDefaultRulesBehavior] = useState("strict"); // "strict", "warning", "skip"
  const [editSpatialRulesBehavior, setEditSpatialRulesBehavior] = useState("strict"); // "strict", "warning", "skip"

  // Advanced Recurrence fields
  const [advancedRepeat, setAdvancedRepeat] = useState("Weekly");
  const [advancedEvery, setAdvancedEvery] = useState(1);
  const [advancedDays, setAdvancedDays] = useState<string[]>(["M"]);
  const [advancedStartTime, setAdvancedStartTime] = useState("08:00");
  const [advancedTimezone, setAdvancedTimezone] = useState("Asia/Dubai (GST, UTC+4)");
  const [advancedStarts, setAdvancedStarts] = useState("2026-06-14");
  const [advancedEndsMode, setAdvancedEndsMode] = useState("never"); // "never", "after", "on"
  const [advancedEndsAfterRuns, setAdvancedEndsAfterRuns] = useState(10);
  const [advancedEndsOnDate, setAdvancedEndsOnDate] = useState("");

  // Modal Dialogs state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingSchedule, setDeletingSchedule] = useState<ScheduleItem | null>(null);

  const [tab, setTab] = useState("All");
  const [view, setView] = useState<"grid" | "list">("list");
  const [query, setQuery] = useState("");

  const filteredSchedules = useMemo(() => {
    return initialSchedules.filter((s) => {
      if (tab !== "All" && s.status !== tab) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.entity.toLowerCase().includes(q) &&
          !s.id.toLowerCase().includes(q) &&
          !s.flowType.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [tab, query]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tab, query]);

  const paginatedSchedules = useMemo(() => {
    return filteredSchedules.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredSchedules, currentPage, pageSize]);

  const handleOpenView = (s: ScheduleItem) => {
    setSelectedSchedule(s);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (s: ScheduleItem) => {
    setEditingSchedule(s);
    setEditScheduleName(s.name);
    setEditStep(1);
    setIsEditing(true);
  };

  const handleOpenDelete = (s: ScheduleItem) => {
    setDeletingSchedule(s);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    toast.success(`Schedule "${deletingSchedule?.name}" deleted successfully.`);
    setIsDeleteOpen(false);
    setDeletingSchedule(null);
  };

  // If in Edit mode, render the layout matching the 2nd Image
  if (isEditing && editingSchedule) {
    const selectedEntityObj = { name: "Abu Dhabi Digital Authority", region: "Digital", code: "ADDA", deliveries: 1, tone: "primary" };
    const toolDisplayNames: Record<string, string> = {
      pipeline: "Full Pipeline Flow",
      "delta-sync": "Delta Sync Engine",
      "external-sync": "External Data Sync Engine",
      metadata: "Metadata Validation Engine",
      compress: "Database Compress Utility",
      analyzer: "Data Analyzer",
    };

    // Calculate percent based on current editStep
    const editPercent = Math.round((editStep / 3) * 100);

    return (
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title={`Edit: ${editingSchedule.name}`}
          description="Update the wizard steps below — all changes will be reflected in the schedule configuration."
          actions={
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-bold text-foreground/80 hover:text-foreground cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Manage Schedules
            </button>
          }
        />

        {/* Edit View Stepper layout */}
        <Surface className="!p-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 min-w-[600px] select-none text-[13px] font-bold">
            <button
              onClick={() => setEditStep(1)}
              className={cn(
                "flex items-center gap-2 rounded px-3 py-1 cursor-pointer transition-all",
                editStep === 1 ? "text-blue-500 font-extrabold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300",
                editStep === 1 ? "bg-blue-500/10 text-blue-500 border-blue-500/20 font-bold" : "bg-muted text-muted-foreground border-border"
              )}>
                <Layers className="h-3.5 w-3.5" />
              </span>
              Layers
            </button>
            <span className="h-px flex-1 bg-border/60 mx-2" />
            
            <button
              onClick={() => setEditStep(2)}
              className={cn(
                "flex items-center gap-2 rounded px-3 py-1 cursor-pointer transition-all",
                editStep === 2 ? "text-blue-500 font-extrabold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300",
                editStep === 2 ? "bg-blue-500/10 text-blue-500 border-blue-500/20 font-bold" : "bg-muted text-muted-foreground border-border"
              )}>
                <Calendar className="h-3.5 w-3.5" />
              </span>
              Schedule
            </button>
            <span className="h-px flex-1 bg-border/60 mx-2" />
            
            <button
              onClick={() => setEditStep(3)}
              className={cn(
                "flex items-center gap-2 rounded px-3 py-1 cursor-pointer transition-all",
                editStep === 3 ? "text-blue-500 font-extrabold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300",
                editStep === 3 ? "bg-blue-500/10 text-blue-500 border-blue-500/20 font-bold" : "bg-muted text-muted-foreground border-border"
              )}>
                <Check className="h-3.5 w-3.5" />
              </span>
              Review
            </button>
          </div>
        </Surface>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
          
          {/* Left Side Wizard Column */}
          <div className="space-y-5">
            
            {/* Locked summary info ribbon */}
            <div className="border border-border/80 bg-foreground/[0.03] rounded-xl px-4 py-3.5 text-xs font-semibold text-muted-foreground flex items-start gap-2.5 leading-relaxed select-none">
              <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-foreground">Locked — editing layers & schedule only:</span>{" "}
                Entity: <span className="text-foreground">Abu Dhabi Digital Authority</span>,{" "}
                Source: <span className="text-foreground">FGDB1</span>,{" "}
                Tool: <span className="text-foreground">Data Delivery Pipeline</span>,{" "}
                Runtime: <span className="text-foreground">ArcGIS Pro Runtime</span>,{" "}
                Target: <span className="text-foreground">Internal Database</span>
              </div>
            </div>

            {/* STEP 1: Select Layers (1st & 2nd Image) */}
            {editStep === 1 && (
              <>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">Select Layers</h3>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Choose one or more data layers to include in this schedule. All selected layers will be processed by the same tool.
                  </p>
                </div>

                {/* Filtering row */}
                <div className="flex gap-2.5 items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search layers by name or code..."
                      value={editLayersSearchQuery}
                      onChange={(e) => setEditLayersSearchQuery(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (selectedEditLayers.length === layersList.length) {
                        setSelectedEditLayers([]);
                      } else {
                        setSelectedEditLayers(layersList.map((l) => l.id));
                      }
                    }}
                    className="h-9 px-3.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-soft"
                  >
                    {selectedEditLayers.length === layersList.length ? "Deselect All" : "Select All"}
                  </button>
                  <button
                    onClick={() => setSelectedEditLayers([])}
                    className="h-9 px-3.5 bg-transparent border border-border hover:bg-muted text-muted-foreground font-bold text-xs rounded-lg cursor-pointer transition-colors"
                  >
                    Clear
                  </button>
                </div>

                {/* Summary selected notification ribbon */}
                {selectedEditLayers.length > 0 && (
                  <div className="bg-primary/5 border border-primary/20 text-primary rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 select-none shadow-soft">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-primary text-white text-[10px]">
                      {selectedEditLayers.length}
                    </span>
                    <span>
                      layers selected - {selectedEditLayers.map((id) => layersList.find((l) => l.id === id)?.name).join(", ")}
                    </span>
                  </div>
                )}

                {/* Layers checklists list */}
                <div className="space-y-3">
                  {layersList
                    .filter((l) => l.name.toLowerCase().includes(editLayersSearchQuery.toLowerCase()))
                    .map((layer) => {
                      const isChecked = selectedEditLayers.includes(layer.id);
                      return (
                        <div
                          key={layer.id}
                          onClick={() => {
                            if (isChecked) {
                              setSelectedEditLayers(selectedEditLayers.filter((id) => id !== layer.id));
                            } else {
                              setSelectedEditLayers([...selectedEditLayers, layer.id]);
                            }
                          }}
                          className={cn(
                            "p-4.5 rounded-xl border flex items-start justify-between cursor-pointer transition-all hover:bg-muted/15 text-xs font-semibold",
                            isChecked ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="h-4.5 w-4.5 rounded border-border/60 bg-card accent-primary mt-0.5 pointer-events-none"
                            />
                            <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border">
                              <Layers className="h-4.5 w-4.5" />
                            </span>
                            <div className="min-w-0">
                              <div className="font-extrabold text-foreground truncate max-w-[280px] sm:max-w-md">{layer.name}</div>
                              <div className="text-[10px] text-muted-foreground/80 mt-1 flex flex-wrap items-center gap-1.5 leading-none">
                                <span>Agency Layer: {layer.agency}</span>
                                <span>•</span>
                                <span>DB Layer: {layer.db}</span>
                              </div>
                              <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-extrabold font-mono">
                                <span className="bg-blue-500/10 text-primary border border-blue-500/20 px-1.5 py-0.2 rounded uppercase">
                                  {layer.geomType}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2">
                                  <span className="h-1 w-1 rounded-full bg-emerald-400" /> Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Navigation actions footer */}
                <div className="flex justify-end pt-4 border-t border-border/20">
                  <button
                    onClick={() => setEditStep(2)}
                    className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: Configure Schedule (3rd, 4th and 5th Image) */}
            {editStep === 2 && (
              <>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">Configure Schedule</h3>
                  <p className="text-xs text-muted-foreground font-semibold">Define when and how often this job runs.</p>
                </div>

                {/* Section 1: Schedule Details */}
                <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/30 pb-2 mb-3 select-none">
                    <Cog className="h-4 w-4 text-primary" /> Schedule Details
                  </h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Schedule Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={editScheduleName}
                      onChange={(e) => setEditScheduleName(e.target.value)}
                      required
                      placeholder="e.g. Daily L_DMAUDM_MUNICIPALITYBOUNDARY Sync"
                      className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Description</label>
                    <textarea
                      rows={3}
                      value={editScheduleDescription}
                      onChange={(e) => setEditScheduleDescription(e.target.value)}
                      placeholder="Optional description..."
                      className="w-full rounded-lg border border-border/60 bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none font-bold"
                    />
                  </div>
                </div>

                {/* Section 2: Recurrence */}
                <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/30 pb-2 mb-2 select-none">
                    <RefreshCw className="h-4 w-4 text-primary" /> Recurrence
                  </h3>
                  
                  <div className="flex bg-muted/65 p-1 rounded-lg w-fit">
                    <button
                      type="button"
                      onClick={() => setEditRecurrenceMode("simple")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-md text-[11px] font-extrabold cursor-pointer transition-all",
                        editRecurrenceMode === "simple" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Simple
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditRecurrenceMode("advanced")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-md text-[11px] font-extrabold cursor-pointer transition-all",
                        editRecurrenceMode === "advanced" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Advanced
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
                    {editRecurrenceMode === "advanced" 
                      ? "Build a custom recurrence rule with a live preview of the next runs."
                      : "Pick a standard cadence. Switch to Advanced for custom rules (e.g. Mon/Wed/Fri, 2nd Tuesday, one-time)."}
                  </p>
                </div>

                {/* Section 2b: Advanced Recurrence (5th Image) */}
                {editRecurrenceMode === "advanced" && (
                  <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/30 pb-2 mb-3 select-none">
                      <RefreshCw className="h-4 w-4 text-primary" /> Recurrence Rule
                    </h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Repeat</label>
                        <select
                          value={advancedRepeat}
                          onChange={(e) => setAdvancedRepeat(e.target.value)}
                          className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                        >
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Yearly">Yearly</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Every</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={advancedEvery}
                            onChange={(e) => setAdvancedEvery(Math.max(1, parseInt(e.target.value) || 1))}
                            className="h-10 w-24 rounded-lg border border-border/60 bg-background pl-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                          />
                          <span className="text-xs text-muted-foreground font-semibold">
                            {advancedRepeat === "Weekly" ? "week(s)" : advancedRepeat === "Daily" ? "day(s)" : "month(s)"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {advancedRepeat === "Weekly" && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground block font-bold">On these days</label>
                        <div className="flex flex-wrap gap-2 select-none">
                          {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
                            const dayKey = day + (idx === 3 || idx === 5 || idx === 6 ? idx : "");
                            const isSelected = advancedDays.includes(dayKey);
                            return (
                              <button
                                key={dayKey}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setAdvancedDays(advancedDays.filter((d) => d !== dayKey));
                                  } else {
                                    setAdvancedDays([...advancedDays, dayKey]);
                                  }
                                }}
                                className={cn(
                                  "h-8 w-8 rounded-full border text-[11px] font-extrabold flex items-center justify-center cursor-pointer transition-all",
                                  isSelected
                                    ? "bg-primary border-primary text-white shadow-soft"
                                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Start time</label>
                        <input
                          type="time"
                          value={advancedStartTime}
                          onChange={(e) => setAdvancedStartTime(e.target.value)}
                          className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Timezone</label>
                        <input
                          type="text"
                          value={advancedTimezone}
                          onChange={(e) => setAdvancedTimezone(e.target.value)}
                          className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground block font-bold">Starts *</label>
                      <input
                        type="date"
                        value={advancedStarts}
                        onChange={(e) => setAdvancedStarts(e.target.value)}
                        className="h-10 w-full sm:w-1/2 rounded-lg border border-border/60 bg-background pl-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                      />
                    </div>

                    <div className="space-y-2.5 pt-2.5 border-t border-border/20">
                      <label className="text-xs font-semibold text-muted-foreground block">Ends</label>
                      <div className="space-y-3 font-semibold text-xs">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            id="editEndsNever"
                            name="editAdvancedEnds"
                            checked={advancedEndsMode === "never"}
                            onChange={() => setAdvancedEndsMode("never")}
                            className="h-4.5 w-4.5 border-border/60 bg-card accent-primary"
                          />
                          <label htmlFor="editEndsNever" className="text-foreground cursor-pointer select-none">Never</label>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            id="editEndsAfter"
                            name="editAdvancedEnds"
                            checked={advancedEndsMode === "after"}
                            onChange={() => setAdvancedEndsMode("after")}
                            className="h-4.5 w-4.5 border-border/60 bg-card accent-primary"
                          />
                          <label htmlFor="editEndsAfter" className="text-foreground cursor-pointer select-none">After</label>
                          <input
                            type="number"
                            min={1}
                            disabled={advancedEndsMode !== "after"}
                            value={advancedEndsAfterRuns}
                            onChange={(e) => setAdvancedEndsAfterRuns(Math.max(1, parseInt(e.target.value) || 1))}
                            className="h-8 w-20 rounded-lg border border-border/60 bg-background pl-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold disabled:opacity-50"
                          />
                          <span className="text-muted-foreground">runs</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            id="editEndsOn"
                            name="editAdvancedEnds"
                            checked={advancedEndsMode === "on"}
                            onChange={() => setAdvancedEndsMode("on")}
                            className="h-4.5 w-4.5 border-border/60 bg-card accent-primary"
                          />
                          <label htmlFor="editEndsOn" className="text-foreground cursor-pointer select-none">On</label>
                          <input
                            type="date"
                            disabled={advancedEndsMode !== "on"}
                            value={advancedEndsOnDate}
                            onChange={(e) => setAdvancedEndsOnDate(e.target.value)}
                            className="h-8 w-44 rounded-lg border border-border/60 bg-background pl-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/20">
                      <button type="button" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-bold">
                        Advanced options <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Preview box */}
                    <div className="rounded-lg bg-blue-500/5 border border-blue-500/10 p-4 space-y-1.5">
                      <div className="text-xs text-primary font-bold">Preview</div>
                      <p className="text-[11px] text-muted-foreground font-semibold leading-relaxed">
                        Every week on {advancedDays.map((d) => d.startsWith("M") ? "Monday" : d.startsWith("T") ? "Tuesday" : d.startsWith("W") ? "Wednesday" : d.startsWith("F") ? "Friday" : "day").join(", ")} times shown in {advancedTimezone}
                      </p>
                      <div className="text-[10px] text-amber-500/80 font-bold flex items-center gap-1 mt-1">
                        <span className="h-1 w-1 rounded-full bg-amber-500" /> Adjust the rule to see upcoming runs.
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 3: Frequency (Only in simple mode) */}
                {editRecurrenceMode === "simple" && (
                  <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/30 pb-2 mb-3 select-none">
                      <Calendar className="h-4 w-4 text-primary" /> Frequency
                    </h3>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {["daily", "weekly", "monthly", "quarterly", "half-yearly", "yearly"].map((freq) => {
                        const isSelected = editFrequency === freq;
                        return (
                          <button
                            key={freq}
                            type="button"
                            onClick={() => setEditFrequency(freq)}
                            className={cn(
                              "h-10 rounded-lg border text-[11px] font-extrabold capitalize cursor-pointer transition-all select-none",
                              isSelected
                                ? "border-primary bg-primary/5 text-primary shadow-soft"
                                : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/15"
                            )}
                          >
                            {freq.replace("-", " ")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Section 4: Timing (Only in simple mode) */}
                {editRecurrenceMode === "simple" && (
                  <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/30 pb-2 mb-3 select-none">
                      <Clock className="h-4 w-4 text-primary" /> Timing
                    </h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5 relative">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Start Date <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={editStartDate}
                            onChange={(e) => setEditStartDate(e.target.value)}
                            className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-10 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                          />
                          <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Start Time</label>
                        <input
                          type="time"
                          value={editStartTime}
                          onChange={(e) => setEditStartTime(e.target.value)}
                          className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                        />
                      </div>

                      <div className="space-y-1.5 relative">
                        <label className="text-xs font-semibold text-muted-foreground">End Date (optional)</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={editEndDate}
                            onChange={(e) => setEditEndDate(e.target.value)}
                            className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-10 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                          />
                          <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground font-bold">Timezone</label>
                        <input
                          type="text"
                          value={editTimezone}
                          onChange={(e) => setEditTimezone(e.target.value)}
                          className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 5: Run Options */}
                <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/30 pb-2 mb-3 select-none">
                    <Zap className="h-4 w-4 text-primary" /> Run Options
                  </h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Priority</label>
                    <div className="flex bg-muted/65 p-1 rounded-lg w-full max-w-[400px]">
                      {["high", "medium", "low"].map((prio) => {
                        const isSelected = editPriority === prio;
                        return (
                          <button
                            key={prio}
                            type="button"
                            onClick={() => setEditPriority(prio)}
                            className={cn(
                              "flex-1 py-1.5 rounded-md text-[11px] font-extrabold capitalize cursor-pointer transition-all select-none",
                              isSelected
                                ? "bg-card text-foreground shadow-sm font-bold border border-border/30"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {prio}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 space-y-3 border-t border-border/20 mt-3">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="editRetryOnFailure"
                        checked={editRetryOnFailure}
                        onChange={(e) => setEditRetryOnFailure(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-border/60 bg-card accent-primary mt-0.5 cursor-pointer"
                      />
                      <div className="space-y-3 flex-1">
                        <label htmlFor="editRetryOnFailure" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                          Retry on failure
                        </label>
                        {editRetryOnFailure && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-muted-foreground font-bold">Max attempts</span>
                              <input
                                type="number"
                                min={1}
                                value={editMaxAttempts}
                                onChange={(e) => setEditMaxAttempts(Math.max(1, parseInt(e.target.value) || 1))}
                                className="h-9 w-full rounded-lg border border-border/60 bg-background pl-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-muted-foreground font-bold">Retry interval (min)</span>
                              <input
                                type="number"
                                min={1}
                                value={editRetryInterval}
                                onChange={(e) => setEditRetryInterval(Math.max(1, parseInt(e.target.value) || 1))}
                                className="h-9 w-full rounded-lg border border-border/60 bg-background pl-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-border/20">
                    <div className="space-y-1 select-none">
                      <span className="text-[11px] font-bold text-foreground">
                        Notification groups
                      </span>
                      <p className="text-[10px] text-muted-foreground font-semibold leading-normal">
                        Success / failure emails for this schedule go to the selected groups. Leave empty to use the entity's default recipients.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card mt-3 text-xs font-semibold">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          id="editNotifyAdmin"
                          checked={editNotifyAdmin}
                          onChange={(e) => setEditNotifyAdmin(e.target.checked)}
                          className="h-4.5 w-4.5 rounded border-border/60 bg-card accent-primary cursor-pointer"
                        />
                        <label htmlFor="editNotifyAdmin" className="text-foreground cursor-pointer select-none">
                          Administrators
                        </label>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-extrabold font-mono text-muted-foreground border border-border select-none leading-none">
                        ADMIN
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rules Configuration Card (from user screenshot) */}
                <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2 border-b border-border/30 pb-2.5 mb-2 select-none">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Rules Configuration
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                        Configure how validation rules behave during execution
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Default Rules */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <span className="h-2 w-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20" />
                        <span>
                          Default Rules <span className="text-muted-foreground font-semibold text-[11px]">— Field-level validation</span>
                        </span>
                      </div>
                      
                      <div className="grid gap-2.5 pl-4 sm:grid-cols-3">
                        {[
                          { value: "strict", label: "Strict", desc: "Fail on violation" },
                          { value: "warning", label: "Warning", desc: "Log & continue" },
                          { value: "skip", label: "Skip", desc: "No validation" }
                        ].map((opt) => {
                          const isSelected = editDefaultRulesBehavior === opt.value;
                          return (
                            <label
                              key={opt.value}
                              className={cn(
                                "flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-xs font-semibold cursor-pointer select-none transition-all",
                                isSelected 
                                  ? "border-primary bg-primary/5 text-foreground" 
                                  : "border-border bg-card text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <input
                                type="radio"
                                name="editDefaultRulesBehavior"
                                checked={isSelected}
                                onChange={() => setEditDefaultRulesBehavior(opt.value)}
                                className="h-4.5 w-4.5 border-border/60 bg-card accent-primary"
                              />
                              <div>
                                <span className="font-extrabold text-foreground">{opt.label}</span>{" "}
                                <span className="text-[10.5px] text-muted-foreground font-medium">· {opt.desc}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Spatial Rules */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <span className="h-2 w-2 rounded-full bg-purple-500 ring-4 ring-purple-500/20" />
                        <span>
                          Spatial Rules <span className="text-muted-foreground font-semibold text-[11px]">— Data quality rules</span>
                        </span>
                      </div>

                      <div className="grid gap-2.5 pl-4 sm:grid-cols-3">
                        {[
                          { value: "strict", label: "Strict", desc: "Fail on violation" },
                          { value: "warning", label: "Warning", desc: "Log & continue" },
                          { value: "skip", label: "Skip", desc: "No validation" }
                        ].map((opt) => {
                          const isSelected = editSpatialRulesBehavior === opt.value;
                          return (
                            <label
                              key={opt.value}
                              className={cn(
                                "flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-xs font-semibold cursor-pointer select-none transition-all",
                                isSelected 
                                  ? "border-primary bg-primary/5 text-foreground" 
                                  : "border-border bg-card text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <input
                                type="radio"
                                name="editSpatialRulesBehavior"
                                checked={isSelected}
                                onChange={() => setEditSpatialRulesBehavior(opt.value)}
                                className="h-4.5 w-4.5 border-border/60 bg-card accent-primary"
                              />
                              <div>
                                <span className="font-extrabold text-foreground">{opt.label}</span>{" "}
                                <span className="text-[10.5px] text-muted-foreground font-medium">· {opt.desc}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Info Ribbon */}
                    <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-xs font-semibold text-primary leading-normal select-none">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span>Rule settings can be modified later in the schedule configuration if needed.</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-border/20">
                  <button
                    onClick={() => setEditStep(1)}
                    className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={() => setEditStep(3)}
                    className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: Review & Save (Confirm settings) */}
            {editStep === 3 && (
              <>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">Review & Save</h3>
                  <p className="text-xs text-muted-foreground font-semibold">Confirm your configuration before saving the schedule.</p>
                </div>

                {/* Blue job summary banner */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4.5 shadow-soft relative overflow-hidden">
                  <div className="flex items-center gap-4.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                      <GitFork className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold tracking-widest text-white/70 uppercase block">PIPELINE FLOW JOB</span>
                      <div className="font-extrabold text-[15px]">{editScheduleName || "vuysda"}</div>
                      <div className="text-[11px] text-white/80 font-bold flex flex-wrap items-center gap-1.5">
                        <span>Data Delivery Pipeline</span>
                        <span>•</span>
                        <span>Full Load</span>
                        <span>•</span>
                        <span className="capitalize">{editFrequency}</span>
                        <span>•</span>
                        <span>{editTimezone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inline flow steps matching 1st screenshot */}
                  <div className="flex items-center gap-1.5 self-start sm:self-center select-none text-[9.5px] font-extrabold tracking-wide">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 border border-white/20 text-white leading-none">
                      <Layers className="h-3 w-3" /> Data Collection
                    </span>
                    <ChevronRight className="h-3 w-3 text-white/60 shrink-0" />
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 border border-white/20 text-white leading-none">
                      <Wrench className="h-3 w-3" /> Data Quality
                    </span>
                    <ChevronRight className="h-3 w-3 text-white/60 shrink-0" />
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 border border-white/20 text-white leading-none">
                      <GitFork className="h-3 w-3" /> Data Loading
                    </span>
                  </div>
                </div>

                {/* DATA TARGET Section */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">DATA TARGET</h3>
                  
                  <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                    {/* Entity subcard header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-primary border border-blue-500/20">
                          <Building2 className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <div className="font-bold text-foreground text-xs">{selectedEntityObj.name}</div>
                          <div className="text-[10px] text-muted-foreground font-bold">{selectedEntityObj.code} - Semi-Government</div>
                        </div>
                      </div>
                      
                      <span className="bg-blue-500/10 text-primary border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase leading-none select-none">
                        {selectedEditLayers.length} {selectedEditLayers.length === 1 ? 'layer' : 'layers'}
                      </span>
                    </div>

                    {/* Selected Layers subcard rows */}
                    <div className="border-t border-border/40 pt-3.5 space-y-2.5">
                      {selectedEditLayers.map((layerId) => {
                        const layerObj = layersList.find((l) => l.id === layerId);
                        if (!layerObj) return null;
                        return (
                          <div key={layerId} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/60">
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border">
                                <Layers className="h-4 w-4" />
                              </span>
                              <div>
                                <div className="font-extrabold text-foreground text-[11px] leading-tight">{layerObj.name}</div>
                                <div className="text-[10px] text-muted-foreground font-semibold leading-none mt-0.5">{layerObj.agency}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-extrabold font-mono">
                              <span className="bg-blue-500/10 text-primary border border-blue-500/20 px-1.5 py-0.2 rounded uppercase">
                                {layerObj.geomType}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2">
                                <span className="h-1 w-1 rounded-full bg-emerald-400" /> Active
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* CONFIGURATION Section */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CONFIGURATION</h3>
                  
                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                    <ConfigTile label="FREQUENCY" value={editRecurrenceMode === "advanced" ? advancedRepeat : editFrequency} />
                    <ConfigTile label="START DATE" value={editRecurrenceMode === "advanced" ? advancedStarts : editStartDate} />
                    <ConfigTile label="START TIME" value={editRecurrenceMode === "advanced" ? advancedStartTime : editStartTime} />
                    <ConfigTile label="END DATE" value={editEndDate || "No end"} />
                    <ConfigTile label="TIMEZONE" value={editRecurrenceMode === "advanced" ? advancedTimezone : editTimezone} />
                    <ConfigTile 
                      label="PRIORITY" 
                      value={editPriority} 
                      valueClassName={cn(
                        editPriority === "high" && "text-rose-500 font-extrabold uppercase",
                        editPriority === "medium" && "text-amber-500 font-extrabold uppercase",
                        editPriority === "low" && "text-blue-500 font-extrabold uppercase"
                      )} 
                    />
                    <ConfigTile label="DELIVERY" value="Full Load" valueClassName="text-blue-500 font-extrabold" />
                    <ConfigTile label="RUNTIME" value="ArcGIS Pro Runtime" />
                  </div>
                </div>

                {/* ACTIVE OPTIONS Section */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ACTIVE OPTIONS</h3>
                  <div className="flex flex-wrap items-center gap-2 select-none text-[10px] font-extrabold">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-emerald-400">
                      <Check className="h-3.5 w-3.5" /> Active on save
                    </span>
                    {editRetryOnFailure && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-primary">
                        <Check className="h-3.5 w-3.5" /> Auto-retry ({editMaxAttempts}x)
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-purple-400">
                      <GitFork className="h-3.5 w-3.5 animate-pulse" /> Full Load delivery
                    </span>
                  </div>
                </div>

                {/* RULES CONFIGURATION Section (matching 2nd screenshot) */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">RULES CONFIGURATION</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Default Rules */}
                    <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> DEFAULT RULES
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground/90">
                        <span className="inline-flex items-center rounded bg-rose-500/10 text-rose-400 px-1.5 py-0.5 text-[10px] font-extrabold uppercase select-none leading-none">
                          {editDefaultRulesBehavior === "strict" ? "Strict" : editDefaultRulesBehavior === "warning" ? "Warning" : "Skip"}
                        </span>
                        <span className="text-muted-foreground text-[10px] font-bold">
                          — {editDefaultRulesBehavior === "strict" ? "Fall on violation" : editDefaultRulesBehavior === "warning" ? "Log & continue" : "No validation"}
                        </span>
                      </div>
                    </div>

                    {/* Spatial Rules */}
                    <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> SPATIAL RULES
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground/90">
                        <span className="inline-flex items-center rounded bg-rose-500/10 text-rose-400 px-1.5 py-0.5 text-[10px] font-extrabold uppercase select-none leading-none">
                          {editSpatialRulesBehavior === "strict" ? "Strict" : editSpatialRulesBehavior === "warning" ? "Warning" : "Skip"}
                        </span>
                        <span className="text-muted-foreground text-[10px] font-bold">
                          — {editSpatialRulesBehavior === "strict" ? "Fall on violation" : editSpatialRulesBehavior === "warning" ? "Log & continue" : "No validation"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-border/20">
                  <button
                    onClick={() => setEditStep(2)}
                    className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={() => {
                      toast.success(`Schedule "${editScheduleName}" updated successfully.`);
                      setIsEditing(false);
                    }}
                    className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
                  >
                    <Check className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              </>
            )}

          </div>

          {/* Right Preview Column (matching 2nd Image) */}
          <Surface className="!p-5 h-fit lg:sticky lg:top-4 shadow-soft border border-border text-xs font-semibold">
            <div className="flex items-start justify-between pb-3 border-b border-border/30 mb-4 select-none">
              <div>
                <div className="text-[13px] font-bold text-foreground">Schedule Preview</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">Live configuration</div>
              </div>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              <div className="text-muted-foreground">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                  <span>Step {editStep === 1 ? 4 : editStep === 2 ? 6 : 7} of 7</span>
                  <span className="text-primary">{editStep === 1 ? 57 : editStep === 2 ? 86 : 100}% complete</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${editStep === 1 ? 57 : editStep === 2 ? 86 : 100}%` }} />
                </div>
              </div>

              <div className="space-y-3.5">
                {/* Entity */}
                <div className="rounded-lg border border-border bg-card/45 p-3.5">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Building2 className="h-4 w-4 text-primary" /> Entity
                  </div>
                  <div className="mt-1.5 font-bold text-foreground/90 leading-normal">
                    Abu Dhabi Digital Authority
                  </div>
                  <div className="mt-1.5 text-[10px] text-muted-foreground font-bold font-mono bg-muted/80 w-fit px-1.5 py-0.5 rounded border border-border/60">
                    {selectedEntityObj.deliveries} deliveries
                  </div>
                </div>

                {/* Layers */}
                <div className="rounded-lg border border-border bg-card/45 p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Layers className="h-4 w-4 text-primary" /> Layers
                    </div>
                    {selectedEditLayers.length > 0 && (
                      <span className="bg-blue-500/10 text-primary border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono leading-none">
                        {selectedEditLayers.length} Selected
                      </span>
                    )}
                  </div>
                  {selectedEditLayers.length > 0 ? (
                    <div className="mt-2 max-h-[140px] overflow-y-auto space-y-2.5 scrollbar-none pr-1">
                      {selectedEditLayers.map((layerId) => {
                        const layerObj = layersList.find((l) => l.id === layerId);
                        if (!layerObj) return null;
                        return (
                          <div key={layerId} className="text-xs font-semibold leading-normal">
                            <div className="text-foreground text-[11px] font-bold truncate">{layerObj.name}</div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <span className="uppercase text-[9px] font-extrabold font-mono text-primary/80">{layerObj.geomType}</span>
                              <span>•</span>
                              <span className="text-[9px] font-extrabold text-emerald-400">Active</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="mt-1 text-xs text-muted-foreground block">Not configured</span>
                  )}
                </div>

                {/* Tool */}
                <div className="rounded-lg border border-primary/25 bg-primary/5 p-3.5 space-y-2 text-primary">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Wrench className="h-4 w-4 text-primary" /> Tool
                  </div>
                  <div className="font-bold text-foreground">
                    Data Delivery Pipeline
                  </div>
                  <div className="text-[10px] text-muted-foreground/90 font-bold leading-normal">
                    ~10 min · 96.5% success
                  </div>
                  
                  {/* Detailed list steps */}
                  <div className="space-y-1.5 pl-2 border-l border-primary/20 pt-1 text-[11px] font-semibold text-foreground/90">
                    <div className="flex justify-between">
                      <span>Data Collection</span>
                      <span className="text-muted-foreground/80 font-bold">~5 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Quality</span>
                      <span className="text-muted-foreground/80 font-bold">~8 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Loading</span>
                      <span className="text-muted-foreground/80 font-bold">~6 min</span>
                    </div>
                  </div>

                  <div className="mt-2 w-fit bg-primary/10 border border-primary/20 text-primary font-bold text-[9px] uppercase px-1.5 py-0.5 rounded">
                    delivery
                  </div>
                </div>
                
                {/* Schedule details */}
                <div className="rounded-lg border border-border bg-card/45 p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" /> Schedule
                  </div>
                  <div className="space-y-2 text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Frequency</span>
                      <span className="font-bold text-foreground capitalize">
                        {editRecurrenceMode === "advanced" ? advancedRepeat : editFrequency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Start</span>
                      <span className="font-bold text-foreground">
                        {editRecurrenceMode === "advanced" ? `${advancedStarts} ${advancedStartTime}` : `${editStartDate} ${editStartTime}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Timezone</span>
                      <span className="font-bold text-foreground">
                        {editRecurrenceMode === "advanced" ? advancedTimezone : editTimezone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3.5 py-2.5 text-xs font-bold text-blue-400 select-none shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" /> Will be active on save
            </div>
          </Surface>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* List Page Header */}
      <PageHeader
        title="Manage Schedules"
        description="Monitor and manage all automated delivery pipeline schedules across all flow types"
        actions={
          <Link to="/operations/create-schedule">
            <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-[14px] font-bold text-white shadow-soft transition-colors cursor-pointer">
              <Plus className="h-4 w-4" /> New Schedule
            </button>
          </Link>
        }
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Surface
            key={m.label}
            className="!p-3.5 relative overflow-hidden group hover:border-accent/30 transition duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset",
                m.tone === "info" && (isLight ? "bg-info/10 text-info ring-info/20" : "bg-info/10 text-info ring-info/20"),
                m.tone === "primary" && (isLight ? "bg-primary/10 text-accent ring-primary/20" : "bg-primary/10 text-accent ring-primary/20"),
                m.tone === "success" && (isLight ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"),
                m.tone === "danger" && (isLight ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-rose-500/10 text-rose-400 border-rose-500/20"),
              )}>
                <m.icon className="h-4 w-4" />
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-2.5">
              <div className="text-[12px] font-bold text-muted-foreground/80 leading-none uppercase tracking-wider">{m.label}</div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-[26px] font-black leading-none tracking-tight text-foreground">{m.value}</span>
                <span className="text-[11px] text-muted-foreground/75 font-semibold leading-none">{m.hint}</span>
              </div>
            </div>
          </Surface>
        ))}
      </div>

      <Surface className="!p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border/60 p-4">
          <div className="relative w-full sm:w-[300px] shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, tool, entity or ID..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card/40 p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-md px-3 py-1 text-[13px] font-medium transition cursor-pointer",
                  tab === t ? "bg-accent/20 text-accent ring-1 ring-inset ring-accent/40" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 text-[13px] font-bold text-foreground/80 cursor-pointer">
            All Frequencies <ChevronDown className="h-4 w-4 opacity-70" />
          </button>
          
          <div className="flex-1 min-w-[10px]" />

          <span className="text-[14px] text-muted-foreground font-bold">
            {filteredSchedules.length} {filteredSchedules.length === 1 ? "schedule" : "schedules"}
          </span>
          <div className="inline-flex items-center rounded-lg border border-border/60 bg-card/40 p-1">
            <button
              onClick={() => setView("grid")}
              className={cn("flex h-8 w-8 items-center justify-center rounded-md cursor-pointer", view === "grid" ? "bg-accent/20 text-accent" : "text-muted-foreground")}
            ><LayoutGrid className="h-4 w-4" /></button>
            <button
              onClick={() => setView("list")}
              className={cn("flex h-8 w-8 items-center justify-center rounded-md cursor-pointer", view === "list" ? "bg-accent/20 text-accent" : "text-muted-foreground")}
            ><List className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70 uppercase">
                <th className="px-5 py-3 table-sticky-col-1-wide"><input type="checkbox" className="rounded border-border/60 bg-card/60 accent-accent" /></th>
                <SortTh className="table-sticky-col-2-wide w-full">Scheduler Name</SortTh>
                <SortTh>Entity</SortTh>
                <SortTh>Data Source</SortTh>
                <SortTh>Connector</SortTh>
                <th className="px-5 py-3 whitespace-nowrap">Layers</th>
                <th className="px-5 py-3 whitespace-nowrap">Flow Type</th>
                <SortTh>Frequency</SortTh>
                <SortTh>Last Run</SortTh>
                <th className="px-5 py-3 whitespace-nowrap">Next Run</th>
                <SortTh>Runs</SortTh>
                <th className="px-5 py-3 whitespace-nowrap table-sticky-actions text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSchedules.map((s) => (
                <tr key={s.name} className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition">
                  <td className="px-5 py-4 table-sticky-col-1-wide"><input type="checkbox" className="rounded border-border/60 bg-card/60 accent-accent" /></td>
                  <td className="px-5 py-4 table-sticky-col-2-wide">
                    <div className="font-extrabold text-foreground">{s.name}</div>
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-500">{s.priority}</span>
                  </td>
                  <td className="px-5 py-4 font-bold text-foreground/80">{s.entity}</td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold">{s.dataSource}</td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold">{s.connector}</td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold">{s.layers}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-1 text-xs font-bold text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> {s.flowType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold uppercase">{s.frequency}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground font-semibold">
                      <Clock className="h-3.5 w-3.5" /> {s.lastRun}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold font-mono">{s.nextRun}</td>
                  <td className="px-5 py-4 text-foreground/80 font-semibold">{s.runs}</td>
                  <td className="px-5 py-4 table-sticky-actions text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toast.info("Schedule paused successfully.")}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/15 cursor-pointer transition"
                        title="Pause schedule"
                      >
                        <Pause className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => toast.success("Manual execution triggered successfully.")}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-blue-500/10 text-primary hover:bg-blue-500/20 border border-blue-500/15 cursor-pointer transition"
                        title="Run now"
                      >
                        <Zap className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenView(s)}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-blue-500/10 text-primary hover:bg-blue-500/20 border border-blue-500/15 cursor-pointer transition"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-blue-500/10 text-primary hover:bg-blue-500/20 border border-blue-500/15 cursor-pointer transition"
                        title="Edit schedule"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(s)}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/15 cursor-pointer transition"
                        title="Delete schedule"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          totalItems={filteredSchedules.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="schedule"
          itemNamePlural="schedules"
        />
      </Surface>

      {/* 1. VIEW SCHEDULE DIALOG MODAL (1st Image) */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-xl bg-card border border-border p-6 shadow-2xl rounded-2xl text-xs font-semibold text-muted-foreground select-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/30 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center bg-primary/10 border border-primary/20 text-primary rounded-lg shadow-soft">
                <RefreshCw className="h-4 w-4" />
              </span>
              <div>
                <DialogTitle className="text-sm font-bold text-foreground leading-none">
                  {selectedSchedule?.name}
                </DialogTitle>
                <div className="text-[10px] text-muted-foreground font-mono mt-1">
                  {selectedSchedule?.id}
                </div>
              </div>
            </div>
            
            {/* Native Radix close handled. Custom close button inside header should be avoided to prevent double close icons */}
          </div>

          {/* Grid Layout of Details */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs">
            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Entity</span>
                <span className="text-foreground font-bold mt-1 block">Abu Dhabi Digital Authority</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Frequency</span>
                <span className="text-foreground font-bold mt-1 block uppercase">{selectedSchedule?.frequency}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Status</span>
                <div className="mt-1 flex items-center gap-1.5 w-fit rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-primary font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Active
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Notifications</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.notifications}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Next Run</span>
                <span className="text-foreground font-bold mt-1 block font-mono">{selectedSchedule?.nextRun}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Last Job</span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-foreground font-bold">{selectedSchedule?.lastJob}</span>
                  <span className="bg-muted border border-border text-foreground/70 text-[9px] font-extrabold px-1 py-0.2 rounded uppercase">
                    {selectedSchedule?.lastJobStatus}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 block">{selectedSchedule?.lastRun}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Timezone</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.timezone}</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Flow Type</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.flowType}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Priority</span>
                <span className="mt-1 inline-flex items-center rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-500">
                  {selectedSchedule?.priority}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Start Time</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.startTime}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Last Run</span>
                <span className="text-foreground font-bold mt-1 block font-mono">{selectedSchedule?.lastRun}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Runs</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.runs}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Layers</span>
                <span className="text-foreground font-bold mt-1 block">{selectedSchedule?.layers} layer(s)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase block tracking-wider">Created At</span>
                <span className="text-foreground font-bold mt-1 block font-mono">{selectedSchedule?.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Close button aligned right */}
          <div className="flex justify-end pt-5 border-t border-border/30 mt-5">
            <button
              onClick={() => setIsViewOpen(false)}
              className="px-4.5 py-1.5 text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. DELETE SCHEDULE CONFIRMATION DIALOG (3rd Image) */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-card border border-border p-6 shadow-2xl rounded-2xl select-none">
          <div className="flex flex-col items-center text-center gap-4 py-2">
            
            {/* Warning Avatar */}
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
              <XCircle className="h-6 w-6" />
            </span>

            {/* Description */}
            <div className="space-y-1.5">
              <DialogTitle className="text-[15px] font-black text-foreground">
                Delete this schedule?
              </DialogTitle>
              <p className="text-xs font-semibold text-muted-foreground/90 leading-relaxed max-w-[280px]">
                This permanently deletes the schedule and its layer/target links. Delivery history is kept.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3.5 w-full mt-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 h-9 rounded-lg border border-border bg-transparent text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 h-9 rounded-lg bg-rose-500 hover:bg-rose-500/95 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-soft transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Record
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Minimal ArrowLeft icon utility
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function SortTh({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn("px-5 py-3 whitespace-nowrap", className)}>
      <span className="inline-flex items-center gap-1">{children}<ChevronDown className="h-3 w-3 opacity-60" /></span>
    </th>
  );
}
