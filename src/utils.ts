import { Announcement, NoteDuel } from "@benthecarman/note-duel";
import NDK, { NDKEvent } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";

/// Sometimes we catch an error as `unknown` so this turns it into an Error.
export function eify(e: unknown): Error {
  if (e instanceof Error) {
    return e;
  } else if (typeof e === "string") {
    return new Error(e);
  } else {
    return new Error("Unknown error");
  }
}

export interface DecodedNDKEvent extends NDKEvent {
  decodedContent?: Announcement;
}

export async function decodeNdkEvents(
  events: Set<NDKEvent>,
): Promise<DecodedNDKEvent[]> {
  const unfiltered = Array.from(events);

  if (unfiltered.length === 0) {
    return [];
  }

  // Make sure every item has a content field
  const hasContent = unfiltered.every((sup) => sup.content !== undefined);

  if (!hasContent) {
    return [];
  }

  const decoded: DecodedNDKEvent[] = await Promise.all(
    unfiltered.map(async (sup) => {
      const decodedEvent = sup as DecodedNDKEvent;
      try {
        const decodedContent = await NoteDuel.decode_announcement(sup.content);
        decodedEvent.decodedContent = decodedContent;
        return decodedEvent;
      } catch (e) {
        console.error(e);
        return decodedEvent;
      }
    }),
  );

  return decoded;

  // return decoded.filter(
  //   (sup) =>
  //     (sup.decodedContent?.event_maturity_epoch || 0) > Date.now() / 1000,
  // );
}

export type Profile = {
  image: string;
  name: string;
  npub: string;
};

export async function fetchProfile(
  ndk: NDK,
  npub: string,
): Promise<Profile | undefined> {
  const hexpub = nip19.decode(npub);
  console.log(hexpub.data.toString());
  const profileEvent = await ndk.fetchEvent({
    kinds: [0],
    authors: [hexpub.data.toString()],
    limit: 1,
  });

  if (!profileEvent) {
    return;
  }

  try {
    const content = JSON.parse(profileEvent.content);

    const profile = {
      npub: npub,
      image: content.picture,
      name: content.name,
    };

    return profile;
  } catch (e) {
    console.error(e);
  }
}
