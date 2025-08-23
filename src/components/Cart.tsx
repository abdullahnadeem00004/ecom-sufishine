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
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Cart({ trigger, isOpen: externalIsOpen, onOpenChange }: CartProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
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
          <Button
            variant="ghost"
            size="icon"
            className="relative hover-glow p-2"
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-lg sm:text-xl">Shopping Cart</SheetTitle>
          <SheetDescription className="text-sm sm:text-base">
            {totalItems > 0
              ? `${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`
              : "Your cart is empty"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-4 sm:pt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Add some products to get started
              </p>
              <Button
                onClick={() => setIsOpen(false)}
                className="btn-spiritual text-sm sm:text-base px-6"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 px-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg"
                  >
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-md flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs sm:text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        PKR {item.price.toFixed(2)} each
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 sm:h-8 sm:w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                          </Button>
                          <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 sm:h-8 sm:w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-xs sm:text-sm">
                            PKR {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 sm:h-8 sm:w-8 text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 sm:pt-4 space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                {/* Cart Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>
                      Subtotal ({shippingDetails.totalQuantity} items)
                    </span>
                    <span>PKR {totalPrice.toFixed(2)}</span>
                  </div>
                  {/* Note: Shipping costs will be calculated during checkout based on payment method */}
                  <Separator />
                  <div className="flex justify-between text-sm sm:text-base font-semibold">
                    <span>Subtotal</span>
                    <span>PKR {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground px-1">
                    📦 Free shipping available with JazzCash, EasyPaisa & Bank
                    Transfer
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
                    className="w-full btn-spiritual text-sm sm:text-base py-2 sm:py-3"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-sm sm:text-base py-2 sm:py-3"
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
