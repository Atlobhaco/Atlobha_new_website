import { ESTIMATED_DELIVERY, SETTINGS } from "@/config/endPoints/endPoints";
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

  const {
    query: { type },
  } = useRouter();

  const { data: estimateRes } = useCustomQuery({
    name: ["getEstimateDeliveryForOrder", LngLat?.lat, LngLat?.lng],
    url: `${SETTINGS}${ESTIMATED_DELIVERY}?latitude=${LngLat?.lat}&longitude=${LngLat?.lng}`,
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
        lng: orderDetails?.address?.lng,
        lat: orderDetails?.address?.lat,
      });
    }
  }, [orderDetails]);

  const deliveryDate = () => {
    if (!orderDetails) return null;

    if (
      orderDetails?.status === STATUS?.new &&
      ORDERSENUM?.marketplace !== type
    )
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
