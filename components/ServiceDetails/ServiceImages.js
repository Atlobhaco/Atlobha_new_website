import React, { useRef, useState } from "react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";

const InnerImageZoom = dynamic(() => import("react-inner-image-zoom"), {
  ssr: false,
  loading: () => <div style={{ height: 300 }}></div>, // Optional loading placeholder
});

function ServiceImages({ prod }) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { isMobile } = useScreenSize();
  const imgArray = prod?.files?.length
    ? prod?.files
    : [{ url: prod?.thumbnail?.url }];

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
        // onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {imgArray?.map((img, index) => (
          <SwiperSlide key={img?.url}>
            <InnerImageZoom
              zoomScale="2"
              zoomType="hover"
              zoomPreload={true}
              src={img?.url || "/imgs/no-prod-img.svg"}
              zoomSrc={img?.url || "/imgs/no-prod-img.svg"}
              className="img-prod-service-zoom"
              alt="prod-img"
              hideHint={isMobile ? true : false}
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
        {/* <Box
          sx={{
            background: returnTypeLocalized() && "#E9E9E9",
            padding: "6px 10px",
            borderRadius: "8px",
            width: "fit-content",
            fontSize: isMobile && "12px",
          }}
        >
          {returnTypeLocalized()}
        </Box> */}
        {/* <FavoriteBorderIcon /> */}
      </Box>

      {/* <Divider sx={{ background: "#EAECF0", my: 1 }} /> */}

      {/* {!isMobile && (
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
      )} */}
    </>
  );
}

export default ServiceImages;
