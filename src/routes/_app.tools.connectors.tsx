import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/tools/connectors")({
  head: () => ({
    meta: [
      { title: "Connectors — Data Automation Studio" },
      { name: "description", content: "Managed connectors for databases, APIs and files." },
    ],
  }),
  component: () => (
    <PagePlaceholder eyebrow="Tool Management" title="Connectors" description="Managed connectors for databases, APIs and files." />
  ),
});
