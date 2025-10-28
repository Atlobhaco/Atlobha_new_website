import { Box } from "@mui/material";
import React from "react";
import HeaderSection from "../HeaderSection";
import CategoryData from "../Categories/CategoryData";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useCustomQuery from "@/config/network/Apiconfig";
import { CATEGORY, MARKETPLACE } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import { useSelector } from "react-redux";

function CategoriesMarketplace({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);

  const { data: categories } = useCustomQuery({
    name: [`marketplace-categories=${sectionInfo?.id}`],
    url: `${MARKETPLACE}${CATEGORY}?lat=${
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
      }}
    >
      <Box
        sx={{
          px: isMobile ? 1 : "unset",
        }}
      >
        <HeaderSection title={sectionInfo?.title} />
      </Box>
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
            imgPath={cat?.image}
            text={cat?.name}
            bgImage={cat?.background_image?.url}
          />
        ))}
      </Box>
    </Box>
  );
}

export default CategoriesMarketplace;
