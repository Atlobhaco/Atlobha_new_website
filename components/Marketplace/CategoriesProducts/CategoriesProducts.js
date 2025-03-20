import HeaderSection from "@/components/HeaderSection";
import PaginateComponent from "@/components/Pagination";
import ProductCard from "@/components/shared/ProductCard";
import { CATEGORY, MARKETPLACE, PRODUCTS } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React, { useState } from "react";

function CategoriesProducts({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);

  const { isLoading } = useCustomQuery({
    name: [
      `marketplace-category${sectionInfo?.id}`,
      sectionInfo?.is_active,
      isMobile,
      page,
    ],
    url: `${MARKETPLACE}${CATEGORY}/${
      sectionInfo?.marketplace_category?.id
    }${PRODUCTS}?page=${page}&per_page=${isMobile ? 3 : 10}`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active,
    select: (res) => res?.data,
    onSuccess: (res) => setAllData(res),
  });

  return !sectionInfo?.is_active || !allData?.data?.length ? null : (
    <Box
      sx={{
        display: "flex",
        gap: isMobile ? "10px" : "25px",
        flexDirection: "column",
      }}
    >
      <HeaderSection
        showArrow={true}
        subtitle={t.showAll}
        title={sectionInfo?.title}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: isMobile ? "no-wrap" : "wrap",
          gap: isMobile ? "5px" : "32px",
          justifyContent: isMobile ? "center" : "start",
        }}
      >
        {allData?.data?.map((prod) => (
          <ProductCard product={prod} hasNum={prod?.image} />
        ))}
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", mt: isMobile ? 1 : 2 }}
      >
        <PaginateComponent
          meta={allData?.meta}
          setPage={setPage}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
}

export default CategoriesProducts;
