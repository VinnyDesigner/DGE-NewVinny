import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Download, Filter, Plus, Search, SlidersHorizontal, Pencil, Trash2, Eye, Building2, Upload, Globe, Calendar, ChevronDown, ChevronUp, Sparkles, X, Check, ArrowLeft } from "lucide-react";
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

export const Route = createFileRoute("/_app/entities/entity")({
  head: () => ({
    meta: [
      { title: "Entities — Data Automation Studio" },
      { name: "description", content: "Manage enterprise entities and their onboarding status." },
    ],
  }),
  component: EntitiesPage,
});

interface EntityItem {
  name: string;
  code: string;
  type: string;
  date: string;
  sectors: string[];
  status?: string;
  logo?: string | null;
}

const STORAGE_KEY = "dge_entities_data";

const initialRows: EntityItem[] = [
  { name: "Abu Dhabi Digital Authority", code: "ADDA", type: "Semi-Government", date: "2026-04-25", sectors: ["Digital", "Technology"], status: "Active" },
  { name: "Environment Agency Abu Dhabi", code: "EAD", type: "Government", date: "2026-04-25", sectors: ["Environment", "Climate"], status: "Active" },
  { name: "Dept of Government Enablement", code: "DGE", type: "Semi-Government", date: "2026-04-26", sectors: ["Government", "Policy"], status: "Active" },
  { name: "Abu Dhabi Distribution Company", code: "ADDC", type: "State-Owned", date: "—", sectors: ["Utilities", "Power Distribution"], status: "Inactive" },
  { name: "Abu Dhabi Housing Authority", code: "ADHA", type: "Government", date: "2026-04-25", sectors: ["Housing", "Urban Development"], status: "Active" },
];

function codeTone(c: string) {
  const map: Record<string, string> = {
    ADDA: "bg-warning/15 text-warning ring-warning/25",
    EAD: "bg-warning/15 text-warning ring-warning/25",
    DGE: "bg-warning/15 text-warning ring-warning/25",
    ADDC: "bg-danger/15 text-danger ring-danger/25",
    ADHA: "bg-warning/15 text-warning ring-warning/25",
  };
  return map[c] ?? "bg-primary/15 text-accent ring-primary/25";
}

