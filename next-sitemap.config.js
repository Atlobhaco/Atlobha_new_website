/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://atlobha.com", // replace with your actual domain
  generateRobotsTxt: true, // (optional) Generate robots.txt file
  sitemapSize: 7000, // optional
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin"], // optional paths to exclude
  // Add your static pages manually
  additionalPaths: async (config) => {
    return [
      { loc: "/userProfile/returnPolicy", lastmod: new Date().toISOString() },
      { loc: "/userProfile/myCars", lastmod: new Date().toISOString() },
      { loc: "/userProfile/myAddresses", lastmod: new Date().toISOString() },
      { loc: "/userProfile/myOrders", lastmod: new Date().toISOString() },
      { loc: "/userProfile/editInfo", lastmod: new Date().toISOString() },
      { loc: "/sections?secTitle=", lastmod: new Date().toISOString() },
      { loc: "/spareParts", lastmod: new Date().toISOString() },
      { loc: "/category", lastmod: new Date().toISOString() },
      { loc: "/category/4?idSub=3", lastmod: new Date().toISOString() },
      { loc: "/product", lastmod: new Date().toISOString() },
      { loc: "/product/2477937", lastmod: new Date().toISOString() },
      { loc: "/manufacture", lastmod: new Date().toISOString() },
      { loc: "/manufacture/2?name=بيزوس", lastmod: new Date().toISOString() },
      { loc: "/checkout", lastmod: new Date().toISOString() },
      { loc: "/spareParts/confirmation/", lastmod: new Date().toISOString() },
      // Add more static routes here
    ];
  },
};
