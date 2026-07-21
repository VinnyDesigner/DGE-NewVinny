import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  itemNameSingular?: string;
  itemNamePlural?: string;
}

export function TablePagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  itemNameSingular = "item",
  itemNamePlural = "items",
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Safe page correction if totalItems or pageSize changes
  React.useEffect(() => {
    if (currentPage > totalPages) {
      onPageChange(totalPages);
    }
  }, [totalItems, pageSize, currentPage, totalPages, onPageChange]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-3 text-[14px] text-muted-foreground">
      {/* Left side: Rows per page selector & Info */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => onPageSizeChange(Number(val))}
          >
            <SelectTrigger className="h-8 w-[74px] border-border/60 bg-card/60 text-foreground/80 hover:bg-card/90 transition-all font-semibold">
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60 min-w-[74px]">
              {pageSizeOptions.map((opt) => (
                <SelectItem 
                  key={opt} 
                  value={String(opt)}
                  className="cursor-pointer hover:bg-muted font-semibold text-foreground/80"
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <span>
          Showing {startItem} - {endItem} of {totalItems} {totalItems === 1 ? itemNameSingular : itemNamePlural}
        </span>
      </div>

      {/* Right side: Page navigation */}
      <div className="flex items-center gap-3">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-md border border-border/60 bg-card/60 px-3 py-1.5 text-foreground/70 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-md border border-border/60 bg-card/60 px-3 py-1.5 text-foreground/70 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
