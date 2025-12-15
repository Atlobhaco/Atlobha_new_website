import { Box } from "@mui/material";
import React from "react";
import style from "../shared/ProductCard/ProductCard.module.scss";
import Image from "next/image";
import useLocalization from "@/config/hooks/useLocalization";

// 'case expressDelivery = 'express-delivery
function ExpressDelivery({ text }) {
  const { t } = useLocalization();

  return (
    <Box
      sx={{
        background: "#6FBC36",
        color: "white",
        position: "relative",
        left: "0px",
        right: "0px",
        fontSize: "13px",
      }}
      className={`${style["prod-label"]}`}
    >
      <Image
        src="/icons/express-delivery.svg"
        alt="express"
        width={20}
        height={20}
        style={{
          marginInlineEnd: "5px",
        }}
      />
      {text || t.expressDilvery}
    </Box>
  );
}

export default ExpressDelivery;
