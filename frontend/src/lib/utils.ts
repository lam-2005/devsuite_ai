import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: string | Date, _tick?: number) {
  const now = new Date();
  const target = new Date(date);

  const diffInSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  const divisions = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Infinity, unit: "year" },
  ] as const;

  let duration = diffInSeconds;

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(
        Math.round(duration),
        division.unit as Intl.RelativeTimeFormatUnit,
      );
    }
    duration /= division.amount;
  }
}
