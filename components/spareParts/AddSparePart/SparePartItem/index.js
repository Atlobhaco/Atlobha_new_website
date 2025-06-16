import AddRemoveSparePart from "@/components/spareParts/AddRemoveSparePart";
import useLocalization from "@/config/hooks/useLocalization";
import { riyalImgOrange } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function SparePartItem({ data, showPrice = false }) {
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
          loading="lazy"
          src={
            data?.image ||
            data?.imgBase64 ||
            (data?.imgBase64 ? data?.imgBase64 : "/imgs/no-img-holder.svg")
          }
          width={isMobile ? 50 : 100}
          height={isMobile ? 50 : 100}
          alt="spare-part"
          style={noImgStyle}
          onError={(e) => (e.target.srcset = "/imgs/no-img-holder.svg")}
        />
      </Box>
      <Box>
        <AddRemoveSparePart data={data} showPrice={showPrice} />
      </Box>
      {showPrice && (
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
          {data?.total_price || data?.price} {riyalImgOrange()}
        </Box>
      )}
    </Box>
  );
}

export default SparePartItem;
