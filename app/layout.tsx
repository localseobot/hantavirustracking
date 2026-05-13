import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
      <body className="min-h-full flex flex-col">
        {children}
        {/* Ad delivery (apitiny). `afterInteractive` injects the tag at the
            end of <body> once the page is interactive — equivalent to the
            recommended "just before </body>" placement, with proper
            de-duplication across client-side navigations. */}
        <Script
          src="https://cdn.apitiny.net/scripts/v2.0/main.js"
          strategy="afterInteractive"
          data-site-id="6a04b872e6b82fcabe00f648"
          data-test-mode="false"
        />
      </body>
    </html>
  );
}
