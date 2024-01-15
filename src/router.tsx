// @refresh reload
import { Route, Routes } from "@solidjs/router";
import { Match, Switch } from "solid-js";

import { Home, NotFound, New, Profile, SuperPosition } from "~/routes";
import { Provider as MegaStoreProvider } from "~/state/megaStore";

export function Router() {
  return (
    <Switch>
      <Match when={true}>
        <MegaStoreProvider>
          <Routes>
            <Route path="/" component={Home} />
            <Route path="/new" component={New} />
            <Route path="/profile" component={Profile} />
            <Route path="/superposition/:id" component={SuperPosition} />
            <Route path="/*all" component={NotFound} />
          </Routes>
        </MegaStoreProvider>
      </Match>
    </Switch>
  );
}
