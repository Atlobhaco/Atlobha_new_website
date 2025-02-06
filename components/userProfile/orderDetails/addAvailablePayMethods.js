import SharedCheckbox from "@/components/shared/SharedCheckbox";
import { PAYMENT } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import {
  PAYMENT_METHODS,
  availablePaymentMethodImages,
  availablePaymentMethodText,
  checkApplePayAvailability,
} from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { setSelectedPayment } from "@/redux/reducers/selectedPaymentMethod";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function AddAvailablePayMethods({ orderDetails = {} }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const { selectedPaymentMethod } = useSelector(
    (state) => state.selectedPaymentMethod
  );
  const dispatch = useDispatch();

  const { data: availablePayments, isFetching } = useCustomQuery({
    name: ["getPaymentsMethods"],
    url: `${PAYMENT}?lat=${orderDetails?.address?.lat}&lng=${orderDetails?.address?.lng}`,
    refetchOnWindowFocus: false,
    enabled:
      orderDetails?.address?.lat && orderDetails?.address?.lng ? true : false,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.first_error || t.someThingWrong);
    },
  });

  // Cleanup: Reset selected payment method on unmount
  useEffect(() => {
    return () => {
      dispatch(setSelectedPayment({ data: {} }));
    };
  }, []);

  return (
    <Box
      sx={{
        padding: "16px 13px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Image src="/icons/yellow-card.svg" alt="card" width={20} height={20} />
        <Box
          sx={{
            color: "#232323",
            fontWeight: "700",
            fontSize: isMobile ? "14px" : "20px",
            lineHeight: "30px",
            letterSpacing: "-0.4px",
          }}
        >
          {t.availablePayments}
        </Box>
      </Box>
      {availablePayments
        ?.filter(
          (d) =>
            d?.key === PAYMENT_METHODS?.cash ||
            d?.key === PAYMENT_METHODS?.credit ||
            d?.key === PAYMENT_METHODS?.applePay
        )
        ?.map(
          (pay) =>
            (pay?.key !== PAYMENT_METHODS?.applePay ||
              checkApplePayAvailability()) && (
              <Box
                key={pay?.id}
                sx={{
                  pb: 1,
                  pt: 1,
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  borderBottom: "1px solid #E6E6E6",
                }}
              >
                <SharedCheckbox
                  selectedId={selectedPaymentMethod?.id}
                  handleCheckboxChange={(data) =>
                    dispatch(setSelectedPayment({ data: data }))
                  }
                  data={pay}
                />
                <Box
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => dispatch(setSelectedPayment({ data: pay }))}
                >
                  {availablePaymentMethodImages({ payment_method: pay?.key })}
                </Box>
                <Box
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => dispatch(setSelectedPayment({ data: pay }))}
                >
                  {availablePaymentMethodText({ payment_method: pay?.key }, t)}
                </Box>
              </Box>
            )
        )}
    </Box>
  );
}

export default AddAvailablePayMethods;
