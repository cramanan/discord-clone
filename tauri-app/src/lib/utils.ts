import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Page } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNextPageParam<T>(lastPage: Page<T>) {
  return lastPage.page < Math.ceil(lastPage.total / lastPage.perPage)
    ? lastPage.page + 1
    : undefined;
}
