import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Power,
  Trash2,
  Mail,
  Compass,
  Wrench,
  ChevronDown,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/quality/rules")({
  head: () => ({
    meta: [
      { title: "Data Quality Rules — Data Automation Studio" },
      {
        name: "description",
        content:
          "Rule library — base, attribute, spatial, consistency, transformation and standardization rules.",
      },
    ],
  }),
  component: QualityRulesPage,
});

type Severity = "info" | "warning" | "error";
type Status = "Existing" | "New Proposed";
type Category =
  | "Schema"
  | "Field Validation"
  | "Geometry"
  | "Topology"
  | "Consistency"
  | "Transformation"
  | "Standardization";

type Rule = {
  id: string;
  name: string;
  description: string;
  appliesTo: string;
  category: Category;
  severity: Severity;
  enabled: boolean;
  status: Status;
};

type TabKey =
  | "all"
  | "base"
  | "attribute"
  | "spatial"
  | "consistency"
  | "transformation"
  | "standardization";

// ------------------------- Data (from spec screenshots) -------------------------

const BASE_RULES: Rule[] = [
  { id: "RULE_01", name: "Verify Geodatabase Availability", description: "Scans AGENCY_FOLDER_PATH for .gdb and .mdb files. Copies the found GDB to WORKING_FOLDER. Fails if no GDB found.", appliesTo: "ALL", category: "Schema", severity: "error", enabled: true, status: "Existing" },
  { id: "RULE_02", name: "Verify Layers Availability", description: "This rule verifies the geodatabase layers availability.", appliesTo: "ALL", category: "Schema", severity: "error", enabled: true, status: "Existing" },
  { id: "RULE_03", name: "Match Layers with FGDS", description: "Compares incoming layer names against the FGDS standard layer list.", appliesTo: "ALL", category: "Schema", severity: "warning", enabled: true, status: "Existing" },
  { id: "RULE_04", name: "Verify Disk Space", description: "Checks whether sufficient disk space is available before processing by comparing free space with the estimated geodatabase size.", appliesTo: "ALL", category: "Schema", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_05", name: "Record Layer Schema", description: "For each layer, reads all Fields and inserts field records — field name, type, length, domain name.", appliesTo: "ALL", category: "Schema", severity: "info", enabled: true, status: "Existing" },
  { id: "RULE_06", name: "Record Feature Count", description: "Counts features per layer via IFeatureClass.FeatureCount(Nothing) and stores counts.", appliesTo: "ALL", category: "Schema", severity: "info", enabled: true, status: "Existing" },
  { id: "RULE_07", name: "Verify Layers Projection", description: "Reads ISpatialReference from each layer's GeometryDef. Compares against GCS_WGS_1984_WKT. Records PASS/FAIL per layer.", appliesTo: "ALL", category: "Schema", severity: "error", enabled: true, status: "Existing" },
  { id: "RULE_08", name: "Verify Layer Geometry Type", description: "Checks esriGeometryType of each layer against the expected geometry type stored in the FGDS schema. Records PASS/FAIL.", appliesTo: "ALL", category: "Schema", severity: "error", enabled: true, status: "Existing" },
  { id: "RULE_09", name: "Verify Layer Coverage Area", description: "Performs a spatial query to verify that layer features are spatially within the agency's expected coverage extent.", appliesTo: "ALL", category: "Schema", severity: "warning", enabled: true, status: "Existing" },
  { id: "RULE_10", name: "Empty Layer Check", description: "Detects feature classes and tables with zero records.", appliesTo: "ALL", category: "Schema", severity: "warning", enabled: true, status: "New Proposed" },
];

const ATTRIBUTE_RULES: Rule[] = [
  { id: "RULE_11", name: "Record Null / Zero Values", description: "Iterates all features and all fields. Counts null values and zero numeric values per field. Records counts to results table.", appliesTo: "ALL", category: "Field Validation", severity: "info", enabled: true, status: "Existing" },
  { id: "RULE_12", name: "Verify Layer Invalid Characters", description: "Scans text field values for invalid characters (non-printable, special characters defined in config). Records violating features.", appliesTo: "ALL", category: "Field Validation", severity: "warning", enabled: true, status: "Existing" },
  { id: "RULE_13", name: "Verify Field Duplicate Values", description: "Detects duplicate values across the entire feature class. Records duplicate pairs.", appliesTo: "ALL", category: "Field Validation", severity: "warning", enabled: true, status: "Existing" },
  { id: "RULE_14", name: "Field Should Not Be Null", description: "For mandatory fields defined in the schema: checks that no feature has a null value. Records violations.", appliesTo: "ALL", category: "Field Validation", severity: "error", enabled: true, status: "Existing" },
  { id: "RULE_15", name: "Validate Email Format", description: "Automatically identifies candidate fields based on commonly used field names or aliases (e.g. EMAIL, EMAIL_ID, E_MAIL, CONTACT_EMAIL) and validates their values against a standard email format. Records features containing invalid email addresses.", appliesTo: "ALL", category: "Field Validation", severity: "error", enabled: true, status: "New Proposed" },
  { id: "RULE_16", name: "Validate Phone Format (UAE)", description: "Automatically identifies candidate fields based on commonly used field names or aliases (e.g. PHONE, MOBILE, TEL) and validates their values against the supported UAE telephone number format. Records features containing invalid phone numbers.", appliesTo: "ALL", category: "Field Validation", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_17", name: "Verify Leading / Trailing Spaces", description: "Automatically identifies text fields and checks for values containing leading or trailing spaces. Records features containing unnecessary whitespace at the beginning or end of text values.", appliesTo: "ALL", category: "Field Validation", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_18", name: "Validate Postal Code (UAE)", description: "Automatically identifies candidate fields based on commonly used field names or aliases (e.g. POSTAL_CODE, ZIP_CODE, PIN_CODE, ZIP) and validates their values against the configured postal code format. Records features containing invalid postal code values.", appliesTo: "ALL", category: "Field Validation", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_19", name: "Verify Field Types Match", description: "Compares the data type of each field with the expected FGDS schema and records mismatched field types.", appliesTo: "ALL", category: "Field Validation", severity: "error", enabled: true, status: "New Proposed" },
  { id: "RULE_20", name: "Verify Unique Field Value (Unique ID)", description: "Finds rows in feature classes and stand-alone tables that contain nonunique values in a field or a list of fields that are editable.", appliesTo: "ALL", category: "Field Validation", severity: "error", enabled: true, status: "New Proposed" },
  { id: "RULE_21", name: "Verify Layer Domain Values", description: "For fields with IDomain assigned: reads all coded domain values, checks every feature's field value against the domain. Records non-conforming values.", appliesTo: "ALL", category: "Field Validation", severity: "error", enabled: true, status: "Existing" },
  { id: "RULE_22", name: "Verify Subtype", description: "Finds features with improper or null subtype values.", appliesTo: "ALL", category: "Field Validation", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_23", name: "Verify Relationship", description: "Finds rows in feature classes and stand-alone tables that violate cardinality or relationship rules defined in a Relationship class.", appliesTo: "ALL", category: "Field Validation", severity: "error", enabled: true, status: "New Proposed" },
];

const SPATIAL_RULES: Rule[] = [
  { id: "RULE_24", name: "Cutbacks", description: "Finds segments where the angle between segments in a polygon or polyline is below a specified minimum value.", appliesTo: "Polyline / Polygon", category: "Geometry", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_25", name: "Duplicate Vertex", description: "Finds vertices from the same feature that are collocated or within a specified tolerance of one another.", appliesTo: "ALL", category: "Geometry", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_26", name: "Nonlinear Segment", description: "Finds polyline or polygon features that contain nonlinear segments such as arcs and curves.", appliesTo: "Polyline / Polygon", category: "Geometry", severity: "info", enabled: true, status: "New Proposed" },
  { id: "RULE_27", name: "Must Be Larger Than Cluster Tolerance", description: "Cluster tolerance is the minimum distance between vertices of features. Vertices within cluster tolerance are defined as coincident and are snapped together; any polyline or polygon feature that would collapse when validating topology is an error.", appliesTo: "ALL", category: "Topology", severity: "error", enabled: true, status: "New Proposed" },
  { id: "RULE_28", name: "Duplicate Feature", description: "Finds features that contain duplicate geometry and attribute values.", appliesTo: "ALL", category: "Geometry", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_29", name: "Unnecessary Nodes", description: "Finds polyline features that share a node and have matching (identical) attribute values in editable fields; such pseudo nodes can often be merged without loss of information.", appliesTo: "Polyline", category: "Geometry", severity: "info", enabled: true, status: "New Proposed" },
  { id: "RULE_30", name: "Find Dangles", description: "Finds polyline endpoints that are not connected to other polyline or polygon features within a specified tolerance.", appliesTo: "Polyline", category: "Topology", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_31", name: "Multipart Polyline", description: "Finds polyline features with more than one part.", appliesTo: "Polyline", category: "Geometry", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_32", name: "Find Disconnected Polylines (Orphans)", description: "Finds polyline features that are not connected to other features in the same or other data sources.", appliesTo: "Polyline", category: "Topology", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_33", name: "Polyline or Path Closes on Self", description: "Finds paths or lines in polyline features that close themselves.", appliesTo: "Polyline", category: "Geometry", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_34", name: "Evaluate Polyline Length", description: "Finds polyline segments, parts, or features that have a length within a specified tolerance.", appliesTo: "Polyline", category: "Geometry", severity: "info", enabled: true, status: "New Proposed" },
  { id: "RULE_35", name: "Must Not Self-Intersect", description: "Lines must not cross or overlap themselves within a feature class or subtype. Lines can touch themselves and touch, intersect, and overlap other lines.", appliesTo: "Polyline", category: "Topology", severity: "error", enabled: true, status: "New Proposed" },
  { id: "RULE_36", name: "Must Not Self-Overlap", description: "Lines must not overlap themselves within a feature class or subtype. Lines can touch, intersect, and overlap lines in another feature class or subtype.", appliesTo: "Polyline", category: "Topology", severity: "error", enabled: true, status: "New Proposed" },
  { id: "RULE_37", name: "Multipart Polygon", description: "Finds polygon features with more than one part.", appliesTo: "Polygon", category: "Geometry", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_38", name: "Polygon Overlap", description: "Finds overlaps between polygon features that are below a specified thinness ratio.", appliesTo: "Polygon", category: "Topology", severity: "error", enabled: true, status: "New Proposed" },
  { id: "RULE_39", name: "Polygon Gap Is Sliver", description: "Finds gaps between two polygon features that are below a specified thinness ratio.", appliesTo: "Polygon", category: "Topology", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_40", name: "Polygon Is Sliver", description: "Finds polygons below a specified thinness ratio (T) and optionally whose area is within a specified threshold.", appliesTo: "Polygon", category: "Geometry", severity: "warning", enabled: true, status: "New Proposed" },
  { id: "RULE_41", name: "Unnecessary Polygon Boundaries", description: "Find shared polygon boundaries with identical attribution.", appliesTo: "Polygon", category: "Geometry", severity: "info", enabled: true, status: "New Proposed" },
  { id: "RULE_42", name: "Evaluate Polygon Perimeter and Area", description: "Find polygons whose area or perimeter is within a specified range.", appliesTo: "Polygon", category: "Geometry", severity: "info", enabled: true, status: "New Proposed" },
  { id: "RULE_43", name: "Unclosed Polygon", description: "Find unclosed polygon rings.", appliesTo: "Polygon", category: "Geometry", severity: "error", enabled: true, status: "New Proposed" },
];

const CONSISTENCY_RULES: Rule[] = [
  { id: "RULE_44", name: "Missing Layers in Current Delivery", description: "Compares the list of layers in the current delivery against the FGDS expected layer list. Reports layers that are missing from the current delivery but were present previously.", appliesTo: "ALL", category: "Consistency", severity: "error", enabled: true, status: "Existing" },
  { id: "RULE_45", name: "Missing Fields in Current Delivery", description: "For each layer that is present, compares its field list against the FGDS schema definition. Reports fields that are missing or have changed type.", appliesTo: "ALL", category: "Consistency", severity: "error", enabled: true, status: "Existing" },
  { id: "RULE_46", name: "Feature Count Comparison with Previous Delivery", description: "Compares the feature count for each layer in this delivery against the count recorded in the previous delivery. Reports layers where count dropped significantly.", appliesTo: "ALL", category: "Consistency", severity: "warning", enabled: true, status: "Existing" },
];

const TRANSFORMATION_RULES: Rule[] = [
  { id: "RULE_47", name: "Fix Geometry Errors", description: "Runs the ArcGIS Repair Geometry geoprocessing tool on each layer to fix invalid geometry before further processing.", appliesTo: "ALL", category: "Transformation", severity: "info", enabled: true, status: "Existing" },
  { id: "RULE_48", name: "Reproject Layer", description: "Runs the ArcGIS Project geoprocessing tool on each layer to reproject from the source CRS to GCS WGS 1984 (GCS_WGS_1984_WKT).", appliesTo: "ALL", category: "Transformation", severity: "info", enabled: true, status: "Existing" },
  { id: "RULE_49", name: "Rename Layers to FGDS Standard", description: "Renames layers in the GDB to match the FGDS canonical naming standard.", appliesTo: "ALL", category: "Transformation", severity: "info", enabled: true, status: "Existing" },
];

const STANDARDIZATION_RULES: Rule[] = [
  { id: "RULE_50", name: "Add Clearinghouse FID", description: "Adds the CH_FID field to every layer in the GDB. Assigns sequential integer values starting from 1. This is the ADSDI mandatory tracking field that uniquely identifies each feature in the clearinghouse.", appliesTo: "ALL", category: "Standardization", severity: "info", enabled: true, status: "Existing" },
];

const ALL_RULES: Rule[] = [
  ...BASE_RULES,
  ...ATTRIBUTE_RULES,
  ...SPATIAL_RULES,
  ...CONSISTENCY_RULES,
  ...TRANSFORMATION_RULES,
  ...STANDARDIZATION_RULES,
];

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; data: Rule[] }[] = [
  { key: "all", label: "All Rules", icon: Filter, data: ALL_RULES },
  { key: "base", label: "Default Rules", icon: Search, data: BASE_RULES },
  { key: "attribute", label: "Attribute Rules", icon: Mail, data: ATTRIBUTE_RULES },
  { key: "spatial", label: "Spatial Rules", icon: Compass, data: SPATIAL_RULES },
  { key: "consistency", label: "Data Consistency Rules", icon: Filter, data: CONSISTENCY_RULES },
  { key: "transformation", label: "Transformation Rules", icon: Wrench, data: TRANSFORMATION_RULES },
  { key: "standardization", label: "Data Standardization Rules", icon: Wrench, data: STANDARDIZATION_RULES },
];

// ------------------------- UI helpers -------------------------

function severityChip(sev: Severity) {
  switch (sev) {
    case "info":
      return "bg-info/15 text-info ring-1 ring-inset ring-info/25";
    case "warning":
      return "bg-warning/15 text-warning ring-1 ring-inset ring-warning/25";
    case "error":
      return "bg-danger/15 text-danger ring-1 ring-inset ring-danger/25";
  }
}

function categoryChipCls() {
  return "text-foreground/85";
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "neutral" | "success" | "danger" | "info" | "muted";
}) {
  const toneMap: Record<string, { card: string; value: string }> = {
    neutral: { card: "", value: "text-foreground" },
    success: { card: "glossy-card--success", value: "text-success" },
    danger: { card: "glossy-card--danger", value: "text-danger" },
    info: { card: "glossy-card--info", value: "text-info" },
    muted: { card: "", value: "text-muted-foreground" },
  };
  const t = toneMap[tone];
  return (
    <Surface className={cn("glossy-card !p-4", t.card)}>
      <div
        className={cn(
          "font-numeric text-[32px] font-bold leading-none tracking-tight",
          t.value,
        )}
      >
        {value}
      </div>
      <div className="mt-2 text-[13px] font-medium tracking-wide text-muted-foreground">
        {label}
      </div>
    </Surface>
  );
}

function QualityRulesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [severity, setSeverity] = useState("All Severities");
  const [status, setStatus] = useState("All Statuses");
  const [ruleDropdownOpen, setRuleDropdownOpen] = useState(false);
  const [rulesByTab, setRulesByTab] = useState<Record<TabKey, Rule[]>>(() =>
    Object.fromEntries(TABS.map((t) => [t.key, t.data])) as Record<TabKey, Rule[]>,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page to 1 when filters or tabs change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, query, category, severity, status]);

  const rules = rulesByTab[activeTab];

  const totals = useMemo(() => {
    const total = rules.length;
    const enabled = rules.filter((r) => r.enabled).length;
    return {
      total,
      enabled,
      passing: 0,
      failing: 0,
      disabled: total - enabled,
    };
  }, [rules]);

  const categories = useMemo(
    () => Array.from(new Set(rules.map((r) => r.category))),
    [rules],
  );

  const filtered = useMemo(() => {
    return rules.filter((r) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !r.name.toLowerCase().includes(q) &&
          !r.id.toLowerCase().includes(q) &&
          !r.description.toLowerCase().includes(q)
        )
          return false;
      }
      if (category !== "All Categories" && r.category !== category) return false;
      if (severity !== "All Severities" && r.severity !== severity.toLowerCase()) return false;
      if (status !== "All Statuses" && r.status !== status) return false;
      return true;
    });
  }, [rules, query, category, severity, status]);

  const paginatedRules = useMemo(() => {
    return filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filtered, currentPage, pageSize]);

  const toggleEnabled = (id: string) => {
    setRulesByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r,
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Quality Rules"
        description="Manage the enterprise rule library — base, attribute, spatial, consistency, transformation and standardization checks."
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Total" value={totals.total} tone="neutral" />
        <KpiCard label="Enabled" value={totals.enabled} tone="success" />
        <KpiCard label="Passing" value={totals.passing} tone="info" />
        <KpiCard label="Failing" value={totals.failing} tone="danger" />
        <KpiCard label="Disabled" value={totals.disabled} tone="muted" />
      </div>

      <Surface className="!p-0">
        {/* Search + filters row */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border/60 p-4">
          <div className="relative w-full sm:w-[300px] shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rules by name, ID..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

          {/* Rules dropdown */}
          <div className="relative">
            <button
              onClick={() => setRuleDropdownOpen(!ruleDropdownOpen)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium transition",
                activeTab !== "all"
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border/60 bg-card/50 text-foreground",
              )}
            >
              {TABS.find((t) => t.key === activeTab)?.label} ({rules.length})
              <ChevronDown className={cn("h-4 w-4 transition-transform", ruleDropdownOpen && "rotate-180")} />
            </button>
            {ruleDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setRuleDropdownOpen(false)} />
                <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] overflow-hidden rounded-lg border border-border/60 bg-card shadow-lg">
                  {TABS.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => { setActiveTab(t.key); setRuleDropdownOpen(false); }}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-[14px] transition hover:bg-foreground/5",
                        activeTab === t.key ? "text-accent font-medium" : "text-foreground/80",
                      )}
                    >
                      <span>{t.label} ({rulesByTab[t.key].length})</span>
                      {activeTab === t.key && <span className="text-accent">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <FilterSelect
            value={category}
            onChange={setCategory}
            options={["All Categories", ...categories]}
          />
          <FilterSelect
            value={severity}
            onChange={setSeverity}
            options={["All Severities", "Info", "Warning", "Error"]}
          />
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={["All Statuses", "Existing", "New Proposed"]}
          />

          <div className="flex-1 min-w-[10px]" />

          <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-success px-4 text-[13px] font-semibold text-white shadow-card transition hover:bg-success/90">
            <Plus className="h-4 w-4" />
            Add Custom Rule
          </button>
        </div>

        {/* Table */}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/80">
                <Th className="w-10 table-sticky-col-1">
                  <input type="checkbox" className="rounded border-border/60 bg-transparent" />
                </Th>
                <Th className="table-sticky-col-2">Rule Name</Th>
                <Th>Description</Th>
                <Th>Applies To</Th>
                <Th>Category</Th>
                <Th>Severity</Th>
                <Th className="text-right pr-6 table-sticky-actions">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedRules.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02]"
                >
                  <Td className="table-sticky-col-1">
                    <input type="checkbox" className="rounded border-border/60 bg-transparent" />
                  </Td>
                  <Td className="table-sticky-col-2">
                    <div className="font-semibold text-foreground">{r.name}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {r.id}
                    </div>
                  </Td>
                  <Td>
                    <p className="max-w-[520px] text-foreground/80">{r.description}</p>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center rounded-md bg-foreground/10 px-2 py-1 text-[11px] font-semibold tracking-wide text-foreground/80 ring-1 ring-inset ring-border/60">
                      {r.appliesTo}
                    </span>
                  </Td>
                  <Td>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[13px]",
                        categoryChipCls(),
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {r.category}
                    </span>
                  </Td>
                  <Td>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-[12px] font-medium capitalize",
                        severityChip(r.severity),
                      )}
                    >
                      {r.severity}
                    </span>
                  </Td>
                  <Td className="pr-6 table-sticky-actions">
                    <div className="flex items-center justify-end gap-1.5">
                      <IconBtn tone="info" label="View">
                        <Eye className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn
                        tone={r.enabled ? "success" : "muted"}
                        label={r.enabled ? "Disable" : "Enable"}
                        onClick={() => toggleEnabled(r.id)}
                      >
                        <Power className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn tone="danger" label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </IconBtn>
                    </div>
                  </Td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-[14px] text-muted-foreground"
                  >
                    No rules match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <TablePagination
          totalItems={filtered.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular="rule"
          itemNamePlural="rules"
        />
      </Surface>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 cursor-pointer appearance-none rounded-lg border border-border/60 bg-card/50 pl-9 pr-8 text-[14px] font-medium text-foreground focus:border-accent/50 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function IconBtn({
  children,
  tone,
  label,
  onClick,
}: {
  children: React.ReactNode;
  tone: "info" | "success" | "danger" | "muted";
  label: string;
  onClick?: () => void;
}) {
  const toneCls: Record<string, string> = {
    info: "text-info hover:bg-info/10 ring-info/20",
    success: "text-success hover:bg-success/10 ring-success/20",
    danger: "text-danger hover:bg-danger/10 ring-danger/20",
    muted: "text-muted-foreground hover:bg-foreground/5 ring-border/60",
  };
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md ring-1 ring-inset transition",
        toneCls[tone],
      )}
    >
      {children}
    </button>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("whitespace-nowrap px-5 py-3 text-left", className)}>{children}</th>
  );
}
function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-5 py-4 align-top", className)}>{children}</td>;
}
