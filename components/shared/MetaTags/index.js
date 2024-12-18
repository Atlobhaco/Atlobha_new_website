import React from "react";
import Head from "next/head";

function MetaTags({
  title = "Title",
  content = "content of the page",
  icon = "/logo/logo-sm.svg",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={content} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href={icon} />
    </Head>
  );
}

export default MetaTags;
