import { Box } from "@mui/material";
import React from "react";
import IconInsideCircle from "../IconInsideCircle";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function QuickChoose() {
  const { isMobile } = useScreenSize();

  const iconData = [
    { text: "info", iconUrl: "/icons/circles.svg" },
    { text: "info", iconUrl: "/icons/green-offer.svg" },
    { text: "info", iconUrl: "/icons/free-delivery.svg" },
    { text: "info", iconUrl: "/icons/free-delivery.svg" },
    { text: "info", iconUrl: "/icons/free-delivery.svg" },
    { text: "info", iconUrl: "/icons/free-delivery.svg" },
    { text: "info", iconUrl: "/icons/free-delivery.svg" },
    { text: "info", iconUrl: "/icons/free-delivery.svg" },
    { text: "info", iconUrl: "/icons/free-delivery.svg" },
    { text: "info", iconUrl: "/icons/free-delivery.svg" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        overflow: "auto hidden",
        gap: "10px",
        paddingBottom: "5px",
      }}
    >
      {iconData.map((item, index) => (
        <IconInsideCircle
          key={index} // Add a unique key for each element
          hasText={item.text}
          width={isMobile ? "50px" : "90px"}
          height={isMobile ? "50px" : "90px"}
          imgHeight={isMobile ? "24" : "42"}
          imgWidth={isMobile ? "24" : "42"}
          iconUrl={item.iconUrl}
        />
      ))}
    </Box>
  );
}

export default QuickChoose;
