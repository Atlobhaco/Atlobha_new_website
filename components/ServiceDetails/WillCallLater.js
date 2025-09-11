import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { Box } from "@mui/material";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useLocalization from "@/config/hooks/useLocalization";

function WillCallLater() {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  
  return (
    <Box
      className="col-12"
      sx={{
        background: "rgba(196, 225, 253, 0.10)",
        padding: isMobile ? "4px 8px" : "7px 20px",
        borderRadius: "8px",
        display: "flex",
        fontSize: isMobile ? "12px" : "14px",
        fontWeight: "500",
        color: "#429DF8",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <ErrorIcon
        sx={{
          color: "#429DF8",
          width: isMobile ? 15 : "auto",
        }}
      />
      {t.callLater}
    </Box>
  );
}

export default WillCallLater;
