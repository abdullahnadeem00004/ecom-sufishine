# 🚨 EMAIL NOT SENDING - TROUBLESHOOTING GUIDE

## ⚡ **QUICK FIX STEPS**

### **Step 1: Test Email System Immediately**

1. Go to: `http://localhost:8082/email-debug`
2. Enter your email address
3. Click "Test Email System"
4. **Open Browser Console (F12)** to see detailed logs
5. Check the results

### **Step 2: Common Issues & Fixes**

#### **🔧 Issue 1: Edge Function Not Deployed**

**Symptoms:** Console shows "Function not found" or "404" errors

**Fix:**

```bash
# Deploy the Edge Function
cd supabase
supabase functions deploy send-email

# Check deployment status
supabase functions list
```

#### **🔧 Issue 2: Missing RESEND_API_KEY**

**Symptoms:** Console shows "RESEND_API_KEY not configured"

**Fix:**

```bash
# Set the API key in Supabase
supabase secrets set RESEND_API_KEY=re_aqNykJwY_9hvHyK1WMDEtHLjYrN8EG9yc
```

#### **🔧 Issue 3: Domain Not Verified**

**Symptoms:** Console shows "Domain verification required" or "403" errors

**Fix:**

1. Go to: https://resend.com/domains
2. Verify `sufishine.com` is listed and verified
3. If not verified, check DNS records in your domain provider

#### **🔧 Issue 4: Network/Connection Issues**

**Symptoms:** Console shows network errors or timeout

**Fix:**

- Check internet connectivity
- Verify Supabase project is accessible
- Try the admin email testing interface: `/admin/settings`

## 🔍 **DETAILED DEBUGGING**

### **Debug Output Analysis:**

#### **✅ Working (Fallback Mode):**

```
🔍 DEBUG: Starting sendOrderConfirmationEmail function
📧 Sending order confirmation email via Supabase Edge Function
🔄 Edge Function issue detected, using fallback logging...
=== EMAIL FALLBACK MODE ===
📧 Email would be sent to: customer@example.com
✅ SUCCESS: Email system is working!
⚠️ Running in fallback mode (development)
```

**Meaning:** System works but using development mode. Emails are logged to console.

#### **✅ Working (Production Mode):**

```
🔍 DEBUG: Starting sendOrderConfirmationEmail function
📧 Sending order confirmation email via Supabase Edge Function
✅ Email sent successfully via Edge Function
🚀 Production email sent successfully!
```

**Meaning:** System fully operational, real emails being sent.

#### **❌ Not Working:**

```
🔍 DEBUG: Starting sendOrderConfirmationEmail function
❌ Supabase Edge Function error: FunctionsRelayError
🚨 Error in email service: Function not found
```

**Meaning:** Edge Function not deployed or configured incorrectly.

### **Step-by-Step Debugging Process:**

#### **1. Check Email Service Function**

```javascript
// In browser console during checkout:
console.log("Testing email service...");
```

#### **2. Verify Supabase Connection**

```javascript
// Check if supabase client is working
console.log("Supabase client:", supabase);
```

#### **3. Test Edge Function Directly**

```javascript
// Test the function manually
supabase.functions.invoke('send-email', {
  body: { customerEmail: 'test@example.com', orderData: {...} }
}).then(result => console.log('Direct test:', result));
```

## 🛠️ **PRODUCTION DEPLOYMENT CHECKLIST**

### **Required for Email Sending:**

- [ ] **Supabase Edge Function Deployed**

  ```bash
  supabase functions deploy send-email
  ```

- [ ] **RESEND_API_KEY Set**

  ```bash
  supabase secrets set RESEND_API_KEY=re_aqNykJwY_9hvHyK1WMDEtHLjYrN8EG9yc
  ```

- [ ] **Domain Verified on Resend**

  - Go to https://resend.com/domains
  - `sufishine.com` should show "Verified" status

- [ ] **DNS Records Configured**
  - SPF: `v=spf1 include:_spf.resend.com ~all`
  - DKIM: (Provided by Resend)
  - DMARC: `v=DMARC1; p=quarantine; rua=mailto:dmarc@sufishine.com`

## 🧪 **TESTING METHODS**

### **Method 1: Email Debug Page**

- Visit: `http://localhost:8082/email-debug`
- Enter test email and click test
- Check browser console for logs

### **Method 2: Admin Testing Interface**

- Visit: `http://localhost:8082/admin/settings`
- Use the Email Testing section
- More comprehensive testing options

### **Method 3: Actual Checkout Test**

- Go through complete checkout process
- Use a real email address
- Check console logs during order placement

### **Method 4: Direct Function Test**

```bash
# Test Edge Function directly via CLI
supabase functions invoke send-email --data '{
  "customerEmail": "test@example.com",
  "orderData": {
    "orderNumber": "TEST-123",
    "customerName": "Test Customer",
    "total": 1500,
    "items": [{"name": "Test Product", "price": 1500, "quantity": 1}],
    "paymentMethod": "COD",
    "shippingAddress": {"address": "Test", "city": "Test", "postalCode": "123", "country": "Test"}
  }
}'
```

## 📋 **CURRENT STATUS CHECK**

### **Check These Files:**

1. **Edge Function:** `supabase/functions/send-email/index.ts`
2. **Email Service:** `src/lib/emailService.ts`
3. **Checkout Integration:** `src/pages/Checkout.tsx`
4. **Supabase Config:** `supabase/config.toml`

### **Expected Behavior in Checkout:**

1. Customer fills checkout form
2. Clicks "Place Order"
3. Console shows: "📧 Starting automatic email sending process..."
4. Console shows: "📧 Calling sendOrderConfirmationEmail function..."
5. Console shows email result (success/failure)
6. Customer sees toast message about email status

## 🎯 **MOST LIKELY ISSUES:**

### **Development Mode:**

- Edge Function not deployed locally
- Using fallback logging (this is normal during development)
- Real emails won't send but system works

### **Production Mode:**

- Edge Function deployed but RESEND_API_KEY missing
- Domain verification issues
- Network connectivity problems

## ✅ **QUICK VERIFICATION**

**Run this in browser console during checkout:**

```javascript
// Check if sendOrderConfirmationEmail is accessible
console.log("Email function available:", typeof sendOrderConfirmationEmail);

// Check Supabase client
console.log("Supabase client available:", typeof supabase);

// Test a simple function call
supabase.functions
  .invoke("send-email", {
    body: { test: true },
  })
  .then((r) => console.log("Function test:", r));
```

**Expected Output:**

- Function should be defined
- Supabase client should be available
- Function test should return response (even if error)

---

## 🚀 **NEXT STEPS**

1. **Use the email debug page:** `http://localhost:8082/email-debug`
2. **Check browser console** for detailed error logs
3. **Test with admin interface** at `/admin/settings`
4. **Deploy Edge Function** if not already deployed
5. **Verify all environment variables** are set correctly

**The issue is likely one of the common problems above. Follow the debug steps and check console logs for specific error messages!**
