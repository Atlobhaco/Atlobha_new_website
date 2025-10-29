import ProductCard from "@/components/shared/ProductCard";
import { PRODUCTS } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { MARKETPLACE } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";

function ManufactureShell({ sectionInfo }) {
  const { t, locale } = useLocalization();
  const { isMobile, isTablet } = useScreenSize();
  const router = useRouter();
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);

  const [page, setPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const returnUrlDependOnCar = () => {
    if (selectedCar?.model?.id || defaultCar?.model?.id) {
      return `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${
        isMobile ? 10 : 10
      }&manufacturer_id=${sectionInfo?.manufacturer?.id}&model_id=${
        selectedCar?.model?.id || defaultCar?.model?.id
      }`;
    }
    return `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${
      isMobile ? 10 : 10
    }&manufacturer_id=${sectionInfo?.manufacturer?.id}`;
  };

  const { data: manufactureProducts } = useCustomQuery({
    name: [
      `manufacturer${sectionInfo?.id}`,
      sectionInfo?.is_active,
      isMobile,
      isTablet,
      page,
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
    dots: false,
    infinite: false,
    slidesToShow:
      +manufactureProducts?.data?.length > 4
        ? 4
        : +manufactureProducts?.data?.length,
    slidesToScroll:
      +manufactureProducts?.data?.length > 4
        ? 2
        : +manufactureProducts?.data?.length,
    initialSlide:
      locale === "ar"
        ? isMobile
          ? Math.max(Math.ceil(manufactureProducts?.data.length), 0)
          : manufactureProducts?.data?.length - 4
        : 0, // 👈 start at last "page", // 👈 start at last "page
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
          slidesToShow: +manufactureProducts?.data?.length > 1 ? 4 : 1,
          slidesToScroll: +manufactureProducts?.data?.length > 1 ? 4 : 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: +manufactureProducts?.data?.length > 1 ? 4 : 1,
          slidesToScroll: +manufactureProducts?.data?.length > 1 ? 4 : 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: +manufactureProducts?.data?.length > 1 ? 3.2 : 1,
          slidesToScroll: +manufactureProducts?.data?.length > 1 ? 3 : 1,
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
        router.push({
          pathname: `/product/${prod?.id}`,
          query: {
            name: prod?.name,
            desc: prod?.desc,
            tags: prod?.combined_tags?.[0]?.name_ar,
            category: prod?.marketplace_category?.name,
            subCategory: prod?.marketplace_subcategory?.name,
            model: prod?.model?.name,
            num: prod?.ref_num,
            price: prod?.price,
            img: prod?.image,
          },
        });
      }
    },
    [isDragging, router]
  );

  const redirectToManufacturePage = () => {
    window.webengage.onReady(() => {
      webengage.track("HIGHLIGHTED_MANUFACTRER_VIEWED", {
        manufactrer_name: `${sectionInfo?.manufacturer?.name_ar}`,
        manufactrer_url: `/manufacture/${sectionInfo?.manufacturer?.id}`,
      });
    });
    router.push({
      pathname: `/manufacture/${sectionInfo?.manufacturer?.id}`,
      query: {
        name: `${sectionInfo?.manufacturer?.name_ar}`,
        name_en: sectionInfo?.manufacturer?.name_en,
        type: sectionInfo?.type,
        manufacturer: sectionInfo?.manufacturer?.name_ar,
        manufacturerEn: sectionInfo?.manufacturer?.name_en,
        logo: sectionInfo?.manufacturer?.logo?.url,
        categoryies: sectionInfo?.manufacturer?.categories?.length
          ? sectionInfo?.manufacturer?.categories
              ?.map((data) => data?.name)
              ?.join(", ")
          : "",
      },
    });
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
        height: isMobile ? "286px" : "900px",
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
      <Box
        sx={{
          width: isMobile ? "100%" : "98%",
          padding: isMobile ? "0px" : "",
        }}
      >
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
          height: isMobile ? "90px" : "300px",
        }}
      ></Box>
    </Box>
  );
}

export default ManufactureShell;
