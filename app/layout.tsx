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
  // Default to dark for first-time visitors and environments where localStorage is unavailable
  let dark = true;
  try {
    const stored = localStorage.getItem('theme');
    if (stored) dark = stored === 'dark';
  } catch {}
  document.documentElement.classList.toggle('dark', dark);
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
