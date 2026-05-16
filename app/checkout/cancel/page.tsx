import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-16">
      <section className="mx-auto max-w-xl rounded-2xl bg-white p-6 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-[#5f2c17]">
          Payment canceled
        </h1>
        <p className="mt-3 text-gray-500">
          Your cart is still saved. You can return to checkout when you are
          ready.
        </p>
        <Link
          href="/checkout"
          className="mt-6 inline-block rounded-xl bg-[#5f2c17] px-5 py-3 text-white"
        >
          Back to checkout
        </Link>
      </section>
    </main>
  );
}
