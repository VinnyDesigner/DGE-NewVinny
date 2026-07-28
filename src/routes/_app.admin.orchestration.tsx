import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Server,
  Network,
  ShieldAlert,
  Check,
  ChevronRight,
  ArrowLeft,
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

function NodeOrchestrationComponent() {
  const [step, setStep] = useState(1);
  const [deploymentType, setDeploymentType] = useState<"single" | "standard" | "ha">("single");

  // Form states for Step 2
  const [nodeName, setNodeName] = useState("MGT-01");
  const [hostname, setHostname] = useState("da-mgt-01");
  const [ipAddress, setIpAddress] = useState("10.0.0.10");
  const [maxJobs, setMaxJobs] = useState("3");
  const [notes, setNotes] = useState("");

  const handleNextStep1 = () => {
    setStep(2);
  };

  const handleRegisterNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeName || !hostname || !ipAddress) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Node registered successfully under deployment model");
    setStep(3);
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        eyebrow="Administration"
        title="Node Orchestration"
        description="Set up your deployment to start managing execution nodes."
      />

      {/* Stepper Progress Bar */}
      <div className="w-full mb-6 select-none animate-fade-in">
        <Surface className="p-4 border border-border/60 bg-card">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                  step > 1
                    ? "bg-blue-600 border-blue-600 text-white"
                    : step === 1
                    ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    : "bg-muted border-border text-muted-foreground"
                )}
              >
                {step > 1 ? <Check className="h-3.5 w-3.5" /> : "1"}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground leading-none font-bold uppercase tracking-wider">Step 1</span>
                <span
                  className={cn(
                    "text-xs font-extrabold mt-0.5",
                    step === 1 ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Choose deployment
                </span>
              </div>
            </div>

            {/* Connecting line 1 */}
            <div className="h-0.5 flex-1 bg-border/60 mx-4 relative">
              <div
                className={cn(
                  "absolute inset-0 bg-blue-600 transition-all duration-300",
                  step > 1 ? "w-full" : "w-0"
                )}
              />
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                  step > 2
                    ? "bg-blue-600 border-blue-600 text-white"
                    : step === 2
                    ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    : "bg-muted border-border text-muted-foreground"
                )}
              >
                {step > 2 ? <Check className="h-3.5 w-3.5" /> : "2"}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground leading-none font-bold uppercase tracking-wider">Step 2</span>
                <span
                  className={cn(
                    "text-xs font-extrabold mt-0.5",
                    step === 2 ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Register first node
                </span>
              </div>
            </div>

            {/* Connecting line 2 */}
            <div className="h-0.5 flex-1 bg-border/60 mx-4 relative">
              <div
                className={cn(
                  "absolute inset-0 bg-blue-600 transition-all duration-300",
                  step > 2 ? "w-full" : "w-0"
                )}
              />
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                  step === 3
                    ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    : "bg-muted border-border text-muted-foreground"
                )}
              >
                3
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground leading-none font-bold uppercase tracking-wider">Step 3</span>
                <span
                  className={cn(
                    "text-xs font-extrabold mt-0.5",
                    step === 3 ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Complete
                </span>
              </div>
            </div>
          </div>
        </Surface>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="w-full">
        {/* STEP 1: CHOOSE DEPLOYMENT */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Outer Container matching 2nd screenshot */}
            <Surface className="border border-border/80 p-5 space-y-4">
              <div className="text-xs font-extrabold text-foreground select-none">
                Choose your deployment
                <span className="block text-[10px] font-semibold text-muted-foreground mt-0.5">
                  Select the deployment model that matches your infrastructure.
                </span>
              </div>

              {/* Options list */}
              <div className="space-y-3.5">
                {/* Option 1: Single machine */}
                <div
                  onClick={() => setDeploymentType("single")}
                  className={cn(
                    "border rounded-xl p-4.5 cursor-pointer transition-all flex items-start justify-between select-none bg-[#070b13]/60 hover:bg-[#070b13]/90",
                    deploymentType === "single"
                      ? "border-blue-500 ring-2 ring-blue-500/10 shadow-soft"
                      : "border-border/60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-blue-500/10 border border-blue-500/25 text-primary">
                      <Server className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-foreground">Single machine</span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase border border-border/60">
                            Simplest setup
                          </span>
                        </div>
                        <p className="text-[10.5px] font-semibold text-muted-foreground leading-relaxed mt-1">
                          All services run on one machine. Suitable for development and small single-site deployments.
                        </p>
                      </div>
                      {/* Pills info */}
                      <div className="flex flex-wrap gap-2 pt-0.5 text-[9.5px] font-extrabold text-muted-foreground">
                        <span className="px-2 py-0.5 rounded bg-foreground/[0.03] border border-border/50">✓ 1 machine</span>
                        <span className="px-2 py-0.5 rounded bg-foreground/[0.03] border border-border/50">✓ All 3 agents</span>
                        <span className="px-2 py-0.5 rounded bg-foreground/[0.03] border border-border/50 text-emerald-400">✓ Fastest to stand up</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground/80 font-mono font-bold pt-1">
                        [ 1 node ] Scheduler + Dispatcher + Execution
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5 pr-1">
                    <div
                      className={cn(
                        "h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all",
                        deploymentType === "single"
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-border"
                      )}
                    >
                      {deploymentType === "single" && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                {/* Option 2: Standard enterprise */}
                <div
                  onClick={() => setDeploymentType("standard")}
                  className={cn(
                    "border rounded-xl p-4.5 cursor-pointer transition-all flex items-start justify-between select-none bg-[#070b13]/60 hover:bg-[#070b13]/90",
                    deploymentType === "standard"
                      ? "border-blue-500 ring-2 ring-blue-500/10 shadow-soft"
                      : "border-border/60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                      <Network className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-foreground">Standard enterprise</span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                            Recommended
                          </span>
                        </div>
                        <p className="text-[10.5px] font-semibold text-muted-foreground leading-relaxed mt-1">
                          One management server handles scheduling. Multiple execution nodes run spatial jobs independently.
                        </p>
                      </div>
                      {/* Pills info */}
                      <div className="flex flex-wrap gap-2 pt-0.5 text-[9.5px] font-extrabold text-muted-foreground">
                        <span className="px-2 py-0.5 rounded bg-foreground/[0.03] border border-border/50">✓ 1 management server</span>
                        <span className="px-2 py-0.5 rounded bg-foreground/[0.03] border border-border/50">✓ Up to 5 execution nodes</span>
                        <span className="px-2 py-0.5 rounded bg-foreground/[0.03] border border-border/50">✓ Scales horizontally</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground/80 font-mono font-bold pt-1">
                        [ 1 mgmt ] + [ execution * N ]
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5 pr-1">
                    <div
                      className={cn(
                        "h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all",
                        deploymentType === "standard"
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-border"
                      )}
                    >
                      {deploymentType === "standard" && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                {/* Option 3: High availability */}
                <div
                  onClick={() => setDeploymentType("ha")}
                  className={cn(
                    "border rounded-xl p-4.5 cursor-pointer transition-all flex items-start justify-between select-none bg-[#070b13]/60 hover:bg-[#070b13]/90",
                    deploymentType === "ha"
                      ? "border-blue-500 ring-2 ring-blue-500/10 shadow-soft"
                      : "border-border/60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-purple-500/10 border border-purple-500/25 text-purple-400">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-foreground">High availability</span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase">
                            Enterprise HA
                          </span>
                        </div>
                        <p className="text-[10.5px] font-semibold text-muted-foreground leading-relaxed mt-1">
                          Active and standby management servers with automatic failover. Requires shared Database.
                        </p>
                      </div>
                      {/* Pills info */}
                      <div className="flex flex-wrap gap-2 pt-0.5 text-[9.5px] font-extrabold text-muted-foreground">
                        <span className="px-2 py-0.5 rounded bg-foreground/[0.03] border border-border/50">✓ 2 management (active + standby)</span>
                        <span className="px-2 py-0.5 rounded bg-foreground/[0.03] border border-border/50">✓ Automatic failover</span>
                        <span className="px-2 py-0.5 rounded bg-foreground/[0.03] border border-border/50">✓ Shared database</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground/80 font-mono font-bold pt-1">
                        [ mgmt active ⇌ standby ] + [ execution * N ]
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5 pr-1">
                    <div
                      className={cn(
                        "h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all",
                        deploymentType === "ha"
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-border"
                      )}
                    >
                      {deploymentType === "ha" && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex justify-end pt-3 border-t border-border/40">
                <Button
                  onClick={handleNextStep1}
                  className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-soft select-none transition-colors"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Surface>
          </div>
        )}

        {/* STEP 2: REGISTER FIRST NODE */}
        {step === 2 && (
          <Surface className="border border-border/80 p-5">
            <form onSubmit={handleRegisterNode} className="space-y-6">
              {/* Form header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/40 select-none">
                <div>
                  <h3 className="text-xs font-extrabold text-foreground">Register your first node</h3>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    This node's role is fixed for the chosen deployment.
                  </p>
                </div>
                <span className="text-[9.5px] font-extrabold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                  Both
                </span>
              </div>

              {/* Form fields */}
              <div className="space-y-4.5 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">Node name</label>
                  <Input
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    placeholder="MGT-01"
                    required
                    className="h-10 bg-[#070b13]/60"
                  />
                </div>

                <div className="grid gap-4.5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground block font-bold">Hostname</label>
                    <Input
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                      placeholder="da-mgt-01"
                      required
                      className="h-10 bg-[#070b13]/60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground block font-bold">IP address</label>
                    <Input
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      placeholder="10.0.0.10"
                      required
                      className="h-10 bg-[#070b13]/60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">Max concurrent jobs</label>
                  <Input
                    type="number"
                    value={maxJobs}
                    onChange={(e) => setMaxJobs(e.target.value)}
                    placeholder="3"
                    className="h-10 max-w-[200px] bg-[#070b13]/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">Notes (optional)</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide any deployment notes here..."
                    className="min-h-[80px] bg-[#070b13]/60"
                  />
                </div>

                <p className="text-[10px] text-muted-foreground leading-normal font-semibold select-none pt-1">
                  Workspace & ArcGIS Python paths come from global Tool Parameters (
                  <span className="font-mono font-bold text-foreground">WORKSPACE_BASE_PATH</span> /{" "}
                  <span className="font-mono font-bold text-foreground">PYTHON_EXECUTABLE_PATH</span>) — set once, not per node.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40 select-none">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-9 px-4 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg flex items-center gap-1.5 shadow-soft cursor-pointer transition-colors"
                >
                  Register <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Surface>
        )}

        {/* STEP 3: COMPLETE */}
        {step === 3 && (
          <Surface className="border border-border/80 p-10 text-center space-y-6 bg-card text-foreground">
            <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Check className="h-5 w-5 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-foreground">Setup complete</h3>
              <p className="text-xs text-muted-foreground font-semibold max-w-lg mx-auto leading-relaxed">
                Your nodes have been registered. Start the <span className="font-mono text-foreground font-bold">DA-ExecutionAgent</span> Windows Service on each registered execution node. Nodes will appear ONLINE once the agent sends its first heartbeat (within 30 seconds).
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold select-all pt-1">
              <code className="bg-muted px-2 py-0.5 rounded text-foreground font-mono font-bold">jvugdsf</code>
              <span className="text-[10px] text-blue-500 border border-blue-500/30 bg-blue-500/5 px-2.5 py-0.5 rounded-full font-bold">Management</span>
            </div>

            <div className="pt-4 flex justify-center">
              <Button
                onClick={() => toast.success("Redirecting to Node Registry...")}
                className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg shadow-soft flex items-center gap-1.5"
              >
                Go to Node Registry &rarr;
              </Button>
            </div>
          </Surface>
        )}
      </div>
    </div>
  );
}
