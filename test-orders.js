import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testOrdersDisplay() {
  try {
    console.log("Testing orders retrieval...");

    // Fetch orders from guest_orders table
    const { data, error } = await supabase
      .from("guest_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      console.log("Orders found:", data.length);
      if (data.length > 0) {
        console.log("First order structure:", data[0]);

        // Check if the order has all required fields
        const firstOrder = data[0];
        console.log("\nOrder field check:");
        console.log("- customer_name:", firstOrder.customer_name);
        console.log("- customer_email:", firstOrder.customer_email);
        console.log("- customer_phone:", firstOrder.customer_phone);
        console.log("- shipping_address:", firstOrder.shipping_address);
        console.log("- total_amount:", firstOrder.total_amount);
        console.log("- subtotal:", firstOrder.subtotal);
        console.log("- shipping_charge:", firstOrder.shipping_charge);
        console.log(
          "- items:",
          Array.isArray(firstOrder.items)
            ? `${firstOrder.items.length} items`
            : "Not array"
        );
      } else {
        console.log("No orders found in database.");
      }
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testOrdersDisplay();
