import { Header } from "~/components";
import { EventCreator } from "~/components/EventCreator";
import { useMegaStore } from "~/state/megaStore";

export function New() {
  const [state, _actions] = useMegaStore();

  const onSave = async () => {
    // setDialogOpen(false);
    // await refetch();
  };

  return (
    <>
      <Header />
      <main>
        <h2 class="text-2xl font-bold my-4">New</h2>
        <EventCreator onSave={onSave} />
      </main>
    </>
  );
}
