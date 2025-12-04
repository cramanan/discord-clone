import { createFileRoute, redirect } from "@tanstack/solid-router";

export const Route = createFileRoute("/_authed/channels/")({
  component: RouteComponent,
  beforeLoad: () => {
    throw redirect({ to: "/channels/@me" });
  },
});

function RouteComponent() {
  return <div>Hello "/_authed/channels/"!</div>;
}
