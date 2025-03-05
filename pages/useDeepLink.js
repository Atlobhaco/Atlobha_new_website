import { isAuth } from "@/config/hooks/isAuth";
import { orderEnumArray } from "@/constants/helpers";
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
];

const useDeepLink = () => {
  const router = useRouter();
  const [branchData, setBranchData] = useState(null);
  const { allGroups } = useSelector((state) => state.appGroups);

  useEffect(() => {
    // Ensure we're running on the client-side
    if (typeof window === "undefined") return;

    // Check if Branch is already loaded
    if (window.branch) {
      window.branch.data((err, data) => {
        if (!err) {
          setBranchData(data || null);
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

  useEffect(() => {
    if (branchData) {
      console.log("branchData", branchData);

      const redirectItemOrderDetails = arrayForRedirect.find(
        (item) =>
          item.$deeplink_path === branchData?.data_parsed?.$deeplink_path
      );

      const redirectItem = arrayForRedirect.find(
        (item) => item.$link_title === branchData?.data_parsed?.$link_title
      );

      console.log("redirectItem", redirectItem);
      console.log("redirectItemOrderDetails", redirectItemOrderDetails);

      //   custom conidtion for order details page
      if (redirectItemOrderDetails) {
        if (redirectItem.mustAuthenticated && isAuth()) {
          const typeOfOrder = orderEnumArray()?.find(
            (item) => item?.id === branchData?.data_parsed?.$deeplink_path
          );
          router.push(
            `/userProfile/myOrders/${branchData?.data_parsed?.id}?type=${typeOfOrder}`
          );
        }
        return;
      }

      if (redirectItem) {
        if (
          (redirectItem.mustAuthenticated && isAuth()) ||
          (!redirectItem.mustAuthenticated && !redirectItem.sectionGroup)
        ) {
          router.push(redirectItem.routeToRedirect);
        } else if (redirectItem.sectionGroup) {
          const findSectionData = allGroups
            ?.flatMap((data) => data?.sections)
            ?.find((item) => item?.type === redirectItem.nameInsideGroup);

          router.push(
            `/sections?secTitle=${findSectionData?.title}&&secType=${findSectionData?.type}`
          );
        }
      }
    }
  }, [branchData]);
  return branchData;
};

export default useDeepLink;
