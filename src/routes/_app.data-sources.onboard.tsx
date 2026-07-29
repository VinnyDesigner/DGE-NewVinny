import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  FileText,
  Layers,
  MapPin,
  Network,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
  Search,
  Building2,
  Compass,
  Check,
  Loader2,
  Eye,
  EyeOff,
  Wifi,
  AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/data-sources/onboard")({
  head: () => ({
    meta: [
      { title: "Onboard Source — Data Automation Studio" },
      { name: "description", content: "Register a new data source and automatically discover its layers." },
    ],
  }),
  component: Onboard,
});

const subSteps = [
  { icon: Database, label: "Source Type" },
  { icon: Building2, label: "Entity" },
  { icon: Settings2, label: "Details" },
  { icon: Save, label: "Register" },
];

const types = [
  { title: "Database", icon: Database, body: "Connect to a database including PostGIS, SQL Server, Oracle.", tags: ["POSTGRESQL", "SQL SERVER", "ORACLE"], tone: "primary" as const },
  { title: "ESRI Services", icon: Network, body: "Connect to ArcGIS Feature Service, Map Service, or GeoData Service endpoints.", tags: ["FEATURE SERVICE", "MAP SERVICE", "GEODATA SERVICE"], tone: "secondary" as const },
  { title: "File Geodatabase (FGDB)", icon: Layers, body: "Upload or reference an ESRI File Geodatabase (.gdb) containing feature classes.", tags: ["ESRI .GDB"], tone: "warning" as const },
  { title: "Shapefile (SHP)", icon: MapPin, body: "Upload and validate Shapefile with geometry and projection checks.", tags: [".SHP", ".SHX", ".DBF", ".PRJ"], tone: "info" as const },
  { title: "Excel", icon: FileSpreadsheet, body: "Import structured tabular or geographic data from Excel workbooks.", tags: [".XLSX", ".XLS"], tone: "success" as const },
  { title: "CSV", icon: FileText, body: "Import geographic or tabular data from CSV or delimited text files.", tags: [".CSV"], tone: "warning" as const },
];

const toneMap: Record<string, { icon: string; tag: string; glow: string }> = {
  primary: { icon: "text-primary bg-primary/15 ring-primary/25", tag: "bg-primary/10 text-primary ring-primary/25", glow: "from-primary/30" },
  secondary: { icon: "text-blue-500 bg-blue-500/15 ring-blue-500/25", tag: "bg-blue-500/10 text-blue-500 ring-blue-500/25", glow: "from-blue-500/30" },
  info: { icon: "text-blue-400 bg-blue-400/15 ring-blue-400/25", tag: "bg-blue-400/10 text-blue-400 ring-blue-400/25", glow: "from-blue-400/30" },
  warning: { icon: "text-amber-500 bg-amber-500/15 ring-amber-500/25", tag: "bg-amber-500/10 text-amber-500 ring-amber-500/25", glow: "from-amber-500/30" },
  success: { icon: "text-blue-500 bg-blue-500/15 ring-blue-500/25", tag: "bg-blue-500/10 text-blue-500 ring-blue-500/25", glow: "from-blue-500/30" },
};

const ENTITY_ITEMS = [
  { code: "ADDA", name: "Abu Dhabi Digital Authority", initials: "AD", color: "bg-blue-600 text-white" },
  { code: "EAD", name: "Environment Agency Abu Dhabi", initials: "EA", color: "bg-sky-600 text-white" },
  { code: "DGE", name: "Dept of Government Enablement", initials: "DG", color: "bg-purple-600 text-white" },
  { code: "ADDC", name: "Abu Dhabi Distribution Company", initials: "AD", color: "bg-amber-600 text-white" },
  { code: "ADHA", name: "Abu Dhabi Housing Authority", initials: "AD", color: "bg-sky-500 text-white" },
];

