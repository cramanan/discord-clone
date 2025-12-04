import { createFileRoute, Link, Outlet } from "@tanstack/solid-router";
import {
  MainLayoutContent,
  MainLayoutSidebar,
} from "~/components/layouts/main-layout";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/_authed/channels/@me")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <MainLayoutSidebar>
        <div class="border-b border-b-accent w-full h-12 p-2">
          <Button variant="outline" class="w-full h-full text-sm font-light">
            Recherche ou lance une conversation
          </Button>
        </div>
        <div class="p-2">
          <Link
            to="/channels/@me"
            class={cn(buttonVariants({ variant: "ghost" }), "w-full")}
          >
            Amis
          </Link>
        </div>
      </MainLayoutSidebar>
      <MainLayoutContent>
        <Outlet />
      </MainLayoutContent>
    </>
  );
}
