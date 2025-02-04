export default function handler(req, res) {
  if (req.method === "GET") {
    res.redirect(
      302,
      `/userProfile/myOrders/${req.query.order_id}/?type=${req.query.type}&status=CREDIT`
    );
  } else {
    // res.status(405).json({ error: "Method Not Allowed" });
    res.redirect(
      302,
      `/userProfile/myOrders/${req.query.order_id}/?type=${req.query.type}&status=CREDIT`
    );
  }
}
