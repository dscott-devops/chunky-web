import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DebugPanel from "@/components/ui/DebugPanel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChunkyWho",
  description: "Discover notable people — artists, athletes, scientists, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${inter.className}`}>
      <body className="min-h-full flex flex-col bg-surface text-text">
        {children}
        <DebugPanel />
      </body>
    </html>
  );
}
