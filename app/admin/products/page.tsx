"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminProductsPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // SIDEBAR
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // FETCH PRODUCTS
  const fetchProducts = async () => {

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // DELETE PRODUCT
  const deleteProduct = async (
    id: string
  ) => {

    const confirmDelete = confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);

      alert(
        "Failed to delete product"
      );

      return;
    }

    fetchProducts();
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8]">
      {/* SIDEBAR */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* CONTENT */}
      <div className="p-4 md:p-6">

        {/* TOP BAR */}
        <div className="flex items-center gap-4 mb-6">

          {/* MENU BUTTON */}
          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="bg-[#5f2c17] text-white px-4 py-2 rounded-xl hover:bg-[#3f1d10] transition"
          >
            ☰ Menu
          </button>

        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#5f2c17]">
              Products
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your store products
            </p>

          </div>

          <Link href="/admin/products/add">

            <button className="bg-[#5f2c17] text-white px-5 py-3 rounded-2xl hover:bg-[#3f1d10] transition w-full md:w-auto">
              + Add Product
            </button>

          </Link>

        </div>

        {/* TABLE */}
        <div className="mt-10 bg-white rounded-3xl shadow-sm overflow-hidden">

          {loading ? (

            <p className="p-6 text-gray-500">
              Loading products...
            </p>

          ) : products.length === 0 ? (

            <p className="p-6 text-gray-500">
              No products found.
            </p>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-[#eef5ef]">

                  <tr className="text-left text-[#5f2c17]">

                    <th className="p-4">
                      Product
                    </th>

                    <th className="p-4">
                      Type
                    </th>

                    <th className="p-4">
                      Category
                    </th>

                    <th className="p-4">
                      Price
                    </th>

                    <th className="p-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map(
                    (product) => (

                      <tr
                        key={product.id}
                        className="border-t"
                      >

                        {/* PRODUCT */}
                        <td className="p-4">

                          <div className="flex items-center gap-4 min-w-[250px]">

                            <img
                              src={
                                product.main_image ||
                                product.images?.[0] ||
                                product.preview_images?.[0] ||
                                "/placeholder.png"
                              }
                              alt={
                                product.name
                              }
                              className="w-16 h-16 rounded-xl object-cover bg-[#eef5ef]"
                            />

                            <div>

                              <p className="font-medium text-black">
                                {
                                  product.name
                                }
                              </p>

                              <p className="text-sm text-gray-400 break-all">
                                {
                                  product.id
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* TYPE */}
                        <td className="p-4">

                          {product.product_type ===
                          "digital" ? (

                            <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                              DIGITAL
                            </span>

                          ) : (

                            <span className="bg-[#eef5ef] text-[#5f2c17] text-xs px-3 py-1 rounded-full">
                              PHYSICAL
                            </span>

                          )}

                        </td>

                        {/* CATEGORY */}
                        <td className="p-4 text-gray-600">
                          {
                            product.category
                          }
                        </td>

                        {/* PRICE */}
                        <td className="p-4 font-medium text-black whitespace-nowrap">
                          ₱
                          {product.price}
                        </td>

                        {/* ACTIONS */}
                        <td className="p-4">

                          <div className="flex flex-col md:flex-row gap-3">

                            <button className="px-4 py-2 rounded-xl bg-[#eef5ef] text-[#5f2c17] hover:bg-[#dce8dd] transition">
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteProduct(
                                  product.id
                                )
                              }
                              className="px-4 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}
