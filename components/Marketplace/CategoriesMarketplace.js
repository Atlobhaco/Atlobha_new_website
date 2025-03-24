import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import React from "react";
import HeaderSection from "../HeaderSection";
import CategoryData from "../Categories/CategoryData";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useCustomQuery from "@/config/network/Apiconfig";
import { SERVICE_CATEGORIES } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";

function CategoriesMarketplace({ sectionInfo }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  const { data: categories } = useCustomQuery({
    name: ["marketplace-categories"],
    url: `${SERVICE_CATEGORIES}`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active,
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
            keyValue={cat?.name}
            imgPath={cat?.image?.url}
            text={cat?.name}
          />
        ))}
      </Box>
    </Box>
  );
}

export default CategoriesMarketplace;
