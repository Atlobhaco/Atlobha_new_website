import React from "react";
import { Box } from "@mui/material";
import style from "../../components/shared/Navbar/ContentForBasketPopup/ContentForBasket.module.scss";
import {
  deleteItemAsync,
  updateItemQuantityAsync,
} from "@/redux/reducers/basketReducer";
import BasketItemImage from "./BasketItemImage";
import BasketItemPrice from "./BasketItemPrice";
import BasketItemStatus from "./BasketItemStatus";
import InputAddRemove from "@/components/InputAddRemove";
import ProductCardSkeleton from "@/components/cardSkeleton";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useDispatch } from "react-redux";

function BasketItem({
  data,
  handleRedirectToProdDetails,
  handleChangeProdQty,
  loadingCart,
  prodIdClicked,
  setActiveServiceCenter,
  activeServiceCenter,
}) {
  const { isMobile } = useScreenSize();
  const dispatch = useDispatch();

  return (
    <div key={data?.id} className="position-relative">
      <div className={`${style["products-contain"]} mt-3 mb-1`}>
        {/* IMAGE + NAME */}
        <div className="d-flex">
          <BasketItemImage
            data={data}
            handleRedirectToProdDetails={handleRedirectToProdDetails}
          />
          <div className={style["products-contain_name"]}>
            <Box sx={{ mb: 1 }}>{data?.product?.name}</Box>

            {/* Quantity Input */}
            <Box sx={{ width: isMobile ? "90px" : "115px" }}>
              {loadingCart && prodIdClicked === data?.product?.id ? (
                <ProductCardSkeleton height={"40px"} customMarginBottom="0px" />
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
                          deleteItemAsync({ product_id: data?.product?.id })
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

        {/* Price */}
        <BasketItemPrice
          data={data}
          loadingCart={loadingCart}
          prodIdClicked={prodIdClicked}
        />

        {/* Overlay for inactive products */}
        {!data?.product?.is_active && (
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "#ffffff8c",
            }}
          />
        )}
      </div>

      {/* Product status & Install center */}
      <BasketItemStatus
        data={data}
        setActiveServiceCenter={setActiveServiceCenter}
        activeServiceCenter={activeServiceCenter}
        handleRedirectToProdDetails={handleRedirectToProdDetails}
      />
    </div>
  );
}

export default BasketItem;
