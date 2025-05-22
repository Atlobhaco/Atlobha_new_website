import { Box, CircularProgress, Tooltip } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import useLocalization from "@/config/hooks/useLocalization";
import { useSelector } from "react-redux";
import ProductCardSkeleton from "../cardSkeleton";
import { riyalImgBlack, riyalImgGrey } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useCustomQuery from "@/config/network/Apiconfig";
import { CITY_SETTINGS, LAT_LNG } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import { toast } from "react-toastify";

const BorderLinearProgress = styled(LinearProgress)(
  ({ theme, citySettings, totalOfBasket }) => ({
    height: 8,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
      ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[800],
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor:
        +totalOfBasket < +citySettings?.minimum_order_fee
          ? "#EE772F"
          : "#1FB256",
      ...theme.applyStyles("dark", {
        backgroundColor: "#308fe8",
      }),
    },
  })
);

function ProgressBarMinFreeDeliery({ citySettings, setCitySettings }) {
  const { t, locale } = useLocalization();
  const { basket, loadingCart } = useSelector((state) => state.basket);
  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const totalOfBasket = basket
    ?.filter((item) => item?.product?.is_active)
    ?.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
    ?.toFixed(2);

  const { data, isFetching } = useCustomQuery({
    name: [
      "citySetting",
      defaultAddress?.lng,
      selectedAddress?.lng,
      defaultAddress?.lat,
      selectedAddress?.lat,
    ],
    url: `${CITY_SETTINGS}${LAT_LNG}?latitude=${
      selectedAddress?.lat || defaultAddress?.lat
    }&longitude=${selectedAddress?.lng || defaultAddress?.lng}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled:
      isAuth() && (selectedAddress?.lng || defaultAddress?.lng) ? true : false,
    onSuccess: (res) => {
      setCitySettings({
        delivery_free_price: res?.delivery_free_price || 0,
        minimum_order_fee: res?.minimum_order_fee || 0,
      });
    },
    onError: (err) => {
      setCitySettings({
        delivery_free_price: 0,
        minimum_order_fee: 0,
      });
    },
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "13px",
          color: "#374151",
          fontWeight: "500",
        }}
      >
        {isFetching ? (
          <CircularProgress
            size={15}
            sx={{
              color: "black",
            }}
          />
        ) : (
          <>
            <Box>
              {+totalOfBasket < +citySettings?.minimum_order_fee
                ? t.minPriceOrder
                : +totalOfBasket >= citySettings?.delivery_free_price
                ? t.earnFreeDelivery
                : t.minForDelivery}
            </Box>
            <Box>
              {+totalOfBasket < +citySettings?.minimum_order_fee
                ? citySettings?.minimum_order_fee
                : citySettings?.delivery_free_price}{" "}
              {riyalImgGrey(15, 15)}
            </Box>
          </>
        )}
      </Box>
      <Box sx={{ transform: locale == "ar" && "rotateY(180deg)", my: 1 }}>
        <Tooltip
          title={`${Math.min(
            100,
            (totalOfBasket /
              (+totalOfBasket < +citySettings?.minimum_order_fee
                ? citySettings?.minimum_order_fee
                : citySettings?.delivery_free_price)) *
              100
          ).toFixed(0)}%`}
          arrow
        >
          <BorderLinearProgress
            variant="determinate"
            value={Math.min(
              100,
              (totalOfBasket /
                (+totalOfBasket < +citySettings?.minimum_order_fee
                  ? citySettings?.minimum_order_fee
                  : citySettings?.delivery_free_price)) *
                100
            )}
            citySettings={citySettings}
            totalOfBasket={totalOfBasket}
          />
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            fontSize: isMobile ? "15px" : "20px",
            fontWeight: "700",
          }}
        >
          {t.totalBasket}
        </Box>
        <Box
          sx={{
            fontSize: isMobile ? "13px" : "15px",
            fontWeight: "500",
          }}
        >
          {loadingCart ? (
            <ProductCardSkeleton
              height={"30px"}
              width="70px"
              customMarginBottom="0px"
            />
          ) : (
            <>
              {basket
                ?.filter((item) => item?.product?.is_active)
                ?.reduce(
                  (sum, item) => sum + item.quantity * item.product.price,
                  0
                )
                ?.toFixed(2)}
              {riyalImgBlack()}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}

export default ProgressBarMinFreeDeliery;
