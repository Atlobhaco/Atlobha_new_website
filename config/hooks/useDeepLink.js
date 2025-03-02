import { useEffect, useState } from "react";

const useDeepLink = () => {
  const [deepLinkData, setDeepLinkData] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it runs on the client

    const initBranch = () => {
      if (window.branch) {
        console.log(
          new URLSearchParams(window?.location?.search).get("_branch_match_id")
        );
        console.log("window.branch:", window?.branch);
        window.branch.init(
          "key_test_cxmWbdwHvdK1l9XnJldEqpdftuk65asG",
          (err, data) => {
            if (err) {
              console.error("Branch init error:", err);
            } else {
              console.log("Branch Initialized", data);

              window.branch.data((err, deepLink) => {
                if (err) {
                  console.error("Branch deep link error:", err);
                } else {
                  console.log("Deep Link Data:", deepLink);
                  setDeepLinkData(deepLink);
                }
              });
            }
          }
        );
      } else {
        console.warn("Branch SDK is not loaded yet.");
      }
    };

    const checkBranch = setInterval(() => {
      if (window.branch) {
        console.log(
          new URLSearchParams(window?.location?.search).get("_branch_match_id")
        );
        console.log("window.branch:", window?.branch);
        clearInterval(checkBranch); // Stop checking
        initBranch();
      }
    }, 500);

    return () => clearInterval(checkBranch);
  }, []);

  return deepLinkData;
};

export default useDeepLink;
