import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import style from "../../components/ColoredHint/ColoredHint.module.scss";

function HeaderSection({
  arrowPath = "/icons/arrow-left.svg",
  title = "اشتر مرة اخري !",
  subtitle = false,
  showArrow = false,
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
          fontSize: isMobile ? "20px" : "30px",
          fontWeight: "700",
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {subtitle && (
          <Box
            sx={{
              fontSize: isMobile ? "10px" : "24px",
              fontWeight: "700",
            }}
          >
            {subtitle}
          </Box>
        )}
        {showArrow && (
          <Box className={`${style["hint-icon"]}`}>
            <Image
              alt="img"
              src={arrowPath}
              width={isMobile ? 15 : 28}
              height={isMobile ? 15 : 28}
              style={{ marginBottom: isMobile ? "0px" : "-8px" }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default HeaderSection;
