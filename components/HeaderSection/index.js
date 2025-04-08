import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import style from "../../components/ColoredHint/ColoredHint.module.scss";
import useLocalization from "@/config/hooks/useLocalization";

function HeaderSection({
  arrowPath = "/icons/arrow-left.svg",
  title = "اشتر مرة اخري !",
  subtitle = false,
  showArrow = false,
  onClick = () => {},
}) {
  const { isMobile } = useScreenSize();
  const { locale } = useLocalization();

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
            onClick={onClick}
            sx={{
              fontSize: isMobile ? "10px" : "24px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {subtitle}
          </Box>
        )}
        {showArrow && (
          <Box className={`${style["hint-icon"]}`} onClick={onClick}>
            <Image
              alt="img"
              src={arrowPath}
              width={isMobile ? 15 : 28}
              height={isMobile ? 15 : 28}
              style={{
                cursor: "pointer",
                marginBottom: isMobile || locale === "ar" ? "0px" : "-8px",
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default HeaderSection;
