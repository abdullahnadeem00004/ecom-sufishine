import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import Cart from "@/components/Cart";

const FloatingButtons = () => {
  const { totalItems } = useCart();
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // Don't show floating buttons on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = "+923041146524";
    const message =
      "Hi! I'm interested in SUFI SHINE products. Can you help me?";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
        {/* WhatsApp Button */}
        <Button
          onClick={handleWhatsAppClick}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          size="icon"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        {/* Cart Button - Using Cart component with custom trigger */}
        <Cart
          trigger={
            <Button
              ref={cartButtonRef}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative"
              size="icon"
              title="Open Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Button>
          }
        />
      </div>
    </>
  );
};

export default FloatingButtons;
