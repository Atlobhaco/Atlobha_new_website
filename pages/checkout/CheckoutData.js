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
import { useSelector } from "react-redux";
import useCustomQuery from "@/config/network/Apiconfig";
import { CART, VALIDATE_EXPRESS_DELIVERY } from "@/config/endPoints/endPoints";

function CheckoutData({
  selectAddress,
  handleChangeAddress,
  promoCodeId,
  setPromoCodeId,
  estimateRes,
  loadDate,
  setExpressDelivery,
  expressDelivery,
}) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const { basket } = useSelector((state) => state.basket);
  const [expressResponse, setExpressResponse] = useState(false);

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

  const deliveryType = [
    {
      id: "normal",
      text: t.normalDelivery,
      imgSrc: "/icons/normal-delivery.svg",
      value: "normal",
    },
    {
      id: "express",
      text: t.expressSameDay,
      imgSrc: "/icons/express-car.svg",
      value: "express",
    },
  ];

  useCustomQuery({
    name: ["validate-express", basket, selectAddress],
    url: `${CART}${VALIDATE_EXPRESS_DELIVERY}`,
    method: "post",
    body: { products: basket, address_id: selectAddress?.id },
    refetchOnWindowFocus: true,
    select: (res) =>
      res?.data?.data?.products?.some(
        (item) => item.express_delivery_applicable === true
      ),
    enabled: basket?.length && selectAddress?.id ? true : false,
    onSuccess: (res) => setExpressResponse(res),
  });

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

      {/* express normal delivery selection */}
      {expressResponse && (
        <Box
          sx={{
            padding: isMobile ? "16px 13px" : "16px 0px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Box>
            <Image
              loading="lazy"
              src="/icons/express-van-2.svg"
              width={isMobile ? 25 : 35}
              height={isMobile ? 25 : 35}
              alt="express"
            />
          </Box>
          <Box>
            <Box
              sx={{
                color: "#232323",
                fontSize: isMobile ? "14px" : "20px",
                fontWeight: "700",
                lineHeight: "30px",
              }}
            >
              {t.deliveryType}
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: isMobile ? "10px" : "20px",
                flexWrap: "wrap",
              }}
            >
              {deliveryType?.map((type) => (
                <Box
                  onClick={() => setExpressDelivery(type?.value)}
                  sx={{
                    cursor: "pointer",
                    padding: isMobile ? "10px 5px" : "10px 17px",
                    border:
                      expressDelivery === type?.value
                        ? "1px solid #FFD400"
                        : "1px solid  #F0F0F0",
                    background:
                      expressDelivery === type?.value ? "#FFD400" : "#ffffff",
                    borderRadius: "8px",
                    color: "#232323",
                    fontSize: isMobile ? "10px" : "14px",
                    fontWeight: "500",
                  }}
                  key={type?.id}
                >
                  {type?.text}{" "}
                  <Image
                    src={type?.imgSrc}
                    alt="label"
                    width={isMobile ? 18 : 24}
                    height={isMobile ? 18 : 24}
                    style={{
                      marginInlineStart: "5px",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

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
        query={{
          product_ids: basket?.map((d) => d?.product_id),
          order_type: "marketplace-order",
        }}
      />
      <AtlobhaPlusHint alwaysHorizontalDesgin={true} />
    </>
  );
}

export default CheckoutData;
