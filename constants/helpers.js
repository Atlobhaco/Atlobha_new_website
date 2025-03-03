import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import Image from "next/image";
import crypto from "crypto";
import { ORDERSENUM, PAYMENT_METHODS, STATUS } from "./enums";

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

export const getAddressFromLatLng = async (lat, lng, locale) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Replace with your Google API Key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=${locale}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      // Find city (locality) and area (sublocality)
      const city =
        data.results.find((result) => result.types.includes("locality"))
          ?.address_components[0].long_name || "";

      const area =
        data.results.find((result) => result.types.includes("political"))
          ?.address_components[0].long_name || "";

      return { city, area }; // Return both city and area
    } else {
      return { city: "", area: "" };
    }
  } catch (error) {
    return { city: "", area: "" };
  }
};

/* -------------------------------------------------------------------------- */
/*                           localize address naming                          */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/*                    used in  filters  in endpoint calling                   */
/* -------------------------------------------------------------------------- */
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
/* -------------------------------------------------------------------------- */
/*                            order enum localized                            */
/* -------------------------------------------------------------------------- */
export const orderEnumArray = () => {
  const { t } = useLocalization();

  return Object.values(ORDERSENUM).map((value) => ({
    id: value,
    name: t.order[`${value}`],
  }));
};

/* -------------------------------------------------------------------------- */
/*                            status enum localized                           */
/* -------------------------------------------------------------------------- */
export const statusArray = () => {
  const { t } = useLocalization();

  return Object.values(STATUS).map((value) => ({
    id: value,
    name: t.status[`${value}`],
  }));
};

/* -------------------------------------------------------------------------- */
/*                      available payment methods images                      */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/*                       available payment methods text                       */
/* -------------------------------------------------------------------------- */
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
  console.log("signature", signature);

  return signature;
};

/* -------------------------------------------------------------------------- */
/*                        generate signature apple pay                        */
/* -------------------------------------------------------------------------- */

export const generateApplePaySignature = (params) => {
  const shaRequestPhrase =
    process.env.NEXT_PUBLIC_APPLE_REQ_PHRASE || "$2y$10$Ea43N9LFe"; // Use actual SHA phrase

  // Construct signature string
  let signatureString = shaRequestPhrase;
  Object.keys(params)
    .sort()
    .forEach((key) => {
      signatureString += `${key}=${params[key]}`;
    });
  signatureString += shaRequestPhrase;
  console.log("signatureString", signatureString);
  // Generate HMAC-SHA256 hash and convert to uppercase
  const signature = crypto
    .createHmac("sha256", shaRequestPhrase) // Use HMAC instead of SHA-256
    .update(signatureString, "utf-8")
    .digest("hex")
    .toUpperCase();

  console.log("Generated Apple Pay Signature:", signature);
  return signature?.toLowerCase();
};
/* -------------------------------------------------------------------------- */
/*                         second  generate signature                         */
/* -------------------------------------------------------------------------- */

export const generateSignatureApple = (params) => {
  let shaString = "";
  const shaRequestPhrase =
    process.env.NEXT_PUBLIC_APPLE_REQ_PHRASE || "your_request_phrase";

  // Sort keys alphabetically
  const sortedKeys = Object.keys(params).sort();

  sortedKeys.forEach((key) => {
    if (Array.isArray(params[key])) {
      let shaSubString = "{";
      Object.entries(params[key]).forEach(([k, v]) => {
        shaSubString += `${k}=${v}, `;
      });
      shaSubString = shaSubString.slice(0, -2) + "}"; // Remove trailing comma
      shaString += `${key}=${shaSubString}`;
    } else {
      shaString += `${key}=${String(params[key])}`; // Ensure value is string
    }
  });

  // Add request phrase at the beginning and end
  shaString = `${shaRequestPhrase}${shaString}${shaRequestPhrase}`;

  // Generate SHA-256 hash
  return crypto.createHash("sha256").update(shaString, "utf-8").digest("hex");
};

/* -------------------------------------------------------------------------- */
/*                           generate hmac signature                          */
/* -------------------------------------------------------------------------- */
export const generateHmacSignature = (params) => {
  const shaRequestPhrase =
    process.env.NEXT_PUBLIC_APPLE_REQ_PHRASE || "your_request_phrase";

  // Step 1: Sort parameters by key
  const sortedKeys = Object.keys(params).sort();

  // Step 2: Concatenate parameters into a string
  let concatenatedString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("");

  // Step 3: Add SHA Request Phrase at the beginning and end
  concatenatedString = `${shaRequestPhrase}${concatenatedString}${shaRequestPhrase}`;

  // Step 4: Generate HMAC-SHA512 signature
  const hmac = crypto
    .createHmac("sha512", shaRequestPhrase) // Using HMAC-SHA512
    .update(concatenatedString, "utf-8")
    .digest("hex");

  return hmac.toUpperCase(); // Convert to uppercase as required
};

