export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { id_token, code, state } = req.body;

  // TODO: Validate id_token with Apple server
  // You can decode id_token here or send to backend

  // Example: Set a cookie (or store user in DB etc.)
  const user = { name: "Apple User", token: id_token };
  console.log(id_token);
  res.setHeader(
    "Set-Cookie",
    `user=${encodeURIComponent(JSON.stringify(user))}; Path=/; HttpOnly`
  );

  // Redirect to frontend after login
  res.redirect(302, "/");
}
