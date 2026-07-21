import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/quality/enforcement")({
  head: () => ({
    meta: [
      { title: "Rule Enforcement — Data Automation Studio" },
      {
        name: "description",
        content:
          "Per-entity Data Quality rule enforcement. Overrides resolve to Strict, Warning, or Skip.",
      },
    ],
  }),
  component: RuleEnforcementPage,
});

// ------------------------- Mock Data -------------------------

const ENTITIES = [
  { id: "ADDA", name: "ADDA — Abu Dhabi Digital Authority" },
  { id: "EAD", name: "EAD — Environment Agency Abu Dhabi" },
  { id: "DGE", name: "DGE — Dept of Government Enablement" },
  { id: "ADDC", name: "ADDC — Abu Dhabi Distribution Company" },
  { id: "ADHA", name: "ADHA — Abu Dhabi Housing Authority" },
  { id: "TWS", name: "TWS — TAQA Water Solutions" },
];

const CHECKS_DATA = [
  { id: "VERIFY_GEODATABASE_AVAILABILITY", name: "Geodatabase Availability", category: "Schema", default: "Strict" },
  { id: "VERIFY_LAYERS_AVAILABILITY", name: "Expected Layers Present", category: "Schema", default: "Strict" },
  { id: "VERIFY_DISK_SPACE", name: "Sufficient Disk Space", category: "Schema", default: "Warning" },
  { id: "PATCH_LAYERS_WITH_FGDS", name: "Match Layers vs FGDS (gate)", category: "Schema", default: "Strict" },
  { id: "RECORD_LAYER_SCHEMA", name: "Record Layer Schema", category: "Schema", default: "Skip" },
  { id: "VERIFY_FIELD_TYPES_MATCH", name: "Field Types Match Schema", category: "Schema", default: "Strict" },
  { id: "RECORD_FEATURE_COUNT", name: "Record Feature Count", category: "Schema", default: "Skip" },
  { id: "VERIFY_LAYERS_PROJECTION", name: "Layer Projection (WGS84/4326)", category: "Spatial", default: "Strict" },
  { id: "VERIFY_LAYER_GEOM_TYPE", name: "Geometry Type Match", category: "Geometry", default: "Strict" },
  { id: "VERIFY_LAYER_COVERAGE_AREA", name: "Coverage Area Containment", category: "Spatial", default: "Warning" },
  { id: "RECORD_NULL_ZERO_VALUES", name: "Record Null/Zero Values", category: "Schema", default: "Skip" },
  { id: "VERIFY_LAYER_INVALID_CHARS", name: "Invalid Characters in Values", category: "Field Validation", default: "Warning" },
  { id: "VERIFY_LAYER_DOMAIN_VALUES", name: "Domain Value Compliance", category: "Field Validation", default: "Warning" },
  { id: "VERIFY_FIELD_DUPLICATE_VALUES", name: "Duplicate Field Values", category: "Field Validation", default: "Warning" },
  { id: "FIELD_SHOULD_NOT_BE_NULL", name: "Required Field Not Null", category: "Field Validation", default: "Strict" },
  { id: "VALIDATE_EMAIL_FORMAT", name: "Email Format", category: "Field Validation", default: "Strict" },
  { id: "VALIDATE_PHONE_FORMAT_UAE", name: "UAE Phone Number Format", category: "Field Validation", default: "Warning" },
  { id: "VALIDATE_DATE_FORMAT_ISO", name: "ISO-8601 Date Format", category: "Field Validation", default: "Strict" },
  { id: "CHECK_COORDINATE_PRECISION", name: "Coordinate Precision Check", category: "Spatial", default: "Warning" },
  { id: "CHECK_SHAPE_INTEGRITY", name: "Shape Integrity Validation", category: "Geometry", default: "Strict" },
  { id: "CHECK_METADATA_EXISTENCE", name: "Metadata Validity", category: "Metadata", default: "Warning" },
  { id: "CHECK_CRITICAL_ATTRIBUTES", name: "Critical Attributes Check", category: "Field Validation", default: "Strict" },
  { id: "CHECK_SPATIAL_INDEX", name: "Spatial Index Status", category: "Spatial", default: "Skip" },
  { id: "CHECK_ORPHANED_FEATURES", name: "Orphaned Features Check", category: "Topology", default: "Warning" },
  { id: "CHECK_EXTENT_VALIDITY", name: "Bounding Box Extent Check", category: "Spatial", default: "Warning" },
  { id: "CHECK_ATTRIBUTE_ENCODING", name: "Character Encoding Check", category: "Field Validation", default: "Strict" },
  { id: "CHECK_SQL_INJECTION", name: "SQL Injection Validation", category: "Security", default: "Strict" },
];

