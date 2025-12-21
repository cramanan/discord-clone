import { createForm } from "@tanstack/solid-form";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/solid-query";
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
import { format, isSameDay } from "date-fns";
import { Chat, User } from "~/types";
import { Separator } from "~/components/ui/separator";
import { createIntersectionObserver } from "@solid-primitives/intersection-observer";

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

function RenderChat(props: {
  chat: Chat;
  userByUUID: Record<User["uuid"], User>;
  hideUser?: boolean;
}) {
  if (props.hideUser)
    return <p class="px-16 hover:bg-border">{props.chat.content}</p>;
  const sender = props.userByUUID[props.chat.senderUuid];
  return (
    <div class="hover:bg-border px-4">
      <div class="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={sender.avatar ?? ""} />
          <AvatarFallback>
            <Logo class="size-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div class="space-x-1">
            <span class="hover:underline hover:cursor-pointer">
              {sender.name}
            </span>
            <span class="text-muted-foreground text-sm">
              {format(props.chat.createdAt, "dd/MM/yyyy HH:mm")}
            </span>
          </div>
          <p>{props.chat.content}</p>
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  const loader = Route.useLoaderData();
  const { sender, receiver } = loader();
  const userByUUID = { [sender.uuid]: sender, [receiver.uuid]: receiver };
  const queryKey = ["messages", receiver.uuid];

  const query = useInfiniteQuery(() => ({
    queryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      api(
        `/@me/chats/${receiver.uuid}?page=${pageParam}&per-page=50&sort-order=desc`,
        "GET"
      ).then(PageSchema(ChatSchema).parse),

    getNextPageParam: (lastPage) =>
      lastPage.page < Math.ceil(lastPage.total / lastPage.perPage)
        ? lastPage.page + 1
        : undefined,
  }));
  let parentRef!: HTMLDivElement;
  createIntersectionObserver(
    () => [parentRef],
    ([entry]) => {
      console.log(entry.isIntersecting, query.hasNextPage);

      if (
        entry.isIntersecting &&
        query.hasNextPage &&
        !query.isFetchingNextPage
      ) {
        query.fetchNextPage();
      }
    }
  );

  const messages = () => query.data?.pages.flatMap((page) => page.data) ?? [];
  const queryClient = useQueryClient();

  const updateClient = (chat: Chat) => {
    queryClient.setQueryData<typeof query.data>(queryKey, (previous) => {
      if (!previous) return previous;
      const firstPage = previous.pages[0];
      return {
        ...previous,
        pages: [
          {
            ...firstPage,
            data: [chat, ...firstPage.data],
            total: firstPage.total + 1,
          },
          ...previous.pages.slice(1),
        ],
      };
    });
  };

  const mutation = useMutation(() => ({
    mutationKey: ["send"],
    mutationFn: async (content: string) =>
      await invoke("ws_send", {
        value: {
          type: "MESSAGE",
          payload: { receiverUuid: receiver.uuid, content },
        },
      }),
    onSuccess: () => {
      const chat: Chat = {
        ...form.state.values,
        id: 0,
        senderUuid: sender.uuid,
        receiverUuid: receiver.uuid,
        createdAt: new Date().toUTCString(),
        updatedAt: null,
      };
      updateClient(chat);
      form.reset();
    },
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
        updateClient(data.payload);
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
      <div class="flex-1 flex flex-col-reverse overflow-auto">
        <For each={messages()}>
          {(chat, index) => {
            const nextChat = messages()[index() + 1];

            return (
              <>
                <RenderChat
                  chat={chat}
                  userByUUID={userByUUID}
                  hideUser={
                    nextChat &&
                    chat.senderUuid === nextChat.senderUuid &&
                    isSameDay(chat.createdAt, nextChat.createdAt)
                  }
                />

                {nextChat && !isSameDay(chat.createdAt, nextChat.createdAt) && (
                  <Separator />
                )}
              </>
            );
          }}
        </For>
        <div ref={parentRef}></div>
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
