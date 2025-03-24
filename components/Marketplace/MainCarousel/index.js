import React, { useMemo } from "react";
import Carousel from "react-bootstrap/Carousel";
import { ADS } from "@/config/endPoints/endPoints";
import { useSelector } from "react-redux";
import useCustomQuery from "@/config/network/Apiconfig";
import { isAuth } from "@/config/hooks/isAuth";

function MainCarousel({ sectionInfo }) {
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );

  const { data: ads } = useCustomQuery({
    name: "ads",
    url: `${ADS}?lat=${defaultAddress?.lat || selectedAddress?.lat}&lng=${
      defaultAddress?.lng || selectedAddress?.lng
    }`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() &&
        sectionInfo?.is_active &&
        (defaultAddress?.id || selectedAddress?.id)
      : sectionInfo?.is_active && (defaultAddress?.id || selectedAddress?.id)
      ? true
      : false,
    select: (res) => res?.data?.data,
  });

  const carouselItems = useMemo(() => {
    return ads?.map((item) => (
      <Carousel.Item key={item?.media}>
        <div
          className="carousel-item-wrapper"
          style={{
            borderRadius: "20px",
            minWidth: "100%",
            // minHeight: `${isMobile ? "150px" : "500px"}`,
            // background: `center / contain no-repeat url(${item?.media})`,
            backgroundImage: `url(${item?.media})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </Carousel.Item>
    ));
  }, [ads]); // Only re-run when adsData changes

  return !sectionInfo?.is_active || !ads?.length ? null : (
    <Carousel
      indicators
      fade
      slide={true}
      className="main-carousel"
      interval={2000}
    >
      {carouselItems}
    </Carousel>
  );
}

export default React.memo(MainCarousel);
