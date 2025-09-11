import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function NoServiceInsideSections() {
  const { t } = useLocalization();

  return (
    <>
      <Image
        src="/icons/empty-box.svg"
        width={150}
        height={150}
        alt="empty-icon"
      />
      <Box
        sx={{
          color: "#1C1C28",
          fontSize: "20px",
          fontWeight: "500",
          mb: 1,
        }}
      >
        {t.noServicesInside}
      </Box>
      <Box
        sx={{
          color: "#0F172A",
          fontSize: "12px",
          fontWeight: "400",
          mb: 2,
        }}
      >
        {t.soonWillBeAdded}
      </Box>
    </>
  );
}

export default NoServiceInsideSections;
