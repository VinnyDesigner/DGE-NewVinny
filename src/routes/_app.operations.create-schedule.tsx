import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Cog,
  Database,
  Layers,
  RefreshCw,
  Search,
  Target,
  Wrench,
  Sparkles,
  ShieldAlert,
  GitFork,
  CheckCircle2,
  Clock,
  Zap,
  ShieldCheck
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/_app/operations/create-schedule")({
  head: () => ({
    meta: [
      { title: "Create Schedule — Data Automation Studio" },
      { name: "description", content: "Build automated data pipeline jobs using the guided wizard." },
    ],
  }),
  component: CreateSchedulePage,
});

const steps = [
  { id: 1, label: "Entity", icon: Building2 },
  { id: 2, label: "Tool", icon: Wrench },
  { id: 3, label: "Data Source", icon: Database },
  { id: 4, label: "Layers", icon: Layers },
  { id: 5, label: "Target", icon: Target },
  { id: 6, label: "Schedule", icon: Calendar },
  { id: 7, label: "Review", icon: Cog },
];

const dataSourcesList = [
  { id: "fgdb1", name: "FGDB1", sub: "FGDB1", desc: "File Geodatabase (FGDB) active", layersCount: 4 },
  { id: "test_db", name: "Test_DB", sub: "Test_DB", desc: "Database active", layersCount: 0 },
];

const layersList = [
  { id: "layer_1", name: "L_DMAUDM_MUNICIPALITYBOUNDARY", agency: "L_DMAUDM_MUNICIPALITYBOUNDARY", db: "L_DMAUDM_MUNICIPALITYBOUNDARY", geomType: "POLYLINE", active: true },
  { id: "layer_2", name: "L_DMAUDM_DISTRICTBOUNDARY", agency: "L_DMAUDM_DISTRICTBOUNDARY", db: "L_DMAUDM_DISTRICTBOUNDARY", geomType: "POLYLINE", active: true },
  { id: "layer_3", name: "L_DMAUDM_DISTRICT", agency: "L_DMAUDM_DISTRICT", db: "L_DMAUDM_DISTRICT", geomType: "POLYGON", active: true },
  { id: "layer_4", name: "L_DMAUDM_MUNICIPALITY", agency: "L_DMAUDM_MUNICIPALITY", db: "L_DMAUDM_MUNICIPALITY", geomType: "POLYGON", active: true },
];

const targetsList = [
  { id: "internal", name: "Internal Database", sub: "DMT", desc: "DMT", mappedText: "Target mapped for this source." }
];

const entities = [
  { name: "Abu Dhabi Digital Authority", region: "Digital", code: "ADDA", deliveries: 1, tone: "primary" },
  { name: "Environment Agency Abu Dhabi", region: "Environment", code: "EAD", deliveries: 0, tone: "success" },
  { name: "Dept of Government Enablement", region: "Government", code: "DGE", deliveries: 0, tone: "info" },
  { name: "Abu Dhabi Distribution Company", region: "Utilities", code: "ADDC", deliveries: 0, tone: "warning" },
  { name: "Abu Dhabi Housing Authority", region: "Housing", code: "ADHA", deliveries: 0, tone: "secondary" },
] as const;

