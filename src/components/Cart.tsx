import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  formatShippingBreakdown,
  getShippingExplanation,
} from "@/lib/shippingUtils";

interface CartProps {
  trigger?: React.ReactNode;
}

function Cart({ trigger }: CartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    getCartTotalWithShipping,
    getShippingCharge,
    shippingDetails,
  } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some products to your cart first.",
        variant: "destructive",
      });
      return;
    }

    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="relative hover-glow">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {totalItems > 0
              ? `${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`
              : "Your cart is empty"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add some products to get started
              </p>
              <Button
                onClick={() => setIsOpen(false)}
                className="btn-spiritual"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        PKR {item.price.toFixed(2)} each
                      </p>

                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <p className="font-semibold text-sm">
                        PKR {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-4">
                {/* Cart Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Subtotal ({shippingDetails.totalQuantity} items)
                    </span>
                    <span>PKR {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex flex-col">
                      <span>Shipping</span>
                      <span className="text-xs text-muted-foreground">
                        {formatShippingBreakdown(shippingDetails)}
                      </span>
                    </span>
                    <span>PKR {getShippingCharge().toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground px-1">
                    {getShippingExplanation()}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>PKR {getCartTotalWithShipping().toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-2">
                  {!user && (
                    <div className="text-center text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                      💡 You can checkout as a guest or{" "}
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/auth");
                        }}
                        className="text-primary underline hover:no-underline"
                      >
                        sign in
                      </button>{" "}
                      to save your details
                    </div>
                  )}
                  <Button
                    className="w-full btn-spiritual"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Cart;
