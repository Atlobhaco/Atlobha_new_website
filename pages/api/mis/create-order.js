import { getAccessToken } from "../../../lib/mispay";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { orderId, amount } = req.body;

  try {
    const token = await getAccessToken();

    // Build payload according to MIS Pay docs
    const payload = {
      orderId,
      purchaseAmount: amount,
      purchaseCurrency: "SAR",
      lang: "ar",
      version: "v1.1",
      callbackUri: process.env.NEXT_PUBLIC_MIS_CALLBACK_URL,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_MIS_BASE_URL}/start-checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-id": process.env.NEXT_PUBLIC_MIS_API_ID,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (data.result?.url) {
      res.status(200).json({ url: data.result.url });
    } else {
      res.status(500).json({ error: "Failed to get checkout URL" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
