import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Download,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Eye,
  User,
  IdCard,
  Shield,
  Key,
  Building2,
  Globe,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  Check,
  ArrowLeft,
  KeyRound,
  EyeOff,
  LockKeyhole,
  AlertCircle,
  Users,
  CheckCircle2,
  Briefcase,
  Mail,
  Phone,
  AlertTriangle
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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
  status: string;
  positionType?: string;
  remarks?: string;
  assignedLayers?: number;
  teamGroup?: string;
}

const STORAGE_KEY_REPS = "dge_representatives_data_v4";

const initialRows: RepresentativeItem[] = [
  {
    name: "Tareq Al-Suwaidi",
    username: "EAD-TEad",
    entity: "EAD",
    role: "Technical",
    email: "tareq.alsuwaidi@ead.gov.ae",
    phone: "+971 501368321",
    dept: "Network Data",
    status: "Active",
    positionType: "Full-time",
    remarks: "Primary liaison for environmental network telemetry.",
    assignedLayers: 0,
    teamGroup: "Not set"
  },
  {
    name: "Khalid Al-Farsi",
    username: "EAD-KFarsi",
    entity: "EAD",
    role: "Technical",
    email: "khalid.alfarsi@example.com",
    phone: "+971 50 123 4567",
    dept: "Data Management",
    status: "Active",
    positionType: "Full-time",
    remarks: "",
    assignedLayers: 2,
    teamGroup: "GIS Administration"
  },
  {
    name: "Fatima Al-Zaabi",
    username: "ADDC-FZaabi",
    entity: "ADDC",
    role: "Business",
    email: "fatima.alzaabi@example.com",
    phone: "+971 50 765 4321",
    dept: "Data Management",
    status: "Active",
    positionType: "Full-time",
    remarks: "",
    assignedLayers: 1,
    teamGroup: "Business Curation"
  },
];

