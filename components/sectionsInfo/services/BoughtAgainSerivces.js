import { Box } from "@mui/material";
import React, { useState } from "react";
import { RECENTLY_ORDERED, SERVICES } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { isAuth } from "@/config/hooks/isAuth";
import ServiceCard from "@/components/shared/serviceCard";
import HeaderSection from "@/components/HeaderSection";
import PaginateComponent from "@/components/Pagination";

function BoughtAgainServices({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);

  const { isLoading } = useCustomQuery({
    name: [
      `buy-it-again${sectionInfo?.id}`,
      page,
      sectionInfo?.is_active,
      isMobile,
    ],
    url: `${SERVICES}${RECENTLY_ORDERED}?page=${page}&per_page=${
      isMobile ? 10 : 12
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
      <HeaderSection title={sectionInfo?.title} />
      <Box
        sx={{
          display: "flex",
          flexWrap: isMobile ? "no-wrap" : "wrap",
          gap: isMobile ? "5px" : "10px",
          justifyContent: "start",
          margin: isMobile ? "" : "",
          overflow: "auto hidden",
        }}
      >
        {allData?.data?.map((prod) => (
          <Box>
            <ServiceCard service={prod} />
          </Box>
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

export default BoughtAgainServices;
