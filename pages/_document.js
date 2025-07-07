import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" />

        <link
          rel="preload"
          as="image"
          href="/icons/pattern.png" // Adjust the path as needed
          type="image/svg+xml"
        />
        <link rel="manifest" href="/manifest.json" />
        {/* <script
          type="text/javascript"
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        ></script> */}

        <Script>
          var clickRankAi = document.createElement(`script`); clickRankAi.src =
          `https://js.clickrank.ai/seo/dc4d56df-22cb-424b-aef2-fa3a2d0c6e66/script?`
          + new Date().getTime(); clickRankAi.async = true;
          document.head.appendChild(clickRankAi);
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
