import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";   // keep your existing globals
import "./home.css";      // our new styles

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital TA",
  description: "Fast, reliable submissions, auto-grading, and plagiarism checks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
