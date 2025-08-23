// Test if reviews are being submitted but not shown in admin panel
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminReviewAccess() {
  console.log("🔍 TESTING ADMIN PANEL REVIEW ACCESS");
  console.log("====================================\n");

  try {
    // Test 1: Check if admin can see all reviews (including unapproved)
    console.log("1️⃣ Testing admin access to all reviews...");
    const { data: allReviews, error: allError } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (allError) {
      console.log("❌ Admin cannot access reviews:", allError.message);
      console.log("   Error code:", allError.code);
    } else {
      console.log("✅ Admin can access reviews");
      console.log(`   Total reviews found: ${allReviews.length}`);

      if (allReviews.length > 0) {
        console.log("   Review details:");
        allReviews.forEach((review, index) => {
          console.log(
            `     ${index + 1}. ID: ${review.id}, Product: ${
              review.product_id
            }, Approved: ${review.approved}`
          );
          console.log(
            `        Comment: "${review.comment.substring(0, 50)}..."`
          );
          console.log(`        Created: ${review.created_at}`);
        });
      }

      const approvedCount = allReviews.filter((r) => r.approved).length;
      const pendingCount = allReviews.filter((r) => !r.approved).length;

      console.log(
        `   📊 Stats: ${approvedCount} approved, ${pendingCount} pending`
      );
    }

    // Test 2: Test specific review queries that admin panel uses
    console.log("\n2️⃣ Testing admin panel specific queries...");

    // Test approved reviews query
    const { data: approvedReviews, error: approvedError } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true);

    if (approvedError) {
      console.log("❌ Cannot query approved reviews:", approvedError.message);
    } else {
      console.log(
        `✅ Approved reviews query works: ${approvedReviews.length} found`
      );
    }

    // Test pending reviews query
    const { data: pendingReviews, error: pendingError } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", false);

    if (pendingError) {
      console.log("❌ Cannot query pending reviews:", pendingError.message);
    } else {
      console.log(
        `✅ Pending reviews query works: ${pendingReviews.length} found`
      );
    }

    // Test 3: Try to manually insert a review to see if it shows up
    console.log("\n3️⃣ Testing review insertion...");

    const testReview = {
      product_id: 2,
      user_id: "12345678-1234-1234-1234-123456789abc", // Valid UUID format
      rating: 4,
      comment:
        "Test review for admin panel debugging - " + new Date().toISOString(),
      approved: false, // Default state
    };

    const { data: insertData, error: insertError } = await supabase
      .from("reviews")
      .insert([testReview])
      .select();

    if (insertError) {
      console.log("❌ Review insertion failed:", insertError.message);
      console.log("   Error code:", insertError.code);

      if (insertError.code === "42501") {
        console.log("   🔒 This is the RLS blocking issue we identified");
        console.log("   💡 Solution: Need to run the RLS policy SQL commands");
      }
    } else {
      console.log("✅ Review inserted successfully:", insertData[0].id);
      console.log("   This review should now appear in admin panel");
    }

    // Test 4: Check what happens when we try to update a review
    console.log("\n4️⃣ Testing review update (admin approval)...");

    if (allReviews && allReviews.length > 0) {
      const firstReview = allReviews[0];
      const { data: updateData, error: updateError } = await supabase
        .from("reviews")
        .update({ approved: !firstReview.approved })
        .eq("id", firstReview.id)
        .select();

      if (updateError) {
        console.log("❌ Review update failed:", updateError.message);
        console.log("   This means admin cannot approve/reject reviews");
      } else {
        console.log("✅ Review update successful");
        console.log("   Admin can approve/reject reviews");

        // Revert the change
        await supabase
          .from("reviews")
          .update({ approved: firstReview.approved })
          .eq("id", firstReview.id);
      }
    } else {
      console.log("   ⚠️ No reviews to test update on");
    }
  } catch (error) {
    console.log("💥 Unexpected error:", error.message);
  }

  console.log("\n====================================");
  console.log("🎯 ADMIN PANEL TEST COMPLETE");
}

testAdminReviewAccess();
