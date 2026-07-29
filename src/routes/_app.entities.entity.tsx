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
  Building2,
  Upload,
  Globe,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  Check,
  ArrowLeft,
  Link as LinkIcon,
  Database,
  Map,
  FileArchive,
  Layers,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  FolderOpen,
  User,
  Users,
  Compass
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
  city?: string;
  country?: string;
  address?: string;
  website?: string;
  integrationRole?: string;
  integrationMethods?: string[];
  parentOrg?: string;
  remarks?: string;
}

const STORAGE_KEY = "dge_entities_data_v4";

const initialRows: EntityItem[] = [
  {
    name: "Abu Dhabi Digital Authority",
    code: "ADDA",
    type: "Semi-Government",
    date: "2026-04-25",
    sectors: ["Digital", "Technology"],
    status: "Active",
    city: "Abu Dhabi",
    country: "UAE",
    address: "Al Maryah Island",
    website: "https://www.adda.gov.ae",
    integrationRole: "Both",
    integrationMethods: ["Database"],
    parentOrg: "Department of Government Enablement",
    remarks: "Coordinates digital transformation across Abu Dhabi government entities."
  },
  {
    name: "Environment Agency Abu Dhabi",
    code: "EAD",
    type: "Government",
    date: "2026-04-25",
    sectors: ["Environment", "Climate"],
    status: "Active",
    city: "Abu Dhabi",
    country: "UAE",
    address: "Al Mamoura Building",
    website: "https://www.ead.gov.ae",
    integrationRole: "Data Provider",
    integrationMethods: ["Database", "ESRI Services"],
    parentOrg: "—",
    remarks: "Protects and manages biodiversity and air quality in the emirate."
  },
  {
    name: "Dept of Government Enablement",
    code: "DGE",
    type: "Semi-Government",
    date: "2026-04-26",
    sectors: ["Government", "Policy"],
    status: "Active",
    city: "Abu Dhabi",
    country: "UAE",
    address: "Al Bateen",
    website: "https://www.dge.gov.ae",
    integrationRole: "Both",
    integrationMethods: ["Database"],
    parentOrg: "—",
    remarks: "Enables public services and operational efficiency in Abu Dhabi govt."
  },
  {
    name: "Abu Dhabi Distribution Company",
    code: "ADDC",
    type: "State-Owned",
    date: "—",
    sectors: ["Utilities", "Power Distribution"],
    status: "Inactive",
    city: "Abu Dhabi",
    country: "UAE",
    address: "Muroor Road",
    website: "https://www.addc.ae",
    integrationRole: "Consumer",
    integrationMethods: [],
    parentOrg: "TAQA",
    remarks: "Power and water distributor across the Abu Dhabi Emirate."
  },
  {
    name: "Abu Dhabi Housing Authority",
    code: "ADHA",
    type: "Government",
    date: "2026-04-25",
    sectors: ["Housing", "Urban Development"],
    status: "Active",
    city: "Abu Dhabi",
    country: "UAE",
    address: "ADHA Head Office",
    website: "https://www.adha.gov.ae",
    integrationRole: "Data Provider",
    integrationMethods: ["Database"],
    parentOrg: "—",
    remarks: "Manages housing programs and loans for UAE nationals."
  },
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
  // View state: 'list' | 'view' | 'edit' | 'add'
  const [viewMode, setViewMode] = useState<"list" | "view" | "edit" | "add">("list");
  const [selectedEntity, setSelectedEntity] = useState<EntityItem | null>(null);
  const [selectedRowCodes, setSelectedRowCodes] = useState<string[]>([]);

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
  const [integrationMethods, setIntegrationMethods] = useState<string[]>(["Database"]);
  const [parentOrg, setParentOrg] = useState("");
  const [remarks, setRemarks] = useState("");
  const [formLogo, setFormLogo] = useState<string | null>(null);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<EntityItem | null>(null);

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
      setIntegrationMethods(["Database"]);
      setParentOrg("Department of Government Enablement");
      setRemarks("Coordinates digital transformation across Abu Dhabi government entities.");
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
      setIntegrationMethods(["Database", "ESRI Services"]);
      setParentOrg("—");
      setRemarks("Protects and manages biodiversity and air quality in the emirate.");
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
      setIntegrationMethods(["Database"]);
      setParentOrg("—");
      setRemarks("Enables public services and operational efficiency in Abu Dhabi govt.");
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
    setIntegrationMethods(["Database"]);
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

    const newEntity: EntityItem = {
      name: formName.trim(),
      code: formCode.trim().toUpperCase(),
      type: formType,
      date: formDate,
      sectors: [...sectors],
      status: formStatus,
      logo: formLogo,
      city: formCity.trim(),
      country: formCountry.trim(),
      address: formAddress.trim(),
      website: formWebsite.trim(),
      integrationRole: integrationRole,
      integrationMethods: [...integrationMethods],
      parentOrg: parentOrg.trim(),
      remarks: remarks.trim()
    };

    if (viewMode === "add") {
      // Check if code already exists
      if (entitiesList.some((ent) => ent.code === newEntity.code)) {
        toast.error(`Entity with code ${newEntity.code} already exists`);
        return;
      }
      const updatedList = [newEntity, ...entitiesList];
      saveEntities(updatedList);
      toast.success(`Entity "${newEntity.name}" onboarded successfully!`);
    } else {
      // Edit mode
      const updatedList = entitiesList.map((ent) =>
        ent.code === selectedEntity?.code ? newEntity : ent
      );
      saveEntities(updatedList);
      toast.success(`Entity "${newEntity.name}" updated successfully!`);
      setSelectedEntity(newEntity);
    }

    resetForm();
    setViewMode("list");
  };

  // Start edit action
  const handleOpenEdit = (entity: EntityItem) => {
    setSelectedEntity(entity);
    setFormName(entity.name);
    setFormCode(entity.code);
    setFormType(entity.type);
    setFormStatus(entity.status || "Active");
    setFormCity(entity.city || "");
    setFormCountry(entity.country || "UAE");
    setFormAddress(entity.address || "");
    setFormWebsite(entity.website || "https://www.entity.gov.ae");
    setSectors(entity.sectors || []);
    setSectorInput("");
    setFormDate(entity.date === "—" ? "2026-04-25" : entity.date);
    setIntegrationRole(entity.integrationRole || "None");
    setIntegrationMethods(entity.integrationMethods || ["Database"]);
    setParentOrg(entity.parentOrg || "");
    setRemarks(entity.remarks || "");
    setFormLogo(entity.logo || null);
    setViewMode("edit");
  };

  // Start delete action
  const handleOpenDelete = (entity: EntityItem) => {
    setEntityToDelete(entity);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (entityToDelete) {
      const updated = entitiesList.filter((ent) => ent.code !== entityToDelete.code);
      saveEntities(updated);
      toast.success(`Entity "${entityToDelete.name}" deleted successfully.`);
      setIsDeleteModalOpen(false);
      setEntityToDelete(null);
      if (selectedEntity?.code === entityToDelete.code) {
        setSelectedEntity(null);
        setViewMode("list");
      }
    }
  };

  const toggleIntegrationMethod = (method: string) => {
    setIntegrationMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  // Integration Options Grid definitions
  const integrationOptions = [
    { id: "Database", label: "Database", icon: Database },
    { id: "ESRI Services", label: "ESRI Services", icon: Map },
    { id: "File Geodatabase (FGDB)", label: "File Geodatabase (FGDB)", icon: FolderOpen },
    { id: "Shapefile (SHP)", label: "Shapefile (SHP)", icon: Layers },
    { id: "Excel", label: "Excel", icon: FileSpreadsheet },
    { id: "CSV", label: "CSV", icon: FileText },
  ];

  // Render 1st Image: View Details screen
  if (viewMode === "view" && selectedEntity) {
    const ent = selectedEntity;
    return (
      <div className="space-y-6">
        {/* Banner header container matching design */}
        <div className="bg-card dark:bg-surface border border-border p-6 rounded-2xl shadow-soft">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary-foreground">
                {ent.logo ? (
                  <img src={ent.logo} className="w-full h-full object-cover rounded-2xl" alt="logo" />
                ) : (
                  <Building2 className="h-8 w-8 text-primary" />
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground leading-none">{ent.name}</h1>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold border ${
                    ent.status === "Inactive"
                      ? "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}>
                    {ent.status || "Active"}
                  </span>
                </div>
                
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-muted/30 border border-border/80 px-2 py-0.5 text-[10.5px] font-bold text-muted-foreground uppercase tracking-wide">
                    {ent.code}
                  </span>
                  <span className="rounded bg-muted/30 border border-border/80 px-2 py-0.5 text-[10.5px] font-bold text-muted-foreground uppercase tracking-wide">
                    {ent.type}
                  </span>
                  {ent.sectors.map((sec) => (
                    <span key={sec} className="rounded bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10.5px] font-bold text-purple-400">
                      {sec}
                    </span>
                  ))}
                </div>

                {/* Substats */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> 0 representatives
                  </span>
                  <span className="text-muted-foreground/45">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Onboarded {ent.date}
                  </span>
                  <span className="text-muted-foreground/45">•</span>
                  <span className="flex items-center gap-1">
                    <Compass className="h-3.5 w-3.5" /> {ent.city || "Abu Dhabi"}, {ent.country || "UAE"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => setViewMode("list")}
                className="h-9 px-4 font-bold text-xs bg-transparent border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <Button
                onClick={() => handleOpenEdit(ent)}
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit Entity
              </Button>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Contact Information */}
          <Surface className="flex flex-col border border-border p-6 shadow-soft" padded={false}>
            <div className="flex items-center gap-2.5 pb-4 border-b border-border/20 mb-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Globe className="h-4 w-4" />
              </span>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground">Contact Information</h3>
            </div>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 py-1 border-b border-border/10">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Address</span>
                <span className="col-span-2 text-foreground font-semibold">{ent.address || "Not provided"}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border/10">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">City</span>
                <span className="col-span-2 text-foreground font-semibold">{ent.city || "Abu Dhabi"}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border/10">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Country</span>
                <span className="col-span-2 text-foreground font-semibold">{ent.country || "UAE"}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border/10">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Website URL</span>
                <span className="col-span-2 text-foreground font-semibold">
                  {ent.website ? (
                    <a href={ent.website} target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold">
                      {ent.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] block mb-1">Representatives</span>
                <p className="text-muted-foreground/80 leading-relaxed font-medium">
                  Contact details are managed under{" "}
                  <span className="text-primary font-bold hover:underline cursor-pointer">Representatives</span>
                </p>
              </div>
            </div>
          </Surface>

          {/* Card 2: Organisation Details */}
          <Surface className="flex flex-col border border-border p-6 shadow-soft" padded={false}>
            <div className="flex items-center gap-2.5 pb-4 border-b border-border/20 mb-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Building2 className="h-4 w-4" />
              </span>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground">Organisation Details</h3>
            </div>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 py-1 border-b border-border/10">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Entity Name</span>
                <span className="col-span-2 text-foreground font-semibold">{ent.name}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border/10">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Entity Code</span>
                <span className="col-span-2 text-foreground font-bold font-mono">{ent.code}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border/10">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Entity Type</span>
                <span className="col-span-2 text-foreground font-semibold">{ent.type}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border/10">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Parent Organisation</span>
                <span className="col-span-2 text-foreground font-semibold">{ent.parentOrg || "Not provided"}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border/10">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Onboarding Date</span>
                <span className="col-span-2 text-foreground font-semibold font-mono">{ent.date}</span>
              </div>
            </div>
          </Surface>

          {/* Card 3: Sectors */}
          <Surface className="flex flex-col border border-border p-6 shadow-soft relative overflow-hidden" padded={false}>
            <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary/15 border border-primary/20 text-accent flex items-center justify-center text-[11px] font-bold">
              {ent.sectors.length}
            </div>
            
            <div className="flex items-center gap-2.5 pb-4 border-b border-border/20 mb-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Compass className="h-4 w-4" />
              </span>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground">Sectors</h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {ent.sectors.map((sec) => (
                <span key={sec} className="rounded-lg bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs font-bold text-accent">
                  {sec}
                </span>
              ))}
            </div>
          </Surface>

          {/* Card 4: Status & Remarks */}
          <Surface className="flex flex-col border border-border p-6 shadow-soft" padded={false}>
            <div className="flex items-center gap-2.5 pb-4 border-b border-border/20 mb-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Check className="h-4 w-4" />
              </span>
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground">Status & Remarks</h3>
            </div>
            <div className="space-y-4 text-xs">
              <div className="w-full bg-blue-500/10 border border-blue-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2 text-blue-400 font-bold text-xs">
                <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                Active
              </div>
              
              <div className="pt-2">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] block mb-1">Remarks</span>
                <p className="text-muted-foreground/80 leading-relaxed font-semibold italic">
                  {ent.remarks || "No remarks recorded"}
                </p>
              </div>

              <div className="pt-3 border-t border-border/20 flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                0 linked representatives
              </div>
            </div>
          </Surface>
        </div>
      </div>
    );
  }

  // Render 2nd Image: Edit Screen View & Onboarding Form View
  if (viewMode === "edit" || viewMode === "add") {
    const isEditing = viewMode === "edit";
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-accent">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {isEditing ? `Edit — ${formName || "Abu Dhabi Digital Authority"}` : "Onboard New Entity"}
              </h1>
              <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                {isEditing ? `@${formCode || "ADDA"}` : "Complete the form to register a new organisation"}
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Form Sections */}
          <div className="lg:col-span-9 space-y-5">
            {!isEditing && (
              /* Quick Fill Banner only for onboarding */
              <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-foreground/90 font-semibold text-[13px]">
                  <Sparkles className="h-4 w-4 text-warning" />
                  Quick fill from default Registry Templates:
                </div>
                <div className="w-full sm:w-[280px]">
                  <Select onValueChange={handleTemplateChange}>
                    <SelectTrigger className="h-9 w-full border-border/60 bg-card text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/45 cursor-pointer">
                      <SelectValue placeholder="Select a registry template..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border font-bold">
                      <SelectItem value="adda" className="cursor-pointer text-xs">Abu Dhabi Digital Authority (ADDA)</SelectItem>
                      <SelectItem value="ead" className="cursor-pointer text-xs">Environment Agency Abu Dhabi (EAD)</SelectItem>
                      <SelectItem value="dge" className="cursor-pointer text-xs">Dept of Government Enablement (DGE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Scrollable Form Sections Area */}
            <div className="space-y-5">
              {/* Section 1: Required Information */}
              <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                <button
                  type="button"
                  onClick={() => toggleSection("required")}
                  className="w-full px-5 py-4 flex items-center justify-between border-b border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-accent border border-primary/30 text-[11px] font-bold">
                      1
                    </span>
                    <div className="text-left">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Required Information</h3>
                      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Fields marked * are mandatory</p>
                    </div>
                  </div>
                  {expandedSections.required ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>

                {expandedSections.required && (
                  <div className="p-6 space-y-5 bg-card text-foreground">
                    {/* Logo Uploader */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">Entity Logo</label>
                      <div className="border border-dashed border-border bg-muted/10 rounded-xl p-4 flex items-center gap-4">
                        <div className="h-16 w-16 shrink-0 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground relative overflow-hidden">
                          {formLogo ? (
                            <img src={formLogo} className="w-full h-full object-cover" alt="logo preview" />
                          ) : (
                            <Building2 className="h-7 w-7 text-muted-foreground" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground font-semibold">No custom logo — default icon will be shown</div>
                          <div className="flex items-center gap-2">
                            <label className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted cursor-pointer font-bold transition-colors">
                              <Upload className="h-3.5 w-3.5" /> Upload Logo
                              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            </label>
                            {formLogo && (
                              <button
                                type="button"
                                onClick={() => setFormLogo(null)}
                                className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-red-500/10 text-red-400 hover:bg-red-500/25 px-2.5 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground/40 font-medium">PNG, JPG, SVG - Cropped to square - 200x200 px output</div>
                        </div>
                      </div>
                    </div>

                    {/* Entity Name & Code */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Entity Name *</label>
                        <Input
                          placeholder="Full organisation name"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="h-10 bg-background border-border text-xs text-foreground placeholder:text-muted-foreground font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Entity Code *</label>
                        <Input
                          placeholder="e.g. ADDA"
                          value={formCode}
                          onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                          disabled={isEditing}
                          className="h-10 bg-background border-border text-xs text-foreground placeholder:text-muted-foreground font-semibold disabled:opacity-50"
                        />
                        <div className="text-[10px] text-muted-foreground/50 font-medium">Letters, numbers & dashes only</div>
                      </div>
                    </div>

                    {/* Entity Type & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Entity Type *</label>
                        <Select value={formType} onValueChange={setFormType}>
                          <SelectTrigger className="h-10 w-full border-border bg-background text-xs text-foreground cursor-pointer font-bold">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border font-semibold">
                            <SelectItem value="Government" className="cursor-pointer text-xs">Government</SelectItem>
                            <SelectItem value="State-Owned" className="cursor-pointer text-xs">State-Owned</SelectItem>
                            <SelectItem value="Private" className="cursor-pointer text-xs">Private</SelectItem>
                            <SelectItem value="Semi-Government" className="cursor-pointer text-xs">Semi-Government</SelectItem>
                            <SelectItem value="Federal" className="cursor-pointer text-xs">Federal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Status *</label>
                        <Select value={formStatus} onValueChange={setFormStatus}>
                          <SelectTrigger className="h-10 w-full border-border bg-background text-xs text-foreground cursor-pointer font-bold">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border font-semibold">
                            <SelectItem value="Active" className="cursor-pointer text-xs">Active</SelectItem>
                            <SelectItem value="Inactive" className="cursor-pointer text-xs">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* City & Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">City *</label>
                        <Input
                          placeholder="e.g. Abu Dhabi"
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          className="h-10 bg-background border-border text-xs text-foreground placeholder:text-muted-foreground font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Country *</label>
                        <Input
                          placeholder="UAE"
                          value={formCountry}
                          onChange={(e) => setFormCountry(e.target.value)}
                          className="h-10 bg-background border-border text-xs text-foreground placeholder:text-muted-foreground font-semibold"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Address</label>
                      <Input
                        placeholder="Street address"
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        className="h-10 bg-background border-border text-xs text-foreground placeholder:text-muted-foreground font-semibold"
                      />
                    </div>

                    {/* Website URL */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Website URL</label>
                      <div className="relative w-full">
                        <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                        <Input
                          placeholder="https://www.entity.gov.ae"
                          value={formWebsite}
                          onChange={(e) => setFormWebsite(e.target.value)}
                          className="h-10 bg-background border-border pl-10 text-xs text-foreground placeholder:text-muted-foreground font-semibold"
                        />
                      </div>
                    </div>

                    {/* Sectors */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Sectors *</label>
                      <div className="min-h-[40px] w-full rounded-lg border border-border bg-background px-3 py-1.5 flex flex-wrap gap-1.5 items-center focus-within:ring-1 focus-within:ring-primary">
                        {sectors.map((s) => (
                          <span key={s} className="flex items-center gap-1 rounded bg-primary/20 text-accent border border-primary/20 px-2 py-0.5 text-xs font-bold">
                            {s}
                            <button type="button" onClick={() => removeSector(s)} className="text-accent hover:text-foreground cursor-pointer transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          placeholder={sectors.length === 0 ? "Type sector and press Enter..." : ""}
                          value={sectorInput}
                          onChange={(e) => setSectorInput(e.target.value)}
                          onKeyDown={handleSectorKeyDown}
                          className="flex-1 bg-transparent border-0 outline-none p-0 text-xs text-foreground placeholder:text-muted-foreground min-w-[120px] focus:ring-0"
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground/60 mt-1 font-semibold">
                        <div>Press Enter or comma to add — max 5</div>
                        <div>{sectors.length} / 5</div>
                      </div>
                    </div>

                    {/* Onboarding Date */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Onboarding Date *</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                        />
                        <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Integration Configuration */}
              <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                <button
                  type="button"
                  onClick={() => toggleSection("integration")}
                  className="w-full px-5 py-4 flex items-center justify-between border-b border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-accent border border-primary/30 text-[11px] font-bold">
                      2
                    </span>
                    <div className="text-left">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Integration Configuration</h3>
                      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Define how this entity participates in the data-sharing ecosystem</p>
                    </div>
                  </div>
                  {expandedSections.integration ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>

                {expandedSections.integration && (
                  <div className="p-6 space-y-5 bg-card text-foreground">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Integration Role *</label>
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
                              className={`flex flex-col text-left p-3.5 rounded-xl border cursor-pointer transition-all ${
                                active
                                  ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
                                  : "border-border bg-background hover:bg-muted"
                              }`}
                            >
                              <span className={`text-xs font-bold ${active ? "text-emerald-400" : "text-foreground"}`}>{role.label}</span>
                              <span className="text-[10px] text-muted-foreground/70 mt-1.5 leading-normal font-semibold">{role.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {(integrationRole === "Data Provider" || integrationRole === "Both") && (
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                              <Check className="h-3 w-3" />
                            </span>
                            <span className="text-xs font-bold text-foreground">As a Data Provider</span>
                          </div>
                          <span className="rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-[9px] font-extrabold uppercase border border-emerald-500/25">
                            {integrationMethods.length} selected
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-semibold">
                          Select all integration methods through which this entity will share data with the platform
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {integrationOptions.map((opt) => {
                            const isSelected = integrationMethods.includes(opt.id);
                            const IconComponent = opt.icon;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleIntegrationMethod(opt.id)}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                                  isSelected
                                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400 font-bold"
                                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                                }`}
                              >
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                                  isSelected ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-muted border-border/80"
                                }`}>
                                  <IconComponent className="h-4.5 w-4.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`text-xs ${isSelected ? "text-foreground font-bold" : "text-muted-foreground font-semibold"}`}>{opt.label}</div>
                                </div>
                                {isSelected && (
                                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-soft shrink-0">
                                    <Check className="h-3 w-3 text-white" />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {integrationRole === "None" && (
                      <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-start gap-2.5 text-muted-foreground text-xs leading-relaxed font-semibold">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-border text-[9px] font-extrabold mt-0.5">✕</span>
                        <div>No integration configured — select a role above to enable integration method setup.</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 3: Additional Information */}
              <div className="rounded-xl border border-border overflow-hidden bg-card/30 shadow-soft">
                <button
                  type="button"
                  onClick={() => toggleSection("additional")}
                  className="w-full px-5 py-4 flex items-center justify-between border-b border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-accent border border-primary/30 text-[11px] font-bold">
                      3
                    </span>
                    <div className="text-left">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Additional Information</h3>
                      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">All optional — parent org, additional notes</p>
                    </div>
                  </div>
                  {expandedSections.additional ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>

                {expandedSections.additional && (
                  <div className="p-6 space-y-4 bg-card text-foreground">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Parent Organisation</label>
                      <Input
                        placeholder="Parent company or group"
                        value={parentOrg}
                        onChange={(e) => setParentOrg(e.target.value)}
                        className="h-10 bg-background border-border text-xs text-foreground placeholder:text-muted-foreground font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 block">Remarks</label>
                      <textarea
                        placeholder="Any additional notes..."
                        rows={4}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Live Preview Panel */}
          <div className="lg:col-span-3 lg:sticky lg:top-6 space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-glow flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Preview</span>
                <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-extrabold text-accent tracking-wider leading-none">PREVIEW</span>
              </div>

              {/* Preview Card */}
              <div className="relative overflow-hidden flex flex-col gap-4 w-full pt-2 text-xs">
                <div className="absolute top-2 right-2 rounded-full bg-muted/65 px-2 py-0.5 text-[9px] font-extrabold text-muted-foreground border border-border uppercase">
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
                    <h4 className="text-xs font-bold text-foreground truncate">{formName || "Entity name..."}</h4>
                    <p className="font-mono text-[10px] font-bold text-muted-foreground tracking-wide uppercase mt-0.5">{formCode || "CODE"}</p>
                  </div>
                </div>

                <div className="border-t border-border/40 my-1" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-bold text-[9px] tracking-wide uppercase">Type</span>
                    <span className="text-foreground/90 font-bold">{formType || "Government"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-bold text-[9px] tracking-wide uppercase">Status</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${formStatus === "Active" ? "bg-blue-500" : "bg-muted-foreground/60"}`} />
                      <span className="text-foreground/90 font-bold text-[11px]">{formStatus}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-bold text-[9px] tracking-wide uppercase">City</span>
                    <span className="text-foreground/90 font-bold truncate max-w-[150px]">{formCity || "—"}</span>
                  </div>
                  {(integrationRole === "Data Provider" || integrationRole === "Both") && integrationMethods.length > 0 && (
                    <div className="pt-1.5 border-t border-border/30">
                      <span className="text-muted-foreground font-bold text-[9px] tracking-wide uppercase block mb-1">Provides via</span>
                      <div className="flex flex-wrap gap-1">
                        {integrationMethods.map((m) => (
                          <span key={m} className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {sectors.length > 0 && (
                    <div className="pt-1.5 border-t border-border/30">
                      <span className="text-muted-foreground font-bold text-[9px] tracking-wide uppercase block mb-1">Sectors</span>
                      <div className="flex flex-wrap gap-1">
                        {sectors.map((s) => (
                          <span key={s} className="rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-border/30">
                <Button
                  type="button"
                  onClick={handleOnboardSubmit}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-9.5 text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-glow"
                >
                  <Check className="h-4 w-4" /> {isEditing ? "Save Changes" : "Onboard Entity"}
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
        title="Entity"
        description="Entity onboarding and management"
        actions={
          <button
            onClick={() => {
              resetForm();
              setViewMode("add");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/95 px-3 py-2 text-[13px] font-bold text-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.5)] cursor-pointer transition-all"
          >
            <Plus className="h-3.5 w-3.5" /> Add Entity
          </button>
        }
      />
      <Surface padded={false}>
        {selectedRowCodes.length > 0 && (
          <div className="mx-4 mt-4 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 py-2 px-4 rounded-lg flex items-center justify-between text-xs font-bold border border-blue-200/50 dark:border-blue-900/30">
            <span>{selectedRowCodes.length} {selectedRowCodes.length === 1 ? "entity" : "entities"} selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const updated = entitiesList.filter((ent) => !selectedRowCodes.includes(ent.code));
                  saveEntities(updated);
                  setSelectedRowCodes([]);
                  toast.success("Selected entities deleted successfully.");
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-soft"
              >
                Delete selected
              </button>
              <button
                onClick={() => setSelectedRowCodes([])}
                className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-soft"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-grow min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, code or sector…"
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/45"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto flex-wrap shrink-0">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 w-auto min-w-[130px] border-border/60 bg-card/50 text-[13px] text-foreground/80 hover:bg-card/85 font-bold cursor-pointer">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border font-bold">
                <SelectItem value="all-types" className="cursor-pointer text-xs">All Types</SelectItem>
                <SelectItem value="Government" className="cursor-pointer text-xs">Government</SelectItem>
                <SelectItem value="State-Owned" className="cursor-pointer text-xs">State-Owned</SelectItem>
                <SelectItem value="Private" className="cursor-pointer text-xs">Private</SelectItem>
                <SelectItem value="Semi-Government" className="cursor-pointer text-xs">Semi-Government</SelectItem>
                <SelectItem value="Federal" className="cursor-pointer text-xs">Federal</SelectItem>
              </SelectContent>
            </Select>

            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 text-[13px] text-foreground/80 hover:border-accent/40 cursor-pointer font-bold">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Columns
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 text-[13px] text-foreground/80 hover:border-accent/40 cursor-pointer font-bold">
              <Download className="h-3.5 w-3.5" /> Export{" "}
              <span className="rounded-md bg-primary/20 px-1.5 text-[11px] text-accent font-extrabold">{filteredRows.length}</span>
            </button>
          </div>
        </div>

        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-foreground/[0.03] text-[10px] font-extrabold tracking-wider text-muted-foreground uppercase border-b border-border/60">
                <th className="py-3.5 pl-4 text-left table-sticky-col-1">
                  <input
                    type="checkbox"
                    checked={paginatedRows.length > 0 && paginatedRows.every((r) => selectedRowCodes.includes(r.code))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newSelected = [...selectedRowCodes];
                        paginatedRows.forEach((r) => {
                          if (!newSelected.includes(r.code)) newSelected.push(r.code);
                        });
                        setSelectedRowCodes(newSelected);
                      } else {
                        const pageCodes = paginatedRows.map((r) => r.code);
                        setSelectedRowCodes((prev) => prev.filter((code) => !pageCodes.includes(code)));
                      }
                    }}
                    className="h-3.5 w-3.5 rounded border-foreground/20 bg-foreground/5 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 pr-4 text-left table-sticky-col-2">Entity Name</th>
                <th className="py-3.5 pr-4 text-left">Entity Code</th>
                <th className="py-3.5 pr-4 text-left">Entity Type</th>
                <th className="py-3.5 pr-4 text-left">Onboarding Date</th>
                <th className="py-3.5 pr-4 text-left">Sector</th>
                <th className="py-3.5 pr-4 text-right table-sticky-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {paginatedRows.map((r) => (
                <tr key={r.code} className={`group transition-colors hover:bg-foreground/[0.015] ${selectedRowCodes.includes(r.code) ? "bg-slate-500/5 dark:bg-slate-500/10" : ""}`}>
                  <td className="py-3.5 pl-4 table-sticky-col-1">
                    <input
                      type="checkbox"
                      checked={selectedRowCodes.includes(r.code)}
                      onChange={() => {
                        setSelectedRowCodes((prev) =>
                          prev.includes(r.code) ? prev.filter((c) => c !== r.code) : [...prev, r.code]
                        );
                      }}
                      className="h-3.5 w-3.5 rounded border-foreground/20 bg-foreground/5 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 pr-4 table-sticky-col-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded overflow-hidden shrink-0 bg-primary/5 flex items-center justify-center border border-border">
                        {r.logo ? (
                          <img src={r.logo} className="w-full h-full object-cover" alt="logo" />
                        ) : (
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className="whitespace-nowrap font-bold text-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => { setSelectedEntity(r); setViewMode("view"); }}>
                        {r.name}
                      </span>
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${r.status === "Inactive" ? "bg-muted-foreground/60" : "bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.6)]"}`} />
                    </div>
                  </td>

                  <td className="py-3.5 pr-4 font-mono font-bold text-foreground/90">
                    {r.code}
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-muted-foreground">
                    {r.type}
                  </td>
                  <td className="py-3.5 pr-4 font-mono font-semibold text-muted-foreground/80">{r.date}</td>
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {r.sectors.map((s) => (
                        <span key={s} className="rounded bg-muted/65 border border-border/80 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 table-sticky-actions">
                    <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                      <IconBtn label="View" onClick={() => { setSelectedEntity(r); setViewMode("view"); }}><Eye className="h-3.5 w-3.5" /></IconBtn>
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

      {/* ============================================== */}
      {/* 3rd IMAGE: DELETE CONFIRMATION DIALOG MODAL    */}
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
