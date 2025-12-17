import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s – Antokton',
    default: 'Antokton – Platformë Komunitare'
  },
  description: 'Antokton – platformë komunitare për punë, edukim dhe shërbime të dobishme.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-[#0A1022] text-gray-900 dark:text-gray-100">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}