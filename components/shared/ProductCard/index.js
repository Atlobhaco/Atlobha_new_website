import React from "react";
import style from "./ProductCard.module.scss";
import { Box, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import AddRemoveBtn from "@/components/AddRemoveBtnProd";
import { riyalImgOrange, riyalImgRed } from "@/constants/helpers";
import Image from "next/image";

// Memoize the ProductCard component to optimize performance
const ProductCard = React.memo(({ product, preventOnClick = false }) => {
  const router = useRouter();

  const isHTMLString = (str) => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
  };

  return (
    <Box
      className={`${style["prod"]}`}
      key={product?.id}
      onClick={() => {
        if (!preventOnClick) {
          router.push({
            pathname: `/product/${product?.id}`,
            query: {
              name: product?.name,
              desc: product?.desc,
              tags: product?.combined_tags?.[0]?.name_ar,
              category: product?.marketplace_category?.name,
              subCategory: product?.marketplace_subcategory?.name,
              model: product?.model?.name,
              num: product?.ref_num,
              price: product?.price,
              img: product?.image,
            },
          });
        }
      }}
    >
      <Box
        className={`${style["prod-img-wrapper"]}`}
        sx={
          {
            //   background: `center / contain no-repeat url(${
            //     product?.image || "/imgs/no-prod-img.svg"
            //   })`,
          }
        }
      >
        <Image
          loading="lazy"
          src={product?.image || "/imgs/no-prod-img.svg"}
          alt="Product"
          width={200}
          height={200}
          onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "100%",
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
            {product?.price_before_discount?.toFixed(2)}
          </Box>
        )}

        <Box
          sx={{
            color: product?.price_before_discount ? "#EB3C24" : "#ee772f",
          }}
          className={`${style["prod-info-wrapper_price"]}`}
        >
          {product?.price_before_discount
            ? product?.offer_price?.toFixed(2) || 0
            : product?.price?.toFixed(2)}
          {product?.price_before_discount ? riyalImgRed() : riyalImgOrange()}
        </Box>

        {!!product?.price_before_discount && (
          <Box className={`${style["prod-disc_percentage"]}`}>
            {(
              ((product?.price_before_discount - (product?.offer_price || 0)) /
                product?.price_before_discount) *
              100
            )?.toFixed(0)}
            %
          </Box>
        )}

        {product?.name && (
          <Box className={`${style["prod-info-wrapper_describe"]}`}>
            <Tooltip
              title={
                isHTMLString(product?.name) ? (
                  <div dangerouslySetInnerHTML={{ __html: product?.name }} />
                ) : (
                  product?.name
                )
              }
              placement="top"
              enterDelay={200}
              leaveDelay={200}
              arrow
            >
              {isHTMLString(product?.name) ? (
                <div dangerouslySetInnerHTML={{ __html: product?.name }} />
              ) : (
                product?.name
              )}
            </Tooltip>
          </Box>
        )}
      </Box>

      {!!product?.combined_tags?.length && (
        <Box
          sx={{
            background: product?.combined_tags[0]?.color,
            color: "white",
          }}
          className={`${style["prod-label"]}`}
        >
          {product?.combined_tags[0]?.name}
        </Box>
      )}
    </Box>
  );
});

export default ProductCard;
