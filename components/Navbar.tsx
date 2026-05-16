"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { Pacifico } from "next/font/google";
import CartDrawer from "./CartDrawer";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/auth";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

export default function Navbar() {

  const { cart } = useCart();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [cartOpen, setCartOpen] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user.email ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    setOpen(false);
  };

  return (
    <>
      <nav className="w-full border-b border-gray-100 bg-[#eef5ef] px-4 md:px-6 py-4 flex items-center justify-between relative z-50 overflow-hidden">

        {/* LOGO */}
        <div
          className={`text-lg md:text-2xl text-[#5f2c17] truncate ${pacifico.className}`}
        >
          It's Grateful Living
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 text-[#5f2c17] text-sm">

          <a
            href="/"
            className="hover:text-[#1d0200]"
          >
            Home
          </a>

          <a
            href="/about"
            className="hover:text-[#1d0200]"
          >
            About
          </a>

          <Link
            href={userEmail && isAdminEmail(userEmail) ? "/admin/products" : "/account"}
            className="hover:text-[#1d0200]"
          >
            {userEmail && isAdminEmail(userEmail) ? "Admin" : "Account"}
          </Link>

          <a
            href="/shop"
            className="hover:text-[#1d0200]"
          >
            Shop
          </a>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* CART */}
          <button
            onClick={() =>
              setCartOpen(true)
            }
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#5f2c17] text-white hover:bg-gray-800 transition"
          >

            🛒

            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}

          </button>

          {/* SIGN IN */}
          {userEmail ? (
            <button
              onClick={handleSignOut}
              className="hidden md:block px-4 py-2 rounded-full text-black hover:text-[#5f2c17] transition"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="hidden md:block px-4 py-2 rounded-full text-black hover:text-[#5f2c17] transition"
            >
              Sign in
            </Link>
          )}

          {/* HAMBURGER */}
          <button
            onClick={() =>
              setOpen(!open)
            }
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1"
          >

            <span className="w-5 h-[2px] bg-gray-700"></span>
            <span className="w-5 h-[2px] bg-gray-700"></span>
            <span className="w-5 h-[2px] bg-gray-700"></span>

          </button>

        </div>

      </nav>

      {/* MOBILE MENU OVERLAY */}
      {open && (
        <>
          {/* BACKDROP */}
          <div
            onClick={() =>
              setOpen(false)
            }
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
          />

          {/* MENU */}
          <div className="fixed top-0 right-0 h-full w-[260px] bg-white shadow-2xl z-50 md:hidden p-6">

            {/* CLOSE */}
            <div className="flex justify-end">

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="text-3xl text-black"
              >
                ×
              </button>

            </div>

            {/* LINKS */}
            <div className="flex flex-col gap-6 mt-10 text-[#5f2c17] text-lg">

              <a
                href="/"
                onClick={() =>
                  setOpen(false)
                }
              >
                Home
              </a>

              <a
                href="/about"
                onClick={() =>
                  setOpen(false)
                }
              >
                About
              </a>

              <Link
                href={userEmail && isAdminEmail(userEmail) ? "/admin/products" : "/account"}
                onClick={() =>
                  setOpen(false)
                }
              >
                {userEmail && isAdminEmail(userEmail) ? "Admin" : "Account"}
              </Link>

              <a
                href="/shop"
                onClick={() =>
                  setOpen(false)
                }
              >
                Shop
              </a>

              {userEmail ? (
                <button
                  onClick={handleSignOut}
                  className="text-left"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  Sign in
                </Link>
              )}

            </div>

          </div>
        </>
      )}

      {/* CART DRAWER */}
      <CartDrawer
        open={cartOpen}
        onClose={() =>
          setCartOpen(false)
        }
      />
    </>
  );
}
