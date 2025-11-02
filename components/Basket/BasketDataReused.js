import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "../../components/shared/Navbar/ContentForBasketPopup/ContentForBasket.module.scss";
import { Box } from "@mui/material";
import InputAddRemove from "@/components/InputAddRemove";
import {
  deleteItemAsync,
  updateItemQuantityAsync,
} from "@/redux/reducers/basketReducer";
import ProductCardSkeleton from "@/components/cardSkeleton";
import { riyalImgOrange } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import ErrorIcon from "@mui/icons-material/Error";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";

function BasketDataReused({ handleCloseBasket = () => {} }) {
  const { t, locale } = useLocalization();
  const router = useRouter();
  const { basket, loadingCart } = useSelector((state) => state.basket);
  const dispatch = useDispatch();
  const [prodIdClicked, setProdIdClicked] = useState(false);
  const { isMobile } = useScreenSize();
  const hasOnlyOneNonActive = basket?.filter(
    (item) => item?.product?.is_active === false
  )?.length;

  const noImgStyle = {
    borderRadius: "8px",
    opacity: "1",
    width: "100%",
    height: "100%",
    margin: "auto",
  };

  const handleChangeProdQty = (e, data) => {
    setProdIdClicked(data?.product?.id);
    setTimeout(() => {
      setProdIdClicked(false);
    }, 3000);
    e?.stopPropagation();
    e?.preventDefault();
  };

  return (
    <>
      {[...basket]
        ?.sort((a, b) => {
          return (
            (b?.product?.is_active === true) - (a.product?.is_active === true)
          );
        })
        ?.map((data) => (
          <div key={data?.id} className="position-relative">
            <div
              className={`${style["products-contain"]} ${
                !data?.product?.is_active && "pb-3"
              }`}
            >
              <div className="d-flex">
                <div
                  className={style["products-contain_img"]}
                  onClick={() => {
                    router.push({
                      pathname: `/product/${data?.product?.id}`,
                      query: {
                        name: data?.product?.name,
                        desc: data?.product?.desc,
                        tags: data?.product?.combined_tags?.[0]?.name_ar,
                        category: data?.product?.marketplace_category?.name,
                        subCategory:
                          data?.product?.marketplace_subcategory?.name,
                        model: data?.product?.model?.name,
                        num: data?.product?.ref_num,
                        price: data?.product?.price,
                        img: data?.product?.image,
                      },
                    });
                    handleCloseBasket();
                  }}
                >
                  <Image
                    src={data?.product?.image?.url || "/imgs/no-img-holder.svg"}
                    width={isMobile ? 55 : 200}
                    height={isMobile ? 55 : 200}
                    alt={data?.id}
                    onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
                    style={{
                      cursor: "pointer",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      borderRadius: "8px",
                      margin: "auto",
                      objectFit: "contain",
                      minWidth: isMobile ? 55 : 200,
                      height: isMobile ? 55 : 200,
                    }}
                    loading="lazy"
                  />{" "}
                </div>
                <div className={style["products-contain_name"]}>
                  <Box sx={{ mb: 1 }}>{data?.product?.name}</Box>
                  <Box sx={{ width: isMobile ? "90px" : "115px" }}>
                    {loadingCart && prodIdClicked === data?.product?.id ? (
                      <ProductCardSkeleton
                        height={"40px"}
                        customMarginBottom="0px"
                      />
                    ) : (
                      <InputAddRemove
                        value={data}
                        disabled={true}
                        customHeight="35px"
                        actionClickrightIcon={(e) => {
                          if (!prodIdClicked) {
                            handleChangeProdQty(e, data);

                            if (+data?.quantity === 1) {
                              dispatch(
                                deleteItemAsync({
                                  product_id: data?.product?.id,
                                })
                              );
                            } else {
                              dispatch(
                                updateItemQuantityAsync({
                                  product_id: data?.product?.id,
                                  product: data?.product,
                                  actionType: "decrement",
                                })
                              );
                            }
                          }
                        }}
                        actionClickIcon={(e) => {
                          if (!prodIdClicked) {
                            handleChangeProdQty(e, data);
                            dispatch(
                              updateItemQuantityAsync({
                                product_id: data?.product?.id,
                                product: data?.product,
                                actionType: "increment",
                              })
                            );
                          }
                        }}
                      />
                    )}
                  </Box>
                </div>
              </div>
              <div className={style["products-contain_price"]}>
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
              {/* overlay over in active products */}
              {!data?.product?.is_active && (
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: "#ffffff8c",
                  }}
                ></Box>
              )}
            </div>

            {!data?.product?.is_active && (
              <Box
                sx={{
                  padding: isMobile ? "4px 6px" : "4px 10px",
                  background: "rgba(224, 110, 14, 0.10)",
                  color: "#E06E0E",
                  fontWeight: "500",
                  width: "fit-content",
                  borderRadius: "8px",
                  fontSize: isMobile ? "11px" : "12px",
                  display: "flex",
                  alignItems: "center",
                  position: "absolute",
                  bottom: "-14px",
                  ...(locale === "ar"
                    ? { right: isMobile ? "20px" : "45px" }
                    : { left: isMobile ? "20px" : "45px" }),
                  opacity: "0.7",
                }}
              >
                <ErrorIcon
                  sx={{
                    fill: "#E06E0E",
                    marginInlineEnd: "5px",
                    fontSize: isMobile ? "15px" : "18px",
                  }}
                />
                <Box>{t.notFoundInBasket}</Box>
              </Box>
            )}
          </div>
        ))}
    </>
  );
}

export default BasketDataReused;
