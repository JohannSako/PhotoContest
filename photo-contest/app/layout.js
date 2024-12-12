import './globals.css';
import MainLayout from '@/components/layout/main';

export const metadata = {
  title: 'PhotoContest',
  description: 'Snap, Share, Succeed',
};

export default function RootLayout({ children }) {
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
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}