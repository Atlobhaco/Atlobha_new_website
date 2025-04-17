import { ADS } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";

function Ads({ id }) {
  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const [isDragging, setIsDragging] = useState(false);

  const { data: ads } = useCustomQuery({
    name: ["adsCategory", id],
    url: `${ADS}?lat=${defaultAddress?.lat || selectedAddress?.lat}&lng=${
      defaultAddress?.lng || selectedAddress?.lng
    }&category_id=${id}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    enabled: (defaultAddress?.lng || selectedAddress?.lng) && id ? true : false,
  });

  var settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    beforeChange: () => setIsDragging(true), // Set dragging to true when slide changes
    afterChange: () => setTimeout(() => setIsDragging(false), 100), // Reset dragging state
  };

  return ads?.length ? (
    <Box>
      <Slider {...settings}>
        {ads?.data?.map((featured) => (
          <Box
            key={featured?.id}
            onClick={() => {
              if (!isDragging) {
                featured?.link && window.open(featured?.link);
              }
            }}
            sx={{
              width: "100% !important",
              height: isMobile ? "150px" : "560px",
              cursor: "pointer",
              borderRadius: "10px",
            }}
          >
            <Box
              sx={{
                backgroundImage: `url('${featured?.media}')`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: isMobile ? "cover" : "cover",
                height: "100%",
                width: "100%",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            ></Box>
          </Box>
        ))}
      </Slider>
    </Box>
  ) : null;
}

export default Ads;
