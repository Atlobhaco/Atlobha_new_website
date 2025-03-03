import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useBranch = () => {
  const router = useRouter();
  const [branchData, setBranchData] = useState(null); // State to store data

  useEffect(() => {
    if (window.branch) return;

    const script = document.createElement("script");
    script.src = "https://cdn.branch.io/branch-latest.min.js";
    script.async = true;

    script.onload = () => {
      window.branch =
        window.branch ||
        function () {
          window.branch._q.push(arguments);
        };
      window.branch._q = [];
      window.branch._v = 1;

      const methods = [
        "addListener",
        "banner",
        "closeBanner",
        "closeJourney",
        "data",
        "deepview",
        "deepviewCta",
        "first",
        "init",
        "link",
        "logout",
        "removeListener",
        "setBranchViewData",
        "setIdentity",
        "track",
        "trackCommerceEvent",
        "logEvent",
        "disableTracking",
        "getBrowserFingerprintId",
        "crossPlatformIds",
        "lastAttributedTouchData",
        "setAPIResponseCallback",
        "qrCode",
        "setRequestMetaData",
        "setAPIUrl",
        "getAPIUrl",
        "setDMAParamsForEEA",
      ];

      methods.forEach((method) => {
        window.branch[method] = function () {
          window.branch._q.push([method, arguments]);
        };
      });

      // Initialize Branch SDK
      window.branch.init(
        "key_test_cxmWbdwHvdK1l9XnJldEqpdftuk65asG",
        (err, data) => {
          if (err) {
            console.error("Branch initialization failed:", err);
          } else {
            console.log("Branch initialized successfully:", data);
          }
        }
      );

      // Read latest data and update state
      window.branch.data((err, data) => {
        if (!err) {
          if (data?.data_parsed?.$deeplink_path) {
            console.log("data-to-redirect", data?.data_parsed?.$deeplink_path);
            setBranchData(data || null); // Store data in state
          }
        }
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  return branchData; // Return the stored data from state
};

export default useBranch;
