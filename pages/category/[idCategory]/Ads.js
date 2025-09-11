import { ADS } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

function Ads({ id, idService = false }) {
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );

  const { data: ads } = useCustomQuery({
    name: [
      "adsCategory",
      id,
      idService,
      defaultAddress?.lat,
      selectedAddress?.lat,
    ],
    url: `${ADS}?lat=${
      selectedAddress?.lat || defaultAddress?.lat || 24.7136
    }&lng=${selectedAddress?.lng || defaultAddress?.lng || 46.6753}&${
      idService ? `service_category_id=${idService}` : `category_id=${id}`
    }`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    enabled: id || idService ? true : false,
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
            {/* <img
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
            /> */}
            <Image
              src={img?.media || "/imgs/no-img-holder.svg"} // fallback in case media is undefined
              alt="banner-image-ads"
              width={800} // adjust based on your design
              height={400} // adjust based on your design
              style={{
                borderRadius: "20px",
                width: "100%",
                maxWidth: "100%",
                height: "auto",
                display: "block",
                margin: "auto",
                cursor: img?.link ? "pointer" : "default",
              }}
              onClick={() => {
                if (img?.link) {
                  window.open(img.link, "_blank");
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
