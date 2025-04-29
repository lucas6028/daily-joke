const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'nonce-${process.env.CSP_NONCE}' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'nonce-${process.env.CSP_NONCE}' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://www.google-analytics.com https://vercel.com https://*.vercel.app;
  connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.vercel.app;
  frame-src 'none';
  object-src 'none';
  frame-ancestors 'none';
`;

const nextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/(.*)",
        headers: [
          // a security feature that allows you to control which sites can access your resources.
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\n/g, '').trim(),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload", // Two years HSTS policy
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Prevent MIME type sniffing
          },
          {
            key: "X-Frame-Options",
            value: "DENY", // Prevent clickjacking
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer", // No referrer information will be sent
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(self), microphone=()", // Only allow geolocation and microphone permissions as needed
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
