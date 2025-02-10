import AddRemoveSparePart from "@/components/spareParts/AddRemoveSparePart";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function SparePartItem({ data, insideOrder = false }) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

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
          src={
            data?.image ||
            (data?.imgSrc ? data?.imgSrc : "/imgs/no-img-holder.svg")
          }
          width={isMobile ? 50 : 100}
          height={isMobile ? 50 : 100}
          alt="spare-part"
          style={noImgStyle}
        />
      </Box>
      <Box>
        <AddRemoveSparePart data={data} insideOrder={insideOrder} />
      </Box>
      {/* {insideOrder && (
        <Box
          sx={{
            display: "flex",
            flex: "1",
            justifyContent: "flex-end",
            color: "#EE772F",
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "500",
          }}
        >
          {data?.total_price} {t.sar}
        </Box>
      )} */}
    </Box>
  );
}

export default SparePartItem;
