import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import Image from "next/image";
import crypto from "crypto";

export const checkApplePayAvailability = () => {
  // Check if Apple Pay is available and apple OS
  if (
    typeof window !== "undefined" &&
    window?.ApplePaySession &&
    window?.ApplePaySession.canMakePayments()
  ) {
    return true;
  } else {
    return false;
  }
};

export const getUserCurrentLocation = () => {
  if (navigator?.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(location);
        },
        (err) => {
          console.error("Error getting location:", err);
          reject(
            "Unable to retrieve location. Please enable location services."
          );
        }
      );
    });
  } else {
    return Promise.reject("Geolocation is not supported by your browser.");
  }
};

export const translateAddressName = (name, locale) => {
  switch (name) {
    case "Home":
      return locale === "en" ? name : "المنزل";
    case "Work":
      return locale === "en" ? name : "العمل";
    default:
      return name;
  }
};

export const getFilterParams = (filters) => {
  const params = new URLSearchParams();

  // Append only non-empty filter values
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });
  return params.toString(); // Returns a query string format
};

export const UrlsSpecific = ["userProfile"];

/* -------------------------------------------------------------------------- */
/*                       constants keyword along the app                      */
/* -------------------------------------------------------------------------- */

export const MARKETPLACE = "marketplace";
export const SPAREPARTS = "spare-parts";

export const ORDERSENUM = {
  marketplace: "MarketplaceOrder",
  spareParts: "SparePartsOrder",
  estimation: "EstimationRequest",
  maintenance: "MaintenanceReservation",
  portable: "PortableMaintenanceReservation",
  //   midEast: "MideastOrder",
  //   majdou: "MajdouieMaintenanceReservation",
};

export const orderEnumArray = () => {
  const { t } = useLocalization();

  return Object.values(ORDERSENUM).map((value) => ({
    id: value,
    name: t.order[`${value}`],
  }));
};

export const STATUS = {
  new: "new",
  received: "received",
  payPending: "payment-pending",
  confirmed: "confirmed",
  shipping: "shipping",
  delivered: "delivered",
  cancelled: "cancelled",
  incomplete: "incomplete",
  returned: "returned",
  priced: "priced",
};

export const statusArray = () => {
  const { t } = useLocalization();

  return Object.values(STATUS).map((value) => ({
    id: value,
    name: t.status[`${value}`],
  }));
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
};

export const availablePaymentMethodImages = (
  orderDetails = {},
  isMobile = false
) => {
  // return (
  //   <Image
  //     src="/icons/payments/mada-pay.svg"
  //     alt="mada-pay"
  //     width={100}
  //     height={40}
  //   />
  // );

  // return (
  //   <Image
  //     src="/icons/payments/google-pay.svg"
  //     alt="google-pay"
  //     width={100}
  //     height={40}
  //   />
  // );

  switch (orderDetails?.payment_method) {
    case PAYMENT_METHODS?.credit:
      return (
        <Image
          //   src="/icons/payments/master-card.svg"
          src="/icons/payments/credit-cards.svg"
          alt="credit-card"
          width={isMobile ? 65 : 100}
          height={isMobile ? 26 : 40}
        />
      );
    case PAYMENT_METHODS?.applePay:
      return (
        <Image
          src="/icons/payments/apple-pay.svg"
          alt="apple-pay"
          width={isMobile ? 65 : 100}
          height={isMobile ? 26 : 40}
        />
      );
    case PAYMENT_METHODS?.stcPay:
      return (
        <Image
          src="/icons/payments/stc-pay.svg"
          alt="stc-pay"
          width={isMobile ? 65 : 100}
          height={isMobile ? 26 : 40}
        />
      );
    case PAYMENT_METHODS?.installment:
      return (
        <Image
          src="/icons/payments/sadad-pay.svg"
          alt="sadad-pay"
          width={isMobile ? 65 : 100}
          height={isMobile ? 26 : 40}
        />
      );
    case PAYMENT_METHODS?.banktransfer:
      return (
        <Image
          src="/icons/payments/visa-pay.svg"
          alt="visa-pay"
          width={isMobile ? 65 : 100}
          height={isMobile ? 26 : 40}
        />
      );
    case PAYMENT_METHODS?.tabby:
      return (
        <Image
          src="/icons/payments/tabby-pay.svg"
          alt="tabbby"
          width={isMobile ? 65 : 100}
          height={isMobile ? 26 : 40}
        />
      );
    case PAYMENT_METHODS?.wallet:
      return (
        <Image
          src="/icons/payments/wallet.svg"
          alt="wallet-pay"
          width={isMobile ? 65 : 100}
          height={isMobile ? 26 : 40}
        />
      );
    case PAYMENT_METHODS?.cash:
      return (
        <Image
          src="/icons/payments/cash-pay.svg"
          alt="cash-pay"
          width={isMobile ? 65 : 100}
          height={isMobile ? 26 : 40}
        />
      );
    default:
      return orderDetails?.payment_method;
  }
};

