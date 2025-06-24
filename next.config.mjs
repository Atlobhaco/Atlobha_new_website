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
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },

//   async rewrites() {
//     return [
//       {
//         source: "/site-map-test.xml",
//         destination: "https://www.w3schools.com/xml/note.xml",
//       },
//     ];
//   },
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
