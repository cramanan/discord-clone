import { createFileRoute, redirect } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => redirect({ to: "/channels/@me" }),
});
