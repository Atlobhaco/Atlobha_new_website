import useLocalization from "@/config/hooks/useLocalization";
import {
  availablePaymentMethodImages,
  availablePaymentMethodText,
} from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function PaymentMethodOrder({ orderDetails = {} }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  return (
    <Box
      sx={{
        padding: "16px 13px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Image
          loading="lazy"
          src="/icons/yellow-card.svg"
          alt="card"
          width={20}
          height={20}
        />
        <Box
          sx={{
            color: "#232323",
            fontSize: isMobile ? "14px" : "20px",
            fontWeight: "700",
            lineHeight: "30px",
            letterSpacing: "-0.4px",
          }}
        >
          {t.availablePayments}
        </Box>
      </Box>
      <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 2 }}>
        {availablePaymentMethodImages(orderDetails, isMobile)}
        {availablePaymentMethodText(orderDetails, t, isMobile)}
      </Box>
    </Box>
  );
}

export default PaymentMethodOrder;
