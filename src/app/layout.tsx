import type {Metadata} from 'next';
import './globals.css';
import {Navigation} from '@/components/Navigation';
import {Footer} from '@/components/Footer';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'German CV format | ATS-Optimized Germany CV Builder',
  description:
    'Create ATS-friendly CVs for the German job market with our guide, templates, and step-by-step builder.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
