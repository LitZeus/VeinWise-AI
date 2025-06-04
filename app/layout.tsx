import Navbar from "@/components/Navbar";
import { getServerUser } from "@/lib/auth";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileNav from "./mobile-nav-wrapper";

// Ensure this layout is not cached
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VeinWise AI - Varicose Vein Analysis Platform",
  description: "An advanced platform for doctors to analyze varicose vein scans with AI assistance",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the current user from the server
  // Using a dynamic import with cache: 'no-store' to ensure fresh data on each request
  const user = await getServerUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <Navbar user={user} />

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 mt-16 pb-16 md:pb-6">
          {children}
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </body>
    </html>
  );
}
