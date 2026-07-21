import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/admin/permissions")({
  head: () => ({
    meta: [
      { title: "Permissions — Data Automation Studio" },
      { name: "description", content: "Granular permissions per entity, layer and action." },
    ],
  }),
  component: () => (
    <PagePlaceholder eyebrow="Administration" title="Permissions" description="Granular permissions per entity, layer and action." />
  ),
});
