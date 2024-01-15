export interface NoteDuelMethods {
  new: (nsec: string) => Promise<NoteDuelProxy>;
  get_npub: () => Promise<string>;
  create_unsigned_event_wasm: (
    losing_message: string,
    announcement: string,
  ) => Promise<any>;
  create_tweaked_signatures_wasm: (
    losing_message: string,
    announcement: string,
    outcomes: string[],
  ) => Promise<string[]>;
  complete_signature_wasm: (
    encrypted_sig: string,
    attestation: string,
  ) => Promise<string>;
}

export type NoteDuelMethodNames = keyof NoteDuelMethods;

export class NoteDuelProxy {
  private worker: SharedWorker;
  private id: string;

  constructor(worker: SharedWorker, id: string) {
    this.worker = worker;
    this.id = id;
  }

  private sendMessage<K extends NoteDuelMethodNames>(
    method: K,
    args: Parameters<NoteDuelMethods[K]>,
  ): ReturnType<NoteDuelMethods[K]> {
    return new Promise((resolve, reject) => {
      const messageHandler = (event: MessageEvent) => {
        if (event.data.id === this.id) {
          this.worker.port.removeEventListener("message", messageHandler);
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        }
      };

      this.worker.port.addEventListener("message", messageHandler);
      this.worker.port.start(); // Start the port if not already started
      this.worker.port.postMessage({ id: this.id, method, args });
    }) as ReturnType<NoteDuelMethods[K]>;
  }

  public static new(nsec: string): Promise<NoteDuelProxy> {
    const worker = new SharedWorker(
      new URL("../workers/noteduel.ts", import.meta.url),
      { type: "module" },
    );
    const id = generateUniqueId(); // Implement this function to generate unique IDs.
    const proxy = new NoteDuelProxy(worker, id);
    return proxy.sendMessage("new", [nsec]).then(() => proxy); // Return the proxy after initialization
  }

  public get_npub(): Promise<string> {
    return this.sendMessage("get_npub", []);
  }

  public create_unsigned_event_wasm(
    losing_message: string,
    announcement: string,
  ): Promise<any> {
    return this.sendMessage("create_unsigned_event_wasm", [
      losing_message,
      announcement,
    ]);
  }

  public create_tweaked_signatures_wasm(
    losing_message: string,
    announcement: string,
    outcomes: string[],
  ): Promise<string[]> {
    return this.sendMessage("create_tweaked_signatures_wasm", [
      losing_message,
      announcement,
      outcomes,
    ]);
  }

  public complete_signature_wasm(
    encrypted_sig: string,
    attestation: string,
  ): Promise<string> {
    return this.sendMessage("complete_signature_wasm", [
      encrypted_sig,
      attestation,
    ]);
  }

  // ... Add other methods as needed
}

// Utility function to generate unique IDs (implement accordingly)
function generateUniqueId(): string {
  // Implement a method to generate unique IDs, such as UUIDs or another method
  return Math.random().toString(36).substring(2, 15);
}
