import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmartHeader from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fitness 24",
  description: "Your fitness companion.",
  themeColor: "#2563eb",
  manifest: "/manifest.json", // served from /public
  icons: {
    icon: [
      { url: "/app_icon.png", sizes: "192x192", type: "image/png" },
      { url: "/app_icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/app_icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SmartHeader currentPage="Dashboard" />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
