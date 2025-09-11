import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { Box } from "@mui/material";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useLocalization from "@/config/hooks/useLocalization";

function UserHasNoAddress() {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  return (
    <Box
      onClick={(e) => {
        e?.preventDefault();
        e?.stopPropagation();
        document?.getElementById("openAddAddressModalProgramatically")?.click();
      }}
      className="col-12"
      sx={{
        background: "rgba(224, 110, 14, 0.10)",
        padding: isMobile ? "4px 8px" : "7px 20px",
        borderRadius: "8px",
        display: "flex",
        fontSize: isMobile ? "12px" : "14px",
        fontWeight: "500",
        color: "#E06E0E",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
      }}
    >
      <ErrorIcon
        sx={{
          color: "#E06E0E",
          width: isMobile ? 15 : "auto",
        }}
      />
      {t.addAddressForTimes}
    </Box>
  );
}

export default UserHasNoAddress;
