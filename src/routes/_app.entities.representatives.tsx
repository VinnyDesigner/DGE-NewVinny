import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Download, Filter, Plus, Search, SlidersHorizontal, Pencil, Trash2, Eye, User, IdCard, Shield, Key, Building2, Globe, Calendar, ChevronDown, ChevronUp, Sparkles, X, Check, ArrowLeft, KeyRound, EyeOff, LockKeyhole, AlertCircle, Users, CheckCircle2, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/entities/representatives")({
  head: () => ({
    meta: [
      { title: "Representatives — Data Automation Studio" },
      { name: "description", content: "Contacts assigned to entities — profiles, access and credentials." },
    ],
  }),
  component: RepsPage,
});

interface RepresentativeItem {
  name: string;
  username: string;
  entity: string;
  role: string;
  email: string;
  phone: string;
  dept: string;
  status?: string;
}

const STORAGE_KEY_REPS = "dge_representatives_data";

const initialRows: RepresentativeItem[] = [
  { name: "Khalid Al-Farsi", username: "EAD-KFarsi", entity: "EAD", role: "Technical", email: "khalid.alfarsi@example.com", phone: "+971 50 123 4567", dept: "—", status: "Active" },
  { name: "Fatima Al-Zaabi", username: "ADDC-FZaabi", entity: "ADDC", role: "Business", email: "fatima.alzaabi@example.com", phone: "+971 50 765 4321", dept: "Data Management", status: "Active" },
];

const DIRECTORY_GROUPS = [
  {
    category: "DATA PLATFORM",
    items: [
      { id: "DATA-USERS", name: "DATA-USERS", desc: "General data platform read access" },
      { id: "DATA-MANAGERS", name: "DATA-MANAGERS", desc: "Data management & curation tasks" },
      { id: "DATA-ADMINS", name: "DATA-ADMINS", desc: "Full data administration rights" },
    ],
  },
  {
    category: "GIS & PORTAL",
    items: [
      { id: "GIS-VIEWERS", name: "GIS-VIEWERS", desc: "View-only GIS layer access" },
      { id: "GIS-EDITORS", name: "GIS-EDITORS", desc: "Edit and publish GIS features" },
      { id: "PORTAL-CONTRIBUTORS", name: "PORTAL-CONTRIBUTORS", desc: "Create & edit portal content" },
      { id: "PORTAL-ADMINS", name: "PORTAL-ADMINS", desc: "Full portal administration" },
    ],
  },
  {
    category: "INTEGRATION",
    items: [
      { id: "INTEGRATION-TEAM", name: "INTEGRATION-TEAM", desc: "REST API & integration pipeline access" },
      { id: "API-USERS", name: "API-USERS", desc: "Developer API key access" },
    ],
  },
  {
    category: "REPORTING",
    items: [
      { id: "GOV-REPORTING", name: "GOV-REPORTING", desc: "Government dashboard & reports" },
      { id: "ANALYTICS-TEAM", name: "ANALYTICS-TEAM", desc: "Advanced analytics workspaces" },
    ],
  },
  {
    category: "SECURITY",
    items: [
      { id: "SECURITY-AUDIT", name: "SECURITY-AUDIT", desc: "Audit log & compliance read access" },
    ],
  },
];

