import ClientToastProvider from '@/components/toast';
import './globals.css';
import MainLayout from '@/components/layout/main';
import { headers, cookies } from 'next/headers';
import { TranslationProvider } from '@/context/TranslationContext';

export const metadata = {
  title: 'PhotoContest',
  description: 'Snap, Share, Succeed'
};

export default function RootLayout({ children }) {
  const headersList = headers();
  const defaultLocale = headersList.get("accept-language");
  const locale = cookies().get("NEXT_LOCALE")?.value || defaultLocale || "en";

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>{metadata.title}</title>
      </head>
      <body>
        <TranslationProvider locale={locale}>
          <MainLayout>
            {children}
          </MainLayout>
          <ClientToastProvider />
        </TranslationProvider>
      </body>
    </html>
  );
}