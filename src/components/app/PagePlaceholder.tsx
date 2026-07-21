import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { Surface } from "./Surface";
import { Sparkles } from "lucide-react";

type Props = {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
};

/**
 * Consistent scaffolding for content-heavy pages. Screens that don't yet have
 * a dedicated bespoke layout use this to maintain the design system feel.
 */
export function PagePlaceholder({ title, description, eyebrow, children }: Props) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      {children ?? (
        <Surface className="min-h-[420px]">
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/30 to-secondary-accent/30 ring-1 ring-inset ring-foreground/10">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <div className="space-y-1.5">
              <div className="text-h4 text-foreground">Module ready</div>
              <p className="max-w-md text-[16px] text-muted-foreground">
                Workflow preserved · UI redesigned. This surface uses the same design
                system, spacing and interactions as the rest of the platform.
              </p>
            </div>
          </div>
        </Surface>
      )}
    </div>
  );
}

