# 🔧 Edge Function Debug Steps

## Step 1: Deploy Simple Test Function First

Replace your current Edge Function code with this simplified version to test:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  console.log("Function called with method:", req.method);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Test environment variable
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log("API Key present:", !!apiKey);
    console.log("API Key length:", apiKey?.length || 0);

    // Test JSON parsing
    const body = await req.json();
    console.log("Request body:", body);

    const { customerEmail, orderData } = body;
    console.log("Customer email:", customerEmail);
    console.log("Order data:", orderData);

    // Return success for now (without calling Resend)
    return new Response(
      JSON.stringify({
        success: true,
        message: "Test function works!",
        debug: {
          hasApiKey: !!apiKey,
          apiKeyLength: apiKey?.length || 0,
          customerEmail,
          orderNumber: orderData?.orderNumber,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
```

## Step 2: Test This Simple Version

1. **Replace the function code** in Supabase with the above
2. **Deploy** the function
3. **Test** with the same JSON:

```json
{
  "customerEmail": "abdullahfun00004@gmail.com",
  "orderData": {
    "orderNumber": "TEST-123",
    "customerName": "Test Customer",
    "items": [
      {
        "name": "SUFI SHINE Hair Oil",
        "price": 1500,
        "quantity": 1,
        "image_url": "/hair-oil-bottle.jpg"
      }
    ],
    "total": 1500,
    "paymentMethod": "COD",
    "shippingAddress": {
      "address": "123 Test Street",
      "city": "Karachi",
      "postalCode": "75500",
      "country": "Pakistan"
    }
  }
}
```

## Step 3: Check Results

### If This Works ✅

You should get a response like:

```json
{
  "success": true,
  "message": "Test function works!",
  "debug": {
    "hasApiKey": true,
    "apiKeyLength": 37,
    "customerEmail": "abdullahfun00004@gmail.com",
    "orderNumber": "TEST-123"
  }
}
```

### If This Still Fails ❌

Check the function logs in Supabase for the exact error.

## Step 4: Environment Variable Check

Make sure your environment variable is set correctly:

1. **Supabase Dashboard** → **Settings** → **Environment variables**
2. **Check for**:
   - Name: `RESEND_API_KEY`
   - Value: `re_aqNykJwY_9hvHyK1WMDEtHLjYrN8EG9yc`
   - Scope: **Edge Functions** ✅

## Step 5: After Simple Test Works

Once the simple version works, we can add back the email functionality step by step.

---

**Try the simple test function first and let me know what happens!**
