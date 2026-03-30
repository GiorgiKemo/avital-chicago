export const siteConfig = {
  name: "Avital Chicago Party Bus And Limousine",
  shortName: "Avital Chicago Limousine",
  url: "https://www.avitalchicagolimousine.com",
  phoneDisplay: "(630) 550-6753",
  phoneHref: "tel:6305506753",
  phoneSchema: "630 550 6753",
  email: "info@avitalchicagolimousine.com",
  address: {
    streetAddress: "1431 Harmony Ct",
    addressLocality: "Itasca",
    addressRegion: "IL",
    postalCode: "60143",
    addressCountry: "USA",
  },
  geo: {
    latitude: 41.9712531,
    longitude: -87.9934142,
  },
  social: {
    facebook: "https://www.facebook.com/avitallimo/",
  },
  images: {
    logo: "/images/logos/logo.webp",
    og: "/images/hero/hero-partybus.webp",
  },
} as const;

export const publicIntegrations = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "GTM-NNLNNPQ",
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-1018838931",
  googleAdsQuoteConversionLabel:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_QUOTE_CONVERSION_LABEL ||
    "AW-1018838931/iDn9CNWR7GYQk__o5QM",
  inspectletWid: process.env.NEXT_PUBLIC_INSPECTLET_WID || "1442288751",
  tidioEnabled: process.env.NEXT_PUBLIC_ENABLE_TIDIO !== "false",
  tidioPublicKey:
    process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY ||
    "hkbemhej6tonjhl5fe127y8b6w0gvilb",
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
} as const;
