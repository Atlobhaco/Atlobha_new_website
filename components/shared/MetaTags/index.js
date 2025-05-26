import React from "react";
import Head from "next/head";

function MetaTags({
  title = "Title",
  content = "content of the page",
  icon = "/logo/road-atlobha-text.svg",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={content} />
      {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <link rel="icon" href={icon} />
    </Head>
  );
}

export default MetaTags;
