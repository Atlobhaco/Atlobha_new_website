import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import LogoLoader from "@/components/LogoLoader";
import { Box } from "@mui/material";

// page for know that the payment gate way has failed
// save payment_failed to can trigger paymentFailChekcer
function Failed() {
  const router = useRouter();

  useEffect(() => {
    Cookies.set("payment_failed", "failed", { expires: 1, path: "/" });
    const url_after_pay_failed = Cookies.get("url_after_pay_failed");

    setTimeout(() => {
      router.push(url_after_pay_failed || "/checkout");
    }, 500);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 3,
      }}
    >
      <LogoLoader />
    </Box>
  );
}

export default Failed;
