import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/data-management/layer-config")({
  head: () => ({
    meta: [
      { title: "Layer Configuration — Data Automation Studio" },
      { name: "description", content: "Configure geospatial and tabular layers across sources." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="Layer Configuration" description="Configure geospatial and tabular layers across sources." />
  ),
});
