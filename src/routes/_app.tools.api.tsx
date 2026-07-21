import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/tools/api")({
  head: () => ({
    meta: [
      { title: "API Management — Data Automation Studio" },
      { name: "description", content: "API keys, quotas, rate limits and audit." },
    ],
  }),
  component: () => (
    <PagePlaceholder eyebrow="Tool Management" title="API Management" description="API keys, quotas, rate limits and audit." />
  ),
});
