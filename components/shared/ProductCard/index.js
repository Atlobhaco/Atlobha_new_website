import React, { useState } from "react";
import style from "./ProductCard.module.scss";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import AddRemoveBtn from "@/components/AddRemoveBtnProd";
import { riyalImgOrange, riyalImgRed } from "@/constants/helpers";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useRouter } from "next/router";

function ProductCard({ product }) {
  const router = useRouter();

  //   console.log(product);
  //   const returnSpecificLabelColor = () => {
  //     if (product?.has_free_delivery) {
  //       return "green";
  //     }
  //   };

  //   const renderLabelForProduct = (type) => {
  //     switch (type) {
  //       case "red":
  //         return { bgColor: "red", text: "redLabel" };
  //       case "green":
  //         return { bgColor: "#6FBC36", text: "توصيل مجاني" };
  //       case "yellow":
  //         return { bgColor: "#FFD400", text: "عروض الصيانة", textColor: "#000" };
  //       case "grey":
  //         return { bgColor: "#B0B0B0", text: "لا يوجد مخزون" };
  //       default:
  //         return { bgColor: "", text: "" };
  //     }
  //   };

  return (
    <Box
      className={`${style["prod"]}`}
      key={product?.id}
      onClick={() => router.push(`/product/${product?.id}`)}
    >
      <Box
        className={`${style["prod-img-wrapper"]}`}
        sx={{
          //   background: `center / contain no-repeat url(${
          //     product?.image || "/imgs/no-prod-img.svg"
          //   })`,
          height: "100%",
        }}
      >
        <Image
          src={product?.image || "/imgs/no-prod-img.svg"}
          alt="Product"
          width={200}
          height={200}
          onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
          style={{
            width: "auto",
            height: "auto",
            // maxWidth: (product?.image || isMobile) && "100%",
            maxWidth: "100%",
            // maxHeight: (product?.image || isMobile) && "100%",
            maxHeight: "100%",
            borderRadius: "8px",
            margin: "auto",
          }}
        />
        <Box>
          <AddRemoveBtn product={product} />
        </Box>
      </Box>
      <Box className={`${style["prod-info-wrapper"]}`}>
        {!!product?.price_before_discount && (
          <Box className={`${style["prod-info-wrapper_old-price"]}`}>
            {product?.price_before_discount}
          </Box>
        )}

        <Box
          sx={{
            color: product?.price_before_discount ? "#EB3C24" : "#ee772f",
          }}
          className={`${style["prod-info-wrapper_price"]}`}
        >
          {product?.price_before_discount
            ? product?.offer_price.toFixed(2)
            : product?.price?.toFixed(2)}
          {product?.price_before_discount ? riyalImgRed() : riyalImgOrange()}
        </Box>

        {!!product?.price_before_discount && (
          <Box className={`${style["prod-disc_percentage"]}`}>
            {(
              ((product?.price_before_discount - product?.offer_price) /
                product?.price_before_discount) *
              100
            )?.toFixed(0)}
            %
          </Box>
        )}

        {product?.desc && (
          <Box className={`${style["prod-info-wrapper_describe"]}`}>
            {product?.desc}
          </Box>
        )}
      </Box>

      {!!product?.tags?.length && (
        <Box
          sx={{
            background: product?.tags[0]?.color,
            color: "white",
          }}
          className={`${style["prod-label"]}`}
        >
          {product?.tags[0]?.name}
        </Box>
      )}
    </Box>
  );
}

export default ProductCard;
