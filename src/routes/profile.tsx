import { Header } from "~/components";
import { useMegaStore } from "~/state/megaStore";
import { createResource, Show, Suspense } from "solid-js";

export function Profile() {
  const [state, _actions] = useMegaStore();

  if (state.noteDuel === undefined) {
    console.log("no state");
  }

  // const [pubKey] = createResource(async () => state.noteDuel?.get_npub());

  // const pubkey = state.noteDuel?.get_npub();

  return (
    <>
      <Header />
      <main>
        {/* <pre>{pubkey}</pre> */}
        {/* <Suspense fallback={<>loading...</>}>
          <Show when={pubKey()}>
          </Show>
        </Suspense> */}
      </main>
    </>
  );
}
