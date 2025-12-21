import UserRound from "lucide-solid/icons/user-round";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { Tabs, TabsTrigger } from "~/components/ui/tabs";
import { TextField, TextFieldInput } from "~/components/ui/text-field";
import { createSignal, For, Match, Switch } from "solid-js";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Logo } from "~/components/logo";
import { Separator } from "~/components/ui/separator";

export const Route = createFileRoute("/_authed/channels/@me/")({
  component: RouteComponent,
  loader: ({ context }) => context,
});

function Online() {
  const context = Route.useLoaderData();

  return (
    <div class="py-4 px-6 space-y-6">
      <TextField>
        <TextFieldInput
          class="bg-input border-accent pl-10"
          placeholder="Rechercher"
        />
      </TextField>
      <div class="text-sm">En ligne — {0}</div>
      <div>
        <For each={[context().user]}>
          {(user) => (
            <Link
              to="/channels/@me/$uuid"
              params={{ uuid: user.uuid }}
              class="border-t border-accent hover:bg-border hover:rounded-lg flex items-center gap-2 p-2"
            >
              <Avatar>
                <AvatarImage src={user.avatar ?? ""} />
                <AvatarFallback>
                  <Logo class="size-6" />
                </AvatarFallback>
              </Avatar>
              <div class="font-semibold">{user.name}</div>
            </Link>
          )}
        </For>
      </div>
    </div>
  );
}

function All() {
  // TODO: REPLACE WITH ALL RELATIONSHIPS
  return <Online />;
}

function Add() {
  return (
    <div>
      <div class="p-6">
        <h1 class="text-lg font-bold">Ajouter</h1>
        <div class="text-sm text-muted-foreground mb-6">
          Tu peux ajouter des amis grâce à leurs noms d'utilisateur
          Discord-Clone.
        </div>
        <form>
          <TextField>
            <TextFieldInput class="bg-input" placeholder="Rechercher" />
          </TextField>
        </form>
      </div>
      <Separator />
    </div>
  );
}

function RouteComponent() {
  const [page, setPage] = createSignal<"online" | "all" | "add">("add");

  return (
    <div class="border-t border-accent">
      <div class="border-b border-accent h-12 px-6 p-2 flex items-center gap-4">
        <div class="flex items-center gap-2">
          <UserRound class="size-4" /> <span class="text-sm">Amis</span>
        </div>
        <span class="size-1 bg-border rounded-full" />
        <Tabs class="space-x-4" value={page()} onChange={setPage}>
          <TabsTrigger class="data-selected:bg-border" value="online">
            En Ligne
          </TabsTrigger>
          <TabsTrigger class="data-selected:bg-border" value="all">
            Tous
          </TabsTrigger>
          <TabsTrigger
            value="add"
            class="bg-primary data-selected:bg-primary/20 data-selected:text-primary py-1.5"
          >
            Ajouter
          </TabsTrigger>
        </Tabs>
      </div>
      <Switch>
        <Match when={page() === "online"}>
          <Online />
        </Match>
        <Match when={page() === "all"}>
          <All />
        </Match>
        <Match when={page() === "add"}>
          <Add />
        </Match>
      </Switch>
    </div>
  );
}
