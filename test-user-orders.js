import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wkihufuubmqkvjjdejkq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraWh1ZnV1Ym1xa3ZqamRlamtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTE5NTYsImV4cCI6MjA3MDY4Nzk1Nn0.MIyb19CNBMhHAFB8PHMqvyq_mdQM9HGwVyytofP9g9o";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserOrders() {
  try {
    console.log("Testing user orders from orders table...");

    // Check orders table structure
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .limit(5);

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
    } else {
      console.log("Orders table data:", ordersData.length, "records found");
      if (ordersData.length > 0) {
        console.log("Sample order:", ordersData[0]);
      }
    }

    // Check if we can join with products
    const { data: joinData, error: joinError } = await supabase
      .from("orders")
      .select("*, product:products(*)")
      .limit(3);

    if (joinError) {
      console.error("Error with join query:", joinError);
    } else {
      console.log(
        "Join query successful, sample data:",
        joinData.length > 0 ? joinData[0] : "No data"
      );
    }

    // Check profiles table
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .limit(3);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    } else {
      console.log("Profiles found:", profilesData.length);
      if (profilesData.length > 0) {
        console.log("Sample profile:", profilesData[0]);
      }
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testUserOrders();
