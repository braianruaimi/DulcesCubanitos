import type { Metadata, Viewport } from 'next';
import { Space_Grotesk } from 'next/font/google';

import './globals.css';
import { ServiceWorkerRegister } from '@/components/service-worker-register';

const basePath = '/DulcesCubanitos';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DulcesCubanitos | Dark Sugar Neon',
  description: 'PWA inmersiva de DulcesCubanitos con carruseles swipe-first, micro-carrito sticky, chatbot y checkout inteligente por WhatsApp.',
  manifest: `${basePath}/manifest.json`,
  applicationName: 'DulcesCubanitos',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DulcesCubanitos',
  },
  icons: {
    icon: [
      { url: `${basePath}/icons/icon-192.svg`, type: 'image/svg+xml' },
      { url: `${basePath}/icons/icon-512.svg`, type: 'image/svg+xml' },
    ],
    apple: [{ url: `${basePath}/icons/icon-192.svg`, type: 'image/svg+xml' }],
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
      <body className={spaceGrotesk.className}>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
