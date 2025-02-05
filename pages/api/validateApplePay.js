export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { validationURL } = req.body;

  try {
    const response = await fetch(validationURL, {
      method: "POST",
      body: JSON.stringify({
        merchantIdentifier: process.env.NEXT_PUBLIC_PAYFORT_IDENTIFIER,
        displayName: "atlobha store",
        initiative: "web",
        initiativeContext:
          "https://atlobha-new-website-git-master-atlobhacos-projects.vercel.app/",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const merchantSession = await response.json();
    res.json(merchantSession);
  } catch (error) {
    res.status(500).json({ error: "Apple Pay validation failed" });
  }
}