export const availablePaymentMethodText = (
  orderDetails = {},
  t = () => {},
  isMobile = false
) => {
  // return (
  //   <Image
  //     src="/icons/payments/mada-pay.svg"
  //     alt="mada-pay"
  //     width={100}
  //     height={40}
  //   />
  // );

  // return (
  //   <Image
  //     src="/icons/payments/google-pay.svg"
  //     alt="google-pay"
  //     width={100}
  //     height={40}
  //   />
  // );

  switch (orderDetails?.payment_method) {
    case PAYMENT_METHODS?.credit:
      return (
        <Box sx={{ fontSize: "12px", color: "#1C1C28", fontWeight: 700 }}>
          {t.payMethods["CREDIT"]}
        </Box>
      );
    case PAYMENT_METHODS?.applePay:
      return (
        <Box sx={{ fontSize: "12px", color: "#1C1C28", fontWeight: 700 }}>
          {t.payMethods[`APPLE-PAY`]}
        </Box>
      );
    case PAYMENT_METHODS?.stcPay:
      return (
        <Box sx={{ fontSize: "12px", color: "#1C1C28", fontWeight: 700 }}>
          {t.payMethods[`STC-PAY`]}
        </Box>
      );
    case PAYMENT_METHODS?.installment:
      return (
        <Box sx={{ fontSize: "12px", color: "#1C1C28", fontWeight: 700 }}>
          {t.payMethods[`INSTALLMENT`]}
        </Box>
      );
    case PAYMENT_METHODS?.banktransfer:
      return (
        <Box sx={{ fontSize: "12px", color: "#1C1C28", fontWeight: 700 }}>
          {t.payMethods[`BANK-TRANSFER`]}
        </Box>
      );
    case PAYMENT_METHODS?.tabby:
      return (
        <Box sx={{ fontSize: "12px", color: "#1C1C28", fontWeight: 700 }}>
          {t.payMethods[`TABBY`]}
        </Box>
      );
    case PAYMENT_METHODS?.wallet:
      return (
        <Box sx={{ fontSize: "12px", color: "#1C1C28", fontWeight: 700 }}>
          {t.payMethods[`wallet`]}
        </Box>
      );
    case PAYMENT_METHODS?.cash:
      return (
        <Box sx={{ fontSize: "12px", color: "#1C1C28", fontWeight: 700 }}>
          {t.payMethods[`CASH`]}
        </Box>
      );
    default:
      return orderDetails?.payment_method;
  }
};

/* -------------------------------------------------------------------------- */
/*                       generate signature for payfort                       */
/* -------------------------------------------------------------------------- */
export const generateSignature = (params) => {
  let shaString = "";
  // Sort the parameters by key
  const sortedKeys = Object.keys(params).sort();
  // Concatenate key-value pairs
  sortedKeys.forEach((key) => {
    shaString += `${key}=${params[key]}`;
  });
  // Add the secret key at the beginning and end of the string
  shaString = `${process.env.NEXT_PUBLIC_PAYFORT_REQ_PHRASE}${shaString}${process.env.NEXT_PUBLIC_PAYFORT_REQ_PHRASE}`;
  // Generate SHA-256 hash
  const signature = crypto.createHash("sha256").update(shaString).digest("hex");

  return signature;
};
