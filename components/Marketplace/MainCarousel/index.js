import { Box } from "@mui/material";
import React, { useState } from "react";
import Slider from "react-slick";
import { ADS } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { isAuth } from "@/config/hooks/isAuth";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";

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
    slidesToShow: ads?.data?.length > 1 ? 1 : 1,
    slidesToScroll: 1,
    fade: true,
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
      sx={
        {
          // borderRadius: "20px",
        }
      }
    >
      <Swiper
        spaceBetween={10}
        effect={"fade"}
        speed={500} // Duration of fade effect in milliseconds
        fadeEffect={{ crossFade: true }}
        navigation={true}
        loop={true}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper"
      >
        {ads?.data?.map((img) => (
          <SwiperSlide>
            <img
              style={{
                borderRadius: "20px",
                maxWidth: "100%",
                display: "flex",
                margin: "auto",
              }}
              src={img?.media}
              onClick={() => {
                if (img?.link) {
                  window.open(img?.link);
                }
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default MainCarousel;
