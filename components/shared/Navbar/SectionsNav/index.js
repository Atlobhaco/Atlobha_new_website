import { Box } from "@mui/material";
import React from "react";
import style from "../Navbar.module.scss";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function SectionsNav({ selectedSection, setSelectedSection }) {
  const { isMobile } = useScreenSize();

  return (
    <Box
      className={`${style["sections-parent"]}`}
      sx={{
        display: "flex",
        overflow: "auto hidden",
        // gap: "8px",
        fontSize: isMobile ? "12px" : "24px",
        fontWeight: "700",
        pb: 1,
      }}
    >
      <Box
        onClick={() => setSelectedSection("1")}
        className={`${selectedSection === "1" && style["active"]}`}
      >
        تسعير قطع غيار السيارات
      </Box>
      <Box
        onClick={() => setSelectedSection("2")}
        className={`${selectedSection === "2" && style["active"]}`}
      >
        متجر قطع الغيار
      </Box>
      <Box>الخدمات</Box>
      <Box>SectionsNav</Box>
      <Box>SectionsNav</Box>
      <Box>SectionsNav</Box>
      <Box>SectionsNav</Box>
    </Box>
  );
}

export default SectionsNav;
