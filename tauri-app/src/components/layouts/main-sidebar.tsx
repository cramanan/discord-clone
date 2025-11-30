import { ParentProps } from "solid-js";
import { User } from "~/types";
import { Link } from "@tanstack/solid-router";
import logo from "~/assets/tauri_white.svg";

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
        <div class="h-full">Hello</div>
      </aside>
      <main class="flex-1 p-2 overflow-auto rounded-xl border border-accent">
        {props.children}
      </main>
    </div>
  );
}
