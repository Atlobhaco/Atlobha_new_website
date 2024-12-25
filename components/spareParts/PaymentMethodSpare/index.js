import { Box } from "@mui/material";
import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useLocalization from "@/config/hooks/useLocalization";

function PaymentMethodSpare() {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  return (
    <Box>
      <Box
        sx={{
          fontSize: isMobile ? "16px" : "20px",
          fontWeight: "700",
          mb: 1,
        }}
      >
        {t.paymentMethod}
      </Box>
      <Box
        sx={{
          background: "rgba(224, 110, 14, 0.10)",
          color: "#E06E0E",
          minHeight: "40px",
          padding: isMobile ? "8px 15px" : "8px 20px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: isMobile ? "12px" : "14px",
          fontWeight: "500",
          mx: isMobile ? 2 : 0,
        }}
      >
        <ErrorIcon />
        {t.determinePaymentMethod}
      </Box>
    </Box>
  );
}

export default PaymentMethodSpare;
