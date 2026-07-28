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
  CheckCircle2
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
              <div>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Select Entity</h2>
                <p className="mt-1 text-xs text-muted-foreground font-semibold">Choose the organisation that owns this data pipeline.</p>
              </div>

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

          {/* Fallback steps for step > 2 */}
          {current > 2 && (
            <Surface className="!p-10 text-center">
              <div className="flex flex-col items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <Cog className="h-6 w-6" />
                </span>
                <h3 className="text-sm font-bold text-foreground">Step {current} — {steps[current - 1].label}</h3>
                <p className="text-xs text-muted-foreground font-semibold">
                  Setup content for this stage will be configured here.
                </p>
                <div className="mt-3.5 flex gap-2.5">
                  <button
                    onClick={handleBack}
                    className="h-9 px-4 font-bold text-xs bg-transparent border border-border hover:bg-muted text-muted-foreground rounded-lg cursor-pointer transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleContinue}
                    className="h-9 px-4 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-soft"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </Surface>
          )}

        </div>

        {/* Right Side: Schedule Preview Sidebar */}
        <Surface className="!p-5 h-fit lg:sticky lg:top-4 shadow-soft border border-border">
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
              <PreviewRow
                icon={<Building2 className="h-4 w-4" />}
                label="Entity"
                value={selected ? `${selectedEntityObj.name} (${selectedEntityObj.code})` : "Not configured"}
              />
              <PreviewRow
                icon={<Layers className="h-4 w-4" />}
                label="Layers"
                value="Not configured"
              />
              <PreviewRow
                icon={<Wrench className="h-4 w-4" />}
                label="Tool"
                value={
                  current >= 2
                    ? `${toolDisplayNames[selectedTool]}${
                        (selectedTool === "delta-sync" || selectedTool === "external-sync")
                          ? ` (${selectedRuntime === "arcgis" ? "ArcGIS Pro" : "FME Flow"})`
                          : ""
                      }`
                    : "Not configured"
                }
                active={current >= 2}
              />
              
              <div className="rounded-lg border border-border bg-card/45 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" /> Schedule
                </div>
                <div className="space-y-2 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Frequency</span>
                    <span className="font-bold text-foreground">Daily</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Start</span>
                    <span className="font-bold text-foreground">—</span>
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
