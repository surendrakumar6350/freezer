import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Freezer – Modern S3 File Explorer",
  description: "Freezer is a modern, elegant web app for browsing, previewing, and managing your S3 files with rich previews, secure access, and a beautiful UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* No-flash theme init */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  let dark = true;
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') dark = true;
    else if (stored === 'light') dark = false;
    else if (window.matchMedia) dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {}
  const root = document.documentElement;
  if (dark) root.classList.add('dark'); else root.classList.remove('dark');
  try {
    // Hint to UA for form controls etc.
    let meta = document.querySelector('meta[name="color-scheme"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','color-scheme'); document.head.appendChild(meta); }
    meta.setAttribute('content', dark ? 'dark light' : 'light dark');
  } catch {}
})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
