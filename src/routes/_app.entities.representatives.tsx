import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Download, Filter, Plus, Search, SlidersHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Surface } from "@/components/app/Surface";
import { TablePagination } from "@/components/app/TablePagination";

export const Route = createFileRoute("/_app/entities/representatives")({
  head: () => ({
    meta: [
      { title: "Representatives — Data Automation Studio" },
      { name: "description", content: "Contacts assigned to entities — profiles, access and credentials." },
    ],
  }),
  component: RepsPage,
});

const rows = [
  { name: "Khalid Al-Farsi", username: "EAD-KFarsi", entity: "EAD", role: "Technical", email: "khalid.alfarsi@example.com", phone: "+971 50 123 4567", dept: "—" },
  { name: "Fatima Al-Zaabi", username: "ADDC-FZaabi", entity: "ADDC", role: "Business", email: "fatima.alzaabi@example.com", phone: "+971 50 765 4321", dept: "Data Management" },
];


function RepsPage() {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
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
  }, [query]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const paginatedRows = useMemo(() => {
    return filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredRows, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Representatives"
        description="Contacts assigned to entities — manage profiles, access and credentials"
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-b from-primary to-primary/90 px-3 py-2 text-[15px] font-medium text-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]">
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
          itemNameSingular="representative"
          itemNamePlural="representatives"
        />
      </Surface>
    </div>
  );
}

function IconBtn({ children, label, tone }: { children: React.ReactNode; label: string; tone?: "danger" }) {
  return (
    <button
      aria-label={label}
      className={`flex h-7 w-7 items-center justify-center rounded-md border border-foreground/10 bg-foreground/[0.03] ${tone === "danger" ? "text-danger hover:bg-danger/10 hover:border-danger/40" : "text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-foreground/[0.06]"}`}
    >
      {children}
    </button>
  );
}
