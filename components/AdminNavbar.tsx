"use client";

type Props = {
  onMenuClick: () => void;
};

export default function AdminNavbar({
  onMenuClick,
}: Props) {

  return (
    <header className="w-full h-[70px] bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        {/* MENU BUTTON */}
        <button
          onClick={onMenuClick}
          className="w-10 h-10 rounded-xl bg-[#5f2c17] text-white flex items-center justify-center hover:bg-[#3f1d10] transition"
        >
          ☰
        </button>

        <h1 className="text-2xl font-bold text-[#5f2c17]">
          Admin Panel
        </h1>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <button className="text-sm text-gray-500 hover:text-black">
          Logout
        </button>

      </div>

    </header>
  );
}