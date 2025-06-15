// pages/api/auth/apple.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { id_token } = req.body;

    if (!id_token) {
      return res.status(400).json({ error: "Missing id_token" });
    }

    // Optional: verify the id_token with Apple (skipped here, assumed Laravel will handle it)
    // You can add Apple token verification here if you want

    // Send the token to your real backend (Laravel or other API)
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/apple`, // e.g. https://api.yoursite.com/auth/apple
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "w123", // optional custom API key header
        },
        body: JSON.stringify({ id_token }),
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return res.status(backendRes.status).json({ error: data?.error || "Apple login failed" });
    }

    // Forward user data to frontend
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in /api/auth/apple:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
zz