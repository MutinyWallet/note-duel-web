import { For, JSX, Show, Suspense, createMemo, createResource } from "solid-js";
import { ButtonLink, Header, InnerCard } from "~/components";
import { useMegaStore } from "~/state/megaStore";
import { nip19 } from "nostr-tools";
import { DecodedNDKEvent, decodeNdkEvents } from "~/utils";
import { PendingDuel, SinglePendingDuel } from "~/components/PendingDuel";

export function Home() {
  const [state, _] = useMegaStore();

  async function fetchSuperpositions() {
    const supers = await state.ndk.fetchEvents({
      // @ts-expect-error ndk doesn't know about kind 88 yet
      kinds: [88],
      limit: 20,
      // since: 0,
    });

    return decodeNdkEvents(supers);
  }

  const [supers] = createResource(fetchSuperpositions);

  async function fetchPending() {
    try {
      const pending = await state.noteDuel?.list_pending_events_wasm();
      console.log("pending", pending);
      return (pending || []) as PendingDuel[];
    } catch (e) {
      console.error(e);
    }
    return [] as PendingDuel[];
  }

  const [pending, { refetch }] = createResource(fetchPending);

  return (
    <>
      <Header />
      <main class="flex flex-col items-start w-full p-4 gap-4 max-w-[30rem]">
        <h2 class="text-2xl font-bold">Pending Duels</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <Show when={pending()?.length === 0}>
            <div>No pending duels found.</div>
          </Show>
          <For each={pending()}>
            {(duel) => <SinglePendingDuel duel={duel} refetch={refetch} />}
          </For>
        </Suspense>
        <h2 class="text-2xl font-bold">Superpositions</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <Show when={supers()?.length === 0}>
            <div>
              No Superpositions found. Maybe you want to{" "}
              <a href="#">create one?</a>
            </div>
          </Show>
          <For each={supers()}>
            {(sup) => <SingleSuper super={sup} mode="list" />}
          </For>
        </Suspense>
      </main>
    </>
  );
}

export function SingleSuper(props: {
  super: DecodedNDKEvent;
  mode: "new" | "list";
}) {
  const npub = createMemo(() => {
    // return props.super.pubkey;
    const npub = nip19.npubEncode(props.super.pubkey);
    return npub;
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerCard>
        <div class="flex flex-col gap-4">
          <h2 class="text-center font-semibold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#eeaeca] to-[#94bbe9]">
            "{props.super.decodedContent?.event_id}"
          </h2>
          <PreKeyValue key="Created">
            {new Date((props.super.created_at || 0) * 1000).toLocaleString()}
          </PreKeyValue>
          <PreKeyValue key="Observe Date">
            {new Date(
              (props.super.decodedContent?.event_maturity_epoch || 0) * 1000,
            ).toLocaleString()}
          </PreKeyValue>
          <PreKeyValue key="Announcement">
            <a
              class="underline break-all whitespace-pre-wrap"
              href={`https://njump.me/${props.super.id}`}
            >
              {props.super.id}
            </a>
          </PreKeyValue>
          <PreKeyValue key="Oracle Pubkey">
            <a
              class="underline break-all whitespace-pre-wrap"
              href={`https://njump.me/${npub()}}`}
            >
              {npub()}
            </a>
          </PreKeyValue>
          <PreKeyValue key="Outcomes">
            {props.super.decodedContent?.outcomes.join(" | ")}
          </PreKeyValue>
          {/* <Suspense fallback={<div>Loading profile...</div>}>
            <pre>{JSON.stringify(profile(), null, 2)}</pre>
          </Suspense> */}
          <Show when={props.mode === "list"}>
            <ButtonLink href={`/new/${props.super.id}`}>Create Duel</ButtonLink>
          </Show>
        </div>
      </InnerCard>
    </Suspense>
  );
}

export function PreKeyValue(props: { key: string; children: JSX.Element }) {
  return (
    <pre class="text-neutral-400">
      <span class="text-white font-bold">{props.key}</span> {props.children}
    </pre>
  );
}
