import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useBranch = () => {
  const router = useRouter();
  const [branchData, setBranchData] = useState(null);

  useEffect(() => {
    // Ensure we're running on the client-side
    if (typeof window === "undefined") return;

    // Check if Branch is already loaded
    if (window.branch) {
      window.branch.data((err, data) => {
        if (!err) {
          console.log("data-to-redirect", data?.data_parsed?.$deeplink_path);
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
              console.log(
                "data-to-redirect-succes",
                data?.data_parsed?.$deeplink_path
              );
              setBranchData(data || null);
            }
          }
        );

        window.branch.data((err, data) => {
          if (!err) {
            console.log("data-to-redirect", data?.data_parsed?.$deeplink_path);
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
      console.log(branchData);
    }
  }, [branchData]);
  return branchData;
};

export default useBranch;
