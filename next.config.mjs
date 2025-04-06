/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "ar",
    localeDetection: false,
  },
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "atlobha-staging.s3.me-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "old.atlobha.com", // ✅ added this
        pathname: "/**", // ✅ make sure this is correct
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  webpack(config) {
    // Add the rule to handle SVGs as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true, // You can set this to false if you don't need them as icons
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
