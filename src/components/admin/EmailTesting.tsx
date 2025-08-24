import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sendOrderEmail, OrderData, testEmailServiceConnection } from "@/lib/emailService";
import EmailPreview from "@/components/EmailPreview";
import { Mail, Eye, Send, TestTube } from "lucide-react";

const EmailTesting: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [testData, setTestData] = useState({
    customerName: "John Doe",
    customerEmail: "test@example.com",
    customerPhone: "+92 300 1234567",
    orderNumber: "ORD-123456",
    paymentMethod: "cash_on_delivery" as const,
    address: "123 Test Street",
    city: "Lahore",
    postalCode: "54000",
    country: "Pakistan",
  });

  const sampleOrderData: OrderData = {
    orderId: "test-123",
    orderNumber: testData.orderNumber,
    customerName: testData.customerName,
    customerEmail: testData.customerEmail,
    customerPhone: testData.customerPhone,
    items: [
      {
        id: 1,
        name: "SUFI SHINE Hair Oil Premium",
        price: 25.0,
        quantity: 2,
        image_url: "/assets/hair-oil-bottle.png",
      },
      {
        id: 2,
        name: "Natural Glow Face Cream",
        price: 35.0,
        quantity: 1,
        image_url: "/assets/face-cream.png",
      },
    ],
    subtotal: 85.0,
    shippingCharge: 0,
    total: 85.0,
    paymentMethod: testData.paymentMethod,
    shippingAddress: {
      address: testData.address,
      city: testData.city,
      postalCode: testData.postalCode,
      country: testData.country,
    },
    estimatedDelivery: "3-5 business days",
  };

  const handleSendTestEmail = async () => {
    if (!testData.customerEmail) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Sending test email to:", testData.customerEmail);
      
      const result = await sendOrderEmail({
        ...sampleOrderData,
        customerEmail: testData.customerEmail,
        customerName: testData.customerName,
        customerPhone: testData.customerPhone,
        orderNumber: testData.orderNumber,
        paymentMethod: testData.paymentMethod,
        shippingAddress: {
          address: testData.address,
          city: testData.city,
          postalCode: testData.postalCode,
          country: testData.country,
        },
      });

      console.log("Email send result:", result);

      if (result.success) {
        toast({
          title: "Success",
          description: `Test email sent successfully to ${testData.customerEmail}! Check your inbox (and spam folder).`,
        });
      } else {
        toast({
          title: "Email Send Failed",
          description: `Error: ${result.error || 'Unknown error'}. Check the browser console for details.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Test email error:", error);
      toast({
        title: "Error",
        description: `Failed to send test email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!testData.customerEmail) {
      toast({
        title: "Error",
        description: "Please enter a valid email address for connection test",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Testing email service connection...");
      
      const result = await testEmailServiceConnection(testData.customerEmail);
      
      console.log("Connection test result:", result);

      if (result.success) {
        toast({
          title: "Connection Test Successful",
          description: `Email service is working! Test email sent to ${testData.customerEmail}`,
        });
      } else {
        toast({
          title: "Connection Test Failed",
          description: `${result.error}. Check the browser console for details.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Connection test error:", error);
      toast({
        title: "Connection Test Error",
        description: `${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email System Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={testData.customerName}
                onChange={(e) =>
                  setTestData({ ...testData, customerName: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={testData.customerEmail}
                onChange={(e) =>
                  setTestData({ ...testData, customerEmail: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                value={testData.customerPhone}
                onChange={(e) =>
                  setTestData({ ...testData, customerPhone: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                value={testData.orderNumber}
                onChange={(e) =>
                  setTestData({ ...testData, orderNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={testData.address}
              onChange={(e) =>
                setTestData({ ...testData, address: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={testData.city}
                onChange={(e) =>
                  setTestData({ ...testData, city: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={testData.postalCode}
                onChange={(e) =>
                  setTestData({ ...testData, postalCode: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={testData.country}
                onChange={(e) =>
                  setTestData({ ...testData, country: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "Hide Preview" : "Preview Email"}
            </Button>
            <Button
              onClick={handleTestConnection}
              disabled={loading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {loading ? "Testing..." : "Test Connection"}
            </Button>
            <Button
              onClick={handleSendTestEmail}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Send Order Email"}
            </Button>
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            <p className="font-medium mb-2">📧 Email Configuration Status:</p>
            <p className="mb-3">
              {import.meta.env.VITE_RESEND_API_KEY
                ? "✅ Email service configured (Resend API key found)"
                : "⚠️ Email service not configured. Set VITE_RESEND_API_KEY in your .env file"}
            </p>
            
            {import.meta.env.VITE_RESEND_API_KEY && (
              <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-green-700 font-medium">✓ API Key Status:</p>
                <p className="text-green-600 text-xs">Key found: {import.meta.env.VITE_RESEND_API_KEY.substring(0, 8)}...</p>
              </div>
            )}
            
            <div className="mb-3">
              <p className="font-medium">📋 Troubleshooting Steps:</p>
              <ol className="list-decimal list-inside ml-2 space-y-1 text-xs">
                <li><strong>Test Connection:</strong> Click "Test Connection" to verify API setup</li>
                <li><strong>Check Spam:</strong> Emails might be in spam/junk folder</li>
                <li><strong>Wait Time:</strong> Emails can take 1-2 minutes to arrive</li>
                <li><strong>Console:</strong> Check browser Developer Tools {'>'} Console for errors</li>
                <li><strong>Valid Email:</strong> Ensure test email address is valid and accessible</li>
              </ol>
            </div>

            <details className="cursor-pointer">
              <summary className="font-medium">🔧 Setup Instructions (click to expand)</summary>
              <div className="mt-2 ml-2">
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>
                    Create account at{" "}
                    <a
                      href="https://resend.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      resend.com
                    </a>
                  </li>
                  <li>Go to API Keys section in dashboard</li>
                  <li>Create new API key (starts with "re_")</li>
                  <li>
                    Add to your <code>.env</code> file: <code>VITE_RESEND_API_KEY=re_your_key</code>
                  </li>
                  <li>Restart development server: <code>npm run dev</code></li>
                </ol>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailPreview
              orderData={{
                ...sampleOrderData,
                customerEmail: testData.customerEmail,
                customerName: testData.customerName,
                customerPhone: testData.customerPhone,
                orderNumber: testData.orderNumber,
                paymentMethod: testData.paymentMethod,
                shippingAddress: {
                  address: testData.address,
                  city: testData.city,
                  postalCode: testData.postalCode,
                  country: testData.country,
                },
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailTesting;
