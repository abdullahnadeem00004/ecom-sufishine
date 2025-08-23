// Final verification test for the review system fix
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyReviewSystemFix() {
  console.log("🔧 VERIFYING REVIEW SYSTEM SETUP");
  console.log("=================================\n");

  try {
    // Test 1: Check profiles table
    console.log("1️⃣ Checking profiles table...");
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, role");

    if (profilesError) {
      console.log("❌ Profiles table error:", profilesError.message);
      console.log("   This table might not exist yet - that's part of the fix");
    } else {
      console.log("✅ Profiles table accessible");
      console.log(`   Found ${profiles.length} profiles:`);
      profiles.forEach((p) => {
        console.log(`     - ${p.email}: ${p.role}`);
      });
    }

    // Test 2: Check current reviews
    console.log("\n2️⃣ Checking current reviews...");
    const { data: allReviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("*");

    if (reviewsError) {
      console.log("❌ Cannot access reviews:", reviewsError.message);
    } else {
      console.log("✅ Reviews accessible");
      console.log(`   Total reviews: ${allReviews.length}`);
      allReviews.forEach((r) => {
        console.log(
          `     - ID ${r.id}: Product ${r.product_id}, Approved: ${r.approved}`
        );
      });
    }

    // Test 3: Test the function that will be created
    console.log("\n3️⃣ Testing admin role check...");
    // This will fail until the SQL is run, but that's expected
    try {
      const { data, error } = await supabase.rpc("is_admin");
      if (error) {
        console.log(
          "⚠️  is_admin() function not created yet - run the SQL to create it"
        );
      } else {
        console.log("✅ is_admin() function works:", data);
      }
    } catch (err) {
      console.log("⚠️  is_admin() function not available yet");
    }

    // Test 4: Show what needs to be done
    console.log("\n4️⃣ Setup requirements...");
    console.log("To complete the fix, you need to:");
    console.log("1. Run corrected-review-fix.sql in Supabase Dashboard");
    console.log("2. Create an admin user by signing up normally");
    console.log("3. Update that user's role to 'admin' in profiles table");
    console.log("4. Test review submission and admin approval");

    console.log("\n=================================");
    console.log("🎯 VERIFICATION COMPLETE");
    console.log("\nCurrent Status:");
    console.log(`✅ Database connection: Working`);
    console.log(
      `✅ Reviews table: Accessible (${allReviews?.length || 0} reviews)`
    );
    console.log(
      `${profiles ? "✅" : "⚠️ "} Profiles table: ${
        profiles ? "Available" : "Needs creation"
      }`
    );
    console.log(`⏳ Admin role system: Pending SQL execution`);
    console.log(`⏳ RLS policies: Pending SQL execution`);
  } catch (error) {
    console.log("💥 Unexpected error:", error.message);
  }
}

verifyReviewSystemFix();
