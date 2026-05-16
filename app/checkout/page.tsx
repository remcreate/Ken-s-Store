"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { calculatePaymentFee, PaymentMethod } from "@/lib/paymentFees";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const shippingOptions = [
    { name: "Store Pickup", fee: 0 },
    { name: "Cavite Delivery", fee: 50 },
    { name: "Metro Manila", fee: 120 },
    { name: "Provincial Shipping", fee: 180 },
  ];

  const [selectedShipping, setSelectedShipping] = useState(
    shippingOptions[0]
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("gcash");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/sign-in?next=/checkout");
        return;
      }

      setCustomerEmail(data.user.email ?? null);
      setCheckingSession(false);
    };

    checkSession();
  }, [router]);

  // TOTALS
  const subtotal = cart.reduce(
    (sum: number, item: any) =>
      sum + item.price * item.quantity,
    0
  );

  const shippingFee = selectedShipping.fee;
  const baseTotal = subtotal + shippingFee;

  const paymentFee = calculatePaymentFee(
    baseTotal,
    paymentMethod
  );

  const finalTotal = baseTotal + paymentFee;

  // PLACE ORDER
  const handleCheckout = async () => {
    if (!name || !phone || !address) {
      alert("Please complete all fields.");
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/sign-in?next=/checkout");
        return;
      }

      const email = userData.user.email ?? customerEmail;

      const order = {
        customer_name: name,
        phone,
        address,

        payment_method: paymentMethod,
        shipping_method: selectedShipping.name,

        items: cart,

        subtotal,
        shipping_fee: shippingFee,
        total: finalTotal,

        status: "Pending",
        payment_status: "Pending",

        ordered_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("orders")
        .insert([
          email
            ? {
                ...order,
                customer_email: email,
              }
            : order,
        ])
        .select();

      if (
        error?.message.includes("customer_email") &&
        email
      ) {
        const fallback = await supabase
          .from("orders")
          .insert([order])
          .select();

        if (fallback.error) {
          console.error("Order insert error:", fallback.error);
          alert("Failed to save order");
          return;
        }

        console.log("Order saved:", fallback.data);
        alert("Order placed successfully!");
        clearCart();
        return;
      }

      if (error) {
        console.error("Order insert error:", error);
        alert("Failed to save order");
        return;
      }

      console.log("Order saved:", data);

      alert("Order placed successfully!");

      clearCart();
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred");
    }
  };

  return (
    checkingSession ? (
      <main className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-gray-500">Checking your account...</p>
      </main>
    ) : (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">

      {/* LEFT SIDE */}
      <div className="space-y-5">

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-xl px-4 py-4"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-xl px-4 py-4"
        />

        <textarea
          placeholder="Complete Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border rounded-xl px-4 py-4 h-32"
        />

        {/* PAYMENT */}
        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value as PaymentMethod)
          }
          className="w-full border rounded-xl px-4 py-4"
        >
          <option value="gcash">GCash</option>
          <option value="maya">Maya</option>
          <option value="card">Visa / Mastercard</option>
        </select>

        {/* SHIPPING */}
        <select
          value={selectedShipping.name}
          onChange={(e) => {
            const ship = shippingOptions.find(
              (o) => o.name === e.target.value
            );
            if (ship) setSelectedShipping(ship);
          }}
          className="w-full border rounded-xl px-4 py-4"
        >
          {shippingOptions.map((option) => (
            <option key={option.name} value={option.name}>
              {option.name} — ₱{option.fee}
            </option>
          ))}
        </select>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-[#eef5ef] rounded-3xl p-6">

        <h2 className="text-2xl font-semibold text-[#5f2c17] mb-6">
          Order Summary
        </h2>

        <div className="space-y-3">
          {cart.map((item: any, index: number) => (
            <div
              key={index}
              className="flex justify-between"
            >
              <div>
                <p>{item.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <p>
                ₱{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* TOTALS */}
        <div className="border-t mt-6 pt-6 space-y-2 text-black">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₱{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₱{shippingFee}</span>
          </div>

          <div className="flex justify-between font-bold text-[#5f2c17]">
            <span>Total</span>
            <span>₱{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full mt-6 bg-[#5f2c17] text-white py-4 rounded-xl"
        >
          Place Order
        </button>
      </div>
    </main>
    )
  );
}