function RepsPage() {
  // Navigation & Tabs
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Dynamic Stateful list
  const [repsList, setRepsList] = useState<RepresentativeItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_REPS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved reps:", e);
        }
      }
    }
    return initialRows;
  });

  const saveReps = (newList: RepresentativeItem[]) => {
    setRepsList(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_REPS, JSON.stringify(newList));
    }
  };

  // Dropdown Entities list
  const [entities] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dge_entities_data");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((e: any) => e.code);
          }
        } catch (e) {
          console.error("Failed to parse entities:", e);
        }
      }
    }
    return ["ADDA", "EAD", "DGE", "ADDC", "ADHA"];
  });

  // Table Filters & Pagination
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    return repsList.filter((r) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.name.toLowerCase().includes(q) &&
          !r.username.toLowerCase().includes(q) &&
          !r.role.toLowerCase().includes(q) &&
          !r.email.toLowerCase().includes(q) &&
          !r.phone.toLowerCase().includes(q) &&
          !r.dept.toLowerCase().includes(q) &&
          !r.entity.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [query, repsList]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const paginatedRows = useMemo(() => {
    return filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Form Fields State
  const [formEntity, setFormEntity] = useState("");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhoneCode, setFormPhoneCode] = useState("+971");
  const [formPhoneNum, setFormPhoneNum] = useState("");
  const [formJobTitle, setFormJobTitle] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formRole, setFormRole] = useState("Technical"); // Technical, Business, Head/Director
  const [formPositionType, setFormPositionType] = useState("");
  const [formStatus, setFormStatus] = useState("Active");
  const [formRemarks, setFormRemarks] = useState("");

  const [formUsername, setFormUsername] = useState("");
  const [formActiveFrom, setFormActiveFrom] = useState("");
  const [formActiveUntil, setFormActiveUntil] = useState("");

  const [formPassword, setFormPassword] = useState("");
  const [formConfirmPassword, setFormConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [gisAccessEnabled, setGisAccessEnabled] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [groupFilter, setGroupFilter] = useState("");

  // Username auto-generation formula
  const generateUsername = (name: string, entity: string) => {
    if (!name || !entity) return "";
    const nameParts = name.trim().split(/\s+/);
    const initials = nameParts.slice(0, -1).map((p) => p[0]).join("").toUpperCase();
    const lastName = nameParts[nameParts.length - 1];
    const cleanLastName = lastName.replace(/[^a-zA-Z0-9]/g, "");
    return `${entity}-${initials}${cleanLastName}`;
  };

  // Sync Username when Profile Name or Entity changes
  useEffect(() => {
    const generated = generateUsername(formName, formEntity);
    setFormUsername(generated);
  }, [formName, formEntity]);

  const toggleGroupMembership = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId]
    );
  };

  const handleSetPassword = () => {
    if (formPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (formPassword !== formConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password verified and staged");
  };

  const resetForm = () => {
    setFormEntity("");
    setFormName("");
    setFormEmail("");
    setFormPhoneCode("+971");
    setFormPhoneNum("");
    setFormJobTitle("");
    setFormDept("");
    setFormRole("Technical");
    setFormPositionType("");
    setFormStatus("Active");
    setFormRemarks("");
    setFormUsername("");
    setFormActiveFrom("");
    setFormActiveUntil("");
    setFormPassword("");
    setFormConfirmPassword("");
    setSelectedGroups([]);
    setGisAccessEnabled(false);
    setGroupFilter("");
    setActiveTab("profile");
  };

  const handleRepresentativeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formEntity || formEntity === "Select entity...") {
      toast.error("Please select an Entity");
      setActiveTab("profile");
      return;
    }
    if (!formName.trim()) {
      toast.error("Full Name is required");
      setActiveTab("profile");
      return;
    }
    if (!formEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) {
      toast.error("A valid Email Address is required");
      setActiveTab("profile");
      return;
    }
    if (!formPhoneNum.trim()) {
      toast.error("Phone number is required");
      setActiveTab("profile");
      return;
    }
    if (!formJobTitle.trim()) {
      toast.error("Job Title / Designation is required");
      setActiveTab("profile");
      return;
    }
    if (!formDept || formDept === "Select department...") {
      toast.error("Please select a Department");
      setActiveTab("profile");
      return;
    }
    if (!formUsername.trim()) {
      toast.error("Username is required");
      setActiveTab("account");
      return;
    }

    const newRep: RepresentativeItem = {
      name: formName.trim(),
      username: formUsername.trim(),
      entity: formEntity,
      role: formRole,
      email: formEmail.trim(),
      phone: `${formPhoneCode} ${formPhoneNum.trim()}`,
      dept: formDept,
      status: formStatus,
    };

    if (repsList.some((r) => r.username === newRep.username)) {
      toast.error(`Representative with username ${newRep.username} already exists`);
      return;
    }

    const updatedList = [newRep, ...repsList];
    saveReps(updatedList);
    toast.success(`Representative "${newRep.name}" onboarded successfully!`);

    resetForm();
    setIsAdding(false);
  };

  // LDAP Group category search filtering
  const filteredDirectoryGroups = useMemo(() => {
    return DIRECTORY_GROUPS.map((category) => {
      const matchedItems = category.items.filter(
        (item) =>
          item.name.toLowerCase().includes(groupFilter.toLowerCase()) ||
          item.desc.toLowerCase().includes(groupFilter.toLowerCase())
      );
      return {
        ...category,
        items: matchedItems,
      };
    }).filter((cat) => cat.items.length > 0);
  }, [groupFilter]);

  // Tab Icons map
  const tabIcons = {
    profile: User,
    account: IdCard,
    security: Shield,
    access: Key,
  };

  if (isAdding) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-accent">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Add Representative</h1>
              <p className="text-[14px] text-muted-foreground">Assign a contact to an entity and configure access</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                resetForm();
                setIsAdding(false);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/60 bg-card/65 px-4 text-[14px] font-medium text-foreground/80 hover:text-foreground hover:bg-card cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
          {(["profile", "account", "security", "access"] as const).map((tabId) => {
            const active = activeTab === tabId;
            const IconComponent = tabIcons[tabId];
            return (
              <button
                key={tabId}
                type="button"
                onClick={() => {
                  setActiveTab(tabId);
                }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold transition cursor-pointer ${
                  active
                    ? "bg-primary/15 text-accent border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {tabId.charAt(0).toUpperCase() + tabId.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Tab Contents */}
          <div className="lg:col-span-9 space-y-5">
            {activeTab === "profile" && (
              <div className="space-y-5">
                {/* Entity Assignment */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-border/50 bg-elevated/40">
                    <Building2 className="h-4 w-4 text-accent" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-foreground">Entity Assignment</h3>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5">Which entity this representative belongs to</p>
                    </div>
                  </div>
                  <div className="p-6 bg-surface/20 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Select Entity *</label>
                      <Select value={formEntity} onValueChange={setFormEntity}>
                        <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                          <SelectValue placeholder="Select entity..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/60">
                          {entities.map((code) => (
                            <SelectItem key={code} value={code} className="cursor-pointer text-[13.5px]">
                              {code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-border/50 bg-elevated/40">
                    <User className="h-4 w-4 text-accent" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-foreground">Personal Information</h3>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5">Full name, email and phone details</p>
                    </div>
                  </div>
                  <div className="p-6 bg-surface/20 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Ahmed Al Mansouri"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Email Address *</label>
                        <div className="relative w-full">
                          <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                          <input
                            type="email"
                            placeholder="user@entity.gov.ae"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Phone *</label>
                        <div className="flex gap-2">
                          <select
                            value={formPhoneCode}
                            onChange={(e) => setFormPhoneCode(e.target.value)}
                            className="h-9 border border-border/60 bg-card/90 dark:bg-card/50 text-foreground text-[13px] rounded-lg px-2 w-24 cursor-pointer outline-none focus:ring-1 focus:ring-primary/40"
                          >
                            <option value="+971">+971</option>
                            <option value="+966">+966</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                          </select>
                          <input
                            type="text"
                            placeholder="50 123 4567"
                            value={formPhoneNum}
                            onChange={(e) => setFormPhoneNum(e.target.value)}
                            className="h-9 flex-1 rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-border/50 bg-elevated/40">
                    <Briefcase className="h-4 w-4 text-accent" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-foreground">Job Details</h3>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5">Title, department and role configuration</p>
                    </div>
                  </div>
                  <div className="p-6 bg-surface/20 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Job Title / Designation *</label>
                        <input
                          type="text"
                          placeholder="e.g. Senior Data Engineer"
                          value={formJobTitle}
                          onChange={(e) => setFormJobTitle(e.target.value)}
                          className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Department *</label>
                        <Select value={formDept} onValueChange={setFormDept}>
                          <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                            <SelectValue placeholder="Select department..." />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/60">
                            <SelectItem value="Select department..." disabled className="cursor-pointer text-[13.5px] text-muted-foreground">Select department...</SelectItem>
                            <SelectItem value="Data Management" className="cursor-pointer text-[13.5px]">Data Management</SelectItem>
                            <SelectItem value="IT" className="cursor-pointer text-[13.5px]">IT</SelectItem>
                            <SelectItem value="Policy" className="cursor-pointer text-[13.5px]">Policy</SelectItem>
                            <SelectItem value="Finance" className="cursor-pointer text-[13.5px]">Finance</SelectItem>
                            <SelectItem value="Operations" className="cursor-pointer text-[13.5px]">Operations</SelectItem>
                            <SelectItem value="Legal" className="cursor-pointer text-[13.5px]">Legal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Role *</label>
                        <div className="flex overflow-hidden rounded-lg border border-border/60 bg-card/45 p-1 h-9">
                          {["Technical", "Business", "Head/Director"].map((role) => {
                            const sel = formRole === role;
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => setFormRole(role)}
                                className={`flex-1 rounded-md text-[13px] font-medium transition cursor-pointer px-3 ${
                                  sel ? "bg-primary text-white shadow-soft" : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {role}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Position Type *</label>
                        <Select value={formPositionType} onValueChange={setFormPositionType}>
                          <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/60">
                            <SelectItem value="Select type..." disabled className="cursor-pointer text-[13.5px] text-muted-foreground">Select type...</SelectItem>
                            <SelectItem value="Permanent" className="cursor-pointer text-[13.5px]">Permanent</SelectItem>
                            <SelectItem value="Contractor" className="cursor-pointer text-[13.5px]">Contractor</SelectItem>
                            <SelectItem value="Consultant" className="cursor-pointer text-[13.5px]">Consultant</SelectItem>
                            <SelectItem value="Part-time" className="cursor-pointer text-[13.5px]">Part-time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Status *</label>
                      <Select value={formStatus} onValueChange={setFormStatus}>
                        <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                          <SelectValue placeholder="Active" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/60">
                          <SelectItem value="Active" className="cursor-pointer text-[13.5px]">Active</SelectItem>
                          <SelectItem value="Inactive" className="cursor-pointer text-[13.5px]">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-border/50 bg-elevated/40">
                    <Pencil className="h-4 w-4 text-accent" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-foreground">Remarks</h3>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5">Optional notes about this representative</p>
                    </div>
                  </div>
                  <div className="p-6 bg-surface/20 space-y-4">
                    <textarea
                      placeholder="Any additional notes..."
                      rows={4}
                      value={formRemarks}
                      onChange={(e) => setFormRemarks(e.target.value)}
                      className="w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 p-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                    />
                  </div>
                </div>

                {/* Bottom Helper Info */}
                <div className="flex items-center gap-2 text-muted-foreground text-xs pl-1">
                  <KeyRound className="h-4 w-4 text-accent" />
                  <span>User record — access & password can be configured after saving</span>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-5">
                {/* Username & Credentials */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-border/50 bg-elevated/40">
                    <IdCard className="h-4 w-4 text-accent" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-foreground">Username & Credentials</h3>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5">Platform login identity</p>
                    </div>
                  </div>
                  <div className="p-6 bg-surface/20 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Username *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="ENTITY-InitialsLastName"
                          value={formUsername}
                          onChange={(e) => setFormUsername(e.target.value)}
                          className="h-9 flex-1 rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                        />
                        <button
                          type="button"
                          onClick={() => setFormUsername(generateUsername(formName, formEntity))}
                          className="h-9 px-3 rounded-lg border border-border bg-card/65 text-foreground/80 hover:text-foreground flex items-center gap-1.5 text-[13px] font-medium cursor-pointer transition-colors"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-warning" /> Auto-generate
                        </button>
                      </div>
                      <p className="text-[11px] text-text-muted">Format: [ENTITY]-[Initials][LastName] (auto-generated)</p>
                    </div>
                  </div>
                </div>

                {/* Active Duration */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-border/50 bg-elevated/40">
                    <Calendar className="h-4 w-4 text-accent" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-foreground">Active Duration</h3>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5">When this representative is valid</p>
                    </div>
                  </div>
                  <div className="p-6 bg-surface/20 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Active From *</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={formActiveFrom}
                            onChange={(e) => setFormActiveFrom(e.target.value)}
                            className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          />
                          <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Active Until *</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={formActiveUntil}
                            onChange={(e) => setFormActiveUntil(e.target.value)}
                            className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                          />
                          <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-5">
                {/* Set Password */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-border/50 bg-elevated/40">
                    <LockKeyhole className="h-4 w-4 text-accent" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-foreground">Set Password</h3>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5">Define the login password for this representative</p>
                    </div>
                  </div>
                  <div className="p-6 bg-surface/20 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">New Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="At least 8 characters..."
                            value={formPassword}
                            onChange={(e) => setFormPassword(e.target.value)}
                            className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 pr-10 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
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
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Confirm Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Re-enter password"
                          value={formConfirmPassword}
                          onChange={(e) => setFormConfirmPassword(e.target.value)}
                          className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSetPassword}
                      className="bg-danger hover:opacity-90 text-white font-medium py-1.5 px-4 rounded-lg text-[13.0px] cursor-pointer shadow-soft transition-all"
                    >
                      Set Password
                    </button>
                  </div>
                </div>

                {/* Security Status */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-border/50 bg-elevated/40">
                    <Shield className="h-4 w-4 text-accent" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-foreground">Security Status</h3>
                    </div>
                  </div>
                  <div className="p-6 bg-surface/20">
                    {formPassword ? (
                      <div className="rounded-lg border border-success/30 bg-success/15 p-3.5 flex items-start gap-2.5 text-success text-[12.5px] leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <div>Password set — user account is secured.</div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-border/50 bg-foreground/[0.03] p-3.5 flex items-start gap-2.5 text-muted-foreground text-[12.5px] leading-relaxed">
                        <AlertCircle className="h-4 w-4 text-muted-foreground/80 mt-0.5 shrink-0" />
                        <div>No password set — user cannot log in.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "access" && (
              <div className="space-y-5">
                {/* ArcGIS Portal Access */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-border/50 bg-elevated/40">
                    <Globe className="h-4 w-4 text-accent" />
                    <div>
                      <h3 className="text-[14px] font-semibold text-foreground">ArcGIS Portal Access</h3>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5">Grant access to an ArcGIS Online or Enterprise portal</p>
                    </div>
                  </div>
                  <div className="p-6 bg-surface/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] font-semibold text-foreground">ArcGIS Portal Access</span>
                      <button
                        type="button"
                        onClick={() => setGisAccessEnabled(!gisAccessEnabled)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${gisAccessEnabled ? "bg-success" : "bg-foreground/20"}`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${gisAccessEnabled ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </div>
                    <div className="text-[12px] text-muted-foreground leading-normal">
                      Toggle the switch to enable access configuration.
                    </div>
                  </div>
                </div>

                {/* LDAP / Directory Groups */}
                <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
                  <div className="px-5 py-4 flex items-center justify-between border-b border-border/50 bg-elevated/40">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-accent" />
                      <div>
                        <h3 className="text-[14px] font-semibold text-foreground">LDAP / Directory Groups</h3>
                        <p className="text-[11.5px] text-muted-foreground mt-0.5">Manage group memberships</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-surface/20 space-y-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-3">
                      <div className="space-y-1">
                        <div className="text-[13px] font-bold text-foreground">CURRENT MEMBERSHIPS ({selectedGroups.length})</div>
                        <div className="text-[11.5px] text-muted-foreground">
                          {selectedGroups.length === 0 ? "No group memberships assigned" : `Selected: ${selectedGroups.join(", ")}`}
                        </div>
                      </div>
                      <div className="relative w-full sm:w-[240px]">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <input
                          value={groupFilter}
                          onChange={(e) => setGroupFilter(e.target.value)}
                          placeholder="Filter groups..."
                          className="h-8 w-full rounded-lg border border-border/60 bg-card/50 pl-9 pr-3 text-[12.5px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
                      {filteredDirectoryGroups.map((cat) => (
                        <div key={cat.category} className="space-y-2">
                          <span className="text-[11.5px] font-bold text-muted-foreground tracking-wider uppercase block">{cat.category}</span>
                          <div className="border border-border/50 rounded-xl overflow-hidden bg-card/25 divide-y divide-border/40">
                            {cat.items.map((item) => {
                              const checked = selectedGroups.includes(item.id);
                              return (
                                <label
                                  key={item.id}
                                  className="flex items-start gap-3 p-3 hover:bg-foreground/[0.02] cursor-pointer transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleGroupMembership(item.id)}
                                    className="h-4 w-4 rounded border-border bg-card/85 text-primary mt-0.5 cursor-pointer"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-bold text-foreground">{item.name}</div>
                                    <div className="text-[11.5px] text-muted-foreground mt-0.5 leading-normal">{item.desc}</div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {filteredDirectoryGroups.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground text-[13px]">No matching directory groups found.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Preview Panel */}
          <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-4">
            <div className="rounded-xl border border-border bg-card/85 dark:bg-card/45 p-4 shadow-glow flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Preview</span>
                <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent tracking-widest">PREVIEW</span>
              </div>

              {/* Preview Card */}
              <div className="rounded-xl border border-border bg-linear-to-b from-elevated to-elevated/30 p-4 relative overflow-hidden shadow-soft flex flex-col gap-4">
                <div className="absolute top-2 right-2 rounded-full bg-foreground/[0.04] px-2 py-0.5 text-[9px] font-bold text-muted-foreground/80 border border-border/50 uppercase">
                  Member
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-linear-to-br from-primary/50 to-secondary-accent/50 text-[18px] font-bold text-white flex items-center justify-center shadow-soft shrink-0 initials-avatar">
                    {formName ? formName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-foreground truncate">{formName || "Name..."}</h4>
                    <p className="font-mono text-[10px] font-bold text-muted-foreground tracking-wide uppercase mt-0.5 truncate">{formUsername || "username..."}</p>
                  </div>
                </div>

                <div className="border-t border-border/40 my-1" />

                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold text-[11px] tracking-wide uppercase">Entity</span>
                    <span className="text-foreground/90 font-medium">{formEntity || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold text-[11px] tracking-wide uppercase">Role</span>
                    <span className="text-foreground/90 font-medium">{formRole || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold text-[11px] tracking-wide uppercase">Department</span>
                    <span className="text-foreground/90 font-medium truncate max-w-[130px]">{formDept || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold text-[11px] tracking-wide uppercase">Status</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${formStatus === "Active" ? "bg-success shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-muted-foreground/60"}`} />
                      <span className="text-foreground/90 font-medium lowercase">{formStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleRepresentativeSubmit}
                  className="w-full bg-linear-to-r from-primary to-accent hover:opacity-95 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 shadow-glow cursor-pointer transition-all text-[14px]"
                >
                  <Check className="h-4 w-4" /> Add Representative
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsAdding(false);
                  }}
                  className="w-full bg-transparent border border-border/50 hover:bg-foreground/[0.03] text-muted-foreground hover:text-foreground font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all text-[14px]"
                >
                  <ArrowLeft className="h-4 w-4" /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Main List View
  return (
    <div className="space-y-6">
      <PageHeader
        title="Representatives"
        description="Contacts assigned to entities — manage profiles, access and credentials"
        actions={
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-b from-primary to-primary/90 px-3 py-2 text-[15px] font-medium text-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Representative
          </button>
        }
      />
      <Surface padded={false}>
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[300px] shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, username, email, entity, role…"
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div className="flex-1 min-w-[10px]" />
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[15px] text-foreground/80"><Filter className="h-3.5 w-3.5" /> All Entities</button>
            <div className="flex overflow-hidden rounded-lg border border-border/60">
              <button className="bg-primary/20 px-2.5 py-2 text-[15px] font-medium text-accent">All</button>
              <button className="border-l border-border/60 px-2.5 py-2 text-[15px] text-foreground/80"><span className="inline-block h-1.5 w-1.5 rounded-full bg-success" /> Active <span className="text-muted-foreground">({filteredRows.length})</span></button>
              <button className="border-l border-border/60 px-2.5 py-2 text-[15px] text-foreground/80"><span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60" /> Disabled <span className="text-muted-foreground">(0)</span></button>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[15px] text-foreground/80"><SlidersHorizontal className="h-3.5 w-3.5" /> Columns</button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[15px] text-foreground/80"><Download className="h-3.5 w-3.5" /> Export all <span className="rounded-md bg-primary/20 px-1.5 text-[14px] text-accent">{filteredRows.length}</span></button>
          </div>
        </div>

        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-[16px]">
            <thead>
              <tr className="bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70">
                <th className="py-3 pl-4 table-sticky-col-1"><input type="checkbox" className="h-3.5 w-3.5 rounded border-foreground/20 bg-foreground/5" /></th>
                <th className="py-3 pr-4 text-left table-sticky-col-2">Full Name</th>
                <th className="py-3 pr-4 text-left">Username</th>
                <th className="py-3 pr-4 text-left">Entity</th>
                <th className="py-3 pr-4 text-left">Role</th>
                <th className="py-3 pr-4 text-left">Email</th>
                <th className="py-3 pr-4 text-left">Phone</th>
                <th className="py-3 pr-4 text-left">Department</th>
                <th className="py-3 pr-4 text-right table-sticky-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedRows.map((r) => (
                <tr key={r.username} className="group transition-colors hover:bg-foreground/[0.02]">
                  <td className="py-3 pl-4 table-sticky-col-1"><input type="checkbox" className="h-3.5 w-3.5 rounded border-foreground/20 bg-foreground/5" /></td>
                  <td className="py-3 pr-4 table-sticky-col-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary/40 to-secondary-accent/40 text-[14px] font-semibold text-white ring-1 ring-inset ring-white/10 initials-avatar">
                        {r.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="whitespace-nowrap font-medium text-foreground">{r.name}</div>
                        <div className="text-[14px] text-success">Active</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 pr-4 font-mono text-muted-foreground">{r.username}</td>
                  <td className="py-3 pr-4 font-mono text-[15px] text-foreground/80">{r.entity}</td>
                  <td className="py-3 pr-4 text-[15px] text-foreground/80">{r.role}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{r.email}</td>
                  <td className="py-3 pr-4 font-mono text-muted-foreground">{r.phone}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{r.dept}</td>
                  <td className="py-3 pr-4 table-sticky-actions">
                    <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                      <IconBtn label="View"><Eye className="h-3.5 w-3.5" /></IconBtn>
                      <IconBtn label="Edit"><Pencil className="h-3.5 w-3.5" /></IconBtn>
                      <IconBtn
                        label="Delete"
                        tone="danger"
                        onClick={() => {
                          const updated = repsList.filter((rep) => rep.username !== r.username);
                          saveReps(updated);
                          toast.success(`Representative "${r.name}" deleted successfully.`);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          totalItems={filteredRows.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="representative"
          itemNamePlural="representatives"
        />
      </Surface>
    </div>
  );
}

function IconBtn({ children, label, tone, onClick }: { children: React.ReactNode; label: string; tone?: "danger"; onClick?: () => void }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-md border border-foreground/10 bg-foreground/[0.03] cursor-pointer ${
        tone === "danger"
          ? "text-danger hover:bg-danger/10 hover:border-danger/40"
          : "text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-foreground/[0.06]"
      }`}
    >
      {children}
    </button>
  );
}
