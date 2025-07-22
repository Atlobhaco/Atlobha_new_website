import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React from "react";
import IconInsideCircle from "../IconInsideCircle";
import useCustomQuery from "@/config/network/Apiconfig";
import { QUICK_LINKS } from "@/config/endPoints/endPoints";
import { MARKETPLACE } from "@/constants/enums";
import { isAuth } from "@/config/hooks/isAuth";
import { useRouter } from "next/router";
import Image from "next/image";

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

  const textStyle = {
    color: "#6B7280",
    textAlign: "center",
    fontSize: isMobile ? "10px" : "24px",
    fontWeight: "700",
    maxWidth: "90px",
    marginTop: isMobile ? "3px" : "2px",
    lineHeight: isMobile ? "16px" : "32px",
    wordWrap: "break-word",
  };

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
        <Box
          key={item?.title + index}
          sx={{
            width: "fit-content",
          }}
        >
          <Box
            sx={{
              background: "white",
              width: isMobile ? "48px" : "88px",
              height: isMobile ? "48px" : "88px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px solid #D1D5DB",
              boxShadow: "0px 8.946px 19.681px 0px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                opacity: "0.8",
              },
              position: "relative",
            }}
            onClick={() => router.push(item?.link)}
          >
            <Image
              alt={item?.image?.url}
              src={item?.image?.url}
              width="22"
              height="22"
              loading="lazy"
              style={{
                width: "auto",
                height: "auto",
                minWidth: `${isMobile ? "22px" : "42px"}`,
                minHeight: `${isMobile ? "22px" : "42px"}`,
              }}
            />
          </Box>
          <Box sx={textStyle}>{item.title}</Box>
        </Box>
      ))}
    </Box>
  );
}

export default QuickLinks;
