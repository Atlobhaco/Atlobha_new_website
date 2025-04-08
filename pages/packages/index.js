import ComingSoon from "@/components/comingSoon";
import MetaTags from "@/components/shared/MetaTags";
import { Box } from "@mui/material";
import React from "react";

function Packages() {
  return (
    <Box>
      <MetaTags title={"packages"} content={"packages"} />
      <ComingSoon />
    </Box>
  );
}

export default Packages;
