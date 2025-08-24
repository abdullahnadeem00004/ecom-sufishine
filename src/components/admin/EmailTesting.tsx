import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendOrderEmail, OrderData } from '@/lib/emailService';
import EmailPreview from '@/components/EmailPreview';
import { Mail, Eye, Send } from 'lucide-react';

const EmailTesting: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [testData, setTestData] = useState({
    customerName: 'John Doe',
    customerEmail: 'test@example.com',
    customerPhone: '+92 300 1234567',
    orderNumber: 'ORD-123456',
    paymentMethod: 'cash_on_delivery' as const,
    address: '123 Test Street',
    city: 'Lahore',
    postalCode: '54000',
    country: 'Pakistan',
  });

  const sampleOrderData: OrderData = {
    orderId: 'test-123',
    orderNumber: testData.orderNumber,
    customerName: testData.customerName,
    customerEmail: testData.customerEmail,
    customerPhone: testData.customerPhone,
    items: [
      {
        id: 1,
        name: 'SUFI SHINE Hair Oil Premium',
        price: 25.0,
        quantity: 2,
        image_url: '/assets/hair-oil-bottle.png',
      },
      {
        id: 2,
        name: 'Natural Glow Face Cream',
        price: 35.0,
        quantity: 1,
        image_url: '/assets/face-cream.png',
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
    estimatedDelivery: '3-5 business days',
  };

  const handleSendTestEmail = async () => {
    if (!testData.customerEmail) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
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

      if (result.success) {
        toast({
          title: 'Success',
          description: `Test email sent successfully to ${testData.customerEmail}`,
        });
      } else {
        toast({
          title: 'Email Service Note',
          description: 'Email service not configured, but email template generated successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send test email',
        variant: 'destructive',
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

          <div className="flex gap-3">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Hide Preview' : 'Preview Email'}
            </Button>
            <Button
              onClick={handleSendTestEmail}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {loading ? 'Sending...' : 'Send Test Email'}
            </Button>
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium mb-1">📧 Email Configuration Status:</p>
            <p>
              {import.meta.env.VITE_RESEND_API_KEY 
                ? '✅ Email service configured (Resend API key found)'
                : '⚠️ Email service not configured. Set VITE_RESEND_API_KEY in your .env file'
              }
            </p>
            <p className="mt-2">
              To set up email service:
            </p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>Create an account at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">resend.com</a></li>
              <li>Get your API key from the dashboard</li>
              <li>Create a <code>.env</code> file and add: <code>VITE_RESEND_API_KEY=your_key_here</code></li>
              <li>Restart your development server</li>
            </ol>
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
