import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const arrayForRedirect = [
  {
    $link_title: "Pricing",
    routeToRedirect: "/spareParts",
    sectionGroup: false,
  },
  {
    $link_title: "TestDrive",
    routeToRedirect: null,
    sectionGroup: true,
    nameInsideGroup: "test-drive",
  },
  {
    $link_title: "Najm",
    routeToRedirect: null,
    sectionGroup: true,
    nameInsideGroup: "najm-and-estimation",
  },
  {
    $link_title: "Maintenance",
    routeToRedirect: null,
    sectionGroup: true,
    nameInsideGroup: "services",
  },
];

const useBranch = () => {
  const router = useRouter();
  const [branchData, setBranchData] = useState(null);
  const { allGroups } = useSelector((state) => state.appGroups);
  console.log("allGroups", allGroups?.map((data) => data?.sections)?.flat());
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
          "key_test_cxmWbdwHvdK1l9XnJldEqpdftuk65asG",
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
      const redirectItem = arrayForRedirect.find(
        (item) => item.$link_title === branchData?.data_parsed?.$link_title
      );

      console.log("redirectItem", redirectItem);

      if (redirectItem && !redirectItem?.routeToRedirect) {
        router.push(redirectItem?.routeToRedirect);
      }

      if (redirectItem && redirectItem?.routeToRedirect) {
        const findSectionData = allGroups
          ?.map((data) => data?.sections)
          ?.flat()
          ?.find((item) => item.type === redirectItem?.nameInsideGroup);

        router.push(
          `/sections?secTitle=${findSectionData?.title}&&secType=${findSectionData?.type}`
        );
      }
    }
  }, [branchData]);
  return branchData;
};

export default useBranch;
