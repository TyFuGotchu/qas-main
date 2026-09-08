/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  async redirects() {
    return [
      { source: "/e8", destination: "/firms/e8", permanent: true },
      { source: "/e8-execution-center", destination: "/firms/e8", permanent: true },
      { source: "/dashboard/e8", destination: "/dashboard/firms/e8", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/webhooks/tradingview",
        destination: "/api/webhooks/tradingview",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;