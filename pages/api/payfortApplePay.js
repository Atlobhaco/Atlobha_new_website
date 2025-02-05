export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { applePayToken } = req.body;

  const payload = {
    command: "PURCHASE",
    access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
    merchant_identifier: process.env.NEXT_PUBLIC_PAYFORT_IDENTIFIER,
    merchant_reference: "ORDER_12345",
    amount: "10000", // Amount in minor units (100.00 SAR = 10000)
    currency: "SAR",
    language: "en",
    token_name: applePayToken, // Apple Pay token received from frontend
    customer_email: "customer@example.com",
    signature: process.env.NEXT_PUBLIC_APPLE_REQ_PHRASE, // Calculate secure hash as per PayFort docs
  };

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_APPLE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Payment processing failed" });
  }
}
