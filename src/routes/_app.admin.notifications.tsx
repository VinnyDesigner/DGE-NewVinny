import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Bell,
  FileText,
  Users,
  Search,
  Plus,
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Check,
  Trash2,
  Edit3
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/notifications")({
  head: () => ({
    meta: [
      { title: "Job Notifications — Data Automation Studio" },
      { name: "description", content: "Configure notification recipients and email templates." },
    ],
  }),
  component: JobNotificationsPage,
});

type TemplateItem = {
  id: string;
  name: string;
  severity: "Success" | "Failure" | "Warning" | "Info";
  subject: string;
  body: string;
  enabled: boolean;
  isHtml: boolean;
};

type GroupItem = {
  id: string;
  entity: string;
  groupName: string;
  recipientsCount: number;
  representatives: string;
  internalUsers: string;
  externalUsers: string;
  status: "Active" | "Inactive";
};

function JobNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"groups" | "templates">("groups");
  
  // Notification groups filters
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [selectedEntityFilter, setSelectedEntityFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  
  // Adding group state
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupEntity, setNewGroupEntity] = useState("Abu Dhabi Digital Authority");
  const [newGroupRecipients, setNewGroupRecipients] = useState("");

  // Adding template state
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateSeverity, setTemplateSeverity] = useState<"Success" | "Failure" | "Warning" | "Info">("Success");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [templateEnabled, setTemplateEnabled] = useState(true);
  const [templateIsHtml, setTemplateIsHtml] = useState(false);

  // Dropdown states
  const [isSeverityDropdownOpen, setIsSeverityDropdownOpen] = useState(false);
  const severityDropdownRef = useRef<HTMLDivElement>(null);

  // Mock initial templates
  const [templates, setTemplates] = useState<TemplateItem[]>([]);

  // Mock initial groups
  const [groups, setGroups] = useState<GroupItem[]>([]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (severityDropdownRef.current && !severityDropdownRef.current.contains(event.target as Node)) {
        setIsSeverityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) {
      toast.error("Please enter a template name.");
      return;
    }
    const newTemplate: TemplateItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: templateName,
      severity: templateSeverity,
      subject: templateSubject,
      body: templateBody,
      enabled: templateEnabled,
      isHtml: templateIsHtml,
    };
    setTemplates([...templates, newTemplate]);
    toast.success(`Template "${templateName}" created successfully.`);
    
    // Reset fields
    setTemplateName("");
    setTemplateSeverity("Success");
    setTemplateSubject("");
    setTemplateBody("");
    setTemplateEnabled(true);
    setTemplateIsHtml(false);
    setIsAddingTemplate(false);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name.");
      return;
    }
    const newGroup: GroupItem = {
      id: Math.random().toString(36).substr(2, 9),
      entity: newGroupEntity,
      groupName: newGroupName,
      recipientsCount: newGroupRecipients ? newGroupRecipients.split(",").length : 0,
      representatives: newGroupRecipients ? newGroupRecipients.split(",")[0] : "—",
      internalUsers: newGroupRecipients ? newGroupRecipients.split(",").slice(1).join(", ") || "—" : "—",
      externalUsers: "—",
      status: "Active",
    };
    setGroups([...groups, newGroup]);
    toast.success(`Notification group "${newGroupName}" added.`);
    setNewGroupName("");
    setNewGroupRecipients("");
    setIsAddingGroup(false);
  };

  const toggleTemplateEnabled = (id: string) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    toast.success("Template status toggled.");
  };

  const deleteTemplate = (id: string) => {
    const t = templates.find(item => item.id === id);
    setTemplates(templates.filter(item => item.id !== id));
    toast.success(`Template "${t?.name}" deleted.`);
  };

  // Filter groups
  const filteredGroups = useMemo(() => {
    return groups.filter(g => {
      const matchQuery = g.groupName.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
                          g.entity.toLowerCase().includes(groupSearchQuery.toLowerCase());
      const matchEntity = selectedEntityFilter === "all" || g.entity.toLowerCase().includes(selectedEntityFilter.toLowerCase());
      const matchStatus = selectedStatusFilter === "all" || g.status.toLowerCase() === selectedStatusFilter.toLowerCase();
      return matchQuery && matchEntity && matchStatus;
    });
  }, [groups, groupSearchQuery, selectedEntityFilter, selectedStatusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job notifications"
        description="Configure who receives email when pipeline jobs (deliveries) succeed or fail, and the email templates. SMTP is configured separately."
      />

      {/* SMTP Managed Information ribbon */}
      <div className="rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 p-4 text-xs text-slate-650 dark:text-slate-400 font-semibold select-none flex items-center leading-normal gap-2 shadow-soft">
        <Mail className="h-4.5 w-4.5 text-primary shrink-0" />
        <span>
          Email transport (SMTP) is managed under{" "}
          <Link to="/admin/settings" className="text-primary hover:underline font-bold">
            Admin -&gt; Settings -&gt; SMTP Config
          </Link>
          . A severity fires only when its template (Templates tab) is enabled.
        </span>
      </div>

      {/* Warnings & Errors */}
      <div className="space-y-3">
        {/* Missing SMTP configuration warning */}
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/25 p-4 text-xs font-bold text-amber-500 flex items-start gap-2.5 leading-normal select-none shadow-soft">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <div>
            No active SMTP configuration — notifications will not be delivered. Activate one under{" "}
            <Link to="/admin/settings" className="underline font-extrabold hover:text-amber-400">
              SMTP Config
            </Link>
            .
          </div>
        </div>
      </div>

      {/* Tab control headers */}
      <div className="border-b border-border/60 flex items-center gap-1 select-none">
        <button
          onClick={() => {
            setActiveTab("groups");
            setIsAddingTemplate(false);
          }}
          className={cn(
            "pb-3.5 px-4 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 -mb-px",
            activeTab === "groups" && !isAddingTemplate
              ? "border-primary text-primary font-extrabold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="h-4 w-4" /> Notification groups
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={cn(
            "pb-3.5 px-4 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 -mb-px",
            activeTab === "templates" || isAddingTemplate
              ? "border-primary text-primary font-extrabold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="h-4 w-4" /> Notification templates
        </button>
      </div>

      {/* TAB CONTENT: Notification Groups */}
      {activeTab === "groups" && (
        <div className="space-y-4">
          {!isAddingGroup ? (
            <>
              {/* Filter controls row */}
              <div className="flex flex-wrap gap-2.5 items-center">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={groupSearchQuery}
                    onChange={(e) => setGroupSearchQuery(e.target.value)}
                    placeholder="Search groups by name, entity..."
                    className="h-9.5 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-semibold"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={selectedEntityFilter}
                    onChange={(e) => setSelectedEntityFilter(e.target.value)}
                    className="h-9.5 rounded-lg border border-border/60 bg-card px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                  >
                    <option value="all">All Entities</option>
                    <option value="Abu Dhabi Digital Authority">Abu Dhabi Digital Authority</option>
                  </select>

                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="h-9.5 rounded-lg border border-border/60 bg-card px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <button
                  disabled
                  className="h-9.5 px-4 bg-muted text-muted-foreground font-extrabold text-xs rounded-lg cursor-not-allowed transition-colors flex items-center gap-1.5 ml-auto opacity-60"
                >
                  <Plus className="h-4 w-4" /> Add new group
                </button>
              </div>

              {/* Data Table */}
              <Surface className="overflow-x-auto !p-0 border border-border">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-border/40 bg-foreground/[0.02] text-muted-foreground font-bold select-none h-11">
                      <th className="px-4 py-2">Entity</th>
                      <th className="px-4 py-2">Group name</th>
                      <th className="px-4 py-2">Recipients Count</th>
                      <th className="px-4 py-2">Representatives</th>
                      <th className="px-4 py-2">Internal Users</th>
                      <th className="px-4 py-2">External Users</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((g) => (
                        <tr key={g.id} className="border-b border-border/40 hover:bg-muted/10 h-12">
                          <td className="px-4 py-2 text-foreground font-bold">{g.entity}</td>
                          <td className="px-4 py-2 font-extrabold text-foreground">{g.groupName}</td>
                          <td className="px-4 py-2 font-mono">{g.recipientsCount}</td>
                          <td className="px-4 py-2 text-muted-foreground">{g.representatives}</td>
                          <td className="px-4 py-2 text-muted-foreground">{g.internalUsers}</td>
                          <td className="px-4 py-2 text-muted-foreground">{g.externalUsers}</td>
                          <td className="px-4 py-2">
                            <span className={cn(
                              "inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[9px] font-extrabold border",
                              g.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"
                            )}>
                              {g.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button className="p-1 hover:text-primary transition-colors cursor-pointer mr-1">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setGroups(groups.filter(item => item.id !== g.id))}
                              className="p-1 hover:text-rose-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8}>
                          <div className="py-12 bg-slate-50 dark:bg-[#0B0F19] flex flex-col items-center justify-center text-center select-none rounded-b-xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 mb-3 shadow-soft">
                              <Users className="h-6 w-6" />
                            </div>
                            <div className="text-xs font-bold text-slate-750 dark:text-slate-300">No groups match the filters.</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Surface>
            </>
          ) : (
            /* Add Group form view */
            <Surface className="!p-5 space-y-4 max-w-xl border border-border select-none">
              <div className="flex items-center gap-2 border-b border-border/30 pb-3">
                <button
                  type="button"
                  onClick={() => setIsAddingGroup(false)}
                  className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-muted-foreground cursor-pointer transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Add New Group</h3>
                  <p className="text-[10px] text-muted-foreground font-semibold">Define notification recipients list.</p>
                </div>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">Group name *</label>
                  <input
                    type="text"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g. Administrators Group"
                    className="h-10 w-full rounded-lg border border-border bg-card pl-3 pr-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">Associated Entity</label>
                  <select
                    value={newGroupEntity}
                    onChange={(e) => setNewGroupEntity(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-card px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                  >
                    <option value="Abu Dhabi Digital Authority">Abu Dhabi Digital Authority</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">Emails list (comma separated) *</label>
                  <textarea
                    rows={3}
                    value={newGroupRecipients}
                    onChange={(e) => setNewGroupRecipients(e.target.value)}
                    placeholder="admin@adda.gov.ae, supervisor@adda.gov.ae"
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none font-bold"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-border/20">
                  <button
                    type="button"
                    onClick={() => setIsAddingGroup(false)}
                    className="h-9.5 px-4 bg-transparent border border-border hover:bg-muted text-muted-foreground font-bold text-xs rounded-lg cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9.5 px-4 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-lg cursor-pointer transition-colors shadow-soft"
                  >
                    Add Group
                  </button>
                </div>
              </form>
            </Surface>
          )}
        </div>
      )}

      {/* TAB CONTENT: Notification Templates */}
      {(activeTab === "templates" || isAddingTemplate) && (
        <div className="space-y-4">
          {!isAddingTemplate ? (
            <>
              {/* Description & Create Button Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold select-none">
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  Email templates by severity. Dispatch uses the enabled template for a severity; a disabled template does not send. You can keep multiple templates per severity.
                </p>
                
                <button
                  onClick={() => setIsAddingTemplate(true)}
                  className="h-9.5 px-4 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-lg cursor-pointer transition-colors shadow-soft flex items-center gap-1.5 shrink-0 self-end sm:self-center"
                >
                  <Plus className="h-4 w-4" /> Add new template
                </button>
              </div>

              {/* Data Table / List */}
              {templates.length > 0 ? (
                <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
                  {templates.map((t) => (
                    <Surface key={t.id} className="border border-border space-y-3.5 !p-4.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-extrabold text-foreground text-xs">{t.name}</div>
                          <div className="text-[10px] text-muted-foreground font-bold mt-0.5">{t.subject}</div>
                        </div>

                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-extrabold font-mono border leading-none select-none",
                          t.severity === "Success" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                          t.severity === "Failure" && "bg-rose-500/10 text-rose-400 border-rose-500/20",
                          t.severity === "Warning" && "bg-amber-500/10 text-amber-500 border-amber-500/25",
                          t.severity === "Info" && "bg-blue-500/10 text-primary border-blue-500/20"
                        )}>
                          {t.severity}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground font-semibold line-clamp-3 bg-muted/30 p-2.5 rounded-lg border border-border/40 select-all font-mono whitespace-pre-wrap leading-relaxed">
                        {t.body}
                      </p>

                      <div className="flex items-center justify-between border-t border-border/30 pt-3 text-[10px] font-extrabold">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={t.enabled}
                            onChange={() => toggleTemplateEnabled(t.id)}
                            className="h-4 w-4 rounded border-border/60 bg-card accent-primary"
                          />
                          <span className={t.enabled ? "text-foreground" : "text-muted-foreground"}>
                            {t.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </label>

                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteTemplate(t.id)}
                            className="text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </Surface>
                  ))}
                </div>
              ) : (
                /* Empty state matching 2nd screenshot */
                <div className="py-12 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center select-none shadow-soft">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-400 max-w-md px-6 leading-relaxed">
                    No templates yet. Click "Add new template" to create one.
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Add Template form view matching 3rd and 4th screenshot */
            <Surface className="border border-border !p-5 space-y-5">
              
              {/* Form title bar */}
              <div className="flex items-center justify-between border-b border-border/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddingTemplate(false)}
                    className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-muted-foreground cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  
                  {/* Green badge indicator (Success) */}
                  <span className={cn(
                    "px-2.5 py-0.5 rounded text-[10.5px] font-extrabold uppercase border leading-none select-none",
                    templateSeverity === "Success" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    templateSeverity === "Failure" && "bg-rose-500/10 text-rose-400 border-rose-500/20",
                    templateSeverity === "Warning" && "bg-amber-500/10 text-amber-500 border-amber-500/25",
                    templateSeverity === "Info" && "bg-blue-500/10 text-primary border-blue-500/20"
                  )}>
                    {templateSeverity}
                  </span>

                  <div>
                    <h3 className="text-sm font-bold text-foreground">New template</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Email template for a severity</p>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold">
                  <span>Enabled</span>
                  <input
                    type="checkbox"
                    checked={templateEnabled}
                    onChange={(e) => setTemplateEnabled(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-border/60 bg-card accent-primary"
                  />
                </label>
              </div>

              {/* Form implementation */}
              <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs font-semibold">
                
                {/* Name & Severity Row */}
                <div className="grid gap-4.5 sm:grid-cols-[1fr_260px] items-start">
                  
                  {/* Left input */}
                  <div className="space-y-1.5">
                    <label className="text-muted-foreground block font-bold">Template name *</label>
                    <input
                      type="text"
                      required
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="e.g. Delivery failed (exec summary)"
                      className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                    />
                  </div>

                  {/* Severity selector dropdown (matching 4th screenshot dropdown styling) */}
                  <div className="space-y-1.5 relative" ref={severityDropdownRef}>
                    <label className="text-muted-foreground block font-bold">Severity</label>
                    <button
                      type="button"
                      onClick={() => setIsSeverityDropdownOpen(!isSeverityDropdownOpen)}
                      className="h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-xs text-foreground flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold cursor-pointer"
                    >
                      <span className="capitalize">{templateSeverity}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {/* Absolute options list matching 4th screenshot */}
                    {isSeverityDropdownOpen && (
                      <div className="absolute right-0 left-0 top-[62px] z-50 rounded-lg border border-border bg-white dark:bg-[#0B0F19] py-1 shadow-lg text-xs font-semibold overflow-hidden">
                        {(["Success", "Failure", "Warning", "Info"] as const).map((sev) => {
                          const isSelected = templateSeverity === sev;
                          return (
                            <button
                              key={sev}
                              type="button"
                              onClick={() => {
                                setTemplateSeverity(sev);
                                setIsSeverityDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2 cursor-pointer transition-colors hover:bg-blue-600 hover:text-white block font-bold",
                                isSelected ? "bg-blue-500/10 text-primary" : "text-foreground"
                              )}
                            >
                              {sev}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

                {/* Email Subject */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">Email Subject</label>
                  <input
                    type="text"
                    value={templateSubject}
                    onChange={(e) => setTemplateSubject(e.target.value)}
                    placeholder="e.g. Output details"
                    className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 font-bold"
                  />
                </div>

                {/* Body */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">Body</label>
                  <textarea
                    rows={8}
                    value={templateBody}
                    onChange={(e) => setTemplateBody(e.target.value)}
                    placeholder="Enter email content..."
                    className="w-full rounded-lg border border-border/60 bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-y font-mono whitespace-pre-wrap leading-relaxed"
                  />
                </div>

                {/* Placeholders footer row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/20 pt-4 text-[10px] font-extrabold select-none">
                  <div className="text-muted-foreground leading-normal">
                    Placeholders: <span className="font-mono text-foreground font-semibold">{"{{delivery_code}} {{entity_name}} {{status}} {{delivery_date}} {{layer_count}} {{event}} {{severity}}"}</span>
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold shrink-0 self-end sm:self-center">
                    <input
                      type="checkbox"
                      checked={templateIsHtml}
                      onChange={(e) => setTemplateIsHtml(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-border/60 bg-card accent-primary"
                    />
                    <span>HTML body</span>
                  </label>
                </div>

                {/* Actions buttons */}
                <div className="flex gap-2 pt-3 border-t border-border/20">
                  <button
                    type="submit"
                    className="h-9.5 px-4 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-lg cursor-pointer transition-colors shadow-soft"
                  >
                    + Create template
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingTemplate(false);
                      // Reset fields
                      setTemplateName("");
                      setTemplateSeverity("Success");
                      setTemplateSubject("");
                      setTemplateBody("");
                    }}
                    className="h-9.5 px-4 bg-transparent border border-border hover:bg-muted text-muted-foreground font-bold text-xs rounded-lg cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>

              </form>

            </Surface>
          )}
        </div>
      )}
    </div>
  );
}
