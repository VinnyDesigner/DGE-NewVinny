import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Loader2,
  RefreshCw,
  Search,
  Terminal,
  User,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/operations/workflow")({
  head: () => ({
    meta: [
      { title: "Workflow Monitor — Data Automation Studio" },
      { name: "description", content: "Live pipeline status, per-stage metrics and streaming logs for every delivery run." },
    ],
  }),
  component: WorkflowPage,
});

const runs = [
  { entity: "Abu Dhabi Digital Authority", code: "DEMO-WF-1042", progress: 53, stages: 3, status: "running" },
];

const stages = [
  {
    index: 1,
    id: "data-collection",
    status: "Success",
    tone: "success",
    duration: "3m 00s",
    chips: [
      { l: "Layers Total", v: "4" },
      { l: "Source Format", v: "FGDB" },
      { l: "Layers Succeeded", v: "4" },
      { l: "Features Extracted", v: "18432" },
    ],
  },
  {
    index: 2,
    id: "qa-qc",
    status: "Running",
    tone: "info",
    progress: 60,
    chips: [
      { l: "Rules Passed", v: "3" },
      { l: "Rules Warned", v: "1" },
      { l: "Rules Evaluated", v: "4" },
      { l: "Features Checked", v: "18432" },
    ],
  },
  {
    index: 3,
    id: "data-ingestion",
    status: "Pending",
    tone: "muted",
    chips: [],
  },
] as const;

const tabs = ["All", "Running", "Success", "Failed", "Queued"];
const detailTabs = ["Live Logs", "Stages", "Timeline"];

