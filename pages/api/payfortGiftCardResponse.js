import { VEHICLE_PRICING } from "@/constants/enums";
/* -------------------------------------------------------------------------- */
/*                   work for gift and car pricing services                   */
/* -------------------------------------------------------------------------- */
export default function handler(req, res) {
  if (!req.query.carPricing) {
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
    // logic for car pricing redirect failure and success
  } else {
    if (
      req?.body?.status === "00" ||
      req?.body?.status === "13" ||
      req?.body?.status === "10"
    ) {
      res.redirect(302, `/carPricing/checkout/?secType=${VEHICLE_PRICING}`);
      return;
    }

    if (req.method === "GET") {
      res.redirect(302, `/confirmation/carPricing/?secType=${VEHICLE_PRICING}`);
    } else {
      res.redirect(302, `/confirmation/carPricing/?secType=${VEHICLE_PRICING}`);
    }
  }
}
