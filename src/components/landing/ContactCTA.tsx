import Link from 'next/link';

export default function ContactCTA() {
  return (
    <section className="bg-gray-50 py-12 dark:bg-[#0A1022]">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-[#102141]">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Na kontaktoni
        </h2>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
          Keni pyetje, sugjerime ose dëshironi të bashkëpunoni? Ne do të donim të dëgjonim nga ju.
        </p>
        <div className="mt-5">
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Kontakto
          </Link>
        </div>
      </div>
    </section>
  );
}