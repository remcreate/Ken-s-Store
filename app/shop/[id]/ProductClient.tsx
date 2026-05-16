"use client";

import { useCart } from "@/context/CartContext";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ProductClient({ product }: any) {
  const { addToCart } = useCart();
  const router = useRouter();

  // ✅ SAFE IMAGES
  const images = useMemo(() => {
    const regularImages = Array.isArray(product.images)
      ? product.images
      : [];

    const previewImages = Array.isArray(
      product.preview_images
    )
      ? product.preview_images
      : [];

    return [...regularImages, ...previewImages];
  }, [product.images, product.preview_images]);

  const mainImage =
    product.main_image ||
    images[0] ||
    "/placeholder.png";

  const [selectedImage, setSelectedImage] =
    useState(mainImage);

  // ✅ SAFE VARIATIONS
  const variations = useMemo(() => {
    if (!product.variations) return [];

    if (
      Array.isArray(product.variations) &&
      typeof product.variations[0] === "string"
    ) {
      return product.variations.map(
        (v: string) => ({
          name: v,
          price: 0,
        })
      );
    }

    if (Array.isArray(product.variations)) {
      return product.variations;
    }

    return [];
  }, [product.variations]);

  const [selectedVariation, setSelectedVariation] =
    useState(variations[0]?.name || "");

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push(
        `/sign-in?next=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    addToCart({
      ...product,
      quantity:
        product.product_type ===
        "digital"
          ? 1
          : quantity,
      variation: selectedVariation,
    });

    alert("Added to cart!");
  };

  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">

      <div className="grid md:grid-cols-2 gap-12">

        {/* LEFT SIDE */}
        <div>

          {/* MAIN IMAGE */}
          <div className="aspect-square bg-[#eef5ef] rounded-3xl overflow-hidden relative">

            {/* DIGITAL WATERMARK */}
            {product.product_type === "digital" && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <span className="text-white text-4xl font-bold opacity-20 rotate-[-20deg]">
                  PREVIEW ONLY
                </span>
              </div>
            )}

            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />

          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-4 flex-wrap">

            {images.map(
              (img: string, index: number) => (
                <button
                  key={index}
                  onClick={() =>
                    setSelectedImage(img)
                  }
                  className={`border rounded-xl overflow-hidden w-16 h-16 ${
                    selectedImage === img
                      ? "border-[#5f2c17]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                  />
                </button>
              )
            )}

          </div>

        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-center">

          {/* DIGITAL LABEL */}
          {product.product_type === "digital" && (
            <div className="mb-4">
              <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                DIGITAL PRODUCT
              </span>
            </div>
          )}

          <h1 className="text-4xl font-bold text-black">
            {product.name}
          </h1>

          <p className="text-2xl mt-4 text-black">
            ₱{product.price}
          </p>

          <p className="mt-6 text-gray-600">
            {product.description}
          </p>

          {/* DIGITAL INFO */}
          {product.product_type === "digital" && (
            <div className="mt-6 bg-[#eef5ef] p-4 rounded-2xl text-sm text-gray-700">

              <p>
                ✔ Instant digital access after payment
              </p>

              <p>
                ✔ Download link expires after{" "}
                {product.download_expiry_hours ||
                  24}{" "}
                hours
              </p>

              <p>
                ✔ Download available{" "}
                {product.download_limit || 1}{" "}
                time(s)
              </p>

            </div>
          )}

          {/* VARIATIONS */}
          {variations.length > 0 && (
            <div className="mt-6 text-black">

              <p className="mb-2 text-sm">
                Choose Variation
              </p>

              <select
                value={selectedVariation}
                onChange={(e) =>
                  setSelectedVariation(
                    e.target.value
                  )
                }
                className="border rounded-xl px-4 py-3 w-full"
              >
                {variations.map(
                  (v: any, index: number) => (
                    <option
                      key={index}
                      value={v.name}
                    >
                      {v.name}
                      {v.price
                        ? ` (+₱${v.price})`
                        : ""}
                    </option>
                  )
                )}
              </select>

            </div>
          )}

          {/* QUANTITY */}
          {product.product_type !== "digital" && (
            <div className="mt-6 text-black">

              <p className="mb-1 text-sm">
                Quantity
              </p>

              <div className="flex items-center gap-6">

                <button
                  onClick={() =>
                    setQuantity((p) =>
                      p > 1 ? p - 1 : 1
                    )
                  }
                  className="w-8 h-8 bg-black text-white rounded"
                >
                  -
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() =>
                    setQuantity((p) => p + 1)
                  }
                  className="w-8 h-8 bg-black text-white rounded"
                >
                  +
                </button>

              </div>

            </div>
          )}

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="mt-8 bg-black text-white py-3 rounded-full hover:bg-[#5f2c17]"
          >
            Add to Cart
          </button>

        </div>
      </div>
    </main>
  );
}
