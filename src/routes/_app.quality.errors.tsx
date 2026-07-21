import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/quality/errors")({
  head: () => ({
    meta: [
      { title: "Error Logs — Data Automation Studio" },
      { name: "description", content: "Every rule violation with drill-through context." },
    ],
  }),
  component: () => (
    <PagePlaceholder eyebrow="Quality Rules" title="Error Logs" description="Every rule violation with drill-through context." />
  ),
});
