import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const payload = req.body;

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_APPLE_URL,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
