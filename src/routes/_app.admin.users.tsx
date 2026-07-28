import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Lock,
  ChevronDown,
  X,
  User,
  Shield,
  Clock,
  Key,
  Check,
  Trash,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/_app/admin/users")({
  head: () => ({
    meta: [
      { title: "Access Control — Data Automation Studio" },
      { name: "description", content: "Manage users and the roles & permissions that govern their access." },
    ],
  }),
  component: AccessControl,
});

interface UserItem {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  identitySource: string;
  status: string;
  lastLogin: string;
  protected?: boolean;
}

interface PermissionRow {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  all: boolean;
}

const defaultRolesData: Record<
  string,
  {
    description: string;
    userCount: number;
    isSystem: boolean;
    permissions: PermissionRow[];
  }
> = {
  "Super Admin": {
    description: "Full access to all modules and settings",
    userCount: 1,
    isSystem: true,
    permissions: [
      { module: "Entities", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Representatives", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Data Sources", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Data Layers", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Jobs", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Workflows", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Schedules", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Metadata", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Insights", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Data Quality", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Tools", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Data Themes", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Schema", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Admin", view: true, create: true, edit: true, delete: true, export: true, all: true },
    ],
  },
  "GIS Manager": {
    description: "Full access to GIS data modules; read-only Admin",
    userCount: 0,
    isSystem: true,
    permissions: [
      { module: "Entities", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Representatives", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Data Sources", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Data Layers", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Jobs", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Workflows", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Schedules", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Metadata", view: true, create: true, edit: true, delete: false, export: true, all: false },
      { module: "Insights", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Data Quality", view: true, create: true, edit: true, delete: false, export: true, all: false },
      { module: "Tools", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Data Themes", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Schema", view: true, create: true, edit: true, delete: false, export: true, all: false },
      { module: "Admin", view: true, create: false, edit: false, delete: false, export: false, all: false },
    ],
  },
  "Data Officer": {
    description: "Manage data modules; no Admin / Schedules",
    userCount: 0,
    isSystem: false,
    permissions: [
      { module: "Entities", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Representatives", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Data Sources", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Data Layers", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Jobs", view: true, create: true, edit: true, delete: false, export: true, all: false },
      { module: "Workflows", view: true, create: true, edit: true, delete: false, export: true, all: false },
      { module: "Schedules", view: false, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Metadata", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Insights", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Data Quality", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Tools", view: true, create: true, edit: true, delete: false, export: true, all: false },
      { module: "Data Themes", view: true, create: true, edit: true, delete: false, export: true, all: false },
      { module: "Schema", view: true, create: true, edit: true, delete: true, export: true, all: true },
      { module: "Admin", view: false, create: false, edit: false, delete: false, export: false, all: false },
    ],
  },
  "Analyst": {
    description: "Read-only insights, metadata, quality, layers, schema",
    userCount: 0,
    isSystem: false,
    permissions: [
      { module: "Entities", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Representatives", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Data Sources", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Data Layers", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Jobs", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Workflows", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Schedules", view: false, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Metadata", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Insights", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Data Quality", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Tools", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Data Themes", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Schema", view: true, create: false, edit: false, delete: false, export: true, all: false },
      { module: "Admin", view: false, create: false, edit: false, delete: false, export: false, all: false },
    ],
  },
  "Viewer": {
    description: "Read-only access to all non-admin modules",
    userCount: 0,
    isSystem: false,
    permissions: [
      { module: "Entities", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Representatives", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Data Sources", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Data Layers", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Jobs", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Workflows", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Schedules", view: false, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Metadata", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Insights", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Data Quality", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Tools", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Data Themes", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Schema", view: true, create: false, edit: false, delete: false, export: false, all: false },
      { module: "Admin", view: false, create: false, edit: false, delete: false, export: false, all: false },
    ],
  },
};

const STORAGE_KEY_USERS = "dge_access_control_users_data_v3";

const defaultUsers: UserItem[] = [
  {
    id: "1",
    name: "Faisal Al-Ketbi",
    username: "DGEPortalAdmin",
    email: "faisal.alketbi@dge.gov.ae",
    role: "Super Admin",
    identitySource: "Built-in",
    status: "Active",
    lastLogin: "2026-07-28 05:49",
    protected: true,
  },
];

function AccessControl() {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");
  const [selectedRole, setSelectedRole] = useState<string>("Super Admin");

  const [rolesMap, setRolesMap] = useState<Record<string, typeof defaultRolesData[string]>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dge_access_control_roles_data_v3");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved roles:", e);
        }
      }
    }
    return defaultRolesData;
  });

  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleBase, setNewRoleBase] = useState("none");
  const [newRoleDescription, setNewRoleDescription] = useState("");

  const handlePermissionChange = (
    roleName: string,
    moduleName: string,
    field: keyof Omit<PermissionRow, "module">,
    value: boolean
  ) => {
    if (rolesMap[roleName].isSystem) return;

    const updatedRoles = { ...rolesMap };
    const permissions = [...updatedRoles[roleName].permissions];
    const index = permissions.findIndex((p) => p.module === moduleName);
    if (index !== -1) {
      permissions[index] = {
        ...permissions[index],
        [field]: value,
      };
      if (field === "all" && value) {
        permissions[index].view = true;
        permissions[index].create = true;
        permissions[index].edit = true;
        permissions[index].delete = true;
        permissions[index].export = true;
      }
      if (field === "all" && !value) {
        permissions[index].view = false;
        permissions[index].create = false;
        permissions[index].edit = false;
        permissions[index].delete = false;
        permissions[index].export = false;
      }
      if (field !== "all" && !value) {
        permissions[index].all = false;
      }
      if (field !== "all" && value) {
        const { view, create, edit, delete: del, export: exp } = permissions[index];
        if (view && create && edit && del && exp) {
          permissions[index].all = true;
        }
      }
      updatedRoles[roleName] = {
        ...updatedRoles[roleName],
        permissions,
      };
      setRolesMap(updatedRoles);
      localStorage.setItem("dge_access_control_roles_data_v3", JSON.stringify(updatedRoles));
    }
  };

  const handleSaveRole = (roleName: string) => {
    toast.success(`Permissions for role "${roleName}" saved successfully`);
  };

  const handleDeleteRole = (roleName: string) => {
    if (rolesMap[roleName].isSystem) return;
    const updatedRoles = { ...rolesMap };
    delete updatedRoles[roleName];
    setRolesMap(updatedRoles);
    localStorage.setItem("dge_access_control_roles_data_v3", JSON.stringify(updatedRoles));
    setSelectedRole("Super Admin");
    toast.success(`Role "${roleName}" deleted successfully`);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      toast.error("Role name is required");
      return;
    }
    if (rolesMap[newRoleName]) {
      toast.error("A role with this name already exists");
      return;
    }

    let basePermissions: PermissionRow[] = [];
    if (newRoleBase === "none") {
      basePermissions = [
        { module: "Entities", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Representatives", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Data Sources", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Data Layers", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Jobs", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Workflows", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Schedules", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Metadata", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Insights", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Data Quality", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Tools", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Data Themes", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Schema", view: false, create: false, edit: false, delete: false, export: false, all: false },
        { module: "Admin", view: false, create: false, edit: false, delete: false, export: false, all: false },
      ];
    } else {
      basePermissions = rolesMap[newRoleBase].permissions.map((p) => ({ ...p }));
    }

    const updatedRoles = {
      ...rolesMap,
      [newRoleName]: {
        description: newRoleDescription || "Custom user-defined role",
        userCount: 0,
        isSystem: false,
        permissions: basePermissions,
      },
    };

    setRolesMap(updatedRoles);
    localStorage.setItem("dge_access_control_roles_data_v3", JSON.stringify(updatedRoles));
    setSelectedRole(newRoleName);
    setIsNewRoleModalOpen(false);
    setNewRoleName("");
    setNewRoleBase("none");
    setNewRoleDescription("");
    toast.success(`Role "${newRoleName}" created successfully`);
  };

  const [usersList, setUsersList] = useState<UserItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved users:", e);
        }
      }
    }
    return defaultUsers;
  });

  const saveUsers = (newList: UserItem[]) => {
    setUsersList(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(newList));
    }
  };

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form Fields State
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("Viewer");
  const [formIdentitySource, setFormIdentitySource] = useState("Built-in");
  const [formPassword, setFormPassword] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(true);

  // New Details & Edit User Modal States
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editChangePassword, setEditChangePassword] = useState(false);
  const [editPasswordValue, setEditPasswordValue] = useState("");

  const handleOpenEditUserModal = (user: UserItem) => {
    setEditingUser(user);
    const names = user.name.split(" ");
    setEditFirstName(names[0] || "");
    setEditLastName(names.slice(1).join(" ") || "");
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status.toLowerCase());
    setEditChangePassword(false);
    setEditPasswordValue("");
  };

  const handleSaveUserChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editEmail.trim() || !editFirstName.trim()) {
      toast.error("Required fields cannot be empty");
      return;
    }
    const updated = usersList.map((u) => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: `${editFirstName} ${editLastName}`.trim(),
          email: editEmail,
          role: editRole,
          status: editStatus === "active" ? "Active" : "Inactive",
        };
      }
      return u;
    });
    saveUsers(updated);
    setEditingUser(null);
    toast.success(`Changes to @${editingUser.username} saved successfully.`);
  };

  // Filtered rows
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchesSearch =
        searchQuery === "" ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" || u.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersList, searchQuery, roleFilter, statusFilter]);

  // Form Validation
  const hasMinLength = formPassword.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(formPassword);
  const hasNumber = /[0-9]/.test(formPassword);
  const notLastThree = true; // Default true mock rule

  const isFormValid = useMemo(() => {
    return (
      formFirstName.trim() !== "" &&
      formUsername.trim() !== "" &&
      formEmail.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail) &&
      hasMinLength &&
      hasLetter &&
      hasNumber
    );
  }, [formFirstName, formUsername, formEmail, hasMinLength, hasLetter, hasNumber]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill in all required fields and fulfill password requirements.");
      return;
    }

    const newUser: UserItem = {
      id: crypto.randomUUID(),
      name: `${formFirstName} ${formLastName}`.trim(),
      username: formUsername,
      email: formEmail,
      role: formRole,
      identitySource: formIdentitySource,
      status: "Active",
      lastLogin: "Never logged in",
    };

    const updated = [...usersList, newUser];
    saveUsers(updated);
    toast.success(`User @${formUsername} created successfully.`);

    // Reset Form & Close
    setFormFirstName("");
    setFormLastName("");
    setFormUsername("");
    setFormEmail("");
    setFormRole("Viewer");
    setFormIdentitySource("Built-in");
    setFormPassword("");
    setMustChangePassword(true);
    setIsAddModalOpen(false);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-linear-to-r from-purple-500/20 to-pink-500/20 text-pink-400 border border-pink-500/35 shadow-sm";
      case "GIS Manager":
        return "bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/35 shadow-sm";
      case "Data Officer":
        return "bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/35 shadow-sm";
      case "Analyst":
        return "bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-orange-500/35 shadow-sm";
      default:
        return "bg-slate-500/15 text-slate-400 border border-slate-500/25";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-2 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Access Control"
          description="Manage users and the roles & permissions that govern their access"
          className="mb-0!"
        />
      </div>

      {/* Tabs list matching 2nd image */}
      <div className="flex gap-6 border-b border-border/30 pb-0 mb-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" /> Users
          </span>
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "roles"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" /> Roles
          </span>
        </button>
      </div>

      {activeTab === "users" ? (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative w-full max-w-xs sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* All Roles select */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="GIS Manager">GIS Manager</SelectItem>
                  <SelectItem value="Data Officer">Data Officer</SelectItem>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>

              {/* All Statuses select */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm text-muted-foreground">
                {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
              </span>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="h-9 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5 font-semibold"
              >
                <Plus className="h-4 w-4" /> Add User
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <Surface className="!p-0 overflow-hidden">
            <div className="w-full overflow-x-auto relative">
              <Table>
                <TableHeader>
                  <TableRow className="bg-foreground/[0.01] whitespace-nowrap">
                    <TableHead className="px-5 font-semibold text-muted-foreground">Name</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Username</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Email</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Role</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Identity Source</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Last Login</TableHead>
                    <TableHead className="sticky right-0 bg-card z-20 px-5 font-semibold text-muted-foreground text-right border-l border-border/30 shadow-[-4px_0_12px_rgba(0,0,0,0.15)]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-foreground/[0.01] whitespace-nowrap">
                        <TableCell className="px-5 font-semibold text-foreground">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">{user.username}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${getRoleBadgeClass(user.role)}`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.identitySource}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            user.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                              : "bg-slate-500/15 text-slate-400 border-slate-500/30"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-mono">{user.lastLogin}</TableCell>
                        <TableCell className="sticky right-0 bg-card z-10 px-5 text-right border-l border-border/30 shadow-[-4px_0_12px_rgba(0,0,0,0.15)]">
                          <div className="flex items-center justify-end gap-2 text-muted-foreground">
                            <button
                              onClick={() => setViewingUser(user)}
                              className="hover:text-foreground transition-colors p-1 cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditUserModal(user)}
                              className="hover:text-foreground transition-colors p-1 cursor-pointer"
                              title="Edit User"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            {user.protected && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 bg-foreground/[0.03] px-2 py-0.5 rounded border border-border/40 font-semibold font-mono">
                                <Lock className="h-3 w-3" /> protected
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Surface>
        </div>
      ) : (
        /* Roles Tab View matching the 3rd image */
        <div className="space-y-4">
          {/* Action Bar inside Roles tab */}
          <div className="flex justify-end">
            <Button
              onClick={() => setIsNewRoleModalOpen(true)}
              className="h-9 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1.5 font-semibold"
            >
              <Plus className="h-4 w-4" /> New Role
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
            {/* Left Column: Roles list */}
            <Surface className="p-4 flex flex-col justify-start space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-sm font-bold text-foreground">Roles</span>
                <span className="text-xs bg-foreground/[0.04] border border-border px-2 py-0.5 rounded-full text-muted-foreground font-semibold">
                  {Object.keys(rolesMap).length}
                </span>
              </div>
              <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1">
                {Object.keys(rolesMap).map((roleName) => {
                  const role = rolesMap[roleName];
                  const isSelected = selectedRole === roleName;
                  return (
                    <button
                      key={roleName}
                      onClick={() => setSelectedRole(roleName)}
                      className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-accent/40 bg-accent/5"
                          : "border-border/45 bg-foreground/[0.01] hover:bg-foreground/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                          isSelected
                            ? "bg-accent/15 border-accent/25 text-accent"
                            : "bg-foreground/[0.03] border-border text-muted-foreground"
                        }`}>
                          <Shield className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{roleName}</div>
                          <div className="text-[11px] text-muted-foreground/80 line-clamp-1 max-w-[200px]">
                            {role.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground/80 font-semibold font-mono">
                        <User className="h-3 w-3" /> {role.userCount}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Surface>

            {/* Right Column: Selected Role details & permissions table */}
            <Surface className="p-5 flex flex-col justify-start">
              {(() => {
                const roleInfo = rolesMap[selectedRole];
                if (!roleInfo) return <div className="text-center py-12 text-muted-foreground">Select a role to manage details</div>;
                return (
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/40 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-foreground">{selectedRole}</h3>
                          {roleInfo.isSystem && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/35">
                              System
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{roleInfo.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-muted-foreground font-semibold bg-foreground/[0.02] border border-border/40 rounded px-2.5 py-1.5 flex items-center gap-1 font-mono">
                          <User className="h-3.5 w-3.5" /> {roleInfo.userCount} users assigned
                        </div>
                        {!roleInfo.isSystem && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveRole(selectedRole)}
                              className="h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-1 font-semibold text-xs"
                            >
                              <Check className="h-3.5 w-3.5" /> Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteRole(selectedRole)}
                              className="h-8 px-3 border-red-500/35 text-red-400 hover:bg-red-500/10 flex items-center gap-1 font-semibold text-xs"
                            >
                              <Trash className="h-3.5 w-3.5" /> Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notice */}
                    {roleInfo.isSystem && (
                      <div className="text-xs text-muted-foreground bg-foreground/[0.01] border border-border/30 rounded-lg p-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground/75" />
                        <span>System roles are read-only.</span>
                      </div>
                    )}

                    {/* Module Permissions Table */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Module Permissions
                      </h4>
                      <div className="w-full overflow-x-auto rounded-xl border border-border/40">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-foreground/[0.01] whitespace-nowrap">
                              <TableHead className="px-4 font-semibold text-muted-foreground">Module</TableHead>
                              <TableHead className="font-semibold text-muted-foreground text-center">View</TableHead>
                              <TableHead className="font-semibold text-muted-foreground text-center">Create</TableHead>
                              <TableHead className="font-semibold text-muted-foreground text-center">Edit</TableHead>
                              <TableHead className="font-semibold text-muted-foreground text-center">Delete</TableHead>
                              <TableHead className="font-semibold text-muted-foreground text-center">Export</TableHead>
                              <TableHead className="px-4 font-semibold text-muted-foreground text-center">All</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {roleInfo.permissions.map((row) => (
                              <TableRow key={row.module} className="hover:bg-foreground/[0.01] whitespace-nowrap">
                                <TableCell className="px-4 font-semibold text-foreground">{row.module}</TableCell>
                                <TableCell className="text-center">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={row.view}
                                      disabled={roleInfo.isSystem}
                                      onCheckedChange={(val) => handlePermissionChange(selectedRole, row.module, "view", !!val)}
                                      className={`opacity-75 disabled:opacity-75 ${!roleInfo.isSystem ? "cursor-pointer" : "cursor-not-allowed"}`}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={row.create}
                                      disabled={roleInfo.isSystem}
                                      onCheckedChange={(val) => handlePermissionChange(selectedRole, row.module, "create", !!val)}
                                      className={`opacity-75 disabled:opacity-75 ${!roleInfo.isSystem ? "cursor-pointer" : "cursor-not-allowed"}`}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={row.edit}
                                      disabled={roleInfo.isSystem}
                                      onCheckedChange={(val) => handlePermissionChange(selectedRole, row.module, "edit", !!val)}
                                      className={`opacity-75 disabled:opacity-75 ${!roleInfo.isSystem ? "cursor-pointer" : "cursor-not-allowed"}`}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={row.delete}
                                      disabled={roleInfo.isSystem}
                                      onCheckedChange={(val) => handlePermissionChange(selectedRole, row.module, "delete", !!val)}
                                      className={`opacity-75 disabled:opacity-75 ${!roleInfo.isSystem ? "cursor-pointer" : "cursor-not-allowed"}`}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={row.export}
                                      disabled={roleInfo.isSystem}
                                      onCheckedChange={(val) => handlePermissionChange(selectedRole, row.module, "export", !!val)}
                                      className={`opacity-75 disabled:opacity-75 ${!roleInfo.isSystem ? "cursor-pointer" : "cursor-not-allowed"}`}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="px-4 text-center">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={row.all}
                                      disabled={roleInfo.isSystem}
                                      onCheckedChange={(val) => handlePermissionChange(selectedRole, row.module, "all", !!val)}
                                      className={`opacity-75 disabled:opacity-75 ${!roleInfo.isSystem ? "cursor-pointer" : "cursor-not-allowed"}`}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Surface>
          </div>
        </div>
      )}

      {/* Create New User Modal Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-[480px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center justify-between">
              Create New User
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4 mt-2">
            {/* Row 1: First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">First Name</label>
                <Input
                  placeholder="John"
                  value={formFirstName}
                  onChange={(e) => setFormFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Last Name</label>
                <Input
                  placeholder="Smith"
                  value={formLastName}
                  onChange={(e) => setFormLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Row 2: Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="j.smith"
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                required
              />
            </div>

            {/* Row 3: Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="j.smith@enterprise.io"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
              />
            </div>

            {/* Row 4: Role & Identity Source */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Role</label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Viewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="GIS Manager">GIS Manager</SelectItem>
                    <SelectItem value="Data Officer">Data Officer</SelectItem>
                    <SelectItem value="Analyst">Analyst</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Identity Source</label>
                <Select value={formIdentitySource} onValueChange={setFormIdentitySource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Built-in" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Built-in">Built-in</SelectItem>
                    <SelectItem value="LDAP">LDAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 5: Initial Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Initial Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Initial password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                required
              />
              {/* Password checklist */}
              <div className="space-y-1 mt-2 p-3 bg-foreground/[0.02] border border-border/40 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${hasMinLength ? "bg-emerald-500" : "bg-slate-500"}`} />
                  <span className={hasMinLength ? "text-emerald-500 font-semibold" : "text-muted-foreground"}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${hasLetter ? "bg-emerald-500" : "bg-slate-500"}`} />
                  <span className={hasLetter ? "text-emerald-500 font-semibold" : "text-muted-foreground"}>
                    A letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${hasNumber ? "bg-emerald-500" : "bg-slate-500"}`} />
                  <span className={hasNumber ? "text-emerald-500 font-semibold" : "text-muted-foreground"}>
                    A number
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-500 font-semibold">
                    Not one of your last 3 passwords
                  </span>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center space-x-2 pt-1.5">
              <Checkbox
                id="changePass"
                checked={mustChangePassword}
                onCheckedChange={(checked) => setMustChangePassword(!!checked)}
              />
              <label
                htmlFor="changePass"
                className="text-xs font-semibold text-foreground/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
              >
                The user must change this password on first login.
              </label>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 font-semibold"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold"
              >
                Create User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Role Popup Dialog (5th image) */}
      <Dialog open={isNewRoleModalOpen} onOpenChange={setIsNewRoleModalOpen}>
        <DialogContent className="max-w-[480px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center justify-between">
              New role
            </DialogTitle>
          </DialogHeader>

          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Base the new role on an existing one to copy its permissions, or leave it read-only and set the matrix after creating.
          </p>

          <form onSubmit={handleCreateRole} className="space-y-4.5 mt-4">
            {/* Field 1: Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-0.5">
                Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="e.g. Regional Editor"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                required
                className="h-9.5"
              />
            </div>

            {/* Field 2: Base Permissions */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Base permissions on <span className="text-muted-foreground/60">(optional)</span>
              </label>
              <Select value={newRoleBase} onValueChange={setNewRoleBase}>
                <SelectTrigger className="h-9.5">
                  <SelectValue placeholder="Start read-only (no base role)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Start read-only (no base role)</SelectItem>
                  {Object.keys(rolesMap).map((roleName) => (
                    <SelectItem key={roleName} value={roleName}>
                      Copy from: {roleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground/80 leading-relaxed mt-1">
                Copies the selected role's full module/action matrix into the new role — then adjust as needed.
              </p>
            </div>

            {/* Field 3: Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Description
              </label>
              <textarea
                placeholder="What this role is for..."
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[90px] resize-none"
              />
            </div>

            {/* Actions Footer */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 font-semibold text-xs"
                onClick={() => setIsNewRoleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs"
              >
                Create role
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Details Modal Dialog (2nd Image) */}
      <Dialog open={!!viewingUser} onOpenChange={(open) => !open && setViewingUser(null)}>
        <DialogContent className="max-w-[440px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              User Details
            </DialogTitle>
          </DialogHeader>

          {viewingUser && (
            <div className="space-y-4.5 mt-4">
              <div className="divide-y divide-border/20 text-xs leading-normal">
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-semibold">First Name</span>
                  <span className="text-foreground font-bold">{viewingUser.name.split(" ")[0] || "—"}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-semibold">Last Name</span>
                  <span className="text-foreground font-bold">{viewingUser.name.split(" ").slice(1).join(" ") || "—"}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-semibold">Display Name</span>
                  <span className="text-foreground font-bold">{viewingUser.name}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-semibold">Username</span>
                  <span className="text-foreground font-bold font-mono">{viewingUser.username}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-semibold">Email</span>
                  <span className="text-foreground font-bold font-mono">{viewingUser.email}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-semibold">Role</span>
                  <span className="text-foreground font-bold">{viewingUser.role}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-semibold">Identity Source</span>
                  <span className="text-foreground font-bold">{viewingUser.identitySource}</span>
                </div>
                <div className="flex justify-between py-2.5 items-center">
                  <span className="text-muted-foreground font-semibold">Status</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    viewingUser.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                      : "bg-slate-500/10 text-muted-foreground border-slate-500/25"
                  }`}>
                    <span className={`h-1 w-1 rounded-full ${viewingUser.status === "Active" ? "bg-emerald-400" : "bg-slate-400"}`} />
                    {viewingUser.status}
                  </span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-semibold">Must change password</span>
                  <span className="text-foreground font-bold">No</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-semibold">MFA enabled</span>
                  <span className="text-foreground font-bold">No</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-semibold">Last login</span>
                  <span className="text-foreground font-bold font-mono">{viewingUser.lastLogin}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-muted-foreground font-semibold">Last password change</span>
                  <span className="text-foreground font-bold font-mono">2026-06-27 15:56</span>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 px-4 font-semibold text-xs animate-in"
                  onClick={() => setViewingUser(null)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    handleOpenEditUserModal(viewingUser);
                    setViewingUser(null);
                  }}
                  className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal Dialog (3rd Image) */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="max-w-[460px] border border-border/80 bg-card p-6 shadow-glow backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Edit User <span className="text-muted-foreground/60">· {editingUser?.username}</span>
            </DialogTitle>
          </DialogHeader>

          {editingUser && (
            <form onSubmit={handleSaveUserChanges} className="space-y-4.5 mt-2">
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">First Name</label>
                  <Input
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    required
                    className="h-9.5"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Last Name</label>
                  <Input
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="h-9.5"
                  />
                </div>
              </div>

              {/* Row 2: Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-0.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="h-9.5"
                />
              </div>

              {/* Row 3: Role & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Role</label>
                  <Select
                    value={editRole}
                    onValueChange={setEditRole}
                    disabled={editingUser.protected || editingUser.role === "Super Admin"}
                  >
                    <SelectTrigger className="h-9.5">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="GIS Manager">GIS Manager</SelectItem>
                      <SelectItem value="Data Officer">Data Officer</SelectItem>
                      <SelectItem value="Analyst">Analyst</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Status</label>
                  <Select
                    value={editStatus}
                    onValueChange={setEditStatus}
                    disabled={editingUser.protected || editingUser.role === "Super Admin"}
                  >
                    <SelectTrigger className="h-9.5">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">active</SelectItem>
                      <SelectItem value="inactive">inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Lock Banner if protected or Super Admin */}
              {(editingUser.protected || editingUser.role === "Super Admin") && (
                <div className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 leading-normal font-semibold">
                  Role and status are locked for the {editingUser.username} super-admin.
                </div>
              )}

              {/* Change Password Checkbox & info */}
              <div className="space-y-2.5 p-3 border border-border/30 rounded-xl bg-foreground/[0.01]">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editChangePassword"
                    checked={editChangePassword}
                    onCheckedChange={(checked) => setEditChangePassword(!!checked)}
                  />
                  <label
                    htmlFor="editChangePassword"
                    className="text-xs font-semibold text-foreground/80 leading-none cursor-pointer select-none"
                  >
                    Change password
                  </label>
                </div>
                {editChangePassword && (
                  <div className="space-y-1.5 pt-2">
                    <Input
                      type="password"
                      placeholder="New password"
                      value={editPasswordValue}
                      onChange={(e) => setEditPasswordValue(e.target.value)}
                      className="h-8.5"
                    />
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground/75 leading-relaxed">
                  Identity source: {editingUser.identitySource} (not editable). Last password change: 2026-06-27 15:56.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 px-4 font-semibold text-xs"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

