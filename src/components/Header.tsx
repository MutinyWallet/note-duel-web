import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { useMegaStore } from "~/state/megaStore";

export function Header(props: { import?: boolean }) {
  const [state, _] = useMegaStore();
  return (
    <header class="w-full border-b border-white flex justify-between p-4 items-center">
      <A href="/" class="no-underline">
        <h1 class="text-4xl drop-shadow-text-glow font-bold">Note Duel</h1>
      </A>
      <Show when={!props.import}>
        <A href="/profile" class="no-underline">
          <div class="text-black bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Show when={state.profile?.image} fallback={":)"}>
              <img
                src={state.profile?.image}
                class="w-full h-full rounded-full"
              />
            </Show>
          </div>
        </A>
      </Show>
    </header>
  );
}
