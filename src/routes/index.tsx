import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  loader: () => {
    // We can keep the redirect but it will only happen after hydration if we're careful.
    // For the application, we want to show the instructions page if visited directly,
    // but the actual "app" is the dashboard/store.
    // Let's redirect to dashboard by default as per existing logic.
    throw redirect({ to: "/dashboard" });
  },
});

