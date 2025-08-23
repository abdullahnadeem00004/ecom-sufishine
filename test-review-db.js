// Test review submission for the new shampoo product
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xnbbsaybxdskxlptahmb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuYmJzYXlieGRza3hscHRhaG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1OTQ3ODQsImV4cCI6MjAzOTE3MDc4NH0.vCjGtPJYM9XtQGKZODJR6oCDrAM1VQOhO3KnT8QsOSc";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testReviewSubmission() {
  try {
    console.log("Testing review submission for product ID 2 (shampoo)...");

    // First, let's check if the product exists
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("id", 2);

    if (productsError) {
      console.error("Error fetching product:", productsError);
      return;
    }

    console.log("Product found:", products[0]);

    // Try to insert a test review (this will fail due to RLS if user is not authenticated)
    const { data: reviewData, error: reviewError } = await supabase
      .from("reviews")
      .insert({
        product_id: 2,
        rating: 5,
        comment: "Test review for the new shampoo product",
        user_id: "test-user-id", // This will likely fail due to RLS
      });

    if (reviewError) {
      console.error(
        "Review insertion failed (expected due to RLS):",
        reviewError.message
      );
    } else {
      console.log("Review inserted successfully:", reviewData);
    }

    // Check existing reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", 2);

    if (reviewsError) {
      console.error("Error fetching reviews:", reviewsError);
    } else {
      console.log(`Found ${reviews.length} reviews for product 2:`, reviews);
    }
  } catch (error) {
    console.error("Test error:", error);
  }
}

testReviewSubmission();
