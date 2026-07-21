import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/admin/health")({
  head: () => ({
    meta: [
      { title: "System Health — Data Automation Studio" },
      { name: "description", content: "Service health, latency and infrastructure status." },
    ],
  }),
  component: () => (
    <PagePlaceholder eyebrow="Administration" title="System Health" description="Service health, latency and infrastructure status." />
  ),
});
