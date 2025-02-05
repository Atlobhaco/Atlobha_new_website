export default function handler(req, res) {
  if (req.method === "GET") {
    res.redirect(302, `/spareParts/confirmation/${req.query.order_id}`);
  } else {
    // res.status(405).json({ error: "Method Not Allowed" });
    res.redirect(302, `/spareParts/confirmation/${req.query.order_id}`);
  }
}
