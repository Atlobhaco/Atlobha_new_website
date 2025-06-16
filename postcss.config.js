// postcss.config.js
import autoprefixer from "autoprefixer";
import purgecss from "@fullhuman/postcss-purgecss";

const isProd = process.env.NODE_ENV === "production";

export default {
  plugins: [
    autoprefixer,
    isProd &&
      purgecss({
        content: [
          "./pages/**/*.{js,jsx,ts,tsx}",
          "./components/**/*.{js,jsx,ts,tsx}",
          "./app/**/*.{js,jsx,ts,tsx}",
        ],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      }),
  ].filter(Boolean),
};
