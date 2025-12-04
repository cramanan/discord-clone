import { createFileRoute } from "@tanstack/solid-router";
import { Toaster } from "~/components/ui/toast";

export const Route = createFileRoute("/_authed/channels/@me/$uuid")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return (
    <div>
      <Toaster />
      Hello "/_authed/channels/@me/{params().uuid}"!
    </div>
  );
}
