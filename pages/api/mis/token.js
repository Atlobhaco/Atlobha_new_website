// pages/api/mispay/token.js
import { getAccessToken } from "../../../lib/mispay";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    // NOTE: For production, avoid exposing the raw token to the public.
    // This endpoint is useful for server-side testing or for other server routes to call internally.
    const token = await getAccessToken();
    return res.status(200).json({ token });
  } catch (err) {
    console.error("get token error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to get token" });
  }
}
