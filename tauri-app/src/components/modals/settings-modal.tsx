import { useMutation } from "@tanstack/solid-query";
import { useNavigate } from "@tanstack/solid-router";
import LogOut from "lucide-solid/icons/log-out";
import { createSignal } from "solid-js";
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
import { Button, buttonVariants } from "~/components/ui/button";
import Settings from "lucide-solid/icons/settings";

function LogOutModal() {
  const navigate = useNavigate();
  const mutation = useMutation(() => ({
    mutationKey: ["logout"],
    mutationFn: async (_: unknown) => await api("/auth/logout", "POST"),
    onSettled: () => navigate({ to: "/channels/@me" }),
  }));

  const [open, setOpen] = createSignal(false);

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger class={buttonVariants({ variant: "ghost" })}>
        <LogOut /> Déconnexion
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

export default function SettingsModal() {
  return (
    <Dialog>
      <DialogTrigger class={buttonVariants({ variant: "ghost" })}>
        <Settings />
      </DialogTrigger>
      <DialogContent>
        <aside>
          <LogOutModal />
        </aside>
      </DialogContent>
    </Dialog>
  );
}
