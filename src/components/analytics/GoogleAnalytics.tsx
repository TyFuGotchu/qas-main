import Script from "next/script";
import { Suspense } from "react";
import { GoogleAnalyticsRouteTracker } from "./GoogleAnalyticsRouteTracker";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-QGV9HDNZ2E";

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: true
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsRouteTracker measurementId={GA_MEASUREMENT_ID} />
      </Suspense>
    </>
  );
}