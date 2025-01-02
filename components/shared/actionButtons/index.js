import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import Image from "next/image";
import React from "react";

function ActionButtons({
  type = "edit",
  onClick = () => {},
  showLoaderWhenDelete = false,
}) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  const actionBox = {
    width: isMobile ? "35px" : "50px",
    height: isMobile ? "30px" : "40px",
    borderRadius: "10px",
    padding: isMobile ? "8px" : "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  const renderButton = () => {
    switch (type) {
      case "edit":
        return (
          <Tooltip title={t.common.edit}>
            <Box
              sx={{
                ...actionBox,
                background: "#E7F5FF",
              }}
              onClick={onClick}
            >
              <Image
                alt="info"
                src={"/icons/pen-blue.svg"}
                width={isMobile ? 15 : 24}
                height={isMobile ? 15 : 24}
              />
            </Box>
          </Tooltip>
        );
      case "delete":
        return (
          <Tooltip title={t.common.delete}>
            <Box
              sx={{
                ...actionBox,
                background: "#FFE4DD",
              }}
              onClick={onClick}
            >
              {showLoaderWhenDelete ? (
                <CircularProgress color="inherit" size={10} />
              ) : (
                <Image
                  alt="info"
                  src={"/icons/basket-red.svg"}
                  width={isMobile ? 15 : 24}
                  height={isMobile ? 15 : 24}
                />
              )}
            </Box>
          </Tooltip>
        );
      case "details":
        return (
          <Tooltip title={t.common.details}>
            <Box
              sx={{
                ...actionBox,
                background: "#E9FAEF",
              }}
              onClick={onClick}
            >
              <Image
                alt="info"
                src={"/icons/exclamation-green.svg"}
                width={isMobile ? 15 : 24}
                height={isMobile ? 15 : 24}
              />
            </Box>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return renderButton();
}

export default ActionButtons;
