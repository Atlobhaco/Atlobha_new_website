import { Box } from "@mui/material";
import React from "react";
import HeaderSection from "../HeaderSection";
import useLocalization from "@/config/hooks/useLocalization";
import Slider from "react-slick";
import { MARKETPLACE, PRODUCTS } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { isAuth } from "@/config/hooks/isAuth";

function PackageOffers({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();

  const { data: featuredProducts } = useCustomQuery({
    name: ["featured-products", sectionInfo?.is_active],
    url: `${MARKETPLACE}${PRODUCTS}?page=${1}&per_page=${10}&is_featured=1`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active,
    select: (res) => res?.data,
  });

  var settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 1500,
    rtl: locale === "ar" ? true : false,
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
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
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
      />
      <Slider {...settings}>
        {featuredProducts?.data?.map((featured) => (
          <Box
            onClick={() => alert("redirect")}
            sx={{
              width: "95% !important",
              height: isMobile ? "200px" : "400px",
              cursor: "pointer",
            }}
            key={featured?.id}
          >
            <Box
              sx={{
                backgroundImage: `url('${featured?.featured_image?.url}')`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                height: "100%",
                width: "100%",
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
