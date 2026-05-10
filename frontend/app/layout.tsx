import type { Metadata } from "next";
import Navigation from "./Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Human-Aware Sprint Cost Forecasting",
  description: "Sprint planning and cost prediction platform with human factors",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
