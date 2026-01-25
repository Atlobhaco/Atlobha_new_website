import SharedBtn from "@/components/shared/SharedBtn";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import CarouselHowPricing from "./CarouselHowPricing";
import useLocalization from "@/config/hooks/useLocalization";

const closeHolder = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

function HowMakePrice({
  setOpenhowPricing,
  heading = false,
  imgSrc = false,
  infoSteps = [],
  infoImgArray = [],
  customFooter = false,
}) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (i) => setActiveIndex(i);

  const headerStyle = {
    mt: 2,
    mb: 3,
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontWeight: "500",
    fontSize: isMobile ? "17px" : "20px",
    color: "black",
  };

  const baseStepStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "400",
    color: "#0F172A",
    mb: 2,
    paddingInlineEnd: isMobile ? "0px" : "50px",
  };

  // Steps array
  const steps = (infoSteps?.length && infoSteps) || [
    t.addNameNum,
    t.searchForItems,
    t.informYouWhenDone,
    t.ConfirmThePricing,
  ];

  return (
    <Box>
      {/* Close Button */}
      <Box sx={closeHolder}>
        <Image
          loading="lazy"
          onClick={() => setOpenhowPricing(false)}
          style={{ cursor: "pointer" }}
          src="/icons/close-circle.svg"
          alt="close"
          width={34}
          height={34}
        />
      </Box>

      {/* Header */}
      <Box sx={headerStyle}>
        <Image
          loading="lazy"
          style={{ cursor: "pointer" }}
          src={imgSrc || "/imgs/how-price.svg"}
          alt="header-img"
          width={isMobile ? 45 : 53}
          height={isMobile ? 30 : 37}
        />
        <Box component="span" fontSize={isMobile ? "14px" : "17px"}>
          {heading || t.whatIsPricing}
        </Box>
      </Box>

      {/*  Steps List */}
      {steps.map((text, i) => {
        const active = activeIndex === i;
        return (
          <Box
            key={i}
            sx={{ ...baseStepStyle, fontWeight: active ? "700" : "500" }}
          >
            <Image
              loading="lazy"
              src={`/icons/${
                active ? "yellow-circle" : "white-circle"
              }-check.svg`}
              alt="check"
              width={18}
              height={18}
            />
            {text}
          </Box>
        );
      })}

      {/* Slider */}
      <CarouselHowPricing
        handleSelect={handleSelect}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        infoImgArray={infoImgArray}
      />

      {customFooter || (
        <>
          {/* CTA Button */}
          <Box sx={{ marginTop: "40px" }}>
            <SharedBtn
              className="big-main-btn"
              customClass="w-100"
              text="addRequest"
              onClick={() => setOpenhowPricing(false)}
            />
          </Box>

          {/* Close Text */}
          <Box
            onClick={() => setOpenhowPricing(false)}
            sx={{
              margin: "20px 0px",
              textAlign: "center",
              color: "#6B7280",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            {t.needMoreInfo}
          </Box>
        </>
      )}
    </Box>
  );
}

export default HowMakePrice;
