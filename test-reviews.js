// Test review functionality
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testReviews() {
  console.log("Testing review system...");

  // Check reviews table structure
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("*")
    .limit(5);

  if (reviewsError) {
    console.error("Error fetching reviews:", reviewsError);
  } else {
    console.log("Current reviews:", reviews);
  }

  // Test querying reviews for an integer product ID
  const testProductId = 1; // Now using integer ID

  const { data: productReviews, error: queryError } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", testProductId);

  if (queryError) {
    console.error("Error querying reviews for integer product:", queryError);
  } else {
    console.log(`Reviews for product ${testProductId}:`, productReviews);
  }
}

testReviews();
