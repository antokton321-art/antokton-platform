import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0D1932] to-[#0A1022] text-white py-16 md:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-4 md:grid-cols-2 md:gap-16">
        <div>
          <span className="mb-3 inline-block rounded-full border border-blue-300 bg-blue-500/20 px-3 py-1 text-xs uppercase tracking-wider text-blue-200">
            Ekosistemi Antokton
          </span>
          <h1 className="text-4xl font-bold md:text-6xl">Antokton</h1>
          <p className="mt-4 text-base text-gray-200 md:text-lg">
            Platformë komunitare për punë, edukim dhe shërbime të dobishme.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/app/feed"
              className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Punë në Europë
            </Link>
            <Link
              href="/tv-radio"
              className="rounded-lg border border-blue-500 px-5 py-2 text-sm font-medium text-blue-100 hover:bg-blue-50/10"
            >
              Antokton TV & Radio
            </Link>
            <Link
              href="/app"
              className="rounded-lg border border-blue-500 px-5 py-2 text-sm font-medium text-blue-100 hover:bg-blue-50/10"
            >
              Shiko modulet
            </Link>
          </div>
        </div>
        <div className="hidden justify-center md:flex">
          {/* Illustration or image preview placeholder. Replace with actual asset when available. */}
          <div className="h-80 w-80 rounded-2xl bg-blue-800/20" />
        </div>
      </div>
    </section>
  );
}