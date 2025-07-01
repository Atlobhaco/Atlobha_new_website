import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import { Box, Divider } from "@mui/material";
import { prodTypeArray } from "@/constants/helpers";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import InnerImageZoom from "react-inner-image-zoom";

function ProdImages({ prod }) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { isMobile } = useScreenSize();

  const returnTypeLocalized = () =>
    prodTypeArray()?.find((type) => type?.id === prod?.type)?.name ||
    prod?.type;

  const imgArray = (
    prod?.images?.length
      ? [...prod?.images, prod?.image ? { url: prod?.image } : null]
      : [{ url: prod?.image }]
  )?.filter((d) => d);

  return (
    <>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={10}
        effect={"fade"}
        speed={500} // Duration of fade effect in milliseconds
        fadeEffect={{ crossFade: true }}
        navigation={false}
        loop={true}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {imgArray?.map((img, index) => (
          <SwiperSlide key={img?.url}>
            {/* <Image
              loading="lazy"
              width={280}
              height={226}
              alt="prod-img"
              style={{
                width: !img?.url ? "100%" : "auto",
                height: !img?.url ? "100%" : "auto",
                borderRadius: "20px",
                maxWidth: "100%",
                display: "flex",
                margin: "auto",
                maxHeight: !img?.url ? "unset" : isMobile ? "150px" : "230px",
              }}
              src={img?.url || "/imgs/no-prod-img.svg"}
              onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
            /> */}
            <InnerImageZoom
              zoomScale="2"
              zoomType="hover"
              zoomPreload={true}
              src={img?.url || "/imgs/no-prod-img.svg"}
              zoomSrc={img?.url || "/imgs/no-prod-img.svg"}
              className="img-prod-details-zoom"
              alt="prod-img"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 4,
          width: "98%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Box
          sx={{
            background: returnTypeLocalized() && "#E9E9E9",
            padding: "6px 10px",
            borderRadius: "8px",
            width: "fit-content",
            fontSize: isMobile && "12px",
          }}
        >
          {returnTypeLocalized()}
        </Box>
        {/* <FavoriteBorderIcon /> */}
      </Box>

      <Divider sx={{ background: "#EAECF0", my: 1 }} />

      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            overflow: "auto hidden",
            maxWidth: "100%",
            pb: 1,
            mt: 4,
          }}
        >
          {imgArray?.map((img, index) => (
            <Box
              key={img?.url + index}
              sx={{
                minWidth: isMobile ? "80px" : "100px",
                width: isMobile ? "80px" : "100px",
                height: isMobile ? "80px" : "100px",
                display: "flex",
                border: activeIndex === index && "2px solid #FFD400",
                padding: "5px",
                borderRadius: "10px",
              }}
            >
              <Image
                loading="lazy"
                onClick={() => swiperRef.current?.slideToLoop(index)}
                width={90}
                height={80}
                alt="prod-img-preview"
                style={{
                  width: "auto",
                  height: "auto",
                  borderRadius: "10px",
                  maxWidth: "100%",
                  display: "flex",
                  margin: "auto",
                  maxHeight: isMobile ? "100%" : "80px",
                  cursor: "pointer",
                }}
                src={img?.url || "/imgs/no-prod-img.svg"}
                onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
              />
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}

export default ProdImages;
