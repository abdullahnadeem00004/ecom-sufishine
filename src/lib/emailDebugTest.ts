import { Resend } from "resend";

// Simple direct test function - you can call this from browser console
window.testEmailDirect = async (email) => {
  console.log("🧪 Direct Email Test Starting...");

  // Check API key
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  console.log("API Key present:", !!apiKey);

  if (!apiKey) {
    console.error("❌ No API key found");
    return { success: false, error: "No API key" };
  }

  console.log("API Key (first 10 chars):", apiKey.substring(0, 10) + "...");

  try {
    const resend = new Resend(apiKey);
    console.log("✅ Resend instance created");

    console.log("📧 Sending test email to:", email);

    const result = await resend.emails.send({
      from: "SUFI SHINE <onboarding@resend.dev>",
      to: [email],
      subject: "🧪 Direct Test Email - SUFI SHINE",
      html: `
        <div style="padding: 20px; font-family: Arial;">
          <h2>🧪 Email Test Successful!</h2>
          <p>This is a direct test email from SUFI SHINE.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p>If you see this email, the service is working correctly!</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    return { success: false, error: error.message };
  }
};

console.log(
  "🧪 Email test function loaded. Usage: testEmailDirect('your-email@example.com')"
);

export {}; // Make this a module
