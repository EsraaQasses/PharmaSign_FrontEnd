import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge.
 * Works with NativeWind's className prop.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Always false in React Native — there is no iframe concept.
 */
export const isIframe = false;
