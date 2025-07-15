// pages/api/tabby/create-session.js

export default async function handler(req, res) {
  const { payment, lang, merchant_code, successUrl, cancelUrl, failureUrl } =
    req.body;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TABBY_API_URL}/api/v1/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TABBY_SECRET_KEY}`,
        },
        body: {
          payment: payment,
          lang: lang,
          merchant_code: merchant_code,
          merchant_urls: {
            cancel: cancelUrl,
            failure: failureUrl,
            success: successUrl,
          },
        },
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Tabby error", error);
    return res.status(500).json({ error: "Failed to create Tabby session" });
  }
}
