import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AboutPage() {
  const { data } = await supabase
    .from("about_page")
    .select("*")
    .limit(1)
    .single();

  return (
    <main className="min-h-screen bg-[#f8f3ef] px-6 py-16">
      <section className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-bold text-[#5f2c17]">
          {data?.title || "About Us"}
        </h1>

        <p className="whitespace-pre-line text-lg leading-8 text-gray-700">
          {data?.content || "About page content will appear here soon."}
        </p>
      </section>
    </main>
  );
}