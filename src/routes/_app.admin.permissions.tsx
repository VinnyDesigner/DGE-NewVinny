import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Lock,
  Shield,
  Database,
  Mail,
  Key,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  Save,
  Trash,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  Edit3,
  Pencil,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/admin/permissions")({
  head: () => ({
    meta: [
      { title: "Security & Authentication — Data Automation Studio" },
      {
        name: "description",
        content:
          "Authentication policies, system security, the identity provider, and SMTP configuration.",
      },
    ],
  }),
  component: SecurityAuthentication,
});

interface SMTPConfigItem {
  id: string;
  name: string;
  host: string;
  port: string;
  user: string;
  sender: string;
  secure: boolean;
  active: boolean;
}

function SecurityAuthentication() {
  const [activeTab, setActiveTab] = useState<
    "auth" | "security" | "identity" | "smtp"
  >("auth");

  // ==========================================
  // TAB 1: Authentication State
  // ==========================================
  const [maxAttempts, setMaxAttempts] = useState("5");
  const [inactivity, setInactivity] = useState("30");
  const [sessionTimeout, setSessionTimeout] = useState("120");
  const [rememberMe, setRememberMe] = useState("30");
  const [minPasswordLength, setMinPasswordLength] = useState("10");
  const [passwordHistory, setPasswordHistory] = useState("3");
  const [reqSpecial, setReqSpecial] = useState("Yes");
  const [reqCase, setReqCase] = useState("Yes");
  const [reqNumbers, setReqNumbers] = useState("Yes");
  const [enforceHttps, setEnforceHttps] = useState(true);
  const [enableSSO, setEnableSSO] = useState(true);

  const handleSaveAuth = () => {
    toast.success("Authentication settings saved successfully");
  };

  const handleResetAuth = () => {
    setMaxAttempts("5");
    setInactivity("30");
    setSessionTimeout("120");
    setRememberMe("30");
    setMinPasswordLength("10");
    setPasswordHistory("3");
    setReqSpecial("Yes");
    setReqCase("Yes");
    setReqNumbers("Yes");
    setEnforceHttps(true);
    setEnableSSO(true);
    toast.info("Authentication settings reset to default values");
  };

  // ==========================================
  // TAB 2: Security State
  // ==========================================
  const [encAtRest, setEncAtRest] = useState(true);
  const [encInTransit, setEncInTransit] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState("10.0.0.0/8, 192.168.0.0/16");
  const [rateLimit, setRateLimit] = useState("100");
  const [maxSessions, setMaxSessions] = useState("3");
  const [bruteForce, setBruteForce] = useState(true);
  const [retentionDays, setRetentionDays] = useState("365");
  const [alertNewDevice, setAlertNewDevice] = useState(true);

  const handleSaveSecurity = () => {
    toast.success("Security settings saved successfully");
  };

  const handleResetSecurity = () => {
    setEncAtRest(true);
    setEncInTransit(true);
    setIpWhitelist("10.0.0.0/8, 192.168.0.0/16");
    setRateLimit("100");
    setMaxSessions("3");
    setBruteForce(true);
    setRetentionDays("365");
    setAlertNewDevice(true);
    toast.info("Security settings reset to default values");
  };

  // ==========================================
  // TAB 3: Identity Provider State
  // ==========================================
  const [selectedProvider, setSelectedProvider] = useState<
    "builtin" | "ldap" | "oauth" | "saml"
  >("builtin");

  // Built-in authentication setting
  const [builtinActive, setBuiltinActive] = useState(true);

  // LDAP Connection Settings
  const [ldapHost, setLdapHost] = useState("");
  const [ldapPort, setLdapPort] = useState("389");
  const [ldapBindDn, setLdapBindDn] = useState("");
  const [ldapBindPass, setLdapBindPass] = useState("");
  const [ldapBaseDn, setLdapBaseDn] = useState("");
  const [ldapEncryption, setLdapEncryption] = useState("STARTTLS");
  const [ldapUserSearchBase, setLdapUserSearchBase] = useState("");
  const [ldapActive, setLdapActive] = useState(false);

  // OAuth sub-form
  const [oauthClientId, setOauthClientId] = useState("dge-studio-enterprise-client-id");
  const [oauthSecret, setOauthSecret] = useState("dge-oauth-client-secret-key-prod-55a2c");
  const [oauthIssuer, setOauthIssuer] = useState("https://idp.dge.gov.ae/auth/realms/dge");
  const [oauthActive, setOauthActive] = useState(false);

  // SAML sub-form
  const [samlEntityId, setSamlEntityId] = useState("https://studio.dge.gov.ae/saml/metadata");
  const [samlSsoUrl, setSamlSsoUrl] = useState("https://sso.dge.gov.ae/adfs/ls");
  const [samlActive, setSamlActive] = useState(false);

  const handleSaveIdentityProvider = (provider: typeof selectedProvider) => {
    toast.success(`${provider.toUpperCase()} Identity Provider saved successfully`);
  };

  // ==========================================
  // TAB 4: SMTP Configuration State
  // ==========================================
  const [smtpConfigs, setSmtpConfigs] = useState<SMTPConfigItem[]>([
    {
      id: "1",
      name: "Master SMTP Configuration - Ahmed",
      host: "smtp.office365.com:587/",
      port: "587",
      user: "ahmed.almansoori@dge.gov.ae",
      sender: "ahmed.almansoori@dge.gov.ae",
      secure: false, // represents STARTTLS
      active: true,
    },
    {
      id: "2",
      name: "Gmail SMTP Configuration - Ahmed",
      host: "smtp.gmail.com:465",
      port: "465",
      user: "ahmed.almansoori@gmail.com",
      sender: "ahmed.almansoori@gmail.com",
      secure: true, // SSL/TLS
      active: false,
    }
  ]);

  const [isAddingSmtp, setIsAddingSmtp] = useState(false);
  const [viewingConfigId, setViewingConfigId] = useState<string | null>(null);
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);

  const [smtpName, setSmtpName] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("465");
  const [smtpEncryption, setSmtpEncryption] = useState("SSL/TLS");
  const [smtpAuthMethod, setSmtpAuthMethod] = useState("LOGIN");
  const [smtpSenderName, setSmtpSenderName] = useState("Data Automation Studio");
  const [smtpSenderEmail, setSmtpSenderEmail] = useState("");
  const [smtpUser, setSmtpUser] = useState("DAPortalAdmin");
  const [smtpPass, setSmtpPass] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showLdapPassword, setShowLdapPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  const handleAddSmtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smtpName.trim() || !smtpHost.trim() || !smtpSenderEmail.trim()) {
      toast.error("SMTP Configuration Name, Host, and Sender Email are required");
      return;
    }
    const newConfig: SMTPConfigItem = {
      id: Math.random().toString(),
      name: smtpName,
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      sender: smtpSenderEmail,
      secure: smtpEncryption === "SSL/TLS",
      active: smtpConfigs.length === 0, // auto active if first
    };

    setSmtpConfigs([...smtpConfigs, newConfig]);
    setIsAddingSmtp(false);

    // Reset form fields
    setSmtpName("");
    setSmtpHost("");
    setSmtpPort("465");
    setSmtpEncryption("SSL/TLS");
    setSmtpAuthMethod("LOGIN");
    setSmtpSenderName("Data Automation Studio");
    setSmtpSenderEmail("");
    setSmtpUser("DAPortalAdmin");
    setSmtpPass("");
    setIsValidated(false);
    setTestEmail("");

    toast.success(`SMTP Configuration "${newConfig.name}" created successfully`);
  };

  const toggleSmtpActive = (id: string) => {
    setSmtpConfigs(
      smtpConfigs.map((cfg) => ({
        ...cfg,
        active: cfg.id === id,
      }))
    );
    toast.success("Outbound SMTP selection updated");
  };

  const deleteSmtp = (id: string) => {
    const cfg = smtpConfigs.find((c) => c.id === id);
    if (cfg?.active) {
      toast.error("Cannot delete an active SMTP configuration.");
      return;
    }
    const updated = smtpConfigs.filter((c) => c.id !== id);
    setSmtpConfigs(updated);
    toast.success("SMTP configuration deleted");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & Authentication"
        description="Authentication policies, system security, the identity provider, and the outbound mail (SMTP) server"
      />

      {/* Tabs Headings */}
      <div className="flex items-center gap-1 border-b border-border/40 pb-px">
        <button
          onClick={() => setActiveTab("auth")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-all cursor-pointer ${
            activeTab === "auth"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="h-4 w-4" /> Authentication
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-all cursor-pointer ${
            activeTab === "security"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shield className="h-4 w-4" /> Security
        </button>
        <button
          onClick={() => setActiveTab("identity")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-all cursor-pointer ${
            activeTab === "identity"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Database className="h-4 w-4" /> Identity Store
        </button>
        <button
          onClick={() => setActiveTab("smtp")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-all cursor-pointer ${
            activeTab === "smtp"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail className="h-4 w-4" /> SMTP Config
        </button>
      </div>

      {/* TAB CONTENT: AUTHENTICATION */}
      {activeTab === "auth" && (
        <div className="space-y-4">
          {/* Login Policy Card */}
          <Surface className="p-5 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
                <Key className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Login Policy</h3>
            </div>

            <div className="space-y-4.5">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Max Login Attempts</label>
                  <Input
                    type="number"
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(e.target.value)}
                    className="h-9.5"
                  />
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">Lock account after N failed attempts</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Inactivity (minutes)</label>
                  <Input
                    type="number"
                    value={inactivity}
                    onChange={(e) => setInactivity(e.target.value)}
                    className="h-9.5"
                  />
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">Lock the account after this idle period</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Session Timeout (minutes)</label>
                  <Input
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="h-9.5"
                  />
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold font-semibold">Idle time before auto sign-out</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Remember Me (days)</label>
                  <Input
                    type="number"
                    value={rememberMe}
                    onChange={(e) => setRememberMe(e.target.value)}
                    className="h-9.5"
                  />
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">Persistent login duration</p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Minimum Password Length</label>
                  <Input
                    type="number"
                    value={minPasswordLength}
                    onChange={(e) => setMinPasswordLength(e.target.value)}
                    className="h-9.5"
                  />
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">Minimum characters for new passwords</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Password History</label>
                  <Input
                    type="number"
                    value={passwordHistory}
                    onChange={(e) => setPasswordHistory(e.target.value)}
                    className="h-9.5"
                  />
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">New password can't match the last N passwords</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Require Special Characters</label>
                  <Select value={reqSpecial} onValueChange={setReqSpecial}>
                    <SelectTrigger className="h-9.5">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">Password must include a symbol</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Require Upper & Lowercase</label>
                  <Select value={reqCase} onValueChange={setReqCase}>
                    <SelectTrigger className="h-9.5">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">Mix of upper and lower case letters</p>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Require Numbers</label>
                  <Select value={reqNumbers} onValueChange={setReqNumbers}>
                    <SelectTrigger className="h-9.5">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">Password must include a digit</p>
                </div>
              </div>
            </div>
          </Surface>

          {/* Security Toggles Card */}
          <Surface className="p-5 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Security Toggles</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start justify-between p-4 border border-border/30 rounded-xl bg-foreground/[0.01]">
                <div className="space-y-0.5 pr-4">
                  <div className="text-xs font-bold text-foreground">Enforce HTTPS</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 font-semibold">
                    Redirect all HTTP traffic to HTTPS
                  </div>
                </div>
                <Switch
                  checked={enforceHttps}
                  onCheckedChange={setEnforceHttps}
                  className="cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between p-4 border border-border/30 rounded-xl bg-foreground/[0.01]">
                <div className="space-y-0.5 pr-4">
                  <div className="text-xs font-bold text-foreground">Enable SSO (Single Sign-On)</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 font-semibold">
                    Allow users to authenticate via configured IdP
                  </div>
                </div>
                <Switch
                  checked={enableSSO}
                  onCheckedChange={setEnableSSO}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </Surface>

          {/* Footer Controls */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleResetAuth}
              className="h-9 px-4 font-semibold text-xs transition-colors"
            >
              Reset
            </Button>
            <Button
              onClick={handleSaveAuth}
              className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Save Settings
            </Button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECURITY */}
      {activeTab === "security" && (
        <div className="space-y-4">
          {/* Active Security Alerts */}
          <div className="border border-red-500/30 rounded-2xl bg-red-500/[0.02] p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-red-450 font-bold text-xs">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-red-400" />
              <span className="text-red-400">Active Security Alerts</span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Alert 1 */}
              <div className="p-3 bg-card border border-border/40 rounded-xl space-y-2 text-xs relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">4 Expired Passwords</span>
                  <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-550 border border-amber-500/20 uppercase">
                    high
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  4 user accounts have passwords older than 90 days.
                </p>
                <div className="text-[10px] text-muted-foreground/60 font-semibold font-mono">
                  2024-03-12 09:00
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-3 bg-card border border-border/40 rounded-xl space-y-2 text-xs relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">External Login Attempt</span>
                  <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase">
                    critical
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  3 failed logins from 185.220.101.45 (Tor exit node).
                </p>
                <div className="text-[10px] text-muted-foreground/60 font-semibold font-mono">
                  2024-03-12 08:30
                </div>
              </div>

              {/* Alert 3 */}
              <div className="p-3 bg-card border border-border/40 rounded-xl space-y-2 text-xs relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Inactive Admin Account</span>
                  <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-450 border border-amber-500/20 uppercase">
                    medium
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Admin account 'legacy-admin' has not logged in for 120 days.
                </p>
                <div className="text-[10px] text-muted-foreground/60 font-semibold font-mono">
                  2024-03-11 12:00
                </div>
              </div>
            </div>
          </div>

          {/* Encryption Section */}
          <Surface className="p-5 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
                <Key className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Encryption</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start justify-between p-4 border border-border/30 rounded-xl bg-foreground/[0.01]">
                <div className="space-y-0.5 pr-4">
                  <div className="text-xs font-bold text-foreground">Encryption at Rest</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 font-semibold">
                    AES-256 encryption for stored data
                  </div>
                </div>
                <Switch
                  checked={encAtRest}
                  onCheckedChange={setEncAtRest}
                  className="cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between p-4 border border-border/30 rounded-xl bg-foreground/[0.01]">
                <div className="space-y-0.5 pr-4">
                  <div className="text-xs font-bold text-foreground">Encryption in Transit</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 font-semibold">
                    TLS 1.3 enforced for all connections
                  </div>
                </div>
                <Switch
                  checked={encInTransit}
                  onCheckedChange={setEncInTransit}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </Surface>

          {/* Access Control Section */}
          <Surface className="p-5 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Access Control</h3>
            </div>

            <div className="space-y-4.5">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="space-y-1.5 lg:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">IP Whitelist (CIDR notation)</label>
                  <Input
                    value={ipWhitelist}
                    onChange={(e) => setIpWhitelist(e.target.value)}
                    className="h-9.5"
                  />
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">Comma-separated list of allowed IP ranges</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">API Rate Limit (req/min)</label>
                  <Input
                    type="number"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(e.target.value)}
                    className="h-9.5"
                  />
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">Requests allowed per minute</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Max Concurrent Sessions</label>
                  <Input
                    type="number"
                    value={maxSessions}
                    onChange={(e) => setMaxSessions(e.target.value)}
                    className="h-9.5"
                  />
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">Active sessions per user</p>
                </div>
              </div>

              {/* Brute force Switch row */}
              <div className="flex items-start justify-between p-4 border border-border/30 rounded-xl bg-foreground/[0.01] max-w-lg">
                <div className="space-y-0.5 pr-4">
                  <div className="text-xs font-bold text-foreground">Brute Force Protection</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 font-semibold">
                    Automatically block IPs with repeated failures
                  </div>
                </div>
                <Switch
                  checked={bruteForce}
                  onCheckedChange={setBruteForce}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </Surface>

          {/* Audit & Compliance Section */}
          <Surface className="p-5 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Audit & Compliance</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Audit Log Retention (days)</label>
                <Input
                  type="number"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                  className="h-9.5 max-w-sm"
                />
                <p className="text-[10px] text-muted-foreground/75 leading-relaxed font-semibold">Minimum 90 days recommended for compliance</p>
              </div>

              <div className="flex items-start justify-between p-4 border border-border/30 rounded-xl bg-foreground/[0.01]">
                <div className="space-y-0.5 pr-4">
                  <div className="text-xs font-bold text-foreground">Alert on New Device Login</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 font-semibold">
                    Email notification when user logs in from unknown device
                  </div>
                </div>
                <Switch
                  checked={alertNewDevice}
                  onCheckedChange={setAlertNewDevice}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </Surface>

          {/* Footer Controls */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleResetSecurity}
              className="h-9 px-4 font-semibold text-xs transition-colors"
            >
              Reset
            </Button>
            <Button
              onClick={handleSaveSecurity}
              className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Save Security Settings
            </Button>
          </div>
        </div>
      )}

      {activeTab === "identity" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          {/* Left Panel: Providers selector list */}
          <Surface className="p-4 flex flex-col justify-start space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Identity Providers</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedProvider("builtin")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 border rounded-xl text-left transition-all cursor-pointer",
                  selectedProvider === "builtin"
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/50 bg-card/65 hover:bg-muted/10"
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.04] border border-border/50 text-muted-foreground">
                  <Database className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-foreground truncate">Built-in Identity Store</div>
                  <div className="inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] font-extrabold mt-1">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" /> Active
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedProvider("ldap")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 border rounded-xl text-left transition-all cursor-pointer",
                  selectedProvider === "ldap"
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/50 bg-card/65 hover:bg-muted/10"
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.04] border border-border/50 text-muted-foreground">
                  <Database className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-foreground truncate font-semibold">LDAP</div>
                  <div className="inline-flex items-center gap-1 rounded bg-slate-500/15 text-slate-400 border border-slate-500/25 px-1.5 py-0.2 text-[9px] font-extrabold mt-1">
                    <span className="h-1 w-1 rounded-full bg-slate-400" /> Inactive
                  </div>
                </div>
              </button>
            </div>
          </Surface>

          {/* Right Panel: Selected configuration sub-form */}
          <Surface className="p-5 flex flex-col justify-start">
            {selectedProvider === "builtin" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b border-border/40 pb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-primary">
                    <Database className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Built-in Identity Store</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Local user database managed within Data Automation Studio</p>
                  </div>
                </div>

                {/* Active alert box */}
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>
                    Built-in identity store is active. Local users are managed under{" "}
                    <span className="underline hover:text-emerald-300 cursor-pointer">User Management</span>.
                  </span>
                </div>

                {/* Enable auth Switch */}
                <div className="flex items-center justify-between p-3 border border-border/50 rounded-xl bg-card">
                  <span className="text-xs font-bold text-foreground select-none">Enable built-in authentication</span>
                  <Switch
                    checked={builtinActive}
                    onCheckedChange={setBuiltinActive}
                    className="cursor-pointer"
                  />
                </div>

                {/* Centered policy link */}
                <p className="text-[11px] text-muted-foreground/80 leading-normal font-semibold">
                  Password rules and session policy are managed centrally under{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("auth")}
                    className="text-primary hover:underline font-bold"
                  >
                    Security &amp; Authentication &rarr; Authentication &rarr; Login Policy
                  </button>
                  .
                </p>

                {/* Save button */}
                <div className="pt-3 border-t border-border/20">
                  <Button
                    onClick={() => {
                      toast.success("Built-in Identity Store configuration saved");
                    }}
                    className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs"
                  >
                    Save Configuration
                  </Button>
                </div>
              </div>
            )}

            {selectedProvider === "ldap" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b border-border/40 pb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-primary">
                    <Database className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">LDAP</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Connect to an LDAP directory server</p>
                  </div>
                </div>

                {/* Enable LDAP Switch */}
                <div className="flex items-center justify-between p-3 border border-border/50 rounded-xl bg-card">
                  <span className="text-xs font-bold text-foreground select-none">Enable LDAP / Active Directory</span>
                  <Switch
                    checked={ldapActive}
                    onCheckedChange={setLdapActive}
                    className="cursor-pointer"
                  />
                </div>

                {/* Connection Settings */}
                <div className="space-y-4 text-xs font-semibold">
                  <div className="text-xs font-bold text-foreground uppercase tracking-wider select-none">Connection Settings</div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_180px]">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">LDAP Host</label>
                      <Input
                        value={ldapHost}
                        onChange={(e) => setLdapHost(e.target.value)}
                        placeholder="ldap.example.com"
                        className="h-9.5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">Port</label>
                      <Input
                        value={ldapPort}
                        onChange={(e) => setLdapPort(e.target.value)}
                        placeholder="389"
                        className="h-9.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">Bind DN</label>
                      <Input
                        value={ldapBindDn}
                        onChange={(e) => setLdapBindDn(e.target.value)}
                        placeholder="cn=admin,dc=example,dc=com"
                        className="h-9.5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">Bind Password</label>
                      <div className="relative">
                        <Input
                          type={showLdapPassword ? "text" : "password"}
                          value={ldapBindPass}
                          onChange={(e) => setLdapBindPass(e.target.value)}
                          placeholder="Enter bind password"
                          className="h-9.5 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLdapPassword(!showLdapPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showLdapPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted-foreground block font-bold">Base DN</label>
                    <Input
                      value={ldapBaseDn}
                      onChange={(e) => setLdapBaseDn(e.target.value)}
                      placeholder="dc=example,dc=com"
                      className="h-9.5"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">Encryption</label>
                      <Select value={ldapEncryption} onValueChange={setLdapEncryption}>
                        <SelectTrigger className="h-9.5">
                          <SelectValue placeholder="STARTTLS" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                          <SelectItem value="SSL/TLS">SSL/TLS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">User Search Base</label>
                      <Input
                        value={ldapUserSearchBase}
                        onChange={(e) => setLdapUserSearchBase(e.target.value)}
                        placeholder="ou=users,dc=example,dc=com"
                        className="h-9.5"
                      />
                    </div>
                  </div>

                  {/* Test connection row */}
                  <div className="space-y-2 pt-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        toast.success("TCP reachability of LDAP server validated successfully");
                      }}
                      className="h-8.5 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Test Connection
                    </Button>
                    <p className="text-[10px] text-muted-foreground leading-normal font-semibold">
                      Test Connection checks TCP reachability of the LDAP host/port. Directory login is not yet enabled.
                    </p>
                  </div>
                </div>

                {/* Save button */}
                <div className="pt-3 border-t border-border/20">
                  <Button
                    onClick={() => {
                      toast.success("LDAP configuration saved");
                    }}
                    className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs"
                  >
                    Save Configuration
                  </Button>
                </div>
              </div>
            )}
          </Surface>
        </div>
      )}      {activeTab === "smtp" && (
        <div className="space-y-4">
          {/* LIST VIEW */}
          {!isAddingSmtp && !viewingConfigId && !editingConfigId && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-normal select-none">
                Configure one or more outbound mail servers; the <span className="font-semibold text-foreground">Active</span> one is used to send notifications. Recipients are set under{" "}
                <Link to="/admin/notifications" className="text-primary hover:underline font-bold">
                  Job notifications
                </Link>
                .
              </p>

              <div className="flex justify-end select-none">
                <Button
                  onClick={() => {
                    // Reset fields for new config
                    setSmtpName("");
                    setSmtpHost("");
                    setSmtpPort("465");
                    setSmtpEncryption("SSL/TLS");
                    setSmtpAuthMethod("LOGIN");
                    setSmtpSenderName("Data Automation Studio");
                    setSmtpSenderEmail("");
                    setSmtpUser("DAPortalAdmin");
                    setSmtpPass("");
                    setIsValidated(false);
                    setTestEmail("");
                    setIsAddingSmtp(true);
                  }}
                  className="h-9.5 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-soft"
                >
                  <Plus className="h-4 w-4" /> Add new SMTP Configuration
                </Button>
              </div>

              {/* Configurations Table matching 1st screenshot */}
              <Surface className="overflow-x-auto !p-0 border border-border">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-border/40 bg-foreground/[0.02] text-muted-foreground font-bold select-none h-11">
                      <th className="px-4 py-2">NAME</th>
                      <th className="px-4 py-2">HOST</th>
                      <th className="px-4 py-2">SENDER</th>
                      <th className="px-4 py-2">ACTIVE</th>
                      <th className="px-4 py-2 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {smtpConfigs.map((cfg) => (
                      <tr key={cfg.id} className="border-b border-border/40 hover:bg-muted/10 h-12">
                        <td className="px-4 py-2 font-extrabold text-foreground">{cfg.name}</td>
                        <td className="px-4 py-2 font-mono text-muted-foreground">{cfg.host}</td>
                        <td className="px-4 py-2 text-muted-foreground">{cfg.sender}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={cfg.active}
                              onCheckedChange={() => toggleSmtpActive(cfg.id)}
                              className="scale-90 cursor-pointer data-[state=checked]:bg-emerald-500"
                            />
                            <span className={cn(
                              "text-[10px] font-extrabold select-none",
                              cfg.active ? "text-emerald-400" : "text-muted-foreground"
                            )}>
                              {cfg.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right select-none">
                          <button
                            onClick={() => setViewingConfigId(cfg.id)}
                            className="p-1 hover:text-primary transition-colors cursor-pointer mr-1.5"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              // Populate form fields for edit
                              setSmtpName(cfg.name);
                              setSmtpHost(cfg.host.split(":")[0]);
                              setSmtpPort(cfg.port);
                              setSmtpEncryption(cfg.secure ? "SSL/TLS" : "STARTTLS");
                              setSmtpSenderName("Data Automation Studio");
                              setSmtpSenderEmail(cfg.sender);
                              setSmtpUser(cfg.user);
                              setSmtpPass("••••••••");
                              setIsValidated(true); // pre-validated for editing mock
                              setTestEmail("");
                              setEditingConfigId(cfg.id);
                            }}
                            className="p-1 hover:text-primary transition-colors cursor-pointer mr-1.5"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => !cfg.active && deleteSmtp(cfg.id)}
                            disabled={cfg.active}
                            className={cn(
                              "p-1 transition-colors",
                              cfg.active
                                ? "text-muted-foreground/30 cursor-not-allowed"
                                : "text-muted-foreground hover:text-rose-500 cursor-pointer"
                            )}
                            title={cfg.active ? "Cannot delete active configuration" : "Delete"}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Surface>
            </div>
          )}

          {/* VIEW MODE - Matches 2nd screenshot */}
          {viewingConfigId !== null && (
            (() => {
              const cfg = smtpConfigs.find(item => item.id === viewingConfigId);
              if (!cfg) return null;
              return (
                <Surface className="border border-border !p-5 space-y-6">
                  {/* View Header */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-3 select-none">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setViewingConfigId(null)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted text-muted-foreground cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-primary">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{cfg.name}</h3>
                        <p className="text-[10px] text-muted-foreground font-semibold">Read only view</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        // Populate and edit
                        setSmtpName(cfg.name);
                        setSmtpHost(cfg.host.split(":")[0]);
                        setSmtpPort(cfg.port);
                        setSmtpEncryption(cfg.secure ? "SSL/TLS" : "STARTTLS");
                        setSmtpSenderName("Data Automation Studio");
                        setSmtpSenderEmail(cfg.sender);
                        setSmtpUser(cfg.user);
                        setSmtpPass("••••••••");
                        setIsValidated(true);
                        setTestEmail("");
                        setEditingConfigId(cfg.id);
                        setViewingConfigId(null);
                      }}
                      className="h-8.5 px-3.5 border border-border hover:bg-muted text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer select-none transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                  </div>

                  {/* Read-Only Details Grid */}
                  <div className="grid gap-x-6 gap-y-4 grid-cols-1 sm:grid-cols-2 text-xs font-semibold leading-relaxed">
                    <div className="grid grid-cols-[110px_1fr] items-baseline border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-foreground font-bold">{cfg.name}</span>
                    </div>
                    <div className="grid grid-cols-[110px_1fr] items-baseline border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Host</span>
                      <span className="text-foreground font-bold font-mono">{cfg.host.split(":")[0]}</span>
                    </div>

                    <div className="grid grid-cols-[110px_1fr] items-baseline border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Port</span>
                      <span className="text-foreground font-bold font-mono">{cfg.port}</span>
                    </div>
                    <div className="grid grid-cols-[110px_1fr] items-baseline border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Encryption</span>
                      <span className="text-foreground font-bold uppercase">{cfg.secure ? "SSL/TLS" : "STARTTLS"}</span>
                    </div>

                    <div className="grid grid-cols-[110px_1fr] items-baseline border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Auth method</span>
                      <span className="text-foreground font-bold uppercase">LOGIN</span>
                    </div>
                    <div className="grid grid-cols-[110px_1fr] items-baseline border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Username</span>
                      <span className="text-foreground font-bold">{cfg.user}</span>
                    </div>

                    <div className="grid grid-cols-[110px_1fr] items-baseline border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Password</span>
                      <span className="text-foreground font-bold">•••••••• (set)</span>
                    </div>
                    <div className="grid grid-cols-[110px_1fr] items-baseline border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Sender name</span>
                      <span className="text-foreground font-bold">Data Automation Studio</span>
                    </div>

                    <div className="grid grid-cols-[110px_1fr] items-baseline border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Sender email</span>
                      <span className="text-foreground font-bold">{cfg.sender}</span>
                    </div>
                    <div className="grid grid-cols-[110px_1fr] items-baseline border-b border-border/20 pb-2">
                      <span className="text-muted-foreground">Active</span>
                      <span className="text-foreground font-bold">{cfg.active ? "Yes" : "No"}</span>
                    </div>

                    <div className="grid grid-cols-[110px_1fr] items-baseline border-b border-border/20 pb-2 sm:col-span-2">
                      <span className="text-muted-foreground">Last test</span>
                      <span className="text-muted-foreground/80 font-bold">Never</span>
                    </div>
                  </div>
                </Surface>
              );
            })()
          )}

          {/* EDIT & CREATE FORM VIEW - Matches 3rd screenshot */}
          {(editingConfigId !== null || isAddingSmtp) && (
            <Surface className="border border-border !p-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!smtpName.trim() || !smtpHost.trim() || !smtpSenderEmail.trim()) {
                    toast.error("SMTP Name, Host, and Sender Email are required.");
                    return;
                  }
                  if (editingConfigId) {
                    // Update
                    setSmtpConfigs(smtpConfigs.map(item => item.id === editingConfigId ? {
                      ...item,
                      name: smtpName,
                      host: `${smtpHost}:${smtpPort}`,
                      port: smtpPort,
                      user: smtpUser,
                      sender: smtpSenderEmail,
                      secure: smtpEncryption === "SSL/TLS",
                    } : item));
                    toast.success("SMTP Configuration saved successfully.");
                    setEditingConfigId(null);
                  } else {
                    // Create
                    const newConfig: SMTPConfigItem = {
                      id: Math.random().toString(),
                      name: smtpName,
                      host: `${smtpHost}:${smtpPort}`,
                      port: smtpPort,
                      user: smtpUser,
                      sender: smtpSenderEmail,
                      secure: smtpEncryption === "SSL/TLS",
                      active: smtpConfigs.length === 0,
                    };
                    setSmtpConfigs([...smtpConfigs, newConfig]);
                    toast.success(`SMTP Configuration "${smtpName}" created.`);
                    setIsAddingSmtp(false);
                  }
                }}
                className="space-y-5 text-xs font-semibold"
              >
                {/* Form Header */}
                <div className="flex items-center gap-3 border-b border-border/40 pb-3 select-none">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingConfigId(null);
                      setIsAddingSmtp(false);
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted text-muted-foreground cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-primary">
                    <Mail className="h-4.5 w-4.5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {editingConfigId ? `Edit — ${smtpName}` : "New SMTP Configuration"}
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Configuration - validation - test</p>
                  </div>
                </div>

                {/* Configuration Name input */}
                <div className="space-y-1.5">
                  <label className="text-muted-foreground block font-bold">SMTP Configuration Name *</label>
                  <Input
                    value={smtpName}
                    onChange={(e) => setSmtpName(e.target.value)}
                    placeholder="e.g. Master SMTP Configuration"
                    required
                    className="h-10"
                  />
                  <p className="text-[10px] text-muted-foreground/75 leading-normal">Must be unique.</p>
                </div>

                {/* Server Settings */}
                <div className="space-y-3.5 pt-1.5">
                  <div className="text-[10.5px] font-bold text-foreground border-l-2 border-primary pl-2 uppercase tracking-wide select-none">
                    Server Settings
                  </div>
                  
                  <div className="grid gap-4.5 sm:grid-cols-[1fr_200px]">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">SMTP Host *</label>
                      <Input
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        placeholder="smtp.office365.com"
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">Port *</label>
                      <Input
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        placeholder="587"
                        required
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4.5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">Encryption</label>
                      <Select value={smtpEncryption} onValueChange={setSmtpEncryption}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="STARTTLS" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                          <SelectItem value="SSL/TLS">SSL/TLS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">Auth Method</label>
                      <Select value={smtpAuthMethod} onValueChange={setSmtpAuthMethod}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="LOGIN" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">NONE</SelectItem>
                          <SelectItem value="PLAIN">PLAIN</SelectItem>
                          <SelectItem value="LOGIN">LOGIN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Sender Identity */}
                <div className="space-y-3.5 pt-2">
                  <div className="text-[10.5px] font-bold text-foreground border-l-2 border-primary pl-2 uppercase tracking-wide select-none">
                    Sender Identity
                  </div>

                  <div className="grid gap-4.5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">Sender Name</label>
                      <Input
                        value={smtpSenderName}
                        onChange={(e) => setSmtpSenderName(e.target.value)}
                        placeholder="Data Automation Studio"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">Sender Email *</label>
                      <Input
                        value={smtpSenderEmail}
                        onChange={(e) => setSmtpSenderEmail(e.target.value)}
                        placeholder="info.ecubeapps@ispatialtec.com"
                        required
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Authentication */}
                <div className="space-y-3.5 pt-2">
                  <div className="text-[10.5px] font-bold text-foreground border-l-2 border-primary pl-2 uppercase tracking-wide select-none">
                    Authentication
                  </div>

                  <div className="grid gap-4.5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">Username</label>
                      <Input
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        placeholder="info.ecubeapps@ispatialtec.com"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block font-bold">Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={smtpPass}
                          onChange={(e) => setSmtpPass(e.target.value)}
                          placeholder="•••••••• (unchanged)"
                          className="h-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground/75 leading-normal">Leave blank to keep the saved password.</p>
                    </div>
                  </div>
                </div>

                {/* Validation Info Box */}
                <div className="p-4 rounded-xl border border-border/50 bg-[#0F172A] flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 shadow-soft select-none">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-foreground text-xs">Validate configuration</div>
                      <div className="text-[10.5px] text-muted-foreground font-semibold mt-0.5">No email is sent — checks server connection + credentials.</div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsValidating(true);
                      setTimeout(() => {
                        setIsValidating(false);
                        setIsValidated(true);
                        toast.success("SMTP Connection settings validated successfully.");
                      }, 800);
                    }}
                    disabled={isValidating || !smtpHost}
                    className="h-8.5 px-4 bg-blue-600 hover:bg-blue-600/90 text-white font-extrabold text-xs rounded-lg shrink-0 self-end sm:self-center cursor-pointer shadow-soft"
                  >
                    {isValidating ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : (
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    {isValidating ? "Validating..." : "Validate"}
                  </Button>
                </div>

                {/* Send Test Email Block */}
                <div className="space-y-2 pt-1 select-none">
                  <div className="text-xs font-bold text-foreground">Send Test Email <span className="text-muted-foreground/60">(optional)</span></div>
                  <p className="text-[10px] text-muted-foreground/80 leading-normal font-semibold">Send a real test message. Validate first to enable this.</p>
                  
                  <div className="flex gap-3 max-w-lg">
                    <Input
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                      disabled={!isValidated}
                      className="h-9.5 flex-1"
                    />
                    <Button
                      type="button"
                      disabled={!isValidated || !testEmail}
                      onClick={() => {
                        toast.success(`Test email sent successfully to ${testEmail}`);
                      }}
                      className="h-9.5 px-4 border border-border hover:bg-muted text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-soft transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" /> Send Test
                    </Button>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/40 select-none">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingConfigId(null);
                      setIsAddingSmtp(false);
                    }}
                    className="h-9.5 px-4 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-9.5 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs shadow-soft"
                  >
                    {editingConfigId ? "Save changes" : "Create configuration"}
                  </Button>
                </div>

              </form>
            </Surface>
          )}
        </div>
      )}
    </div>
  );
}
