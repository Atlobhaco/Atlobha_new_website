import { useEffect, useState } from "react";

const useDeepLink = () => {
  const [deepLinkData, setDeepLinkData] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it's running on the client

    const checkBranch = setInterval(() => {
      if (window.branch) {
        clearInterval(checkBranch); // Stop checking

        window.branch.data((err, data) => {
          if (err) {
            console.error("Branch deep link error:", err);
          } else {
            console.log("Deep Link Data:", data);
            setDeepLinkData(data);
          }
        });
      }
    }, 500); // Check every 500ms until Branch is ready

    return () => clearInterval(checkBranch);
  }, []);

  return deepLinkData;
};

export default useDeepLink;
