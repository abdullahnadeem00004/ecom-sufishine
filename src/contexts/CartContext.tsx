import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { calculateShippingCharge, ShippingDetails } from "@/lib/shippingUtils";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  shippingDetails: ShippingDetails;
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartTotalWithShipping: (paymentMethod?: string) => number;
  getShippingCharge: (paymentMethod?: string) => number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  shippingDetails: {
    baseRate: 200,
    totalQuantity: 0,
    shippingCharge: 0,
    breakdown: {
      baseFourProducts: 0,
      additionalCharges: 0,
      groupsOf4: 0,
    },
  },
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartTotalWithShipping: () => 0,
  getShippingCharge: () => 0,
});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(
      `sufi-shine-cart-${user?.id || "guest"}`
    );
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, [user?.id]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(
      `sufi-shine-cart-${user?.id || "guest"}`,
      JSON.stringify(items)
    );
  }, [items, user?.id]);

  const addItem = (product: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingDetails = calculateShippingCharge(totalItems);

  const getCartTotal = () => totalPrice;
  const getCartTotalWithShipping = (paymentMethod?: string) => {
    const shippingCost = getShippingCharge(paymentMethod);
    return totalPrice + shippingCost;
  };
  const getShippingCharge = (paymentMethod?: string) => {
    // Free shipping for JazzCash, EasyPaisa, and Bank Account
    if (
      paymentMethod === "jazzcash" ||
      paymentMethod === "easypaisa" ||
      paymentMethod === "bank_account"
    ) {
      return 0;
    }
    return shippingDetails.shippingCharge;
  };

  const value = {
    items,
    totalItems,
    totalPrice,
    shippingDetails,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartTotalWithShipping,
    getShippingCharge,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
