import SharedDropDown from "@/components/shared/SharedDropDown";
import {
  CITIES,
  ESTIMATED_DELIVERY,
  SETTINGS,
} from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress, Divider } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "react-toastify";

function DeliveryTime({ prod, cityDelivery, setCityDelivery }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [cityInfo, setCityInfo] = useState(false);

  const {
    data: citiesRes,
    refetch: callCities,
    isLoading: citiesLoad,
  } = useCustomQuery({
    name: "getCities",
    url: `${CITIES}`,
    refetchOnWindowFocus: false,
    retry: 0,
    select: (res) =>
      res?.data?.data?.map((info) => ({
        ...info,
        name: info?.name,
      })),
    onSuccess: (res) => {
      setCityInfo(res?.find((d) => d?.id === cityDelivery));
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.first_error ||
          err?.response?.data?.message ||
          t.someThingWrong,
        { toastId: "uniqueErrorId" } // Use a unique ID to deduplicate
      );
    },
  });

  const { data: estimateRes, isFetching: fetchEstimation } = useCustomQuery({
    name: [
      "getDeliveryDate",
      cityInfo?.latitude,
      cityInfo?.longitude,
      isAuth(),
    ],
    url: `${SETTINGS}${ESTIMATED_DELIVERY}?latitude=${cityInfo?.latitude}&longitude=${cityInfo?.longitude}`,
    refetchOnWindowFocus: false,
    enabled: cityInfo?.latitude && cityInfo?.longitude ? true : false,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.first_error);
    },
  });

  const renderDeliveryDate = () => {
    if (fetchEstimation) {
      return (
        <CircularProgress
          size={20}
          sx={{
            color: "#FFD400",
            mx: 2,
          }}
        />
      );
    }
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
      <Divider
        sx={{
          background: "#EAECF0",
          my: 1,
          height: "5px",
          borderBottomWidth: "0px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: isMobile ? "nowrap" : "wrap",
        }}
      >
        <Box
          sx={{
            fontSize: isMobile ? "15px" : "18px",
            fontWeight: "700",
          }}
        >
          {renderDeliveryDate()}
        </Box>
        <Box
          sx={{
            width: "120px",
          }}
        >
          <SharedDropDown
            showCloseIcon={false}
            id="city-delivery"
            label={false}
            value={cityDelivery}
            items={citiesRes}
            handleChange={(e) => {
              setCityDelivery(e?.target?.value);
              setCityInfo(citiesRes?.find((d) => d?.id === e?.target?.value));
            }}
          />
        </Box>
      </Box>
    </>
  );
}

export default DeliveryTime;
