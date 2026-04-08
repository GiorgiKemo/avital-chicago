import Script from "next/script";
import { publicIntegrations } from "@/lib/site-config";
import ChatWidget from "@/components/chat/ChatWidget";

export default function SiteIntegrations() {
  if (process.env.NODE_ENV !== "production") {
    return <ChatWidget />;
  }

  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${publicIntegrations.gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      <Script id="gtm-base" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${publicIntegrations.gtmId}');`}
      </Script>

      <Script
        id="google-ads-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${publicIntegrations.googleAdsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-base" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${publicIntegrations.googleAdsId}');
window.gtag_report_conversion = function(url) {
  var callback = function() {
    if (typeof(url) !== 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
    'send_to': '${publicIntegrations.googleAdsQuoteConversionLabel}',
    'event_callback': callback
  });
  return false;
};`}
      </Script>



      {/* Custom Avital Live Chat Widget (replaces Tidio) */}
      <ChatWidget />
    </>
  );
}
