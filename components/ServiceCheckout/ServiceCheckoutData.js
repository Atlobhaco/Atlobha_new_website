import React from "react";
import OrderAddress from "../userProfile/orderDetails/orderAddress";
import useLocalization from "@/config/hooks/useLocalization";
import SelectedCarDetails from "./SelectedCarDetails";
import Image from "next/image";
import { Box, Divider } from "@mui/material";
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
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();

  const returnServiceTime = () => {
    if (checkoutServiceDetails?.serviceDetails?.slots_disabled) {
      return <WillCallLater />;
    }
    const startFrom = checkoutServiceDetails?.serviceTimeFixedOrPortable?.start;
    const endAt = checkoutServiceDetails?.serviceTimeFixedOrPortable?.end;
    const dateStart = moment(
      checkoutServiceDetails?.serviceTimeFixedOrPortable?.start
    );
    const today = moment();

    return `${
      dateStart.isSame(today, "day")
        ? `${t.todayAtTime} ${dateStart.format("h:mm a")}`
        : startFrom === endAt
        ? `${moment(startFrom).format("h:mm a")}`
        : `${moment(startFrom).format("h:mm a")} - ${moment(endAt).format(
            "h:mm a"
          )} (${dateStart.format(
            locale === "ar" ? "YYYY/MM/DD" : "DD/MM/YYYY"
          )})`
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
  const renderDivider = () => {
    return (
      <Divider
        sx={{
          background: "#EAECF0",
          my: 1,
          height: "3px",
          borderBottomWidth: "0px",
        }}
      />
    );
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
      {renderDivider()}

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
      {renderDivider()}

      {/* car for service */}
      <SelectedCarDetails userCar={userCar} />

      {renderDivider()}

      <AddAvailablePayMethods
        orderDetails={{
          address: selectAddress,
          status: "new",
        }}
      />
      {renderDivider()}

      <PromoCodeMarket
        promoCodeId={promoCodeId}
        setPromoCodeId={setPromoCodeId}
        query={{
          order_type: "service",
          service_id: checkoutServiceDetails?.serviceDetails?.id,
		  brand_id: userCar?.brand?.id,
		  model_id: userCar?.model?.id,
		  year: userCar?.year,
        }}
      />
      <Divider sx={{ background: "#F6F6F6", mb: 2, height: "5px" }} />

      <AtlobhaPlusHint alwaysHorizontalDesgin={true} />
    </>
  );
}

export default ServiceCheckoutData;
