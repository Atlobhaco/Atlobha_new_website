import { Box } from "@mui/material";
import React from "react";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useCustomQuery from "@/config/network/Apiconfig";
import { SERVICE_CATEGORIES } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import { useSelector } from "react-redux";
import HeaderSection from "@/components/HeaderSection";
import CategoryData from "@/components/Categories/CategoryData";
import { useRouter } from "next/router";

function CategoriesServices({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const router = useRouter();

  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);

  const { data: categories } = useCustomQuery({
    name: [`services-categories=${sectionInfo?.id}`],
    url: `${SERVICE_CATEGORIES}?lat=${
      selectedAddress?.lat || defaultAddress?.lat || 24.7136
    }&lng=${selectedAddress?.lng || defaultAddress?.lng || 46.6753}&model_id=${
      selectedCar?.model?.id || defaultCar?.model?.id
    }`,
    refetchOnWindowFocus: false,
    enabled:
      (sectionInfo?.is_active &&
        sectionInfo?.requires_authentication &&
        isAuth() &&
        (defaultAddress?.lat || selectedAddress?.lat)) ||
      (sectionInfo?.is_active && !sectionInfo?.requires_authentication),
    select: (res) => res?.data?.data,
  });

  return !sectionInfo?.is_active || !categories?.length ? null : (
    <Box
      sx={{
        display: "flex",
        gap: isMobile ? "10px" : "25px",
        flexDirection: "column",
        mb: 2,
      }}
    >
      <HeaderSection title={sectionInfo?.title} />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "12px" : "32px",
          justifyContent: isMobile ? "space-around" : "flex-start",
        }}
      >
        {categories?.map((cat) => (
          <CategoryData
            category={cat}
            keyValue={cat?.name}
            imgPath={cat?.image?.url}
            text={cat?.name}
            bgImage={cat?.background_image?.url}
            handleClick={() =>
              router.push(
                `/serviceCategory/${cat?.id}?secTitle=${router?.query?.secTitle}`
              )
            }
          />
        ))}
      </Box>
    </Box>
  );
}

export default CategoriesServices;
