"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // ✅ categories
  const categories = [
    "All",
    ...Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    ),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) => p.category === selectedCategory
        );

  if (loading)
    return (
      <p className="text-center py-10">
        Loading...
      </p>
    );

  return (
    <main className="px-6 py-12 max-w-6xl mx-auto bg-white min-h-screen">

      <h1 className="text-4xl font-bold mb-10 text-[#5f2c17] text-center">
        AVAILABLE PRODUCTS
      </h1>

      {/* CATEGORY */}
      <div className="flex gap-4 mb-10 flex-wrap">

        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category)
            }
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category
                ? "bg-[#5f2c17] text-white"
                : "bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}

      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {filteredProducts.map((product) => {
          if (!product?.id) return null;

          const displayImage =
            product.main_image ||
            product.images?.[0] ||
            product.preview_images?.[0] ||
            "/placeholder.png";

          return (
            <a
              key={product.id}
              href={`/shop/${product.id}`}
            >
              <div className="bg-[#eef5ef] rounded-2xl overflow-hidden relative">

                {/* DIGITAL BADGE */}
                {product.product_type === "digital" && (
                  <div className="absolute top-3 left-3 z-10 bg-black text-white text-xs px-3 py-1 rounded-full">
                    DIGITAL
                  </div>
                )}

                <img
                  src={displayImage}
                  className="w-full h-60 object-cover"
                  alt={product.name}
                />

              </div>

              <div className="mt-3">

                <h2 className="font-semibold text-black">
                  {product.name}
                </h2>

                <p className="text-gray-700">
                  ₱{product.price}
                </p>

              </div>
            </a>
          );
        })}

      </div>
    </main>
  );
}