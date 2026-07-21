import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Download, Filter, Plus, Search, SlidersHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";

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

const rows = [
  { name: "Abu Dhabi Digital Authority", code: "ADDA", type: "Semi-Government", date: "2026-04-25", sectors: ["Digital", "Technology"] },
  { name: "Environment Agency Abu Dhabi", code: "EAD", type: "Government", date: "2026-04-25", sectors: ["Environment", "Climate"] },
  { name: "Dept of Government Enablement", code: "DGE", type: "Semi-Government", date: "2026-04-26", sectors: ["Government", "Policy"] },
  { name: "Abu Dhabi Distribution Company", code: "ADDC", type: "State-Owned", date: "—", sectors: ["Utilities", "Power Distribution"] },
  { name: "Abu Dhabi Housing Authority", code: "ADHA", type: "Government", date: "2026-04-25", sectors: ["Housing", "Urban Development"] },
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
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all-types");

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
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
  }, [query, typeFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, typeFilter]);

  const paginatedRows = useMemo(() => {
    return filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredRows, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entity"
        description="Entity onboarding and management"
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-b from-primary to-primary/90 px-3 py-2 text-[15px] font-medium text-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]">
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
                <SelectItem value="Semi-Government" className="cursor-pointer text-[14.5px]">Semi-Government</SelectItem>
                <SelectItem value="Government" className="cursor-pointer text-[14.5px]">Government</SelectItem>
                <SelectItem value="State-Owned" className="cursor-pointer text-[14.5px]">State-Owned</SelectItem>
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
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
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
                      <IconBtn label="Delete" tone="danger"><Trash2 className="h-3.5 w-3.5" /></IconBtn>
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

function IconBtn({ children, label, tone }: { children: React.ReactNode; label: string; tone?: "danger" }) {
  return (
    <button
      aria-label={label}
      className={`flex h-7 w-7 items-center justify-center rounded-md border border-foreground/10 bg-foreground/[0.03] transition-colors ${tone === "danger" ? "text-danger hover:bg-danger/10 hover:border-danger/40" : "text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-foreground/[0.06]"}`}
    >
      {children}
    </button>
  );
}
