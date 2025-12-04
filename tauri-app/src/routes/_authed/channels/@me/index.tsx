import { createFileRoute, Link } from "@tanstack/solid-router";

export const Route = createFileRoute("/_authed/channels/@me/")({
  component: RouteComponent,
  loader: ({ context }) => context,
});

function RouteComponent() {
  const context = Route.useLoaderData();
  return (
    <div>
      Discuss with yourself{" "}
      <Link
        class="underline"
        to="/channels/@me/$uuid"
        params={{ uuid: context().user.uuid }}
      >
        here
      </Link>
    </div>
  );
}
