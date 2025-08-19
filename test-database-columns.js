const { createClient } = require("@supabase/supabase-js");

// Use the environment variables or hardcoded values for testing
const supabaseUrl = "https://ovwlgaapjnulekrgxrlb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92d2xnYWFwam51bGVrcmd4cmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1ODEzNzgsImV4cCI6MjAzOTE1NzM3OH0._rTh7hnD55cZSBOdPPZSdGnwPdFJNqCBexm5bAi-K7s";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseColumns() {
  try {
    console.log("Checking database structure...");

    // Try to fetch one order to see what columns exist
    const { data, error } = await supabase
      .from("guest_orders")
      .select("*")
      .limit(1);

    if (error) {
      console.log("❌ Error fetching orders:", error.message);
      console.log(
        "This might indicate database connectivity issues or missing table."
      );
      return;
    }

    if (data && data.length > 0) {
      const order = data[0];
      console.log("\n✅ Database connection successful");
      console.log("\n📋 Available columns in guest_orders table:");
      Object.keys(order).forEach((key) => {
        console.log(`  - ${key}`);
      });

      console.log("\n🔍 Checking for tracking-related columns:");
      const trackingFields = [
        "tracking_id",
        "tracking_status",
        "shipped_at",
        "delivery_notes",
      ];
      trackingFields.forEach((field) => {
        const exists = order[field] !== undefined;
        console.log(
          `  ${exists ? "✅" : "❌"} ${field}: ${exists ? "EXISTS" : "MISSING"}`
        );
      });

      if (
        !order.tracking_id &&
        !order.tracking_status &&
        !order.shipped_at &&
        !order.delivery_notes
      ) {
        console.log("\n⚠️  IMPORTANT: Tracking columns are missing!");
        console.log(
          "   You need to run the SQL commands from database-updates-tracking.sql"
        );
        console.log(
          "   in your Supabase SQL Editor to add the required columns."
        );
      } else {
        console.log(
          "\n✅ Tracking columns are present - functionality should work!"
        );
      }
    } else {
      console.log("📝 No orders found in database (empty table)");
      console.log("   This is normal for new installations.");
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
  }
}

checkDatabaseColumns();
