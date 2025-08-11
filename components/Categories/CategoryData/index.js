import { Box } from "@mui/material";
import React from "react";
import style from "./CategoryData.module.scss";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useRouter } from "next/router";

function CategoryData({
  imgPath = "/imgs/accessories.svg",
  text = "text",
  keyValue = null,
  bgImage = null,
  category,
}) {
  const { isMobile } = useScreenSize();
  const router = useRouter();

  return (
    <Box
      className={`${style["category"]}`}
      sx={{
        ...(bgImage
          ? {
              backgroundImage: `url('${bgImage}')`,
              backgroundPosition: "center",
            }
          : { backgroundColor: "#FFFFF7" }),
        boxShadow: "0 4px 4px 0 rgba(217, 217, 217, 0.50)",
      }}
      key={keyValue}
      onClick={() => {
        router.push({
          pathname: `/category/${category?.id}`,
        });
      }}
    >
      {/* {isMobile && <Box className={`${style["category-text"]}`}>{text}</Box>} */}
      <Box className={`${style["category-text"]}`}>{text}</Box>
      <Box
        className={`${style["category-image"]}`}
        sx={{
          backgroundImage: `url('${imgPath}')`,
        }}
      ></Box>
    </Box>
  );
}

export default CategoryData;
