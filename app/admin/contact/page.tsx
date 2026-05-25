"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminContactPage() {
  const [id, setId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchContact() {
      const { data, error } = await supabase
        .from("contact_page")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error(error);
      }

      if (data) {
        setId(data.id);
        setEmail(data.email || "");
        setContactNumber(data.contact_number || "");
        setInstagramUrl(data.instagram_url || "");
        setFacebookUrl(data.facebook_url || "");
      }

      setLoading(false);
    }

    fetchContact();
  }, []);

  async function handleSave() {
    if (!id) return;

    setSaving(true);

    const { error } = await supabase
      .from("contact_page")
      .update({
        email,
        contact_number: contactNumber,
        instagram_url: instagramUrl,
        facebook_url: facebookUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Failed to save Contact page.");
      return;
    }

    alert("Contact page saved!");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f3ef] p-6">
        <p className="text-[#5f2c17]">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ef] p-6">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold text-[#5f2c17]">
          Edit Contact Page
        </h1>

        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Contact Number
            </label>
            <input
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
              placeholder="+63 900 000 0000"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Instagram Link
            </label>
            <input
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
              placeholder="https://www.instagram.com/yourusername"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Facebook Link
            </label>
            <input
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
              placeholder="https://www.facebook.com/yourpage"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 rounded-md bg-[#5f2c17] px-6 py-3 text-white hover:bg-[#4a2111] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Contact"}
        </button>
      </div>
    </main>
  );
}