import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import SiteIntegrations from "@/components/SiteIntegrations";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site-config";
import {
  localBusinessJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/structured-data";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Avital Chicago Limousine & Party Bus Rental | Luxury Transportation",
    template: "%s | Avital Chicago Limousine",
  },
  description:
    "Chicago's premier luxury limousine and party bus rental. Weddings, quinceaneras, proms, nights out, and executive transportation. Call (630) 550-6753.",
  metadataBase: new URL("https://www.avitalchicagolimousine.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Avital Chicago Limousine & Party Bus",
    title: "Avital Chicago Limousine & Party Bus Rental | Luxury Transportation",
    description:
      "Chicago's premier luxury limousine and party bus rental. Weddings, quinceaneras, proms, nights out, and executive transportation.",
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.images.og,
        alt: "Avital Chicago Limousine and Party Bus",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${lato.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        <SiteIntegrations />
        <JsonLd id="website-schema" data={websiteJsonLd} />
        <JsonLd id="local-business-schema" data={localBusinessJsonLd} />
        <JsonLd id="organization-schema" data={organizationJsonLd} />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
