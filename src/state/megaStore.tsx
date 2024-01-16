import { createStore } from "solid-js/store";
import initNoteDuel, { NoteDuel } from "@benthecarman/note-duel";
import {
  ParentComponent,
  onMount,
  createContext,
  useContext,
  Switch,
  Match,
} from "solid-js";
import { Header, ImportNsec } from "~/components";
import NDK from "@nostr-dev-kit/ndk";

interface State {
  ndk: NDK;
  noteDuel?: NoteDuel;
}

interface Actions {
  setup: (nsec: string) => void;
  hello: () => void;
}

export type MegaStore = [State, Actions];

const MegaStoreContext = createContext<MegaStore>();

export const Provider: ParentComponent = (props) => {
  const [state, setState] = createStore({
    noteDuel: undefined as NoteDuel | undefined,
    ndk: new NDK({
      explicitRelayUrls: [
        "wss://nostr.mutinywallet.com",
        "wss://relay.snort.social",
        "wss://nos.lol",
        "wss://nostr.fmt.wiz.biz",
        "wss://relay.damus.io",
        "wss://relay.primal.net",
        "wss://nostr.wine",
        "wss://relay.nostr.band",
        "wss://nostr.zbd.gg",
        "wss://relay.nos.social",
      ],
      enableOutboxModel: false,
    }),
  });

  const actions = {
    async setup(nsec: string) {
      // noteduel stuff
      await initNoteDuel();
      const noteDuel = new NoteDuel(nsec);
      setState({ noteDuel });

      const npub = noteDuel.get_npub();
      console.log("setup complete with npub:" + npub);

      // ndk stuff
      await state.ndk.connect(6000);
      console.log("connected");
    },
    async hello() {
      console.log("Hello");
    },
  };

  onMount(async () => {
    const nsec = localStorage.getItem("nsec");
    if (nsec) {
      await actions.setup(nsec);
    }
  });

  const store = [state, actions] as MegaStore;

  return (
    <MegaStoreContext.Provider value={store}>
      <Switch>
        <Match when={state.noteDuel !== undefined}>{props.children}</Match>
        <Match when={state.noteDuel === undefined}>
          <Header />
          <ImportNsec />
        </Match>
      </Switch>
    </MegaStoreContext.Provider>
  );
};

export function useMegaStore() {
  // This is a trick to narrow the typescript types: https://docs.solidjs.com/references/api-reference/component-apis/createContext
  const context = useContext(MegaStoreContext);
  if (!context) {
    throw new Error("useMegaStore: cannot find a MegaStoreContext");
  }
  return context;
}
