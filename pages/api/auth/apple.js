export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ error: "Missing token" });

  // Validate the token with your backend logic or decode locally
  // Dummy response for now
  const fakeUser = { id: 1, name: "Apple User" };

  return res.status(200).json(fakeUser);
}
