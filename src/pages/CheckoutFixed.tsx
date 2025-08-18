import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  formatShippingBreakdown,
  getShippingExplanation,
} from "@/lib/shippingUtils";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  Lock,
  ShieldCheck,
  UserPlus,
  AlertTriangle,
  Info,
} from "lucide-react";

interface Error {
  message: string;
}

const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string(),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["cash_on_delivery", "jazzcash", "easypaisa", "card"], {
    required_error: "Please select a payment method",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout: React.FC = (): JSX.Element => {
  const {
    items,
    clearCart,
    getCartTotal,
    getCartTotalWithShipping,
    getShippingCharge,
    shippingDetails,
  } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "shipping" | "payment" | "review"
  >("shipping");

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      paymentMethod: undefined,
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    if (data.paymentMethod === "card") {
      toast({
        title: "Card Payment",
        description: "Card payment is not available yet.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const delivery_address = {
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
      };

      // Generate order ID for tracking
      const orderId = crypto.randomUUID().slice(0, 8);

      // Create order data
      const orderData = {
        orderId: orderId,
        items: items,
        customer: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
        },
        address: delivery_address,
        subtotal: getCartTotal(),
        shipping_charge: getShippingCharge(),
        total: getCartTotalWithShipping(),
        paymentMethod: data.paymentMethod,
        status: "pending",
        timestamp: new Date().toISOString(),
        isGuest: !user,
      };

      // Store order in localStorage for demo purposes
      const existingOrders = JSON.parse(
        localStorage.getItem("guestOrders") || "[]"
      );
      existingOrders.push(orderData);
      localStorage.setItem("guestOrders", JSON.stringify(existingOrders));

      // If user is logged in, also try to save to database
      if (user) {
        try {
          // Generate a readable order number
          const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${orderId
            .slice(0, 4)
            .toUpperCase()}`;

          const dbOrderData = {
            order_number: orderNumber,
            user_id: user.id,
            customer_name: `${data.firstName} ${data.lastName}`,
            customer_email: data.email,
            customer_phone: data.phone,
            items: JSON.stringify(items),
            total_amount: getCartTotalWithShipping(),
            shipping_charge: getShippingCharge(),
            status: "pending",
            payment_method: data.paymentMethod,
            shipping_address: JSON.stringify(delivery_address),
          };

          await supabase.from("guest_orders").insert(dbOrderData);
          console.log("Order saved to database for logged-in user");
        } catch (dbError) {
          console.log(
            "Database save failed, but order is stored locally:",
            dbError
          );
        }
      }

      console.log("Order created successfully:", orderId);

      // Show payment instructions for specific payment methods
      if (data.paymentMethod === "jazzcash") {
        setTimeout(() => {
          toast({
            title: "JazzCash Payment Instructions",
            description:
              "Please make payment to JazzCash account: 03041146524, Account Title: LUQMAN BIN RIZWAN. Then contact us with payment confirmation.",
            duration: 10000,
          });
        }, 2000);
      } else if (data.paymentMethod === "easypaisa") {
        setTimeout(() => {
          toast({
            title: "EasyPaisa Payment Instructions",
            description:
              "Please make payment to EasyPaisa account: 03391146524, Account Title: LUQMAN BIN RIZWAN. Then contact us with payment confirmation.",
            duration: 10000,
          });
        }, 2000);
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderId} has been placed. ${
          data.paymentMethod === "cash_on_delivery"
            ? "You will pay on delivery."
            : "Please complete the payment using the provided details."
        }${
          !user
            ? " Since you're not signed in, save this order ID for tracking: " +
              orderId
            : ""
        }`,
        duration: 8000,
      });

      clearCart();

      // Enhanced navigation based on user status
      if (user) {
        navigate("/profile");
      } else {
        // For guest users, show additional guidance
        setTimeout(() => {
          toast({
            title: "Order Confirmation",
            description:
              "Check your email for order details. Consider creating an account to track future orders!",
          });
        }, 3000);
        navigate("/shop");
      }
    } catch (error: unknown) {
      console.error("Error placing order:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-4">
              Add some products to your cart to continue
            </p>
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

          {/* Guest Checkout Information */}
          {!user && (
            <div className="mb-8">
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">
                      Shopping as a guest
                    </p>
                    <p className="text-blue-800 text-sm">
                      Your information will not be saved for future orders.
                      <Link
                        to="/auth"
                        className="text-blue-600 underline hover:text-blue-800 ml-1"
                      >
                        Sign in or create an account
                      </Link>{" "}
                      to save your details and track orders.
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/auth">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold text-green-900 mb-2">
                      ✓ With Account
                    </h4>
                    <ul className="text-green-800 space-y-1">
                      <li>• Save delivery addresses</li>
                      <li>• Track order history</li>
                      <li>• Faster future checkouts</li>
                      <li>• Exclusive member offers</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold text-orange-900 mb-2">
                      ⚠ Guest Checkout
                    </h4>
                    <ul className="text-orange-800 space-y-1">
                      <li>• Information not saved</li>
                      <li>• No order tracking</li>
                      <li>• Re-enter details each time</li>
                      <li>• Limited support options</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Logged in user welcome */}
          {user && (
            <div className="mb-6">
              <Alert className="border-green-200 bg-green-50">
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold text-green-900">
                    Welcome back! Your order will be saved to your account.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center ${
                  currentStep === "shipping" ||
                  currentStep === "payment" ||
                  currentStep === "review"
                    ? "text-green-600"
                    : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="ml-2">Shipping</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-200" />
              <div
                className={`flex items-center ${
                  currentStep === "payment" || currentStep === "review"
                    ? "text-green-600"
                    : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="ml-2">Payment</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-200" />
              <div
                className={`flex items-center ${
                  currentStep === "review" ? "text-green-600" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="ml-2">Review</span>
              </div>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Shipping Information */}
                <Card
                  className={currentStep !== "shipping" ? "opacity-50" : ""}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          {...form.register("firstName")}
                          placeholder="Enter first name"
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          {...form.register("lastName")}
                          placeholder="Enter last name"
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="Enter email address"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        {...form.register("phone")}
                        placeholder="Enter phone number"
                      />
                      {form.formState.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        {...form.register("address")}
                        placeholder="Enter street address"
                      />
                      {form.formState.errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          {...form.register("city")}
                          placeholder="Enter city"
                        />
                        {form.formState.errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          {...form.register("postalCode")}
                          placeholder="Enter postal code"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        {...form.register("country")}
                        placeholder="Enter country"
                      />
                      {form.formState.errors.country && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.country.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={() => setCurrentStep("payment")}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700"
                    >
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className={currentStep !== "payment" ? "opacity-50" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      onValueChange={(value: string) =>
                        form.setValue(
                          "paymentMethod",
                          value as
                            | "cash_on_delivery"
                            | "jazzcash"
                            | "easypaisa"
                            | "card"
                        )
                      }
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="cash_on_delivery"
                          id="cash_on_delivery"
                        />
                        <Label htmlFor="cash_on_delivery">
                          Cash on Delivery
                        </Label>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="jazzcash" id="jazzcash" />
                          <Label htmlFor="jazzcash">JazzCash</Label>
                        </div>
                        {form.watch("paymentMethod") === "jazzcash" && (
                          <div className="mt-2 p-3 bg-green-100 rounded text-sm">
                            Please make payment to JazzCash account:
                            03041146524, Account Title: LUQMAN BIN RIZWAN
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="easypaisa" id="easypaisa" />
                          <Label htmlFor="easypaisa">EasyPaisa</Label>
                        </div>
                        {form.watch("paymentMethod") === "easypaisa" && (
                          <div className="mt-2 p-3 bg-green-100 rounded text-sm">
                            Please make payment to EasyPaisa account:
                            03391146524, Account Title: LUQMAN BIN RIZWAN
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" disabled />
                          <Label htmlFor="card" className="text-gray-400">
                            Card Payment (Coming Soon)
                          </Label>
                        </div>
                        {form.watch("paymentMethod") === "card" && (
                          <div className="mt-2 p-3 bg-gray-100 rounded text-sm">
                            Coming soon
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                    {form.formState.errors.paymentMethod && (
                      <p className="text-red-500 text-sm mt-2">
                        {form.formState.errors.paymentMethod.message}
                      </p>
                    )}

                    <div className="flex justify-between mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep("shipping")}
                      >
                        Back to Shipping
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep("review")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Continue to Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4"
                      >
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            PKR {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>
                          Subtotal ({shippingDetails.totalQuantity} items):
                        </span>
                        <span>PKR {getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          Shipping:
                          <span className="text-xs text-muted-foreground">
                            ({formatShippingBreakdown(shippingDetails)})
                          </span>
                        </span>
                        <span>PKR {getShippingCharge().toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getShippingExplanation()}
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>PKR 0.00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>PKR {getCartTotalWithShipping().toFixed(2)}</span>
                      </div>
                    </div>

                    {currentStep === "review" && (
                      <div className="mt-6 space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">
                            Review Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Name:</strong>{" "}
                              {form.getValues("firstName")}{" "}
                              {form.getValues("lastName")}
                            </p>
                            <p>
                              <strong>Email:</strong> {form.getValues("email")}
                            </p>
                            <p>
                              <strong>Phone:</strong> {form.getValues("phone")}
                            </p>
                            <p>
                              <strong>Address:</strong>{" "}
                              {form.getValues("address")}
                            </p>
                            <p>
                              <strong>City:</strong> {form.getValues("city")},{" "}
                              {form.getValues("postalCode")}
                            </p>
                            <p>
                              <strong>Country:</strong>{" "}
                              {form.getValues("country")}
                            </p>
                            <p>
                              <strong>Payment Method:</strong>{" "}
                              {form
                                .getValues("paymentMethod")
                                ?.replace("_", " ")
                                .toUpperCase()}
                            </p>
                          </div>
                        </div>

                        {/* Guest checkout reminder in review step */}
                        {!user && (
                          <Alert className="border-amber-200 bg-amber-50">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <p className="font-semibold text-amber-900 mb-1">
                                Guest Checkout Reminder
                              </p>
                              <p className="text-amber-800 text-sm">
                                Your order details will be sent to your email
                                but won't be saved to an account. To track this
                                order in the future, save the confirmation email
                                we'll send you.
                              </p>
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex space-x-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep("payment")}
                            className="flex-1"
                          >
                            Back to Payment
                          </Button>
                          <Button
                            type="submit"
                            disabled={
                              loading ||
                              form.getValues("paymentMethod") === "card"
                            }
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {loading ? "Placing Order..." : "Place Order"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
