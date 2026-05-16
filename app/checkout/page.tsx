"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type PaymentMethod = "gcash" | "maya" | "card";

const SHIPPING_FEE = 99;

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();

  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

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

  const subtotal = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const shippingFee = SHIPPING_FEE;
  const finalTotal = subtotal + shippingFee;

  const startPayMongoCheckout = async (
    orderId: string | undefined,
    email: string | null
  ) => {
    const response = await fetch("/api/paymongo/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        customer: {
          name,
          email,
          phone,
          address,
        },
        paymentMethod,
        items: cart.map((item: any) => ({
          name: item.name,
          amount: Number(item.price),
          quantity: Number(item.quantity),
        })),
        shippingFee,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      alert(payload.error || "Unable to start payment.");
      return;
    }

    window.location.href = payload.checkoutUrl;
  };

  const handleCheckout = async () => {
    if (!name || !phone || !address) {
      alert("Please complete all fields.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

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
        shipping_method: "Standard Shipping",
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

      if (error?.message.includes("customer_email") && email) {
        const fallback = await supabase
          .from("orders")
          .insert([order])
          .select();

        if (fallback.error) {
          console.error("Order insert error:", fallback.error);
          alert("Failed to save order");
          return;
        }

        await startPayMongoCheckout(fallback.data?.[0]?.id, email);
        return;
      }

      if (error) {
        console.error("Order insert error:", error);
        alert("Failed to save order");
        return;
      }

      await startPayMongoCheckout(data?.[0]?.id, email);
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-gray-500">Checking your account...</p>
      </main>
    );
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <div className="space-y-5">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full border rounded-xl px-4 py-4"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full border rounded-xl px-4 py-4"
        />

        <textarea
          placeholder="Complete Address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="w-full border rounded-xl px-4 py-4 h-32"
        />

        <select
          value={paymentMethod}
          onChange={(event) =>
            setPaymentMethod(event.target.value as PaymentMethod)
          }
          className="w-full border rounded-xl px-4 py-4"
        >
          <option value="gcash">GCash</option>
          <option value="maya">Maya</option>
          <option value="card">Visa / Mastercard</option>
        </select>

        <div className="rounded-xl border bg-white px-4 py-4 text-black">
          <p className="text-sm text-gray-500">Shipping</p>
          <p className="font-medium">Standard Shipping - PHP {SHIPPING_FEE}</p>
        </div>
      </div>

      <div className="bg-[#eef5ef] rounded-3xl p-6">
        <h2 className="text-2xl font-semibold text-[#5f2c17] mb-6">
          Order Summary
        </h2>

        <div className="space-y-3">
          {cart.map((item: any, index: number) => (
            <div key={index} className="flex justify-between">
              <div>
                <p>{item.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <p>PHP {item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className="border-t mt-6 pt-6 space-y-2 text-black">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>PHP {subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>PHP {shippingFee}</span>
          </div>

          <div className="flex justify-between font-bold text-[#5f2c17]">
            <span>Total</span>
            <span>PHP {finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={placingOrder || cart.length === 0}
          className="w-full mt-6 bg-[#5f2c17] text-white py-4 rounded-xl disabled:bg-gray-400"
        >
          {placingOrder ? "Opening PayMongo..." : "Pay with PayMongo"}
        </button>
      </div>
    </main>
  );
}
