// Create proper RLS policies for reviews
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";
const supabase = createClient(supabaseUrl, supabaseKey);

async function createRLSPolicies() {
  console.log("🔐 CREATING RLS POLICIES FOR REVIEWS");
  console.log("===================================\n");

  const policies = [
    {
      name: "Enable insert for authenticated users",
      sql: `
                CREATE POLICY "authenticated_users_can_insert_reviews" ON reviews
                FOR INSERT TO authenticated
                WITH CHECK (auth.uid() = user_id);
            `,
    },
    {
      name: "Enable select for approved reviews (public)",
      sql: `
                CREATE POLICY "anyone_can_view_approved_reviews" ON reviews
                FOR SELECT USING (approved = true);
            `,
    },
    {
      name: "Enable select for users own reviews",
      sql: `
                CREATE POLICY "users_can_view_own_reviews" ON reviews
                FOR SELECT TO authenticated
                USING (auth.uid() = user_id);
            `,
    },
  ];

  for (const policy of policies) {
    console.log(`📝 Creating policy: ${policy.name}`);

    try {
      const { data, error } = await supabase.rpc("exec_sql", {
        sql: policy.sql,
      });

      if (error) {
        console.log(`❌ Failed: ${error.message}`);
      } else {
        console.log(`✅ Success: ${policy.name}`);
      }
    } catch (err) {
      console.log(`💥 Exception: ${err.message}`);
    }
  }

  console.log("\n===================================");
  console.log("🎯 RLS POLICY CREATION COMPLETED");
  console.log("\nNote: If exec_sql RPC is not available, you need to:");
  console.log("1. Go to Supabase Dashboard > SQL Editor");
  console.log("2. Run these SQL commands manually:");
  console.log("\n-- Enable RLS on reviews table");
  console.log("ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;");
  console.log("\n-- Allow authenticated users to insert their own reviews");
  console.log('CREATE POLICY "authenticated_users_insert" ON reviews');
  console.log("FOR INSERT TO authenticated");
  console.log("WITH CHECK (auth.uid() = user_id);");
  console.log("\n-- Allow anyone to view approved reviews");
  console.log('CREATE POLICY "public_approved_reviews" ON reviews');
  console.log("FOR SELECT USING (approved = true);");
  console.log("\n-- Allow users to view their own reviews");
  console.log('CREATE POLICY "users_own_reviews" ON reviews');
  console.log("FOR SELECT TO authenticated");
  console.log("USING (auth.uid() = user_id);");
}

createRLSPolicies();
