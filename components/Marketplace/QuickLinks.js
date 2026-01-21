import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React from "react";
import useCustomQuery from "@/config/network/Apiconfig";
import { QUICK_LINKS } from "@/config/endPoints/endPoints";
import { MARKETPLACE } from "@/constants/enums";
import { isAuth } from "@/config/hooks/isAuth";
import { useRouter } from "next/router";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

function QuickLinks({ sectionInfo, setHasQuickLinks = () => {} }) {
  const { isMobile } = useScreenSize();
  const router = useRouter();
  const { secType } = router.query;

  const { data: quickLinksData } = useCustomQuery({
    name: [`quick-links-${sectionInfo?.id}`, sectionInfo?.is_active, isAuth()],
    url: `${QUICK_LINKS}?app_section=${secType || MARKETPLACE}&active=1`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active,
    select: (res) => res?.data?.data,
    onSuccess: (res) => setHasQuickLinks(res?.length),
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
              width: isMobile ? "53px" : "88px",
              height: isMobile ? "53px" : "88px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:hover": {
                opacity: "0.8",
              },
              position: "relative",
              backgroundImage: `url('${item?.image?.url}')`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            onClick={() => {
              if (analytics) {
                logEvent(analytics, "QUICK_LINK_ITEM_CLICKED", {
                  quick_link_url: item?.link,
                  quick_link_name: item?.title,
                });
              }
              router.push(item?.link);
            }}
          >
            {/* <Image
              alt={item?.image?.url}
              src={"https://atlobha-prod.s3.me-south-1.amazonaws.com/images/2025-Sep/mHsRtEFKiECtkHS0tbgkuCrVjYV3nLdBTBlILZQe.png"}
              width="22"
              height="22"
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                minWidth: `${isMobile ? "22px" : "42px"}`,
                minHeight: `${isMobile ? "22px" : "42px"}`,
              }}
            /> */}
          </Box>
          {/* <Box sx={textStyle}>{item.title}</Box> */}
        </Box>
      ))}
    </Box>
  );
}

export default QuickLinks;
