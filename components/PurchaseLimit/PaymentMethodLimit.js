import useLocalization from "@/config/hooks/useLocalization";
import { PAYMENT_METHODS } from "@/constants/enums";
import { availablePaymentMethodImages } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React from "react";
import SharedBtn from "../shared/SharedBtn";

function PaymentMethodLimit({ payMethodKey, setOpenHint }) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  const isTabby = payMethodKey === PAYMENT_METHODS?.tabby;
  const methodLabel = isTabby ? t.payMethods.TABBY : t.payMethods.mis;

  return (
    <Box>
      {/* Logo */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        {availablePaymentMethodImages(
          { payment_method: payMethodKey },
          isMobile
        )}
      </Box>

      {/* Title */}
      <Box
        component={isMobile ? "h5" : "h3"}
        sx={{ textAlign: "center", color: "black", mb: 3 }}
      >
        {t.installmentBy} {methodLabel}!
      </Box>

      {/* Messages */}
      <Box
        sx={{
          fontSize: isMobile ? "12px" : "15px",
          fontWeight: 400,
          color: "#0F172A",
          mb: 3,
          mx: isMobile ? 2 : 4,
          textAlign: "center",
        }}
      >
        {isTabby ? t.canNotPayWithTabby : t.canNotPayWithMis}
      </Box>

      <Box
        sx={{
          fontSize: isMobile ? "12px" : "15px",
          fontWeight: 500,
          color: "#0F172A",
          mb: 3,
          mx: isMobile ? 2 : 4,
          textAlign: "center",
        }}
      >
        {isTabby ? t.enjoyTabbyInstallment : t.enjoyMisInstallment}
      </Box>

      {/* Button */}
      <SharedBtn
        text="okFine"
        className="big-main-btn"
		customClass="w-100"
        onClick={() => setOpenHint({ open: false, selectedMethod: false })}
      />
    </Box>
  );
}

export default PaymentMethodLimit;
