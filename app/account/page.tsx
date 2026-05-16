"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Order = {
  id: string;
  items: any[];
  total: number;
  status: string;
  payment_status?: string;
  ordered_at?: string;
  created_at?: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersUnavailable, setOrdersUnavailable] = useState(false);

  useEffect(() => {
    const loadAccount = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/sign-in?next=/account");
        return;
      }

      setEmail(userData.user.email || "");

      const { data, error } = await supabase
        .from("orders")
        .select("id, items, total, status, payment_status, ordered_at, created_at")
        .eq("customer_email", userData.user.email)
        .order("ordered_at", { ascending: false });

      if (error) {
        console.error("Account orders unavailable:", error);
        setOrdersUnavailable(true);
      } else {
        setOrders((data as Order[]) || []);
      }

      setLoading(false);
    };

    loadAccount();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[#5f2c17]">
              My Account
            </h1>
            <p className="mt-2 text-gray-500">{email}</p>
          </div>

          <button
            onClick={signOut}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#5f2c17] transition hover:bg-white md:w-auto"
          >
            Sign out
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#5f2c17]">
            Orders and purchases
          </h2>

          {loading ? (
            <p className="mt-4 text-gray-500">Loading your orders...</p>
          ) : ordersUnavailable ? (
            <div className="mt-4 rounded-xl bg-[#eef5ef] p-4 text-sm text-[#5f2c17]">
              Your account is working. To show order history here, add a
              customer_email column to the orders table and save that email at
              checkout.
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-4 rounded-xl bg-[#eef5ef] p-4">
              <p className="text-[#5f2c17]">No orders yet.</p>
              <Link
                href="/shop"
                className="mt-3 inline-block rounded-xl bg-[#5f2c17] px-4 py-2 text-white"
              >
                Shop now
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-medium text-black">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(
                          order.ordered_at || order.created_at || ""
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-semibold text-[#5f2c17]">
                        PHP {Number(order.total || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.status} -{" "}
                        {order.payment_status || "Payment pending"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    {(order.items || []).map((item, index) => (
                      <div
                        key={`${order.id}-${index}`}
                        className="flex justify-between gap-4"
                      >
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>PHP {Number(item.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
