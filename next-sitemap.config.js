/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://atlobha.com", // replace with your actual domain
  generateRobotsTxt: true, // (optional) Generate robots.txt file
  sitemapSize: 7000, // optional
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin"], // optional paths to exclude
};
