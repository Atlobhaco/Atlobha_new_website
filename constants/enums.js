export const MARKETPLACE = "marketplace";
export const SPAREPARTS = "spare-parts";
export const SERVICES = "services";

export const UrlsSpecific = ["userProfile"];

export const ORDERSENUM = {
  marketplace: "MarketplaceOrder",
  spareParts: "SparePartsOrder",
  estimation: "EstimationRequest",
  maintenance: "MaintenanceReservation",
  portable: "PortableMaintenanceReservation",
  //   midEast: "MideastOrder",
  //   majdou: "MajdouieMaintenanceReservation",
};

export const STATUS = {
  new: "new",
  readyToShip: "ready-to-ship",
  payPending: "payment-pending",
  confirmed: "confirmed",
  shipping: "shipping",
  delivered: "delivered",
  cancelled: "cancelled",
  incomplete: "incomplete",
  returned: "returned",
  priced: "priced",
  priceUnavailable: "pricing-unavailable",
};

export const PAYMENT_METHODS = {
  credit: "CREDIT",
  cash: "CASH",
  applePay: "APPLE-PAY",
  stcPay: "STC-PAY",
  installment: "INSTALLMENT",
  banktransfer: "BANK-TRANSFER",
  tabby: "TABBY",
  wallet: "WALLET",
  tamara: "TAMARA",
};

export const INFORMATIVE_TYPES = {
  information: "information",
  offer: "offer",
  warning: "warning",
  other: "other",
};

export const PRODUCT_TYPES = {
  oils: "oils",
  spareParts: "spare-parts",
  tires: "tires",
  accessories: "accessories",
  others: "others",
  batteries: "batteries",
};
