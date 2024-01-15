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

interface State {
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
  });

  const actions = {
    async setup(nsec: string) {
      await initNoteDuel();
      const noteDuel = new NoteDuel(nsec);
      setState({ noteDuel });

      const npub = await noteDuel.get_npub();
      console.log("setup complete with npub:" + npub);
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
