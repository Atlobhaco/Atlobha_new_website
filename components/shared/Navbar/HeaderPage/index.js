import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

function HeaderPage() {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const router = useRouter();
  const spareParts =
    router?.pathname?.includes("spare") && !router?.query?.secType;
  const { allGroups } = useSelector((state) => state.appGroups);

  const renderHeaderDependOnUrl = () => {
    if (router?.pathname?.includes("checkout")) return null;
    if (spareParts) {
      return t.sparePartPricing;
    }
    if (router?.pathname === "/") {
      return t.marketplacePage;
    } else {
      if (allGroups?.length) {
        return allGroups[1]?.sections?.find(
          (sec) =>
            sec?.title === router?.query?.secTitle ||
            sec?.type === router?.query?.secType ||
            sec?.title_ar === router?.query?.secTitle
        )?.title;
      }
      return router?.query?.secTitle;
    }
  };

  return (
    <Box
      sx={{
        width: isMobile ? "70vw" : "100%",
        color: "#252C32",
        fontSize: isMobile ? "20px" : "48px",
        fontWeight: "700",
        lineHeight: isMobile ? "30px" : "60px",
      }}
    >
      {renderHeaderDependOnUrl()}
    </Box>
  );
}

export default HeaderPage;
