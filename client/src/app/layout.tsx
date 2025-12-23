import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'SV University MCA Alumni Portal',
    template: '%s | SVU MCA Alumni',
  },
  description:
    'Connect with SVU MCA Alumni and Students. Join the network for mentorship, job opportunities, events, and professional growth.',
  keywords: [
    'SVU MCA',
    'Sri Venkateswara University',
    'Alumni Portal',
    'MCA Alumni',
    'Student Networking',
    'Job Board',
    'Mentorship',
  ],
  authors: [{ name: 'SVU MCA Department' }],
  creator: 'SVU MCA Department',
  publisher: 'SV University',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'SV University MCA Alumni Portal',
    description:
      'Connect with SVU MCA Alumni and Students. Join the network for mentorship, job opportunities, events, and professional growth.',
    siteName: 'SVU MCA Alumni Portal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SV University MCA Alumni Portal',
    description:
      'Connect with SVU MCA Alumni and Students. Networking, Mentorship, and Jobs.',
    creator: '@svu_mca',
  },
  icons: {
    icon: '/icon.png', // Next.js will resolve this from app/icon.png
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
