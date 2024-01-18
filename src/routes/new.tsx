import { createForm, getValue, setValue } from "@modular-forms/solid";
import { useNavigate, useParams } from "@solidjs/router";
import {
  For,
  Show,
  Suspense,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { Button, Header, InnerCard, SmallHeader, VStack } from "~/components";
import { TextField } from "~/components/TextField";
import { useMegaStore } from "~/state/megaStore";
import { decodeNdkEvents, eify } from "~/utils";
import { SingleSuper } from "./home";

type CreateDuelForm = {
  opponent_npub: string;
  outcome: string;
  losingNote: string;
  // opponentNote: string;
};

export function New() {
  const [state, _actions] = useMegaStore();
  const navigate = useNavigate();
  const [error, setError] = createSignal<Error | undefined>(undefined);

  const onSave = async () => {
    // setDialogOpen(false);
    // await refetch();
  };

  const params = useParams();

  async function fetchSingle(eventId: string) {
    const supers = await state.ndk.fetchEvents({
      ids: [eventId],
      limit: 1,
    });

    const decoded = await decodeNdkEvents(supers);

    if (decoded.length === 0) {
      return undefined;
    }

    return decoded[0];
  }

  const [singleEvent] = createResource(params.id, fetchSingle);

  const [creationForm, { Form, Field, FieldArray }] =
    createForm<CreateDuelForm>({
      initialValues: {
        opponent_npub: "",
        outcome: "",
        losingNote: "",
        // opponentNote: "",
      },
    });

  async function handleSubmit(f: CreateDuelForm) {
    setError(undefined);
    try {
      console.log(f);

      // create_bet_wasm(losing_message: string, announcement: string, announcement_id: string, counter_party: string, outcomes: (string)[]): Promise<void>;
      const losingMessage = f.losingNote;
      const announcement = singleEvent()?.content || "";
      const announcementId = singleEvent()?.id || "";
      const counter_party = f.opponent_npub;
      // TODO: this is right, yeah?
      const outcomes = [f.outcome, opponentImplicitOption() || ""];

      console.log("creating bet with", {
        losingMessage,
        announcement,
        announcementId,
        counter_party,
        outcomes,
      });
      await state.noteDuel?.create_bet_wasm(
        losingMessage,
        announcement,
        announcementId,
        counter_party,
        outcomes,
      );

      navigate("/");
    } catch (e) {
      console.error(e);
      setError(eify(e));
    }
  }

  const userSelectedOption = () => getValue(creationForm, "outcome");
  const opponentImplicitOption = createMemo(() => {
    if (userSelectedOption()) {
      return singleEvent()?.decodedContent?.outcomes?.filter(
        (o) => o !== userSelectedOption(),
      )[0];
    }
  });

  return (
    <>
      <Header />
      <main class="flex flex-col items-start w-full p-4 gap-4 max-w-[30rem]">
        <Suspense fallback={<div>Loading...</div>}>
          {/* {singleEvent()?.decodedContent?.event_id} */}

          <h2 class="text-2xl font-bold">Create Duel</h2>
          <p>
            Note Duel lets you bet a nostr note on the outcome of an event.
            Choose wisely!
          </p>
          <Show when={singleEvent()}>
            <SingleSuper super={singleEvent()!} mode="new" />
          </Show>

          <Form onSubmit={handleSubmit}>
            <VStack>
              <Field name="opponent_npub">
                {(field, props) => (
                  <TextField
                    {...props}
                    {...field}
                    value={field.value}
                    error={field.error}
                    label="Opponent npub"
                    placeholder="npub1..."
                  />
                )}
              </Field>
              <Field name="outcome">
                {(field, props) => (
                  <fieldset>
                    <div class="flex flex-col gap-2">
                      <legend>
                        <SmallHeader>Pick your outcome</SmallHeader>
                      </legend>
                      <div class="flex flex-col gap-2 w-full">
                        <For
                          each={singleEvent()?.decodedContent?.outcomes || [""]}
                        >
                          {(outcomeOption) => (
                            <div
                              class="rounded-xl bg-white/10 flex gap-2 px-2 outline w-full"
                              classList={{
                                "outline-white": field.value === outcomeOption,
                                "outline-transparent":
                                  field.value !== outcomeOption,
                              }}
                              onClick={() => {
                                setValue(
                                  creationForm,
                                  "outcome",
                                  outcomeOption,
                                );
                              }}
                            >
                              <input
                                type="radio"
                                class="checked:border-black checked:border-[5px] bg-white w-4 h-4 appearance-none rounded-full border-2 border-black self-center"
                                id={outcomeOption}
                                name={outcomeOption}
                                value={outcomeOption}
                                checked={field.value === outcomeOption}
                                onInput={(e) => {
                                  console.log(e.currentTarget.defaultValue);
                                  setValue(
                                    creationForm,
                                    "outcome",
                                    e.currentTarget.defaultValue || "",
                                  );
                                }}
                              />
                              <label
                                class="text-2xl font-semibold p-2 flex-1 flex-shrink"
                                for={outcomeOption}
                              >
                                {outcomeOption}
                              </label>
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                  </fieldset>
                )}
              </Field>
              {/* <pre>Selected value: {getValue(creationForm, "outcome")}</pre> */}

              <Field name="losingNote">
                {(field, props) => (
                  <TextField
                    {...props}
                    {...field}
                    multiline
                    value={field.value}
                    error={field.error}
                    label="Losing note"
                    caption={`This note will be automatically published on the nostr feed of the loser.`}
                  />
                )}
              </Field>
              {/* <Field name="opponentNote">
                {(field, props) => (
                  <TextField
                    {...props}
                    {...field}
                    multiline
                    value={field.value}
                    error={field.error}
                    label="Opponent losing note"
                    caption={`This note will be automatically published on your opponent's nostr feed if "${userSelectedOption()}" happens`}
                  />
                )}

              </Field> */}
              <Show when={error()}>
                <div class="p-2 bg-red-500 rounded-xl text-white">
                  <pre>{error()?.message}</pre>
                </div>
              </Show>

              <Button
                type="submit"
                disabled={!userSelectedOption()}
                loading={creationForm.submitting}
              >
                Publish Duel
              </Button>
            </VStack>
          </Form>
        </Suspense>
      </main>
    </>
  );
}
