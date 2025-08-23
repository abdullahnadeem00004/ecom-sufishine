// Script to add test products directly to Supabase
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestProducts() {
  console.log("Adding test products...");

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
  ];

  for (const product of products) {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select();

    if (error) {
      console.error("Error inserting product:", product.name, error);
    } else {
      console.log("Successfully inserted:", product.name);
    }
  }

  // Verify products were inserted
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

addTestProducts();
