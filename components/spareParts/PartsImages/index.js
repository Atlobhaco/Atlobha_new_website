import { MANUFACTURERS } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Slider from "react-slick";

function PartsImages() {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const [data, setData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useCustomQuery({
    name: "partenres-atlobha",
    url: `${MANUFACTURERS}?page=1`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    onSuccess: (res) => setData(res?.data?.filter((d) => d?.is_active)),
  });

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 7, // Number of items to show on desktop
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 5, // Number of items to show on tablets
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 4, // Number of items to show on mobile
    },
  };

  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: 7.5,
    slidesToScroll: 1.5,
    autoplay: true,
    rtl: locale === "ar",
    touchThreshold: 0,
    speed: 2500,
    autoplaySpeed: 0,
    // cssEase: "ease-in",
    arrows: false,
    isDragging: false,
    swipe: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 3,
        },
      },
    ],
    beforeChange: () => setIsDragging(true), // Set dragging to true when slide changes
    afterChange: () => setTimeout(() => setIsDragging(false), 100), // Reset dragging state
  };

  return (
    <Box>
      <Box
        sx={{
          fontWeight: "700",
          fontSize: isMobile ? "16px" : "30px",
        }}
      >
        {t.partsAreOriginal}
      </Box>

      <Box sx={{ mt: 3, mb: 1 }}>
        <Slider {...settings}>
          {data?.map((part, index) => (
            <Box
              key={part?.logo?.url + index}
              sx={{
                display: "flex",
                alignItems: "end",
                justifyContent: "end",
              }}
            >
              <Image
                loading="lazy"
                // onClick={() => {
                //   if (!isDragging) {
                //     router.push(`/manufacture/${part?.id}`);
                //   }
                // }}
                src={part?.logo?.url}
                alt={part?.logo?.url}
                width={isMobile ? 53 : 113}
                height={isMobile ? 50 : 106}
                style={{
                  width: "auto",
                  height: "auto",
                  margin: "auto",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  //   cursor: "pointer",
                }}
              />
            </Box>
          ))}
        </Slider>
        {/* <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay
          autoPlaySpeed={2000}
          keyBoardControl
          showDots={false}
          arrows={false}
          customTransition="all 2s linear"
          minimumTouchDrag={80}
          draggable={false}
        >
          {data?.map((part, index) => (
            <Box
              key={part?.logo?.url + index}
              sx={{
                display: "flex",
                alignItems: "end",
                justifyContent: "end",
              }}
            >
              <Image
                src={part?.logo?.url}
                alt={part?.logo?.url}
                width={isMobile ? 50 : 113}
                height={isMobile ? 47 : 106}
                style={{
                  width: "auto",
                  height: "auto",
                  margin: "auto",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </Box>
          ))}
        </Carousel> */}
      </Box>
    </Box>
  );
}

export default PartsImages;
