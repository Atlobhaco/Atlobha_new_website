import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function PartsImages() {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const imgs = [
    {
      imgPath: "/imgs/spareParts/alpha.svg",
    },
    {
      imgPath: "/imgs/spareParts/chery.svg",
    },
    {
      imgPath: "/imgs/spareParts/chrysler.svg",
    },
    {
      imgPath: "/imgs/spareParts/citroen.svg",
    },
    {
      imgPath: "/imgs/spareParts/dodge.svg",
    },
    {
      imgPath: "/imgs/spareParts/fiat.svg",
    },
    {
      imgPath: "/imgs/spareParts/geely.svg",
    },
    {
      imgPath: "/imgs/spareParts/genisis.svg",
    },
    {
      imgPath: "/imgs/spareParts/gwm.svg",
    },
    {
      imgPath: "/imgs/spareParts/haval.svg",
    },
    {
      imgPath: "/imgs/spareParts/honda.svg",
    },
    {
      imgPath: "/imgs/spareParts/hyndai.svg",
    },
    {
      imgPath: "/imgs/spareParts/isuzu.svg",
    },
    {
      imgPath: "/imgs/spareParts/jeep.svg",
    },
    {
      imgPath: "/imgs/spareParts/mg.svg",
    },
    {
      imgPath: "/imgs/spareParts/nexen.svg",
    },
    {
      imgPath: "/imgs/spareParts/nissan.svg",
    },
    {
      imgPath: "/imgs/spareParts/pegeout.svg",
    },
    {
      imgPath: "/imgs/spareParts/ram.svg",
    },
    {
      imgPath: "/imgs/spareParts/renault.svg",
    },
    {
      imgPath: "/imgs/spareParts/subaru.svg",
    },
    {
      imgPath: "/imgs/spareParts/tajeer.svg",
    },
    {
      imgPath: "/imgs/spareParts/tank.svg",
    },
    {
      imgPath: "/imgs/spareParts/toyo-tires.svg",
    },
  ];

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
        {t.partsAreOriginal}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? "40px" : "90px",
          // flexWrap: "wrap",
          overflow: "auto",
          mt: 3,
          mb: 1,
          pb: isMobile ? 1 : 2,
        }}
      >
        {imgs?.map((img) => (
          <Image
            key={img?.imgPath}
            src={img?.imgPath}
            alt={img?.imgPath}
            width={isMobile ? 53 : 113}
            height={isMobile ? 50 : 106}
          />
        ))}
      </Box>
    </Box>
  );
}

export default PartsImages;
