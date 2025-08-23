// Script to fix product IDs in the database
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProductIds() {
  console.log("Fixing product IDs...");

  // Delete existing products (there's only one UUID-based product)
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

  if (deleteError) {
    console.error("Error deleting existing products:", deleteError);
  } else {
    console.log("Cleared existing products");
  }

  // Insert new products with integer IDs (auto-generated)
  const products = [
    {
      name: "SUFI SHINE Hair Oil Premium",
      description:
        "Premium herbal hair oil with natural ingredients for strong, shiny hair",
      price: 25.0,
      stock: 100,
      image_url: "/assets/hair-oil-bottle.png",
    },
    {
      name: "Natural Glow Face Cream",
      description: "Organic face cream for radiant, healthy skin",
      price: 35.0,
      stock: 50,
      image_url: "/assets/ChatGPT Image Aug 18, 2025, 11_27_32 PM.png",
    },
    {
      name: "Herbal Moisturizer",
      description: "Daily moisturizer with herbal extracts",
      price: 20.0,
      stock: 75,
      image_url: "/placeholder.svg",
    },
    {
      name: "Organic Hair Mask",
      description: "Deep conditioning mask with organic ingredients",
      price: 32.0,
      stock: 50,
      image_url: "/placeholder.svg",
    },
  ];

  const { data, error } = await supabase
    .from("products")
    .insert(products)
    .select();

  if (error) {
    console.error("Error inserting products:", error);
  } else {
    console.log("Successfully inserted products:", data);
  }

  // Verify products
  const { data: allProducts, error: fetchError } = await supabase
    .from("products")
    .select("*");

  if (fetchError) {
    console.error("Error fetching products:", fetchError);
  } else {
    console.log("Total products in database:", allProducts?.length);
    console.log("Products:", allProducts);
  }
}

fixProductIds();
