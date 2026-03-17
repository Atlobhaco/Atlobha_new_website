export default function handler(req, res) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = cookieHeader.split("; ").reduce((acc, current) => {
    const [key, ...rest] = current.split("=");
    acc[key] = rest.join("="); // join everything back
    return acc;
  }, {});
  // return to service details page if failed or cancelled
  if (
    req?.body?.status === "00" ||
    req?.body?.status === "13" ||
    req?.body?.status === "10"
  ) {
    res.setHeader(
      "Set-Cookie",
      "payment_failed=failed; Path=/; Max-Age=86400; SameSite=Lax",
    );

    const url_after_pay_failed = cookies.url_after_pay_failed;

    res.redirect(
      302,
      url_after_pay_failed ||
        `/service/${req?.query?.idService}/?portableService=${req?.query?.portableService}&secType=${req?.query?.secType}&type=${req?.query?.type}&servicePayFailed=true`,
    );
    return;
  }
  if (req.method === "GET") {
    res.redirect(302, `/spareParts/confirmation/${req.query.order_id}`);
  } else {
    // res.status(405).json({ error: "Method Not Allowed" });
    if (req.query.service) {
      res.redirect(
        302,
        `/spareParts/confirmation/${req.query.order_id}?secType=services&type=services&serviceType=${req.query?.serviceType}`,
      );
    } else {
      res.redirect(
        302,
        `/spareParts/confirmation/${req.query.order_id}?secType=services&type=services&serviceType=${req.query?.serviceType}`,
      );
    }
  }
}
