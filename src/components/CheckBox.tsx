import { Checkbox as KCheckbox } from "@kobalte/core";
import { Show } from "solid-js";
import { TinyText } from "~/components/Misc";
import check from "~/assets/icons/check.svg";

export function Checkbox(props: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  caption?: string;
}) {
  return (
    <KCheckbox.Root
      class="inline-flex gap-2"
      classList={{
        "items-center": !props.caption,
        "items-start": !!props.caption,
      }}
      checked={props.checked}
      onChange={props.onChange}
    >
      <KCheckbox.Input class="" />
      <KCheckbox.Control class="flex-0 h-8 w-8 rounded-lg border-2 border-white bg-neutral-800 ui-checked:bg-m-red">
        <KCheckbox.Indicator>
          <img src={check} class="h-8 w-8" alt="check" />
        </KCheckbox.Indicator>
      </KCheckbox.Control>
      <KCheckbox.Label class="flex flex-1 flex-col gap-1 font-semibold">
        {props.label}
        <Show when={props.caption}>
          <TinyText>{props.caption}</TinyText>
        </Show>
      </KCheckbox.Label>
    </KCheckbox.Root>
  );
}
