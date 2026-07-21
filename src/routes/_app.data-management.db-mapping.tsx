import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/data-management/db-mapping")({
  head: () => ({
    meta: [
      { title: "Database Mapping — Data Automation Studio" },
      { name: "description", content: "Link registry instances to entity schemas." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="Database Mapping" description="Link registry instances to entity schemas." />
  ),
});
