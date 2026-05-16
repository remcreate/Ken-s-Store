"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {
  const router = useRouter();
  
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateVariation,
  } = useCart();

  // TOTAL PRICE
  const total = cart.reduce(
    (sum: number, item: any) =>
      sum + item.price * item.quantity,
    0
  );

  const goToCheckout = async () => {
    if (cart.length === 0) return;

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      onClose();
      router.push("/sign-in?next=/checkout");
      return;
    }

    onClose();
    router.push("/checkout");
  };

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl z-50 transform transition-transform duration-300
        
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b">

          <h2 className="text-xl font-semibold text-[#5f2c17]">
            Your Cart
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>

        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-white">

          {cart.length === 0 ? (
            <p className="text-gray-400">
              Your cart is empty.
            </p>
          ) : (
            cart.map((item: any, index: number) => (
              <div
                key={index}
                className="flex gap-4 border-b pb-4"
              >

                {/* PRODUCT IMAGE */}
                <img
                  src={item.images?.[0] || item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl bg-[#eef5ef]"
                />

                {/* PRODUCT DETAILS */}
                <div className="flex-1">

                  <h3 className="font-medium text-black">
                    {item.name}
                  </h3>

                  {/* VARIATION */}
                  <select
                    value={item.variation}
                    onChange={(e) =>
                      updateVariation(
                        item.id,
                        item.variation,
                        e.target.value
                      )
                    }
                    className="mt-2 text-xs border rounded-full px-3 py-1 bg-[#eef5ef] text-[#5f2c17]"
                  >

                    {["Small", "Medium", "Large"].map((variation) => (
                      <option
                        key={variation}
                        value={variation}
                      >
                        {variation}
                      </option>
                    ))}

                  </select>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-2 mt-2 text-black">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.variation,
                          item.quantity - 1
                        )
                      }
                      className="w-6 h-6 bg-gray-100 rounded"
                    >
                      -
                    </button>

                    <span className="text-sm">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.variation,
                          item.quantity + 1
                        )
                      }
                      className="w-6 h-6 bg-gray-100 rounded"
                    >
                      +
                    </button>

                  </div>

                  {/* PRICE */}
                  <p className="text-gray-500 text-sm mt-2">
                    Unit Price: ₱{item.price} each
                  </p>

                  {/* ITEM TOTAL */}
                  <p className="font-bold text-[#5f2c17] mt-1">
                    Total: ₱{item.price * item.quantity}
                  </p>
                <button
                  onClick={() =>
                    removeFromCart(item.id, item.variation)
                  }
                  className="text-xs text-red-500 hover:underline mt-2"
                >
                  Remove
                </button>
                </div>

              </div>
            ))
          )}

        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-5 bg-white">

          {/* TOTAL */}
          <div className="flex justify-between items-center mb-4">

            <p className="text-lg font-semibold text-black">
              Total
            </p>

            <p className="text-xl font-bold text-[#5f2c17]">
              ₱{total}
            </p>

          </div>

          {/* CHECKOUT BUTTON */}
          <button
            onClick={goToCheckout}
            disabled={cart.length === 0}
            className="w-full bg-[#5f2c17] text-white py-4 rounded-full hover:bg-[#3f1d10] transition disabled:bg-gray-300"
          >
            Checkout
          </button>

        </div>

      </div>
    </>
  );
}
