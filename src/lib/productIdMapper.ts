// Product ID mapping utility for reviews
// This allows UUID products to work with integer-based reviews table

interface ProductMapping {
  uuid: string;
  integerId: number;
}

// In-memory mapping (you could also store this in localStorage or database)
let productMappings: ProductMapping[] = [];
let nextIntegerId = 1;

export const ProductIdMapper = {
  // Get integer ID for a UUID, create mapping if doesn't exist
  getIntegerIdForUUID(uuid: string): number {
    // Try to find existing mapping
    const existing = productMappings.find((m) => m.uuid === uuid);
    if (existing) {
      return existing.integerId;
    }

    // Create new mapping
    const newMapping: ProductMapping = {
      uuid,
      integerId: nextIntegerId++,
    };

    productMappings.push(newMapping);

    // Store in localStorage for persistence
    localStorage.setItem("productMappings", JSON.stringify(productMappings));
    localStorage.setItem("nextIntegerId", nextIntegerId.toString());

    return newMapping.integerId;
  },

  // Get UUID for an integer ID
  getUUIDForIntegerId(integerId: number): string | null {
    const mapping = productMappings.find((m) => m.integerId === integerId);
    return mapping?.uuid || null;
  },

  // Initialize from localStorage
  initialize() {
    try {
      const stored = localStorage.getItem("productMappings");
      const storedNextId = localStorage.getItem("nextIntegerId");

      if (stored) {
        productMappings = JSON.parse(stored);
      }

      if (storedNextId) {
        nextIntegerId = parseInt(storedNextId);
      }
    } catch (error) {
      console.warn("Could not load product mappings from localStorage:", error);
      productMappings = [];
      nextIntegerId = 1;
    }
  },

  // Convert product ID to integer for database operations
  toIntegerForDB(productId: string | number): number {
    if (typeof productId === "number") {
      return productId; // Already integer
    }

    // UUID string - get or create integer mapping
    return this.getIntegerIdForUUID(productId);
  },

  // Convert from database integer to frontend product ID
  fromDBInteger(
    integerId: number,
    allProducts: Array<{ id: string | number }>
  ): string | number {
    // First check if we have a UUID mapping
    const uuid = this.getUUIDForIntegerId(integerId);
    if (uuid) {
      // Verify the UUID still exists in products
      const productExists = allProducts.some((p) => p.id === uuid);
      if (productExists) {
        return uuid;
      }
    }

    // Fallback to integer ID
    return integerId;
  },

  // Get all mappings (for debugging)
  getAllMappings() {
    return [...productMappings];
  },
};

// Initialize on import
ProductIdMapper.initialize();
