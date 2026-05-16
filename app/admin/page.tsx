"use client";

import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  product_type?: string;
  images?: string[];
  preview_images?: string[];
  main_image?: string;
};

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // DELETE PRODUCT
  const deleteProduct = async (id: string) => {
    const confirmDelete = confirm("Delete this product?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete product");
      return;
    }

    fetchProducts();
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8]">

      {/* SIDEBAR */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* NAVBAR */}
      <AdminNavbar
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* CONTENT */}
      <div className="p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <h1 className="text-4xl font-bold text-[#5f2c17]">
              Products
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your store products
            </p>
          </div>

          <Link href="/admin/products/add">
            <button className="bg-[#5f2c17] text-white px-5 py-3 rounded-2xl">
              + Add Product
            </button>
          </Link>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl overflow-hidden">

          {loading ? (
            <p className="p-6 text-gray-500">
              Loading products...
            </p>
          ) : (
            <table className="w-full">

              <thead className="bg-[#eef5ef]">
                <tr className="text-left text-[#5f2c17]">
                  <th className="p-4">Product</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product: Product) => (
                  <tr key={product.id} className="border-t">

                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={
                          product.main_image ||
                          product.images?.[0] ||
                          product.preview_images?.[0] ||
                          "/placeholder.png"
                        }
                        className="w-14 h-14 rounded-xl object-cover"
                      />

                      <div>
                        <p className="font-medium">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {product.id}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      {product.product_type === "digital" ? (
                        <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                          DIGITAL
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-black text-xs px-3 py-1 rounded-full">
                          PHYSICAL
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-gray-600">
                      {product.category}
                    </td>

                    <td className="p-4">
                      ₱{product.price}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-xl"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>

      </div>
    </main>
  );
}
