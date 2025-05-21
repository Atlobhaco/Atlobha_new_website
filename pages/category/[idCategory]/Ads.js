import { ADS } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";

function Ads({ id }) {
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );

  const { data: ads } = useCustomQuery({
    name: ["adsCategory", id, defaultAddress?.lat, selectedAddress?.lat],
    url: `${ADS}?lat=${
      selectedAddress?.lat || defaultAddress?.lat || 24.7136
    }&lng=${
      selectedAddress?.lng || defaultAddress?.lng || 46.6753
    }&category_id=${id}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    enabled: true,
  });

  return ads?.data?.length ? (
    <Box>
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
        // autoplay={{
        //   delay: 3000, // 3 seconds between slides
        //   disableOnInteraction: false, // Keeps autoplay after interaction
        // }}
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
  ) : null;
}

export default Ads;
