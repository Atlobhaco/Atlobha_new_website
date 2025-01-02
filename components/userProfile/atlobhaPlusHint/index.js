import SharedBtn from "@/components/shared/SharedBtn";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function AtlobhaPlusHint() {
  const { isMobile } = useScreenSize();
  return (
    <Box
      sx={{
        background: "#000",
        padding: isMobile ? "14px" : "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "10px",
        gap: "5px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "5px" : "20px",
          maxWidth: "70%",
        }}
      >
        <Image
          src="/logo/road-atlobha-text-white.svg"
          alt="logo"
          width={isMobile ? 38 : 55}
          height={isMobile ? 38 : 55}
        />
        <Box>
          <Box
            sx={{
              color: "#FFD400",
              fontSize: isMobile ? "12px" : "20px",
              fontWeight: "700",
              marginBottom: "5px",
            }}
          >
            تريد توصيل مجاني؟ ولكل طلباتك
          </Box>
          <Box
            sx={{
              color: "#fff",
              fontSize: isMobile ? "9px" : "14px",
              fontWeight: "400",
            }}
          >
            اشتراك الآن واستمتع بمزايا مالها مثيل
          </Box>
        </Box>
      </Box>
      <Box>
        <SharedBtn className="big-main-btn" text="joinNow" />
      </Box>
    </Box>
  );
}

export default AtlobhaPlusHint;
