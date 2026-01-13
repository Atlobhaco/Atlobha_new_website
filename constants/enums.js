export const FIXED = "fixed";
export const SERVICES = "services";
export const PORTABLE = "portable";
export const SPAREPARTS = "spare-parts";
export const MARKETPLACE = "marketplace";
export const VEHICLE_PRICING = "vehicle-pricing";

export const UrlsSpecific = ["userProfile"];

export const ORDERSENUM = {
  marketplace: "MarketplaceOrder",
  spareParts: "SparePartsOrder",
  maintenance: "MaintenanceReservation",
  PORTABLE: "PortableMaintenanceReservation",
  gift: "VoucherPurchase",
  vehiclePricing: "VehiclePricingOrder",
  //   estimation: "EstimationRequest",
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
  completed: "completed",
  processing: "processing",
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
  mis: "MIS",
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

export const ExpressDeliveryReasonsLocalized = {
  has_branches: {
    ar: "هذا المنتج غير متاح حاليًا في أي من الفروع",
    en: "This product is not currently available at any branches",
  },
  has_stock_in_any_branch: {
    ar: "المنتج غير متوفر حاليًا في أي فرع من الفروع",
    en: "This product is currently out of stock at all branches",
  },
  has_stock_in_city: {
    ar: "المنتج غير متوفر حاليًا في الفروع داخل مدينتك",
    en: "This product is not currently available at branches in your city",
  },
  available_now: {
    ar: "بعض المنتجات غير متاحة للتوصيل السريع في الوقت الحالي",
    en: "Some products are currently not available for fast delivery",
  },
  available_now_in_city: {
    ar: "لا يتوفر التوصيل السريع لبعض المنتجات المختارة حاليًا في مدينتك",
    en: "Fast delivery is not available for some selected products in your city at the moment",
  },
  meets_all_criteria: {
    ar: "بعض المنتجات في سلة التسوق لا تتوافق حاليًا مع شروط التوصيل السريع في مدينتك",
    en: "Some items in your cart do not currently meet the fast delivery criteria in your city",
  },
};
