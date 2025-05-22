import { Box } from "@mui/material";
import React from "react";

function AnotherProducts({ prod }) {
  return (
    <Box>
      <Box
        sx={{
          color: "#1C1C28",
          fontWeight: "700",
          fontSize: "18px",
        }}
      >
        منتجات مشتركة
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {prod?.products?.map((product, index) => (
          <Box key={product?.id}>
            {product?.name} {+index < +prod?.products?.length - 1 && "+"}{" "}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default AnotherProducts;
