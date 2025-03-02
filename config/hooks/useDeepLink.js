import { useEffect, useState } from "react";

const useDeepLink = () => {
  const [deepLinkData, setDeepLinkData] = useState(null);

  const fetchBranchData = async (matchId) => {
    try {
      const response = await fetch(`/api/getBranchData?matchId=${matchId}`);
      if (!response.ok) throw new Error("Branch.io fetch failed");

      const data = await response.json();
      console.log("Branch Metadata:", data);

      // Redirect based on Branch.io data
    //   if (data.data && data.data.redirectTo) {
    //     router.replace(data.data.redirectTo);
    //   }
    } catch (error) {
      console.error("Error fetching Branch.io data:", error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it runs on the client

    const initBranch = () => {
      if (window.branch) {
        const branchMatchId = new URLSearchParams(window?.location?.search).get(
          "_branch_match_id"
        );
        if (branchMatchId) {
          fetchBranchData(branchMatchId);
        }
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
        clearInterval(checkBranch); // Stop checking
        initBranch();
      }
    }, 500);

    return () => clearInterval(checkBranch);
  }, []);

  return deepLinkData;
};

export default useDeepLink;
