import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function BasicSections({ src, title, num, onClick = () => {} }) {
  const { isMobile } = useScreenSize();

  const mainStyle = {
    background: "white",
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
  };
  const numStyle = {
    background: "#000",
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
        <Image
          src={src}
          alt="icon"
          width={isMobile ? 20 : 30}
          height={isMobile ? 20 : 30}
        />
        <Box
          sx={{
            color: "#232323",
            fontSize: isMobile ? "12px" : "17px",
            fontWeight: "500",
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
