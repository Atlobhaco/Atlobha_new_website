import AddRemoveSparePart from "@/components/spareParts/AddRemoveSparePart";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function SparePartItem({ data }) {
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
    opacity: "1",
    width: "100%",
    height: "100%",
    margin: "auto",
  };

  return (
    <Box
      key={data?.id}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: "40px",
      }}
    >
      <Box sx={imgHolderStyle}>
        <Image
          src={data?.imgSrc ? data?.imgSrc : "/imgs/no-img-holder.svg"}
          width={isMobile ? 50 : 100}
          height={isMobile ? 50 : 100}
          alt="spare-part"
          style={noImgStyle}
        />
      </Box>
      <Box>
        <AddRemoveSparePart data={data} />
      </Box>
    </Box>
  );
}

export default SparePartItem;
