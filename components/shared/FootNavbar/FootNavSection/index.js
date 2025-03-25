import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import style from "../FootNavbar.module.scss";

function FootNavSection({
  icon,
  text = false,
  activeTab = false,
  onClick = () => {},
  customWidth = null,
  customHeight = null,
  hasNum = false,
}) {
  const numStyle = {
    position: "absolute",
    top: "-9px",
    left: "-15px",
    background: "black",
    borderRadius: "50%",
    fontSize: "11px",
    fontWeight: "bold",
    color: "white",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "2px",
  };
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        width: "75px",
        flexDirection: "column",
        justifyContent: customWidth ? "center" : "flex-end",
        alignItems: "center",
        gap: "7px",
        color: "#A7AEC1",
        cursor: "pointer",
      }}
      className={`${activeTab ? style["activeTab"] : ""}`}
    >
      <Box
        sx={{
          width: customWidth || "24px",
          position: "relative",
          height: customHeight || "24px",
        }}
      >
        {hasNum > 0 && (
          <Box sx={numStyle} component="span">
            {hasNum}
          </Box>
        )}
        {icon}
      </Box>
      {text}
    </Box>
  );
}

export default FootNavSection;
