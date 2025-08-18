import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: "admin@sufishine.com",
    password: "StrongPassword123!", // <-- make sure this matches login
    email_confirm: true,
    user_metadata: { role: "admin" }, // optional metadata
  });

  if (error) {
    console.error("❌ Error creating admin:", error.message);
    return;
  }

  console.log("✅ Admin created:", data.user.id);

  // Update profile role if you have a `profiles` table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", data.user.id);

  if (profileError) {
    console.error("❌ Error updating profile:", profileError.message);
  } else {
    console.log("✅ Profile role updated to admin!");
  }
}

createAdmin();
