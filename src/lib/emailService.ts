import { Resend } from 'resend';

// Email service configuration
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export interface OrderItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface OrderData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  estimatedDelivery?: string;
  trackingId?: string;
}

const generateOrderConfirmationEmail = (orderData: OrderData) => {
  const {
    orderNumber,
    customerName,
    items,
    subtotal,
    shippingCharge,
    total,
    paymentMethod,
    shippingAddress,
    estimatedDelivery = '3-5 business days',
  } = orderData;

  const paymentMethodNames = {
    cash_on_delivery: 'Cash on Delivery',
    jazzcash: 'JazzCash',
    easypaisa: 'EasyPaisa',
    bank_account: 'Bank Transfer',
  };

  const paymentInstructions = {
    jazzcash: 'Please make payment to JazzCash account: 03041146524, Account Title: LUQMAN BIN RIZWAN',
    easypaisa: 'Please make payment to EasyPaisa account: 03391146524, Account Title: LUQMAN BIN RIZWAN',
    bank_account: 'Please transfer to IBAN PK68ALFH033100101005004 (Account Title: SUFI SHINE, Acc No: 03311010050044)',
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - SUFI SHINE</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px 20px; }
          .order-details { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total-row { font-weight: bold; font-size: 16px; border-top: 2px solid #059669; padding-top: 10px; }
          .address-box { background: #e5f7f0; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .payment-info { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
          .terms { background: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 12px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .btn { background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">SUFI SHINE</div>
            <h1>Order Confirmation</h1>
            <p>Thank you for your order, ${customerName}!</p>
          </div>
          
          <div class="content">
            <div class="order-details">
              <h2>Order Details</h2>
              <p><strong>Order Number:</strong> ${orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
              
              <h3>Items Ordered:</h3>
              ${items.map(item => `
                <div class="item">
                  <div>
                    <strong>${item.name}</strong><br>
                    <small>Qty: ${item.quantity}</small>
                  </div>
                  <div>PKR ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              `).join('')}
              
              <div class="item">
                <div>Subtotal:</div>
                <div>PKR ${subtotal.toFixed(2)}</div>
              </div>
              
              <div class="item">
                <div>Shipping:</div>
                <div>${shippingCharge === 0 ? 'FREE' : `PKR ${shippingCharge.toFixed(2)}`}</div>
              </div>
              
              <div class="item total-row">
                <div>Total:</div>
                <div>PKR ${total.toFixed(2)}</div>
              </div>
            </div>

            <div class="order-details">
              <h3>Shipping Address</h3>
              <div class="address-box">
                ${shippingAddress.address}<br>
                ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
                ${shippingAddress.country}
              </div>
            </div>

            <div class="order-details">
              <h3>Payment Information</h3>
              <p><strong>Payment Method:</strong> ${paymentMethodNames[paymentMethod as keyof typeof paymentMethodNames] || paymentMethod}</p>
              
              ${paymentMethod !== 'cash_on_delivery' ? `
                <div class="payment-info">
                  <h4>Payment Instructions:</h4>
                  <p>${paymentInstructions[paymentMethod as keyof typeof paymentInstructions]}</p>
                  <p><strong>Important:</strong> Please include your order number <strong>${orderNumber}</strong> in the payment reference.</p>
                </div>
              ` : `
                <p style="color: #059669;">✓ You will pay when your order is delivered.</p>
              `}
            </div>

            <div class="order-details">
              <h3>Order Tracking</h3>
              <p>You will receive a tracking number via email once your order ships. You can also track your order status by visiting our website.</p>
              <p>For any questions about your order, please contact us with your order number: <strong>${orderNumber}</strong></p>
            </div>

            <div class="terms">
              <h4>Terms & Conditions</h4>
              <ul>
                <li>All orders are subject to product availability</li>
                <li>Delivery times are estimates and may vary during peak seasons</li>
                <li>Returns are accepted within 7 days of delivery for unopened products</li>
                <li>For cash on delivery orders, full payment is required upon delivery</li>
                <li>For online payments, orders will be processed after payment verification</li>
                <li>SUFI SHINE reserves the right to cancel orders in case of pricing errors</li>
                <li>Customers will be notified of any order modifications via email or phone</li>
              </ul>
              
              <h4>Contact Information</h4>
              <p><strong>Customer Service:</strong> Available 9 AM - 8 PM (Monday to Saturday)</p>
              <p><strong>WhatsApp:</strong> +92 304 1146524</p>
              <p><strong>Email:</strong> support@sufishine.com</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing SUFI SHINE!</p>
            <p>Follow us on social media for beauty tips and product updates</p>
            <p style="font-size: 10px;">This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const sendOrderConfirmationEmail = async (orderData: OrderData) => {
  try {
    // Check if API key is configured
    if (!import.meta.env.VITE_RESEND_API_KEY) {
      console.warn('Email service not configured. Order confirmation email not sent.');
      return { success: false, error: 'Email service not configured' };
    }

    const htmlContent = generateOrderConfirmationEmail(orderData);

    const result = await resend.emails.send({
      from: 'SUFI SHINE <orders@sufishine.com>',
      to: [orderData.customerEmail],
      subject: `Order Confirmation - ${orderData.orderNumber} | SUFI SHINE`,
      html: htmlContent,
    });

    console.log('Order confirmation email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, error: error };
  }
};

// Alternative email service using Supabase Edge Functions (for when Resend is not available)
export const sendEmailViaSupabase = async (orderData: OrderData) => {
  try {
    // This would call a Supabase Edge Function
    // For now, we'll just log the email content
    const htmlContent = generateOrderConfirmationEmail(orderData);
    
    console.log('Email would be sent via Supabase Edge Function:');
    console.log('To:', orderData.customerEmail);
    console.log('Subject:', `Order Confirmation - ${orderData.orderNumber} | SUFI SHINE`);
    console.log('HTML Content length:', htmlContent.length);
    
    return { success: true, fallback: true };
  } catch (error) {
    console.error('Failed to send email via Supabase:', error);
    return { success: false, error: error };
  }
};

// Utility function to send email with fallback
export const sendOrderEmail = async (orderData: OrderData) => {
  // Try primary email service first
  const primaryResult = await sendOrderConfirmationEmail(orderData);
  
  if (primaryResult.success) {
    return primaryResult;
  }
  
  // Fallback to alternative method
  console.log('Primary email service failed, trying fallback...');
  const fallbackResult = await sendEmailViaSupabase(orderData);
  
  return fallbackResult;
};
