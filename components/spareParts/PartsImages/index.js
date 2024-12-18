import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function PartsImages() {
  const { isMobile } = useScreenSize();

  return (
    <Box>
      <Box
        sx={{
          color: "#6B7280",
          textAlign: "center",
          fontWeight: "700",
          fontSize: isMobile ? "10px" : "30px",
        }}
      >
        جميع القطع اصليه مضمونه بضمان شركاء اطلبها
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "35px",
          //   flexWrap: "wrap",
          overflow: "auto",
          mt: 3,
        }}
      >
        <Image
          src={"/imgs/magdoey.svg"}
          alt="magd"
          width={isMobile ? 53 : 113}
          height={isMobile ? 50 : 106}
        />
        <Image
          src={"/imgs/alpha.svg"}
          alt="alpha"
          width={isMobile ? 53 : 113}
          height={isMobile ? 50 : 106}
        />
        <Image
          src={"/imgs/mg.svg"}
          alt="MG"
          width={isMobile ? 53 : 113}
          height={isMobile ? 50 : 106}
        />
        <Image
          src={"/imgs/honda.svg"}
          alt="honda"
          width={isMobile ? 53 : 113}
          height={isMobile ? 50 : 106}
        />
        <Image
          src={"/imgs/toyo-tires.svg"}
          alt="toyo"
          width={isMobile ? 53 : 113}
          height={isMobile ? 50 : 106}
        />
        <Image
          src={"/imgs/chery.svg"}
          alt="chery"
          width={isMobile ? 53 : 113}
          height={isMobile ? 50 : 106}
        />
        <Image
          src={"/imgs/mg.svg"}
          alt="MG"
          width={isMobile ? 53 : 113}
          height={isMobile ? 50 : 106}
        />
        <Image
          src={"/imgs/toyo-tires.svg"}
          alt="toyo"
          width={isMobile ? 53 : 113}
          height={isMobile ? 50 : 106}
        />
      </Box>
    </Box>
  );
}

export default PartsImages;
