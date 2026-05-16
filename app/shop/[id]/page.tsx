import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("LOOKING FOR PRODUCT ID:", id);

  // 🚨 guard clause first
  if (!id) return notFound();

  // ✅ SINGLE CLEAN QUERY
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // 🔍 debug logs
  console.log("PRODUCT:", product);
  console.log("ERROR:", error);

  // 🚨 handle DB errors
  if (error) {
    console.error("Supabase error:", error);
    return notFound();
  }

  // 🚨 handle missing product
  if (!product) {
    return notFound();
  }

  return <ProductClient product={product} />;
}