import useScreenSize from "@/constants/screenSize/useScreenSize";
import { CenterFocusStrong } from "@mui/icons-material";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function HeaderSection({
  arrowPath = "/icons/arrow-left.svg",
  title = "اشتر مرة اخري !",
  subtitle = false,
}) {
  const { isMobile } = useScreenSize();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          fontSize: "30px",
          fontWeight: "700",
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          fontSize: "24px",
          fontWeight: "700",
        }}
      >
        {subtitle}
        {subtitle && (
          <Image
            alt="img"
            src={arrowPath}
            width={isMobile ? 18 : 28}
            height={isMobile ? 18 : 28}
          />
        )}
      </Box>
    </Box>
  );
}

export default HeaderSection;
