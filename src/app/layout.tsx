import type {Metadata} from 'next';
import './globals.css';
import {Navigation} from '@/components/Navigation';
import {Footer} from '@/components/Footer';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'DeutschCV | ATS-Optimized Germany CV Builder',
  description: 'Create professional, ATS-optimized CVs for the German job market with our guide, templates, and AI-powered builder.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
