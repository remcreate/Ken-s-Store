"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-16">
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-[#5f2c17]">
          Payment received
        </h1>
        <p className="mt-3 text-gray-500">
          Thank you. Your order has been submitted and payment was completed
          through PayMongo.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-block rounded-xl bg-[#5f2c17] px-5 py-3 text-white"
        >
          View account
        </Link>
      </section>
    </main>
  );
}
