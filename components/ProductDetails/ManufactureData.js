import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function ManufactureData({ prod }) {
  return (
    prod?.manufacturer && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          mt: 2,
        }}
      >
        <Box>
          <Image
            loading="lazy"
            width={20}
            height={20}
            alt="manufacture-img"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              display: "flex",
              margin: "auto",
              borderRadius: "8px",
            }}
            src={prod?.manufacturer?.logo?.url}
            onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
          />
        </Box>
        <Box
          sx={{
            color: "#429DF8",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          {prod?.manufacturer?.name}
        </Box>
      </Box>
    )
  );
}

export default ManufactureData;
