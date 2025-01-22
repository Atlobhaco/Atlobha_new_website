import useLocalization from "@/config/hooks/useLocalization";

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
  midEast: "MideastOrder",
  majdou: "MajdouieMaintenanceReservation",
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
  returnable: "returnable",
};

export const statusArray = () => {
  const { t } = useLocalization();

  return Object.values(STATUS).map((value) => ({
    id: value,
    name: t.status[`${value}`],
  }));
};
