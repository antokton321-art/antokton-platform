"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState<string>('light');

  // Load theme preference from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setTheme(stored);
  }, []);

  // Apply theme class to <html> element and persist preference
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A1022] text-gray-900 dark:text-gray-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Antokton" className="h-8 w-auto" />
          <span className="text-base font-semibold">Antokton</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/app" className="hover:underline">Modulet</Link>
          <Link href="/app/feed" className="hover:underline">Njoftime</Link>
          <Link href="/about" className="hover:underline">Rreth</Link>
          <Link href="/contact" className="hover:underline">Kontakt</Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-md border px-2 py-1 text-xs"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
    </header>
  );
}