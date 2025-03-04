import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useDeepLink = () => {
  const router = useRouter();

  const [deepLinkData, setDeepLinkData] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it runs on the client

    const initBranch = async () => {
      if (window.branch) {
        window.branch.init(
          "key_test_cxmWbdwHvdK1l9XnJldEqpdftuk65asG",
          (err, data) => {
            if (err) {
              console.error("Branch init error:", err);
            } else {
              console.log("Branch Initialized", data);
              setDeepLinkData(data);
              window.branch.data((err, deepLink) => {
                if (err) {
                  console.error("Branch deep link error:", err);
                } else {
                  console.log("Deep Link Data:", deepLink);
                  //   setDeepLinkData(deepLink);
                }
              });
            }
          }
        );
        window.branch.data(function (err, data) {
          console.log(err, data);
        });
      } else {
        console.warn("Branch SDK not loaded yet.");
      }
    };

    initBranch();
  }, [router]);

  return deepLinkData || "no-data";
};

export default useDeepLink;
