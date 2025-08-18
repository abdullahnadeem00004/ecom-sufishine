// Test script to verify shipping calculations
// Run this with: node test-shipping.js

function calculateShippingCharge(totalQuantity) {
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

console.log("=== Shipping Charges Test ===");
console.log();

// Test cases
const testCases = [
  0, // No items
  1, // 1 item
  4, // 4 items (first group)
  5, // 5 items (second group starts)
  8, // 8 items (second group full)
  9, // 9 items (third group starts)
  12, // 12 items (third group full)
  13, // 13 items (fourth group starts)
];

testCases.forEach((quantity) => {
  const result = calculateShippingCharge(quantity);
  console.log(`${quantity} items:`);
  console.log(`  Groups of 4: ${result.breakdown.groupsOf4}`);
  console.log(`  Base charge: PKR ${result.breakdown.baseFourProducts}`);
  console.log(`  Additional: PKR ${result.breakdown.additionalCharges}`);
  console.log(`  Total shipping: PKR ${result.shippingCharge}`);
  console.log();
});

console.log("Expected behavior:");
console.log("- 1-4 items: PKR 200");
console.log("- 5-8 items: PKR 250 (200 + 50)");
console.log("- 9-12 items: PKR 300 (200 + 50 + 50)");
console.log("- 13-16 items: PKR 350 (200 + 50 + 50 + 50)");
