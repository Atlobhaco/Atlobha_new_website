/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "ar",
    localeDetection: false,
  },
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
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

//   async redirects() {
//     return [
//       {
//         source: "/",
//         destination: "/spareParts",
//         permanent: false, // Set to true if it's a permanent redirect
//       },
//     ];
//   },
};

export default nextConfig;
