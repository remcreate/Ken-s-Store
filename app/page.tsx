import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-[#4f6a54]">
        
        <h1 className={`text-4xl md:text-6xl tracking-tight text-white ${fraunces.className}`}>
          ITSGRATEFULLIVING
        </h1>

        <p className="mt-6 text-white md:text-lg text-base leading-relaxed max-w-xl max-auto">
          family life | homeschooling | arts and crafts
        </p>

        <a
          href="/shop"
          className="mt-8 px-6 py-3  flex items-center justify-center rounded-full bg-[#5f2c17] text-white hover:bg-gray-800 transition"
        >
          Shop Now
        </a>
      </section>

      {/*ABOUT INFO*/}
    </main>
  );
}