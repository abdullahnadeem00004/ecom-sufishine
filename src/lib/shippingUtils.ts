// Shipping calculation utilities

export interface ShippingDetails {
  baseRate: number;
  totalQuantity: number;
  shippingCharge: number;
  breakdown: {
    baseFourProducts: number;
    additionalCharges: number;
    groupsOf4: number;
  };
}

/**
 * Calculate shipping charges based on product quantity
 * Rules:
 * - First 4 products: 200 PKR
 * - Every additional 4 products: +50 PKR each
 *
 * Examples:
 * - 1-4 products: 200 PKR
 * - 5-8 products: 250 PKR (200 + 50)
 * - 9-12 products: 300 PKR (200 + 50 + 50)
 */
export function calculateShippingCharge(
  totalQuantity: number
): ShippingDetails {
  const baseRate = 200; // PKR for first 4 products
  const additionalRate = 50; // PKR for each additional group of 4

  if (totalQuantity === 0) {
    return {
      baseRate: 0,
      totalQuantity,
      shippingCharge: 0,
      breakdown: {
        baseFourProducts: 0,
        additionalCharges: 0,
        groupsOf4: 0,
      },
    };
  }

  // Calculate number of groups of 4 products
  const groupsOf4 = Math.ceil(totalQuantity / 4);

  // First group is charged at base rate (200), additional groups at 50 each
  const baseFourProducts = baseRate;
  const additionalGroups = Math.max(0, groupsOf4 - 1);
  const additionalCharges = additionalGroups * additionalRate;

  const shippingCharge = baseFourProducts + additionalCharges;

  return {
    baseRate,
    totalQuantity,
    shippingCharge,
    breakdown: {
      baseFourProducts,
      additionalCharges,
      groupsOf4,
    },
  };
}

/**
 * Format shipping charge breakdown for display
 */
export function formatShippingBreakdown(details: ShippingDetails): string {
  if (details.totalQuantity === 0) return "No shipping required";

  const { breakdown, totalQuantity } = details;

  if (breakdown.groupsOf4 === 1) {
    return `Shipping for ${totalQuantity} item${
      totalQuantity !== 1 ? "s" : ""
    } (1-4 products): PKR ${breakdown.baseFourProducts}`;
  }

  return `Shipping for ${totalQuantity} items: PKR ${
    breakdown.baseFourProducts
  } (first 4) + PKR ${breakdown.additionalCharges} (${
    breakdown.groupsOf4 - 1
  } additional group${breakdown.groupsOf4 - 1 !== 1 ? "s" : ""})`;
}

/**
 * Get shipping charge explanation text
 */
export function getShippingExplanation(): string {
  return "Shipping charges: PKR 200 for first 4 products, then PKR 50 for each additional group of 4 products";
}
