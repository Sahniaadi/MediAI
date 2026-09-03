import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediAI – Smart AI Medical Assistant & Healthcare Platform",
  description: "Next-generation AI-powered healthcare platform with symptom triage, prescription scanning, telehealth video consults, medicine delivery, and patient records.",
  keywords: ["MediAI", "AI Doctor", "Symptom Triage", "Prescription Scanner", "Telehealth", "Medicine Delivery", "EHR"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0d9488",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" data-font-size="md">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
