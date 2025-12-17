import Link from 'next/link';

type Module = {
  title: string;
  description: string;
  href: string;
};

const modules: Module[] = [
  {
    title: 'Punë në Europë',
    description: 'Njoftime pune dhe shërbime komunitare',
    href: '/app/feed?type=pune'
  },
  {
    title: 'Shtëpi me qira',
    description: 'Kërko ose ofro strehim',
    href: '/app/feed?type=shtepi'
  },
  {
    title: 'Ndihmë juridike',
    description: 'Orientim bazë dhe njoftime për ndihmë juridike',
    href: '/app/feed?type=juridike'
  },
  {
    title: 'Edukim',
    description: 'Kurset dhe mësimet e Antokton',
    href: '/app/feed?type=edukim'
  },
  {
    title: 'Bamirësi',
    description: 'Thirrje për bamirësi dhe fitra',
    href: '/app/feed?type=bamiresi'
  },
  {
    title: 'Media',
    description: 'Video, artikuj dhe media të dobishme',
    href: '/app/feed?type=media'
  }
];

export default function ModuleGrid() {
  return (
    <section className="bg-white py-12 dark:bg-[#0D1932]">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Modulet
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Zgjidh një modul për të parë përshkrimin dhe funksionet.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-[#102141]"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {m.title}
              </h3>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                {m.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}