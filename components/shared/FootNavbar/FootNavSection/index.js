import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import style from "../FootNavbar.module.scss";
import useLocalization from "@/config/hooks/useLocalization";

function FootNavSection({
  icon,
  text = false,
  activeTab = false,
  onClick = () => {},
  customWidth = null,
  customHeight = null,
  hasNum = false,
}) {
  const { locale } = useLocalization();

  const numStyle = {
    position: "absolute",
    top: "-9px",
    ...(locale === "ar" ? { left: "-15px" } : { right: "-15px" }),
    background: activeTab ? "#f9dd4b" : "black",
    borderRadius: "50%",
    fontSize: "11px",
    fontWeight: "bold",
    color: activeTab ? "black" :"white",
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
          width: customWidth || "26px",
          position: "relative",
          height: customHeight || "26px",
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
