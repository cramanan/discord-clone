import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/_authed/inbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authed/inbox"!</div>;
}
