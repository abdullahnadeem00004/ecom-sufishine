import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `PKR ${amount.toFixed(2)}`;
}

export function calculateDeliveryCharges(totalQuantity: number): number {
  return totalQuantity <= 3 ? 150 : 220;
}
