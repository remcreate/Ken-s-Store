"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/auth";

export default function SignInPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"sign-in" | "sign-up" | "reset">(
    "sign-in"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [nextPath, setNextPath] = useState("/account");
  const [canUpdatePassword, setCanUpdatePassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") || "/account");

    supabase.auth.getSession().then(({ data }) => {
      if (data.session && window.location.hash.includes("type=recovery")) {
        setCanUpdatePassword(true);
        setMode("reset");
        setMessage("Enter your new password.");
      }
    });
  }, []);

  const submit = async () => {
    if (mode === "reset") {
      if (canUpdatePassword) {
        await updatePassword();
      } else {
        await sendResetEmail();
      }
      return;
    }

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    const result =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      setPassword("");
      return;
    }

    if (mode === "sign-up" && !result.data.session) {
      setMessage("Check your email to confirm your account, then sign in.");
      return;
    }

    if (isAdminEmail(result.data.user?.email)) {
      router.push("/admin/products");
      return;
    }

    router.push(nextPath);
  };

  const sendResetEmail = async () => {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/sign-in`,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password reset link sent. Check your email.");
  };

  const updatePassword = async () => {
    if (!password || password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password updated. You can continue to your account.");
    setCanUpdatePassword(false);
    setMode("sign-in");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-16">
      <section className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-[#5f2c17]">
            {mode === "reset"
              ? "Reset password"
              : mode === "sign-in"
                ? "Sign in"
                : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {mode === "reset"
              ? canUpdatePassword
                ? "Choose a new password for your account."
                : "Enter your email and we will send a password reset link."
              : "Use one login for your account, purchases, and admin access."}
          </p>
        </div>

        <div className="space-y-4">
          {!canUpdatePassword && (
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
              placeholder="Email"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#5f2c17]"
            />
          )}

          {(mode !== "reset" || canUpdatePassword) && (
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
              placeholder={canUpdatePassword ? "New password" : "Password"}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#5f2c17]"
            />
          )}

          {canUpdatePassword && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#5f2c17]"
            />
          )}

          {message && (
            <p className="rounded-xl bg-[#eef5ef] px-4 py-3 text-sm text-[#5f2c17]">
              {message}
            </p>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-xl bg-[#5f2c17] px-4 py-3 text-white transition hover:bg-[#3f1d10] disabled:bg-gray-400"
          >
            {loading
              ? "Please wait..."
              : mode === "reset"
                ? canUpdatePassword
                  ? "Update password"
                  : "Send reset link"
                : mode === "sign-in"
                  ? "Sign in"
                  : "Create account"}
          </button>

          <div className="space-y-2">
            {mode === "sign-in" && (
              <button
                onClick={() => {
                  setMode("reset");
                  setMessage("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#5f2c17] transition hover:bg-[#eef5ef]"
              >
                Forgot password?
              </button>
            )}

            <button
              onClick={() => {
                setMode(mode === "sign-up" ? "sign-in" : "sign-up");
                setMessage("");
                setPassword("");
                setConfirmPassword("");
                setCanUpdatePassword(false);
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[#5f2c17] transition hover:bg-[#eef5ef]"
            >
              {mode === "sign-up"
                ? "I already have an account"
                : "Create a customer account"}
            </button>

            {mode === "reset" && (
              <button
                onClick={() => {
                  setMode("sign-in");
                  setMessage("");
                  setPassword("");
                  setConfirmPassword("");
                  setCanUpdatePassword(false);
                }}
                className="w-full px-4 py-2 text-sm text-gray-500 transition hover:text-[#5f2c17]"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
