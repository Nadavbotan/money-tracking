import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { MonthProvider } from "@/lib/MonthContext";
import { getAvailableMonths } from "@/lib/data";

const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "מעקב הוצאות",
  description: "ניהול תקציב משפחתי",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const months = getAvailableMonths();

  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} dark`}>
      <body className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased">
        <MonthProvider months={months}>
          {children}
        </MonthProvider>
      </body>
    </html>
  );
}
