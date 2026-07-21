import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/admin/roles")({
  head: () => ({
    meta: [
      { title: "Roles — Data Automation Studio" },
      { name: "description", content: "Role definitions and permission bundles." },
    ],
  }),
  component: () => (
    <PagePlaceholder eyebrow="Administration" title="Roles" description="Role definitions and permission bundles." />
  ),
});
