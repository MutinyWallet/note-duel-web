import { A } from "@solidjs/router";

export function Header() {
  return (
    <header class="w-full border-b border-white flex justify-between p-4 items-center">
      <A href="/" class="no-underline">
        <h1 class="text-4xl drop-shadow-text-glow font-bold">Note Duel</h1>
      </A>
      <A href="/profile" class="no-underline">
        <div class="text-black bg-white w-8 h-8 rounded-full flex items-center justify-center">
          {":)"}
        </div>
      </A>
    </header>
  );
}
