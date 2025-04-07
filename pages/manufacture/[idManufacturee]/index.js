import ComingSoon from "@/components/comingSoon";
import MetaTags from "@/components/shared/MetaTags";
import { Box } from "@mui/material";
import React from "react";

function ManufactureDetails() {
  return (
    <Box>
      <MetaTags title={"manufactures"} content={"manufactures"} />
      <ComingSoon />
    </Box>
  );
}

export default ManufactureDetails;
