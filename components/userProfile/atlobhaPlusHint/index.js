import SharedBtn from "@/components/shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function AtlobhaPlusHint() {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  return (
    <Box
      sx={{
        background: "#000",
        padding: isMobile ? "14px" : "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "10px",
        gap: isMobile ? "5px" : "20px",
        flexDirection: isMobile ? "row" : "column",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => alert("clicked")}
    >
      {!isMobile && (
        <Image
          src="/imgs/logo-brand.png"
          alt="logo"
          width={isMobile ? 38 : 424}
          height={isMobile ? 38 : 200}
          style={{
            left: "2.25px",
            bottom: "1px",
            position: "absolute",
            height: "100%",
            width: "unset",
          }}
        />
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "5px" : "20px",
          maxWidth: "70%",
          flexDirection: isMobile ? "row" : "column",
        }}
      >
        <Image
          src="/logo/road-atlobha-text-white.svg"
          alt="logo"
          width={isMobile ? 30 : 55}
          height={isMobile ? 30 : 55}
        />
        <Box>
          <Box
            sx={{
              color: "#FFD400",
              fontSize: isMobile ? "10px" : "20px",
              fontWeight: "700",
              marginBottom: isMobile ? "2px" : "5px",
              textAlign: isMobile ? "start" : "center",
            }}
          >
            {t.wantFreeDelivery}
          </Box>
          <Box
            sx={{
              color: "#fff",
              fontSize: isMobile ? "8px" : "14px",
              fontWeight: "400",
              textAlign: isMobile ? "start" : "center",
            }}
          >
            {t.subscribeNow}
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
