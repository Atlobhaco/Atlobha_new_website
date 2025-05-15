import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React from "react";
import IconInsideCircle from "../IconInsideCircle";
import useCustomQuery from "@/config/network/Apiconfig";
import { QUICK_LINKS } from "@/config/endPoints/endPoints";
import { MARKETPLACE } from "@/constants/enums";
import { isAuth } from "@/config/hooks/isAuth";
import { useRouter } from "next/router";

function QuickLinks({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const router = useRouter();

  const { data: quickLinksData } = useCustomQuery({
    name: ["quick-links", sectionInfo?.is_active],
    url: `${QUICK_LINKS}?app_section=${MARKETPLACE}&active=1`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active,
    select: (res) => res?.data?.data,
  });

  return !sectionInfo?.is_active || !quickLinksData?.length ? null : (
    <Box
      sx={{
        display: "flex",
        overflow: "auto hidden",
        gap: isMobile ? "15px" : "30px",
        paddingBottom: "5px",
      }}
    >
      {quickLinksData?.map((item, index) => (
        <IconInsideCircle
          key={item?.title + index} // Add a unique key for each element
          title={item.title}
          width={isMobile ? "48px" : "88px"}
          height={isMobile ? "48px" : "88px"}
          imgHeight={isMobile ? "22" : "42"}
          imgWidth={isMobile ? "22" : "42"}
          iconUrl={item?.image?.url}
          onClick={() => router.push(item?.link)}
        />
      ))}
    </Box>
  );
}

export default QuickLinks;