const DIRECTORY_GROUPS = [
  {
    category: "DATA PLATFORM",
    items: [
      { id: "DATA-USERS", name: "DATA-USERS", desc: "General data platform read access" },
      { id: "DATA-MANAGERS", name: "DATA-MANAGERS", desc: "Data management & curation team" },
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
];

const ENTITY_DEFAULTS = [
  { code: "ADDA", name: "Abu Dhabi Digital Authority", type: "Semi-Government", color: "bg-blue-600 dark:bg-blue-500" },
  { code: "EAD", name: "Environment Agency Abu Dhabi", type: "Government", color: "bg-emerald-600 dark:bg-emerald-500" },
  { code: "DGE", name: "Dept of Government Enablement", type: "Semi-Government", color: "bg-purple-600 dark:bg-purple-500" },
  { code: "ADDC", name: "Abu Dhabi Distribution Company", type: "State-Owned", color: "bg-amber-600 dark:bg-amber-500" },
  { code: "ADHA", name: "Abu Dhabi Housing Authority", type: "Government", color: "bg-sky-600 dark:bg-sky-500" },
];

const DEPARTMENTS = [
  "Data Management",
  "Digital Infrastructure",
  "eGovernment",
  "Urban Planning",
  "Transport Planning",
  "Data & Research",
  "Data Integration",
  "IT Operations",
  "Housing Data",
  "Urban Development",
  "Digital Operations",
  "Network Data",
  "Data Analytics",
];

const POSITION_TYPES = [
  "Full-time",
  "Part time",
  "Consultant",
  "Contractor",
  "Secondment",
  "Intern",
];

const STATUSES = [
  "Active",
  "Disabled",
];

function RepsPage() {
  // Navigation & View mode: 'list' | 'view' | 'edit' | 'add'
  const [viewMode, setViewMode] = useState<"list" | "view" | "edit" | "add">("list");
  const [selectedRep, setSelectedRep] = useState<RepresentativeItem | null>(null);
  
  // Dialog confirmation states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [repToDelete, setRepToDelete] = useState<RepresentativeItem | null>(null);

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
  const [formPositionType, setFormPositionType] = useState("Full-time");
  const [formStatus, setFormStatus] = useState("Active");
  const [formRemarks, setFormRemarks] = useState("");

  const [formUsername, setFormUsername] = useState("");
  const [formActiveFrom, setFormActiveFrom] = useState("2026-04-26");
  const [formActiveUntil, setFormActiveUntil] = useState("2026-05-26");
  const [noDurationSet, setNoDurationSet] = useState(false);

  const [formPassword, setFormPassword] = useState("");
  const [formConfirmPassword, setFormConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [gisAccessEnabled, setGisAccessEnabled] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [groupFilter, setGroupFilter] = useState("");

  // Custom Searchable Entity Dropdown
  const [isEntityDropdownOpen, setIsEntityDropdownOpen] = useState(false);
  const [entitySearchQuery, setEntitySearchQuery] = useState("");

  const filteredEntities = useMemo(() => {
    return ENTITY_DEFAULTS.filter((ent) =>
      ent.name.toLowerCase().includes(entitySearchQuery.toLowerCase()) ||
      ent.code.toLowerCase().includes(entitySearchQuery.toLowerCase()) ||
      ent.type.toLowerCase().includes(entitySearchQuery.toLowerCase())
    );
  }, [entitySearchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isEntityDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".custom-entity-select")) {
        setIsEntityDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isEntityDropdownOpen]);

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
    setFormPositionType("Full-time");
    setFormStatus("Active");
    setFormRemarks("");
    setFormUsername("");
    setFormActiveFrom("2026-04-26");
    setFormActiveUntil("2026-05-26");
    setNoDurationSet(false);
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
      positionType: formPositionType,
      remarks: formRemarks.trim(),
      assignedLayers: selectedRep?.assignedLayers || 0,
      teamGroup: selectedRep?.teamGroup || "Not set"
    };

    if (viewMode === "add") {
      if (repsList.some((r) => r.username === newRep.username)) {
        toast.error(`Representative with username ${newRep.username} already exists`);
        return;
      }
      const updatedList = [newRep, ...repsList];
      saveReps(updatedList);
      toast.success(`Representative "${newRep.name}" onboarded successfully!`);
    } else {
      const updatedList = repsList.map((r) =>
        r.username === selectedRep?.username ? newRep : r
      );
      saveReps(updatedList);
      toast.success(`Representative "${newRep.name}" updated successfully!`);
      setSelectedRep(newRep);
    }

    resetForm();
    setViewMode("list");
  };

  // Open Edit flow
  const handleOpenEdit = (rep: RepresentativeItem) => {
    setSelectedRep(rep);
    setFormName(rep.name);
    setFormUsername(rep.username);
    setFormEntity(rep.entity);
    setFormRole(rep.role);
    setFormEmail(rep.email);
    
    // Extract phone elements
    const parts = (rep.phone || "").split(" ");
    if (parts.length > 1) {
      setFormPhoneCode(parts[0]);
      setFormPhoneNum(parts.slice(1).join(""));
    } else {
      setFormPhoneCode("+971");
      setFormPhoneNum(rep.phone || "");
    }
    
    setFormJobTitle(rep.positionType === "Full-time" ? "Sr Data" : "Designation");
    setFormDept(rep.dept || "");
    setFormPositionType(rep.positionType || "Full-time");
    setFormStatus(rep.status || "Active");
    setFormRemarks(rep.remarks || "");
    
    setViewMode("edit");
  };

  // Open Delete flow
  const handleOpenDelete = (rep: RepresentativeItem) => {
    setRepToDelete(rep);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (repToDelete) {
      const updated = repsList.filter((rep) => rep.username !== repToDelete.username);
      saveReps(updated);
      toast.success(`Representative "${repToDelete.name}" deleted successfully.`);
      setIsDeleteModalOpen(false);
      setRepToDelete(null);
      if (selectedRep?.username === repToDelete.username) {
        setSelectedRep(null);
        setViewMode("list");
      }
    }
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

  // Render 4th Image: View Representative detail page
  if (viewMode === "view" && selectedRep) {
    const rep = selectedRep;
    const initials = rep.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
    const entityObj = ENTITY_DEFAULTS.find((e) => e.code === rep.entity);
    
    return (
      <div className="space-y-6">
        {/* Top header details card */}
        <div className="bg-card dark:bg-surface border border-border p-6 rounded-2xl shadow-soft">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg shadow-inner ring-4 ring-emerald-500/10">
                {initials}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground leading-none">{rep.name}</h1>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                    {rep.status}
                  </span>
                </div>
                <div className="font-mono text-xs text-muted-foreground font-semibold">
                  @{rep.username}
                </div>
                
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-muted/40 border border-border/80 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    {rep.positionType || "Full-time"}
                  </span>
                  <span className="rounded bg-muted/40 border border-border/80 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    Technical
                  </span>
                  <span className="rounded bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-400">
                    {rep.dept || "Network Data"}
                  </span>
                </div>

                {/* Substats contact row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    <a href={`mailto:${rep.email}`} className="text-primary hover:underline">{rep.email}</a>
                  </span>
                  <span className="text-muted-foreground/45">•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {rep.phone}
                  </span>
                  <span className="text-muted-foreground/45">•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {entityObj ? entityObj.name : rep.entity}
                  </span>
                </div>
              </div>
            </div>

            {/* Muted security status indicators on right */}
            <div className="flex flex-wrap items-center gap-2 md:self-center">
              <span className="rounded-lg bg-muted/30 border border-border/60 px-3 py-1.5 text-[10px] font-extrabold text-muted-foreground uppercase flex items-center gap-1">
                <LockKeyhole className="h-3.5 w-3.5" /> No password
              </span>
              <span className="rounded-lg bg-muted/30 border border-border/60 px-3 py-1.5 text-[10px] font-extrabold text-muted-foreground uppercase flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> ArcGIS Disabled
              </span>
              <div className="flex items-center gap-2 pl-2">
                <Button
                  variant="outline"
                  onClick={() => setViewMode("list")}
                  className="h-9 px-4 font-bold text-xs bg-transparent border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
                <Button
                  onClick={() => handleOpenEdit(rep)}
                  className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content Cards container */}
        <div className="bg-card border border-border rounded-xl shadow-soft">
          <div className="border-b border-border bg-muted/20 p-4 rounded-t-xl">
            <div className="bg-background border border-border/60 rounded-xl p-1 flex gap-1 items-center w-fit shadow-soft">
              {(["profile", "account", "security", "access"] as const).map((tabId) => {
                const active = activeTab === tabId;
                const IconComponent = tabIcons[tabId];
                return (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => setActiveTab(tabId)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition cursor-pointer ${
                      active
                        ? "bg-primary text-primary-foreground border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                    {tabId.charAt(0).toUpperCase() + tabId.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="space-y-6">
                  {/* Entity Assignment */}
                  <Surface className="flex flex-col border border-border p-6 shadow-soft" padded={false}>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-border/20 mb-4">
                      <Building2 className="h-4 w-4 text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Entity Assignment</h3>
                    </div>
                    <div className="flex items-center justify-between bg-muted/10 p-3.5 border border-border rounded-xl text-xs">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                          E
                        </span>
                        <div>
                          <div className="font-bold text-foreground">{entityObj ? entityObj.name : rep.entity}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 font-semibold">Government - Environment, Climate</div>
                        </div>
                      </div>
                      <span className="text-primary hover:underline font-bold cursor-pointer text-[11px]">View Entity →</span>
                    </div>
                  </Surface>

                  {/* Job Details */}
                  <Surface className="flex flex-col border border-border p-6 shadow-soft" padded={false}>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-border/20 mb-4">
                      <Briefcase className="h-4 w-4 text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Job Details</h3>
                    </div>
                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between border-b border-border/10 pb-1.5">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Job Title</span>
                        <span className="text-foreground font-semibold">Sr Data</span>
                      </div>
                      <div className="flex justify-between border-b border-border/10 pb-1.5">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Department</span>
                        <span className="text-foreground font-semibold">{rep.dept || "Network Data"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/10 pb-1.5">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Role</span>
                        <span className="text-foreground font-semibold">{rep.role}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/10 pb-1.5">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Team / Group</span>
                        <span className="text-foreground font-semibold">{rep.teamGroup || "Not set"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/10 pb-1.5">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Position Type</span>
                        <span className="text-foreground font-semibold">{rep.positionType || "Full-time"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Assigned Layers</span>
                        <span className="text-foreground font-bold font-mono">{rep.assignedLayers || 0}</span>
                      </div>
                    </div>
                  </Surface>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  {/* Personal Information */}
                  <Surface className="flex flex-col border border-border p-6 shadow-soft" padded={false}>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-border/20 mb-4">
                      <User className="h-4 w-4 text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Personal Information</h3>
                    </div>
                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between border-b border-border/10 pb-1.5">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Full Name</span>
                        <span className="text-foreground font-semibold">{rep.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/10 pb-1.5">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Username</span>
                        <span className="text-foreground font-bold font-mono">{rep.username}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/10 pb-1.5">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Email</span>
                        <span className="text-foreground font-semibold">{rep.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Phone</span>
                        <span className="text-foreground font-semibold font-mono">{rep.phone}</span>
                      </div>
                    </div>
                  </Surface>

                  {/* Remarks */}
                  <Surface className="flex flex-col border border-border p-6 shadow-soft" padded={false}>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-border/20 mb-4">
                      <Pencil className="h-4 w-4 text-emerald-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Remarks</h3>
                    </div>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed font-semibold italic">
                      {rep.remarks || "No remarks"}
                    </p>
                  </Surface>
                </div>

                {/* Footer Custom Attributes */}
                <div className="lg:col-span-2 mt-4 pt-4 border-t border-border/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">Custom Attributes</span>
                  <div className="bg-muted/10 p-3 rounded-lg border border-border/50 text-xs text-muted-foreground italic font-semibold">
                    No custom attributes
                  </div>
                </div>
              </div>
            )}
            
            {activeTab !== "profile" && (
              <div className="text-center py-10 text-muted-foreground font-semibold text-xs">
                No active configuration in {activeTab} tab.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render 5th Image: Edit Representative View
  if (viewMode === "edit" || viewMode === "add") {
    const isEditing = viewMode === "edit";
    const initials = formName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "?";
    
    return (
      <div className="space-y-6">
        {/* Header banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-md">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {isEditing ? `Edit — ${formName || "Tareq Al-Suwaidi"}` : "Add Representative"}
              </h1>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                {isEditing ? `@${formUsername || "EAD-TEad"}` : "Assign a contact to an entity and configure access"}
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                resetForm();
                setViewMode("list");
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-[13px] font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>

        {/* Edit Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Columns Form */}
          <div className="lg:col-span-9 bg-card border border-border rounded-xl shadow-soft flex flex-col">
            {/* Tabs selector */}
            <div className="border-b border-border bg-muted/20 p-4 rounded-t-xl">
              <div className="bg-background border border-border/60 rounded-xl p-1 flex gap-1 items-center w-fit shadow-soft">
                {(["profile", "account", "security", "access"] as const).map((tabId) => {
                  const active = activeTab === tabId;
                  const IconComponent = tabIcons[tabId];
                  return (
                    <button
                      key={tabId}
                      type="button"
                      onClick={() => setActiveTab(tabId)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition cursor-pointer ${
                        active
                          ? "bg-primary text-primary-foreground border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                      {tabId.charAt(0).toUpperCase() + tabId.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Tab content fields */}
            <div className="p-6 space-y-6">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  {/* Entity Assignment dropdown select */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">Entity Assignment</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-semibold">Which entity this representative belongs to</p>
                    
                    <div className="space-y-1.5 custom-entity-select relative">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Select Entity *</label>
                      <button
                        type="button"
                        onClick={() => setIsEntityDropdownOpen(!isEntityDropdownOpen)}
                        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-bold"
                      >
                        <span className="truncate">
                          {formEntity ? (
                            (() => {
                              const ent = ENTITY_DEFAULTS.find((e) => e.code === formEntity);
                              return ent ? `${ent.name} (${ent.code})` : formEntity;
                            })()
                          ) : (
                            <span className="text-muted-foreground">Select entity...</span>
                          )}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </button>

                      {isEntityDropdownOpen && (
                        <div className="absolute z-50 top-full mt-1.5 left-0 w-full rounded-xl border border-border bg-card text-foreground shadow-glow p-2 space-y-2">
                          <div className="relative flex items-center">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Search entity..."
                              value={entitySearchQuery}
                              onChange={(e) => setEntitySearchQuery(e.target.value)}
                              className="h-8.5 w-full rounded-lg border border-border/60 bg-muted/20 pl-8 text-xs focus:ring-1"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="max-h-[220px] overflow-y-auto scrollbar-thin space-y-1 font-semibold text-xs">
                            {filteredEntities.map((ent) => (
                              <button
                                key={ent.code}
                                type="button"
                                onClick={() => {
                                  setFormEntity(ent.code);
                                  setIsEntityDropdownOpen(false);
                                  setEntitySearchQuery("");
                                }}
                                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition text-left cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[10px] ${ent.color}`}>
                                    {ent.name.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-foreground truncate">{ent.name}</div>
                                    <div className="text-[10px] text-muted-foreground mt-0.5">{ent.type}</div>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded uppercase shrink-0">
                                  {ent.code}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personal Information details */}
                  <div className="space-y-4 pt-4 border-t border-border/20">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">Personal Information</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Full Name *</label>
                        <Input
                          placeholder="e.g. Ahmed Al Mansouri"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="h-10 bg-background border-border text-xs text-foreground font-bold"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Email Address *</label>
                          <Input
                            type="email"
                            placeholder="user@entity.gov.ae"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            className="h-10 bg-background border-border text-xs text-foreground font-bold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Phone *</label>
                          <div className="flex gap-2">
                            <select
                              value={formPhoneCode}
                              onChange={(e) => setFormPhoneCode(e.target.value)}
                              className="h-10 border border-border bg-background text-foreground text-xs rounded-lg px-2 w-24 cursor-pointer outline-none font-bold"
                            >
                              <option value="+971">+971</option>
                              <option value="+966">+966</option>
                              <option value="+1">+1</option>
                            </select>
                            <Input
                              placeholder="501368321"
                              value={formPhoneNum}
                              onChange={(e) => setFormPhoneNum(e.target.value)}
                              className="h-10 bg-background border-border text-xs text-foreground font-bold flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Details settings inputs */}
                  <div className="space-y-4 pt-4 border-t border-border/20">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">Job Details</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Job Title / Designation *</label>
                        <Input
                          placeholder="e.g. Sr Data"
                          value={formJobTitle}
                          onChange={(e) => setFormJobTitle(e.target.value)}
                          className="h-10 bg-background border-border text-xs text-foreground font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Department *</label>
                        <Select value={formDept} onValueChange={setFormDept}>
                          <SelectTrigger className="h-10 w-full border-border bg-background text-xs text-foreground cursor-pointer font-bold">
                            <SelectValue placeholder="Select department..." />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border max-h-[300px] overflow-y-auto font-bold text-xs">
                            {DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept} value={dept} className="cursor-pointer text-xs">
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Role *</label>
                        <div className="flex overflow-hidden rounded-lg border border-border bg-background p-1 h-10">
                          {["Technical", "Business", "Head/Director"].map((role) => {
                            const sel = formRole === role;
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => setFormRole(role)}
                                className={`flex-1 rounded-md text-xs font-bold transition cursor-pointer px-3 ${
                                  sel ? "bg-emerald-600 text-white shadow-soft" : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {role}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Position Type *</label>
                        <Select value={formPositionType} onValueChange={setFormPositionType}>
                          <SelectTrigger className="h-10 w-full border-border bg-background text-xs text-foreground cursor-pointer font-bold">
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border font-bold text-xs">
                            {POSITION_TYPES.map((pt) => (
                              <SelectItem key={pt} value={pt} className="cursor-pointer text-xs">
                                {pt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Status *</label>
                      <Select value={formStatus} onValueChange={setFormStatus}>
                        <SelectTrigger className="h-10 w-full border-border bg-background text-xs text-foreground cursor-pointer font-bold">
                          <SelectValue placeholder="Active" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border font-bold text-xs">
                          <SelectItem value="Active" className="cursor-pointer text-xs">Active</SelectItem>
                          <SelectItem value="Disabled" className="cursor-pointer text-xs">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Remarks area */}
                  <div className="space-y-1.5 pt-4 border-t border-border/20">
                    <div className="flex items-center gap-2">
                      <Pencil className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">Remarks</span>
                    </div>
                    <textarea
                      placeholder="Optional notes about this representative..."
                      rows={4}
                      value={formRemarks}
                      onChange={(e) => setFormRemarks(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none font-bold"
                    />
                  </div>
                </div>
              )}

              {/* 2nd Image content: Account tab editable form */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  {/* Username & Credentials Card */}
                  <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-accent">
                          <IdCard className="h-4 w-4 text-emerald-400" />
                        </span>
                        <div>
                          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Username & Credentials</h3>
                          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Platform login identity</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Username</label>
                          <button
                            type="button"
                            onClick={() => setFormUsername(generateUsername(formName, formEntity))}
                            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="h-3.5 w-3.5" /> Auto-generate
                          </button>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono font-bold text-xs">@</span>
                          <Input
                            placeholder="EAD-TSuwaidi"
                            value={formUsername}
                            onChange={(e) => setFormUsername(e.target.value)}
                            className="h-10 pl-7 bg-background border-border text-xs text-foreground font-bold font-mono"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-semibold">Format: ENTITYCODE-InitialLastName (auto-generated)</p>
                      </div>
                    </div>
                  </div>

                  {/* Active Duration Card */}
                  <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-accent">
                          <Calendar className="h-4 w-4 text-emerald-400" />
                        </span>
                        <div>
                          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Active Duration</h3>
                          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">When this representative is valid</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Active From *</label>
                          <Input
                            type="text"
                            placeholder="26-04-2026"
                            value={formActiveFrom || "26-04-2026"}
                            onChange={(e) => setFormActiveFrom(e.target.value)}
                            className="h-10 bg-background border-border text-xs text-foreground font-bold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Active Until *</label>
                          <Input
                            type="text"
                            placeholder="26-05-2026"
                            value={formActiveUntil || "26-05-2026"}
                            onChange={(e) => setFormActiveUntil(e.target.value)}
                            className="h-10 bg-background border-border text-xs text-foreground font-bold"
                          />
                        </div>
                      </div>

                      {/* Expired alert block */}
                      <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-2.5 flex items-center justify-between text-xs font-bold shadow-soft">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                          <span>Expired</span>
                        </div>
                        <span className="font-mono">{formActiveFrom || "2026-04-26"} → {formActiveUntil || "2026-05-26"}</span>
                      </div>
                    </div>
                  </div>

                  {/* bottom footer text */}
                  <div className="text-[10px] text-muted-foreground font-bold mt-2">
                    Last updated: 2026-04-26 - Created: 2026-04-26
                  </div>
                </div>
              )}

              {/* 3rd Image content: Security tab editable form */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  {/* Set Password Card */}
                  <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-accent">
                          <LockKeyhole className="h-4 w-4 text-emerald-400" />
                        </span>
                        <div>
                          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Set Password</h3>
                          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Define the login password for this representative</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">New Password</label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="At least 8 characters..."
                              value={formPassword}
                              onChange={(e) => setFormPassword(e.target.value)}
                              className="h-10 bg-background border-border text-xs text-foreground font-bold pr-10"
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
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Confirm Password</label>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Re-enter password"
                            value={formConfirmPassword}
                            onChange={(e) => setFormConfirmPassword(e.target.value)}
                            className="h-10 bg-background border-border text-xs text-foreground font-bold"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={handleSetPassword}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold h-9 text-xs rounded-lg px-4 flex items-center gap-1.5 shadow-soft cursor-pointer transition-colors"
                      >
                        Set Password
                      </Button>
                    </div>
                  </div>

                  {/* Security Status Card */}
                  <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-accent">
                          <Shield className="h-4 w-4 text-emerald-400" />
                        </span>
                        <div>
                          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Security Status</h3>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="rounded-lg border border-border/50 bg-muted/30 dark:bg-foreground/[0.03] p-4 flex items-center gap-2.5 text-muted-foreground text-xs font-semibold leading-relaxed">
                        <AlertCircle className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
                        <div>No password set — user cannot log in</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-muted-foreground font-bold mt-2">
                    Last updated: 2026-04-26 - Created: 2026-04-26
                  </div>
                </div>
              )}

              {/* 4th Image content: Access tab editable form */}
              {activeTab === "access" && (
                <div className="space-y-6">
                  {/* ArcGIS Portal Access Card */}
                  <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-accent">
                          <Globe className="h-4 w-4 text-emerald-400" />
                        </span>
                        <div>
                          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">ArcGIS Portal Access</h3>
                          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Grant access to an ArcGIS Online or Enterprise portal</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">ArcGIS Portal Access</span>
                        <button
                          type="button"
                          onClick={() => setGisAccessEnabled(!gisAccessEnabled)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${gisAccessEnabled ? "bg-success" : "bg-foreground/20"}`}
                        >
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${gisAccessEnabled ? "translate-x-4" : "translate-x-0"}`} />
                        </button>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-semibold">
                        Toggle the switch to enable access configuration
                      </div>
                    </div>
                  </div>

                  {/* LDAP / Directory Groups Card */}
                  <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-accent">
                          <Users className="h-4 w-4 text-emerald-400" />
                        </span>
                        <div>
                          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">LDAP / Directory Groups</h3>
                          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Manage group memberships</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* memberships label */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Current Memberships ({selectedGroups.length})</span>
                        <p className="text-[11px] text-muted-foreground font-semibold">No group memberships assigned</p>
                      </div>

                      {/* search box */}
                      <div className="flex items-center justify-between gap-3 border-t border-border/20 pt-4">
                        <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> Available Groups
                        </span>
                        <div className="relative w-[200px]">
                          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Filter..."
                            value={groupFilter}
                            onChange={(e) => setGroupFilter(e.target.value)}
                            className="h-8 pl-7 text-[11px] font-bold bg-background border-border text-foreground"
                          />
                        </div>
                      </div>

                      {/* groups list checkboxes */}
                      <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                        {filteredDirectoryGroups.map((cat) => (
                          <div key={cat.category} className="space-y-2">
                            <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase block">{cat.category}</span>
                            <div className="border border-border/50 rounded-xl overflow-hidden bg-card/25 divide-y divide-border/40 text-xs font-semibold">
                              {cat.items.map((item) => {
                                const checked = selectedGroups.includes(item.id);
                                return (
                                  <label
                                    key={item.id}
                                    className="flex items-start gap-3 p-3 hover:bg-foreground/[0.015] cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleGroupMembership(item.id)}
                                      className="h-4 w-4 rounded border-border bg-card/85 text-primary mt-0.5 cursor-pointer"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-foreground">{item.name}</div>
                                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-normal">{item.desc}</div>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-muted-foreground font-bold mt-2">
                    Last updated: 2026-04-26 - Created: 2026-04-26
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Preview Panel */}
          <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-glow flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Preview</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-400 tracking-wider">PREVIEW</span>
              </div>

              {/* Preview Card */}
              <div className="relative overflow-hidden flex flex-col gap-4 w-full pt-2 text-xs">
                <div className="absolute top-2 right-2 rounded-full bg-muted/65 px-2 py-0.5 text-[9px] font-extrabold text-muted-foreground border border-border uppercase">
                  Member
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-inner">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate">{formName || "Name..."}</h4>
                    <p className="font-mono text-[9px] font-bold text-muted-foreground mt-0.5 truncate">@{formUsername || "username..."}</p>
                  </div>
                </div>

                <div className="border-t border-border/40 my-1" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-bold text-[9px] tracking-wide uppercase">Entity</span>
                    <span className="text-foreground/90 font-bold">{formEntity || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-bold text-[9px] tracking-wide uppercase">Role</span>
                    <span className="text-foreground/90 font-bold">{formRole || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-bold text-[9px] tracking-wide uppercase">Department</span>
                    <span className="text-foreground/90 font-bold truncate max-w-[130px]">{formDept || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-bold text-[9px] tracking-wide uppercase">Status</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${formStatus === "Active" ? "bg-success" : "bg-muted-foreground/60"}`} />
                      <span className="text-foreground/90 font-bold uppercase text-[10px]">{formStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-border/30">
                <Button
                  type="button"
                  onClick={handleRepresentativeSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9.5 text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Check className="h-4 w-4" /> Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setViewMode("list");
                  }}
                  className="w-full bg-transparent border border-border hover:bg-muted text-muted-foreground hover:text-foreground font-bold h-9.5 text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ArrowLeft className="h-4 w-4" /> Cancel
                </Button>
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
            onClick={() => {
              resetForm();
              setViewMode("add");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/95 px-3 py-2 text-[13px] font-bold text-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.5)] cursor-pointer transition-all"
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
          <div className="flex flex-wrap items-center gap-2 font-bold text-xs">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-foreground/80 hover:bg-muted cursor-pointer"><Filter className="h-3.5 w-3.5" /> All Entities</button>
            <div className="flex overflow-hidden rounded-lg border border-border bg-card">
              <button className="bg-primary/20 px-2.5 py-2 text-accent">All</button>
              <button className="border-l border-border px-2.5 py-2 text-foreground/80 hover:bg-muted"><span className="inline-block h-1.5 w-1.5 rounded-full bg-success mr-1" /> Active</button>
              <button className="border-l border-border px-2.5 py-2 text-foreground/80 hover:bg-muted"><span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60 mr-1" /> Disabled</button>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-foreground/80 hover:bg-muted cursor-pointer"><SlidersHorizontal className="h-3.5 w-3.5" /> Columns</button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-foreground/80 hover:bg-muted cursor-pointer"><Download className="h-3.5 w-3.5" /> Export <span className="rounded-md bg-primary/20 px-1.5 text-accent font-extrabold ml-1">{filteredRows.length}</span></button>
          </div>
        </div>

        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-foreground/[0.03] text-[10px] font-extrabold tracking-wider text-muted-foreground uppercase border-b border-border/60">
                <th className="py-3.5 pl-4 table-sticky-col-1"><input type="checkbox" className="h-3.5 w-3.5 rounded border-foreground/20 bg-foreground/5 cursor-pointer" /></th>
                <th className="py-3.5 pr-4 text-left table-sticky-col-2">Full Name</th>
                <th className="py-3.5 pr-4 text-left">Username</th>
                <th className="py-3.5 pr-4 text-left">Entity</th>
                <th className="py-3.5 pr-4 text-left">Role</th>
                <th className="py-3.5 pr-4 text-left">Email</th>
                <th className="py-3.5 pr-4 text-left">Phone</th>
                <th className="py-3.5 pr-4 text-left">Department</th>
                <th className="py-3.5 pr-4 text-right table-sticky-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-semibold text-muted-foreground">
              {paginatedRows.map((r) => {
                const initials = r.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
                return (
                  <tr key={r.username} className="group transition-colors hover:bg-foreground/[0.015]">
                    <td className="py-3.5 pl-4 table-sticky-col-1"><input type="checkbox" className="h-3.5 w-3.5 rounded border-foreground/20 bg-foreground/5 cursor-pointer" /></td>
                    <td className="py-3.5 pr-4 table-sticky-col-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-soft">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="whitespace-nowrap font-bold text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => { setSelectedRep(r); setViewMode("view"); }}>{r.name}</div>
                          <div className={`text-[10px] font-extrabold ${r.status === "Active" ? "text-emerald-400" : "text-muted-foreground/60"}`}>{r.status}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4 font-mono">{r.username}</td>
                    <td className="py-3.5 pr-4 font-mono font-bold text-foreground/80">{r.entity}</td>
                    <td className="py-3.5 pr-4 text-foreground/80">{r.role}</td>
                    <td className="py-3.5 pr-4">{r.email}</td>
                    <td className="py-3.5 pr-4 font-mono">{r.phone}</td>
                    <td className="py-3.5 pr-4">{r.dept}</td>
                    <td className="py-3.5 pr-4 table-sticky-actions">
                      <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                        <IconBtn label="View" onClick={() => { setSelectedRep(r); setViewMode("view"); }}><Eye className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn label="Edit" onClick={() => handleOpenEdit(r)}><Pencil className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn
                          label="Delete"
                          tone="danger"
                          onClick={() => handleOpenDelete(r)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

      {/* ============================================== */}
      {/* DELETE CONFIRMATION DIALOG MODAL FOR REPS     */}
      {/* ============================================== */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-[440px] border border-red-500/30 bg-card text-foreground p-0 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
          {/* Top red warning border line */}
          <div className="h-1 bg-red-500 w-full" />
          
          <div className="p-6 flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>

            <div className="space-y-2 flex-1">
              <DialogTitle className="text-[15px] font-bold text-foreground leading-normal">
                Delete this record?
              </DialogTitle>
              <p className="text-[12px] text-muted-foreground/80 leading-relaxed font-semibold">
                This record will be permanently deleted.
                <br />
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 p-4 bg-muted/40 dark:bg-[#0E1624] border-t border-border/20">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="h-9 px-4 font-bold text-xs bg-transparent border-border/80 hover:bg-muted dark:hover:bg-[#131C2E] hover:text-foreground cursor-pointer text-muted-foreground rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="h-9 px-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer rounded-lg transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 text-white" /> Delete Record
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function IconBtn({ children, label, tone, onClick }: { children: React.ReactNode; label: string; tone?: "danger"; onClick?: () => void }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-md border border-foreground/10 bg-foreground/[0.03] transition-colors cursor-pointer ${
        tone === "danger"
          ? "text-danger hover:bg-danger/10 hover:border-danger/40"
          : "text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-foreground/[0.06]"
      }`}
    >
      {children}
    </button>
  );
}
