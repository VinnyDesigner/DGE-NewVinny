import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Data Automation Studio" },
      { name: "description", content: "Workspace, security and notification settings." },
    ],
  }),
  component: () => (
    <PagePlaceholder eyebrow="Administration" title="Settings" description="Workspace, security and notification settings." />
  ),
});
