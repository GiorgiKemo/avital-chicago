import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import SiteIntegrations from "@/components/SiteIntegrations";
import PublicShell from "@/components/PublicShell";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site-config";
import {
  localBusinessJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/structured-data";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const inspectletBlockerScript = String.raw`(function () {
  var inspectletPattern = /(^https?:)?\/\/([^/]+\.)?inspectlet\.com/i;

  function isBlockedUrl(url) {
    return typeof url === "string" && inspectletPattern.test(url);
  }

  function getNodeSource(node) {
    if (!node || typeof node !== "object") {
      return "";
    }

    if ("src" in node && typeof node.src === "string") {
      return node.src;
    }

    if ("getAttribute" in node && typeof node.getAttribute === "function") {
      return node.getAttribute("src") || "";
    }

    return "";
  }

  function shouldBlockNode(node) {
    return isBlockedUrl(getNodeSource(node));
  }

  function blockNode(node) {
    if (node && typeof node.remove === "function") {
      node.remove();
    }

    return node;
  }

  var appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function (node) {
    if (shouldBlockNode(node)) {
      return blockNode(node);
    }

    return appendChild.call(this, node);
  };

  var insertBefore = Element.prototype.insertBefore;
  Element.prototype.insertBefore = function (node, referenceNode) {
    if (shouldBlockNode(node)) {
      return blockNode(node);
    }

    return insertBefore.call(this, node, referenceNode);
  };

  var replaceChild = Element.prototype.replaceChild;
  Element.prototype.replaceChild = function (node, child) {
    if (shouldBlockNode(node)) {
      return blockNode(node);
    }

    return replaceChild.call(this, node, child);
  };

  if (typeof window.fetch === "function") {
    var originalFetch = window.fetch;
    window.fetch = function (input, init) {
      var url = typeof input === "string" ? input : input && typeof input.url === "string" ? input.url : "";
      if (isBlockedUrl(url)) {
        return Promise.reject(new Error("Blocked legacy Inspectlet request."));
      }

      return originalFetch.call(this, input, init);
    };
  }

  var originalXhrOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (isBlockedUrl(url)) {
      throw new Error("Blocked legacy Inspectlet request.");
    }

    return originalXhrOpen.apply(this, arguments);
  };

  if (typeof navigator.sendBeacon === "function") {
    var originalSendBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (url, data) {
      if (isBlockedUrl(url)) {
        return false;
      }

      return originalSendBeacon(url, data);
    };
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (shouldBlockNode(node)) {
          blockNode(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();`;

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

import { getSiteSettings } from "@/lib/site-settings";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: inspectletBlockerScript,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            ${settings.theme_primary_color ? `--primary: ${settings.theme_primary_color};` : ''}
            ${settings.theme_background_color ? `--background: ${settings.theme_background_color};` : ''}
            ${settings.theme_glass_bg ? `--glass-bg: ${settings.theme_glass_bg};` : ''}
          }
        `}} />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <SiteIntegrations />
        <JsonLd id="website-schema" data={websiteJsonLd} />
        <JsonLd id="local-business-schema" data={localBusinessJsonLd} />
        <JsonLd id="organization-schema" data={organizationJsonLd} />
        <PublicShell>{children}</PublicShell>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
