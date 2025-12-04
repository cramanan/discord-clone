import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/_authed/channels/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log(Route.useParams(), Route.useRouteContext());

  return <div>Hello "/_authed/channels/$id"!</div>;
}
