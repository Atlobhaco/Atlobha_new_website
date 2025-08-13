import { Box } from "@mui/material";
import React, { useState } from "react";
import { ADS } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { isAuth } from "@/config/hooks/isAuth";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

function MainCarousel({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const [isDragging, setIsDragging] = useState(false);
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );

  const { data: ads } = useCustomQuery({
    name: "ads",
    url: `${ADS}?lat=${
      selectedAddress?.lat || defaultAddress?.lat || "24.7136"
    }&lng=${selectedAddress?.lng || defaultAddress?.lng || "46.6753"}`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active
      ? true
      : false,
    select: (res) => res?.data,
  });
  return !sectionInfo?.is_active || !ads?.data?.length ? null : (
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
        autoplay={{
          delay: 3000, // 3 seconds between slides
          disableOnInteraction: false, // Keeps autoplay after interaction
        }}
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
        className="mySwiper"
        observer={true}
        observeParents={true}
      >
        {ads?.data?.map((img) => (
          <SwiperSlide key={img?.id || img?.media || index}>
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
              alt="banner-image"
              width={800} // adjust based on your design
              height={400} // adjust based on your design
              style={{
                borderRadius: "20px",
                width: "100%",
                maxWidth: "100%",
                // height: "auto",
                display: "block",
                margin: "auto",
                cursor: img?.link ? "pointer" : "default",
                maxHeight: isMobile ? "150px" : "612px",
                minHeight: isMobile ? "150px" : "612px",
              }}
              onClick={() => {
                if (img?.link) {
                  window.open(img.link, "_blank");
                }
              }}
              onError={(e) => (e.target.srcset = "/imgs/no-img-holder.svg")} // Fallback to default image
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default MainCarousel;
