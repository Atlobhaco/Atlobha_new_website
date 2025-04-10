import ProductCard from "@/components/shared/ProductCard";
import { PRODUCTS } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { MARKETPLACE } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useCallback } from "react";
import Slider from "react-slick";

function ManufactureShell({ sectionInfo }) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const { data: manufactureProducts } = useCustomQuery({
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
  });

  var settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    // autoplay: true,
    // touchThreshold: 10,
    // speed: 8000,
    // autoplaySpeed: 8000,
    // cssEase: "linear",
    // rtl: locale === "ar",
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
    beforeChange: () => setIsDragging(true),
    afterChange: () => setTimeout(() => setIsDragging(false), 500),
  };

  // useCallback to prevent unnecessary re-renders on click
  const handleProductClick = useCallback(
    (prod) => {
      if (!isDragging) {
        router.push(`/product/${prod?.id}`);
      }
    },
    [isDragging, router]
  );

  const redirectToManufacturePage = () => {
    router.push(`/manufacture/${sectionInfo?.manufacturer?.id}`);
  };

  return !sectionInfo?.is_active ||
    !manufactureProducts?.data?.length ? null : (
    <Box
      sx={{
        backgroundImage: `url(${
          sectionInfo?.manufacturer?.cover_image?.url || "/imgs/no-prod-img.svg"
        })`,
        backgroundSize: isMobile ? "cover" : "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100%",
        height: isMobile ? "320px" : "900px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
      }}
    >
      {/* <Image
        src={sectionInfo?.manufacturer?.cover_image?.url}
        width={200}
        height={900}
        style={{
        //   width: "100%",
          height: "100%",
          position: "absolute",
        }}
      /> */}
      <Box sx={{ width: isMobile ? "100%" : "90%" }}>
        <Slider {...settings}>
          {manufactureProducts?.data?.map((prod) => (
            <Box
              onClick={() => handleProductClick(prod)}
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
        onClick={() => redirectToManufacturePage()}
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
      <Box
        onClick={() => redirectToManufacturePage()}
        sx={{
          position: "absolute",
          top: "0",
          width: "100%",
          cursor: "pointer",
          height: isMobile ? "150px" : "300px",
        }}
      ></Box>
    </Box>
  );
}

export default ManufactureShell;
