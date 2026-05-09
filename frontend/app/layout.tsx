import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sprint Cost Studio",
  description: "Sprint planning and cost prediction platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
