import { useMutation, useQuery } from "@tanstack/solid-query";
import { createFileRoute, Link } from "@tanstack/solid-router";
import { Flex } from "~/components/ui/flex";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { User } from "~/types";
import UsersRound from "lucide-solid/icons/user-round";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { createSignal, For, Match, onMount, Switch } from "solid-js";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { TextField, TextFieldInput } from "~/components/ui/text-field";
import { createForm } from "@tanstack/solid-form";
import z from "zod";
import { api } from "~/actions/api";
import { authenticate } from "~/actions/loaders";
import MainSidebar from "~/components/layouts/main-sidebar";

export const Route = createFileRoute("/")({
  loader: authenticate,
  component: RouteComponent,
});

const pageKeyLabels = {
  online: "En ligne",
  all: "Tous les amis",
  pending: "En attente",
};

type PageKey = keyof typeof pageKeyLabels;

function Friends(props: { pageKey: PageKey }) {
  const query = useQuery(() => ({
    queryKey: ["friends"],
    queryFn: (): User[] => [
      {
        uuid: "6255e7c7-111c-4da2-bf8c-f4ce8200254b",
        name: "John",
        email: "example@email.com",
        avatar: "https://github.com/shadcn.png",
      },
      {
        uuid: "4726b70b-755d-47ba-90bd-51220264f089",
        name: "John",
        email: "example1@email.com",

        avatar: "https://github.com/shadcn.png",
      },
      {
        uuid: "ac8d0a0c-69d6-4198-9a94-079fec66fea2",
        name: "John",
        email: "example2@email.com",
        avatar: "https://github.com/shadcn.png",
      },
    ],
  }));

  return (
    <div class="py-4 px-6">
      <TextField>
        <TextFieldInput />
      </TextField>
      <div class="py-6 text-sm">
        {pageKeyLabels[props.pageKey]} — {0}
      </div>
      <div>
        <For each={query.data}>
          {(user) => (
            <Link
              to="/discussions/$userUuid"
              params={{ userUuid: user.uuid }}
              class="flex gap-2 border-t border-t-accent p-2 hover:bg-accent hover:rounded-md "
            >
              <div class="relative">
                <Avatar class="size-9">
                  <AvatarImage src={user.avatar ?? ""} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span class="absolute size-3 bg-gray-600 bottom-0 right-0 rounded-full border-2 border-background" />
              </div>
              <div class="text-sm">
                <div class="font-semibold">{user.name}</div>
                <div class="text-muted-foreground ">{"status"}</div>
              </div>
            </Link>
          )}
        </For>
      </div>
    </div>
  );
}

const QuickFriendRequestSchema = z.object({
  addressee: z.string().trim().nonempty(),
});

type QuickFriendRequest = z.infer<typeof QuickFriendRequestSchema>;

function Add() {
  const mutation = useMutation(() => ({
    mutationKey: ["quick-friendship"],
    mutationFn: async (payload: QuickFriendRequest) =>
      api("/auth/user", "GET", payload),
  }));
  const form = createForm(() => ({
    validators: { onSubmit: QuickFriendRequestSchema },
    defaultValues: { addressee: "" } satisfies QuickFriendRequest,
    onSubmit: ({ value }) => mutation.mutate(value),
  }));
  return (
    <div>
      <div class="p-4 space-y-0.5 mb-4">
        <h2 class="text-xl font-semibold tracking-tight">Ajouter</h2>
        <p class="text-sm">
          Tu peux ajouter des amis grâce à leurs noms d'utilisateur Tauri.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        class="relative"
      >
        <form.Field name="addressee">
          {(field) => (
            <TextField
              value={field().state.value}
              onChange={field().handleChange}
            >
              <TextFieldInput />
            </TextField>
          )}
        </form.Field>
        <Button type="submit" class="absolute top-0 right-0">
          Envoyer une demande d'ami
        </Button>
      </form>
    </div>
  );
}

function RouteComponent() {
  const value = Route.useLoaderData();

  const [pageKey, setPageKey] = createSignal<PageKey | "add">("online");

  return (
    <MainSidebar user={value()}>
      <Flex class="h-12 border-b border-b-accent">
        <Flex justifyContent="start" class="px-4 gap-2">
          <Flex justifyContent="start" class="gap-2 items-center w-fit">
            <UsersRound /> <span>Amis</span>
          </Flex>
          <Tabs value={pageKey()} onChange={setPageKey} class="w-[400px]">
            <TabsList class="gap-4 bg-transparent">
              <TabsTrigger class="data-selected:bg-accent" value="online">
                En ligne
              </TabsTrigger>
              <TabsTrigger class="data-selected:bg-accent" value="all">
                Tous
              </TabsTrigger>
              <TabsTrigger class="data-selected:bg-accent" value="pending">
                En attente
              </TabsTrigger>
              <TabsTrigger
                value="add"
                class={cn(
                  buttonVariants({ variant: "default" }),
                  "h-fit data-selected:bg-primary/20"
                )}
              >
                Ajouter
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Flex>
      </Flex>
      <Switch>
        <Match
          when={
            pageKey() === "online" ||
            pageKey() === "all" ||
            pageKey() === "pending"
          }
        >
          <Friends pageKey={pageKey() as PageKey} />
        </Match>
        <Match when={pageKey() === "add"}>
          <Add />
        </Match>
      </Switch>
    </MainSidebar>
  );
}
