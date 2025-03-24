import { ANNOUNCEMENT } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { INFORMATIVE_TYPES, MARKETPLACE, SPAREPARTS } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function AdvertiseHint() {
  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const router = useRouter();
  const { secTitle, secType } = router.query;
  const [informativeMsg, setInformativeMsg] = useState(false);
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const [isScrollingNeeded, setIsScrollingNeeded] = useState(false);

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
    onSuccess: (res) => {
      setInformativeMsg(res);
    },
    enabled: theDesiredPageIs ? true : false,
  });

  useEffect(() => {
    if (textRef.current && containerRef.current) {
      setIsScrollingNeeded(
        textRef.current.scrollWidth > containerRef.current.clientWidth
      );
    }
  }, [informativeMsg]);

  return informativeMsg?.is_active ? (
    <Box
      ref={containerRef}
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
        overflow: "hidden",
        position: "relative",
        "&:hover span": {
          animationPlayState: "paused",
        },
      }}
    >
      <Box
        ref={textRef}
        component="span"
        sx={{
          textAlign: "center",
          width: "fit-content",
          minWidth: "90%",
          display: "inline-block",
          whiteSpace: "nowrap",
          ...(isScrollingNeeded && {
            animation: "slide 10s linear infinite",
            animationPlayState: "running",
          }),
        }}
      >
        {informativeMsg?.body}
      </Box>

      {/* Define the keyframes for animation */}
      {isScrollingNeeded && (
        <style>
          {`
            @keyframes slide {
              0% {
                transform: translateX(${locale === "en" ? "100%" : "-100%"});
              }
              100% {
                transform: translateX(${locale === "en" ? "-100%" : "100%"});
              }
            }
          `}
        </style>
      )}
    </Box>
  ) : null;
}

export default AdvertiseHint;
