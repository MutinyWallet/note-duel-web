import { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
import { useMegaStore } from "~/state/megaStore";
import { decodeNdkEvents, eify } from "~/utils";
import { InnerCard, VStack } from "./Misc";
import { Show, Suspense, createResource, createSignal } from "solid-js";
import { PreKeyValue, SingleSuper } from "~/routes";
import { Button } from "./Button";

export type PendingDuel = {
  id: number;
  win_a: {
    id: string;
    pubkey: string;
    created_at: number;
    kind: number;
    content: string;
  };
  lose_a: {
    id: string;
    pubkey: string;
    created_at: number;
    kind: number;
    content: string;
  };
  win_b: {
    id: string;
    pubkey: string;
    created_at: number;
    kind: number;
    content: string;
  };
  lose_b: {
    id: string;
    pubkey: string;
    created_at: number;
    kind: number;
    content: string;
  };
  oracle_announcement: string;
  oracle_event_id: string;
  user_outcomes: Array<string>;
  counterparty_outcomes: Array<string>;
  //   win_outcome_event_id: any;
  //   lose_outcome_event_id: any;
};

export function SinglePendingDuel(props: { duel: PendingDuel }) {
  const [state, _actions] = useMegaStore();

  async function fetchSuperposition() {
    const sup = await state.ndk.fetchEvent({
      //   // @ts-expect-error ndk doesn't know about kind 88 yet
      //   kinds: [88],
      //   limit: 20,
      ids: [props.duel.oracle_event_id],
    });

    if (sup) {
      const supSet = new Set<NDKEvent>();
      supSet.add(sup);

      const decoded = await decodeNdkEvents(supSet);
      if (decoded.length > 0) {
        return decoded[0];
      }
    }
  }

  const [supEvent] = createResource(fetchSuperposition);

  async function fetchProfile() {
    const user = new NDKUser({ hexpubkey: props.duel.win_a.pubkey });
    user.ndk = state.ndk;
    const profile = await user.fetchProfile({ closeOnEose: true });

    const npub = user.npub;

    return { profile, npub };
  }

  const [profile] = createResource(fetchProfile);

  const [accepting, setAccepting] = createSignal(false);
  const [error, setError] = createSignal<Error | undefined>(undefined);

  async function handleAccept() {
    try {
      setAccepting(true);
      const res = await state.noteDuel?.accept_bet_wasm(props.duel.id);
      console.log(res);
    } catch (e) {
      console.error(e);
      setError(eify(e));
    } finally {
      setAccepting(false);
    }
  }

  return (
    <InnerCard>
      <VStack>
        <Suspense fallback={<div>Loading...</div>}>
          <div class="text-black self-center bg-white w-[4rem] h-[4rem] rounded-full flex items-center justify-center">
            <Show when={profile()?.profile?.image} fallback={":)"}>
              <img
                src={profile()?.profile?.image}
                class="w-full h-full rounded-full"
              />
            </Show>
          </div>
          <h2 class="text-2xl font-bold text-center">
            {profile()?.profile?.name}
            <br />
            <span class="font-light">challenges</span>
            <br />
            {state.profile?.name}
          </h2>
          <PreKeyValue key="npub">
            <a
              class="whitespace-pre-wrap break-all"
              href={`https://njump.me/${profile()?.npub}`}
            >
              {profile()?.npub}
            </a>
          </PreKeyValue>
        </Suspense>
        {/* <pre class="break-all whitespace-pre-wrap">
          {JSON.stringify(props.duel, null, 2)}
        </pre> */}

        <Suspense>
          <Show when={supEvent()}>
            <SingleSuper super={supEvent()!} mode="new" />
          </Show>
          {/* <pre>{JSON.stringify(supEvent(), null, 2)}</pre> */}
        </Suspense>
        <h2 class="text-2xl font-bold">The stakes</h2>
        <p class="text-lg">
          The <strong>winner</strong> publishes "{`${props.duel.win_a.content}`}
          " to their nostr feed.
        </p>
        <p class="text-lg">
          The <strong>loser</strong> publishes "{`${props.duel.lose_a.content}`}
          " to their nostr feed.
        </p>
        <Suspense>
          <p class="text-lg">
            {profile()?.profile?.name} has bet on{" "}
            <strong>{`"${props.duel.user_outcomes[0]}"`}</strong> to win. That
            means your choice is{" "}
            <strong>{`"${props.duel.counterparty_outcomes[0]}"`}</strong>. Will
            you accept?
          </p>
        </Suspense>
        <Show when={error()}>
          <div class="p-2 bg-red-500 rounded-xl text-white">
            <pre>{error()?.message}</pre>
          </div>
        </Show>
        <Button
          onClick={handleAccept}
          loading={accepting()}
          disabled={accepting()}
        >
          Accept
        </Button>
        {/* <Button>Decline</Button> */}
      </VStack>
    </InnerCard>
  );
}
