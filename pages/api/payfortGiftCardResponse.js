export default function handler(req, res) {
  // return to service details page if failed or cancelled
  if (
    req?.body?.status === "00" ||
    req?.body?.status === "13" ||
    req?.body?.status === "10"
  ) {
    res.redirect(302, `/userProfile/gift/chooseGift`);
    return;
  }
  if (req.method === "GET") {
    res.redirect(302, `/confirmation/giftCards`);
  } else {
    // res.status(405).json({ error: "Method Not Allowed" });
    if (req.query.service) {
      res.redirect(302, `/confirmation/giftCards`);
    } else {
      res.redirect(302, `/confirmation/giftCards`);
    }
  }
}
