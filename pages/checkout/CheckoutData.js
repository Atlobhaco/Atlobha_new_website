import AddAvailablePayMethods from "@/components/userProfile/orderDetails/addAvailablePayMethods";
import OrderAddress from "@/components/userProfile/orderDetails/orderAddress";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import React, { useState } from "react";
import PromoCodeMarket from "./PromoCodeMarket";
import AtlobhaPlusHint from "@/components/userProfile/atlobhaPlusHint";
import useCustomQuery from "@/config/network/Apiconfig";
import { ESTIMATED_DELIVERY, SETTINGS } from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";

function CheckoutData({
  selectAddress,
  handleChangeAddress,
  promoCodeId,
  setPromoCodeId,
}) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  const { data: estimateRes, isLoading: loadDate } = useCustomQuery({
    name: ["deliveryDate", selectAddress?.lat, selectAddress?.lng],
    url: `${SETTINGS}${ESTIMATED_DELIVERY}?latitude=${selectAddress?.lat}&longitude=${selectAddress?.lng}`,
    refetchOnWindowFocus: false,
    enabled: selectAddress?.lat || selectAddress?.lng ? true : false,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.first_error);
    },
  });
  
  const deliveryDate = () => {
    return estimateRes?.estimated_delivery_date_from &&
      estimateRes?.estimated_delivery_date_to
      ? `${t.deliveryFrom} ${moment
          .unix(estimateRes.estimated_delivery_date_from)
          .format("dddd, D MMMM YYYY")} ${t.and} ${moment
          .unix(estimateRes.estimated_delivery_date_to)
          .format("dddd, D MMMM YYYY")}`
      : t.dateLater;
  };

  return (
    <>
      {/* address  details */}
      <OrderAddress
        orderDetails={{
          address: selectAddress,
          status: "new",
        }}
        handleChangeAddress={handleChangeAddress}
      />
      {/* delivery date */}
      <Box
        sx={{
          padding: "16px 13px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box>
          <Image
		            loading="lazy"

            src="/icons/yellow-calendar.svg"
            width={20}
            height={20}
            alt="yellow-calendar"
          />
        </Box>
        <Box>
          <Box
            sx={{
              color: "#232323",
              fontSize: isMobile ? "14px" : "20px",
              fontWeight: "700",
              lineHeight: "30px",
              letterSpacing: "-0.4px",
            }}
          >
            {t.deliveryTime}
          </Box>
          <Box
            sx={{
              color: "#1FB256",
              fontSize: isMobile ? "12px" : "18px",
              fontWeight: "500",
              lineHeight: "24px",
            }}
          >
            {/* {t.deliverTomorrow}, {moment().add(1, "days").format("Do MMM")} */}
            {loadDate ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              deliveryDate()
            )}{" "}
          </Box>
        </Box>
      </Box>
      {/* payment methods */}
      <AddAvailablePayMethods
        orderDetails={{
          address: selectAddress,
          status: "new",
        }}
      />
      {/* add new card */}
      {/* <Box
        sx={{
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          width: "fit-content",
          mb: 3,
        }}
      >
        <Image
          src="/icons/green-plus.svg"
          alt="green-plus"
          width={22}
          height={22}
        />
        <Typography
          sx={{
            color: "#1FB256",
            fontSize: "17px",
            fontWeight: 500,
          }}
        >
          {t.addNewCard}
        </Typography>
      </Box> */}
      {/* promo code */}
      <PromoCodeMarket
        promoCodeId={promoCodeId}
        setPromoCodeId={setPromoCodeId}
      />
      <AtlobhaPlusHint alwaysHorizontalDesgin={true} />
    </>
  );
}

export default CheckoutData;
