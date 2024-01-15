/* @refresh reload */
import { EventData } from "@benthecarman/kormir-wasm";
import {
  createResource,
  createSignal,
  For,
  JSX,
  Show,
  Suspense,
} from "solid-js";

import { Button, InnerCard, VStack } from "~/components";
import { useMegaStore } from "~/state/megaStore";

type RefetchEventsType = (
  info?: unknown,
) => EventData[] | Promise<EventData[] | undefined> | null | undefined;

function PreKeyValue(props: { key: string; children: JSX.Element }) {
  return (
    <pre class="text-neutral-400">
      <span class="text-white font-bold">{props.key}</span> {props.children}
    </pre>
  );
}

export function EventItem(props: {
  event: EventData;
  refetch?: RefetchEventsType;
}) {
  const [state, _actions] = useMegaStore();
  const handleSignEvent = async () => {
    const result = prompt("Choose one of: " + props.event.outcomes.join(", "));

    if (state.kormir == undefined) {
      return;
    }

    if (props.refetch == undefined) {
      return;
    }

    await state.kormir?.sign_enum_event(0, result || "");

    props.refetch();
  };

  return (
    <InnerCard>
      <div class="flex flex-col gap-6">
        <h2 class="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#eeaeca] to-[#94bbe9]">
          {props.event.event_id}
        </h2>
        <div class="flex flex-col gap-2">
          <PreKeyValue key="Due">
            {new Date(props.event.event_maturity_epoch * 1000).toLocaleString()}
          </PreKeyValue>
          <PreKeyValue key="Announcement">
            <a
              class="underline break-all whitespace-pre-wrap"
              href={`https://njump.me/${props.event.announcement_event_id}`}
            >
              {props.event.announcement_event_id}
            </a>
          </PreKeyValue>
          <PreKeyValue key="Outcomes">
            {props.event.outcomes.join(" | ")}
          </PreKeyValue>
        </div>
        <Show when={props.event.attestation != undefined}>
          <h2 class="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#eeaeca] to-[#94bbe9]">
            observed!
          </h2>
          {/* <pre>{JSON.stringify(props.event, null, 2)}</pre> */}
          <PreKeyValue key="Attestation">
            <a
              class="underline break-all whitespace-pre-wrap"
              href={`https://njump.me/${props.event.attestation_event_id}`}
            >
              {props.event.attestation_event_id}
            </a>
          </PreKeyValue>
        </Show>

        {/* <pre class="overflow-x-auto whitespace-pre-wrap break-all">
        {JSON.stringify(props.event, null, 2)}
      </pre> */}
        <Show when={props.event.attestation == undefined}>
          <div class="self-start">
            <Button layout="xs" onClick={handleSignEvent}>
              Observe
            </Button>
          </div>
        </Show>
      </div>
    </InnerCard>
  );
}

export function EventList() {
  const [state, _actions] = useMegaStore();

  const getEvents = async () => {
    const events = await state.kormir?.list_events();
    console.log(events);
    return events;
  };

  const [events, { refetch }] = createResource(state.kormir, getEvents);

  const [dialogOpen, setDialogOpen] = createSignal(false);

  const onClick = async () => {
    setDialogOpen(true);
  };

  const onSave = async () => {
    setDialogOpen(false);
    await refetch();
  };

  return (
    <>
      {/* By wrapping this in a suspense I don't cause the page to jump to the top */}
      <Suspense>
        <VStack>
          <For each={events()} fallback={<code>No Events found.</code>}>
            {(event) => <EventItem event={event} refetch={refetch} />}
          </For>
        </VStack>
      </Suspense>
    </>
  );
}
