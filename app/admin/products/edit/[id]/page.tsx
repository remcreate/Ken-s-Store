"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const productId = params.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [productType, setProductType] = useState("physical");
  const [mainImage, setMainImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error(error);
        alert("Failed to load product.");
        setLoading(false);
        return;
      }

      setName(data.name || "");
      setCategory(data.category || "");
      setPrice(data.price?.toString() || "");
      setProductType(data.product_type || "physical");
      setMainImage(data.main_image || "");

      setLoading(false);
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const updateProduct = async () => {
    if (!name || !category || !price) {
      alert("Please complete all required fields.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("products")
      .update({
        name,
        category,
        price: Number(price),
        product_type: productType,
        main_image: mainImage,
      })
      .eq("id", productId);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Failed to update product.");
      return;
    }

    alert("Product updated!");
    router.push("/admin/products");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f8f8] p-6">
        <p className="text-gray-500">Loading product...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8]">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl bg-[#5f2c17] px-4 py-2 text-white transition hover:bg-[#3f1d10]"
          >
            ☰ Menu
          </button>
        </div>

        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold text-[#5f2c17]">
            Edit Product
          </h1>

          <p className="mb-8 text-gray-500">
            Update product details shown in your store.
          </p>

          <div className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Product Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
                placeholder="Product name"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Category
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
                placeholder="Category"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Product Type
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
              >
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Main Image URL
              </label>
              <input
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
                placeholder="https://..."
              />
            </div>

            {mainImage && (
              <img
                src={mainImage}
                alt={name}
                className="h-40 w-40 rounded-2xl bg-[#eef5ef] object-cover"
              />
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            <button
              onClick={updateProduct}
              disabled={saving}
              className="rounded-2xl bg-[#5f2c17] px-6 py-3 text-white transition hover:bg-[#3f1d10] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => router.push("/admin/products")}
              className="rounded-2xl bg-gray-100 px-6 py-3 text-gray-700 transition hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}