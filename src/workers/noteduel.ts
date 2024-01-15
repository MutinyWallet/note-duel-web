/* eslint-disable no-restricted-globals */
import initNoteDuel, { NoteDuel } from "@benthecarman/note-duel";
import { NoteDuelMethodNames } from "~/state/noteduelProxy";

interface NoteDuelInstanceMap {
  [id: string]: NoteDuel;
}

const noteDuelInstances: NoteDuelInstanceMap = {};

// Initialize the Kormir Wasm module once at the worker startup.
let wasmInitialized = false;

self.onconnect = (e: MessageEvent) => {
  const port = e.ports[0];

  port.onmessage = async (event: MessageEvent) => {
    const { id, method, args } = event.data;

    // Ensure Wasm is initialized before handling any messages
    if (!wasmInitialized) {
      try {
        await initNoteDuel();
        wasmInitialized = true;
      } catch (error) {
        const e = error as Error;
        port.postMessage({
          id,
          error: "Failed to initialize NoteDuel Wasm: " + e.message,
        });
        return;
      }
    }

    try {
      if (method === "new") {
        const noteDuelInstance = new NoteDuel("");
        noteDuelInstances[id] = noteDuelInstance;
        port.postMessage({ id, result: "Instance created" });
      } else if (noteDuelInstances[id]) {
        const instance = noteDuelInstances[id];
        // Methods are called based on the name provided in the message.
        // TypeScript doesn't know what methods are available on instance,
        // so we need to use a type assertion here.
        const result = await instance[method as NoteDuelMethodNames](...args);
        port.postMessage({ id, result });
      }
    } catch (error) {
      const e = error as Error;
      port.postMessage({ id, error: e.message });
    }
  };
};
