"use client";

import Link from "next/link";

export default function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {

  // DO NOT RENDER ANYTHING
  // WHEN SIDEBAR IS CLOSED
  if (!open) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl z-50 p-6 overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

          <h2 className="text-2xl font-bold text-[#5f2c17]">
            Admin Panel
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-black"
          >
            ×
          </button>

        </div>

        {/* LINKS */}
        <div className="flex flex-col gap-4">

          <Link
            href="/admin"
            onClick={onClose}
            className="hover:text-[#5f2c17]"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            onClick={onClose}
            className="hover:text-[#5f2c17]"
          >
            Products
          </Link>

          <Link
            href="/admin/announcements"
            onClick={onClose}
            className="hover:text-[#5f2c17]"
          >
            Announcements
          </Link>

          <Link
            href="/admin/about"
            onClick={onClose}
            className="hover:text-[#5f2c17]"
          >
            Edit About
          </Link>

          <Link
            href="/admin/contact"
            onClick={onClose}
            className="hover:text-[#5f2c17]"
          >
            Edit Contact
          </Link>

        </div>

      </aside>
    </>
  );
}