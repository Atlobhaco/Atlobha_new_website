import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function IconInsideCircle({
  iconUrl = "/icons/circles.svg",
  onClick = () => {},
  bgColor = false,
  alt = "icon",
  width = "41px",
  height = "41px",
  imgWidth = "22",
  imgHeight = "22",
  hasBorder = true,
  hasBoxShadow = true,
  hasText = false,
}) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  const textStyle = {
    color: "#6B7280",
    textAlign: "center",
    fontSize: isMobile ? "10px" : "24px",
    fontWeight: "700",
    maxWidth: "90px",
    marginTop: isMobile ? "3px" : "1px",
    lineHeight: isMobile ? "16px" : "32px",
  };

  return (
    <Box
      sx={{
        width: "fit-content",
      }}
    >
      <Box
        sx={{
          background: bgColor || "white",
          width: { width },
          height: { height },
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: hasBorder ? "2px solid #D1D5DB" : "unset",
          boxShadow: hasBoxShadow
            ? "0px 8.946px 19.681px 0px rgba(0, 0, 0, 0.15)"
            : "unset",
          "&:hover": {
            opacity: "0.8",
          },
        }}
        onClick={onClick}
      >
        <Image alt={alt} src={iconUrl} width={imgWidth} height={imgHeight} />
      </Box>
      {hasText && <Box sx={textStyle}>{t[hasText]}</Box>}
    </Box>
  );
}

export default IconInsideCircle;
