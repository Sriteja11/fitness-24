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
  title: "Fitness 24",
  description: "Your fitness companion.",
  manifest: "../../public/manifest.json",  // References your existing manifest for PWA metadata
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Link to the web manifest */}
        <link rel="manifest" href="../../public/manifest.json" /> 
        
        {/* Theme color for PWA splash screen and browser chrome */}
        <meta name="theme-color" content="#2563eb" />  {/* Matches your manifest's theme_color */}
        
        {/* iOS-specific tags for adding to home screen */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Fitness24" />
        <link rel="apple-touch-icon" href="../../public/app_icon.png" />  {/* Uses your existing AI-generated icon */}
        
        {/* Android/Chrome-specific tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" sizes="192x192" href="../../public/app_icon.png" />
        <link rel="icon" sizes="512x512" href="../../public/app_icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
