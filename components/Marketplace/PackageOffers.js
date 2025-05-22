import { Box } from "@mui/material";
import React, { useState } from "react";
import HeaderSection from "../HeaderSection";
import useLocalization from "@/config/hooks/useLocalization";
import Slider from "react-slick";
import { MARKETPLACE, PRODUCTS } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { isAuth } from "@/config/hooks/isAuth";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

function PackageOffers({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);

  const returnUrlDependOnCar = () => {
    if (selectedCar?.model?.id || defaultCar?.model?.id) {
      return `${MARKETPLACE}${PRODUCTS}?page=${1}&per_page=${10}&is_featured=1&model_id=${
        selectedCar?.model?.id || defaultCar?.model?.id
      }`;
    }
    return `${MARKETPLACE}${PRODUCTS}?page=${1}&per_page=${10}&is_featured=1`;
  };

  const { data: featuredProducts } = useCustomQuery({
    name: [
      "featured-products",
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
    infinite: +featuredProducts?.data?.length > 1,
    slidesToShow:
      +featuredProducts?.data?.length > 4 ? 4 : +featuredProducts?.data?.length,
    slidesToScroll:
      +featuredProducts?.data?.length > 4 ? 2 : +featuredProducts?.data?.length,
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
          slidesToShow: +featuredProducts?.data?.length > 1 ? 2 : 1,
          slidesToScroll: +featuredProducts?.data?.length > 1 ? 2 : 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: +featuredProducts?.data?.length > 1 ? 3 : 1,
          slidesToScroll: +featuredProducts?.data?.length > 1 ? 2 : 1,
        },
      },
    ],
    beforeChange: () => setIsDragging(true), // Set dragging to true when slide changes
    afterChange: () => setTimeout(() => setIsDragging(false), 100), // Reset dragging state
  };

  return !sectionInfo?.is_active || !featuredProducts?.data?.length ? null : (
    <Box
      sx={{
        display: "flex",
        gap: isMobile ? "10px" : "25px",
        flexDirection: "column",
      }}
    >
      <HeaderSection
        showArrow={true}
        subtitle={t.showAll}
        title={sectionInfo?.title}
        onClick={() => router.push("/packages")}
      />
      <Slider {...settings}>
        {featuredProducts?.data?.map((featured) => (
          <Box
            key={featured?.id}
            onClick={() => {
              if (!isDragging) {
                router.push(`/product/${featured?.id}`); // Replace with router.push(featured?.deep_link) when needed
              }
            }}
            sx={{
              width: isMobile ? "99% !important" : "95% !important",
              height: isMobile ? "180px" : "440px",
              cursor: "pointer",
              //   background:'yellow'
            }}
          >
            <Box
              sx={{
                backgroundImage: `url('${featured?.featured_image?.url}')`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                height: "100%",
                width: isMobile
                  ? "95%"
                  : +featuredProducts?.data?.length === 1
                  ? "280px"
                  : "100%",
                borderRadius: "10px",
              }}
            ></Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

export default PackageOffers;
