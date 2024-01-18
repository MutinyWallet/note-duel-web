import { Dialog, Separator } from "@kobalte/core";
import { JSX, ParentComponent, Show } from "solid-js";
import close from "~/assets/icons/close.svg";

export const SmallHeader: ParentComponent<{ class?: string }> = (props) => {
  return (
    <header class={`text-sm font-semibold uppercase ${props.class}`}>
      {props.children}
    </header>
  );
};

export const Card: ParentComponent<{
  title?: string | null;
  titleElement?: JSX.Element;
}> = (props) => {
  return (
    <div class="flex w-full flex-col gap-2 rounded-xl bg-neutral-950/50 p-4">
      {props.title && <SmallHeader>{props.title}</SmallHeader>}
      {props.titleElement && props.titleElement}
      {props.children}
    </div>
  );
};

export const InnerCard: ParentComponent<{ title?: string }> = (props) => {
  return (
    <div class="flex flex-col gap-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-4">
      {props.title && <SmallHeader>{props.title}</SmallHeader>}
      {props.children}
    </div>
  );
};

export const FancyCard: ParentComponent<{
  title?: string;
  subtitle?: string;
  tag?: JSX.Element;
}> = (props) => {
  return (
    <div class="flex flex-col gap-2 rounded-xl border border-b-4 border-black/50 bg-m-grey-800 p-4 shadow-fancy-card">
      {props.children}
    </div>
  );
};

export const SettingsCard: ParentComponent<{
  title?: string;
}> = (props) => {
  return (
    <VStack smallgap>
      <div class="mt-2 pl-4">
        <SmallHeader>{props.title}</SmallHeader>
      </div>
      <div class="flex w-full flex-col gap-2 rounded-xl bg-m-grey-800 py-4">
        {props.children}
      </div>
    </VStack>
  );
};

export const SafeArea: ParentComponent = (props) => {
  return (
    <div class="safe-left safe-right h-device">
      {/* <div class="flex-1 disable-scrollbars overflow-y-scroll md:pl-[8rem] md:pr-[6rem]"> */}
      {props.children}
      {/* </div> */}
    </div>
  );
};

export const DefaultMain: ParentComponent = (props) => {
  return (
    <main class="mx-auto flex h-full w-full max-w-[600px] flex-col gap-4 p-4">
      {props.children}
      {/* CSS is hard sometimes */}
      <div class="py-1" />
    </main>
  );
};

export const Hr = () => <Separator.Root class="my-4 border-m-grey-750" />;

export const KeyValue: ParentComponent<{ key: string }> = (props) => {
  return (
    <li class="flex items-center justify-between gap-6">
      <span class="min-w-max text-sm font-semibold uppercase text-m-grey-400">
        {props.key}
      </span>
      <span class="truncate font-light">{props.children}</span>
    </li>
  );
};

export const LargeHeader: ParentComponent<{
  action?: JSX.Element;
  centered?: boolean;
}> = (props) => {
  return (
    <header
      class="mb-2 mt-4 flex w-full items-center justify-between"
      classList={{
        "justify-between": !props.centered,
        "justify-center": props.centered,
      }}
    >
      <h1
        class="text-3xl font-semibold"
        classList={{
          "text-center": props.centered,
        }}
      >
        {props.children}
      </h1>
      <Show when={props.action}>{props.action}</Show>
    </header>
  );
};

export const VStack: ParentComponent<{
  biggap?: boolean;
  smallgap?: boolean;
}> = (props) => {
  return (
    <div
      class="flex flex-col"
      classList={{
        "gap-2": props.smallgap,
        "gap-8": props.biggap,
        "gap-4": !props.biggap && !props.smallgap,
      }}
    >
      {props.children}
    </div>
  );
};

export const HStack: ParentComponent<{ biggap?: boolean }> = (props) => {
  return (
    <div class={`flex gap-${props.biggap ? "8" : "4"}`}>{props.children}</div>
  );
};

export const SmallAmount: ParentComponent<{
  amount: number | bigint;
  sign?: string;
}> = (props) => {
  return (
    <h2 class="text-lg font-light">
      {props.sign ? `${props.sign} ` : ""}
      {props.amount.toLocaleString()} <span class="text-sm">SATS</span>
    </h2>
  );
};

export const NiceP: ParentComponent = (props) => {
  return <p class="text-xl font-light text-neutral-200">{props.children}</p>;
};

export const TinyText: ParentComponent = (props) => {
  return <p class="text-sm text-neutral-400">{props.children}</p>;
};

export const Indicator: ParentComponent = (props) => {
  return (
    <div class="-my-1 box-border animate-pulse rounded bg-white/70 px-2 py-1 text-xs uppercase text-black">
      {props.children}
    </div>
  );
};

export function ModalCloseButton() {
  return (
    <button class="self-center justify-self-center rounded-lg hover:bg-white/10 active:bg-m-blue">
      <img src={close} alt="Close" class="h-8 w-8" />
    </button>
  );
}

export const SIMPLE_OVERLAY = "fixed inset-0 z-50 bg-black/50 backdrop-blur-lg";
export const SIMPLE_DIALOG_POSITIONER =
  "fixed inset-0 z-50 flex items-center justify-center";
export const SIMPLE_DIALOG_CONTENT =
  "max-w-[500px] w-[90vw] max-h-device overflow-y-scroll disable-scrollbars mx-4 p-4 bg-neutral-800/90 rounded-xl border border-white/10";

export const SimpleDialog: ParentComponent<{
  title: string;
  open: boolean;
  setOpen?: (open: boolean) => void;
}> = (props) => {
  return (
    <Dialog.Root
      open={props.open}
      onOpenChange={props.setOpen && props.setOpen}
    >
      <Dialog.Portal>
        <Dialog.Overlay class={SIMPLE_OVERLAY} />
        <div class={SIMPLE_DIALOG_POSITIONER}>
          <Dialog.Content class={SIMPLE_DIALOG_CONTENT}>
            <div class="mb-2 flex items-center justify-between">
              <Dialog.Title>
                <SmallHeader>{props.title}</SmallHeader>
              </Dialog.Title>
              <Show when={props.setOpen}>
                <Dialog.CloseButton>
                  <ModalCloseButton />
                </Dialog.CloseButton>
              </Show>
            </div>
            <Dialog.Description class="flex flex-col gap-4">
              {props.children}
            </Dialog.Description>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
