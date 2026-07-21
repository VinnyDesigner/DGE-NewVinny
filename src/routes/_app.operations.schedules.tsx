import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/app/PagePlaceholder";

export const Route = createFileRoute("/_app/operations/schedules")({
  head: () => ({
    meta: [
      { title: "Schedules — Data Automation Studio" },
      { name: "description", content: "Cron and calendar-based orchestration at scale." },
    ],
  }),
  component: () => (
    <PagePlaceholder title="Schedules" description="Cron and calendar-based orchestration at scale." />
  ),
});
