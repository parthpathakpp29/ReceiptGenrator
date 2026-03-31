// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Loan Receipt Generator",
  description: "Generate loan receipts for cooperative society members",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <div className="app-shell">
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}