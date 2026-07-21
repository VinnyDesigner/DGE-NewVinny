import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/metadata/validation")({
  head: () => ({
    meta: [
      { title: "Metadata Validation — Data Automation Studio" },
      { name: "description", content: "Approval workflows and completeness scoring." },
    ],
  }),
  component: () => (
    <PagePlaceholder eyebrow="Metadata" title="Metadata Validation" description="Approval workflows and completeness scoring." />
  ),
});
