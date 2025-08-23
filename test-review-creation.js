// Test creating a sample review
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testReviewCreation() {
  console.log("Testing review creation...");

  // First, check if we have any users
  const { data: users, error: usersError } = await supabase
    .from("auth.users")
    .select("id, email")
    .limit(1);

  if (usersError) {
    console.log("Cannot fetch users (expected with RLS):", usersError.message);
  }

  // Test the reviews table structure
  console.log("Testing review table access...");

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("*");

  if (reviewsError) {
    console.error("Error accessing reviews table:", reviewsError);
  } else {
    console.log("✅ Reviews table accessible");
    console.log("Current reviews count:", reviews?.length || 0);
  }

  // Test querying reviews for specific products
  const { data: productReviews, error: queryError } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", 1);

  if (queryError) {
    console.error("❌ Error querying product reviews:", queryError);
  } else {
    console.log("✅ Product reviews query working");
    console.log(`Reviews for product 1: ${productReviews?.length || 0}`);
  }

  // Test inserting a review (this might fail due to RLS if not authenticated)
  console.log("Testing review insertion...");

  const testReview = {
    product_id: 1,
    rating: 5,
    comment: "Test review for the hair oil product",
    approved: false,
    // Note: user_id will be handled by RLS/auth
  };

  const { data: insertResult, error: insertError } = await supabase
    .from("reviews")
    .insert([testReview])
    .select();

  if (insertError) {
    if (insertError.code === "42501") {
      console.log(
        "ℹ️  Review insertion blocked by RLS (expected - need to be authenticated)"
      );
      console.log("✅ This means the security is working correctly");
    } else {
      console.error("❌ Unexpected error inserting review:", insertError);
    }
  } else {
    console.log("✅ Review inserted successfully:", insertResult);
  }
}

testReviewCreation();
