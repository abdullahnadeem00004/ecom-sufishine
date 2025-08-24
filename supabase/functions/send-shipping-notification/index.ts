import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Shipping notification email template
function generateShippingNotificationHTML(orderData: any): string {
  const {
    orderNumber,
    customerName,
    items = [],
    total,
    paymentMethod,
    shippingAddress,
    trackingId,
  } = orderData;

  const itemsHtml = items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${item.image_url || "/hair-oil-bottle.jpg"}" alt="${
        item.name
      }" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;" />
          <div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #1f2937;">${
              item.name
            }</h4>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Quantity: ${
              item.quantity
            }</p>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #1f2937;">
        Rs. ${item.price * item.quantity}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Order Has Been Shipped - SUFI SHINE</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">📦 Your Order Has Been Shipped!</h1>
          <p style="color: #dbeafe; margin: 8px 0 0 0; font-size: 16px;">Great news ${customerName}, your order is on its way!</p>
        </div>

        <!-- Shipping Alert -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 600;">🚚 Order Dispatched Successfully</h2>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Your package is now with our shipping partner and on its way to you!</p>
        </div>

        <!-- Order Details -->
        <div style="padding: 30px;">
          <div style="background: #f0f9f7; padding: 20px; border-radius: 12px; border-left: 4px solid #059669; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px 0; color: #047857; font-size: 20px; font-weight: 600;">📋 Order Summary</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
              <div><strong>Order Number:</strong> #${orderNumber}</div>
              <div><strong>Shipped Date:</strong> ${new Date().toLocaleDateString()}</div>
              <div><strong>Payment Method:</strong> ${paymentMethod}</div>
              <div><strong>Total Amount:</strong> <span style="color: #059669; font-weight: 700;">Rs. ${total}</span></div>
            </div>
          </div>

          <!-- Tracking Information - Main Feature -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; color: white;">
            <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700;">📍 Track Your Package</h3>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">Your Tracking Number:</p>
              <p style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">${trackingId}</p>
            </div>
            <div style="margin: 20px 0;">
              <a href="https://www.tcsexpress.com/track/" 
                 target="_blank" 
                 style="display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: all 0.3s;">
                🔍 Track Your Order Now
              </a>
            </div>
            <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">Click the button above or visit: https://www.tcsexpress.com/track/</p>
          </div>

          <!-- Shipping Timeline -->
          <div style="background: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px; font-weight: 600;">📅 Expected Delivery Timeline</h3>
            <div style="border-left: 3px solid #f59e0b; padding-left: 15px; margin-left: 10px;">
              <div style="margin-bottom: 10px;">
                <strong style="color: #059669;">✅ Order Confirmed</strong> - Completed
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="color: #059669;">✅ Order Processed</strong> - Completed
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="color: #3b82f6;">🚚 In Transit</strong> - Current Status
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="color: #6b7280;">📦 Out for Delivery</strong> - Next Step
              </div>
              <div>
                <strong style="color: #6b7280;">🎉 Delivered</strong> - Expected in 1-3 business days
              </div>
            </div>
          </div>

          <!-- Your Items -->
          <h3 style="color: #1f2937; font-size: 18px; margin: 25px 0 15px 0; font-weight: 600;">📦 Items Being Shipped</h3>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            ${itemsHtml}
            <tr>
              <td style="padding: 20px; font-weight: 700; font-size: 16px; color: #1f2937; border-top: 2px solid #3b82f6;">
                Total Order Value
              </td>
              <td style="padding: 20px; font-weight: 700; font-size: 18px; color: #3b82f6; text-align: right; border-top: 2px solid #3b82f6;">
                Rs. ${total}
              </td>
            </tr>
          </table>

          <!-- Delivery Address -->
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">🏠 Delivery Address</h3>
            <p style="margin: 5px 0; color: #4b5563; line-height: 1.5;">
              ${shippingAddress?.address}<br/>
              ${shippingAddress?.city}, ${shippingAddress?.postalCode}<br/>
              ${shippingAddress?.country}
            </p>
          </div>

          <!-- Important Notes -->
          <div style="background: #fef2f2; border: 1px solid #f87171; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #dc2626; font-size: 16px; font-weight: 600;">📢 Important Delivery Information</h3>
            <ul style="margin: 10px 0; color: #dc2626; padding-left: 20px; font-size: 14px;">
              <li>Please ensure someone is available to receive the package</li>
              <li>Keep your phone number accessible for delivery updates</li>
              <li>Have a valid ID ready for verification if required</li>
              <li>Track your package regularly using the tracking number above</li>
              <li>Contact us immediately if you notice any delivery issues</li>
            </ul>
          </div>

          <!-- Track Order Steps -->
          <div style="background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px; font-weight: 600;">🔍 How to Track Your Order</h3>
            <ol style="margin: 10px 0; color: #1e40af; padding-left: 20px; font-size: 14px;">
              <li>Click the "Track Your Order Now" button above</li>
              <li>Enter your tracking number: <strong>${trackingId}</strong></li>
              <li>View real-time status updates of your package</li>
              <li>Get estimated delivery time and location updates</li>
              <li>Receive notifications about delivery attempts</li>
            </ol>
            <p style="margin: 15px 0 0 0; color: #1e40af; font-size: 12px;">
              You can also check your order status in the <strong>"My Orders"</strong> section of our website anytime.
            </p>
          </div>

          <!-- Contact Information -->
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Need Help with Your Delivery?</h3>
            <p style="margin: 8px 0; color: #6b7280;">
              📧 Email: <a href="mailto:info.sufishine@gmail.com" style="color: #059669; text-decoration: none;">info.sufishine@gmail.com</a>
            </p>
            <p style="margin: 8px 0; color: #6b7280;">
              📱 WhatsApp: <a href="https://wa.me/923XXXXXXXXX" style="color: #059669; text-decoration: none;">+92 3XX-XXXXXXX</a>
            </p>
            <p style="margin: 8px 0; color: #6b7280;">
              🌐 Website: <a href="https://sufishine.com" style="color: #059669; text-decoration: none;">www.sufishine.com</a>
            </p>
            <p style="margin: 12px 0; color: #6b7280; font-size: 14px;">
              For delivery-related queries, please mention your tracking number: <strong>${trackingId}</strong>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #1f2937; padding: 25px; text-align: center;">
          <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">Thank you for choosing SUFI SHINE!</p>
          <p style="color: #6b7280; margin: 0; font-size: 12px;">
            © 2025 SUFI SHINE. All rights reserved. | 
            <a href="https://sufishine.com/privacy" style="color: #059669; text-decoration: none;">Privacy Policy</a> | 
            <a href="https://sufishine.com/terms" style="color: #059669; text-decoration: none;">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  console.log("Shipping notification function called with method:", req.method);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variable
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log("API Key present:", !!apiKey);

    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY not configured in Supabase environment variables"
      );
    }

    // Validate API key format
    if (!apiKey.startsWith("re_")) {
      throw new Error(
        'Invalid RESEND_API_KEY format - should start with "re_"'
      );
    }

    // Parse request body
    const body = await req.json();
    console.log("Shipping notification request body:", body);

    const { customerEmail, orderData } = body;

    // Validate required data
    if (!customerEmail || !orderData) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: customerEmail and orderData",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate tracking ID is provided
    if (!orderData.trackingId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Tracking ID is required for shipping notification",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Sending shipping notification to:", customerEmail);
    console.log("Order number:", orderData.orderNumber);
    console.log("Tracking ID:", orderData.trackingId);

    // Generate email HTML
    const emailHtml = generateShippingNotificationHTML(orderData);

    // Prepare email payload
    const emailPayload = {
      from: "SUFI SHINE <orders@sufishine.com>",
      to: [customerEmail],
      subject: `📦 Your Order #${orderData.orderNumber} Has Been Shipped! - SUFI SHINE`,
      html: emailHtml,
    };

    console.log("Shipping email payload prepared for:", customerEmail);

    // Send email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    console.log("Resend API response status:", response.status);

    const result = await response.json();
    console.log("Resend API response:", result);

    if (!response.ok) {
      console.error("Resend API failed:", {
        status: response.status,
        result: result,
      });
      throw new Error(
        `Resend API error (${response.status}): ${
          result.message || result.error || "Unknown error"
        }`
      );
    }

    console.log("Shipping notification email sent successfully:", result);

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        message: "Shipping notification email sent successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending shipping notification email:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send shipping notification",
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
