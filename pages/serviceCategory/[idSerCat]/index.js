import ComingSoon from "@/components/comingSoon";
import MetaTags from "@/components/shared/MetaTags";
import { Box } from "@mui/material";
import React from "react";

function ServiceCategory() {
  return (
    <Box>
      <MetaTags title={"serviceCategory"} content={"serviceCategory"} />
      <ComingSoon />
    </Box>
  );
}

export default ServiceCategory;
