import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React from "react";

function AdvertiseHint() {
  const { isMobile } = useScreenSize();

  const { locale } = useLocalization();
  const bgColor = (type) => {
    switch (type) {
      case "red":
        return "#EB3C24";
      case "yellow":
        return "#FFD400";
      default:
        return "#1FB256";
    }
  };

  return (
    <Box
      sx={{
        background: bgColor("red"),
        color: "white",
        display: "flex",
        height: isMobile ? "25px" : "30px",
        padding: isMobile ? "3px 4px" : "6px 10px",
        alignItems: "center",
        gap: "10px",
        borderRadius: "4px",
        width: "fit-content",
        fontWeight: "500",
        fontSize: isMobile ? "10px" : "14px",
        overflow: "hidden", // Ensures smooth animation within the box
        position: "relative",
        "&:hover span": {
          animationPlayState: "paused", // Pause animation on hover
        },
      }}
    >
      <Box
        component="span"
        sx={{
          display: "inline-block",
          whiteSpace: "nowrap", // Prevents text wrapping
          animation: "slide 10s linear infinite", // Animates the text
          animationPlayState: "running", // Ensures the animation runs by default
        }}
      >
        🚚 توصيل مجاني على جميع باقات الصيانة 📦
      </Box>

      {/* Define the keyframes for animation */}
      <style>
        {`
          @keyframes slide {
            0% {
              transform: translateX(${
                locale === "ar" ? "100%" : "-100%"
              }); /* Start outside the container */
            }
            100% {
              transform: translateX(${
                locale === "ar" ? "-100%" : "100%"
              }); /* End outside the container */
            }
          }
        `}
      </style>
    </Box>
  );
}

export default AdvertiseHint;
