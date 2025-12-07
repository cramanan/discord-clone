import { createFileRoute, redirect } from "@tanstack/solid-router";
import { api } from "~/actions/api";
import { Logo } from "~/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { UserSchema } from "~/types/schemas";

export const Route = createFileRoute("/_authed/channels/@me/$uuid")({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      return await api(`/users/${params.uuid}`, "GET").then(UserSchema.parse);
    } catch {
      throw redirect({ to: "/channels/@me" });
    }
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const user = Route.useLoaderData();
  return (
    <div class="border-t border-accent">
      <div class="border-b border-accent  w-full h-12 p-2 flex items-center gap-2">
        <Avatar class="size-6">
          <AvatarImage src={user().avatar ?? ""} />
          <AvatarFallback>
            <Logo class="size-4" />
          </AvatarFallback>
        </Avatar>
        <span>{user().name}</span>
      </div>
      Hello "/_authed/channels/@me/{params().uuid}"!
    </div>
  );
}
