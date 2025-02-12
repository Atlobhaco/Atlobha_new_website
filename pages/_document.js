import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script>
          var clickRankAi = document.createElement("script"); clickRankAi.src =
          "https://js.clickrank.ai/seo/dc4d56df-22cb-424b-aef2-fa3a2d0c6e66/script?"
          + new Date().getTime(); clickRankAi.async = true;
          document.head.appendChild(clickRankAi);
        </script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
