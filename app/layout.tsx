import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tamiti Lanes - Smart Day Planner',
  description: 'Your smart day planner that keeps work and life in harmony',
  keywords: ['productivity', 'planning', 'scheduling', 'time management', 'work-life balance'],
  authors: [{ name: 'Tamiti Lanes Team' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0A2A6B' },
    { media: '(prefers-color-scheme: dark)', color: '#0A2A6B' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}