import { Box } from "@mui/material";
import React from "react";
import style from "../shared/ProductCard/ProductCard.module.scss";
import Image from "next/image";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";

// 'case expressDelivery = 'express-delivery
function ExpressDelivery({ text }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  return (
    <Box
      sx={{
        background: "#6FBC36",
        color: "white",
        position: "relative",
        left: "0px",
        right: "0px",
        fontSize: isMobile ? "10px" : "13px",
      }}
      className={`${style["prod-label"]}`}
    >
      <Image
        src="/icons/express-delivery.svg"
        alt="express"
        width={isMobile ? 15 : 20}
        height={isMobile ? 15 : 20}
        style={{
          marginInlineEnd: isMobile ? "3px" : "5px",
        }}
      />
      {text || t.expressDilvery}
    </Box>
  );
}

export default ExpressDelivery;
