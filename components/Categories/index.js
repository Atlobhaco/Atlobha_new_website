import { Box } from "@mui/material";
import React from "react";
import HeaderSection from "../HeaderSection";
import CategoryData from "./CategoryData";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function Categories() {
  const { isMobile } = useScreenSize();
  return (
    <Box sx={{ display: "flex", gap: "25px", flexDirection: "column" }}>
      <HeaderSection title="تصنيفات اطلبها" subtitle="asd" />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "12px" : "32px",
        }}
      >
        <CategoryData imgPath="/imgs/oils.svg" text="oils" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/oils.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/accessories.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/accessories.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/accessories.svg" text="اكسسورات" />
        <CategoryData imgPath="/imgs/accessories.svg" text="اكسسورات" />
      </Box>
    </Box>
  );
}

export default Categories;
