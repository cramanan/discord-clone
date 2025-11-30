import { createSignal, ParentProps } from "solid-js";
import { User } from "~/types";
import { Link, useNavigate } from "@tanstack/solid-router";
import logo from "~/assets/tauri_white.svg";
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

export default function MainSidebar(props: ParentProps & { user: User }) {
  return (
    <div class="flex h-screen">
      <aside class="flex flex-col items-center  gap-4 w-18 h-full">
        <div class="flex relative justify-center items-center w-full">
          <span class="w-1 h-10 rounded-r-lg absolute left-0 -translate-y-1/2 top-1/2 bg-white" />
          <Link
            to="/"
            class="size-10 bg-primary rounded-lg p-2 flex items-center justify-center"
          >
            <img src={logo} alt="" />
          </Link>
        </div>
        <div class="h-full">
          <LogOutModal />
        </div>
      </aside>
      <main class="flex-1 p-2 overflow-auto rounded-xl border border-accent">
        {props.children}
      </main>
    </div>
  );
}
