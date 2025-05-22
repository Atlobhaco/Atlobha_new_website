import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function LogoLoader() {
  return (
    <>
      <span class="loader-logo">
        <Image
          src={`/logo/atlobha-ar-en.svg`}
          alt="loader-logo"
          width={80}
          height={80}
        />
      </span>
      <Box
        sx={{
          mt: 1,
          fontSize: "21px",
          fontWeight: "500",
        }}
      >
        {/* Atlobha-اطلبها */}
      </Box>
    </>
  );
}

export default LogoLoader;