const TRANSFORMS_DATA = [
  { id: "TRANSFORM_COORDINATE_REPROJECTION", name: "Coordinate Reprojection", category: "Spatial", default: "Strict" },
  { id: "TRANSFORM_SHAPE_SIMPLIFICATION", name: "Shape Simplification", category: "Geometry", default: "Warning" },
  { id: "TRANSFORM_SCHEMA_MAPPING", name: "Schema Attribute Mapping", category: "Schema", default: "Strict" },
  { id: "TRANSFORM_FIELD_TRIM", name: "Whitespace Trim", category: "Field Validation", default: "Skip" },
  { id: "TRANSFORM_DATE_STANDARDIZATION", name: "Date Format Standardization", category: "Field Validation", default: "Strict" },
  { id: "TRANSFORM_UPPERCASE_CODES", name: "Uppercase Codes Conversion", category: "Field Validation", default: "Skip" },
  { id: "TRANSFORM_NULL_REPLACEMENT", name: "Default Value Replacement", category: "Field Validation", default: "Warning" },
];

function RuleEnforcementPage() {
  const [selectedEntity, setSelectedEntity] = useState("ADDA");
  const [activeTab, setActiveTab] = useState<"checks" | "transforms">("checks");
  const [query, setQuery] = useState("");

  // Per-entity overrides state: { [entityId]: { [ruleId]: enforcementValue } }
  const [overrides, setOverrides] = useState<Record<string, Record<string, "Strict" | "Warning" | "Skip">>>({
    ADDA: {
      VERIFY_GEODATABASE_AVAILABILITY: "Strict",
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset pagination when filter/search/tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, query, selectedEntity]);

  const activeListData = activeTab === "checks" ? CHECKS_DATA : TRANSFORMS_DATA;

  // Filtered list
  const filtered = useMemo(() => {
    return activeListData.filter((r) => {
      if (query) {
        const q = query.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeListData, query]);

  // Paginated list
  const paginated = useMemo(() => {
    return filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filtered, currentPage, pageSize]);

  // Total override counts for currently selected entity
  const entityOverrides = useMemo(() => {
    return overrides[selectedEntity] || {};
  }, [overrides, selectedEntity]);

  const totalOverrides = Object.keys(entityOverrides).length;

  const handleOverride = (ruleId: string, value: "Strict" | "Warning" | "Skip") => {
    setOverrides((prev) => {
      const currentEntityOverrides = prev[selectedEntity] || {};
      return {
        ...prev,
        [selectedEntity]: {
          ...currentEntityOverrides,
          [ruleId]: value,
        },
      };
    });
  };

  const handleClear = (ruleId: string) => {
    setOverrides((prev) => {
      const currentEntityOverrides = { ...(prev[selectedEntity] || {}) };
      delete currentEntityOverrides[ruleId];
      return {
        ...prev,
        [selectedEntity]: currentEntityOverrides,
      };
    });
  };

  const catalogDefaultBadgeCls = (def: string) => {
    switch (def) {
      case "Strict":
        return "bg-danger/15 text-danger ring-danger/25";
      case "Warning":
        return "bg-warning/15 text-warning ring-warning/25";
      case "Skip":
        return "bg-info/15 text-info ring-info/25";
      default:
        return "bg-foreground/10 text-foreground ring-border/60";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rule Enforcement"
        description="Per-entity Data Quality rule enforcement. Checks resolve to Strict / Warning / Skip (entity override → catalog default). Transforms have a binary Enabled / Skip control — an entity may skip a transform, but a transform that runs keeps its own failure policy."
      />

      <Surface padded={false} className="overflow-hidden">
        {/* Top filter section */}
        <div className="flex flex-col gap-4 border-b border-border/60 p-5 sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-semibold text-muted-foreground/80">Entity</span>
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="h-10 w-[320px] border-border/60 bg-card/60 text-foreground hover:bg-card/90 transition-all font-semibold">
                <SelectValue placeholder="Select Entity..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60 w-[320px]">
                {ENTITIES.map((ent) => (
                  <SelectItem key={ent.id} value={ent.id}>
                    {ent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full sm:w-[300px] shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rules, DB name, entity..."
              className="h-9 w-full rounded-lg border border-border/60 bg-card/50 pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* Tab & Info summary strip */}
        <div className="flex flex-col gap-3 border-b border-border/40 bg-foreground/[0.01] p-5 sm:flex-row sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("checks")}
              className={cn(
                "rounded-lg px-4 py-1.5 text-[14px] font-bold tracking-wider transition-all uppercase",
                activeTab === "checks"
                  ? "bg-accent/20 text-accent ring-1 ring-inset ring-accent/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Checks
            </button>
            <button
              onClick={() => setActiveTab("transforms")}
              className={cn(
                "rounded-lg px-4 py-1.5 text-[14px] font-bold tracking-wider transition-all uppercase",
                activeTab === "transforms"
                  ? "bg-accent/20 text-accent ring-1 ring-inset ring-accent/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Transforms
            </button>
          </div>

          <div className="text-[14px] font-semibold text-muted-foreground/80">
            {CHECKS_DATA.length} check(s) · {TRANSFORMS_DATA.length} transform(s) · {totalOverrides} overridden for this entity.
          </div>
        </div>

        {/* Table list view */}
        <div className="table-container-scrollable scrollbar-thin">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border/60 bg-foreground/[0.04] text-[12px] font-bold tracking-wide text-muted-foreground/70 uppercase">
                <th className="px-5 py-3.5 w-1/3 table-sticky-single-left">Rule</th>
                <th className="px-5 py-3.5 w-[140px] text-center">Catalog Default</th>
                <th className="px-5 py-3.5 text-left table-sticky-actions">Enforcement (This Entity)</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => {
                const isOverridden = r.id in entityOverrides;
                const enforcement = isOverridden ? entityOverrides[r.id] : r.default;

                return (
                  <tr
                    key={r.id}
                    className="border-b border-border/40 last:border-0 hover:bg-foreground/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4.5 align-top table-sticky-single-left">
                      <div className="font-semibold text-foreground text-[15px]">{r.name}</div>
                      <div className="mt-1 font-mono text-[11px] text-muted-foreground/80 tracking-wide">
                        {r.id} · <span className="font-semibold text-accent/90">{r.category}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4.5 align-top text-center">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-bold tracking-wide ring-1 ring-inset uppercase",
                          catalogDefaultBadgeCls(r.default)
                        )}
                      >
                        {r.default}
                      </span>
                    </td>

                    <td className="px-5 py-4.5 align-top table-sticky-actions">
                      <div className="flex items-center justify-between gap-4">
                        {/* Custom Radios */}
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-foreground/80 hover:text-foreground">
                            <input
                              type="radio"
                              name={`rule-enforce-${r.id}`}
                              checked={enforcement === "Strict"}
                              onChange={() => handleOverride(r.id, "Strict")}
                              className="accent-primary h-3.5 w-3.5"
                            />
                            <span>
                              Strict <span className="text-muted-foreground/60 font-normal text-[11px]">- fail on violation</span>
                            </span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-foreground/80 hover:text-foreground">
                            <input
                              type="radio"
                              name={`rule-enforce-${r.id}`}
                              checked={enforcement === "Warning"}
                              onChange={() => handleOverride(r.id, "Warning")}
                              className="accent-primary h-3.5 w-3.5"
                            />
                            <span>
                              Warning <span className="text-muted-foreground/60 font-normal text-[11px]">- record & continue</span>
                            </span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-foreground/80 hover:text-foreground">
                            <input
                              type="radio"
                              name={`rule-enforce-${r.id}`}
                              checked={enforcement === "Skip"}
                              onChange={() => handleOverride(r.id, "Skip")}
                              className="accent-primary h-3.5 w-3.5"
                            />
                            <span>
                              Skip <span className="text-muted-foreground/60 font-normal text-[11px]">- do not run</span>
                            </span>
                          </label>
                        </div>

                        {/* Status Badge + Clear override trigger */}
                        <div className="flex items-center gap-2.5 min-w-[120px] justify-end">
                          {isOverridden ? (
                            <>
                              <span className="inline-flex items-center rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent ring-1 ring-inset ring-accent/30">
                                OVERRIDE
                              </span>
                              <button
                                onClick={() => handleClear(r.id)}
                                className="inline-flex items-center gap-1 text-[12px] font-bold text-muted-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-md px-1.5 py-0.5 border border-border/40 transition-all"
                                title="Clear Override"
                              >
                                <RotateCcw className="h-3 w-3" /> Clear
                              </button>
                            </>
                          ) : (
                            <span className="inline-flex items-center rounded-md bg-foreground/5 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground/75 ring-1 ring-inset ring-border/30">
                              DEFAULT
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <HelpCircle className="h-10 w-10 text-muted-foreground/50" />
                      <div className="text-[16px] font-semibold text-foreground">No rules found</div>
                      <div className="text-[14px] text-muted-foreground">
                        Try modifying your query or selecting another tab.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic pagination footer */}
        <TablePagination
          totalItems={filtered.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemNameSingular={activeTab === "checks" ? "check" : "transform"}
          itemNamePlural={activeTab === "checks" ? "checks" : "transforms"}
        />
      </Surface>
    </div>
  );
}
