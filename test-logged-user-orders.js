import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserOrdersInGuestTable() {
  try {
    console.log("Testing user orders in guest_orders table...");

    // Check all orders in guest_orders table
    const { data: allOrders, error: allError } = await supabase
      .from("guest_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (allError) {
      console.error("Error fetching all orders:", allError);
    } else {
      console.log("Total orders in guest_orders table:", allOrders.length);

      // Check orders with user_id (logged-in user orders)
      const ordersWithUserId = allOrders.filter(
        (order) => order.user_id !== null
      );
      console.log(
        "Orders with user_id (from logged-in users):",
        ordersWithUserId.length
      );

      if (ordersWithUserId.length > 0) {
        console.log("Sample logged-in user order:", ordersWithUserId[0]);
        console.log("User IDs found:", [
          ...new Set(ordersWithUserId.map((order) => order.user_id)),
        ]);
      }

      // Check orders without user_id (guest orders)
      const guestOrders = allOrders.filter((order) => order.user_id === null);
      console.log("Guest orders (user_id is null):", guestOrders.length);
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testUserOrdersInGuestTable();
