import { isAuth } from "@/config/hooks/isAuth";
import { checkApplePayAvailability } from "@/constants/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
  const clearBranchData = () => {
    window.location.reload();
    setTimeout(() => {
      setBranchData(null);
    }, 500);
  };

  useEffect(() => {
    // Ensure we're running on the client-side
    if (typeof window === "undefined") return;

    // Check if Branch is already loaded
    if (window.branch) {
      window.branch.data((err, data) => {
        if (!err) {
          console.log("data", data);
          setBranchData(data || null);
          clearBranchData();
        }
      });
      return;
    }

    // Load Branch SDK
    const script = document.createElement("script");
    script.src = "https://cdn.branch.io/branch-latest.min.js";
    script.async = true;

    script.onload = () => {
      if (window.branch) {
        window.branch.init(
          process.env.NEXT_PUBLIC_BRACNH_DASHBOARD,
          (err, data) => {
            if (err) {
              console.error("Branch initialization failed:", err);
            } else {
              console.log("Branch initialized successfully:", data);
              setBranchData(data || null);
            }
          }
        );

        window.branch.data((err, data) => {
          if (!err) {
            setBranchData(data || null);
          }
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup script on unmount
    };
  }, [router]);

  console.log("branchData", branchData);

  useEffect(() => {
    if (branchData) {
      const redirectItemOrderDetails = arrayForRedirect.find(
        (item) =>
          item.$deeplink_path === branchData?.data_parsed?.$deeplink_path
      );

      const redirectItem = arrayForRedirect.find(
        (item) => item.$link_title === branchData?.data_parsed?.$link_title
      );

      //   custom conidtion for order details page
      if (redirectItemOrderDetails) {
        // redirect to sparePartsOrder
        if (
          redirectItemOrderDetails?.mustAuthenticated &&
          isAuth() &&
          redirectItemOrderDetails?.$deeplink_path === "SparePartsOrder"
        ) {
          router.push(
            `/userProfile/myOrders/${branchData?.data_parsed?.id}?type=${branchData?.data_parsed?.$deeplink_path}`
          );
          clearBranchData();
        }
        // redirect to markeplace product
        if (redirectItemOrderDetails?.$deeplink_path === "MarketplaceProduct") {
          router.push(`/product/${branchData?.data_parsed?.id}`);
          clearBranchData();
        }
        // redirect to marketplace category
        if (
          redirectItemOrderDetails?.$deeplink_path === "MarketplaceCategory"
        ) {
          router.push(`/category/${branchData?.data_parsed?.id}`);
          clearBranchData();
        }
        // redirect to service category
        if (redirectItemOrderDetails?.$deeplink_path === "ServiceCategory") {
          router.push(`/serviceCategory/${branchData?.data_parsed?.id}`);
          clearBranchData();
        }
        return;
      }

      if (redirectItem) {
        if (
          (redirectItem?.mustAuthenticated && isAuth()) ||
          (!redirectItem?.mustAuthenticated && !redirectItem?.sectionGroup)
        ) {
          router.push(redirectItem.routeToRedirect);
          clearBranchData();
        } else if (redirectItem.sectionGroup) {
          const findSectionData = allGroups
            ?.flatMap((data) => data?.sections)
            ?.find((item) => item?.type === redirectItem.nameInsideGroup);

          router.push(
            `/sections?secTitle=${findSectionData?.title}&&secType=${findSectionData?.type}`
          );
          clearBranchData();
        }
      }
    }
  }, [branchData]);
  return branchData;
};

export default useBranch;
