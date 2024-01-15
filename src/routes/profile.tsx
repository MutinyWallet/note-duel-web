import { Header } from "~/components";
import { useMegaStore } from "~/state/megaStore";
import { createResource, Show, Suspense } from "solid-js";

export function Profile() {
  const [state, _actions] = useMegaStore();

  if (state.noteDuel === undefined) {
    console.log("no state");
  }

  const [pubKey] = createResource(async () => state.noteDuel?.get_npub());
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<>loading...</>}>
          <Show when={pubKey()}>
            <pre>{pubKey()}</pre>
          </Show>
        </Suspense>
      </main>
    </>
  );
}
