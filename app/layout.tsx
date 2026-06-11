import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Building Libraries — Pottery for a Purpose",
  description: "Hand-crafted ceramics. 100% of proceeds build libraries for children.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-serif">{children}</body>
    </html>
  );
}
