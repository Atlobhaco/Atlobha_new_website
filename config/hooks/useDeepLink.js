import { useEffect } from "react";

const useDeepLink = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.branch) {
      window.branch.data((err, data) => {
        if (err) {
          console.error("Branch deep link error:", err);
        } else {
          console.log("Deep Link Data:", data);
        }
      });
    }
  }, []);
};

export default useDeepLink;
