import {
  Accessor,
  createContext,
  createSignal,
  onMount,
  ParentProps,
  useContext,
} from "solid-js";
import { User } from "~/types";
import { Link } from "@tanstack/solid-router";
import { Button } from "~/components/ui/button";
import Inbox from "lucide-solid/icons/inbox";
import { Flex } from "~/components/ui/flex";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import X from "lucide-solid/icons/x";
import { Portal } from "solid-js/web";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Logo } from "~/components/logo";
import Mic from "lucide-solid/icons/mic";
import Headset from "lucide-solid/icons/headset";
import SettingsModal from "../modals/settings-modal";
import { invoke } from "@tauri-apps/api/core";

function InboxModal() {
  return (
    <Popover>
      <PopoverTrigger>
        <Inbox class="size-4" />
      </PopoverTrigger>
      <PopoverContent>
        <Link to="/channels/@me">Inbox</Link>
      </PopoverContent>
    </Popover>
  );
}

interface MainLayoutContextType {
  sidebar: Accessor<HTMLDivElement | null>;
  content: Accessor<HTMLDivElement | null>;
}

const MainLayoutContext = createContext<MainLayoutContextType>();

function useMainLayoutContext() {
  const ctx = useContext(MainLayoutContext);
  if (!ctx)
    throw new Error(
      "useMainLayoutContext must be used within a MainLayoutContext.Provider."
    );

  return ctx;
}

export function MainLayout(props: { user: User } & ParentProps) {
  const [sidebar, setSidebar] = createSignal<HTMLDivElement | null>(null);
  const [content, setContent] = createSignal<HTMLDivElement | null>(null);

  onMount(() => invoke("websocket").catch(console.error));

  return (
    <div class="flex flex-col h-screen">
      <Flex
        alignItems="center"
        justifyContent="center"
        class="text-sm h-8 bg-sidebar font-light"
      >
        <div class="w-full flex">
          <h2 class="flex items-center justify-center w-full font-medium">
            Amis
          </h2>
          <InboxModal />
        </div>
        <div>
          <Button
            variant="ghost"
            class="rounded-none p-1 h-full hover:bg-destructive"
          >
            <X />
          </Button>
        </div>
      </Flex>
      <div class="flex flex-1 min-h-0">
        <MainLayoutContext.Provider value={{ sidebar, content }}>
          <aside class="bg-sidebar w-86 h-full flex relative">
            <div class="h-full w-22 flex flex-col items-center">
              <Link
                to="/"
                class="bg-primary flex items-center w-fit p-2 rounded-lg"
              >
                <Logo class="size-6" />
              </Link>
            </div>
            <div class="p-2 absolute bottom-0 w-full">
              <div class="bg-background rounded-lg h-14 p-2 flex items-center">
                <div class="flex items-center w-full">
                  <Avatar class="size-10">
                    <AvatarImage src={props.user.avatar ?? ""} />
                    <AvatarFallback>
                      <Logo class="size-7" />
                    </AvatarFallback>
                  </Avatar>
                  <div class="w-full pl-2">
                    <h2>{props.user.name}</h2>
                    <span class="text-muted-foreground text-sm">Status</span>
                  </div>
                  <div class="flex items-center">
                    <Button variant="ghost">
                      <Mic />
                    </Button>
                    <Button variant="ghost">
                      <Headset />
                    </Button>
                    <SettingsModal />
                  </div>
                </div>
              </div>
            </div>
            <div
              class="border-l border-t border-accent w-full"
              ref={setSidebar}
            />
          </aside>
          <main ref={setContent} class="w-full" />
          {void props.children}
        </MainLayoutContext.Provider>
      </div>
    </div>
  );
}

export function MainLayoutSidebar(props: ParentProps) {
  const ctx = useMainLayoutContext();
  const sidebar = ctx.sidebar();
  return <Portal mount={sidebar!} children={props.children} />;
}

export function MainLayoutContent(props: ParentProps) {
  const ctx = useMainLayoutContext();
  const content = ctx.content();
  return (
    <Portal
      mount={content!}
      children={props.children}
      ref={(el) => el.classList.add("size-full")}
    />
  );
}
