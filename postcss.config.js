// postcss.config.js
const purgecss = require("@fullhuman/postcss-purgecss");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  plugins: [
    require("autoprefixer"),
    isProd &&
      purgecss({
        content: [
          "./pages/**/*.{js,jsx,ts,tsx}",
          "./components/**/*.{js,jsx,ts,tsx}",
        ],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      }),
  ],
};
