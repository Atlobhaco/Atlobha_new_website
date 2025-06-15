// pages/api/appleCallback.js
import { parse } from "querystring";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const parsed = parse(body); // from application/x-www-form-urlencoded

    const { id_token } = parsed;

    if (!id_token) return res.status(400).end("Missing id_token");

    // Redirect to client-side route and pass token via query or cookie
    res.setHeader("Set-Cookie", `id_token=${id_token}; Path=/; HttpOnly`);
    return res.redirect(
      302,
      `/auth/apple-callback-client/id_token=${id_token}`
    ); // frontend page
  });
}
