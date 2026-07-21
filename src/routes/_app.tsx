import type React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { GradientOrbs } from "@/components/app/GradientOrbs";
import { ThemeProvider, useTheme } from "@/lib/theme";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <ThemeProvider>
      <ThemedAppShell />
    </ThemeProvider>
  );
}

function ThemedAppShell() {
  const { theme } = useTheme();

  return (
    <SidebarProvider data-theme={theme} className="[data-theme=light]:bg-background" style={{ "--sidebar-width-icon": "4.5rem" } as React.CSSProperties}>
      <GradientOrbs />
      <div className="relative z-10 flex min-h-dvh w-full">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-transparent">
          <AppTopbar />
          <main className="w-full min-w-0 max-w-full flex-1 overflow-x-hidden px-3 py-6 sm:px-4 lg:px-5">
            <Outlet />
          </main>

        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
