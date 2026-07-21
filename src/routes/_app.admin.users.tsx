import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/admin/users")({
  head: () => ({
    meta: [
      { title: "Users — Data Automation Studio" },
      { name: "description", content: "Manage workspace users and identity provider integration." },
    ],
  }),
  component: () => (
    <PagePlaceholder eyebrow="Administration" title="Users" description="Manage workspace users and identity provider integration." />
  ),
});
