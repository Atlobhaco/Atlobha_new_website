import { useEffect } from "react";

const useBranch = () => {
  useEffect(() => {
    // Check if Branch is already loaded
    if (window.branch) return;

    // Create a script tag to load Branch SDK
    const script = document.createElement("script");
    script.src = "https://cdn.branch.io/branch-latest.min.js";
    script.async = true;

    script.onload = () => {
      // Initialize Branch
      window.branch =
        window.branch ||
        function () {
          window.branch._q.push(arguments);
        };
      window.branch._q = [];
      window.branch._v = 1;

      // Methods to attach to branch object
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
      window.branch.init(
        "key_test_cxmWbdwHvdK1l9XnJldEqpdftuk65asG",
        function (err, data) {
          console.log(err, data);
        }
      );

      // Read latest data
      window.branch.data(function (err, data) {
        // console.log(err, data);
        console.log("data-to-redirect", data?.data_parsed?.$deeplink_path);
      });
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: Remove the script when component unmounts
      document.body.removeChild(script);
    };
  }, []);
};

export default useBranch;
