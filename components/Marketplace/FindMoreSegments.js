import { Box } from "@mui/material";
import React, { useState } from "react";
import HeaderSection from "../HeaderSection";
import useLocalization from "@/config/hooks/useLocalization";
import Slider from "react-slick";
import { MARKETPLACE, PRODUCTS, SEGMENTS } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { isAuth } from "@/config/hooks/isAuth";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

function FindMoreSegments({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);

  const returnUrlDependOnCar = () => {
    return `${SEGMENTS}`;
  };

  const { data: productsWithTags } = useCustomQuery({
    name: [
      `featured-products-${sectionInfo?.id}`,
      sectionInfo?.is_active,
      selectedCar?.model?.id,
      defaultCar?.model?.id,
    ],
    url: returnUrlDependOnCar(),
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active,
    select: (res) => res?.data,
  });

  var settings = {
    dots: true,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: +productsWithTags?.data?.length > 5 ? 2 : 1,
    initialSlide:
      locale === "ar"
        ? isMobile
          ? Math.max(Math.ceil(productsWithTags?.data.length), 0)
          : productsWithTags?.data?.length - 4
        : 0,
    // autoplay: true,
    // rtl: locale === "ar",
    // touchThreshold: 10,
    // speed: 8000,
    // autoplaySpeed: 8000,
    // cssEase: "linear",
    // isDragging: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: +productsWithTags?.data?.length > 1 ? 2 : 1,
          slidesToScroll: +productsWithTags?.data?.length > 1 ? 2 : 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          dots: false,
          slidesToShow: 2.5,
          slidesToScroll: 2,
        },
      },
    ],
    beforeChange: () => setIsDragging(true), // Set dragging to true when slide changes
    afterChange: () => setTimeout(() => setIsDragging(false), 100), // Reset dragging state
  };

  return !sectionInfo?.is_active || !productsWithTags?.data?.length ? null : (
    <Box
      sx={{
        display: "flex",
        gap: isMobile ? "10px" : "25px",
        flexDirection: "column",
        mb: 2,
      }}
    >
      <Box
        sx={{
          px: isMobile ? 1 : "unset",
        }}
      >
        <HeaderSection title={sectionInfo?.title} />
      </Box>

      <Slider {...settings}>
        {productsWithTags?.data?.map((product) => (
          <Box
            key={product?.id}
            onClick={() => {
              if (!isDragging) {
                router.push(`/products/?segmentID=${product?.id}`);
              }
            }}
            sx={{
              width: isMobile ? "100% !important" : "95% !important",
              height: isMobile ? "210px" : "500px",
              cursor: "pointer",
              display: "flex !important",
              margin: "auto",
            }}
          >
            <Box
              sx={{
                backgroundImage: `url('${product?.background_image_url}')`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                height: "100%",
                width: isMobile
                  ? "97%"
                  : +productsWithTags?.data?.length === 1
                  ? "280px"
                  : "99%",
                borderRadius: "10px",
                backgroundColor: `${
                  !product?.background_image_url ? "grey" : "unset"
                }`,
              }}
            ></Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

export default FindMoreSegments;
