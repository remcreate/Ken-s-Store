"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function AdminAnnouncementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Failed to load announcements.");
      setLoading(false);
      return;
    }

    setAnnouncements(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const addAnnouncement = async () => {
    if (!title.trim()) {
      alert("Please enter an announcement title.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("announcements").insert({
      title,
      description,
      button_text: buttonText,
      button_link: buttonLink,
      image_url: imageUrl,
      is_active: true,
    });

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Failed to add announcement.");
      return;
    }

    setTitle("");
    setDescription("");
    setButtonText("");
    setButtonLink("");
    setImageUrl("");

    fetchAnnouncements();
  };

  const toggleActive = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from("announcements")
      .update({
        is_active: !currentValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to update announcement.");
      return;
    }

    fetchAnnouncements();
  };

  const deleteAnnouncement = async (id: string) => {
    const confirmDelete = confirm("Delete this announcement?");

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete announcement.");
      return;
    }

    fetchAnnouncements();
  };

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#5f2c17] md:text-4xl">
            Announcements
          </h1>
          <p className="mt-2 text-gray-500">
            Add promos and messages shown below the homepage hero section.
          </p>
        </div>

        <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-[#5f2c17]">
            Add Announcement
          </h2>

          <div className="grid gap-5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Promo title"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Promo description"
              rows={4}
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
            />

            <input
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Button text, example: Shop Now"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
            />

            <input
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="Button link, example: /products"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
            />

            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-[#5f2c17]"
            />
          </div>

          <button
            onClick={addAnnouncement}
            disabled={saving}
            className="mt-6 rounded-2xl bg-[#5f2c17] px-6 py-3 text-white transition hover:bg-[#3f1d10] disabled:opacity-60"
          >
            {saving ? "Saving..." : "+ Add Announcement"}
          </button>
        </section>

        <section className="rounded-3xl bg-white shadow-sm">
          {loading ? (
            <p className="p-6 text-gray-500">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="p-6 text-gray-500">No announcements yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#eef5ef]">
                  <tr className="text-left text-[#5f2c17]">
                    <th className="p-4">Announcement</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {announcements.map((announcement) => (
                    <tr key={announcement.id} className="border-t">
                      <td className="p-4">
                        <div className="flex min-w-[280px] items-center gap-4">
                          {announcement.image_url && (
                            <img
                              src={announcement.image_url}
                              alt={announcement.title}
                              className="h-16 w-16 rounded-xl object-cover bg-[#eef5ef]"
                            />
                          )}

                          <div>
                            <p className="font-medium text-black">
                              {announcement.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {announcement.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {announcement.is_active ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                            HIDDEN
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-3 md:flex-row">
                          <button
                            onClick={() =>
                              toggleActive(
                                announcement.id,
                                announcement.is_active
                              )
                            }
                            className="rounded-xl bg-[#eef5ef] px-4 py-2 text-[#5f2c17] transition hover:bg-[#dce8dd]"
                          >
                            {announcement.is_active ? "Hide" : "Show"}
                          </button>

                          <button
                            onClick={() => deleteAnnouncement(announcement.id)}
                            className="rounded-xl bg-red-100 px-4 py-2 text-red-600 transition hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}