// Debug review submission issue
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugReviewSubmission() {
  console.log("🔍 Debugging review submission...");

  // Check current authentication
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  console.log(
    "Auth session:",
    session ? "User is logged in" : "No active session"
  );

  if (sessionError) {
    console.error("Session error:", sessionError);
  }

  // Check reviews table policies
  console.log("\n📋 Testing reviews table access...");

  // Test SELECT (should work with approved = true policy)
  const { data: reviews, error: selectError } = await supabase
    .from("reviews")
    .select("*")
    .limit(1);

  if (selectError) {
    console.error("❌ SELECT error:", selectError);
  } else {
    console.log("✅ SELECT works, current reviews:", reviews?.length || 0);
  }

  // Test INSERT without authentication (should fail)
  console.log("\n🔒 Testing INSERT without auth (should fail)...");

  const testReview = {
    product_id: 2,
    rating: 5,
    comment: "Test review for debugging",
    // No user_id - should fail
  };

  const { data: insertResult, error: insertError } = await supabase
    .from("reviews")
    .insert([testReview])
    .select();

  if (insertError) {
    console.log("✅ INSERT blocked (expected):", insertError.message);
  } else {
    console.log("❌ INSERT succeeded unexpectedly:", insertResult);
  }

  // Check the RLS policies
  console.log("\n🛡️  Checking RLS policies...");

  const { data: policies, error: policiesError } = await supabase
    .from("pg_policies")
    .select("*")
    .eq("tablename", "reviews");

  if (policiesError) {
    console.log("Cannot check policies (expected):", policiesError.message);
  } else {
    console.log("RLS Policies:", policies);
  }

  // Test with mock user_id (will still fail due to RLS)
  console.log("\n🧪 Testing with mock user_id...");

  const testReviewWithUser = {
    user_id: "00000000-0000-0000-0000-000000000000", // Mock UUID
    product_id: 2,
    rating: 4,
    comment: "Test review with user_id",
  };

  const { data: mockResult, error: mockError } = await supabase
    .from("reviews")
    .insert([testReviewWithUser])
    .select();

  if (mockError) {
    if (mockError.code === "42501") {
      console.log("✅ RLS properly blocking unauthorized insert");
    } else if (mockError.code === "23503") {
      console.log("✅ Foreign key constraint working (user doesn't exist)");
    } else {
      console.log("❓ Unexpected error:", mockError);
    }
  } else {
    console.log("❌ Insert succeeded unexpectedly:", mockResult);
  }
}

debugReviewSubmission();
