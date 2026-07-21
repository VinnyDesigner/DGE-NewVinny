import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/data-management/mapping")({
  head: () => ({
    meta: [
      { title: "Data Mapping — Data Automation Studio" },
      { name: "description", content: "Map source fields to target schemas with lineage tracking." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="Data Mapping" description="Map source fields to target schemas with lineage tracking." />
  ),
});
