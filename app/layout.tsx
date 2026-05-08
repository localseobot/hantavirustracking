import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hantavirus Tracking — Global Case & Outbreak Dashboard",
  description:
    "Real-time global hantavirus surveillance dashboard. Track confirmed cases, deaths, and case-fatality rate by country, with data compiled from WHO, CDC, ECDC, PAHO, ProMED, and national health authorities.",
  metadataBase: new URL("https://hantavirustracking.org"),
  openGraph: {
    title: "Hantavirus Tracking",
    description:
      "Global hantavirus surveillance — cases, deaths, and outbreak intelligence on an interactive 3D globe.",
    type: "website",
    url: "https://hantavirustracking.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hantavirus Tracking",
    description:
      "Global hantavirus surveillance on an interactive 3D globe.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
