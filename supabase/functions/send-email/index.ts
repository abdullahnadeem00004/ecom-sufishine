import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Email template generator function
function generateOrderConfirmationHTML(orderData: any): string {
  const {
    orderNumber,
    customerName,
    items = [],
    total,
    paymentMethod,
    shippingAddress,
    trackingNumber,
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
      <title>Order Confirmation - SUFI SHINE</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Order Confirmed!</h1>
          <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 16px;">Thank you for your order, ${customerName}</p>
        </div>

        <!-- Order Summary -->
        <div style="padding: 30px;">
          <div style="background: #f0f9f7; padding: 20px; border-radius: 12px; border-left: 4px solid #059669; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px 0; color: #047857; font-size: 20px; font-weight: 600;">📦 Order Details</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
              <div><strong>Order Number:</strong> #${orderNumber}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
              <div><strong>Payment Method:</strong> ${paymentMethod}</div>
              <div><strong>Total Amount:</strong> <span style="color: #059669; font-weight: 700;">Rs. ${total}</span></div>
            </div>
          </div>

          <!-- Products -->
          <h3 style="color: #1f2937; font-size: 18px; margin: 25px 0 15px 0; font-weight: 600;">🛍️ Your Items</h3>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            ${itemsHtml}
            <tr>
              <td style="padding: 20px; font-weight: 700; font-size: 16px; color: #1f2937; border-top: 2px solid #059669;">
                Total Amount
              </td>
              <td style="padding: 20px; font-weight: 700; font-size: 18px; color: #059669; text-align: right; border-top: 2px solid #059669;">
                Rs. ${total}
              </td>
            </tr>
          </table>

          <!-- Shipping Address -->
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">🚚 Shipping Address</h3>
            <p style="margin: 5px 0; color: #4b5563; line-height: 1.5;">
              ${shippingAddress?.address}<br/>
              ${shippingAddress?.city}, ${shippingAddress?.postalCode}<br/>
              ${shippingAddress?.country}
            </p>
          </div>

          <!-- Payment Instructions for COD -->
          ${
            paymentMethod === "COD"
              ? `
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">💰 Cash on Delivery Instructions</h3>
            <ul style="margin: 10px 0; color: #92400e; padding-left: 20px;">
              <li>Please keep exact amount ready: <strong>Rs. ${total}</strong></li>
              <li>Our delivery person will collect payment upon delivery</li>
              <li>You can pay in cash only (no cards accepted at door)</li>
              <li>Please verify your order before making payment</li>
            </ul>
          </div>
          `
              : ""
          }

          <!-- JazzCash Instructions -->
          ${
            paymentMethod === "JazzCash"
              ? `
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">📱 JazzCash Payment Instructions</h3>
            <p style="margin: 10px 0; color: #92400e;">Please send <strong>Rs. ${total}</strong> to:</p>
            <div style="background: white; padding: 15px; border-radius: 6px; margin: 10px 0; text-align: center;">
              <p style="margin: 0; font-size: 18px; font-weight: 700; color: #059669;">03XX-XXXXXXX</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">JazzCash Account</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">[Update with your actual JazzCash number]</p>
            </div>
            <ul style="margin: 10px 0; color: #92400e; padding-left: 20px; font-size: 14px;">
              <li>Send payment within 24 hours to confirm your order</li>
              <li>Include your order number <strong>#${orderNumber}</strong> in the message</li>
              <li>Send screenshot of payment to our WhatsApp</li>
              <li>Your order will be processed after payment verification</li>
            </ul>
          </div>
          `
              : ""
          }

          <!-- Tracking Information -->
          <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px; font-weight: 600;">📍 Order Tracking</h3>
            <p style="margin: 10px 0; color: #1e40af;">As soon as your order is dispatched, you will receive your tracking ID via email and SMS.</p>
            <p style="margin: 10px 0; color: #1e40af;">Please continuously check your <strong>"My Orders"</strong> section on our website for continuous updates about your order status.</p>
            <p style="margin: 10px 0; color: #1e40af;">You can also contact us anytime for order updates and assistance.</p>
          </div>

          <!-- Contact Information -->
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px;">Need Help?</h3>
            <p style="margin: 8px 0; color: #6b7280;">
              📧 Email: <a href="mailto:info.sufishine@gmail.com" style="color: #059669; text-decoration: none;">info.sufishine@gmail.com</a>
            </p>
            <p style="margin: 8px 0; color: #6b7280;">
              📱 WhatsApp: <a href="https://wa.me/923XXXXXXXXX" style="color: #059669; text-decoration: none;">+92 3XX-XXXXXXX</a>
            </p>
            <p style="margin: 8px 0; color: #6b7280;">
              🌐 Website: <a href="https://sufishine.com" style="color: #059669; text-decoration: none;">www.sufishine.com</a>
            </p>
          </div>

          <!-- Terms and Conditions -->
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
            <h4 style="margin: 0 0 15px 0; color: #1f2937; font-size: 14px; font-weight: 600;">📋 Terms & Conditions</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #6b7280; line-height: 1.6;">
              <li>All orders are subject to product availability</li>
              <li>Delivery typically takes 2-5 business days</li>
              <li>Returns accepted within 7 days of delivery</li>
              <li>Products must be unused and in original packaging</li>
              <li>COD orders cannot be cancelled after dispatch</li>
              <li>For JazzCash payments, orders are confirmed after payment verification</li>
              <li>SUFI SHINE reserves the right to modify terms without prior notice</li>
            </ul>
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
  console.log("Function called with method:", req.method);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variable
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log("API Key present:", !!apiKey);
    console.log("API Key length:", apiKey?.length || 0);

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
    console.log("Request body:", body);

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

    console.log("Sending email to:", customerEmail);
    console.log("Order number:", orderData.orderNumber);

    // Generate email HTML
    const emailHtml = generateOrderConfirmationHTML(orderData);

    // Prepare email payload
    const emailPayload = {
      from: "SUFI SHINE <orders@sufishine.com>", // Use your verified domain
      to: [customerEmail], // Send to actual customer
      subject: `Order Confirmation #${orderData.orderNumber} - SUFI SHINE`,
      html: emailHtml,
    };

    console.log("Email payload:", JSON.stringify(emailPayload, null, 2));
    console.log("API Key length:", apiKey.length);
    console.log("API Key starts with:", apiKey.substring(0, 8) + "...");

    // Send email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.json();
    console.log("Full Resend response:", JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.error("Resend API failed:", {
        status: response.status,
        statusText: response.statusText,
        result: result,
      });
      throw new Error(
        `Resend API error (${response.status}): ${
          result.message || result.error || "Unknown error"
        }`
      );
    }

    console.log("Email sent successfully:", result);

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        message: "Order confirmation email sent successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send email",
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
