import { RECENTLY_VIEWED, SERVICES } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React, { useState } from "react";
import HeaderSection from "../../HeaderSection";
import PaginateComponent from "../../Pagination";
import { isAuth } from "@/config/hooks/isAuth";
import ServiceCard from "@/components/shared/serviceCard";

function RecentlyViewedServices({ sectionInfo }) {
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
    url: `${SERVICES}${RECENTLY_VIEWED}?page=${page}&per_page=${
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
      <HeaderSection title={sectionInfo?.title} />
      <Box
        sx={{
          display: "flex",
          flexWrap: isMobile ? "no-wrap" : "wrap",
          gap: isMobile ? "5px" : "10px",
          justifyContent: isMobile ? "start" : "start",
          overflow: "auto hidden",
        }}
      >
        {recentlyViewed?.data?.map((prod) => (
          <Box>
            <ServiceCard service={prod} />
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

export default RecentlyViewedServices;
