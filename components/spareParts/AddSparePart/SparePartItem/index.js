import AddRemoveSparePart from "@/components/spareParts/AddRemoveSparePart";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function SparePartItem() {
  const { isMobile } = useScreenSize();

  const imgHolderStyle = {
    borderRadius: isMobile ? "8px" : "20px",
    overflow: "hidden",
    width: isMobile ? "50px" : "62px",
    height: isMobile ? "50px" : "62px",
    background: "#E6E6E6",
    display: "flex",
  };

  const noImgStyle = {
    borderRadius: isMobile ? "8px" : "20px",
    opacity: "0.2",
    width: "37px",
    margin: "auto",
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      <Box sx={imgHolderStyle}>
        <Image
          src="/imgs/ar-en-atlobha.svg"
          width={isMobile ? 50 : 62}
          height={isMobile ? 50 : 62}
          alt="spare-part"
          style={noImgStyle}
        />
      </Box>
      <Box>
        <AddRemoveSparePart />
      </Box>
    </Box>
  );
}

export default SparePartItem;
