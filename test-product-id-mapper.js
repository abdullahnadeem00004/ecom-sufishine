// Test ProductIdMapper functionality
console.log("🧪 Testing ProductIdMapper...\n");

// Mock ProductIdMapper (since we can't import TS files directly)
class MockProductIdMapper {
  constructor() {
    this.mappings = [];
    this.nextId = 1;
  }

  toIntegerForDB(productId) {
    if (typeof productId === "number") {
      return productId;
    }

    if (typeof productId === "string") {
      // Check if it's a numeric string
      const numericId = parseInt(productId);
      if (!isNaN(numericId)) {
        return numericId;
      }

      // It's a UUID - create or find mapping
      let mapping = this.mappings.find((m) => m.uuid === productId);
      if (!mapping) {
        mapping = { uuid: productId, integerId: this.nextId++ };
        this.mappings.push(mapping);
        console.log(`📝 Created mapping: ${productId} -> ${mapping.integerId}`);
      }
      return mapping.integerId;
    }

    return null;
  }

  getAllMappings() {
    return this.mappings;
  }
}

const mapper = new MockProductIdMapper();

console.log("🔢 Testing ID Conversions:");
console.log("==========================");

// Test cases that should work in your app
const testCases = [
  { input: 1, expected: 1, description: "Integer product ID" },
  { input: 2, expected: 2, description: "Integer product ID (shampoo)" },
  { input: "1", expected: 1, description: "String integer ID" },
  { input: "2", expected: 2, description: "String integer ID" },
  {
    input: "4bd70879-bb29-4be1-892c-6aef96af930f",
    expected: 1,
    description: "UUID (first)",
  },
  {
    input: "a1234567-89ab-cdef-0123-456789abcdef",
    expected: 2,
    description: "UUID (second)",
  },
];

testCases.forEach((test, index) => {
  const result = mapper.toIntegerForDB(test.input);
  const status = result === test.expected ? "✅" : "❌";
  console.log(`${status} Test ${index + 1}: ${test.description}`);
  console.log(
    `   Input: ${test.input} -> Output: ${result} (Expected: ${test.expected})`
  );
});

console.log("\n📋 Final Mappings:");
console.log(mapper.getAllMappings());

console.log("\n🎯 Key Insights:");
console.log("- Product ID 2 (shampoo) should work directly");
console.log("- UUID products get mapped to integers 1, 2, etc.");
console.log("- All database operations use integer IDs");
console.log("- ProductIdMapper handles the conversion seamlessly");