function Onboard() {
  const [step, setStep] = useState(0); // 0: Source Type, 1: Entity, 2: Details, 3: Register
  const [selectedType, setSelectedType] = useState<string | null>("Database");
  const [selectedEntity, setSelectedEntity] = useState<{ code: string; name: string } | null>(null);

  // Search filter for entities
  const [entitySearch, setEntitySearch] = useState("");

  const filteredEntities = useMemo(() => {
    return ENTITY_ITEMS.filter((ent) =>
      ent.name.toLowerCase().includes(entitySearch.toLowerCase()) ||
      ent.code.toLowerCase().includes(entitySearch.toLowerCase())
    );
  }, [entitySearch]);

  // Form states for Step 2 Details/Connection
  const [sourceName, setSourceName] = useState("Water Network DB");
  const [dbType, setDbType] = useState("PostgreSQL");
  const [dbInstance, setDbInstance] = useState("localhost");
  const [dbPort, setDbPort] = useState("5432");
  const [authType, setAuthType] = useState("Database authentication");
  const [dbUser, setDbUser] = useState("svc_gis");
  const [dbPassword, setDbPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [dbName, setDbName] = useState("gisdb");

  // Connection testing states
  const [testingStatus, setTestingStatus] = useState<"idle" | "testing" | "passed" | "failed">("idle");

  const handleTestConnection = () => {
    setTestingStatus("testing");
    setTimeout(() => {
      setTestingStatus("passed");
      toast.success("Database connection verified successfully.");
    }, 1500);
  };

  const handleContinue = () => {
    if (step === 0 && !selectedType) {
      toast.error("Please select a data source type");
      return;
    }
    if (step === 1 && !selectedEntity) {
      toast.error("Please select an Entity");
      return;
    }
    if (step === 2 && testingStatus !== "passed") {
      toast.error("Please test and verify connection details before proceeding");
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      toast.success("Data source registered and layers discovered successfully!");
      setStep(0);
      setSelectedEntity(null);
      setTestingStatus("idle");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Source Onboarding"
        description="Register a new data source and automatically discover its layers"
      />

      {/* Top Phase Header cards matching screenshot */}
      <div className="grid gap-4 md:grid-cols-2">
        <PhaseCard active={step < 3} step={1} title="Data Source Onboarding" body="Active — register source & configure connection" tag={step < 3 ? "ACTIVE" : "COMPLETED"} />
        <PhaseCard active={step === 3} step={2} title="Map to Target Source" body="Next — discover layers & map to a geodatabase instance" tag={step === 3 ? "ACTIVE" : "NEXT"} />
      </div>

      <Surface className="p-6">
        {/* Stepper progress indicator */}
        <div className="relative mx-auto mb-8 flex max-w-3xl items-start justify-between gap-2">
          {subSteps.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.label} className="relative flex flex-1 flex-col items-center select-none">
                {i < subSteps.length - 1 && (
                  <div className="pointer-events-none absolute left-[calc(50%+22px)] right-[calc(-50%+22px)] top-[21px] h-px bg-border">
                    <div className={cn("h-full bg-linear-to-r from-primary to-blue-500 transition-all duration-300", done ? "w-full" : "w-0")} />
                  </div>
                )}
                <div
                  className={cn(
                    "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 font-bold",
                    active
                      ? "border-primary/50 bg-linear-to-b from-primary to-primary/80 text-white shadow-glow"
                      : done
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-500"
                      : "border-border bg-muted/20 text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-4.5 w-4.5" /> : <s.icon className="h-4.5 w-4.5" />}
                </div>
                <div className={cn("mt-2 text-center text-xs font-bold leading-tight uppercase tracking-wider", active ? "text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main interactive grid area */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] items-start">
          
          {/* STEP 0: Select Source Type */}
          {step === 0 && (
            <div className="min-w-0 space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Select data source type</h2>
                <p className="text-xs text-muted-foreground font-semibold">
                  Choose how data enters the platform. Integration method IDs align with{" "}
                  <span className="text-primary hover:underline cursor-pointer">Admin → Data Source Connectors</span>.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {types.map((t) => {
                  const chosen = selectedType === t.title;
                  const tone = toneMap[t.tone];
                  return (
                    <motion.button
                      key={t.title}
                      onClick={() => setSelectedType(t.title)}
                      whileHover={{ y: -1 }}
                      className={cn(
                        "group relative flex flex-col items-stretch justify-start overflow-hidden rounded-2xl border p-5 text-left transition-all cursor-pointer",
                        chosen
                          ? "border-primary/50 bg-muted/30 shadow-soft"
                          : "border-border bg-card hover:border-primary/30",
                      )}
                    >
                      <div className={cn("pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-linear-to-br opacity-40 blur-xl", tone.glow, "to-transparent")} />
                      <div className="flex items-start gap-3.5">
                        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset font-bold", tone.icon)}>
                          <t.icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1 text-xs">
                          <div className="font-bold text-foreground">{t.title}</div>
                          <p className="leading-relaxed text-muted-foreground font-semibold">{t.body}</p>
                          <div className="pt-2 flex flex-wrap gap-1">
                            {t.tags.map((tag) => (
                              <span key={tag} className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-extrabold ring-1 ring-inset uppercase", tone.tag)}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleContinue}
                  className="bg-primary hover:bg-primary/95 text-white font-bold text-xs h-9.5 rounded-lg flex items-center gap-1.5"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 1: Select Entity (1st Image) */}
          {step === 1 && (
            <div className="min-w-0 space-y-5">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Select Entity</h2>
                <p className="text-xs text-muted-foreground font-semibold">
                  Choose the Abu Dhabi entity that owns this data source.
                </p>
              </div>

              {/* Selected connector reminder bar inside layout */}
              <div className="border border-border/60 bg-primary/5 rounded-xl px-4 py-3 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center bg-primary/10 border border-primary/20 rounded-lg text-primary">
                    <Database className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-foreground font-bold">{selectedType || "Database"}</span>
                    <span className="text-muted-foreground/80 ml-2">Selected connector - profile Database</span>
                  </div>
                </div>
                <button
                  onClick={() => setStep(0)}
                  className="text-primary hover:underline font-bold text-[11px]"
                >
                  Change
                </button>
              </div>

              {/* Entity search filter bar */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={entitySearch}
                  onChange={(e) => setEntitySearch(e.target.value)}
                  placeholder="Search entities..."
                  className="h-10 pl-10 text-xs font-bold bg-background border-border text-foreground"
                />
              </div>

              {/* Entity cards list matching 1st screenshot exactly */}
              <div className="grid gap-3 md:grid-cols-2">
                {filteredEntities.map((ent) => {
                  const isSel = selectedEntity?.code === ent.code;
                  return (
                    <div
                      key={ent.code}
                      onClick={() => setSelectedEntity({ code: ent.code, name: ent.name })}
                      className={cn(
                        "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:bg-muted/20 text-xs",
                        isSel
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0", ent.color)}>
                          {ent.initials}
                        </div>
                        <div>
                          <div className="font-bold text-foreground leading-normal">{ent.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 uppercase font-mono font-bold tracking-wider">{ent.code}</div>
                        </div>
                      </div>
                      
                      {isSel && (
                        <span className="h-5 w-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border/20">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="h-9.5 px-4 font-bold text-xs bg-transparent border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button
                  onClick={handleContinue}
                  className="h-9.5 px-4 bg-primary hover:bg-primary/95 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Configure Details (2nd Image) */}
          {step === 2 && (
            <div className="min-w-0 space-y-5">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Configure Connection</h2>
                <p className="text-xs text-muted-foreground font-semibold">
                  Enter the connection details for your Database.
                </p>
              </div>

              {/* Source Details Card */}
              <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                <div className="px-5 py-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                      <Settings2 className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">Source Details</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-muted-foreground uppercase tracking-wider text-[9px] block">Source Name *</label>
                    <Input
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      placeholder="e.g. Water Network DB"
                      className="h-10 bg-background border-border text-xs text-foreground font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Database Connection Card */}
              <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                      <Database className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Database Connection</h3>
                      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Connect to your database using connection details</p>
                    </div>
                  </div>

                  <span className={cn(
                    "rounded px-2 py-0.5 text-[9px] font-extrabold uppercase border select-none",
                    testingStatus === "passed"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-muted/40 text-muted-foreground border-border"
                  )}>
                    {testingStatus === "passed" ? "Tested" : "Not tested"}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Database Type *</label>
                    <Select value={dbType} onValueChange={setDbType}>
                      <SelectTrigger className="h-10 border-border bg-background text-xs cursor-pointer">
                        <SelectValue placeholder="PostgreSQL" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border font-bold text-xs">
                        <SelectItem value="PostgreSQL" className="cursor-pointer">PostgreSQL</SelectItem>
                        <SelectItem value="SQL Server" className="cursor-pointer">Microsoft SQL Server</SelectItem>
                        <SelectItem value="Oracle" className="cursor-pointer">Oracle Database</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-xs font-bold">
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Instance *</label>
                      <Input
                        value={dbInstance}
                        onChange={(e) => setDbInstance(e.target.value)}
                        placeholder="e.g. localhost or 192.168.1.100"
                        className="h-10 bg-background border-border text-xs text-foreground"
                      />
                      <span className="text-[9px] text-muted-foreground/60 font-semibold block">Hostname or IP address of the server.</span>
                    </div>
                    <div className="space-y-1.5 text-xs font-bold">
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Port</label>
                      <Input
                        value={dbPort}
                        onChange={(e) => setDbPort(e.target.value)}
                        placeholder="5432"
                        className="h-10 bg-background border-border text-xs text-foreground font-mono"
                      />
                      <span className="text-[9px] text-muted-foreground/60 font-semibold block">Default is 5432.</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Authentication Type</label>
                    <Select value={authType} onValueChange={setAuthType}>
                      <SelectTrigger className="h-10 border-border bg-background text-xs cursor-pointer">
                        <SelectValue placeholder="Database authentication" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border font-bold text-xs">
                        <SelectItem value="Database authentication" className="cursor-pointer">Database authentication</SelectItem>
                        <SelectItem value="OS authentication" className="cursor-pointer">OS / Integrated authentication</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-xs font-bold">
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider">User Name *</label>
                      <Input
                        value={dbUser}
                        onChange={(e) => setDbUser(e.target.value)}
                        placeholder="svc_gis"
                        className="h-10 bg-background border-border text-xs text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5 text-xs font-bold">
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Password *</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={dbPassword}
                          onChange={(e) => setDbPassword(e.target.value)}
                          placeholder="••••••••"
                          className="h-10 bg-background border-border text-xs text-foreground pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-bold">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Database *</label>
                    <Input
                      value={dbName}
                      onChange={(e) => setDbName(e.target.value)}
                      placeholder="gisdb"
                      className="h-10 bg-background border-border text-xs text-foreground font-mono"
                    />
                  </div>

                  {/* Register Readiness indicators */}
                  <div className="pt-4 border-t border-border/20 space-y-2.5 text-xs font-semibold text-muted-foreground">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground block mb-1">Register Readiness</span>
                    
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sourceName !== "" && dbInstance !== "" && dbUser !== ""}
                        readOnly
                        className="h-4 w-4 rounded border-border bg-muted text-primary cursor-not-allowed"
                      />
                      <span>Connection details complete</span>
                    </label>
                    
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={testingStatus === "passed"}
                        readOnly
                        className="h-4 w-4 rounded border-border bg-muted text-primary cursor-not-allowed"
                      />
                      <span>Test connection passed</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={testingStatus === "passed"}
                        readOnly
                        className="h-4 w-4 rounded border-border bg-muted text-primary cursor-not-allowed"
                      />
                      <span>Ready to register</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Test Connection Actions Card */}
              <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                <div className="p-4 bg-muted/20 border-b border-border flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Test Connection</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Verify credentials before proceeding</p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingStatus === "testing"}
                    className="h-8.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer rounded-lg transition-all"
                  >
                    {testingStatus === "testing" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    ) : (
                      <Wifi className="h-3.5 w-3.5 text-white" />
                    )}
                    Test Connection
                  </Button>
                </div>
                
                {/* Connection Checklist statuses */}
                <div className="p-5 space-y-3.5 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>Prerequisites</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground/60">OK</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>Network connectivity</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground/60">OK</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>Authentication</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground/60">OK</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border/20">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="h-9.5 px-4 font-bold text-xs bg-transparent border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button
                  onClick={handleContinue}
                  className="h-9.5 px-4 bg-primary hover:bg-primary/95 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Complete / Register Confirmation */}
          {step === 3 && (
            <div className="min-w-0 space-y-6 text-center py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-base font-bold text-foreground">Ready to Register Connection</h2>
                <p className="text-xs text-muted-foreground font-semibold max-w-md mx-auto leading-relaxed">
                  The connection details for <strong className="text-foreground">{sourceName}</strong> have been fully verified. Continuing will onboard the data source and initialize layer mapping tasks.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-4 select-none">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="h-9.5 px-4 font-bold text-xs bg-transparent border-border hover:bg-muted text-muted-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button
                  onClick={handleContinue}
                  className="h-9.5 px-5 bg-primary hover:bg-primary/95 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4 text-white" /> Register Source
                </Button>
              </div>
            </div>
          )}

          {/* Right Summary Sidebar matching the screenshots */}
          <aside className="rounded-2xl border border-border bg-card p-5 shadow-soft lg:sticky lg:top-[90px] h-fit">
            <div className="flex items-start gap-2.5 pb-3 border-b border-border/30 mb-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-foreground leading-normal">Onboarding Summary</div>
                <div className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">Configuration in progress</div>
              </div>
            </div>

            <div className="space-y-4">
              <SummaryItem label="Source Type" value={selectedType ?? "Not selected"} active={!!selectedType} />
              <SummaryItem label="Entity" value={selectedEntity ? `${selectedEntity.name} (${selectedEntity.code})` : "Not selected"} active={!!selectedEntity} />
              <SummaryItem label="Connection" value={testingStatus === "passed" ? "Configured & Passed" : "Not configured"} active={testingStatus === "passed"} />
              <SummaryItem label="Selected Layers" value="None selected" active={false} />
            </div>

            <div className="mt-6 pt-4 border-t border-border/20">
              <div className="mb-2.5 flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Step {step + 1} of 4
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all duration-300",
                      i <= step ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          </aside>

        </div>
      </Surface>
    </div>
  );
}

function PhaseCard({ active, step, title, body, tag }: { active?: boolean; step: number; title: string; body: string; tag: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all",
        active
          ? "border-primary/40 bg-card shadow-soft"
          : "border-border bg-card/50",
      )}
    >
      {active && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl"
        />
      )}

      <div className="relative flex items-start gap-3.5">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset font-bold",
            active
              ? "bg-linear-to-b from-primary to-primary/85 text-white ring-primary/40 shadow-soft"
              : "bg-muted text-muted-foreground ring-border",
          )}
        >
          <span className="text-sm">{step}</span>
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-bold text-foreground leading-none">{title}</span>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide ring-1 ring-inset uppercase",
                active
                  ? "bg-blue-500/10 text-blue-400 ring-blue-500/30"
                  : "bg-muted text-muted-foreground ring-border",
              )}
            >
              {tag}
            </span>
          </div>
          <div className="text-[11px] leading-relaxed text-muted-foreground font-semibold">{body}</div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <div className="space-y-1.5 text-xs font-semibold">
      <div className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">{label}</div>
      <div className={cn(
        "rounded-lg border px-3 py-2 text-center text-xs font-bold transition-all",
        active
          ? "bg-primary/5 border-primary/20 text-primary"
          : "border-dashed border-border bg-muted/20 text-muted-foreground"
      )}>
        {value}
      </div>
    </div>
  );
}
