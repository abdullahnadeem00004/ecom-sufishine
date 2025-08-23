// Test the ProductIdMapper functionality
import { ProductIdMapper } from "./src/lib/productIdMapper.js";

console.log("Testing ProductIdMapper...\n");

// Test UUID to integer conversion
const uuidProducts = [
  "4bd70879-bb29-4be1-892c-6aef96af930f",
  "a1234567-89ab-cdef-0123-456789abcdef",
];

console.log("UUID to Integer mapping:");
uuidProducts.forEach((uuid) => {
  const intId = ProductIdMapper.getIntegerIdForUUID(uuid);
  console.log(`UUID ${uuid} -> Integer ${intId}`);
});

// Test database conversion
console.log("\nDatabase conversion test:");
console.log(
  `UUID "4bd70879-bb29-4be1-892c-6aef96af930f" -> DB ID: ${ProductIdMapper.toIntegerForDB(
    "4bd70879-bb29-4be1-892c-6aef96af930f"
  )}`
);
console.log(`Integer 2 -> DB ID: ${ProductIdMapper.toIntegerForDB(2)}`);
console.log(`String "2" -> DB ID: ${ProductIdMapper.toIntegerForDB("2")}`);
