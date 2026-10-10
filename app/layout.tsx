import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Youssef Sabry — Full-Stack Developer & UI/UX Designer',
  description:
    'Full-stack developer and UI/UX designer. WordPress specialist, Next.js apps, custom themes, plugins, and CMS solutions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}document.documentElement.classList.add('js');`,
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
