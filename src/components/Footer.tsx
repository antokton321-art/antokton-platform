export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A1022]">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Antokton. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  );
}