function WorkflowPage() {
  const [runFilter, setRunFilter] = useState("All");
  const [detailTab, setDetailTab] = useState("Live Logs");
  const [autoScroll, setAutoScroll] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader

        title="Workflow Monitor"
        description="Live pipeline status, per-stage metrics and streaming logs for every delivery run"
        actions={
          <>
            <StatusChip tone="info" icon={<Loader2 className="h-3.5 w-3.5 animate-spin" />} label="1 running" />
            <StatusChip tone="success" icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="0 ok" />
            <StatusChip tone="danger" icon={<Activity className="h-3.5 w-3.5" />} label="0 failed" />
            <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 text-[14px] font-medium text-foreground/80 hover:text-foreground">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Runs list */}
        <Surface className="!p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search runs..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1 rounded-lg border border-border/60 bg-card/40 p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setRunFilter(t)}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-[16px] font-medium transition",
                  runFilter === t ? "bg-accent/20 text-accent ring-1 ring-inset ring-accent/40" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            {runs.map((r) => (
              <button
                key={r.code}
                className="w-full rounded-xl border border-info/40 bg-info/10 p-3 text-left ring-1 ring-inset ring-info/25 transition hover:border-info/60"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[14px] font-semibold text-foreground">{r.entity}</div>
                  <span className="h-2 w-2 rounded-full bg-info shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
                </div>
                <div className="mt-1 font-mono text-[15px] text-muted-foreground">
                  {r.code} · {r.progress}% · {r.stages} stg
                </div>
              </button>
            ))}
          </div>
        </Surface>

        {/* Run detail */}
        <Surface className="!p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-[15px] font-bold text-accent ring-1 ring-inset ring-primary/40">ADD</span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-[18px] font-bold text-foreground">Abu Dhabi Digital Authority</div>
                  <StatusChip tone="info" icon={<Loader2 className="h-3 w-3 animate-spin" />} label="Running" />
                </div>
                <div className="mt-0.5 font-mono text-[16px] text-muted-foreground">DEMO-WF-1042 · collect · Primary</div>
              </div>
            </div>
            <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 text-[14px] font-medium text-foreground/80 hover:text-foreground">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>

          <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
            <MetricPill icon={<Activity className="h-3.5 w-3.5" />} label="Progress" value="53%" tone="info" />
            <MetricPill icon={<Layers className="h-3.5 w-3.5" />} label="Layers" value="4" tone="primary" />
            <MetricPill icon={<Clock className="h-3.5 w-3.5" />} label="Duration" value="—" tone="secondary" />
            <MetricPill icon={<User className="h-3.5 w-3.5" />} label="Triggered by" value="scheduler" tone="warning" />
            <MetricPill icon={<Calendar className="h-3.5 w-3.5" />} label="Started" value="2026-06-27 16:45" tone="success" />
          </div>

          <div className="mt-5 flex items-center gap-2 text-[16px] font-semibold tracking-wide text-muted-foreground">
            <span className="text-accent">#</span> Pipeline · 3 stages
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {stages.map((s) => (
              <StageCard key={s.id} stage={s} />
            ))}
          </div>

          <div className="mt-5 border-b border-border/60">
            <div className="flex items-center gap-1">
              {detailTabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setDetailTab(t)}
                  className={cn(
                    "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-[14px] font-medium transition",
                    detailTab === t
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "Live Logs" && <Terminal className="h-4 w-4" />}
                  {t === "Stages" && <Zap className="h-4 w-4" />}
                  {t === "Timeline" && <BarChart3 className="h-4 w-4" />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-background/50">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-[16px]">
              <div className="flex items-center gap-2 font-mono text-muted-foreground">
                <Terminal className="h-3.5 w-3.5 text-accent" />
                <span className="font-semibold text-foreground">qa-qc</span>
                <span>· 0 lines ·</span>
                <span className="inline-flex items-center gap-1 text-info">
                  <span className="h-1.5 w-1.5 rounded-full bg-info animate-pulse" /> live
                </span>
              </div>
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border/60 bg-card/60 accent-accent"
                />
                auto-scroll
              </label>
            </div>
            <div className="flex h-56 items-center justify-center font-mono text-[16px] text-muted-foreground">
              Stage has not produced logs yet.
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
}

function StatusChip({ tone, icon, label }: { tone: string; icon: React.ReactNode; label: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[16px] font-medium ring-1 ring-inset",
      tone === "info" && "bg-info/15 text-info ring-info/25",
      tone === "success" && "bg-success/15 text-success ring-success/25",
      tone === "danger" && "bg-danger/15 text-danger ring-danger/25",
    )}>
      {icon} {label}
    </span>
  );
}

function MetricPill({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className={cn(
      "min-w-0 overflow-hidden rounded-xl border border-border/60 bg-card/40 p-3",
      tone === "info" && "border-info/30",
      tone === "primary" && "border-primary/30",
      tone === "success" && "border-success/30",
      tone === "warning" && "border-warning/30",
    )}>
      <div className="flex min-w-0 items-center gap-1.5 text-[13px] tracking-wide text-muted-foreground">
        <span className="shrink-0">{icon}</span>
        <span className="min-w-0 break-words leading-tight">{label}</span>
      </div>
      <div className="mt-1 truncate text-[18px] font-bold text-foreground" title={value}>{value}</div>
    </div>

  );
}

type Stage = (typeof stages)[number];
function StageCard({ stage }: { stage: Stage }) {
  const isActive = stage.tone === "info";
  const isDone = stage.tone === "success";
  const isPending = stage.tone === "muted";
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border p-3",
      isActive && "border-info/50 bg-info/5 ring-1 ring-inset ring-info/20",
      isDone && "border-success/40 bg-success/5",
      isPending && "border-border/60 bg-card/40 opacity-80",
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-[15px] font-bold ring-1 ring-inset",
            isActive && "bg-info/20 text-info ring-info/40",
            isDone && "bg-success/20 text-success ring-success/40",
            isPending && "bg-foreground/10 text-muted-foreground ring-border/60",
          )}>{stage.index}</span>
          {isActive && <Loader2 className="h-3.5 w-3.5 animate-spin text-info" />}
          {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
          <span className="font-mono text-[14px] font-semibold text-foreground">{stage.id}</span>
        </div>
        <span className={cn(
          "text-[15px] font-semibold",
          isActive && "text-info",
          isDone && "text-success",
          isPending && "text-muted-foreground",
        )}>{stage.status}</span>
      </div>
      {"duration" in stage && stage.duration && (
        <div className="mt-2 flex items-center gap-1.5 text-[15px] text-muted-foreground">
          <Clock className="h-3 w-3" /> {stage.duration}
        </div>
      )}
      {"progress" in stage && typeof stage.progress === "number" && (
        <div className="mt-2 text-[16px] font-semibold text-foreground">{stage.progress}%</div>
      )}
      {stage.chips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {stage.chips.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-md bg-foreground/[0.04] px-1.5 py-0.5 text-[15px] font-medium text-foreground/80 ring-1 ring-inset ring-border/60">
              {c.l} <span className="font-mono font-bold text-foreground">{c.v}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
