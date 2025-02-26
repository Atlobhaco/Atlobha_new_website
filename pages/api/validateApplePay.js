// pages/api/validateApplePay.js
export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

  const { validationURL } = req.body;

  try {
    const appleResponse = await fetch(validationURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchantIdentifier: process.env.NEXT_PUBLIC_APPLE_IDENTIFIER,
        domainName: "https://atlobha-new-website.vercel.app/",
        displayName: "Atlobha Store",
      }),
    });

    if (!appleResponse.ok) {
      throw new Error(`Apple Validation Failed: ${appleResponse.statusText}`);
    }

    const merchantSession = await appleResponse.json();
    res.status(200).json(merchantSession);
  } catch (error) {
    console.error("Apple Pay validation error:", error);
    res.status(500).json({ error: "Apple Pay merchant validation failed" });
  }
}
