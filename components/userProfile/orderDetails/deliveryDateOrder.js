import {
  CITY_SETTINGS,
  ESTIMATED_DELIVERY,
  LAT_LNG,
  SETTINGS,
} from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { ORDERSENUM, STATUS } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { toast } from "react-toastify";

function DeliveryDateOrder({ orderDetails = {} }) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const [LngLat, setLngLat] = useState();
  const tomorrow = moment().add(1, "day").locale("en").format("YYYY-MM-DD");
  const nextDayForConfirmation = moment(
    orderDetails?.confirmed_at || orderDetails?.created_at
  )
    .add(1, "day")
    .locale("en")
    .format("YYYY-MM-DD");

  const {
    query: { type, idOrder },
  } = useRouter();

  const { data: estimateRes } = useCustomQuery({
    name: ["getEstimateDeliveryForOrder", LngLat?.lat, LngLat?.lng, idOrder],
    url: `${CITY_SETTINGS}${LAT_LNG}?latitude=${LngLat?.lat}&longitude=${
      LngLat?.lng
    }&date=${nextDayForConfirmation || tomorrow}`,
    refetchOnWindowFocus: false,
    enabled: LngLat?.lat && LngLat?.lng ? true : false,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.first_error);
    },
  });

  useEffect(() => {
    if (
      !orderDetails?.estimated_packaging_date &&
      !orderDetails?.estimated_delivery_date
    ) {
      setLngLat({
        lng:
          orderDetails?.address?.lng ||
          orderDetails?.service_center?.store?.longitude,
        lat:
          orderDetails?.address?.lat ||
          orderDetails?.service_center?.store?.latitude,
      });
    }
  }, [orderDetails]);

  const deliveryDate = () => {
    const isMarketplaceType =
      type === ORDERSENUM?.marketplace ||
      type === ORDERSENUM?.maintenance ||
      type === ORDERSENUM?.PORTABLE;

    if (!orderDetails) return null;

    if (orderDetails?.status === STATUS?.new && !isMarketplaceType)
      return t.dateLater;

    const date =
      orderDetails?.estimated_packaging_date ||
      orderDetails?.estimated_delivery_date;

    if (date)
      return `${t.deliveryFrom} ${moment(date).format("dddd, D MMMM YYYY")}`;

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
          {/* {orderDetails?.status === STATUS?.new
            ? t.dateLater
            : orderDetails?.estimated_packaging_date
            ? moment(orderDetails?.estimated_packaging_date).format(
                "DD-MM-YYYY"
              )
            : orderDetails?.estimated_delivery_date
            ? moment(orderDetails?.estimated_delivery_date).format("DD-MM-YYYY")
            : moment
                .unix(estimateRes?.estimated_delivery_date_from)
                .format(
                  locale === "ar" ? "DD-MM-YYYY mm:HH" : "DD-MM-YYYY HH:mm"
                ) || t.dateLater} */}
          {deliveryDate()}
        </Box>
      </Box>
    </Box>
  );
}

export default DeliveryDateOrder;
