import {
  MARKETPLACE_PRODUCTS,
  RECENTLY_VIEWED,
} from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React, { useState } from "react";
import HeaderSection from "../HeaderSection";
import ProductCard from "../shared/ProductCard";
import PaginateComponent from "../Pagination";
import { isAuth } from "@/config/hooks/isAuth";

function RecentlyViewed({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  const [page, setPage] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const { isLoading } = useCustomQuery({
    name: [
      `recentlyViewed${sectionInfo?.id}`,
      sectionInfo?.is_active,
      isMobile,
      page,
    ],
    url: `${MARKETPLACE_PRODUCTS}${RECENTLY_VIEWED}?page=${page}&per_page=${
      isMobile ? 10 : 12
    }`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active,
    select: (res) => res?.data,
    onSuccess: (res) => setRecentlyViewed(res),
  });

  return !sectionInfo?.is_active || !recentlyViewed?.data?.length ? null : (
    <Box
      sx={{
        display: "flex",
        gap: isMobile ? "10px" : "25px",
        flexDirection: "column",
      }}
    >
      <HeaderSection
        // showArrow={true}
        // subtitle={t.showAll}
        title={sectionInfo?.title}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: isMobile ? "no-wrap" : "wrap",
          gap: isMobile ? "5px" : "20px",
          justifyContent: isMobile ? "start" : "start",
          overflow: "auto hidden",
        }}
      >
        {recentlyViewed?.data?.map((prod) => (
          <Box>
            <ProductCard product={prod} hasNum={prod?.image} />
          </Box>
        ))}
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", mt: isMobile ? 1 : 2 }}
      >
        <PaginateComponent
          meta={recentlyViewed?.meta}
          setPage={setPage}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
}

export default RecentlyViewed;
