import InputAddRemove from "@/components/InputAddRemove";
import SharedBtn from "@/components/shared/SharedBtn";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import {
  addItemAsync,
  deleteItemAsync,
  updateItemQuantityAsync,
} from "@/redux/reducers/basketReducer";
import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function AddToBasketProdDetails({ prod }) {
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();

  const { basket, loadingCart } = useSelector((state) => state.basket);

  const checkInsideBasket = () =>
    basket?.find((product) => product?.product_id === prod?.id) || null;

  const removeFromBasket = () => {
    dispatch(
      deleteItemAsync({
        product_id: prod?.id,
      })
    );
  };

  const addToBasket = () => {
    dispatch(
      addItemAsync([{ product_id: prod?.id, product: prod, quantity: 1 }])
    );
  };

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        justifyContent: "center",
        "& div": {
          maxWidth: "150px",
        },
      }}
    >
      {false ? (
        loadingCart ? (
          <CircularProgress
            size={20}
            sx={{
              color: "inherit",
              mx: 2,
            }}
          />
        ) : (
          <InputAddRemove
            value={checkInsideBasket()}
            disabled={true}
            customHeight="35px"
            actionClickrightIcon={(e) => {
              if (+checkInsideBasket()?.quantity === 1) {
                dispatch(
                  deleteItemAsync({
                    product_id: checkInsideBasket()?.product?.id,
                  })
                );
              } else {
                dispatch(
                  updateItemQuantityAsync({
                    product_id: checkInsideBasket()?.product?.id,
                    product: checkInsideBasket()?.product,
                    actionType: "decrement",
                  })
                );
              }
            }}
            actionClickIcon={(e) => {
              dispatch(
                updateItemQuantityAsync({
                  product_id: checkInsideBasket()?.product?.id,
                  product: checkInsideBasket()?.product,
                  actionType: "increment",
                })
              );
            }}
          />
        )
      ) : (
        <SharedBtn
          comAfterText={
            checkInsideBasket() ? (
              <Box
                sx={{
                  background: "white",
                  color: "black",
                  width: isMobile ? "15px" : "20px",
                  height: isMobile ? "15px" : "20px",
                  borderRadius: "50%",
                  fontWeight: "500",
                  paddingTop: "1px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {checkInsideBasket()?.quantity}
              </Box>
            ) : null
          }
          compBeforeText={
            loadingCart && (
              <CircularProgress
                size={15}
                sx={{
                  color: "inherit",
                }}
              />
            )
          }
          disabled={loadingCart}
          customClass={`w-100 ${isMobile && "data-over-foot-nav"}`}
          className={checkInsideBasket() ? "black-btn" : "big-main-btn"}
          text={checkInsideBasket() ? "removeFromBasket" : "addToBasket"}
          onClick={
            checkInsideBasket() ? () => removeFromBasket() : () => addToBasket()
          }
        />
      )}
    </Box>
  );
}

export default AddToBasketProdDetails;
