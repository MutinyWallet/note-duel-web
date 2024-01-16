import { Button, Header } from "~/components";
import { useMegaStore } from "~/state/megaStore";
import { createResource, Show, Suspense } from "solid-js";

export function Profile() {
  const [state, _actions] = useMegaStore();

  if (state.noteDuel === undefined) {
    console.log("no state");
  }

  // const [pubKey] = createResource(async () => state.noteDuel?.get_npub());

  const pubkey = state.noteDuel?.get_npub();

  function signOut() {
    localStorage.removeItem("nsec");
    window.location.href = "/";
  }

  return (
    <>
      <Header />
      <main class="flex flex-col items-start w-full p-4 gap-8 max-w-[30rem]">
        <pre class="break-all whitespace-pre-wrap">{pubkey}</pre>
        {/* <Suspense fallback={<>loading...</>}>
          <Show when={pubKey()}>
          </Show>
        </Suspense> */}
        <Button onClick={signOut}>Sign Out</Button>
      </main>
    </>
  );
}
