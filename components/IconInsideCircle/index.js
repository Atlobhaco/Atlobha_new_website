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
  title = false,
  hasNum = false,
}) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  const textStyle = {
    color: "#6B7280",
    textAlign: "center",
    fontSize: isMobile ? "10px" : "24px",
    fontWeight: "700",
    maxWidth: "90px",
    marginTop: isMobile ? "3px" : "2px",
    lineHeight: isMobile ? "16px" : "32px",
  };

  const numStyle = {
    position: "absolute",
    top: "-9px",
    left: "-9px",
    background: "black",
    borderRadius: "50%",
    fontSize: "14px",
    fontWeight: "bold",
    color: "white",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "2px",
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
          position: "relative",
        }}
        onClick={onClick}
      >
        <Image alt={alt} src={iconUrl} width={imgWidth} height={imgHeight} />
        {hasNum > 0 && (
          <Box sx={numStyle} component="span">
            {hasNum}
          </Box>
        )}
      </Box>
      {title ? (
        <Box sx={textStyle}>{title}</Box>
      ) : (
        hasText && <Box sx={textStyle}>{t[hasText]}</Box>
      )}
    </Box>
  );
}

export default IconInsideCircle;
