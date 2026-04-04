import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import RootLayoutClient from './layout-client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextGen Coders',
  description: 'Master programming with comprehensive courses in Python, Java, C++, React, and more. Build your coding career with expert guidance.',
  openGraph: {
    title: 'NextGen Coders',
    description: 'Master programming with comprehensive courses in Python, Java, C++, React, and more. Build your coding career with expert guidance.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://skillhubnepal.com.np/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1522202176988-66273c2fd55f%3Fq%3D80%26w%3D2071%26auto%3Dformat%26fit%3Dcrop&w=1200&q=75',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
