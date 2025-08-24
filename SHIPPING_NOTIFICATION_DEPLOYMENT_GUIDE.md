# Shipping Notification Email System - Deployment Guide

## Overview

This guide will help you deploy the automated shipping notification system that sends emails to customers when their orders are marked as shipped with tracking information.

## Files Created/Modified

1. **supabase/functions/send-shipping-notification/index.ts** - NEW Edge Function
2. **src/lib/emailService.ts** - Added sendShippingNotificationEmail function
3. **src/components/admin/OrdersManagement.tsx** - Integrated email sending

## Deployment Steps

### Step 1: Deploy the Edge Function

Run this command in your terminal from the project root:

```bash
supabase functions deploy send-shipping-notification
```

### Step 2: Set Environment Variables

Ensure your Supabase project has the RESEND_API_KEY environment variable set:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

### Step 3: Test the Integration

1. Go to your admin panel
2. Find an order that needs shipping
3. Add a tracking ID and mark it as shipped
4. The customer should automatically receive a shipping notification email

## Email Template Features

### Professional Design

- Clean, responsive HTML layout
- SUFI SHINE branding with colors
- Mobile-friendly design
- Professional typography

### Content Includes

- Order confirmation with tracking ID
- Complete order summary with items
- TCS Express tracking link: https://www.tcsexpress.com/track/
- Estimated delivery timeline (3-5 business days)
- Customer service contact information
- Professional footer with company details

### Tracking Integration

- Direct link to TCS Express tracking: `https://www.tcsexpress.com/track/?consignmentNo={trackingId}`
- Clear tracking instructions for customers
- Tracking ID prominently displayed

## Technical Details

### Edge Function Capabilities

- **Runtime**: Deno with TypeScript
- **Email Service**: Resend API with verified domain
- **Error Handling**: Comprehensive error catching and logging
- **Response**: JSON status with detailed error messages
- **CORS**: Properly configured for web requests

### Admin Integration

- **Trigger**: Automatic when tracking ID is added and order marked as shipped
- **Data Transform**: Converts Order format to EmailOrderData format
- **Error Handling**: Email failures don't break tracking ID updates
- **User Feedback**: Success toast includes email confirmation

### Email Service Function

- **Function**: `sendShippingNotificationEmail(email, orderData)`
- **Error Handling**: Comprehensive try-catch with detailed logging
- **Data Validation**: Validates email and order data before sending
- **Debugging**: Extensive console logging for troubleshooting

## Testing the System

### Manual Testing

1. Create a test order in the system
2. Go to admin panel → Orders Management
3. Find the test order
4. Add a tracking ID (use a test TCS tracking number)
5. Click "Add Tracking ID" button
6. Check customer email for shipping notification

### Email Verification Checklist

- [ ] Email received in customer inbox
- [ ] Order details are correct
- [ ] Tracking ID is displayed
- [ ] TCS tracking link works
- [ ] Email formatting looks professional
- [ ] Mobile responsive design works

## Troubleshooting

### Common Issues

#### Email Not Sending

1. Check Supabase Edge Function logs:
   ```bash
   supabase functions logs send-shipping-notification
   ```
2. Verify RESEND_API_KEY is set correctly
3. Check email domain verification in Resend dashboard

#### Wrong Email Content

1. Check order data transformation in OrdersManagement.tsx
2. Verify shipping address parsing (string vs object)
3. Check tracking ID is correctly passed

#### TCS Tracking Link Issues

1. Verify tracking ID format is correct
2. Test TCS link manually: `https://www.tcsexpress.com/track/?consignmentNo=YOUR_TRACKING_ID`

### Debug Commands

```bash
# Check Edge Function deployment
supabase functions list

# View function logs
supabase functions logs send-shipping-notification --follow

# Test Edge Function directly
curl -X POST "https://your-project-ref.supabase.co/functions/v1/send-shipping-notification" \
  -H "Authorization: Bearer your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "orderData": {
      "orderNumber": "TEST-123",
      "customerName": "Test Customer",
      "customerEmail": "test@example.com",
      "customerPhone": "+92-XXX-XXXXXXX",
      "items": [{"name": "Test Product", "price": 100, "quantity": 1}],
      "total": 100,
      "paymentMethod": "COD",
      "shippingAddress": {
        "address": "Test Address",
        "city": "Karachi",
        "postalCode": "12345",
        "country": "Pakistan"
      },
      "trackingId": "TEST123456789"
    }
  }'
```

## Email Template Customization

### Colors

- Primary: #8B5A3C (Brown)
- Secondary: #D4AF37 (Gold)
- Text: #333333 (Dark Gray)
- Background: #FFFFFF (White)

### Branding Elements

- SUFI SHINE logo and name
- Professional footer with contact details
- Consistent color scheme throughout
- Clean typography with proper hierarchy

## Success Indicators

- ✅ Edge Function deploys without errors
- ✅ Admin can add tracking IDs successfully
- ✅ Customers receive shipping notification emails
- ✅ TCS tracking links work correctly
- ✅ Email formatting is professional and mobile-friendly
- ✅ System logs show successful email delivery

## Next Steps

After successful deployment:

1. Monitor email delivery rates
2. Collect customer feedback on email content
3. Consider adding SMS notifications for critical updates
4. Implement email analytics tracking
5. Add more shipping providers if needed

## Support

If you encounter issues:

1. Check Supabase Edge Function logs
2. Verify Resend API key and domain settings
3. Test with a small sample order first
4. Review email content for any formatting issues
