import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import SharedBtn from "../shared/SharedBtn";
import { useRouter } from "next/router";

function GlobalSearchNoResults() {
  const { t } = useLocalization();
  const router = useRouter();

  return (
    <>
      <Image
        src="/icons/empty-view-icon.svg"
        width={125}
        height={105}
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
        {t.noResultRelated}
      </Box>
      <Box
        sx={{
          color: "#0F172A",
          fontSize: "12px",
          fontWeight: "400",
          mb: 2,
        }}
      >
        {t.canMakePricingrequest}
      </Box>
      <SharedBtn
        onClick={() => {
          router.push(`/spareParts`);
        }}
        className="big-main-btn"
        text="makeSpare"
      />
    </>
  );
}

export default GlobalSearchNoResults;
