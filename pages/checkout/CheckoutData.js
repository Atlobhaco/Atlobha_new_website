import AddAvailablePayMethods from "@/components/userProfile/orderDetails/addAvailablePayMethods";
import OrderAddress from "@/components/userProfile/orderDetails/orderAddress";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import React, { useState } from "react";
import PromoCodeMarket from "./PromoCodeMarket";
import AtlobhaPlusHint from "@/components/userProfile/atlobhaPlusHint";

function CheckoutData({
  selectAddress,
  handleChangeAddress,
  promoCodeId,
  setPromoCodeId,
}) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

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
            {t.deliverTomorrow}, {moment().add(1, "days").format("Do MMM")}
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
