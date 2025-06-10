import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import Image from "next/image";
import crypto from "crypto";
import { ORDERSENUM, PAYMENT_METHODS, PRODUCT_TYPES, STATUS } from "./enums";
import { useEffect, useRef } from "react";
import isEqual from "lodash.isequal";

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
    case PAYMENT_METHODS?.tamara:
      return (
        <Image
          src="/icons/payments/tamara-pay.svg"
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
    case PAYMENT_METHODS?.tamara:
      return (
        <Box sx={{ fontSize: "12px", color: "#1C1C28", fontWeight: 700 }}>
          {t.payMethods[`tamara`]}
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

/* -------------------------------------------------------------------------- */
/*                        generate signature apple pay                        */
/* -------------------------------------------------------------------------- */
export const generateSignatureApplePay = (params) => {
  const shaRequestPhrase =
    process.env.NEXT_PUBLIC_APPLE_REQ_PHRASE || "$2y$10$Ea43N9LFe";

  const formatObject = (obj) => {
    return `{${Object.entries(obj)
      .map(([key, value]) => `${key}=${value}`)
      .join(", ")}}`;
  };

  let formattedString = "";

  // Sort keys to maintain consistent ordering
  const sortedKeys = Object.keys(params).sort();

  sortedKeys.forEach((key) => {
    const value = params[key];

    if (typeof value === "object" && value !== null) {
      formattedString += `${key}=${formatObject(value)}`;
    } else {
      formattedString += `${key}=${value}`;
    }
  });
  let concatenatedString = `${shaRequestPhrase}${formattedString}${shaRequestPhrase}`;

  const signature = crypto
    .createHash("sha256")
    .update(concatenatedString)
    .digest("hex");

  return signature;
};

/* -------------------------------------------------------------------------- */
/*                            riyal colored images                            */
/* -------------------------------------------------------------------------- */
export const riyalImgBlack = () => {
  return (
    <Image src="/icons/riyal-black.svg" width={20} height={20} alt="riyal" />
  );
};
export const riyalImgRed = () => {
  return (
    <Image src="/icons/riyal-red.svg" width={20} height={20} alt="riyal-red" />
  );
};
export const riyalImgOrange = () => {
  return (
    <Image
      src="/icons/riyal-orange.svg"
      width={20}
      height={20}
      alt="riyal-orange"
    />
  );
};
export const riyalImgGrey = (width, height) => {
  return (
    <Image
      src="/icons/riyal-grey.svg"
      width={width || 20}
      height={height || 20}
      alt="riyal-grey"
    />
  );
};
/* -------------------------------------------------------------------------- */
/*                check if there is any change happen in array                */
/* -------------------------------------------------------------------------- */
export const useArrayChangeDetector = (array, onChange) => {
  const prevRef = useRef();

  useEffect(() => {
    if (prevRef.current && !isEqual(prevRef.current, array)) {
      onChange(prevRef.current, array); // You get both old and new values
    }

    prevRef.current = array;
  }, [array, onChange]);
};
/* -------------------------------------------------------------------------- */
/*                          product types localizaed                          */
/* -------------------------------------------------------------------------- */
export const prodTypeArray = () => {
  const { t } = useLocalization();

  return Object.values(PRODUCT_TYPES).map((value) => ({
    id: value,
    name: t.types[`${value}`],
  }));
};
/* -------------------------------------------------------------------------- */
/*                       webengage add remove from cart                       */
/* -------------------------------------------------------------------------- */
export const addRemoveFromCartEngage = ({
  prod,
  action,
  productInsideBasket,
}) => {
  const qty = () => {
    if (action === "increment") {
      return (productInsideBasket?.quantity || 0) + 1;
    }
    if (action === "decrement") {
      return productInsideBasket?.quantity - 1;
    }
    if (action === "delete") {
      return 0;
    }
  };

  const actions = () => {
    if (action === "decrement" || action === "delete") {
      return "REMOVE_FROM_CART";
    } else {
      return "ADD_TO_CART";
    }
  };

  window.webengage.onReady(() => {
    webengage.track(actions(), {
      product_name: prod?.name || "",
      product_image: prod?.image || "",
      product_id: prod?.id || "",
      price: prod?.price || "",
      car_brand: prod?.brand?.name || "",
      car_model: prod?.model?.name || "",
      car_year: prod?.year || "",
      reference_number: prod?.ref_num || "",
      category: prod?.marketplace_category?.name || "",
      quantity: qty() || 0,
      product_url: `/product/${prod?.id}` || "",
    });
  });
};

/* -------------------------------------------------------------------------- */
/*                        latest updated cart webengage                       */
/* -------------------------------------------------------------------------- */

export const latestUpdatedCart = (basket = []) => {
  const activeItems = basket.filter((item) => item?.product?.is_active);
  const totalOfBasket = activeItems
    .reduce((sum, item) => sum + item.quantity * item.product.price, 0)
    .toFixed(2);

  const itemsMapping = activeItems.map((item) => ({
    Id: item?.product?.id || "",
    Title: item?.product?.name || "",
    Price: item?.product?.price || "",
    Quantity: item?.quantity || "",
    Image: item?.product?.image || "",
  }));

  if (typeof window.webengage === "undefined") return;

  window.webengage?.onReady(() => {
    webengage.track(CART_UPDATED, {
      total: totalOfBasket,
      number_of_products: activeItems.length,
      line_items: itemsMapping,
    });
  });
};
