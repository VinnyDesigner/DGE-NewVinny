import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, ChevronsLeftRight } from "lucide-react";
import { useTheme } from "@/lib/theme";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { navGroups, navColorClass, navColorClassLight } from "./nav-config";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme } = useTheme();
  const { state, toggleSidebar } = useSidebar();
  const isLight = false;
  const isCollapsed = state === "collapsed";
  const headerLogo = isLight ? "/SDI For white.png" : "/SDI White.png";
  const collapsedIcon = isLight ? "/sdi for white mini.png" : "/SDI Dark theme mini.png";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border !bg-transparent p-0 [&>[data-sidebar=sidebar]]:relative [&>[data-sidebar=sidebar]]:rounded-none [&>[data-sidebar=sidebar]]:border-0 [&>[data-sidebar=sidebar]]:bg-[linear-gradient(180deg,var(--sidebar-glass-from)_0%,var(--sidebar-glass-to)_100%)] [&>[data-sidebar=sidebar]]:shadow-[var(--sidebar-shadow)] [&>[data-sidebar=sidebar]]:backdrop-blur-xl">
      {/* Edge toggle handle straddling inside and outside */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "absolute top-[78px] z-50 flex h-7 w-7 items-center justify-center rounded-lg border border-border/80 bg-card shadow-[0_4px_12px_rgba(0,0,0,0.35)] text-muted-foreground transition-all hover:bg-accent hover:text-white hover:border-accent/40 focus:outline-none",
          isCollapsed ? "-right-3.5" : "-right-3.5"
        )}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <ChevronsLeftRight className="h-3.5 w-3.5" />
      </button>

      {/* Bottom soft gradient fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-32 rounded-none"
        style={{
          background: isLight
            ? "linear-gradient(to top, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0.06) 50%, transparent 100%)"
            : "linear-gradient(to top, rgba(91, 140, 255, 0.55) 0%, rgba(37, 99, 235, 0.22) 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <SidebarHeader className="px-3 py-5 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-4">
        <div className="flex flex-col gap-2 w-full group-data-[collapsible=icon]:items-center">
          <Link to="/dashboard" className="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
            <img
              src={headerLogo}
              alt="Abu Dhabi Spatial Data"
              className={cn(
                "h-auto w-auto max-w-[190px] object-contain group-data-[collapsible=icon]:hidden",
                !isLight && "sidebar-logo",
              )}
            />
            <img
              src={collapsedIcon}
              alt="SDI"
              className="hidden h-10 w-10 object-contain mx-auto group-data-[collapsible=icon]:block collapsed-logo"
            />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin px-2 py-3 group-data-[collapsible=icon]:!overflow-y-auto group-data-[collapsible=icon]:px-0">


        {navGroups.map((group) => {
          const hasActive = group.items.some((i) => pathname.startsWith(i.url));
          const iconColor = isLight ? navColorClassLight[group.color] : navColorClass[group.color];
          return (
            <Collapsible key={group.label} open={isCollapsed ? true : undefined} defaultOpen={hasActive} className="group/collapsible">
              <SidebarGroup className="py-0 group-data-[collapsible=icon]:px-0">
                <SidebarGroupLabel asChild className="group-data-[collapsible=icon]:hidden">
                  <CollapsibleTrigger className="mt-2 flex w-full items-center justify-between overflow-hidden rounded-md px-2 py-1.5 text-[14px] font-semibold tracking-wide text-white hover:text-white">
                    <span className="truncate">{group.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => {
                        const active = pathname === item.url;
                        return (
                          <SidebarMenuItem key={item.url} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                            <SidebarMenuButton
                              asChild
                              isActive={active}
                              tooltip={item.title}
                              className={cn(
                                "group/item relative h-auto min-h-11 overflow-hidden rounded-xl px-3 py-2 text-[15px] font-medium text-white transition-all",
                                "group-data-[collapsible=icon]:!min-h-10 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!w-10 group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!py-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:!gap-0",
                                "hover:bg-[var(--sidebar-hover)] hover:text-white",
                                !isLight && "data-[active=true]:!bg-[radial-gradient(120%_140%_at_50%_50%,rgba(37,99,235,0.22)_0%,rgba(37,99,235,0.08)_55%,var(--sidebar-active-edge)_100%)]",
                                !isLight && "data-[active=true]:text-sidebar-accent-foreground",
                                !isLight && "data-[active=true]:ring-1 data-[active=true]:ring-inset data-[active=true]:ring-[rgba(91,140,255,0.55)]",
                                !isLight && "data-[active=true]:shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_8px_24px_-8px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]",
                                isLight && active && "!bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_40%,rgba(241,245,249,0.92)_100%)]",
                                isLight && active && "border border-slate-400/25 !shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.05),0_6px_16px_-6px_rgba(15,23,42,0.08)]",
                                isLight && active && "text-[#0f172a]",
                              )}
                            >
                              <Link to={item.url} className="flex w-full items-center gap-3">
                                {active && !isLight && (
                                  <>
                                    <span className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(1px_1px_at_20%_30%,rgba(255,255,255,0.6),transparent_60%),radial-gradient(1px_1px_at_70%_60%,rgba(255,255,255,0.45),transparent_60%),radial-gradient(1px_1px_at_85%_25%,rgba(255,255,255,0.5),transparent_60%),radial-gradient(1px_1px_at_40%_80%,rgba(255,255,255,0.35),transparent_60%)] opacity-70" />
                                    <span className="pointer-events-none absolute inset-y-0 right-0 w-1/3 rounded-r-xl bg-[linear-gradient(90deg,transparent_0%,rgba(91,140,255,0.35)_100%)]" />
                                  </>
                                )}
                                {active && isLight && (
                                  <span className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0.2)_45%,transparent_70%)]" />
                                )}

                                <item.icon
                                  className={cn(
                                    "relative h-[18px] w-[18px] shrink-0 transition-colors",
                                    iconColor,
                                    "group-hover/item:brightness-125",
                                  )}
                                />
                                <span className="relative inline-flex items-center gap-1.5 pr-1 whitespace-nowrap leading-tight group-data-[collapsible=icon]:hidden">
                                  {item.title}
                                  {item.badge === "Live" && (
                                    <span className="relative flex h-2 w-2 shrink-0">
                                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                                      <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                                    </span>
                                  )}
                                </span>
                                {item.badge && item.badge !== "Live" && (
                                  <span
                                    className={cn(
                                      "relative ml-auto shrink-0 rounded-md px-1.5 py-0.5 text-[12px] font-semibold ring-1 ring-inset group-data-[collapsible=icon]:hidden",
                                      "bg-[var(--sidebar-badge-bg)] text-sidebar-accent-foreground ring-[var(--sidebar-badge-border)]",
                                    )}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="space-y-3 p-3 group-data-[collapsible=icon]:hidden">
        <div className="space-y-2.5 rounded-xl border border-foreground/5 bg-[var(--sidebar-footer-bg)] p-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-[14px]">
              <span className="text-white">Storage</span>
              <span className="text-white font-semibold">64%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-foreground/5">
              <div className="h-full w-[64%] rounded-full bg-linear-to-r from-primary to-accent" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 text-[14px]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-white font-medium">All systems operational</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
