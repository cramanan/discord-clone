import { createForm } from "@tanstack/solid-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/solid-query";
import { createFileRoute, redirect } from "@tanstack/solid-router";
import { invoke } from "@tauri-apps/api/core";
import { For, onCleanup, onMount } from "solid-js";
import z from "zod";
import { api } from "~/actions/api";
import { Logo } from "~/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { TextField, TextFieldTextArea } from "~/components/ui/text-field";
import {
  ChatSchema,
  EventSchema,
  PageSchema,
  UserSchema,
} from "~/types/schemas";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

export const Route = createFileRoute("/_authed/channels/@me/$uuid")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    try {
      const receiver = await api(`/users/${params.uuid}`, "GET").then(
        UserSchema.parse
      );

      return { sender: context.user, receiver };
    } catch {
      throw redirect({ to: "/channels/@me" });
    }
  },
});

function RouteComponent() {
  const loader = Route.useLoaderData();
  const queryKey = ["messages", loader().receiver.uuid];
  const query = useQuery(() => ({
    queryKey,
    queryFn: () =>
      api(`/@me/chats/${loader().receiver.uuid}`, "GET").then(
        PageSchema(ChatSchema).parse
      ),
  }));
  const queryClient = useQueryClient();

  const userByUUID = Object.fromEntries(
    [loader().receiver, loader().sender].map((user) => [user.uuid, user])
  );

  const mutation = useMutation(() => ({
    mutationKey: ["send"],
    mutationFn: async (content: string) =>
      await invoke("ws_send", {
        value: {
          type: "MESSAGE",
          payload: { receiverUuid: loader().receiver.uuid, content },
        },
      }),
    onSuccess: () => form.reset(),
    onError: console.error,
  }));

  const form = createForm(() => ({
    validators: {
      onSubmit: z.object({ content: z.string().trim().nonempty() }),
    },
    defaultValues: { content: "" },
    onSubmit: ({ value }) => mutation.mutate(value.content),
  }));

  let unlistenFn: UnlistenFn | undefined;
  onMount(async () => {
    try {
      unlistenFn = await listen("discord-clone://ws", ({ payload }) => {
        const { data, success, error } = EventSchema.safeParse(payload);
        if (error) console.log(error);
        if (!success || data.type !== "MESSAGE") return;
        queryClient.setQueryData<typeof query.data>(queryKey, (previous) => {
          const prevData = previous?.data ?? [];
          const prevTotal = previous?.total ?? 0;
          return {
            ...previous,
            data: [data.payload, ...prevData],
            total: prevTotal + 1,
          };
        });
      });
    } catch (error) {
      console.log(error);
    }
  });
  onCleanup(() => unlistenFn?.());

  return (
    <div class="border-t border-accent h-full flex flex-col">
      <div class="border-b border-accent w-full h-12 p-2 flex items-center gap-2">
        <Avatar class="size-6">
          <AvatarImage src={loader().receiver.avatar ?? ""} />
          <AvatarFallback>
            <Logo class="size-4" />
          </AvatarFallback>
        </Avatar>
        <span>{loader().receiver.name}</span>
      </div>
      <div class="flex-1 flex flex-col-reverse px-2 overflow-auto">
        <For each={query.data?.data}>
          {(chat) => {
            const sender = userByUUID[chat.senderUuid];
            return (
              <div>
                <div class="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={sender.avatar ?? ""} />
                    <AvatarFallback>
                      <Logo class="size-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>{sender.name}</div>
                </div>
                <p>{chat.content}</p>
              </div>
            );
          }}
        </For>
      </div>
      <form.Field name="content">
        {(field) => (
          <TextField
            class="p-2"
            value={field().state.value}
            onChange={field().handleChange}
          >
            <TextFieldTextArea
              class="h-14 pl-16"
              placeholder={`Envoyer un message à ${loader().receiver.name}`}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  form.handleSubmit();
                }
              }}
            />
          </TextField>
        )}
      </form.Field>
    </div>
  );
}
