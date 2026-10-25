import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ENCETT — Timeless Leather Bags",
  description:
    "ENCETT is a modern leather goods house. Shop handcrafted totes, shoulder bags, crossbody bags and evening clutches with free shipping over $150.",
  keywords: ["ENCETT", "handbags", "leather bags", "tote", "crossbody", "clutch", "e-commerce"],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ENCETT — Timeless Leather Bags",
    description: "Handcrafted leather bags for every day and every evening.",
    siteName: "ENCETT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
