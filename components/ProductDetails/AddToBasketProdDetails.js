import InputAddRemove from "@/components/InputAddRemove";
import SharedBtn from "@/components/shared/SharedBtn";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import {
  addItemAsync,
  deleteItemAsync,
  updateItemQuantityAsync,
} from "@/redux/reducers/basketReducer";
import { Box, CircularProgress, SvgIcon } from "@mui/material";
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
        mt: isMobile ? 0 : 4,
        display: "flex",
        justifyContent: "center",
        // "& div": {
        //   maxWidth: "150px",
        // },
      }}
    >
      {checkInsideBasket() ? (
        <Box
          sx={{
            width: "100%",
            height: isMobile ? "35px" : "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFD400",
            borderRadius: "10px",
            fontWeight: "500",
            fontSize: "17px",
          }}
          className={`${isMobile && "data-over-foot-nav"}`}
        >
          <Box
            sx={{
              width: "25%",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              if (!loadingCart) {
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
              }
            }}
          >
            {checkInsideBasket()?.quantity === 1 ? (
              <SvgIcon
                sx={{
                  cursor: "pointer",
                  width: isMobile ? "15px" : "20px",
                  height: isMobile ? "15px" : "20px",
                }}
              >
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
            ) : (
              "-"
            )}
          </Box>
          <Box
            sx={{
              width: "75%",
              textAlign: "center",
            }}
          >
            {loadingCart ? (
              <CircularProgress
                size={isMobile ? 11 : 15}
                sx={{
                  color: "inherit",
                  mx: 2,
                }}
              />
            ) : (
              checkInsideBasket()?.quantity
            )}
          </Box>
          <Box
            sx={{
              width: "25%",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              if (!loadingCart) {
                dispatch(
                  updateItemQuantityAsync({
                    product_id: checkInsideBasket()?.product?.id,
                    product: checkInsideBasket()?.product,
                    actionType: "increment",
                  })
                );
              }
            }}
          >
            +
          </Box>
        </Box>
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
                size={isMobile ? 11 : 15}
                sx={{
                  color: "inherit",
                  mx: 1,
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
