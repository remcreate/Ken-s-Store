import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default async function AnnouncementSection() {
  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load announcements:", error);
    return null;
  }

  if (!announcements || announcements.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f8f3ef] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-2xl font-bold text-[#5f2c17]">
          Announcements
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              {announcement.image_url && (
                <img
                  src={announcement.image_url}
                  alt={announcement.title}
                  className="mb-4 h-48 w-full rounded-xl object-cover"
                />
              )}

              <h3 className="text-xl font-bold text-[#5f2c17]">
                {announcement.title}
              </h3>

              {announcement.description && (
                <p className="mt-2 text-gray-600">
                  {announcement.description}
                </p>
              )}

              {announcement.button_text && announcement.button_link && (
                <Link
                  href={announcement.button_link}
                  className="mt-5 inline-block rounded-xl bg-[#5f2c17] px-5 py-3 text-white hover:bg-[#3f1d10]"
                >
                  {announcement.button_text}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}