export default function handler(req, res) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = cookieHeader.split("; ").reduce((acc, current) => {
    const [key, ...rest] = current.split("=");
    acc[key] = rest.join("="); // join everything back
    return acc;
  }, {});

  //  failure or cancel for marketplace or spare parts
  if (req?.body?.status === "00" || req?.body?.status === "13") {
    res.setHeader(
      "Set-Cookie",
      "payment_failed=failed; Path=/; Max-Age=86400; SameSite=Lax"
    );

    const url_after_pay_failed = cookies.url_after_pay_failed;

    res.redirect(302, url_after_pay_failed || "/checkout");
    return;
  }

  if (req.method === "GET") {
    res.redirect(302, `/spareParts/confirmation/${req.query.order_id}`);
  } else {
    if (req.query.marketplace) {
      res.redirect(302, `/spareParts/confirmation/null?type=marketplace`);
    } else {
      res.redirect(302, `/spareParts/confirmation/${req.query.order_id}`);
    }
  }
}
