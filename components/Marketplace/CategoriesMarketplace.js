import useLocalization from "@/config/hooks/useLocalization";
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
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );

  const { data: categories } = useCustomQuery({
    name: ["marketplace-categories"],
    url: `${MARKETPLACE}${CATEGORY}?lat=${
      defaultAddress?.lat || selectedAddress?.lat
    }&lng=${defaultAddress?.lng || selectedAddress?.lng}`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() &&
        sectionInfo?.is_active &&
        (defaultAddress?.lat || selectedAddress?.lat)
      : (sectionInfo?.is_active &&
          (defaultAddress?.lat || selectedAddress?.lat)) ||
        false,
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
      <HeaderSection title={sectionInfo?.title} />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "12px" : "32px",
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
