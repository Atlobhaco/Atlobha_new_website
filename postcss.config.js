import purgecss from "@fullhuman/postcss-purgecss";

const isProd = true;

export const plugins = [
  require("autoprefixer"),
  isProd &&
    new purgecss({
      content: [
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}", // optional if you're using /app directory
      ],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
].filter(Boolean);
