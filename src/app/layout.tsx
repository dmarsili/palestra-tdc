import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/ui/theme/ThemeProvider";
import Link from "next/link";
import { ThemeToggle } from "@/ui/theme/ThemeToggle";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dashboard de KPIs/OKRs",
  description: "Demo TDC • IA e liderança técnica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-10 border-b bg-white/70 dark:bg-zinc-900/70 backdrop-blur px-6 py-3 flex items-center justify-between">
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/dashboard" className="font-semibold">Dashboard</Link>
                <Link href="/leaders">Líderes</Link>
                <Link href="/okrs">OKRs</Link>
                <Link href="/experiments">Experiments</Link>
                <Link href="/about">Sobre</Link>
              </nav>
              <ThemeToggle />
            </header>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
