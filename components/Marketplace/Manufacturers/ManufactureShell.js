import ProductCard from "@/components/shared/ProductCard";
import { PRODUCTS } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { MARKETPLACE } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Slider from "react-slick";

function ManufactureShell({ sectionInfo }) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [manufactureProducts, setManProducts] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useCustomQuery({
    name: [
      `manufacturer${sectionInfo?.id}`,
      sectionInfo?.is_active,
      isMobile,
      page,
    ],
    url: `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${
      isMobile ? 10 : 10
    }&manufacturer_id=${sectionInfo?.manufacturer?.id}`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active,
    select: (res) => res?.data,
    onSuccess: (res) => setManProducts(res),
  });

  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    touchThreshold: 10,
    speed: 3000,
    autoplaySpeed: 3000,
    cssEase: "linear",
    rtl: locale === "ar",
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
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
    // beforeChange: () => {
    //   setIsDragging(true);
    //   setTimeout(() => {
    //     setIsDragging(false);
    //   }, 500);
    // }, // Set dragging to true when slide changes
    beforeChange: () => setIsDragging(true), // Set dragging to true when slide changes
    afterChange: () => setTimeout(() => setIsDragging(false), 100), // Reset dragging state
  };

  return !sectionInfo?.is_active ||
    !manufactureProducts?.data?.length ? null : (
    <Box
      sx={{
        background: `center / cover no-repeat url(${
          sectionInfo?.manufacturer?.cover_image?.url || "/imgs/no-prod-img.svg"
        })`,
        height: isMobile ? "400px" : "900px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Box sx={{ width: isMobile ? "100%" : "90%" }}>
        <Slider {...settings}>
          {manufactureProducts?.data?.map((prod) => (
            <Box
              onClick={() => {
                if (!isDragging) {
                  router.push(`/product/${prod?.id}`);
                }
              }}
              key={prod?.id}
              sx={{
                display: "flex !important",
                justifyContent: "center",
                direction: locale === "ar" ? "rtl" : "ltr",
              }}
            >
              <ProductCard
                product={prod}
                hasNum={prod?.image}
                preventOnClick={true}
              />
            </Box>
          ))}
        </Slider>
      </Box>
      <Box
        onClick={() => alert("redirect")}
        sx={{
          mt: isMobile ? 1 : 5,
          mb: isMobile ? 1 : 2,
          background: "white",
          fontWeight: "bold",
          fontSize: isMobile ? "10px" : "24px",
          padding: isMobile ? "2px 5px" : "6px 15px",
          borderRadius: "20px",
          cursor: "pointer",
        }}
      >
        {t.showMore}
      </Box>
    </Box>
  );
}

export default ManufactureShell;
