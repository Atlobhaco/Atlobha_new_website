// pages/api/auth/apple.js
import { parse } from "querystring";

export const config = {
  api: {
    bodyParser: false, // disable default JSON parser
  },
};

export default async function handler(req, res) {
  console.log("req", req);
  console.log("res", res);
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  // Collect and parse raw form body
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const parsedBody = parse(body); // parses x-www-form-urlencoded
    const { id_token, code, state } = parsedBody;
	console.log('parsedBody',parsedBody);

    if (!id_token) {
      console.error("No id_token received");
      return res.status(400).json({ error: "Missing id_token" });
    }

    const user = { name: "Apple User", token: id_token };
    console.log("id_token from Apple:", id_token);

    res.setHeader(
      "Set-Cookie",
      `user=${encodeURIComponent(JSON.stringify(user))}; Path=/; HttpOnly`
    );

    // return res.redirect(302, "/");
  });
}
