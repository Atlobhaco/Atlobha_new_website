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

function HowMakePrice({ setOpenhowPricing }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const header = {
    mt: 2,
    mb: 3,
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontWeight: "500",
    fontSize: isMobile ? "17px" : "20px",
    color: "black",
  };
  const contentData = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "400",
    color: "#0F172A",
    mb: 2,
    paddingInlineEnd: isMobile ? "0px" : "50px",
  };

  return (
    <Box>
      <Box sx={closeHolder}>
        <Image
          loading="lazy"
          onClick={() => setOpenhowPricing(false)}
          style={{
            cursor: "pointer",
          }}
          src="/icons/close-circle.svg"
          alt="close"
          width={34}
          height={34}
        />
      </Box>
      <Box sx={header}>
        <Image
          loading="lazy"
          style={{
            cursor: "pointer",
          }}
          src="/imgs/how-price.svg"
          alt="close"
          width={53}
          height={37}
        />
        <Box component="span">{t.whatIsPricing}</Box>
      </Box>
      <Box
        sx={{ ...contentData, fontWeight: activeIndex === 0 ? "700" : "500" }}
      >
        <Image
          loading="lazy"
          src={`/icons/${
            activeIndex === 0 ? "yellow-circle" : "white-circle"
          }-check.svg`}
          alt="check"
          width={18}
          height={18}
        />
        {t.addNameNum}
      </Box>
      <Box
        sx={{ ...contentData, fontWeight: activeIndex === 1 ? "700" : "500" }}
      >
        <Image
          loading="lazy"
          src={`/icons/${
            activeIndex === 1 ? "yellow-circle" : "white-circle"
          }-check.svg`}
          alt="check"
          width={18}
          height={18}
        />
        {t.searchForItems}
      </Box>
      <Box
        sx={{ ...contentData, fontWeight: activeIndex === 2 ? "700" : "500" }}
      >
        <Image
          loading="lazy"
          src={`/icons/${
            activeIndex === 2 ? "yellow-circle" : "white-circle"
          }-check.svg`}
          alt="check"
          width={18}
          height={18}
        />
        {t.informYouWhenDone}
      </Box>
      <Box
        sx={{ ...contentData, fontWeight: activeIndex === 3 ? "700" : "500" }}
      >
        <Image
          loading="lazy"
          src={`/icons/${
            activeIndex === 3 ? "yellow-circle" : "white-circle"
          }-check.svg`}
          alt="check"
          width={18}
          height={18}
        />
        {t.ConfirmThePricing}
      </Box>

      <CarouselHowPricing
        handleSelect={handleSelect}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />

      <Box
        sx={{
          marginTop: "40px",
        }}
      >
        <SharedBtn
          className="big-main-btn"
          customClass="w-100"
          text="addRequest"
          onClick={() => setOpenhowPricing(false)}
        />
      </Box>
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
    </Box>
  );
}

export default HowMakePrice;
