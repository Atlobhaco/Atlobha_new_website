import { Box, CircularProgress } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import SvgIcon from "@mui/material/SvgIcon";
import React, { useState } from "react";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemAsync,
  deleteItemAsync,
  updateItemQuantityAsync,
} from "@/redux/reducers/basketReducer";

const CustomDeleteIcon = ({ iconStyle, onClick }) => {
  return (
    <SvgIcon sx={iconStyle} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="28"
        viewBox="0 0 25 28"
        fill="none"
      >
        <path
          d="M1.44141 6.47379H3.90193M3.90193 6.47379H23.5861M3.90193 6.47379L5.1322 23.6975C5.1322 24.35 5.39143 24.9759 5.85287 25.4373C6.31431 25.8988 6.94015 26.158 7.59272 26.158H17.4348C18.0874 26.158 18.7132 25.8988 19.1747 25.4373C19.6361 24.9759 19.8954 24.35 19.8954 23.6975L21.1256 6.47379M7.59272 6.47379V4.01326C7.59272 3.36069 7.85196 2.73484 8.31339 2.27341C8.77483 1.81197 9.40068 1.55273 10.0532 1.55273H14.9743C15.6269 1.55273 16.2527 1.81197 16.7142 2.27341C17.1756 2.73484 17.4348 3.36069 17.4348 4.01326V6.47379M10.0532 12.6251V20.0067M14.9743 12.6251V20.0067"
          stroke="currentColor"
          strokeWidth="2.27126"
          stroke-line-cap="round"
          stroke-line-join="round"
        />
      </svg>
    </SvgIcon>
  );
};

function AddRemoveBtn({ product }) {
  const { locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const { basket, loadingCart } = useSelector((state) => state.basket);
  const [prodIdClicked, setProdIdClicked] = useState(false);

  const reusedStyle = {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "27px",
    ...(locale === "ar" ? { left: "2px" } : { right: "2px" }),
    bottom: isMobile ? "-14px" : "-22px",
    transition: "all 0.9s ease-in-out",
  };
  const addRemoveBtn = {
    background: "black",
    color: "white",
    minWidth: isMobile ? "75px" : "50px",
    height: isMobile ? "25px" : "50px",
    transition: "all 0.5s ease-in-out",
    opacity: isHovered ? 1 : 0,
    visibility: isHovered ? "visible" : "hidden",
    borderRadius: isHovered ? "25px !important" : "50% !important",
  };
  const circleHovered = {
    borderRadius: "50%",
    minWidth: isMobile ? "25px" : "50px",
    height: isMobile ? "25px" : "50px",
    fontSize: isMobile ? "13px" : "28px",
    fontWeight: "500",
    transition: "all 0.3s ease-in-out",
  };

  const iconStyle = {
    cursor: "pointer",
    width: isMobile ? "12px" : "24px",
    height: isMobile ? "12px" : "24px",
    "&:hover": {
      color: "yellow",
    },
  };

  const prodInsideBasket = () =>
    basket.find((item) => item.product_id === product?.id) || null;

  return (
    <Box
      sx={{
        background: prodInsideBasket() ? "yellow" : "black",
        ...reusedStyle,
        ...(!isHovered ? circleHovered : addRemoveBtn),
      }}
    >
      {prodInsideBasket() ? (
        !isHovered ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pt: isMobile ? 0 : 1,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onClick={(e) => {
              e?.stopPropagation();
              e?.preventDefault();
              if (isMobile) {
                setIsHovered(true);
                setTimeout(() => {
                  setIsHovered(false);
                }, 2000);
              }
            }}
          >
            {loadingCart && prodIdClicked === product?.id ? (
              <CircularProgress
                size={15}
                sx={{
                  color: "black",
                  mb: isMobile ? 0 : 1,
                }}
              />
            ) : (
              prodInsideBasket()?.quantity
            )}
          </Box>
        ) : (
          <Box
            onMouseLeave={() =>
              setTimeout(() => {
                setIsHovered(false);
              }, 2000)
            }
            sx={{
              display: "flex",
              width: isMobile ? "100%" : "170px",
              alignItems: "center",
              justifyContent: "space-around",
              borderRadius: "25px",
            }}
          >
            <Box>
              {prodInsideBasket()?.quantity <= 1 ? (
                <CustomDeleteIcon
                  iconStyle={iconStyle}
                  onClick={(e) => {
                    setProdIdClicked(product?.id);
                    setTimeout(() => {
                      setProdIdClicked(false);
                    }, 3000);
                    e?.stopPropagation();
                    e?.preventDefault();
                    isMobile &&
                      setTimeout(() => {
                        setIsHovered(false);
                      }, 2000);
                    !loadingCart &&
                      dispatch(deleteItemAsync({ product_id: product?.id }));
                  }}
                />
              ) : (
                <Remove
                  sx={iconStyle}
                  onClick={(e) => {
                    setProdIdClicked(product?.id);
                    setTimeout(() => {
                      setProdIdClicked(false);
                    }, 3000);
                    e?.stopPropagation();
                    e?.preventDefault();
                    isMobile &&
                      setTimeout(() => {
                        setIsHovered(false);
                      }, 2000);
                    !loadingCart &&
                      dispatch(
                        updateItemQuantityAsync({
                          product_id: product?.id,
                          product: product,
                          actionType: "decrement",
                        })
                      );
                  }}
                />
              )}
            </Box>
            <Box
              onClick={(e) => {
                e?.stopPropagation();
                e?.preventDefault();
              }}
              sx={{
                fontSize: isMobile ? "14px" : "34px",
                fontWeight: "500",
                paddingTop: isMobile ? "3px" : "3px",
              }}
            >
              {loadingCart && prodIdClicked === product?.id ? (
                <CircularProgress color="inherit" size={15} />
              ) : (
                prodInsideBasket()?.quantity
              )}
            </Box>
            <Box>
              <Add
                sx={iconStyle}
                onClick={(e) => {
                  setProdIdClicked(product?.id);
                  setTimeout(() => {
                    setProdIdClicked(false);
                  }, 3000);
                  e?.stopPropagation();
                  e?.preventDefault();
                  isMobile &&
                    setTimeout(() => {
                      setIsHovered(false);
                    }, 2000);
                  !loadingCart &&
                    dispatch(
                      updateItemQuantityAsync({
                        product_id: product?.id,
                        product: product,
                        actionType: "increment",
                      })
                    );
                }}
              />
            </Box>
          </Box>
        )
      ) : (
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
          }}
          onClick={(e) => {
            setProdIdClicked(product?.id);
            setTimeout(() => {
              setIsHovered(true);
              setTimeout(() => {
                setIsHovered(false);
              }, 2000);
              setProdIdClicked(false);
            }, 3000);
            e?.stopPropagation();
            e?.preventDefault();
            !loadingCart &&
              dispatch(
                addItemAsync([
                  { product_id: product?.id, product: product, quantity: 1 },
                ])
              );
          }}
        >
          {loadingCart && prodIdClicked === product?.id ? (
            <CircularProgress
              size={15}
              sx={{
                color: "white",
              }}
            />
          ) : (
            <Add
              sx={{
                ...iconStyle,
                color: "white",
                borderRadius: "50% !important",
              }}
            />
          )}
        </Box>
      )}
    </Box>
  );
}

export default AddRemoveBtn;
