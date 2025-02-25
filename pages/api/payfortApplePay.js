// pages/api/payfortApplePay.js
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { applePayToken } = req.body;

  // Convert amount to minor units (e.g., 100.00 SAR = 10000)
  const amount = 10000;
  const merchantReference = `ORDER_${Date.now()}`;

  // Calculate secure signature
  const signatureString = `${process.env.NEXT_PUBLIC_APPLE_REQ_PHRASE}access_code=${process.env.NEXT_PUBLIC_APPLE_ACCESS}amount=${amount}command=PURCHASEcurrency=SARcustomer_email=customer@example.comlanguage=enmerchant_identifier=${process.env.NEXT_PUBLIC_PAYFORT_IDENTIFIER}merchant_reference=${merchantReference}token_name=${applePayToken}${process.env.NEXT_PUBLIC_APPLE_REQ_PHRASE}`;

  const signature = crypto
    .createHash("sha256")
    .update(signatureString)
    .digest("hex");

  const payload = {
    command: "PURCHASE",
    access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
    merchant_identifier: process.env.NEXT_PUBLIC_PAYFORT_IDENTIFIER,
    merchant_reference: merchantReference,
    amount: amount.toString(),
    currency: "SAR",
    language: "en",
    token_name: applePayToken, // Correctly passing token
    customer_email: "customer@example.com",
    signature: signature, // Secure signature
  };

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_APPLE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (result.response_code === "14000") {
      res.status(200).json({
        status: "success",
        message: "Payment successful",
        data: result,
      });
    } else {
      res
        .status(400)
        .json({ status: "failed", message: "Payment declined", data: result });
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
}
