import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Command,
  Search,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/theme";

export function AppTopbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animating search terms
  const searchTerms = ["entities", "jobs", "metadata"];
  const [termIndex, setTermIndex] = useState(0);
  const [fadeState, setFadeState] = useState("fade-in");

  const [isSearchHovered, setIsSearchHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("fade-out");
      setTimeout(() => {
        setTermIndex((prev) => (prev + 1) % searchTerms.length);
        setFadeState("fade-in");
      }, 300); // Duration of fade-out transition
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-40 flex h-[68px] items-center gap-3 bg-linear-to-r from-transparent via-[color-mix(in_srgb,var(--background)_55%,transparent)] to-[color-mix(in_srgb,var(--background)_95%,transparent)] backdrop-blur-lg border-b border-foreground/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] px-3 sm:px-4 lg:px-5">

      {/* Title & Status */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[22px] xs:text-[24px] sm:text-[26px] md:text-[27px] lg:text-[28px] font-black tracking-tight text-foreground">
          Data Automation Studio
        </span>
      </div>

      {/* Search & Actions */}
      <div className="ml-auto flex flex-1 items-center justify-end gap-2">
        <div
          className="relative flex items-center"
          onMouseEnter={() => setIsSearchHovered(true)}
          onMouseLeave={() => setIsSearchHovered(false)}
        >
          {/* Responsive Wide Search bar, visible only on lg and above */}
          <button
            type="button"
            className="group hidden h-8 w-[200px] items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-2.5 text-[13.5px] text-muted-foreground transition-colors hover:border-accent/40 hover:bg-card lg:flex"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate text-left flex items-center gap-1">
              Search
              <span
                className={`transition-all duration-300 transform inline-block font-medium text-accent w-[70px] text-left ${
                  fadeState === "fade-in"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-1"
                }`}
              >
                {searchTerms[termIndex]}
              </span>
              …
            </span>
            <kbd className="ml-auto hidden xl:flex items-center gap-0.5 rounded-md border border-foreground/10 bg-foreground/5 px-1 py-0.5 text-[10.5px] text-foreground/60 shrink-0">
              <Command className="h-2 w-2" /> K
            </kbd>
          </button>

          {/* Hover-expandable search overlay below lg */}
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-out flex items-center lg:hidden ${
              isSearchHovered
                ? "w-[220px] opacity-100 scale-100 pointer-events-auto"
                : "w-8 opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <button
              type="button"
              className="flex h-8 w-full items-center gap-2 rounded-lg border border-border/80 bg-card/95 backdrop-blur-md px-2.5 shadow-lg text-[13px] text-muted-foreground hover:border-accent/40"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate text-left flex items-center gap-1">
                Search
                <span
                  className={`transition-all duration-300 transform inline-block font-medium text-accent w-[70px] text-left ${
                    fadeState === "fade-in"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-1"
                  }`}
                >
                  {searchTerms[termIndex]}
                </span>
                …
              </span>
            </button>
          </div>

          {/* Small Search icon button, visible below lg */}
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-foreground/5 hover:text-foreground lg:hidden ${
              isSearchHovered ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
            }`}
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="flex items-center"
          >
            <DropdownMenuTrigger className="flex h-8 items-center gap-1.5 transition-colors hover:text-accent focus:outline-none">
              <div className={`flex h-7 w-7 items-center justify-center rounded text-[13px] font-semibold shrink-0 ${
                theme === "light"
                  ? "bg-linear-to-br from-[#e0ecff] to-[#c7dcff] text-[#2563eb] ring-1 ring-inset ring-[#2563eb]/20"
                  : "bg-linear-to-br from-accent to-secondary-accent text-white"
              }`}>
                AM
              </div>
              {/* Responsive username text, hidden below xl to avoid collisions */}
              <div className="hidden text-left text-[13.5px] leading-tight xl:block">
                <div className="font-medium text-foreground">Ahmed Al Mansouri</div>
                <div className="text-[11px] text-success">Super Admin</div>
              </div>
              <ChevronDown className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 border-border/60 bg-elevated"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <DropdownMenuLabel className="flex items-center gap-2.5 py-2.5">
                <div className={`flex h-9 w-9 items-center justify-center rounded text-[14px] font-semibold ${
                  theme === "light"
                    ? "bg-linear-to-br from-[#e0ecff] to-[#c7dcff] text-[#2563eb] ring-1 ring-inset ring-[#2563eb]/20"
                    : "bg-linear-to-br from-accent to-secondary-accent text-white"
                }`}>
                  AM
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-medium text-foreground">Ahmed Al Mansouri</div>
                  <div className="flex items-center gap-1.5 text-[12px] text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Super Admin
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-danger focus:bg-danger/15 focus:text-danger! dark:focus:bg-danger/20 dark:focus:text-danger! cursor-pointer group">
                <Link to="/login" className="flex items-center gap-2 w-full">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/10 ring-1 ring-inset ring-destructive/20 group-focus:bg-danger/20 group-hover:bg-danger/20 group-focus:ring-danger/35 group-hover:ring-danger/35 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-medium">Sign Out</span>
                    <span className="text-[12px] text-muted-foreground group-focus:text-danger/80 group-hover:text-danger/80 transition-colors">End your session</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </div>
        </DropdownMenu>
      </div>
    </header>
  );
}
