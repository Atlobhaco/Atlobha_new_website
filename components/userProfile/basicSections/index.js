import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

function BasicSections({
  src,
  title,
  num,
  onClick = () => {},
  path = "",
  img,
  activeSrc,
}) {
  const router = useRouter();
  const { isMobile } = useScreenSize();

  const mainStyle = {
    background: router?.pathname?.includes(path)
      ? "#232323 !important"
      : "white",
    padding: isMobile ? "16px 20px" : "20px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: " 10px",
    border: "1px solid #F0F0F0",
    cursor: "pointer",
    mb: 1,
    "&:hover": {
      background: "#f7f7f7e0",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    svg: {
      fontSize: isMobile ? "20px" : "30px",
    },
  };
  const numStyle = {
    background: router?.pathname?.includes(path) ? "#374151" : "#000",
    padding: "2px",
    borderRadius: "50%",
    color: "#fff",
    minWidth: isMobile ? "20px" : "25px",
    minHeight: isMobile ? "20px" : "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isMobile ? "12px" : "16px",
  };

  return (
    <Box sx={mainStyle} onClick={onClick}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "5px" : "10px",
        }}
      >
        {router?.pathname?.includes(path) ? activeSrc : src}
        <Box
          sx={{
            fontSize: isMobile ? "12px" : "17px",
            fontWeight: "500",
            color: router?.pathname?.includes(path)
              ? "#fff !important"
              : "#232323",
          }}
        >
          {title}
        </Box>
      </Box>
      <Box>{!!num && <Box sx={numStyle}>{num}</Box>}</Box>
    </Box>
  );
}

export default BasicSections;
