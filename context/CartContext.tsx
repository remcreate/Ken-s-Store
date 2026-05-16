"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variation?: string;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (item: any) => void;

  removeFromCart: (
    id: string,
    variation?: string
  ) => void;

  updateQuantity: (
    id: string,
    variation: string,
    quantity: number
  ) => void;

  updateVariation: (
  id: string,
  oldVariation: string,
  newVariation: string
) => void;

  clearCart: () => void;
};

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
      const storedCart =
        localStorage.getItem("cart");

      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }, []);

    useEffect(() => {
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );
    }, [cart]);

  // ADD TO CART
  const addToCart = (item: any) => {
    setCart((prev) => {

      const existing = prev.find(
        (i) =>
          i.id === item.id &&
          i.variation === item.variation
      );

      // IF ITEM EXISTS
      if (existing) {
        return prev.map((i) =>
          i.id === item.id &&
          i.variation === item.variation
            ? {
                ...i,
                quantity:
                  i.quantity + item.quantity,
              }
            : i
        );
      }

      // ADD NEW ITEM
      return [...prev, item];
    });
  };

  // REMOVE ITEM
  const removeFromCart = (
    id: string,
    variation?: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            item.variation === variation
          )
      )
    );
  };

  // UPDATE QUANTITY
  const updateQuantity = (
    id: string,
    variation: string,
    quantity: number
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id &&
        item.variation === variation
          ? {
              ...item,
              quantity: Math.max(1, quantity),
            }
          : item
      )
    );
  };
//UPDATE VARIATION
  const updateVariation = (
    id: string,
    oldVariation: string,
    newVariation: string
  ) => {

    setCart((prev) =>
      prev.map((item) =>
        item.id === id &&
        item.variation === oldVariation
          ? {
              ...item,
              variation: newVariation,
            }
          : item
      )
    );
  };
  // CLEAR CART
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        updateVariation,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// CUSTOM HOOK
export function useCart() {

  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}