function CreateSchedulePage() {
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState<string | null>("ADDA");
  const percent = Math.round((current / steps.length) * 100);

  // Step 2 Tool selection states
  const [selectedTool, setSelectedTool] = useState<string>("pipeline"); // "pipeline", "delta-sync", "external-sync", "metadata", "compress", "analyzer"
  const [selectedRuntime, setSelectedRuntime] = useState<string>("arcgis"); // "arcgis", "fme"

  // Step 3 Data Source states
  const [selectedDataSource, setSelectedDataSource] = useState<string>("fgdb1");

  // Step 4 Layers states
  const [selectedLayers, setSelectedLayers] = useState<string[]>(["layer_1"]);
  const [layersSearchQuery, setLayersSearchQuery] = useState<string>("");

  // Step 5 Target Database states
  const [selectedTargetDb, setSelectedTargetDb] = useState<string>("internal");

  // Step 6 Schedule timing & timing options states
  const [scheduleName, setScheduleName] = useState<string>("Daily L_DMAUDM_MUNICIPALITYBOUNDARY Sync");
  const [scheduleDescription, setScheduleDescription] = useState<string>("");
  const [recurrenceMode, setRecurrenceMode] = useState<string>("simple"); // "simple" or "advanced"
  const [frequency, setFrequency] = useState<string>("daily"); // "daily", "weekly", "monthly", "quarterly", "half-yearly", "yearly"
  const [startDate, setStartDate] = useState<string>("2026-07-28");
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endDate, setEndDate] = useState<string>("2026-07-28");
  const [timezone, setTimezone] = useState<string>("Asia/Dubai (GST, UTC+4)");
  const [priority, setPriority] = useState<string>("medium"); // "high", "medium", "low"
  const [retryOnFailure, setRetryOnFailure] = useState<boolean>(true);
  const [maxAttempts, setMaxAttempts] = useState<number>(3);
  const [retryInterval, setRetryInterval] = useState<number>(60);
  const [notifyAdmin, setNotifyAdmin] = useState<boolean>(false);
  const [defaultRulesBehavior, setDefaultRulesBehavior] = useState<string>("strict");
  const [spatialRulesBehavior, setSpatialRulesBehavior] = useState<string>("strict");

  const selectedEntityObj = useMemo(() => {
    return entities.find((e) => e.code === selected) || entities[0];
  }, [selected]);

  const handleContinue = () => {
    if (current === 1 && !selected) {
      toast.error("Please select an Organization first.");
      return;
    }
    if (current < steps.length) {
      setCurrent(current + 1);
    } else {
      toast.success("Schedule created successfully!");
      setCurrent(1);
    }
  };

  const handleBack = () => {
    if (current > 1) {
      setCurrent(current - 1);
    }
  };

  const toolDisplayNames: Record<string, string> = {
    pipeline: "Full Pipeline Flow",
    "delta-sync": "Delta Sync Engine",
    "external-sync": "External Data Sync Engine",
    metadata: "Metadata Validation Engine",
    compress: "Database Compress Utility",
    analyzer: "Data Analyzer",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Create Schedule"
        description="Build automated data pipeline jobs using the guided wizard"
        actions={
          <Link
            to="/operations/manage-schedules"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-[14px] font-bold text-foreground/80 hover:text-foreground cursor-pointer transition-colors"
          >
            Manage Schedules <ChevronRight className="h-4 w-4" />
          </Link>
        }
      />

      {/* Stepper progress indicator */}
      <Surface className="!p-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-[800px] select-none">
          {steps.map((s, i) => {
            const active = s.id === current;
            const done = s.id < current;
            return (
              <div key={s.id} className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => {
                    if (s.id <= current || selected) {
                      setCurrent(s.id);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-bold transition-all cursor-pointer",
                    active && "bg-primary/20 text-accent border border-primary/20 shadow-soft",
                    done && "text-blue-500",
                    !active && !done && "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-extrabold border transition-all duration-300",
                    active && "bg-primary text-white border-primary/40 shadow-glow",
                    done && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                    !active && !done && "bg-muted text-muted-foreground border-border",
                  )}>
                    {done ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </span>
                  {s.label}
                </button>
                {i < steps.length - 1 && <span className="h-px flex-1 bg-border/60" />}
              </div>
            );
          })}
        </div>
      </Surface>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
        
        {/* Left Side: Step Content Cards */}
        <div className="space-y-6">

          {/* STEP 1: Entity selection */}
          {current === 1 && (
            <>
              <Surface className="!p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-[300px] shrink-0">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by name, code or region..."
                      className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                  <div className="flex-1 min-w-[10px]" />
                  <span className="text-xs text-muted-foreground font-bold shrink-0">5 results</span>
                </div>
              </Surface>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {entities.map((e) => {
                  const active = selected === e.code;
                  return (
                    <button
                      key={e.code}
                      onClick={() => setSelected(e.code)}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all hover:bg-muted/15 cursor-pointer text-xs font-semibold",
                        active
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border bg-card",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                          e.tone === "primary" && "bg-blue-600/10 text-primary border-blue-500/20",
                          e.tone === "success" && "bg-sky-600/10 text-sky-500 border-sky-500/20",
                          e.tone === "info" && "bg-purple-600/10 text-purple-500 border-purple-500/20",
                          e.tone === "warning" && "bg-amber-600/10 text-amber-500 border-amber-500/20",
                          e.tone === "secondary" && "bg-sky-500/10 text-sky-500 border-sky-500/20",
                        )}>
                          <Building2 className="h-4.5 w-4.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-bold text-foreground leading-normal">{e.name}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span>{e.region}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-1.5 py-0.5 font-bold text-primary">Active</span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono font-bold text-foreground/80 border border-border">{e.code}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-1.5 border-t border-border/20 pt-3 text-[11px] text-muted-foreground font-semibold">
                        <Database className="h-3.5 w-3.5 text-muted-foreground" /> {e.deliveries} deliveries
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-border/20">
                <button
                  onClick={handleContinue}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {/* STEP 2: Choose Automation Tool (3rd & 4th Image content) */}
          {current === 2 && (
            <>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Choose Automation Tool</h2>
                <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                  Run the full Pipeline Flow (3 tools in sequence) or schedule an individual engine. Only one option can be active per schedule.
                </p>
              </div>

              {/* Reminder banner of selected Entity */}
              <div className="border border-border/60 bg-primary/5 rounded-xl px-4 py-3 flex items-center justify-between text-xs font-semibold select-none">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center bg-primary/10 border border-primary/20 rounded-lg text-primary">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-foreground font-bold">{selectedEntityObj.name}</span>
                    <span className="text-muted-foreground/80 ml-2 font-mono">{selectedEntityObj.code} - Digital</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrent(1)}
                  className="text-primary hover:underline font-bold text-[11px] cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Full Pipeline Flow Option Card */}
              <div
                onClick={() => setSelectedTool("pipeline")}
                className={cn(
                  "p-5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all hover:bg-muted/15",
                  selectedTool === "pipeline"
                    ? "border-primary bg-primary/5 shadow-soft"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-500 mt-0.5">
                    <GitFork className="h-5 w-5" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-[13px]">Full Pipeline Flow</span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-extrabold text-muted-foreground ring-1 ring-inset ring-border uppercase tracking-wide">
                        Pipeline
                      </span>
                    </div>
                    <p className="text-muted-foreground font-semibold">Execute all 3 tools in sequence</p>
                    
                    {/* Pipeline steps labels with arrow symbols */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-extrabold">
                      <span className="rounded bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-primary">
                        Data Collection
                      </span>
                      <span className="text-muted-foreground/60 font-bold">&gt;</span>
                      <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-amber-500">
                        Data Quality
                      </span>
                      <span className="text-muted-foreground/60 font-bold">&gt;</span>
                      <span className="rounded bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-purple-400">
                        Internal Data Sync
                      </span>
                    </div>
                  </div>
                </div>

                {/* Radio indicator circle */}
                <div className={cn(
                  "h-5 w-5 rounded-full border flex items-center justify-center shrink-0",
                  selectedTool === "pipeline" ? "border-primary text-primary bg-primary/10" : "border-border bg-transparent"
                )}>
                  {selectedTool === "pipeline" && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
              </div>

              {/* Divider in center */}
              <div className="relative flex py-2.5 items-center select-none">
                <div className="flex-grow border-t border-border/40"></div>
                <span className="flex-shrink mx-4 text-[10px] font-extrabold text-muted-foreground/80 uppercase tracking-widest">or select individual tool</span>
                <div className="flex-grow border-t border-border/40"></div>
              </div>

              {/* Individual Tools Grid */}
              <div className="grid gap-3.5 md:grid-cols-2">
                
                {/* Delta Sync Engine */}
                <div
                  onClick={() => setSelectedTool("delta-sync")}
                  className={cn(
                    "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-muted/15 text-xs",
                    selectedTool === "delta-sync"
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-card"
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">Delta Sync Engine</span>
                      <span className="rounded bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-purple-400 uppercase tracking-wide">
                        Sync
                      </span>
                    </div>
                    <p className="text-muted-foreground/70 font-semibold">Perform delta sync between databases</p>
                  </div>
                  <div className={cn(
                    "h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0",
                    selectedTool === "delta-sync" ? "border-primary text-primary" : "border-border bg-transparent"
                  )}>
                    {selectedTool === "delta-sync" && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                </div>

                {/* External Data Sync Engine */}
                <div
                  onClick={() => setSelectedTool("external-sync")}
                  className={cn(
                    "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-muted/15 text-xs",
                    selectedTool === "external-sync"
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-card"
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">External Data Sync Engine</span>
                      <span className="rounded bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-sky-500 uppercase tracking-wide">
                        Sync
                      </span>
                    </div>
                    <p className="text-muted-foreground/70 font-semibold">Sync features from external services</p>
                  </div>
                  <div className={cn(
                    "h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0",
                    selectedTool === "external-sync" ? "border-primary text-primary" : "border-border bg-transparent"
                  )}>
                    {selectedTool === "external-sync" && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                </div>

                {/* Metadata Validation Engine */}
                <div
                  onClick={() => setSelectedTool("metadata")}
                  className={cn(
                    "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-muted/15 text-xs",
                    selectedTool === "metadata"
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-card"
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">Metadata Validation Engine</span>
                      <span className="rounded bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-rose-500 uppercase tracking-wide">
                        Validation
                      </span>
                    </div>
                    <p className="text-muted-foreground/70 font-semibold">Validate schema constraints & naming rules</p>
                  </div>
                  <div className={cn(
                    "h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0",
                    selectedTool === "metadata" ? "border-primary text-primary" : "border-border bg-transparent"
                  )}>
                    {selectedTool === "metadata" && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                </div>

                {/* Database Compress */}
                <div
                  onClick={() => setSelectedTool("compress")}
                  className={cn(
                    "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-muted/15 text-xs",
                    selectedTool === "compress"
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-card"
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">Database Compress</span>
                      <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-indigo-400 uppercase tracking-wide">
                        Utility
                      </span>
                    </div>
                    <p className="text-muted-foreground/70 font-semibold">Perform compression on target databases</p>
                  </div>
                  <div className={cn(
                    "h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0",
                    selectedTool === "compress" ? "border-primary text-primary" : "border-border bg-transparent"
                  )}>
                    {selectedTool === "compress" && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                </div>

                {/* Data Analyzer */}
                <div
                  onClick={() => setSelectedTool("analyzer")}
                  className={cn(
                    "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-muted/15 text-xs",
                    selectedTool === "analyzer"
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-card"
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">Data Analyzer</span>
                      <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-500 uppercase tracking-wide">
                        Analytics
                      </span>
                    </div>
                    <p className="text-muted-foreground/70 font-semibold">Analyze vector statistics and freshness</p>
                  </div>
                  <div className={cn(
                    "h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0",
                    selectedTool === "analyzer" ? "border-primary text-primary" : "border-border bg-transparent"
                  )}>
                    {selectedTool === "analyzer" && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                </div>

              </div>

              {/* Dynamic Processing Runtime section (4th Image) */}
              <AnimatePresence>
                {(selectedTool === "delta-sync" || selectedTool === "external-sync") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-border bg-card/30 p-5 space-y-4 shadow-soft mt-2.5">
                      <div className="space-y-1 select-none">
                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase block">
                          Processing Runtime
                        </span>
                        <p className="text-[11px] text-muted-foreground font-semibold">
                          Applies to data loading only
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* ArcGIS Pro Runtime */}
                        <div
                          onClick={() => setSelectedRuntime("arcgis")}
                          className={cn(
                            "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-muted/15 text-xs",
                            selectedRuntime === "arcgis"
                              ? "border-primary bg-primary/5 shadow-soft"
                              : "border-border bg-card"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-primary">
                              <CheckCircle2 className="h-4.5 w-4.5" />
                            </span>
                            <div>
                              <div className="font-bold text-foreground">ArcGIS Pro Runtime</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5 leading-normal">Run via ArcGIS Pro geoprocessing</div>
                            </div>
                          </div>
                          
                          {/* checked circle indicator */}
                          <div className={cn(
                            "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                            selectedRuntime === "arcgis" ? "border-primary text-primary" : "border-border bg-transparent"
                          )}>
                            {selectedRuntime === "arcgis" && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                          </div>
                        </div>

                        {/* Run via FME Flow workspace */}
                        <div
                          onClick={() => setSelectedRuntime("fme")}
                          className={cn(
                            "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-muted/15 text-xs",
                            selectedRuntime === "fme"
                              ? "border-primary bg-primary/5 shadow-soft"
                              : "border-border bg-card"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border">
                              <Cog className="h-4.5 w-4.5" />
                            </span>
                            <div>
                              <div className="font-bold text-foreground">Run via FME Flow workspace</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5 leading-normal">Run via FME Flow workspace</div>
                            </div>
                          </div>
                          
                          {/* checked circle indicator */}
                          <div className={cn(
                            "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                            selectedRuntime === "fme" ? "border-primary text-primary" : "border-border bg-transparent"
                          )}>
                            {selectedRuntime === "fme" && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border/20">
                <button
                  onClick={handleBack}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handleContinue}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {current === 3 && (
            <>
              <div>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Select Data Source</h2>
                <p className="mt-1 text-xs text-muted-foreground font-semibold leading-relaxed">
                  Choose the registered data source whose layers this schedule will process. Layers are picked in the next step.
                </p>
              </div>

              {/* Tool selector info banner */}
              <div className="border border-border/60 bg-primary/5 rounded-xl px-4 py-3.5 flex items-center justify-between text-xs font-semibold select-none shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center bg-blue-500/10 border border-blue-500/20 rounded-lg text-primary">
                    <GitFork className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <span className="text-foreground font-bold">{toolDisplayNames[selectedTool]}</span>
                    <span className="text-muted-foreground/80 ml-2 font-mono uppercase text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-muted/60 border border-border/30">Sync</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrent(2)}
                  className="text-primary hover:underline font-bold text-[11px] cursor-pointer animate-pulse"
                >
                  Change Tool
                </button>
              </div>

              {/* Data Sources List */}
              <div className="space-y-3">
                {dataSourcesList.map((src) => {
                  const isChecked = selectedDataSource === src.id;
                  return (
                    <div
                      key={src.id}
                      onClick={() => setSelectedDataSource(src.id)}
                      className={cn(
                        "p-4.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-muted/15 text-xs font-semibold",
                        isChecked ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                          isChecked ? "border-primary text-primary bg-primary/10" : "border-border bg-transparent"
                        )}>
                          {isChecked && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                        </div>
                        <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border">
                          <Database className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <div className="font-bold text-foreground flex items-center gap-1.5">
                            {src.name} <span className="text-[10px] text-muted-foreground/60 font-mono font-bold">({src.sub})</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground/80 mt-0.5 flex items-center gap-1.5 font-bold">
                            <span>{src.desc}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] font-bold text-muted-foreground/80">
                        {src.layersCount} layers
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border/20">
                <button
                  onClick={handleBack}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handleContinue}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {current === 4 && (
            <>
              <div>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Select Layers</h2>
                <p className="mt-1 text-xs text-muted-foreground font-semibold leading-relaxed">
                  Choose one or more data layers to include in this schedule. All selected layers will be processed by the same tool.
                </p>
              </div>

              {/* Search & Actions bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-[320px] shrink-0">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search layers by name or code..."
                    value={layersSearchQuery}
                    onChange={(e) => setLayersSearchQuery(e.target.value)}
                    className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
                <div className="flex-1 min-w-[10px]" />
                <div className="flex items-center gap-2 select-none text-[11px] font-bold">
                  <button
                    onClick={() => setSelectedLayers(layersList.map((l) => l.id))}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-muted-foreground/45">|</span>
                  <button
                    onClick={() => setSelectedLayers([])}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Layers Checklist */}
              <div className="space-y-3">
                {layersList
                  .filter((l) => l.name.toLowerCase().includes(layersSearchQuery.toLowerCase()))
                  .map((layer) => {
                    const isChecked = selectedLayers.includes(layer.id);
                    return (
                      <div
                        key={layer.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedLayers(selectedLayers.filter((id) => id !== layer.id));
                          } else {
                            setSelectedLayers([...selectedLayers, layer.id]);
                          }
                        }}
                        className={cn(
                          "p-4 rounded-xl border flex items-start justify-between cursor-pointer transition-all hover:bg-muted/15 text-xs font-semibold",
                          isChecked ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent div onClick
                            className="h-4.5 w-4.5 rounded border-border/60 bg-card accent-primary mt-0.5 pointer-events-none"
                          />
                          <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border">
                            <Layers className="h-4.5 w-4.5" />
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-foreground truncate max-w-[280px] sm:max-w-md">{layer.name}</div>
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

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border/20">
                <button
                  onClick={handleBack}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handleContinue}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {current === 5 && (
            <>
              <div>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Target Database</h2>
                <p className="mt-1 text-xs text-muted-foreground font-semibold leading-relaxed">
                  Where the processed data will be delivered.
                </p>
              </div>

              {/* Target Databases list */}
              <div className="space-y-3">
                {targetsList.map((target) => {
                  const isChecked = selectedTargetDb === target.id;
                  return (
                    <div
                      key={target.id}
                      onClick={() => setSelectedTargetDb(target.id)}
                      className={cn(
                        "p-4.5 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all hover:bg-muted/15 text-xs font-semibold",
                        isChecked ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                          isChecked ? "border-primary text-primary bg-primary/10" : "border-border bg-transparent"
                        )}>
                          {isChecked && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                        </div>
                        <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border">
                          <Database className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <div className="font-bold text-foreground flex items-center gap-1.5">
                            {target.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {target.sub} - {target.desc}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-[10px] text-muted-foreground/80 font-bold pl-7.5 border-t border-border/20 pt-2 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {target.mappedText}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border/20">
                <button
                  onClick={handleBack}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handleContinue}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {current === 6 && (
            <>
              <div>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Configure Schedule</h2>
                <p className="mt-1 text-xs text-muted-foreground font-semibold leading-relaxed">
                  Define when and how often this job runs.
                </p>
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
                    value={scheduleName}
                    onChange={(e) => setScheduleName(e.target.value)}
                    required
                    placeholder="e.g. Daily L_DMAUDM_MUNICIPALITYBOUNDARY Sync"
                    className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Description</label>
                  <textarea
                    rows={3}
                    value={scheduleDescription}
                    onChange={(e) => setScheduleDescription(e.target.value)}
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
                    onClick={() => setRecurrenceMode("simple")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-md text-[11px] font-extrabold cursor-pointer transition-all",
                      recurrenceMode === "simple" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Simple
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecurrenceMode("advanced")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-md text-[11px] font-extrabold cursor-pointer transition-all",
                      recurrenceMode === "advanced" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Advanced
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
                  Pick a standard cadence. Switch to Advanced for custom rules (e.g. Mon/Wed/Fri, 2nd Tuesday, one-time).
                </p>
              </div>

              {/* Section 3: Frequency */}
              <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/30 pb-2 mb-3 select-none">
                  <Calendar className="h-4 w-4 text-primary" /> Frequency
                </h3>
                
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {["daily", "weekly", "monthly", "quarterly", "half-yearly", "yearly"].map((freq) => {
                    const isSelected = frequency === freq;
                    return (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFrequency(freq)}
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

              {/* Section 4: Timing */}
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
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-10 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                      />
                      <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                    />
                  </div>

                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-semibold text-muted-foreground">End Date (optional)</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-10 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                      />
                      <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground font-bold">Timezone</label>
                    <input
                      type="text"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Run Options */}
              <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/30 pb-2 mb-3 select-none">
                  <Zap className="h-4 w-4 text-primary" /> Run Options
                </h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Priority</label>
                  <div className="flex bg-muted/65 p-1 rounded-lg w-full max-w-[400px]">
                    {["high", "medium", "low"].map((prio) => {
                      const isSelected = priority === prio;
                      return (
                        <button
                          key={prio}
                          type="button"
                          onClick={() => setPriority(prio)}
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
                      id="retryOnFailure"
                      checked={retryOnFailure}
                      onChange={(e) => setRetryOnFailure(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-border/60 bg-card accent-primary mt-0.5 cursor-pointer"
                    />
                    <div className="space-y-3">
                      <label htmlFor="retryOnFailure" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                        Retry on failure
                      </label>
                      {retryOnFailure && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-muted-foreground font-bold">Max attempts</span>
                            <input
                              type="number"
                              min={1}
                              value={maxAttempts}
                              onChange={(e) => setMaxAttempts(Math.max(1, parseInt(e.target.value) || 1))}
                              className="h-9 w-full rounded-lg border border-border/60 bg-background pl-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-muted-foreground font-bold">Retry interval (min)</span>
                            <input
                              type="number"
                              min={1}
                              value={retryInterval}
                              onChange={(e) => setRetryInterval(Math.max(1, parseInt(e.target.value) || 1))}
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
                        id="notifyAdmin"
                        checked={notifyAdmin}
                        onChange={(e) => setNotifyAdmin(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-border/60 bg-card accent-primary cursor-pointer"
                      />
                      <label htmlFor="notifyAdmin" className="text-foreground cursor-pointer select-none">
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
                        const isSelected = defaultRulesBehavior === opt.value;
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
                              name="defaultRulesBehavior"
                              checked={isSelected}
                              onChange={() => setDefaultRulesBehavior(opt.value)}
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
                        const isSelected = spatialRulesBehavior === opt.value;
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
                              name="spatialRulesBehavior"
                              checked={isSelected}
                              onChange={() => setSpatialRulesBehavior(opt.value)}
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
                  onClick={handleBack}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handleContinue}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {current === 7 && (
            <>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Review & Save</h2>
                <p className="text-xs text-muted-foreground font-semibold">Confirm your configuration before creating the schedule.</p>
              </div>

              {/* Blue job summary banner */}
              <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4.5 shadow-soft relative overflow-hidden">
                <div className="flex items-center gap-4.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                    <GitFork className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold tracking-widest text-white/70 uppercase block">PIPELINE FLOW JOB</span>
                    <div className="font-extrabold text-[15px]">{scheduleName || "vuysda"}</div>
                    <div className="text-[11px] text-white/80 font-bold flex flex-wrap items-center gap-1.5">
                      <span>{toolDisplayNames[selectedTool]}</span>
                      <span>•</span>
                      <span>Full Load</span>
                      <span>•</span>
                      <span className="capitalize">{frequency}</span>
                      <span>•</span>
                      <span>{timezone}</span>
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
                      {selectedLayers.length} {selectedLayers.length === 1 ? 'layer' : 'layers'}
                    </span>
                  </div>

                  {/* Selected Layers subcard rows */}
                  <div className="border-t border-border/40 pt-3.5 space-y-2.5">
                    {selectedLayers.map((layerId) => {
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
                  <ConfigTile label="FREQUENCY" value={frequency} />
                  <ConfigTile label="START DATE" value={startDate} />
                  <ConfigTile label="START TIME" value={startTime} />
                  <ConfigTile label="END DATE" value={endDate || "No end"} />
                  <ConfigTile label="TIMEZONE" value={timezone} />
                  <ConfigTile 
                    label="PRIORITY" 
                    value={priority} 
                    valueClassName={cn(
                      priority === "high" && "text-rose-500 font-extrabold uppercase",
                      priority === "medium" && "text-amber-500 font-extrabold uppercase",
                      priority === "low" && "text-blue-500 font-extrabold uppercase"
                    )} 
                  />
                  <ConfigTile label="DELIVERY" value="Full Load" valueClassName="text-blue-500 font-extrabold" />
                  <ConfigTile label="RUNTIME" value={
                    (selectedTool === "delta-sync" || selectedTool === "external-sync")
                      ? `${selectedRuntime === "arcgis" ? "ArcGIS Pro Runtime" : "FME Flow Runtime"}`
                      : "ArcGIS Pro Runtime"
                  } />
                </div>
              </div>

              {/* ACTIVE OPTIONS Section */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ACTIVE OPTIONS</h3>
                <div className="flex flex-wrap items-center gap-2 select-none text-[10px] font-extrabold">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-emerald-400">
                    <Check className="h-3.5 w-3.5" /> Active on save
                  </span>
                  {retryOnFailure && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-primary">
                      <Check className="h-3.5 w-3.5" /> Auto-retry ({maxAttempts}x)
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
                        {defaultRulesBehavior === "strict" ? "Strict" : defaultRulesBehavior === "warning" ? "Warning" : "Skip"}
                      </span>
                      <span className="text-muted-foreground text-[10px] font-bold">
                        — {defaultRulesBehavior === "strict" ? "Fall on violation" : defaultRulesBehavior === "warning" ? "Log & continue" : "No validation"}
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
                        {spatialRulesBehavior === "strict" ? "Strict" : spatialRulesBehavior === "warning" ? "Warning" : "Skip"}
                      </span>
                      <span className="text-muted-foreground text-[10px] font-bold">
                        — {spatialRulesBehavior === "strict" ? "Fall on violation" : spatialRulesBehavior === "warning" ? "Log & continue" : "No validation"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border/20">
                <button
                  onClick={handleBack}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg border border-border bg-card px-4 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handleContinue}
                  className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-primary hover:bg-primary/95 px-4 text-xs font-bold text-white shadow-soft cursor-pointer transition-colors"
                >
                  <Check className="h-4 w-4" /> Save Schedule
                </button>
              </div>
            </>
          )}

        </div>

        {/* Right Side: Schedule Preview Sidebar */}
        <Surface className="!p-5 h-fit lg:sticky lg:top-[90px] border border-border">
          <div className="flex items-start justify-between pb-3 border-b border-border/30 mb-4 select-none">
            <div>
              <div className="text-[13px] font-bold text-foreground">Schedule Preview</div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">Live configuration</div>
            </div>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <div className="text-xs font-semibold text-muted-foreground">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                <span>Step {current} of {steps.length}</span>
                <span className="text-primary">{percent}% complete</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${percent}%` }} />
              </div>
            </div>

            <div className="space-y-3.5">
              {/* ENTITY */}
              <div className="rounded-lg border border-border bg-card/45 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Building2 className="h-4 w-4 text-primary" /> Entity
                </div>
                {selected ? (
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-foreground leading-normal">{selectedEntityObj.name}</div>
                    <div className="text-[10px] text-muted-foreground font-bold">{selectedEntityObj.code} - Digital</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Database className="h-3 w-3" /> {selectedEntityObj.deliveries} deliveries
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Not configured</span>
                )}
              </div>

              {/* LAYERS */}
              <div className="rounded-lg border border-border bg-card/45 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Layers className="h-4 w-4 text-primary" /> Layers
                  </div>
                  {selectedLayers.length > 0 && current >= 4 && (
                    <span className="bg-blue-500/10 text-primary border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono leading-none">
                      {selectedLayers.length} Selected
                    </span>
                  )}
                </div>
                {selectedLayers.length > 0 && current >= 4 ? (
                  <div className="max-h-[140px] overflow-y-auto space-y-2.5 scrollbar-none pr-1">
                    {selectedLayers.map((layerId) => {
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
                  <span className="text-xs text-muted-foreground block">Not configured</span>
                )}
              </div>

              {/* TOOL */}
              <div className="rounded-lg border border-border bg-card/45 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Wrench className="h-4 w-4 text-primary" /> Tool
                </div>
                {current >= 2 ? (
                  <div className="space-y-1.5 text-xs font-semibold text-muted-foreground">
                    <div className="font-bold text-foreground">{toolDisplayNames[selectedTool]}</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/80 mt-1">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-primary border border-blue-500/20 text-[9px] font-extrabold uppercase font-mono">
                        ~10 min
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400">97.9% Success</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Not configured</span>
                )}
              </div>
              
              {/* SCHEDULE */}
              <div className="rounded-lg border border-border bg-card/45 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" /> Schedule
                </div>
                <div className="space-y-2 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Frequency</span>
                    <span className="font-bold text-foreground capitalize">{frequency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Start</span>
                    <span className="font-bold text-foreground">
                      {current >= 6 ? `${startDate} ${startTime}` : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Timezone</span>
                    <span className="font-bold text-foreground">Asia/Dubai (UTC+4)</span>
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

function PreviewRow({ icon, label, value, active }: { icon: React.ReactNode; label: string; value: string; active?: boolean }) {
  return (
    <div className={cn(
      "rounded-lg border p-3.5 transition-all text-xs font-semibold",
      active ? "border-primary/20 bg-primary/5 text-primary" : "border-border bg-card/45 text-muted-foreground"
    )}>
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        <span className="text-primary">{icon}</span> {label}
      </div>
      <div className="mt-1.5 truncate font-bold text-foreground/90">{value}</div>
    </div>
  );
}

function ConfigTile({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-3.5 space-y-1">
      <span className="text-[9px] font-bold text-muted-foreground/80 tracking-wider uppercase block select-none">{label}</span>
      <div className={cn("font-extrabold text-foreground text-xs leading-tight", valueClassName)}>{value}</div>
    </div>
  );
}
