import React from "react";
import { OrderData } from "../lib/emailService";

interface EmailPreviewProps {
  orderData: OrderData;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ orderData }) => {
  const {
    orderNumber,
    customerName,
    items,
    subtotal,
    shippingCharge,
    total,
    paymentMethod,
    shippingAddress,
    estimatedDelivery = "3-5 business days",
  } = orderData;

  const paymentMethodNames = {
    cash_on_delivery: "Cash on Delivery",
    jazzcash: "JazzCash",
    easypaisa: "EasyPaisa",
    bank_account: "Bank Transfer",
  };

  const paymentInstructions = {
    jazzcash:
      "Please make payment to JazzCash account: 03041146524, Account Title: LUQMAN BIN RIZWAN",
    easypaisa:
      "Please make payment to EasyPaisa account: 03391146524, Account Title: LUQMAN BIN RIZWAN",
    bank_account:
      "Please transfer to IBAN PK68ALFH033100101005004 (Account Title: SUFI SHINE, Acc No: 03311010050044)",
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-8 text-center">
        <div className="text-2xl font-bold mb-2">SUFI SHINE</div>
        <h1 className="text-xl font-semibold">Order Confirmation</h1>
        <p className="mt-2">Thank you for your order, {customerName}!</p>
      </div>

      {/* Content */}
      <div className="p-6 bg-gray-50">
        {/* Order Details */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          <div className="space-y-2 mb-4">
            <p>
              <span className="font-medium">Order Number:</span> {orderNumber}
            </p>
            <p>
              <span className="font-medium">Order Date:</span>{" "}
              {new Date().toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Estimated Delivery:</span>{" "}
              {estimatedDelivery}
            </p>
          </div>

          <h3 className="font-medium mb-3">Items Ordered:</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100"
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </div>
                </div>
                <div className="font-medium">
                  PKR {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="flex justify-between py-2">
              <div>Subtotal:</div>
              <div>PKR {subtotal.toFixed(2)}</div>
            </div>

            <div className="flex justify-between py-2">
              <div>Shipping:</div>
              <div>
                {shippingCharge === 0
                  ? "FREE"
                  : `PKR ${shippingCharge.toFixed(2)}`}
              </div>
            </div>

            <div className="flex justify-between py-3 border-t-2 border-green-600 font-bold text-lg">
              <div>Total:</div>
              <div>PKR {total.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="font-semibold mb-3">Shipping Address</h3>
          <div className="bg-green-50 p-4 rounded-lg">
            <div>{shippingAddress.address}</div>
            <div>
              {shippingAddress.city}, {shippingAddress.postalCode}
            </div>
            <div>{shippingAddress.country}</div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="font-semibold mb-3">Payment Information</h3>
          <p className="mb-3">
            <span className="font-medium">Payment Method:</span>{" "}
            {paymentMethodNames[
              paymentMethod as keyof typeof paymentMethodNames
            ] || paymentMethod}
          </p>

          {paymentMethod !== "cash_on_delivery" ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h4 className="font-medium mb-2">Payment Instructions:</h4>
              <p className="mb-2">
                {
                  paymentInstructions[
                    paymentMethod as keyof typeof paymentInstructions
                  ]
                }
              </p>
              <p>
                <span className="font-medium">Important:</span> Please include
                your order number{" "}
                <span className="font-bold">{orderNumber}</span> in the payment
                reference.
              </p>
            </div>
          ) : (
            <p className="text-green-600 font-medium">
              ✓ You will pay when your order is delivered.
            </p>
          )}
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="font-semibold mb-3">Order Tracking</h3>
          <p className="mb-2">
            You will receive a tracking number via email once your order ships.
            You can also track your order status by visiting our website.
          </p>
          <p>
            For any questions about your order, please contact us with your
            order number: <span className="font-bold">{orderNumber}</span>
          </p>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-gray-100 rounded-lg p-6">
          <h4 className="font-semibold mb-3">Terms & Conditions</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mb-4">
            <li>All orders are subject to product availability</li>
            <li>
              Delivery times are estimates and may vary during peak seasons
            </li>
            <li>
              Returns are accepted within 7 days of delivery for unopened
              products
            </li>
            <li>
              For cash on delivery orders, full payment is required upon
              delivery
            </li>
            <li>
              For online payments, orders will be processed after payment
              verification
            </li>
            <li>
              SUFI SHINE reserves the right to cancel orders in case of pricing
              errors
            </li>
            <li>
              Customers will be notified of any order modifications via email or
              phone
            </li>
          </ul>

          <h4 className="font-semibold mb-2">Contact Information</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-medium">Customer Service:</span> Available 9
              AM - 8 PM (Monday to Saturday)
            </p>
            <p>
              <span className="font-medium">WhatsApp:</span> +92 304 1146524
            </p>
            <p>
              <span className="font-medium">Email:</span> support@sufishine.com
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center p-6 text-gray-600">
        <p className="font-medium">Thank you for choosing SUFI SHINE!</p>
        <p className="text-sm mt-1">
          Follow us on social media for beauty tips and product updates
        </p>
        <p className="text-xs mt-2">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    </div>
  );
};

export default EmailPreview;
