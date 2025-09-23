import { getAccessToken } from "@/lib/mispay";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { orderId, amount, successUrl, failureUrl, callbackUri } = req.body;
    const token = await getAccessToken();

    const payload = {
      orderId,
      purchaseAmount: amount,
      purchaseCurrency: "SAR",
      successUrl,
      failureUrl,
      callbackUri,
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
      return res.status(200).json({ url: data.result.url });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to get checkout URL", data });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
