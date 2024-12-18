import React, { useMemo } from "react";
import Image from "next/image";
// import MyLoader from "../ContentLoader";
import Carousel from "react-bootstrap/Carousel";
// import useCustomQuery from "@/config/ApiConfig";
import { ADS } from "@/config/endPoints/endPoints";
import { Box } from "@mui/material";

function MainCarousel() {
  //   const { data: adsData, isLoading } = useCustomQuery({
  //     name: "getAds",
  //     url: ADS,
  //     refetchOnWindowFocus: false,
  //     enabled: true,
  //     select: (res) => res?.data?.data?.slice(0, 6),
  //   });
  const adsData = [
    {
      imgPath: "/imgs/carousel-1.svg",
    },
    {
      imgPath: "/imgs/carousel-2.svg",
    },
  ];

  const carouselItems = useMemo(() => {
    return adsData?.map((item) => (
      <Carousel.Item key={item?.imgPath}>
        <div
          className="carousel-item-wrapper"
          style={{
            minWidth: "100%",
            minHeight: "100%",
            background: `center / contain no-repeat url(${item?.imgPath})`,
          }}
        ></div>
        <div className="overlay-carousel"></div>
      </Carousel.Item>
    ));
  }, [adsData]); // Only re-run when adsData changes

  return (
    <Carousel fade slide={true} className="main-carousel" interval={null}>
      {false ? (
        <Carousel.Item>
          <Box
            sx={{
              background: "#6b7280",
              minHeight: "100%",
            }}
          ></Box>
        </Carousel.Item>
      ) : (
        carouselItems
      )}
    </Carousel>
  );
}

export default React.memo(MainCarousel);
