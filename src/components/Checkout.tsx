import React, { useState, useEffect } from "react";
import { useUser, useSession } from "@supabase/auth-helpers-react";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

function CardPaymentForm({ amount, orderId, onPaid }: { amount: number; orderId: number; onPaid: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleCardPayment = async () => {
    setLoading(true);
    try {
      // Call Supabase Edge Function to create PaymentIntent
      const res = await fetch("/functions/v1/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(amount * 100) }), // amount in cents
      });
      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("No client secret returned");

      const result = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements?.getElement(CardElement)!,
        },
      });

      if (result?.error) {
        toast.error(result.error.message || "Payment failed");
      } else if (result?.paymentIntent?.status === "succeeded") {
        toast.success("Payment successful!");
        // Update order status to paid
        await fetch(`/functions/v1/mark-order-paid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        onPaid();
      }
    } catch (err: any) {
      toast.error("Payment error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CardElement className="border p-2 mb-2" />
      <button
        type="button"
        className="btn btn-success"
        onClick={handleCardPayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay with Card"}
      </button>
    </div>
  );
}

export default function Checkout() {
  const user = useUser();
  const session = useSession();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");

  const schema = z.object({
    delivery_address: z.string().min(5, "Enter delivery address"),
    phone: z.string().regex(/^[\d]{10,15}$/, "Enter valid phone"),
    email: z.string().email("Enter valid email"),
    payment_method: z.enum(["cod", "card", "jazzcash", "easypaisa"]),
  });
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      payment_method: "cod",
    },
  });

  useEffect(() => {
    if (session?.user?.email) setValue("email", session.user.email);
  }, [session, setValue]);

  // Cart validation and route protection
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartData);
    if (!cartData.length) {
      window.location.href = "/cart";
    }
  }, []);

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + 5;

  // JazzCash/EasyPaisa payment handler
  const handleWalletPayment = async (method: "jazzcash" | "easypaisa", orderId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/functions/v1/pay-${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount: total }),
      });
      const { paymentUrl } = await res.json();
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error("Failed to initiate payment.");
      }
    } catch (err: any) {
      toast.error("Payment error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // 1. Save order as 'pending' or 'initiated'
      const { data: orderData, error } = await supabase.from("orders").insert([
        {
          user_id: user?.id,
          products: cart,
          total,
          status: data.payment_method === "cod" ? "pending" : "initiated",
          delivery_address: data.delivery_address,
          phone: data.phone,
          email: data.email,
          payment_method: data.payment_method,
        },
      ]).select().single();
      if (error) throw error;
      setOrderId(orderData.id);
      setPaymentMethod(data.payment_method);

      if (data.payment_method === "cod") {
        toast.success("Order placed!");
        localStorage.removeItem("cart");
        window.location.href = "/dashboard";
      } else if (data.payment_method === "card") {
        // Card payment handled in review step
      } else if (data.payment_method === "jazzcash" || data.payment_method === "easypaisa") {
        await handleWalletPayment(data.payment_method, orderData.id);
      }
    } catch (err: any) {
      toast.error("Order failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 2));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleCardPaid = () => {
    toast.success("Order paid and placed!");
    localStorage.removeItem("cart");
    window.location.href = "/dashboard";
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto p-6 bg-white rounded shadow"
    >
      {/* Stepper */}
      <div className="flex mb-4">
        <div className={`flex-1 text-center ${step === 0 ? "font-bold text-green-700" : ""}`}>1. Delivery</div>
        <div className={`flex-1 text-center ${step === 1 ? "font-bold text-green-700" : ""}`}>2. Payment</div>
        <div className={`flex-1 text-center ${step === 2 ? "font-bold text-green-700" : ""}`}>3. Review</div>
      </div>
      {step === 0 && (
        <div>
          <textarea {...register("delivery_address")} placeholder="Delivery Address" className="w-full border p-2 mb-2" />
          {errors.delivery_address && <div className="text-red-500">{errors.delivery_address.message}</div>}
          <input {...register("phone")} placeholder="Phone Number" className="w-full border p-2 mb-2" />
          {errors.phone && <div className="text-red-500">{errors.phone.message}</div>}
          <input {...register("email")} placeholder="Email" className="w-full border p-2 mb-2" />
          {errors.email && <div className="text-red-500">{errors.email.message}</div>}
          <div className="flex gap-2">
            <button type="button" onClick={nextStep} className="btn btn-primary mt-2">Next</button>
          </div>
        </div>
      )}
      {step === 1 && (
        <div>
          <div className="mb-2">
            <label><input type="radio" value="cod" {...register("payment_method")} /> Cash on Delivery</label>
          </div>
          <div className="mb-2">
            <label><input type="radio" value="card" {...register("payment_method")} /> Card Payment</label>
          </div>
          <div className="mb-2">
            <label><input type="radio" value="jazzcash" {...register("payment_method")} /> Jazz Cash</label>
          </div>
          <div className="mb-2">
            <label><input type="radio" value="easypaisa" {...register("payment_method")} /> EasyPaisa</label>
          </div>
          {errors.payment_method && <div className="text-red-500">{errors.payment_method.message}</div>}
          <div className="flex gap-2">
            <button type="button" onClick={prevStep} className="btn btn-secondary mt-2">Back</button>
            <button type="button" onClick={nextStep} className="btn btn-primary mt-2">Next</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3 className="font-bold mb-2">Review Order</h3>
          <ul className="mb-2">
            {cart.map((item: any) => (
              <li key={item.id}>{item.name} x{item.quantity} - ${item.price * item.quantity}</li>
            ))}
          </ul>
          <div>Subtotal: ${subtotal}</div>
          <div>Shipping: $5</div>
          <div className="font-bold">Total: ${total}</div>
          <div className="mt-2">
            <strong>Delivery:</strong> {watch("delivery_address")}
            <br />
            <strong>Phone:</strong> {watch("phone")}
            <br />
            <strong>Email:</strong> {watch("email")}
            <br />
            <strong>Payment:</strong> {watch("payment_method")}
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={prevStep} className="btn btn-secondary">Back</button>
            {/* Card Payment */}
            {orderId && paymentMethod === "card" && (
              <Elements stripe={stripePromise}>
                <CardPaymentForm amount={total} orderId={orderId} onPaid={handleCardPaid} />
              </Elements>
            )}
            {/* JazzCash/EasyPaisa handled by redirect after submit */}
            {(!orderId || paymentMethod === "cod") && (
              <button type="submit" className="btn btn-success" disabled={loading || !cart.length}>
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
        </div>
      )}
      {step === 1 && (
        <div>
          <div className="mb-2">
            <label>
              <input type="radio" value="cod" {...register("payment_method")} />{" "}
              Cash on Delivery
            </label>
          </div>
          <div className="mb-2">
            <label>
              <input
                type="radio"
                value="card"
                {...register("payment_method")}
              />{" "}
              Card Payment
            </label>
          </div>
          <div className="mb-2">
            <label>
              <input
                type="radio"
                value="jazzcash"
                {...register("payment_method")}
              />{" "}
              Jazz Cash
            </label>
          </div>
          <div className="mb-2">
            <label>
              <input
                type="radio"
                value="easypaisa"
                {...register("payment_method")}
              />{" "}
              EasyPaisa
            </label>
          </div>
          {errors.payment_method && (
            <div className="text-red-500">{errors.payment_method.message}</div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prevStep}
              className="btn btn-secondary mt-2"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="btn btn-primary mt-2"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <h3 className="font-bold mb-2">Review Order</h3>
          <ul className="mb-2">
            {cart.map((item: any) => (
              <li key={item.id}>
                {item.name} x{item.quantity} - ${item.price * item.quantity}
              </li>
            ))}
          </ul>
          <div>Subtotal: ${subtotal}</div>
          <div>Shipping: $5</div>
          <div className="font-bold">Total: ${total}</div>
          <div className="mt-2">
            <strong>Delivery:</strong> {watch("delivery_address")}
            <br />
            <strong>Phone:</strong> {watch("phone")}
            <br />
            <strong>Email:</strong> {watch("email")}
            <br />
            <strong>Payment:</strong> {watch("payment_method")}
          </div>
          {showPaymentWarning && (
            <div className="text-red-500 mt-2">
              Only Cash on Delivery is available at this time.
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prevStep}
              className="btn btn-secondary mt-4"
            >
              Back
            </button>
            {/* Show payment forms for card, JazzCash, EasyPaisa */}
            {watch("payment_method") === "card" && (
              <Elements stripe={stripePromise}>
                <CardPaymentForm onPaid={handleCardPaid} />
              </Elements>
            )}
            {["jazzcash", "easypaisa"].includes(watch("payment_method")) ? (
              <button
                type="submit"
                className="btn btn-success mt-4"
                disabled={loading || !cart.length}
              >
                {loading
                  ? "Processing..."
                  : `Pay with ${
                      watch("payment_method") === "jazzcash"
                        ? "JazzCash"
                        : "EasyPaisa"
                    }`}
              </button>
            ) : watch("payment_method") === "cod" ? (
              <button
                type="submit"
                className="btn btn-success mt-4"
                disabled={loading || !cart.length}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            ) : null}
          </div>
        </div>
      )}
    </form>
  );
}
