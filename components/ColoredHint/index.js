import React from "react";
import style from "./ColoredHint.module.scss";
import { Box } from "@mui/material";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function ColoredHint({
  bgColor = "#E7F5FF",
  iconPath = "/icons/orders.svg",
  arrowPath = "/icons/arrow-left.svg",
  header = "لديك طلبات مسعره..",
  subHeader = "اكدها الان قبل انتهاء التسعيرة",
  onClick = () => {},
}) {
  const { isMobile } = useScreenSize();
  return (
    <Box
      sx={{
        background: bgColor,
      }}
      className={`${style["hint"]}`}
    >
      <Box className={`${style["hint-text"]}`}>
        <Box>
          <Image
            alt="img"
            src={iconPath}
            width={isMobile ? 32 : 57}
            height={isMobile ? 32 : 57}
          />
        </Box>
        <Box>
          <Box className={`${style["hint-text_header"]}`}>{header}</Box>
          <Box className={`${style["hint-text_sub"]}`}>{subHeader}</Box>
        </Box>
      </Box>
      <Box className={`${style["hint-icon"]}`} onClick={onClick}>
        <Image
          alt="img"
          src={arrowPath}
          width={isMobile ? 18 : 28}
          height={isMobile ? 18 : 28}
        />
      </Box>
    </Box>
  );
}

export default ColoredHint;
