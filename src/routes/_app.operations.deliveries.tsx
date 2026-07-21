import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/operations/deliveries")({
  head: () => ({
    meta: [
      { title: "Deliveries — Data Automation Studio" },
      { name: "description", content: "Every completed delivery across entities and layers." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="Deliveries" description="Every completed delivery across entities and layers." />
  ),
});
