// Simple test script to debug email service
// Run this in the browser console to test email functionality

console.log("🔍 SUFI SHINE Email Debug Test");
console.log("================================");

// Check environment variables
console.log("1. Environment Variables:");
console.log(
  "   VITE_RESEND_API_KEY:",
  import.meta.env.VITE_RESEND_API_KEY ? "✅ Present" : "❌ Missing"
);

if (import.meta.env.VITE_RESEND_API_KEY) {
  console.log(
    "   API Key starts with:",
    import.meta.env.VITE_RESEND_API_KEY.substring(0, 3)
  );
  console.log("   API Key length:", import.meta.env.VITE_RESEND_API_KEY.length);
} else {
  console.log("❌ No API key found. Check your .env file.");
}

// Test Resend import
console.log("\n2. Testing Resend Import:");
try {
  const { Resend } = await import("resend");
  console.log("✅ Resend imported successfully");

  if (import.meta.env.VITE_RESEND_API_KEY) {
    const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);
    console.log("✅ Resend instance created");

    // Test basic API call
    console.log("\n3. Testing API Connection:");
    try {
      const result = await resend.emails.send({
        from: "SUFI SHINE <onboarding@resend.dev>",
        to: ["test@example.com"], // This won't actually send due to invalid email
        subject: "Test Email",
        html: "<p>Test</p>",
      });
      console.log("📧 API call result:", result);
    } catch (apiError) {
      console.log("📧 API Error:", apiError);
      if (apiError.message) {
        console.log("   Error Message:", apiError.message);
      }
    }
  }
} catch (importError) {
  console.log("❌ Failed to import Resend:", importError);
}

console.log("\n4. Instructions:");
console.log(
  "   - If API key is missing, add VITE_RESEND_API_KEY to your .env file"
);
console.log(
  "   - If API error occurs, check if your API key is valid at resend.com"
);
console.log("   - Restart your dev server after adding environment variables");
