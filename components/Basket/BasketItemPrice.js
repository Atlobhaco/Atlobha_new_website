import React from "react";
import { Box } from "@mui/material";
import ProductCardSkeleton from "@/components/cardSkeleton";
import { riyalImgOrange } from "@/constants/helpers";
import style from "../../components/shared/Navbar/ContentForBasketPopup/ContentForBasket.module.scss";


function BasketItemPrice({ data, loadingCart, prodIdClicked }) {
  return (
    <div
      style={{ textAlign: "right" }}
      className={style["products-contain_price"]}
    >
      {loadingCart && prodIdClicked === data?.product?.id ? (
        <ProductCardSkeleton
          height={"30px"}
          width="70px"
          customMarginBottom="0px"
        />
      ) : (
        <>
          {data?.product?.offer_price && false
            ? data?.product?.offer_price.toFixed(2)
            : data?.product?.price?.toFixed(2)}
          {data?.product?.offer_price || data?.product?.price
            ? riyalImgOrange()
            : null}
        </>
      )}
    </div>
  );
}

export default BasketItemPrice;
