import { Box } from "@mui/material";
import React, { useState } from "react";
import HeaderSection from "../HeaderSection";
import {
  MARKETPLACE_PRODUCTS,
  RECENTLY_ORDERED,
} from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useLocalization from "@/config/hooks/useLocalization";
import ProductCard from "../shared/ProductCard";
import { isAuth } from "@/config/hooks/isAuth";
import PaginateComponent from "../Pagination";

function BoughtAgain({ sectionInfo }) {
  const { t } = useLocalization();
  const { isMobile, isTablet } = useScreenSize();
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);

  const { isLoading } = useCustomQuery({
    name: [
      `buy-it-again${sectionInfo?.id}`,
      page,
      sectionInfo?.is_active,
      isMobile,
    ],
    url: `${MARKETPLACE_PRODUCTS}${RECENTLY_ORDERED}?page=${page}&per_page=${
      isMobile ? 3 : 8
    }`,
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
          gap: isMobile ? "5px" : "20px",
          justifyContent: "start",
          margin: isMobile ? "auto" : "",
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

export default BoughtAgain;
