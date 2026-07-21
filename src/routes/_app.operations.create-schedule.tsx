import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
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
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { cn } from "@/lib/utils";

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
  { name: "Environment Agency Ab…", region: "Environment", code: "EAD", deliveries: 0, tone: "success" },
  { name: "Dept of Government Ena…", region: "Government", code: "DGE", deliveries: 0, tone: "info" },
  { name: "Abu Dhabi Distribution C…", region: "Utilities", code: "ADDC", deliveries: 0, tone: "warning" },
  { name: "Abu Dhabi Housing Auth…", region: "Housing", code: "ADHA", deliveries: 0, tone: "secondary" },
] as const;

function CreateSchedulePage() {
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState<string | null>("ADDA");
  const percent = Math.round((current / steps.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader

        title="Create Schedule"
        description="Build automated data pipeline jobs using the guided wizard"
        actions={
          <Link
            to="/operations/manage-schedules"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-4 text-[14px] font-medium text-foreground/80 hover:text-foreground"
          >
            Manage Schedules <ChevronRight className="h-4 w-4" />
          </Link>
        }
      />

      {/* Stepper */}
      <Surface className="!p-4">
        <div className="flex flex-wrap items-center gap-1">
          {steps.map((s, i) => {
            const active = s.id === current;
            const done = s.id < current;
            return (
              <div key={s.id} className="flex flex-1 items-center gap-2 min-w-[120px]">
                <button
                  onClick={() => setCurrent(s.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-[16px] font-medium transition",
                    active && "bg-accent/20 text-accent ring-1 ring-inset ring-accent/40",
                    done && "text-success",
                    !active && !done && "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-[15px] font-bold ring-1 ring-inset",
                    active && "bg-accent/25 text-accent ring-accent/40",
                    done && "bg-success/20 text-success ring-success/40",
                    !active && !done && "bg-foreground/[0.04] text-muted-foreground ring-border/60",
                  )}>
                    {done ? <Check className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
                  </span>
                  {s.label}
                </button>
                {i < steps.length - 1 && <span className="h-px flex-1 bg-border/60" />}
              </div>
            );
          })}
        </div>
      </Surface>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          {current === 1 ? (
            <>
              <div>
                <h2 className="text-[22px] font-bold text-foreground">Select Entity</h2>
                <p className="mt-1 text-[14px] text-muted-foreground">Choose the organisation that owns this data pipeline.</p>
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
                  <span className="text-[15px] text-muted-foreground shrink-0">5 results</span>
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
                        "group relative overflow-hidden rounded-2xl border p-4 text-left transition hover:-translate-y-0.5",
                        active
                          ? "border-accent/60 bg-accent/10 ring-2 ring-inset ring-accent/40"
                          : "border-border/60 bg-card/60 hover:border-accent/40",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
                          e.tone === "primary" && "bg-primary/15 text-accent ring-primary/25",
                          e.tone === "success" && "bg-success/15 text-success ring-success/25",
                          e.tone === "info" && "bg-info/15 text-info ring-info/25",
                          e.tone === "warning" && "bg-warning/15 text-warning ring-warning/25",
                          e.tone === "secondary" && "bg-[color:var(--secondary-accent)]/15 text-[color:var(--secondary-accent)] ring-[color:var(--secondary-accent)]/25",
                        )}>
                          <Building2 className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold text-foreground">{e.name}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[15px] text-muted-foreground">
                            <span>{e.region}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-1.5 py-0.5 font-medium text-success ring-1 ring-inset ring-success/25">Active</span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-foreground/[0.05] px-1.5 py-0.5 font-mono font-semibold text-foreground/80 ring-1 ring-inset ring-border/60">{e.code}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-1.5 border-t border-border/40 pt-3 text-[15px] text-muted-foreground">
                        <Database className="h-3.5 w-3.5" /> {e.deliveries} deliveries
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrent(Math.min(steps.length, current + 1))}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-linear-to-r from-primary to-accent px-5 text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(59,130,246,0.5)]"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <Surface className="!p-10">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent ring-1 ring-inset ring-accent/25">
                  <Cog className="h-6 w-6" />
                </span>
                <div className="text-[18px] font-semibold text-foreground">Step {current}: {steps[current - 1].label}</div>
                <div className="text-[14px] text-muted-foreground">Continue setup on the next step.</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setCurrent(current - 1)} className="rounded-lg border border-border/60 bg-card/60 px-4 py-2 text-[14px]">Back</button>
                  <button onClick={() => setCurrent(Math.min(steps.length, current + 1))} className="rounded-lg bg-accent/20 px-4 py-2 text-[14px] font-semibold text-accent ring-1 ring-inset ring-accent/40">Continue</button>
                </div>
              </div>
            </Surface>
          )}
        </div>

        {/* Schedule Preview */}
        <Surface className="!p-5 h-fit lg:sticky lg:top-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[16px] font-bold text-foreground">Schedule Preview</div>
              <div className="mt-0.5 text-[16px] text-muted-foreground">Live configuration</div>
            </div>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[16px]">
              <span className="text-muted-foreground">Step {current} of {steps.length}</span>
              <span className="font-semibold text-accent">— {percent}% complete</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full rounded-full bg-linear-to-r from-primary to-accent transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>

          <div className="mt-4 space-y-3 text-[16px]">
            <PreviewRow icon={<Building2 className="h-4 w-4" />} label="Entity" value={selected ? entities.find((e) => e.code === selected)?.name ?? "Not configured" : "Not configured"} />
            <PreviewRow icon={<Layers className="h-4 w-4" />} label="Layers" value="Not configured" />
            <PreviewRow icon={<Wrench className="h-4 w-4" />} label="Tool" value="Not configured" />
            <div className="rounded-lg border border-border/60 bg-card/40 p-3">
              <div className="flex items-center gap-2 text-[15px] font-semibold tracking-wide text-muted-foreground">
                <Calendar className="h-4 w-4 text-accent" /> Schedule
              </div>
              <div className="mt-2 space-y-1.5 text-[16px]">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Frequency</span><span className="font-medium text-foreground">Daily</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Start</span><span className="font-medium text-foreground">—</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Timezone</span><span className="font-medium text-foreground">Asia/Dubai (UTC+4)</span></div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-[16px] text-success ring-1 ring-inset ring-success/25">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Will be active on save
          </div>
        </Surface>
      </div>
    </div>
  );
}

function PreviewRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-3">
      <div className="flex items-center gap-2 text-[15px] font-semibold tracking-wide text-muted-foreground">
        <span className="text-accent">{icon}</span> {label}
      </div>
      <div className="mt-1.5 truncate text-[14px] font-medium text-foreground/90">{value}</div>
    </div>
  );
}
