import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  return `${isNegative ? '-' : '+'}$${absValue.toFixed(2)}B`;
}
