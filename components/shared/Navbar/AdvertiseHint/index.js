import { ANNOUNCEMENT } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { MARKETPLACE, SPAREPARTS } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

function AdvertiseHint() {
  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const router = useRouter();
  const { secTitle, secType } = router.query;

  const theDesiredPageIs =
    secType || (router?.pathname === "/spareParts" ? SPAREPARTS : MARKETPLACE);

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

  const { data: informativeMsg } = useCustomQuery({
    name: [
      "getInformativeMessage",
      theDesiredPageIs,
      selectedAddress?.lat || defaultAddress?.lat,
    ],
    url: `${ANNOUNCEMENT}/?lat=${
      selectedAddress?.lat || defaultAddress?.lat
    }&lng=${
      selectedAddress?.lng || defaultAddress?.lng
    }&type=information&app_section=${theDesiredPageIs}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled:
      (selectedAddress?.lat || defaultAddress?.lat) &&
      (selectedAddress?.lng || defaultAddress?.lng) &&
      theDesiredPageIs
        ? true
        : false,
  });


  return informativeMsg ? (
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
  ) : null;
}

export default AdvertiseHint;