function EntitiesPage() {
  // Navigation State
  const [isAdding, setIsAdding] = useState(false);

  // Entities List State
  const [entitiesList, setEntitiesList] = useState<EntityItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved entities:", e);
        }
      }
    }
    return initialRows;
  });

  const saveEntities = (newList: EntityItem[]) => {
    setEntitiesList(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    }
  };

  // List Filters & Pagination
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all-types");

  const filteredRows = useMemo(() => {
    return entitiesList.filter((r) => {
      if (typeFilter !== "all-types" && r.type !== typeFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.name.toLowerCase().includes(q) &&
          !r.code.toLowerCase().includes(q) &&
          !r.type.toLowerCase().includes(q) &&
          !r.sectors.some((s) => s.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [query, typeFilter, entitiesList]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, typeFilter]);

  const paginatedRows = useMemo(() => {
    return filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState("Government");
  const [formStatus, setFormStatus] = useState("Active");
  const [formCity, setFormCity] = useState("");
  const [formCountry, setFormCountry] = useState("UAE");
  const [formAddress, setFormAddress] = useState("");
  const [formWebsite, setFormWebsite] = useState("https://www.entity.gov.ae");
  const [sectors, setSectors] = useState<string[]>([]);
  const [sectorInput, setSectorInput] = useState("");
  const [formDate, setFormDate] = useState("2026-07-22");
  const [integrationRole, setIntegrationRole] = useState("None");
  const [parentOrg, setParentOrg] = useState("");
  const [remarks, setRemarks] = useState("");
  const [formLogo, setFormLogo] = useState<string | null>(null);

  // Collapsible Sections state
  const [expandedSections, setExpandedSections] = useState({
    required: true,
    integration: true,
    additional: true,
  });

  const toggleSection = (sec: "required" | "integration" | "additional") => {
    setExpandedSections((prev) => ({
      ...prev,
      [sec]: !prev[sec],
    }));
  };

  // Image Upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Multi-sector tag handlers
  const handleSectorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = sectorInput.trim().replace(/,$/, "");
      if (val) {
        if (sectors.length >= 5) {
          toast.error("Maximum 5 sectors allowed");
          return;
        }
        if (sectors.includes(val)) {
          toast.error("Sector already added");
          return;
        }
        setSectors([...sectors, val]);
        setSectorInput("");
      }
    }
  };

  const removeSector = (tag: string) => {
    setSectors(sectors.filter((s) => s !== tag));
  };

  // Template autofill handler
  const handleTemplateChange = (val: string) => {
    if (val === "adda") {
      setFormName("Abu Dhabi Digital Authority");
      setFormCode("ADDA");
      setFormType("Semi-Government");
      setFormStatus("Active");
      setFormCity("Abu Dhabi");
      setFormCountry("UAE");
      setFormAddress("Al Maryah Island");
      setFormWebsite("https://www.adda.gov.ae");
      setSectors(["Digital", "Technology"]);
      setFormDate("2026-04-25");
      setIntegrationRole("Both");
      toast.success("ADDA template applied");
    } else if (val === "ead") {
      setFormName("Environment Agency Abu Dhabi");
      setFormCode("EAD");
      setFormType("Government");
      setFormStatus("Active");
      setFormCity("Abu Dhabi");
      setFormCountry("UAE");
      setFormAddress("Al Mamoura Building");
      setFormWebsite("https://www.ead.gov.ae");
      setSectors(["Environment", "Climate"]);
      setFormDate("2026-04-25");
      setIntegrationRole("Data Provider");
      toast.success("EAD template applied");
    } else if (val === "dge") {
      setFormName("Dept of Government Enablement");
      setFormCode("DGE");
      setFormType("Semi-Government");
      setFormStatus("Active");
      setFormCity("Abu Dhabi");
      setFormCountry("UAE");
      setFormAddress("Al Bateen");
      setFormWebsite("https://www.dge.gov.ae");
      setSectors(["Government", "Policy"]);
      setFormDate("2026-04-26");
      setIntegrationRole("Both");
      toast.success("DGE template applied");
    }
  };

  // Reset form helper
  const resetForm = () => {
    setFormName("");
    setFormCode("");
    setFormType("Government");
    setFormStatus("Active");
    setFormCity("");
    setFormCountry("UAE");
    setFormAddress("");
    setFormWebsite("https://www.entity.gov.ae");
    setSectors([]);
    setSectorInput("");
    setFormDate("2026-07-22");
    setIntegrationRole("None");
    setParentOrg("");
    setRemarks("");
    setFormLogo(null);
  };

  // Form submission handler
  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.error("Entity Name is required");
      return;
    }
    if (!formCode.trim()) {
      toast.error("Entity Code is required");
      return;
    }
    if (!/^[a-zA-Z0-9-]+$/.test(formCode)) {
      toast.error("Entity Code must contain only letters, numbers, and dashes");
      return;
    }
    if (!formType || formType === "Select type") {
      toast.error("Please select an Entity Type");
      return;
    }
    if (!formCity.trim()) {
      toast.error("City is required");
      return;
    }
    if (!formCountry.trim()) {
      toast.error("Country is required");
      return;
    }
    if (sectors.length === 0) {
      toast.error("Please add at least one sector");
      return;
    }
    if (!formDate) {
      toast.error("Onboarding Date is required");
      return;
    }

    // Success! Create new entity object
    const newEntity: EntityItem = {
      name: formName.trim(),
      code: formCode.trim().toUpperCase(),
      type: formType,
      date: formDate,
      sectors: [...sectors],
      status: formStatus,
      logo: formLogo,
    };

    // Check if code already exists
    if (entitiesList.some((ent) => ent.code === newEntity.code)) {
      toast.error(`Entity with code ${newEntity.code} already exists`);
      return;
    }

    const updatedList = [newEntity, ...entitiesList];
    saveEntities(updatedList);
    toast.success(`Entity "${newEntity.name}" onboarded successfully!`);

    // Reset and return
    resetForm();
    setIsAdding(false);
  };

  // Render Onboarding Form View
  if (isAdding) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-accent">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Onboard New Entity</h1>
              <p className="text-[14px] text-muted-foreground">Complete the form to register a new organisation</p>
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Form Sections */}
          <div className="lg:col-span-9 space-y-5">
            {/* Quick Fill Banner */}
            <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-elevated/45 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-foreground/90 font-semibold text-[14px]">
                <Sparkles className="h-4 w-4 text-warning" />
                Quick fill from default Registry Templates:
              </div>
              <div className="w-full sm:w-[280px]">
                <Select onValueChange={handleTemplateChange}>
                  <SelectTrigger className="h-9 w-full border-border/60 bg-card/80 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/45 cursor-pointer">
                    <SelectValue placeholder="Select a registry template..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60">
                    <SelectItem value="adda" className="cursor-pointer text-[13.5px]">Abu Dhabi Digital Authority (ADDA)</SelectItem>
                    <SelectItem value="ead" className="cursor-pointer text-[13.5px]">Environment Agency Abu Dhabi (EAD)</SelectItem>
                    <SelectItem value="dge" className="cursor-pointer text-[13.5px]">Dept of Government Enablement (DGE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Scrollable Form Sections Area */}
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-3 scrollbar-thin space-y-5">
              {/* Section 1: Required Information */}
              <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
              <button
                onClick={() => toggleSection("required")}
                className="w-full px-5 py-4 flex items-center justify-between border-b border-border/50 bg-elevated/40 hover:bg-elevated/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-accent border border-primary/30 text-xs font-bold">
                    1
                  </span>
                  <div className="text-left">
                    <h3 className="text-[14px] font-semibold text-foreground">Required Information</h3>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5">Fields marked * are mandatory</p>
                  </div>
                </div>
                {expandedSections.required ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {expandedSections.required && (
                <div className="p-6 space-y-5 bg-surface/20">
                  {/* Logo Uploader */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 block">Entity Logo</label>
                    <div className="border border-dashed border-border/70 bg-card/45 rounded-xl p-4 flex items-center gap-4">
                      <div className="h-16 w-16 shrink-0 rounded-lg bg-foreground/[0.03] border border-border/50 flex items-center justify-center text-muted-foreground relative overflow-hidden">
                        {formLogo ? (
                          <img src={formLogo} className="w-full h-full object-cover" alt="logo preview" />
                        ) : (
                          <Building2 className="h-7 w-7" />
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[13px] text-muted-foreground">No custom logo — default icon will be shown</div>
                        <div className="flex items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/65 px-3 py-1.5 text-[13px] text-foreground/80 hover:bg-card/90 cursor-pointer font-medium transition-colors">
                            <Upload className="h-3.5 w-3.5" /> Upload Logo
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                          </label>
                          {formLogo && (
                            <button
                              type="button"
                              onClick={() => setFormLogo(null)}
                              className="inline-flex h-8 items-center justify-center rounded-lg border border-border/60 bg-danger/10 text-danger hover:bg-danger/25 px-2.5 text-[12px] font-medium transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="text-[11px] text-text-muted">PNG, JPG, SVG - Cropped to square - 200x200 px output</div>
                      </div>
                    </div>
                  </div>

                  {/* Entity Name & Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Entity Name *</label>
                      <input
                        type="text"
                        placeholder="Full organisation name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Entity Code *</label>
                      <input
                        type="text"
                        placeholder="e.g. ADDA"
                        value={formCode}
                        onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                        className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                      <div className="text-[11px] text-text-muted">Letters, numbers & dashes only</div>
                    </div>
                  </div>

                  {/* Entity Type & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Entity Type *</label>
                      <Select value={formType} onValueChange={setFormType}>
                        <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/60">
                          <SelectItem value="Select type" disabled className="cursor-pointer text-[13.5px] text-muted-foreground">Select type</SelectItem>
                          <SelectItem value="Government" className="cursor-pointer text-[13.5px]">Government</SelectItem>
                          <SelectItem value="State-Owned" className="cursor-pointer text-[13.5px]">State-Owned</SelectItem>
                          <SelectItem value="Private" className="cursor-pointer text-[13.5px]">Private</SelectItem>
                          <SelectItem value="Semi-Government" className="cursor-pointer text-[13.5px]">Semi-Government</SelectItem>
                          <SelectItem value="Federal" className="cursor-pointer text-[13.5px]">Federal</SelectItem>
                          <SelectItem value="Government_Test" className="cursor-pointer text-[13.5px]">Government_Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Status *</label>
                      <Select value={formStatus} onValueChange={setFormStatus}>
                        <SelectTrigger className="h-9 w-full border-border/60 bg-card/90 dark:bg-card/50 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/60">
                          <SelectItem value="Active" className="cursor-pointer text-[13.5px]">Active</SelectItem>
                          <SelectItem value="Inactive" className="cursor-pointer text-[13.5px]">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* City & Country */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">City *</label>
                      <input
                        type="text"
                        placeholder="e.g. Abu Dhabi"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Country *</label>
                      <input
                        type="text"
                        placeholder="UAE"
                        value={formCountry}
                        onChange={(e) => setFormCountry(e.target.value)}
                        className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Address</label>
                    <input
                      type="text"
                      placeholder="Street address"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>

                  {/* Website URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Website URL</label>
                    <div className="relative w-full">
                      <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                      <input
                        type="text"
                        placeholder="https://www.entity.gov.ae"
                        value={formWebsite}
                        onChange={(e) => setFormWebsite(e.target.value)}
                        className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                    </div>
                  </div>

                  {/* Sectors */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Sectors *</label>
                    <div className="min-h-[38px] w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 py-1.5 flex flex-wrap gap-1.5 items-center focus-within:ring-1 focus-within:ring-primary/40 focus-within:outline-none">
                      {sectors.map((s) => (
                        <span key={s} className="flex items-center gap-1 rounded bg-primary/20 text-accent border border-primary/20 px-2 py-0.5 text-[13px] font-medium">
                          {s}
                          <button type="button" onClick={() => removeSector(s)} className="text-accent hover:text-foreground cursor-pointer transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={sectors.length === 0 ? "Type sector or choose below..." : ""}
                        value={sectorInput}
                        onChange={(e) => setSectorInput(e.target.value)}
                        onKeyDown={handleSectorKeyDown}
                        className="flex-1 bg-transparent border-0 outline-none p-0 text-[13px] text-foreground placeholder:text-muted-foreground min-w-[120px] focus:ring-0 focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-text-muted mt-1">
                      <div>Press Enter or comma to add — max 5</div>
                      <div>{sectors.length} / 5</div>
                    </div>
                  </div>

                  {/* Onboarding Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Onboarding Date *</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                      <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Integration Configuration */}
            <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
              <button
                onClick={() => toggleSection("integration")}
                className="w-full px-5 py-4 flex items-center justify-between border-b border-border/50 bg-elevated/40 hover:bg-elevated/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-accent border border-primary/30 text-xs font-bold">
                    2
                  </span>
                  <div className="text-left">
                    <h3 className="text-[14px] font-semibold text-foreground">Integration Configuration</h3>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5">Define how this entity participates in the data-sharing ecosystem</p>
                  </div>
                </div>
                {expandedSections.integration ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {expandedSections.integration && (
                <div className="p-6 space-y-5 bg-surface/20">
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Integration Role *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {[
                        { id: "None", label: "None", desc: "No integration configured" },
                        { id: "Data Provider", label: "Data Provider", desc: "This entity provides data to the platform" },
                        { id: "Consumer", label: "Consumer", desc: "This entity consumes data from the platform" },
                        { id: "Both", label: "Both", desc: "Provides and consumes data" },
                      ].map((role) => {
                        const active = integrationRole === role.id;
                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setIntegrationRole(role.id)}
                            className={`flex flex-col text-left p-3.5 rounded-lg border cursor-pointer transition-all ${
                              active
                                ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(37,99,235,0.15)] ring-1 ring-primary/30"
                                : "border-border bg-card/50 hover:bg-card/85 dark:bg-card/35 dark:hover:bg-card/60"
                            }`}
                          >
                            <span className={`text-[13.5px] font-bold ${active ? "text-accent" : "text-foreground"}`}>{role.label}</span>
                            <span className="text-[11px] text-muted-foreground mt-1.5 leading-normal">{role.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {integrationRole === "None" && (
                    <div className="rounded-lg border border-border/50 bg-foreground/[0.03] p-3 flex items-start gap-2.5 text-muted-foreground text-[12px] leading-relaxed">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-bold text-muted-foreground/80 mt-0.5">✕</span>
                      <div>No integration configured — select a role above to enable integration method setup.</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 3: Additional Information */}
            <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-soft">
              <button
                onClick={() => toggleSection("additional")}
                className="w-full px-5 py-4 flex items-center justify-between border-b border-border/50 bg-elevated/40 hover:bg-elevated/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-accent border border-primary/30 text-xs font-bold">
                    3
                  </span>
                  <div className="text-left">
                    <h3 className="text-[14px] font-semibold text-foreground">Additional Information</h3>
                    <p className="text-[11.5px] text-muted-foreground mt-0.5">All optional — parent org, additional notes</p>
                  </div>
                </div>
                {expandedSections.additional ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {expandedSections.additional && (
                <div className="p-6 space-y-4 bg-surface/20">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Parent Organisation</label>
                    <input
                      type="text"
                      placeholder="Parent company or group"
                      value={parentOrg}
                      onChange={(e) => setParentOrg(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 px-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/85 block">Remarks</label>
                    <textarea
                      placeholder="Any additional notes..."
                      rows={4}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full rounded-lg border border-border/60 bg-card/90 dark:bg-card/50 p-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Right Side: Live Preview Panel */}
          <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-4">
            <div className="rounded-xl border border-border bg-card/85 dark:bg-card/45 p-4 shadow-glow flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Preview</span>
                <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent tracking-widest">PREVIEW</span>
              </div>

              {/* Preview Card */}
              <div className="rounded-xl border border-border bg-linear-to-b from-elevated to-elevated/30 p-4 relative overflow-hidden shadow-soft flex flex-col gap-4">
                <div className="absolute top-2 right-2 rounded-full bg-foreground/[0.04] px-2 py-0.5 text-[9px] font-bold text-muted-foreground/80 border border-border/50 uppercase">
                  Entity
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-accent shrink-0 overflow-hidden">
                    {formLogo ? (
                      <img src={formLogo} className="w-full h-full object-cover" alt="logo mini" />
                    ) : (
                      <Building2 className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-foreground truncate">{formName || "Entity name..."}</h4>
                    <p className="font-mono text-[10px] font-bold text-muted-foreground tracking-wide uppercase mt-0.5">{formCode || "CODE"}</p>
                  </div>
                </div>

                <div className="border-t border-border/40 my-1" />

                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold text-[11px] tracking-wide uppercase">Type</span>
                    <span className="text-foreground/90 font-medium">{formType || "Government"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold text-[11px] tracking-wide uppercase">Status</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${formStatus === "Active" ? "bg-success shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-muted-foreground/60"}`} />
                      <span className="text-foreground/90 font-medium lowercase">{formStatus}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold text-[11px] tracking-wide uppercase">City</span>
                    <span className="text-foreground/90 font-medium truncate max-w-[150px]">{formCity || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleOnboardSubmit}
                  className="w-full bg-linear-to-r from-primary to-accent hover:opacity-95 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 shadow-glow cursor-pointer transition-all text-[14px]"
                >
                  <Check className="h-4 w-4" /> Onboard Entity
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
        title="Entity"
        description="Entity onboarding and management"
        actions={
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-b from-primary to-primary/90 px-3 py-2 text-[15px] font-medium text-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Entity
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
              placeholder="Search by name, code or sector…"
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div className="flex-1 min-w-[10px]" />
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 w-auto min-w-[130px] border-border/60 bg-card/50 text-[14px] text-foreground/80 hover:bg-card/85 font-medium cursor-pointer">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                <SelectItem value="all-types" className="cursor-pointer text-[14.5px]">All Types</SelectItem>
                <SelectItem value="Government" className="cursor-pointer text-[14.5px]">Government</SelectItem>
                <SelectItem value="State-Owned" className="cursor-pointer text-[14.5px]">State-Owned</SelectItem>
                <SelectItem value="Private" className="cursor-pointer text-[14.5px]">Private</SelectItem>
                <SelectItem value="Semi-Government" className="cursor-pointer text-[14.5px]">Semi-Government</SelectItem>
                <SelectItem value="Federal" className="cursor-pointer text-[14.5px]">Federal</SelectItem>
                <SelectItem value="Government_Test" className="cursor-pointer text-[14.5px]">Government_Test</SelectItem>
              </SelectContent>
            </Select>

            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 text-[14.0px] text-foreground/80 hover:border-accent/40 cursor-pointer">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Columns
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 text-[14.0px] text-foreground/80 hover:border-accent/40 cursor-pointer">
              <Download className="h-3.5 w-3.5" /> Export{" "}
              <span className="rounded-md bg-primary/20 px-1.5 text-[13.0px] text-accent font-bold">{filteredRows.length}</span>
            </button>
          </div>
        </div>

        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-[16px]">
            <thead>
              <tr className="bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70">
                <th className="py-3 pl-4 text-left table-sticky-col-1"><input type="checkbox" className="h-3.5 w-3.5 rounded border-foreground/20 bg-foreground/5" /></th>
                <th className="py-3 pr-4 text-left table-sticky-col-2">Entity Name</th>
                <th className="py-3 pr-4 text-left">Entity Code</th>
                <th className="py-3 pr-4 text-left">Entity Type</th>
                <th className="py-3 pr-4 text-left">Onboarding Date</th>
                <th className="py-3 pr-4 text-left">Sector</th>
                <th className="py-3 pr-4 text-right table-sticky-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedRows.map((r) => (
                <tr key={r.code} className="group transition-colors hover:bg-foreground/[0.02]">
                  <td className="py-3 pl-4 table-sticky-col-1"><input type="checkbox" className="h-3.5 w-3.5 rounded border-foreground/20 bg-foreground/5" /></td>
                  <td className="py-3 pr-4 table-sticky-col-2">
                    <div className="flex items-center gap-2">
                      {r.logo ? (
                        <div className="h-5 w-5 rounded overflow-hidden shrink-0">
                          <img src={r.logo} className="w-full h-full object-cover" alt="entity logo" />
                        </div>
                      ) : (
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${r.status === "Inactive" ? "bg-muted-foreground/60" : "bg-success shadow-[0_0_8px_rgba(16,185,129,0.6)]"}`} />
                      )}
                      <span className="whitespace-nowrap font-medium text-foreground">{r.name}</span>
                    </div>
                  </td>

                  <td className="py-3 pr-4 font-mono text-[15px] font-semibold text-foreground/90">
                    {r.code}
                  </td>
                  <td className="py-3 pr-4 text-[15px] text-foreground/80">
                    {r.type}
                  </td>
                  <td className="py-3 pr-4 font-mono text-muted-foreground">{r.date}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1.5">
                      {r.sectors.map((s) => (
                        <span key={s} className="rounded-md bg-foreground/5 px-2 py-0.5 text-[15px] text-foreground ring-1 ring-inset ring-foreground/10">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4 table-sticky-actions">
                    <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                      <IconBtn label="View"><Eye className="h-3.5 w-3.5" /></IconBtn>
                      <IconBtn label="Edit"><Pencil className="h-3.5 w-3.5" /></IconBtn>
                      <IconBtn
                        label="Delete"
                        tone="danger"
                        onClick={() => {
                          const updated = entitiesList.filter((ent) => ent.code !== r.code);
                          saveEntities(updated);
                          toast.success(`Entity "${r.name}" deleted successfully.`);
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
          itemNameSingular="entity"
          itemNamePlural="entities"
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

