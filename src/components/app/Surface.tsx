import type { ReactNode } from "react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";


export function Surface({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "glossy-card relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-card backdrop-blur-xl",
        padded && "p-4 sm:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-foreground/[0.03] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}


export function GlowSurface({
  children,
  className,
  padded = true,
  accent = "primary",
  variant = "full",
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  accent?: "primary" | "success" | "warning" | "danger" | "info" | "secondary";
  variant?: "full" | "corners";
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const tone: Record<string, string> = {
    primary: "bg-primary/20 text-primary",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    danger: "bg-danger/20 text-danger",
    info: "bg-info/20 text-info",
    secondary: "bg-[color:var(--secondary-accent)]/20 text-[color:var(--secondary-accent)]",
  };
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl",
        isLight && "hero-glow-light",
        variant === "full" ? "glow-border glow-outer" : "border border-border/60",
        padded && "p-4 sm:p-6",
        className,
      )}
    >
      {variant === "corners" && !isLight && (
        <>
          {/* Top-right corner glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/40 blur-[80px]" />
          <div className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 rounded-full bg-info/30 blur-[28px]" />
          {/* Bottom-left corner glow */}
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-info/40 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-2 -left-2 h-24 w-24 rounded-full bg-primary/30 blur-[28px]" />
        </>
      )}
      {!isLight && (
        <>
          <div className={cn("pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-60 blur-[80px]", tone[accent])} />
          <div className={cn("pointer-events-none absolute -left-20 -bottom-20 h-40 w-40 rounded-full opacity-40 blur-[70px]", tone[accent])} />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-foreground/[0.03] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}


export function GlowCircle({
  children,
  className,
  size = "md",
  accent = "primary",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  accent?: "primary" | "success" | "warning" | "danger" | "info" | "secondary";
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const tone: Record<string, { from: string; to: string; bg: string; text: string }> = {
    primary: { from: "rgba(91, 140, 255, 0.9)", to: "rgba(37, 99, 235, 0.75)", bg: "rgba(91, 140, 255, 0.10)", text: "#4f7cf7" },
    success: { from: "rgba(16, 185, 129, 0.9)", to: "rgba(6, 182, 212, 0.75)", bg: "rgba(16, 185, 129, 0.10)", text: "#10b981" },
    warning: { from: "rgba(245, 158, 11, 0.9)", to: "rgba(239, 68, 68, 0.75)", bg: "rgba(245, 158, 11, 0.10)", text: "#f59e0b" },
    danger: { from: "rgba(239, 68, 68, 0.9)", to: "rgba(245, 158, 11, 0.75)", bg: "rgba(239, 68, 68, 0.10)", text: "#ef4444" },
    info: { from: "rgba(6, 182, 212, 0.9)", to: "rgba(91, 140, 255, 0.75)", bg: "rgba(6, 182, 212, 0.10)", text: "#06b6d4" },
    secondary: { from: "rgba(124, 58, 237, 0.9)", to: "rgba(91, 140, 255, 0.75)", bg: "rgba(124, 58, 237, 0.10)", text: "#7c3aed" },
  };
  const sizeClass = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-11 w-11" };
  const { from, to, bg, text } = tone[accent];
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-full",
        isLight ? "border border-slate-200/60" : "bg-foreground/[0.02]",
        sizeClass[size],
        className,
      )}
      style={{
        background: isLight ? `linear-gradient(180deg, #ffffff 0%, ${bg} 100%)` : `rgba(255,255,255,0.02)`,
        boxShadow: isLight
          ? `inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px rgba(148,163,184,0.12)`
          : `inset 0 1px 0 color-mix(in srgb, var(--color-foreground) 8%, transparent), 0 0 0 1px color-mix(in srgb, var(--color-foreground) 6%, transparent), 0 0 24px -8px ${from}, 0 0 48px -20px ${to}`,
      }}
    >
      {!isLight && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full p-[1px]"
          style={{
            background: `linear-gradient(135deg, ${from} 0%, color-mix(in srgb, var(--color-foreground) 10%, transparent) 50%, ${to} 100%)`,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}
      <span className={cn("relative z-10", isLight && "opacity-80")} style={isLight ? { color: text } : undefined}>
        {children}
      </span>
    </span>
  );
}


export function StatCard({
  label,
  value,

  hint,
  icon,
  accent = "primary",
  trend,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  accent?: "primary" | "success" | "warning" | "danger" | "info" | "secondary";
  trend?: { value: string; up?: boolean };
}) {
  const tone: Record<string, string> = {
    primary: "from-primary/20 to-primary/0 text-accent",
    success: "from-success/20 to-success/0 text-success",
    warning: "from-warning/20 to-warning/0 text-warning",
    danger: "from-danger/20 to-danger/0 text-danger",
    info: "from-info/20 to-info/0 text-info",
    secondary: "from-secondary-accent/20 to-secondary-accent/0 text-[color:var(--secondary-accent)]",
  };
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 shadow-card backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-elevated">
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-linear-to-br opacity-60 blur-2xl",
          tone[accent],
        )}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[15px] font-medium tracking-wide text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 text-[28px] font-bold leading-none tracking-tight text-foreground">
            {value}
          </div>
          {hint && <div className="mt-2 text-[15px] text-muted-foreground">{hint}</div>}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.04] ring-1 ring-inset ring-foreground/10",
              tone[accent].split(" ").pop(),
            )}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "relative mt-4 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[15px] font-medium",
            trend.up ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
          )}
        >
          {trend.up ? "↑" : "↓"} {trend.value}
        </div>
      )}
    </div>
  );
}
