"use client";

import { useState } from "react";

export default function AdminAboutPage() {
  const [aboutText, setAboutText] = useState("");

  const handleSave = () => {
    console.log("Saved about:", aboutText);
    alert("About page saved!");
  };

  return (
    <main className="min-h-screen bg-[#f8f3ef] p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-[#5f2c17] mb-6">
          Edit About Page
        </h1>

        <label className="block mb-2 font-semibold text-gray-700">
          About Content
        </label>

        <textarea
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          rows={10}
          className="w-full border border-gray-300 rounded-md p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
          placeholder="Write your about page content here..."
        />

        <button
          onClick={handleSave}
          className="mt-6 bg-[#5f2c17] text-white px-6 py-3 rounded-md hover:bg-[#4a2111]"
        >
          Save About
        </button>
      </div>
    </main>
  );
}