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
}) {
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
          height: customHeight || "24px",
        }}
      >
        {icon}
      </Box>
      {text}
    </Box>
  );
}

export default FootNavSection;
