/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://yourwebsite.com", // Replace with your actual domain
  generateRobotsTxt: true, // Generates a robots.txt file
  sitemapSize: 5000, // Default size limit for the sitemap
  transform: async (config, url) => {
    return null; // Exclude all URLs from the sitemap
  },
};
