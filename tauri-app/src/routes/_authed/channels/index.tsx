import { createFileRoute, redirect } from "@tanstack/solid-router";

export const Route = createFileRoute("/_authed/channels/")({
  loader: () => {
    throw redirect({ to: "/channels/@me" });
  },
});
