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
          ? { backgroundImage: `url('${bgImage}')` }
          : { backgroundColor: "#f9dd4b" }),
      }}
      key={keyValue}
      onClick={() => {
        router.push({
          pathname: `/category/${category?.id}`,
          query: {
            name: category?.name,
            tags: category?.tags?.[0]?.name,
            label: category?.labels[0],
            subCategory: category?.subcategory?.length
              ? category?.subcategory?.map((info) => info?.name)?.join(",")
              : "",
            img: category?.image,
          },
        });
      }}
    >
      {/* {isMobile && <Box className={`${style["category-text"]}`}>{text}</Box>} */}
      <Box
        className={`${style["category-image"]}`}
        sx={{
          backgroundImage: `url('${imgPath}')`,
        }}
      ></Box>
      <Box className={`${style["category-text"]}`}>{text}</Box>
    </Box>
  );
}

export default CategoryData;
