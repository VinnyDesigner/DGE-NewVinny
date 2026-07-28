import { createFileRoute } from "@tanstack/react-router";
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
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { toast } from "sonner";
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

  // LDAP sub-form
  const [ldapHost, setLdapHost] = useState("ldap://directory.dge.gov.ae");
  const [ldapBaseDn, setLdapBaseDn] = useState("OU=Users,DC=dge,DC=gov,DC=ae");
  const [ldapBindDn, setLdapBindDn] = useState("CN=BindUser,OU=ServiceAccounts,DC=dge,DC=gov,DC=ae");
  const [ldapPassword, setLdapPassword] = useState("••••••••••••••••");
  const [ldapSyncInterval, setLdapSyncInterval] = useState("360");
  const [ldapActive, setLdapActive] = useState(true);

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
  const [smtpConfigs, setSmtpConfigs] = useState<SMTPConfigItem[]>([]);
  const [isAddingSmtp, setIsAddingSmtp] = useState(false);
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
    const updated = smtpConfigs.filter((cfg) => cfg.id !== id);
    if (updated.length > 0 && !updated.some((cfg) => cfg.active)) {
      updated[0].active = true;
    }
    setSmtpConfigs(updated);
    toast.success("SMTP configuration deleted");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-2 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Security & Authentication"
          description="Authentication policies, system security, the identity provider, and the outbound mail (SMTP) server"
          className="mb-0!"
        />
      </div>

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

      {/* TAB CONTENT: IDENTITY STORE */}
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
                className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all cursor-pointer ${
                  selectedProvider === "builtin"
                    ? "border-accent/40 bg-accent/5"
                    : "border-border/45 bg-foreground/[0.01] hover:bg-foreground/[0.02]"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-foreground">Built-in Database</div>
                  <div className="text-[10px] text-muted-foreground/80 mt-0.5 leading-normal">
                    Local accounts & credentials
                  </div>
                </div>
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </button>

              <button
                onClick={() => setSelectedProvider("ldap")}
                className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all cursor-pointer ${
                  selectedProvider === "ldap"
                    ? "border-accent/40 bg-accent/5"
                    : "border-border/45 bg-foreground/[0.01] hover:bg-foreground/[0.02]"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-foreground">AD / LDAP Server</div>
                  <div className="text-[10px] text-muted-foreground/80 mt-0.5 leading-normal">
                    Directory synchronization
                  </div>
                </div>
                <span className={`inline-flex h-1.5 w-1.5 rounded-full ${ldapActive ? "bg-emerald-500" : "bg-slate-500"}`} />
              </button>

              <button
                onClick={() => setSelectedProvider("oauth")}
                className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all cursor-pointer ${
                  selectedProvider === "oauth"
                    ? "border-accent/40 bg-accent/5"
                    : "border-border/45 bg-foreground/[0.01] hover:bg-foreground/[0.02]"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-foreground">OpenID Connect / OAuth</div>
                  <div className="text-[10px] text-muted-foreground/80 mt-0.5 leading-normal">
                    Google / Keycloak Single Sign-On
                  </div>
                </div>
                <span className={`inline-flex h-1.5 w-1.5 rounded-full ${oauthActive ? "bg-emerald-500" : "bg-slate-500"}`} />
              </button>

              <button
                onClick={() => setSelectedProvider("saml")}
                className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-all cursor-pointer ${
                  selectedProvider === "saml"
                    ? "border-accent/40 bg-accent/5"
                    : "border-border/45 bg-foreground/[0.01] hover:bg-foreground/[0.02]"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-foreground">SAML 2.0 Integration</div>
                  <div className="text-[10px] text-muted-foreground/80 mt-0.5 leading-normal">
                    ADFS / Okta SSO configurations
                  </div>
                </div>
                <span className={`inline-flex h-1.5 w-1.5 rounded-full ${samlActive ? "bg-emerald-500" : "bg-slate-500"}`} />
              </button>
            </div>
          </Surface>

          {/* Right Panel: Selected configuration sub-form */}
          <Surface className="p-5 flex flex-col justify-start">
            {selectedProvider === "builtin" && (
              <div className="space-y-4">
                <div className="border-b border-border/40 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground font-semibold">—</h3>
                  </div>
                </div>

                <div className="p-4 bg-foreground/[0.01] border border-border/30 rounded-xl flex items-start gap-3">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      Select an identity provider from the left pane to manage its synchronization properties, domain endpoints, and security configuration parameters.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedProvider === "ldap" && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/40 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">AD / LDAP Configuration</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure server hostname and credentials to synchronize directory attributes with local users database.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status:</span>
                    <Switch
                      checked={ldapActive}
                      onCheckedChange={setLdapActive}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">LDAP Server URL</label>
                    <Input
                      value={ldapHost}
                      onChange={(e) => setLdapHost(e.target.value)}
                      className="h-9.5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Sync Interval (minutes)</label>
                    <Input
                      type="number"
                      value={ldapSyncInterval}
                      onChange={(e) => setLdapSyncInterval(e.target.value)}
                      className="h-9.5"
                    />
                  </div>
                  <div className="space-y-1.5 lg:col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">User Search Base (Base DN)</label>
                    <Input
                      value={ldapBaseDn}
                      onChange={(e) => setLdapBaseDn(e.target.value)}
                      className="h-9.5"
                    />
                  </div>
                  <div className="space-y-1.5 lg:col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">Bind User (Bind DN)</label>
                    <Input
                      value={ldapBindDn}
                      onChange={(e) => setLdapBindDn(e.target.value)}
                      className="h-9.5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Bind Password</label>
                    <Input
                      type="password"
                      value={ldapPassword}
                      onChange={(e) => setLdapPassword(e.target.value)}
                      className="h-9.5"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border/40">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8.5 font-semibold text-xs"
                    onClick={() => toast.info("Directory connection test initiated...")}
                  >
                    Test Connection
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSaveIdentityProvider("ldap")}
                    className="h-8.5 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Provider
                  </Button>
                </div>
              </div>
            )}

            {selectedProvider === "oauth" && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/40 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">OAuth / OpenID Connect (OIDC)</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Integrate Keycloak, Google, or Microsoft SSO domains for seamless federated credential checks.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status:</span>
                    <Switch
                      checked={oauthActive}
                      onCheckedChange={setOauthActive}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 lg:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground">Identity Issuer URL (OAuth Endpoint)</label>
                      <Input
                        value={oauthIssuer}
                        onChange={(e) => setOauthIssuer(e.target.value)}
                        className="h-9.5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Client ID</label>
                      <Input
                        value={oauthClientId}
                        onChange={(e) => setOauthClientId(e.target.value)}
                        className="h-9.5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Client Secret Key</label>
                      <Input
                        type="password"
                        value={oauthSecret}
                        onChange={(e) => setOauthSecret(e.target.value)}
                        className="h-9.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border/40">
                  <Button
                    size="sm"
                    onClick={() => handleSaveIdentityProvider("oauth")}
                    className="h-8.5 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Provider
                  </Button>
                </div>
              </div>
            )}

            {selectedProvider === "saml" && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/40 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">SAML 2.0 Configuration</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure ADFS or Okta metadata mapping fields for federated Single Sign-On credentials.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status:</span>
                    <Switch
                      checked={samlActive}
                      onCheckedChange={setSamlActive}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 lg:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground">SAML Service Provider Entity ID</label>
                      <Input
                        value={samlEntityId}
                        onChange={(e) => setSamlEntityId(e.target.value)}
                        className="h-9.5"
                      />
                    </div>
                    <div className="space-y-1.5 lg:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground">Single Sign-On Service URL</label>
                      <Input
                        value={samlSsoUrl}
                        onChange={(e) => setSamlSsoUrl(e.target.value)}
                        className="h-9.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border/40">
                  <Button
                    size="sm"
                    onClick={() => handleSaveIdentityProvider("saml")}
                    className="h-8.5 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Provider
                  </Button>
                </div>
              </div>
            )}
          </Surface>
        </div>
      )}

      {/* TAB CONTENT: SMTP CONFIGURATION */}
      {activeTab === "smtp" && (
        <div className="space-y-4">
          {!isAddingSmtp ? (
            /* LIST VIEW */
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-normal">
                Configure one or more outbound mail servers; the <span className="font-semibold text-foreground">Active</span> one is used to send notifications. Recipients are set under <span className="text-primary hover:underline cursor-pointer">Job notifications</span>.
              </p>

              {/* Warning Banner */}
              <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3.5 text-xs text-red-400 font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Unexpected token 'B', "Bad Request" is not valid JSON</span>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setIsAddingSmtp(true)}
                  className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add new SMTP Configuration
                </Button>
              </div>

              {smtpConfigs.length === 0 ? (
                <Surface className="p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60">
                  <div className="max-w-md mx-auto space-y-2">
                    <Mail className="h-10 w-10 text-muted-foreground/50 mx-auto" />
                    <p className="leading-relaxed">
                      No SMTP configurations yet. Click "Add new SMTP Configuration" to create the first one (it becomes active automatically).
                    </p>
                  </div>
                </Surface>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {smtpConfigs.map((cfg) => (
                    <Surface key={cfg.id} className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-foreground">{cfg.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-mono">{cfg.host}:{cfg.port}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSmtpActive(cfg.id)}
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border cursor-pointer select-none transition-colors ${
                              cfg.active
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/35"
                                : "bg-slate-500/10 text-muted-foreground border-slate-500/25 hover:bg-slate-500/20"
                            }`}
                          >
                            {cfg.active ? "Active" : "Set Active"}
                          </button>

                          <button
                            onClick={() => deleteSmtp(cfg.id)}
                            className="text-muted-foreground hover:text-red-400 transition-colors p-1 cursor-pointer"
                            title="Delete"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[10px] text-muted-foreground border-t border-border/30 pt-3">
                        <div>
                          <span className="font-semibold text-muted-foreground/60 block">Sender Address</span>
                          {cfg.sender}
                        </div>
                        <div>
                          <span className="font-semibold text-muted-foreground/60 block">Username</span>
                          {cfg.user || "Anonymous"}
                        </div>
                        <div>
                          <span className="font-semibold text-muted-foreground/60 block">Outbound Security</span>
                          {cfg.secure ? "SSL/TLS (Enforced)" : "Plain Text (None)"}
                        </div>
                      </div>
                    </Surface>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* FORM VIEW - Wrapped in a Surface container matching Image 1, 2, 3 exactly */
            <Surface className="p-6 space-y-6">
              <form onSubmit={handleAddSmtp} className="space-y-5">
                {/* Form Header with back arrow */}
                <div className="flex items-center gap-3 border-b border-border/40 pb-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingSmtp(false)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/50 hover:bg-foreground/[0.02] cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4 text-foreground" />
                  </button>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">New SMTP Configuration</h3>
                    <p className="text-[10px] text-muted-foreground/80 leading-normal">Configuration - validation - test</p>
                  </div>
                </div>

                {/* Field 1: SMTP Configuration Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-0.5">
                    SMTP Configuration Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Production Mail"
                    value={smtpName}
                    onChange={(e) => setSmtpName(e.target.value)}
                    required
                    className="h-9.5"
                  />
                  <p className="text-[10px] text-muted-foreground/70 leading-normal">Must be unique.</p>
                </div>

                {/* Section 1: Server Settings */}
                <div className="space-y-3.5 pt-1">
                  <div className="text-xs font-bold text-foreground border-l-2 border-primary pl-2 uppercase tracking-wide">
                    Server Settings
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-0.5">
                        SMTP Host <span className="text-red-400">*</span>
                      </label>
                      <Input
                        placeholder="smtp.example.com"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        required
                        className="h-9.5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-0.5">
                        Port <span className="text-red-400">*</span>
                      </label>
                      <Input
                        placeholder="465"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        required
                        className="h-9.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Encryption</label>
                      <Select value={smtpEncryption} onValueChange={setSmtpEncryption}>
                        <SelectTrigger className="h-9.5">
                          <SelectValue placeholder="SSL/TLS" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                          <SelectItem value="SSL/TLS">SSL/TLS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Auth Method</label>
                      <Select value={smtpAuthMethod} onValueChange={setSmtpAuthMethod}>
                        <SelectTrigger className="h-9.5">
                          <SelectValue placeholder="LOGIN" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">NONE</SelectItem>
                          <SelectItem value="PLAIN">PLAIN</SelectItem>
                          <SelectItem value="LOGIN">LOGIN</SelectItem>
                          <SelectItem value="XOAUTH2">XOAUTH2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Sender Identity */}
                <div className="space-y-3.5 pt-2">
                  <div className="text-xs font-bold text-foreground border-l-2 border-primary pl-2 uppercase tracking-wide">
                    Sender Identity
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Sender Name</label>
                      <Input
                        placeholder="Data Automation Studio"
                        value={smtpSenderName}
                        onChange={(e) => setSmtpSenderName(e.target.value)}
                        className="h-9.5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-0.5">
                        Sender Email <span className="text-red-400">*</span>
                      </label>
                      <Input
                        placeholder="sender@example.com"
                        value={smtpSenderEmail}
                        onChange={(e) => setSmtpSenderEmail(e.target.value)}
                        required
                        className="h-9.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Authentication */}
                <div className="space-y-3.5 pt-2">
                  <div className="text-xs font-bold text-foreground border-l-2 border-primary pl-2 uppercase tracking-wide">
                    Authentication
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Username</label>
                      <Input
                        placeholder="Username"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        className="h-9.5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={smtpPass}
                          onChange={(e) => setSmtpPass(e.target.value)}
                          className="h-9.5 pr-10"
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
                  </div>
                </div>

                {/* Section 4: Validate Configuration with correct spacing */}
                <div className="p-5 border border-border/30 rounded-xl bg-foreground/[0.01] space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg border shrink-0 ${
                      isValidated
                        ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                        : "bg-blue-500/10 border-blue-500/25 text-blue-400"
                    }`}>
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">Validate configuration</div>
                      <div className="text-[11px] text-muted-foreground/80 mt-0.5 leading-relaxed font-semibold">
                        No email is sent — checks server connection + credentials.
                      </div>
                    </div>
                  </div>
                  <div className="sm:pl-12 pl-0 pt-1">
                    <Button
                      type="button"
                      disabled={isValidating || !smtpHost}
                      onClick={() => {
                        setIsValidating(true);
                        setTimeout(() => {
                          setIsValidating(false);
                          setIsValidated(true);
                          toast.success("SMTP connection and credentials validated successfully");
                        }, 1000);
                      }}
                      className="h-8.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {isValidating ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      {isValidating ? "Validating..." : "Validate"}
                    </Button>
                  </div>
                </div>

                {/* Section 5: Send Test Email */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-foreground">Send Test Email <span className="text-muted-foreground/60">(optional)</span></div>
                  <p className="text-[10px] text-muted-foreground/80 leading-normal font-semibold font-semibold">Send a real test message. Validate first to enable this.</p>
                  <div className="flex gap-3 max-w-lg">
                    <Input
                      placeholder="test@example.com"
                      value={testEmail}
                      disabled={!isValidated}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="h-9.5 flex-1"
                    />
                    <Button
                      type="button"
                      disabled={!isValidated || !testEmail}
                      onClick={() => {
                        toast.success(`Test email sent successfully to ${testEmail}`);
                      }}
                      className="h-9.5 px-4 border border-border/60 hover:bg-foreground/[0.02] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="h-3.5 w-3.5" /> Send Test
                    </Button>
                  </div>
                </div>

                {/* Form Footer Actions */}
                <div className="flex justify-between items-center pt-3 border-t border-border/40">
                  {/* Warning message on the left */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold leading-none">
                    {!smtpName.trim() ? (
                      <>
                        <AlertTriangle className="h-4 w-4" /> Enter a configuration name.
                      </>
                    ) : !smtpHost.trim() ? (
                      <>
                        <AlertTriangle className="h-4 w-4" /> Enter an SMTP host.
                      </>
                    ) : !smtpSenderEmail.trim() ? (
                      <>
                        <AlertTriangle className="h-4 w-4" /> Enter a sender email address.
                      </>
                    ) : null}
                  </div>

                  <div className="flex gap-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 px-4 font-semibold text-xs transition-colors"
                      onClick={() => setIsAddingSmtp(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!smtpName.trim() || !smtpHost.trim() || !smtpSenderEmail.trim()}
                      className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs"
                    >
                      Create configuration
                    </Button>
                  </div>
                </div>
              </form>
            </Surface>
          )}
        </div>
      )}
    </div>
  );
}
