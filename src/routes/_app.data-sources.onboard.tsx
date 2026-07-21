import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/data-sources/onboard")({
  head: () => ({
    meta: [
      { title: "Onboard Source — Data Automation Studio" },
      { name: "description", content: "Register a new data source and automatically discover its layers." },
    ],
  }),
  component: Onboard,
});

const steps = [
  { icon: Database, label: "Source Type" },
  { icon: MapPin, label: "Entity" },
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
  primary: { icon: "text-accent bg-primary/15 ring-primary/25", tag: "bg-primary/10 text-accent ring-primary/25", glow: "from-primary/30" },
  secondary: { icon: "text-[color:var(--secondary-accent)] bg-secondary-accent/15 ring-secondary-accent/25", tag: "bg-secondary-accent/10 text-[color:var(--secondary-accent)] ring-secondary-accent/25", glow: "from-secondary-accent/30" },
  info: { icon: "text-info bg-info/15 ring-info/25", tag: "bg-info/10 text-info ring-info/25", glow: "from-info/30" },
  warning: { icon: "text-warning bg-warning/15 ring-warning/25", tag: "bg-warning/10 text-warning ring-warning/25", glow: "from-warning/30" },
  success: { icon: "text-success bg-success/15 ring-success/25", tag: "bg-success/10 text-success ring-success/25", glow: "from-success/30" },
};

function Onboard() {
  const [step] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Source Onboarding"
        description="Register a new data source and automatically discover its layers"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <PhaseCard active step={1} title="Data Source Onboarding" body="Active — register source & configure connection" tag="ACTIVE" />
        <PhaseCard step={2} title="Map to Target Source" body="Next — discover layers & map to a geodatabase instance" tag="NEXT" />
      </div>

      <Surface>
        {/* Stepper */}
        <div className="relative mx-auto mb-8 flex max-w-3xl items-start justify-between gap-2">
          {steps.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.label} className="relative flex flex-1 flex-col items-center">
                {i < steps.length - 1 && (
                  <div className="pointer-events-none absolute left-[calc(50%+22px)] right-[calc(-50%+22px)] top-[21px] h-px bg-foreground/10">
                    <div className={cn("h-full bg-linear-to-r from-primary to-accent", done ? "w-full" : "w-0")} />
                  </div>
                )}
                <div
                  className={cn(
                    "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all",
                    active
                      ? "border-primary/50 bg-linear-to-b from-primary to-primary/80 text-white shadow-glow"
                      : done
                      ? "border-success/40 bg-success/15 text-success"
                      : "border-foreground/10 bg-foreground/[0.03] text-muted-foreground",
                  )}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <div className={cn("mt-2 text-center text-[13px] font-medium leading-tight sm:text-[15px]", active ? "text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="mb-4">
              <div className="text-h4 text-foreground">Select data source type</div>
              <p className="text-[15px] text-muted-foreground">
                Choose how data enters the platform. Integration method IDs align with{" "}
                <a className="text-accent hover:underline" href="#">Admin → Data Source Connectors</a> when available.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {types.map((t) => {
                const chosen = selected === t.title;
                const tone = toneMap[t.tone];
                return (
                  <motion.button
                    key={t.title}
                    onClick={() => setSelected(t.title)}
                    whileHover={{ y: -2 }}
                    className={cn(
                      "group relative flex flex-col items-stretch justify-start overflow-hidden rounded-2xl border p-5 text-left transition-all",
                      chosen
                        ? "border-accent/50 bg-foreground/[0.04] shadow-glow"
                        : "border-border/60 bg-card/60 hover:border-accent/30",
                    )}
                  >
                    <div className={cn("pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-linear-to-br opacity-60 blur-2xl", tone.glow, "to-transparent")} />
                    <div className="flex items-start gap-3.5">
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset", tone.icon)}>
                        <t.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold text-foreground">{t.title}</div>
                        <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{t.body}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {t.tags.map((tag) => (
                            <span key={tag} className={cn("rounded-md px-1.5 py-0.5 text-[14px] font-medium ring-1 ring-inset", tone.tag)}>
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

            <div className="mt-6 flex items-center justify-between">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[15px] text-foreground/80">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-b from-primary to-primary/90 px-4 py-2 text-[15px] font-medium text-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]">
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Summary */}
          <aside className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-accent ring-1 ring-inset ring-primary/25">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-foreground">Onboarding Summary</div>
                <div className="text-[15px] text-muted-foreground">Configuration in progress</div>
              </div>
            </div>
            <SummaryItem label="Source Type" value={selected ?? "Not selected"} />
            <SummaryItem label="Entity" value="Not selected" />
            <SummaryItem label="Connection" value="Not configured" />
            <SummaryItem label="Selected Layers" value="None selected" />
            <div className="mt-3">
              <div className="mb-1 flex items-center gap-1 text-[15px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-accent" /> Step 1 of 4
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={cn("h-1 flex-1 rounded-full", i === 0 ? "bg-linear-to-r from-primary to-accent" : "bg-foreground/5")} />
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
        "glossy-card relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all",
        active
          ? "glossy-card--primary border-primary/40 shadow-[0_10px_40px_-12px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "border-border/60 bg-card/70",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          active
            ? "bg-linear-to-r from-transparent via-primary/40 to-transparent"
            : "bg-linear-to-r from-transparent via-foreground/10 to-transparent",
        )}
      />
      {active && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl"
        />
      )}

      <div className="relative flex items-start gap-3.5">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
            active
              ? "bg-linear-to-b from-primary to-primary/85 text-white ring-primary/40 shadow-[0_4px_14px_-2px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
              : "bg-foreground/[0.04] text-muted-foreground ring-foreground/10",
          )}
        >
          <span className="text-[15px] font-semibold">{step}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold tracking-tight text-foreground">{title}</span>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[14px] font-semibold tracking-wide ring-1 ring-inset",
                active
                  ? "bg-success/12 text-success ring-success/30"
                  : "bg-foreground/[0.04] text-muted-foreground ring-foreground/10",
              )}
            >
              {tag}
            </span>
          </div>
          <div className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{body}</div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4">
      <div className="text-[14px] font-semibold tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 rounded-lg border border-dashed border-foreground/10 bg-foreground/[0.02] px-3 py-2 text-center text-[15px] text-muted-foreground">
        {value}
      </div>
    </div>
  );
}
