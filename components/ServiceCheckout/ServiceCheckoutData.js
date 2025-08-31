import React from "react";
import OrderAddress from "../userProfile/orderDetails/orderAddress";
import useLocalization from "@/config/hooks/useLocalization";
import SelectedCarDetails from "./SelectedCarDetails";
import Image from "next/image";
import { Box } from "@mui/material";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import moment from "moment";
import { FIXED } from "@/constants/enums";
import WillCallLater from "../ServiceDetails/WillCallLater";
import ServiceAvailabilityWithCar from "./ServiceAvailabilityWithCar";
import AddAvailablePayMethods from "../userProfile/orderDetails/addAvailablePayMethods";
import PromoCodeMarket from "@/pages/checkout/PromoCodeMarket";
import AtlobhaPlusHint from "../userProfile/atlobhaPlusHint";

function ServiceCheckoutData({
  selectAddress,
  handleChangeAddress,
  checkoutServiceDetails,
  userCar,
  carAvailable,
  promoCodeId,
  setPromoCodeId,
}) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  const returnServiceTime = () => {
    if (checkoutServiceDetails?.serviceDetails?.slots_disabled) {
      return <WillCallLater />;
    }
    const startFrom = checkoutServiceDetails?.serviceTimeFixedOrPortable?.start;
    const endAt = checkoutServiceDetails?.serviceTimeFixedOrPortable?.end;

    return `${
      startFrom === endAt
        ? `${moment(startFrom).format("h:mm")}`
        : `${moment(startFrom).format("h:mm")} - ${moment(endAt).format(
            "h:mm"
          )}`
    }`;
  };

  const returnAddresstitleDependType = () => {
    if (checkoutServiceDetails?.type === FIXED) {
      return t.centerLocation;
    }
    return t.serviceLocation;
  };

  const addressDependOnType = () => {
    return checkoutServiceDetails?.type === FIXED
      ? {
          address: checkoutServiceDetails?.selectedStore?.address,
          city: checkoutServiceDetails?.selectedStore?.store?.city,
        }
      : selectAddress;
  };

  return (
    <>
      {!carAvailable && <ServiceAvailabilityWithCar />}
      {/* address for service */}
      <OrderAddress
        orderDetails={{
          address: addressDependOnType(),
          status: "new",
        }}
        handleChangeAddress={handleChangeAddress}
        customtitle={returnAddresstitleDependType()}
        hideArrow={true}
      />
      {/* time for service */}
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
            {t.serviceTime}
          </Box>
          <Box
            sx={{
              color: "#1FB256",
              fontSize: isMobile ? "12px" : "18px",
              fontWeight: "500",
              lineHeight: "24px",
            }}
          >
            {returnServiceTime()}
          </Box>
        </Box>
      </Box>
      {/* car for service */}
      <SelectedCarDetails userCar={userCar} />

      <AddAvailablePayMethods
        orderDetails={{
          address: selectAddress,
          status: "new",
        }}
      />

      <PromoCodeMarket
        promoCodeId={promoCodeId}
        setPromoCodeId={setPromoCodeId}
      />

      <AtlobhaPlusHint alwaysHorizontalDesgin={true} />
    </>
  );
}

export default ServiceCheckoutData;
