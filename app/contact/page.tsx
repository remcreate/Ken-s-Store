import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ContactPage() {
  const { data } = await supabase
    .from("contact_page")
    .select("*")
    .limit(1)
    .single();

  return (
    <main className="min-h-screen bg-[#f8f3ef] px-6 py-16">
      <section className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-[#5f2c17]">
          Contact Us
        </h1>

        <div className="space-y-5 text-lg text-gray-700">
          <p>
            <span className="font-semibold text-[#5f2c17]">Email:</span>{" "}
            {data?.email ? (
              <a href={`mailto:${data.email}`} className="hover:underline">
                {data.email}
              </a>
            ) : (
              "Not available"
            )}
          </p>

          <p>
            <span className="font-semibold text-[#5f2c17]">
              Contact Number:
            </span>{" "}
            {data?.contact_number || "Not available"}
          </p>

          <p>
            <span className="font-semibold text-[#5f2c17]">Instagram:</span>{" "}
            {data?.instagram_url ? (
              <a
                href={data.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {data.instagram_url}
              </a>
            ) : (
              "Not available"
            )}
          </p>

          <p>
            <span className="font-semibold text-[#5f2c17]">Facebook:</span>{" "}
            {data?.facebook_url ? (
              <a
                href={data.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {data.facebook_url}
              </a>
            ) : (
              "Not available"
            )}
          </p>
        </div>
      </section>
    </main>
  );
}