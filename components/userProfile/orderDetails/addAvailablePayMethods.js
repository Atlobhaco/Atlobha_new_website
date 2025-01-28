import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function AddAvailablePayMethods() {
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
        <Image src="/icons/yellow-card.svg" alt="card" width={20} height={20} />
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
      still under progress
      {/* <Box sx={{ mt: 1 }}>{availablePaymentMethod()}</Box> */}
    </Box>
  );
}

export default AddAvailablePayMethods;
