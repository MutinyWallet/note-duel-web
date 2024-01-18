import { Button, Header } from "~/components";
import { useMegaStore } from "~/state/megaStore";
import { PreKeyValue } from "./home";

type Profile = {
  image: string;
  name: string;
  npub: string;
};

export function Profile() {
  const [state, _actions] = useMegaStore();

  if (state.noteDuel === undefined) {
    console.log("no state");
  }

  function signOut() {
    localStorage.removeItem("nsec");
    window.location.href = "/";
  }

  return (
    <>
      <Header />
      <main class="flex flex-col items-start w-full p-4 gap-4 max-w-[30rem]">
        <h2 class="text-2xl font-semibold">{state.profile?.name}</h2>
        <PreKeyValue key="npub">
          <a
            class="whitespace-pre-wrap break-all"
            href={`https://njump.me/${state.profile?.npub}`}
          >
            {state.profile?.npub}
          </a>
        </PreKeyValue>
        <Button onClick={signOut}>Sign Out</Button>
      </main>
    </>
  );
}
