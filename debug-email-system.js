/**
 * Debug script to test the email system manually
 * Run this to test if the email service is working
 */

import { sendOrderConfirmationEmail } from "./src/lib/emailService.ts";

// Test order data
const testOrderData = {
  orderNumber: `TEST-${Date.now()}`,
  customerName: "Debug Test Customer",
  customerEmail: "test@example.com", // Change to your email for testing
  customerPhone: "+92 300 1234567",
  items: [
    {
      id: "1",
      name: "SUFI SHINE Hair Oil - Test",
      price: 1500,
      quantity: 1,
      image_url: "/src/assets/hair-oil-bottle.jpg",
    },
  ],
  subtotal: 1500,
  shippingCharge: 0,
  total: 1500,
  paymentMethod: "cash_on_delivery",
  shippingAddress: {
    address: "123 Test Street",
    city: "Karachi",
    postalCode: "75500",
    country: "Pakistan",
  },
  estimatedDelivery: "3-5 business days",
  trackingNumber: "TRK-TEST-123",
};

async function debugEmailSystem() {
  console.log("🔍 DEBUG: Testing Email System");
  console.log("=".repeat(50));

  try {
    console.log("📧 Attempting to send test email...");
    console.log("📧 Customer Email:", testOrderData.customerEmail);

    const result = await sendOrderConfirmationEmail(
      testOrderData.customerEmail,
      testOrderData
    );

    console.log("📧 Email Service Result:", result);

    if (result.success) {
      console.log("✅ SUCCESS: Email system is working!");
      if (result.fallback) {
        console.log("⚠️  Running in fallback mode (development)");
        console.log("💡 This is normal during development");
        console.log(
          "🔧 To send real emails, deploy Edge Function to production"
        );
      } else {
        console.log("🚀 Production email system working!");
        console.log("📨 Real email was sent successfully");
      }
    } else {
      console.log("❌ FAILED: Email system encountered an error");
      console.log("🚨 Error:", result.error);
      console.log("🔧 Check:");
      console.log("   - Supabase Edge Function deployment");
      console.log("   - RESEND_API_KEY environment variable");
      console.log("   - Network connectivity");
      console.log("   - Domain verification status");
    }
  } catch (error) {
    console.error("🚨 CRITICAL ERROR in email system:", error);
    console.log("🔧 This indicates a serious issue with:");
    console.log("   - Import/export paths");
    console.log("   - Function definitions");
    console.log("   - Module loading");
  }

  console.log("=".repeat(50));
}

// Run the debug test
debugEmailSystem();
