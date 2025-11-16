import React from "react";
import { Box } from "@mui/material";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useLocalization from "@/config/hooks/useLocalization";
import { riyalImgBlack } from "@/constants/helpers";

function ShowGiftSummary({ giftCardDetails }) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  const header = {
    color: "#232323",
    fontSize: isMobile ? "16px" : "22px",
    fontWeight: "700",
    mb: 1,
  };
  const text = {
    color: "#232323",
    fontSize: isMobile ? "12px" : "15px",
    fontWeight: "500",
  };

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : "50%",
        mb: 5,
      }}
    >
      <Box sx={header}>{t.orderSummary}</Box>
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.giftCardValue}</Box>
        <Box sx={text}>
          {giftCardDetails?.price} {riyalImgBlack()}
        </Box>
      </Box>
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.quantity}</Box>
        <Box sx={text}>1</Box>
      </Box>
    </Box>
  );
}

export default ShowGiftSummary;
