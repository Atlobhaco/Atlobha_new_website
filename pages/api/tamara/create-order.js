// pages/api/tamara/create-order.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const {
    items,
    totalAmount,
    customer,
    successUrl,
    cancelUrl,
    order_reference_id,
    description,
    failureUrl,
    shipping_address,
  } = req.body;

  try {
    const tamaraRes = await axios.post(
      `${process.env.NEXT_PUBLIC_TAMARA_API_URL}/checkout`,
      {
        total_amount: {
          amount: totalAmount,
          currency: "SAR",
        },
        shipping_amount: {
          amount: 0,
          currency: "SAR",
        },
        tax_amount: {
          amount: 0,
          currency: "SAR",
        },
        order_reference_id: order_reference_id,
        items: items,
        consumer: customer,
        country_code: "SA",
        description: description,
        merchant_url: {
          cancel: cancelUrl,
          failure: failureUrl,
          success: successUrl,
        },
        // payment_type: "PAY_BY_INSTALMENTS",
        // instalments: 3,
        shipping_address: shipping_address,
        platform: "Atlobha-اطلبها",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TAMARA_API_KEY}`, // ✅ secure
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ checkout_url: tamaraRes.data.checkout_url });
  } catch (err) {
    console.error("Tamara error:", err.response?.data || err.message);
    res.status(500).json({ error: "Tamara order creation failed" });
  }
}
