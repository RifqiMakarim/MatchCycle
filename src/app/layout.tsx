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
  title: "MatchGATE",
  description: "MATCHCYCLE: SISTEM DIGITAL BERBASIS MATCHMAKING SEBAGAI SOLUSI PERMASALAHAN FOOD WASTE PADA PROGRAM MBG MELALUI PENDEKATAN EKONOMI SIRKULAR UNTUK MENCAPAI SDGS 2030",
  icons: {
    icon: "/logo-MatchCycle.jpeg",
    apple: "/logo-MatchCycle.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
