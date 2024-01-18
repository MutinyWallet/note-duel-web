/* eslint-disable @typescript-eslint/no-namespace */
// solid-js-custom.d.ts
import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface ImgHTMLAttributes<T> extends JSX.HTMLAttributes<T> {
      src?: string; // Adjust the type as needed
      // Add any other properties you need to override or extend
    }
  }
}
