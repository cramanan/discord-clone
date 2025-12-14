import { createFileRoute, Link, Outlet } from "@tanstack/solid-router";
import UserRound from "lucide-solid/icons/user-round";
import Plus from "lucide-solid/icons/plus";
import {
  MainLayoutContent,
  MainLayoutSidebar,
} from "~/components/layouts/main-layout";
import { Button, buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { For } from "solid-js";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Logo } from "~/components/logo";

export const Route = createFileRoute("/_authed/channels/@me")({
  component: RouteComponent,
});

function RecentRelationships() {
  const context = Route.useRouteContext();
  return (
    <div class="space-y-4 py-4">
      <For
        each={[context().user, context().user, context().user, context().user]}
      >
        {(user) => (
          <Link
            to="/channels/@me/$uuid"
            params={{ uuid: user.uuid }}
            class="flex items-center gap-2"
          >
            <Avatar>
              <AvatarImage src={user.avatar ?? ""} />
              <AvatarFallback>
                <Logo class="size-6" />
              </AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </Link>
        )}
      </For>
    </div>
  );
}

function RouteComponent() {
  return (
    <>
      <MainLayoutSidebar>
        <div class="border-b border-b-accent w-full h-12 p-2">
          <Button variant="outline" class="w-full h-full text-sm font-light">
            Recherche ou lance une conversation
          </Button>
        </div>
        <div class="p-2 space-y-2">
          <Link
            to="/channels/@me"
            class={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start"
            )}
            activeOptions={{ exact: true }}
            activeProps={{ class: "bg-accent" }}
          >
            <UserRound /> Amis
          </Link>
          <Separator />
          <div class="px-2">
            <div class="flex items-center justify-between">
              <span class="w-full text-sm text-muted-foreground hover:text-primary-foreground select-none">
                Messages privés
              </span>
              <Plus class="size-4 stroke-muted-foreground" />
            </div>
            <RecentRelationships />
          </div>
        </div>
      </MainLayoutSidebar>
      <MainLayoutContent>
        <Outlet />
      </MainLayoutContent>
    </>
  );
}
