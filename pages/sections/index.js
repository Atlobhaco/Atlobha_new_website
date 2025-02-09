import MetaTags from "@/components/shared/MetaTags";
import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

function Sections() {
  const { t } = useLocalization();
  const router = useRouter();
  const { secTitle, secType } = router.query;

  return (
    <Box>
      <MetaTags title={secTitle} content={secType} />

      <Box
        sx={{
          mt: 5,
          fontWeight: "bold",
          fontSize: "25px",
          textAlign: "center",
        }}
      >
        coming soon
      </Box>
    </Box>
  );
}

export default Sections;
