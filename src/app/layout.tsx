import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { getThemeSettings } from "@/lib/db";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getThemeSettings();
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <style>{`:root{--accent:${theme.accent};--background:${theme.background};--foreground:${theme.foreground};--surface:${theme.surface};--muted:${theme.muted};--line:${theme.line};--section-dark:${theme.sectionDark}}`}</style>
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}