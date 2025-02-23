import { Box } from "@mui/material";
import React from "react";
import style from "./CategoryData.module.scss";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function CategoryData({ imgPath = "/imgs/accessories.svg", text = "text" }) {
  const { isMobile } = useScreenSize();
  return (
    <Box className={`${style["category"]}`}>
      {isMobile && <Box className={`${style["category-text"]}`}>{text}</Box>}
      <Box
        className={`${style["category-image"]}`}
        sx={{
          backgroundImage: `url('${imgPath}')`, 
        }}
      ></Box>
      {!isMobile && <Box className={`${style["category-text"]}`}>{text}</Box>}
    </Box>
  );
}

export default CategoryData;
