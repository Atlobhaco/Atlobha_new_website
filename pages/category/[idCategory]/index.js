import ComingSoon from "@/components/comingSoon";
import MetaTags from "@/components/shared/MetaTags";
import { Box } from "@mui/material";
import React from "react";

function Category() {
  return (
    <Box>
      <MetaTags title={"category"} content={"category"} />

      <ComingSoon />
    </Box>
  );
}

export default Category;
