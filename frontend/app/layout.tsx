import type { Metadata } from "next";
import Navigation from "./Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Driven Human Aware Sprint Cost Forecasting",
  description: "AI-powered sprint planning and cost prediction platform with human factors awareness",
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
