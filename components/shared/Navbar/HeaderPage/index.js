import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

function HeaderPage() {
  const { isMobile } = useScreenSize();
  const router = useRouter();
  const spareParts = router?.pathname?.includes("spare");

  const renderHeaderDependOnUrl = () => {
    if (spareParts) {
      return "تسعير قطع الغيار";
    } else {
      return "طلبات المتجر";
    }
  };
  
  return (
    <Box
      sx={{
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
