"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isAdminEmail(email)) {
      alert("Unauthorized access. Admin only.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      setPassword("");
      return;
    }

    if (!data.session) {
      alert("Login failed. No session created.");
      return;
    }

    router.push("/admin/products");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
      <div className="bg-white p-8 rounded-3xl w-[350px] space-y-4 shadow-sm">
        <h1 className="text-2xl font-bold text-[#5f2c17]">
          Admin Login
        </h1>

        <input
          className="w-full border px-4 py-3 rounded-xl"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleLogin();
          }}
        />

        <input
          className="w-full border px-4 py-3 rounded-xl"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleLogin();
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className={`w-full py-3 rounded-xl text-white transition ${
            loading ? "bg-gray-400" : "bg-[#5f2c17] hover:bg-[#3f1d10]"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-2">
          Admin access only: {ADMIN_EMAIL}
        </p>
      </div>
    </main>
  );
}
