import { Match, Suspense, Switch } from "solid-js";
import { ButtonLink, EventList, Header, ImportNsec } from "~/components";
import { useMegaStore } from "~/state/megaStore";

export function Home() {
  const [state, _] = useMegaStore();

  return (
    <>
      <Header />
      <main class="flex flex-col items-start w-full p-4 gap-8 max-w-[30rem]">
        <ButtonLink href="/new">+ New Superposition</ButtonLink>
        <pre>{state.noteDuel?.get_npub() || "err"}</pre>
        <div class="flex flex-col gap-4">
          <h2 class="text-2xl font-bold">Ready for Observation</h2>
          <Suspense>
            <EventList />
          </Suspense>
        </div>
      </main>
    </>
  );
}
