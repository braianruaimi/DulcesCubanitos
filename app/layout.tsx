import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { ServiceWorkerRegister } from '@/components/service-worker-register';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cubanitos Dulces | Dark Sugar Neon',
  description: 'PWA de venta inmersiva para Cubanitos Dulces con experiencia neon, carrito integrado y reservas rápidas.',
  manifest: '/manifest.json',
  applicationName: 'Cubanitos Dulces',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cubanitos Dulces',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-512.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icons/icon-192.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
