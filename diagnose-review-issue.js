// Test with manual user creation and RLS policy check
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseReviewIssue() {
  console.log("🔍 DIAGNOSING REVIEW SUBMISSION ISSUE");
  console.log("====================================\n");

  // Test 1: Check if we can read the reviews table structure
  console.log("1️⃣ Testing reviews table access...");
  try {
    const { data, error, count } = await supabase
      .from("reviews")
      .select("*", { count: "exact" })
      .limit(1);

    if (error) {
      console.log("❌ Cannot access reviews table:", error.message);
    } else {
      console.log("✅ Reviews table accessible");
      console.log("   Total reviews in database:", count);
      if (data && data.length > 0) {
        console.log("   Sample review columns:", Object.keys(data[0]));
      }
    }
  } catch (err) {
    console.log("💥 Error accessing reviews:", err.message);
  }

  // Test 2: Check products table
  console.log("\n2️⃣ Testing products table...");
  try {
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name")
      .order("id");

    if (productsError) {
      console.log("❌ Cannot access products:", productsError.message);
    } else {
      console.log("✅ Products table accessible");
      console.log("   Available products:");
      products?.forEach((p) => console.log(`   - ID ${p.id}: ${p.name}`));
    }
  } catch (err) {
    console.log("💥 Error accessing products:", err.message);
  }

  // Test 3: Try different authentication approaches
  console.log("\n3️⃣ Testing authentication methods...");

  // Option A: Anonymous access (should fail for insert)
  console.log("\n   A) Testing anonymous access...");
  const {
    data: { session: anonSession },
  } = await supabase.auth.getSession();
  console.log("   Anonymous session:", anonSession ? "Active" : "None");

  // Try anonymous insert (should fail)
  const { error: anonInsertError } = await supabase.from("reviews").insert({
    product_id: 2,
    rating: 5,
    comment: "Anonymous test review",
    user_id: "00000000-0000-0000-0000-000000000000",
  });

  if (anonInsertError) {
    console.log("   ✅ Anonymous insert blocked:", anonInsertError.message);
    console.log("   Error code:", anonInsertError.code);
  } else {
    console.log("   ⚠️ Anonymous insert succeeded (unexpected)");
  }

  // Test 4: Check RLS policies (indirectly)
  console.log("\n4️⃣ Analyzing RLS behavior...");

  // Test with various user IDs to understand the pattern
  const testUserIds = [
    "00000000-0000-0000-0000-000000000000",
    "test-user-id",
    null,
    undefined,
  ];

  for (const userId of testUserIds) {
    const testData = {
      product_id: 2,
      rating: 5,
      comment: "RLS test review",
    };

    if (userId !== null && userId !== undefined) {
      testData.user_id = userId;
    }

    const { error } = await supabase.from("reviews").insert(testData);

    console.log(
      `   User ID "${userId}": ${
        error ? error.message + " (" + error.code + ")" : "Success"
      }`
    );
  }

  // Test 5: Check what happens with a valid user session
  console.log("\n5️⃣ Creating test session...");

  // Try to sign up with email confirmation disabled
  const testUser = {
    email: "testuser@example.com",
    password: "testpassword123",
  };

  const { data: signUpResult, error: signUpError } = await supabase.auth.signUp(
    {
      email: testUser.email,
      password: testUser.password,
      options: {
        emailRedirectTo: "http://localhost:8085/",
        data: {
          confirm: true, // This might help skip email confirmation in dev
        },
      },
    }
  );

  if (signUpError) {
    console.log("   Sign up error:", signUpError.message);
  } else {
    console.log(
      "   Sign up result:",
      signUpResult.user ? "User created" : "Already exists"
    );
  }

  console.log("\n====================================");
  console.log("🎯 DIAGNOSIS COMPLETE");
  console.log("\nLikely issues:");
  console.log("1. Email confirmation required for authentication");
  console.log("2. RLS policies may need to be created/updated");
  console.log("3. Need proper authenticated session for review submission");
  console.log("\nNext steps:");
  console.log(
    "1. Create RLS policies that allow authenticated users to insert reviews"
  );
  console.log("2. Set up test user with confirmed email");
  console.log("3. Test with proper authentication flow");
}

diagnoseReviewIssue();
