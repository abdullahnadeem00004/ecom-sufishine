import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  sendOrderConfirmationEmail,
  OrderData,
  EmailResult,
} from "@/lib/emailService";
import { Loader2, Mail, CheckCircle, XCircle, Info } from "lucide-react";

const EmailDebugTester: React.FC = () => {
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailResult | null>(null);

  const handleTest = async () => {
    if (!testEmail) {
      setResult({
        success: false,
        error: "Please enter an email address",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log("🧪 DEBUG: Starting email test...");

      const testOrderData: OrderData = {
        orderNumber: `TEST-${Date.now().toString().slice(-6)}`,
        customerName: "Debug Test Customer",
        customerEmail: testEmail,
        customerPhone: "+92 300 1234567",
        items: [
          {
            id: "debug-1",
            name: "SUFI SHINE Hair Oil - Test Product",
            price: 1500,
            quantity: 1,
            image_url: "/src/assets/hair-oil-bottle.jpg",
          },
        ],
        subtotal: 1500,
        shippingCharge: 150,
        total: 1650,
        paymentMethod: "cash_on_delivery",
        shippingAddress: {
          address: "123 Debug Street, Test Block",
          city: "Karachi",
          postalCode: "75500",
          country: "Pakistan",
        },
        estimatedDelivery: "3-5 business days",
        trackingNumber: "TRK-DEBUG-123456",
      };

      console.log("🧪 DEBUG: About to call sendOrderConfirmationEmail");
      const emailResult = await sendOrderConfirmationEmail(
        testEmail,
        testOrderData
      );
      console.log("🧪 DEBUG: Email result received:", emailResult);

      setResult(emailResult);
    } catch (error) {
      console.error("🧪 DEBUG: Error during test:", error);
      setResult({
        success: false,
        error: `Test error: ${error.message || JSON.stringify(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email System Debug Tester
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This tool helps debug why automatic emails aren't being sent
              during checkout. Open browser console (F12) to see detailed logs.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email to test with"
              />
            </div>

            <Button
              onClick={handleTest}
              disabled={loading || !testEmail}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Email System...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Test Email System
                </>
              )}
            </Button>
          </div>

          {result && (
            <Alert
              className={
                result.success
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }
            >
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">
                    {result.success
                      ? "✅ Email System Working!"
                      : "❌ Email System Issue"}
                  </p>

                  {result.success && (
                    <div>
                      {result.fallback ? (
                        <div className="text-amber-700">
                          <p>⚠️ Running in fallback mode (development)</p>
                          <p className="text-sm">
                            This is normal during development. Check console for
                            email content.
                          </p>
                        </div>
                      ) : (
                        <div className="text-green-700">
                          <p>🚀 Production email sent successfully!</p>
                          <p className="text-sm">
                            Real email was delivered via Resend API.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {result.error && (
                    <div className="text-red-700">
                      <p className="font-mono text-sm bg-red-100 p-2 rounded">
                        {result.error}
                      </p>
                    </div>
                  )}

                  {result.message && (
                    <p className="text-sm text-gray-600">{result.message}</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
            <h4 className="font-semibold mb-2">🔍 Debug Checklist:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>1. Check browser console for detailed logs</li>
              <li>2. Verify Supabase Edge Function is deployed</li>
              <li>3. Check RESEND_API_KEY environment variable</li>
              <li>4. Verify domain verification status</li>
              <li>5. Test network connectivity</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailDebugTester;
