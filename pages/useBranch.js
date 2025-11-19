import { isAuth } from "@/config/hooks/isAuth";
import { checkApplePayAvailability } from "@/constants/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SERVICES } from "../constants/enums";

const defaultProps = {
  $link_title: "",
  $deeplink_path: "",
  routeToRedirect: null,
  sectionGroup: false,
  nameInsideGroup: "",
  mustAuthenticated: false,
};

const arrayForRedirect = [
  {
    ...defaultProps,
    $link_title: "Pricing",
    routeToRedirect: "/spareParts",
  },
  {
    ...defaultProps,
    $link_title: "OrderList",
    routeToRedirect: "/userProfile/myOrders/",
    mustAuthenticated: true,
  },
  {
    ...defaultProps,
    $link_title: "Gifts",
    routeToRedirect: "/userProfile/gift",
    mustAuthenticated: true,
  },
  {
    ...defaultProps,
    $deeplink_path: "SparePartsOrder",
    mustAuthenticated: true,
  },
  {
    ...defaultProps,
    $deeplink_path: "MarketplaceProduct",
  },
  {
    ...defaultProps,
    $deeplink_path: "MarketplaceCategory",
  },
  {
    ...defaultProps,
    $deeplink_path: "Service",
  },
  {
    ...defaultProps,
    $deeplink_path: "MarketplaceSubcategory",
  },
  {
    ...defaultProps,
    $deeplink_path: "ServiceCategory",
  },
  {
    ...defaultProps,
    $link_title: "TestDrive",
    sectionGroup: true,
    nameInsideGroup: "test-drive",
  },
  {
    ...defaultProps,
    $link_title: "Taqdeer",
    sectionGroup: true,
    nameInsideGroup: "najm-and-estimation",
  },
  {
    ...defaultProps,
    $link_title: "Maintenance",
    sectionGroup: true,
    nameInsideGroup: "services",
  },
  {
    ...defaultProps,
    $link_title: "DownloadApp",
    routeToRedirect: checkApplePayAvailability()
      ? "https://apps.apple.com/sa/app/%D8%A7%D8%B7%D9%84%D8%A8%D9%87%D8%A7-%D9%82%D8%B7%D8%B9-%D8%BA%D9%8A%D8%A7%D8%B1-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA/id1415692116?l=ar"
      : `https://play.google.com/store/apps/details?id=com.atlobha.atlobha&referrer=utm_source%3Dtelegram%2520group%26utm_medium%3Dcs95%26anid%3Dadmob`,
  },
];

const useBranch = () => {
  const router = useRouter();
  const [branchData, setBranchData] = useState(null);
  const { allGroups } = useSelector((state) => state.appGroups);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // HARD FIX FOR SAFARI + FIREFOX
    const initializeBranch = () => {
      if (!window.branch) return;

      window.branch.init(
        process.env.NEXT_PUBLIC_BRACNH_DASHBOARD,
        (err, data) => {
          if (err) {
            console.error("Branch init failed:", err);
          } else {
            setBranchData(data || null);
          }
        }
      );

      // Safari sometimes delays branch.data()
      window.branch.data((err, data) => {
        if (!err) {
          setBranchData(data || null);
        }
      });
    };

    // If SDK already exists → init directly
    if (window.branch) {
      initializeBranch();
      return;
    }

    // ELSE: load script
    const script = document.createElement("script");
    script.src = "https://cdn.branch.io/branch-latest.min.js";
    script.async = true;

    script.onload = () => {
      // Safari fix: ensure SDK fully ready
      setTimeout(() => initializeBranch(), 200);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 🟦 Safari fix: retry redirection when branchData changes
  useEffect(() => {
    if (!branchData) return;

    const parsed = branchData?.data_parsed;
    if (!parsed) return;

    const redirectItemOrderDetails = arrayForRedirect.find(
      (item) => item.$deeplink_path === parsed?.$deeplink_path
    );

    const redirectItem = arrayForRedirect.find(
      (item) => item.$link_title === parsed?.$link_title
    );

    // SAFARI FIX: ensure router is ready
    if (!router.isReady) {
      setTimeout(() => router.replace(router.asPath), 50);
      return;
    }

    // ---- ORDER DETAILS REDIRECT ----
    if (redirectItemOrderDetails) {
      if (
        redirectItemOrderDetails.mustAuthenticated &&
        isAuth() &&
        redirectItemOrderDetails.$deeplink_path === "SparePartsOrder"
      ) {
        router.push(
          `/userProfile/myOrders/${parsed?.id}?type=${parsed?.$deeplink_path}`
        );
        return;
      }

      if (parsed?.$deeplink_path === "MarketplaceProduct") {
        router.push(`/product/${parsed?.id}`);
        return;
      }

      if (parsed?.$deeplink_path === "MarketplaceCategory") {
        router.push(`/category/${parsed?.id}`);
        return;
      }

      if (parsed?.$deeplink_path === "Service") {
        router.push(
          `/service/${
            parsed?.id
          }/?portableService=no-info&secType=${SERVICES}&name=${
            parsed?.$og_title || ""
          }`
        );
        return;
      }

      if (parsed?.$deeplink_path === "MarketplaceSubcategory") {
        router.push(`/category/${parsed?.custom_data?.category_id}`);
        return;
      }

      if (parsed?.$deeplink_path === "ServiceCategory") {
        router.push(`/serviceCategory/${parsed?.id}`);
        return;
      }
    }

    // ---- NORMAL REDIRECTIONS ----
    if (redirectItem) {
      if (
        (redirectItem.mustAuthenticated && isAuth()) ||
        (!redirectItem.mustAuthenticated && !redirectItem.sectionGroup)
      ) {
        router.push(redirectItem.routeToRedirect);
        return;
      }

      if (redirectItem.sectionGroup) {
        const findSectionData = allGroups
          ?.flatMap((data) => data?.sections)
          ?.find((item) => item?.type === redirectItem.nameInsideGroup);

        router.push(
          `/sections?secTitle=${findSectionData?.title}&&secType=${findSectionData?.type}`
        );
      }
    }
  }, [branchData, router.isReady]);

  return branchData;
};

export default useBranch;
