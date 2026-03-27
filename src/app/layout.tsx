import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Avital Chicago Limousine & Party Bus Rental | Luxury Transportation",
    template: "%s | Avital Chicago Limousine",
  },
  description:
    "Chicago's premier luxury limousine and party bus rental. Weddings, quinceaneras, proms, nights out, and executive transportation. Call (630) 550-6753.",
  metadataBase: new URL("https://www.avitalchicagolimousine.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Avital Chicago Limousine & Party Bus",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
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
