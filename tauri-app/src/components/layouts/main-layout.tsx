import {
  Accessor,
  children,
  createContext,
  createEffect,
  createSignal,
  JSX,
  ParentProps,
  ResolvedChildren,
  useContext,
} from "solid-js";
import { User } from "~/types";
import { Link, useNavigate } from "@tanstack/solid-router";
import { useMutation } from "@tanstack/solid-query";
import { api } from "~/actions/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import LogOut from "lucide-solid/icons/log-out";
import Inbox from "lucide-solid/icons/inbox";
import { Flex } from "~/components/ui/flex";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import X from "lucide-solid/icons/x";
import { Logo } from "~/components/logo";
import { Portal } from "solid-js/web";

function LogOutModal() {
  const navigate = useNavigate();
  const mutation = useMutation(() => ({
    mutationKey: ["logout"],
    mutationFn: async (_: unknown) => await api("/auth/logout", "POST"),
    onSettled: () => navigate({ to: "/login" }),
  }));

  const [open, setOpen] = createSignal(false);

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger as={Button<"button">} variant="outline">
        <LogOut />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={mutation.mutate}>
            Déconnexion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
      "useMainLayoutContext must be used within a MainLayoutContextProvider."
    );

  return ctx;
}

export function MainLayout(props: { user: User } & ParentProps) {
  const [sidebar, setSidebar] = createSignal<HTMLDivElement | null>(null);
  const [content, setContent] = createSignal<HTMLDivElement | null>(null);

  createEffect(() => console.log(sidebar(), content()));

  return (
    <div class="flex flex-col h-screen">
      <Flex
        alignItems="center"
        justifyContent="center"
        class="text-sm h-8 bg-sidebar font-light"
      >
        <div class="w-full flex">
          <h2 class="flex items-center w-full">Amis</h2>
          <Popover>
            <PopoverTrigger>
              <Inbox />
            </PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
          </Popover>
        </div>
        <div>
          <Button variant="ghost" class="rounded-none p-1 h-full">
            <X />
          </Button>
        </div>
      </Flex>
      <div class="flex h-full bg-sidebar">
        <aside class="flex flex-col items-center  gap-4 w-18 h-full bg-sidebar">
          <div class="flex relative justify-center items-center w-full">
            <span class="w-1 h-10 rounded-r-lg absolute left-0 -translate-y-1/2 top-1/2 bg-white" />
            <Link
              to="/"
              class="size-10 bg-primary rounded-lg p-2 flex items-center justify-center"
            >
              <Logo />
            </Link>
          </div>
          <Flex flexDirection="col" justifyContent="start" class="gap-2 h-full">
            <LogOutModal />
          </Flex>
        </aside>
        <div class="flex-1 flex overflow-auto rounded-xl border-t border-l border-accent bg-background">
          <MainLayoutContext.Provider value={{ sidebar, content }}>
            <div class="bg-sidebar p-2 w-68" ref={setSidebar} />
            <div class="w-full" ref={setContent} />
            {void props.children}
          </MainLayoutContext.Provider>
        </div>
      </div>
    </div>
  );
}

export function MainLayoutContent(props: ParentProps) {
  const ctx = useMainLayoutContext();
  const content = ctx.content();
  return content && <Portal mount={content} children={props.children} />;
}

export function MainLayoutSidebar(props: ParentProps) {
  const ctx = useMainLayoutContext();
  const sidebar = ctx.sidebar();
  return sidebar && <Portal mount={sidebar} children={props.children} />;
}
