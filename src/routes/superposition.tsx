import { useParams } from "@solidjs/router";
import { Show, Suspense, createResource } from "solid-js";
import { EventItem, Header } from "~/components";
import { useMegaStore } from "~/state/megaStore";

export function SuperPosition() {
  const [state, _actions] = useMegaStore();

  const params = useParams();

  // const [pubKey] = createResource(async () => state.kormir?.get_public_key());

  const getEventById = async () => {
    const id =
      "85f87112bd53449f1e98c40a93fa8f1e5e5a5b1ad38a688234ba47fd154d9247";
    const events = await state.kormir?.list_events();
    console.log(events);
    return events![0];
    // const singleEvent = events?.filter((e) => e.announcement_event_id === id);
    // if (singleEvent?.length === 1) {
    //   return singleEvent[0];
    // } else {
    //   throw new Error("Event not found");
    // }
  };

  const [event, { refetch }] = createResource(params.id, getEventById);

  const onSave = async () => {
    // setDialogOpen(false);
    // await refetch();
  };

  return (
    <>
      <Header />
      <main>
        <h2 class="text-2xl font-bold my-4">New</h2>
        <Suspense>
          <Show when={event()}>
            <EventItem event={event()!} />
          </Show>
        </Suspense>
      </main>
    </>
  );
}
