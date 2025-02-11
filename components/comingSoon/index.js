import { Box } from "@mui/material";
import React from "react";
import style from "./comingSoon.module.scss";
import Image from "next/image";

function ComingSoon() {
  return (
    <Box className={`${style["soon"]}`}>
      <Box className="d-flex">
        <Image
          alt="img-atlobha"
          src="/logo/ar-en-road-atlobha.svg"
          width={276}
          height={40}
          className="mx-auto"
        />
      </Box>
      <Box className="d-flex mt-4">
        <Image
          alt="maintance-atlobha"
          src="/imgs/maintance-man.svg"
          width={346}
          height={231}
          className="mx-auto"
        />
      </Box>
      <Box className={`mt-3 ${style["header"]}`}>🚀 قريبًا على الموقع!</Box>
      <Box>
        <Image
          alt="patter-atlobha"
          src="/icons/pattern.png"
          width={346}
          height={231}
          style={{
            position: "absolute",
            width: "100%",
            left: "0px",
            top: "52%",
          }}
        />
      </Box>
    </Box>
  );
}

export default ComingSoon;
