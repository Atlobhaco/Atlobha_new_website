import { Box } from "@mui/material";
import React, { useState } from "react";
import Slider from "react-slick";
import { ADS } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { isAuth } from "@/config/hooks/isAuth";
import { useSelector } from "react-redux";

function MainCarousel({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const [isDragging, setIsDragging] = useState(false);
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );

  const { data: ads } = useCustomQuery({
    name: "ads",
    url: `${ADS}?lat=${defaultAddress?.lat || selectedAddress?.lat}&lng=${
      defaultAddress?.lng || selectedAddress?.lng
    }`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() &&
        sectionInfo?.is_active &&
        (defaultAddress?.id || selectedAddress?.id)
      : sectionInfo?.is_active && (defaultAddress?.id || selectedAddress?.id)
      ? true
      : false,
    select: (res) => res?.data,
  });

  var settings = {
    dots: true,
    infinite: true,
    slidesToShow: ads?.data?.length > 1 ? 1.2 : 1,
    slidesToScroll: 1,
    // autoplay: true,
    // rtl: locale === "ar",
    // touchThreshold: 10,
    // speed: 6000,
    // autoplaySpeed: 2000,
    // cssEase: "linear",
    // isDragging: false,
    // initialSlide: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    beforeChange: () => setIsDragging(true), // Set dragging to true when slide changes
    afterChange: () => setTimeout(() => setIsDragging(false), 100), // Reset dragging state
  };

  return !sectionInfo?.is_active || !ads?.data?.length ? null : (
    <Box
      sx={{
        display: "flex",
        gap: isMobile ? "10px" : "25px",
        flexDirection: "column",
        borderRadius: "10px 10px 25px 25px",
        overflow: "hidden",
      }}
    >
      <Slider {...settings}>
        {ads?.data?.map((featured) => (
          <Box
            key={featured?.id}
            onClick={() => {
              if (!isDragging) {
                featured?.link && window.open(featured?.link);
              }
            }}
            sx={{
              width: "98% !important",
              height: isMobile ? "200px" : "500px",
              cursor: "pointer",
              borderRadius: "10px",
            }}
          >
            <Box
              sx={{
                backgroundImage: `url('${featured?.media}')`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: isMobile ? "cover" : "contain",
                height: "100%",
                width: "100%",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            ></Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

export default MainCarousel;
