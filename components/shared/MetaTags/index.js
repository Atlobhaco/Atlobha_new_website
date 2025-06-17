import React from "react";
import Head from "next/head";

function MetaTags({
  title = "Title",
  content = "Content of the page",
  icon = "/logo/road-atlobha-text.svg",
  keywords = "car parts, spare parts, Atlobha, auto, السعودية, قطع غيار",
  author = "Atlobha Team",
  url = "https://atlobha.com",
  image = "/logo/road-atlobha-text.svg", // Replace with your actual default image path
}) {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={content} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <link rel="icon" href={icon} />
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={content} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Atlobha" />
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={content} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@atlobha" />{" "}
      {/* optional, if you have a Twitter handle */}
      {/* Favicon & Mobile Web App */}
      <link rel="apple-touch-icon" href={icon} />
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
    </Head>
  );
}

export default MetaTags;
