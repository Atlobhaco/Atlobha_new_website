import React from "react";
import style from "./ProductCard.module.scss";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import AddRemoveBtn from "@/components/AddRemoveBtnProd";

function ProductCard({ prod = null, imgPath = "/imgs/prod-1.svg", hasNum }) {
  const { basket, items } = useSelector((state) => state.basket);

  
  return (
    <Box className={`${style["prod"]}`}>
      <Box
        className={`${style["prod-img-wrapper"]}`}
        sx={{
          background: `center / contain no-repeat url(${imgPath})`,
        }}
      >
        <Box>
          <AddRemoveBtn hasNum={hasNum} />
        </Box>
      </Box>
      <Box>info</Box>
    </Box>
  );
}

export default ProductCard;
