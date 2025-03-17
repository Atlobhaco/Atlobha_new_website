import { ANNOUNCEMENT } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { INFORMATIVE_TYPES, MARKETPLACE, SPAREPARTS } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function AdvertiseHint() {
  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const router = useRouter();
  const { secTitle, secType } = router.query;
  const [informativeMsg, setInformativeMsg] = useState(false);

  const theDesiredPageIs =
    secType || (router?.pathname === "/spareParts" ? SPAREPARTS : MARKETPLACE);

  const { locale } = useLocalization();
  const bgColor = (type) => {
    switch (type) {
      case INFORMATIVE_TYPES?.information:
        return "#1FB256";
      case INFORMATIVE_TYPES?.offer:
        return "#FFD400";
      case INFORMATIVE_TYPES?.warning:
        return "#EB3C24";
      default:
        return "#B0B0B0";
    }
  };

  useCustomQuery({
    name: [
      "getInformativeMessage",
      theDesiredPageIs,
      selectedAddress?.lat || defaultAddress?.lat,
    ],
    url: `${ANNOUNCEMENT}/?lat=${
      selectedAddress?.lat || defaultAddress?.lat || 24.7136
    }&lng=${
      selectedAddress?.lng || defaultAddress?.lng || 46.6753
    }&type=information&app_section=${theDesiredPageIs}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => setInformativeMsg(res),
    enabled: theDesiredPageIs ? true : false,
  });

  return informativeMsg?.is_active ? (
    <Box
      sx={{
        background: bgColor(informativeMsg?.type),
        color: "white",
        display: "flex",
        height: isMobile ? "25px" : "30px",
        padding: isMobile ? "3px 4px" : "6px 10px",
        alignItems: "center",
        maxWidth: isMobile ? "200px" : "300px",
        gap: "10px",
        borderRadius: "4px",
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
          textAlign: "center",
          width: "fit-content",
          minWidth: "90%",
          display: "inline-block",
          whiteSpace: "nowrap", // Prevents text wrapping
          animation: "slide 10s linear infinite", // Animates the text
          animationPlayState: "running", // Ensures the animation runs by default
        }}
      >
        {informativeMsg?.body}
      </Box>

      {/* Define the keyframes for animation */}
      <style>
        {`
          @keyframes slide {
            0% {
              transform: translateX(${
                locale === "en" ? "100%" : "-100%"
              }); /* Start outside the container */
            }
            100% {
              transform: translateX(${
                locale === "en" ? "-100%" : "100%"
              }); /* End outside the container */
            }
          }
        `}
      </style>
    </Box>
  ) : null;
}

export default AdvertiseHint;
