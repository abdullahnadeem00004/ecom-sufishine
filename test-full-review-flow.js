// Complete authentication and review test
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";
const supabase = createClient(supabaseUrl, supabaseKey);

async function fullReviewTest() {
  console.log("🔄 FULL AUTHENTICATION & REVIEW TEST");
  console.log("=====================================\n");

  const testEmail = "test@sufishine.com";
  const testPassword = "testpassword123";

  try {
    // Step 1: Clean up any existing session
    console.log("1️⃣ Cleaning up existing session...");
    await supabase.auth.signOut();
    console.log("✅ Session cleaned\n");

    // Step 2: Try to sign up
    console.log("2️⃣ Attempting sign up...");
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: testEmail,
        password: testPassword,
      }
    );

    if (signUpError && !signUpError.message.includes("already registered")) {
      console.log("❌ Sign up error:", signUpError.message);
    } else {
      console.log("✅ Sign up successful or user already exists\n");
    }

    // Step 3: Sign in
    console.log("3️⃣ Attempting sign in...");
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

    if (signInError) {
      console.log("❌ Sign in error:", signInError.message);
      return;
    }

    console.log("✅ Sign in successful");
    console.log("👤 User ID:", signInData.user.id);
    console.log("📧 Email:", signInData.user.email, "\n");

    // Step 4: Verify session
    console.log("4️⃣ Verifying session...");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.log("❌ Session verification failed");
      return;
    }

    console.log("✅ Active session confirmed\n");

    // Step 5: Test review submission for product 2
    console.log("5️⃣ Testing review submission for product 2...");
    const reviewData = {
      user_id: session.user.id,
      product_id: 2,
      rating: 5,
      comment: `Test review submitted on ${new Date().toISOString()}`,
    };

    console.log("📝 Review data:", reviewData);

    const { data: reviewResult, error: reviewError } = await supabase
      .from("reviews")
      .insert([reviewData])
      .select();

    if (reviewError) {
      console.log("❌ Review submission failed:", reviewError.message);
      console.log("   Error code:", reviewError.code);
      console.log("   Error details:", reviewError.details);

      // Analyze the error
      if (reviewError.code === "42501") {
        console.log("🔒 Issue: RLS policy blocking authenticated user");
        console.log(
          "   Solution: Need to update RLS policy to allow authenticated users"
        );
      } else if (reviewError.code === "23503") {
        console.log("🔗 Issue: Foreign key constraint violation");
        console.log("   Solution: Check if user_id or product_id exists");
      } else {
        console.log("❓ Unknown error type");
      }
    } else {
      console.log("✅ Review submitted successfully!");
      console.log("📊 Review result:", reviewResult);
    }

    // Step 6: Try to fetch reviews
    console.log("\n6️⃣ Testing review fetch...");
    const { data: fetchedReviews, error: fetchError } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", 2);

    if (fetchError) {
      console.log("❌ Review fetch failed:", fetchError.message);
    } else {
      console.log("✅ Reviews fetched successfully");
      console.log("📄 Total reviews for product 2:", fetchedReviews.length);
      fetchedReviews.forEach((review, index) => {
        console.log(
          `   Review ${index + 1}: Rating ${review.rating}, Approved: ${
            review.approved
          }`
        );
      });
    }

    // Step 7: Clean up
    console.log("\n7️⃣ Cleaning up...");
    await supabase.auth.signOut();
    console.log("✅ Signed out successfully");
  } catch (error) {
    console.log("💥 Unexpected error:", error.message);
  }

  console.log("\n=====================================");
  console.log("🏁 Full test completed");
}

fullReviewTest();
