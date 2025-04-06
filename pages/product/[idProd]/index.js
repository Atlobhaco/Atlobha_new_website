import ComingSoon from "@/components/comingSoon";
import MetaTags from "@/components/shared/MetaTags";
import { Box } from "@mui/material";
import React from "react";

function ProductDetails() {
  return (
    <Box>
      <MetaTags title={"product"} content={"product"} />
      <ComingSoon />
    </Box>
  );
}

export default ProductDetails;
