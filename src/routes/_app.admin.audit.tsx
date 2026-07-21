import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/admin/audit")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Data Automation Studio" },
      { name: "description", content: "Immutable audit trail across the platform." },
    ],
  }),
  component: () => (
    <PagePlaceholder eyebrow="Administration" title="Audit Logs" description="Immutable audit trail across the platform." />
  ),
});
