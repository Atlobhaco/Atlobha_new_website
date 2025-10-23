import SharedCheckbox from "@/components/shared/SharedCheckbox";
import { PAYMENT } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import {
  availablePaymentMethodImages,
  availablePaymentMethodText,
  checkApplePayAvailability,
} from "@/constants/helpers";
import { PAYMENT_METHODS } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { setSelectedPayment } from "@/redux/reducers/selectedPaymentMethod";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import ProductCardSkeleton from "@/components/cardSkeleton";
import { useRouter } from "next/router";
import DialogCentered from "@/components/DialogCentered";
import PaymentMethodLimit from "@/components/PurchaseLimit/PaymentMethodLimit";

function AddAvailablePayMethods({
  orderDetails = {},
  tabbyMinLimit = 100,
  tabbyMaxLimit = 3000,
  misMinLimit = 145,
  misMaxLimit = 7500,
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { route } = router;
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const { selectedPaymentMethod } = useSelector(
    (state) => state.selectedPaymentMethod
  );
  const dispatch = useDispatch();
  const [openHint, setOpenHint] = useState({
    open: false,
    selectedMethod: false,
  });
  const [amountToPay, setAmountToPay] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const target = document.getElementById("amount-to-pay");
    if (!target) return;

    // Initial value
    setAmountToPay(target.textContent?.trim() || "");

    // Create MutationObserver
    const observer = new MutationObserver(() => {
      setAmountToPay(target.textContent?.trim() || "");
    });

    observer.observe(target, {
      childList: true, // watch direct text changes
      characterData: true, // watch text node changes
      subtree: true, // watch all descendants
    });

    // Cleanup on unmount
    return () => {
      observer.disconnect();
    };
  });

  const { data: availablePayments, isFetching } = useCustomQuery({
    name: [
      "getPaymentsMethods",
      orderDetails?.address?.lat,
      orderDetails?.address?.lng,
    ],
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

  const callCaluclateReceiptForApplePay = (key) => {
    if (key === PAYMENT_METHODS?.applePay && route !== `/checkout`) {
      queryClient.refetchQueries(["calculateReceiptForTotalPay"]); // ✅ Refetch by name
    }
  };

  const handleSelectPayMethod = (payMethod, data) => {
    if (appearOverlay(payMethod, data)) {
      setOpenHint({
        open: true,
        selectedMethod: data,
      });
      return;
    }
    callCaluclateReceiptForApplePay(payMethod);
    dispatch(setSelectedPayment({ data: data }));
  };

  const appearOverlay = (payMethod, data) => {
    const { tabby, mis } = PAYMENT_METHODS;
    const isTargetMethod = payMethod === tabby || payMethod === mis;
    const outOfRange =
      +amountToPay < data?.payment_value_min ||
      +amountToPay > data?.payment_value_max;

    return isTargetMethod && outOfRange;
  };

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
        <Image
          loading="lazy"
          src="/icons/yellow-card.svg"
          alt="card"
          width={20}
          height={20}
        />
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
      {isFetching ? (
        <ProductCardSkeleton height={140} />
      ) : (
        availablePayments
          ?.filter(
            (d) =>
              d?.is_active &&
              (d?.key === PAYMENT_METHODS?.credit ||
                d?.key === PAYMENT_METHODS?.applePay ||
                d?.key === PAYMENT_METHODS?.tamara ||
                d?.key === PAYMENT_METHODS?.tabby ||
                d?.key === PAYMENT_METHODS?.mis)
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
                    handleCheckboxChange={(data) => {
                      handleSelectPayMethod(pay?.key, data);
                    }}
                    data={pay}
                  />
                  <Box
                    sx={{
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => {
                      handleSelectPayMethod(pay?.key, pay);
                    }}
                  >
                    {availablePaymentMethodImages(
                      {
                        payment_method: pay?.key,
                      },
                      isMobile
                    )}
                    {appearOverlay(pay?.key, pay) && (
                      <Box className="overlay-payment-method"></Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleSelectPayMethod(pay?.key, pay);
                    }}
                  >
                    {availablePaymentMethodText(
                      { payment_method: pay?.key },
                      t,
                      isMobile
                    )}
                  </Box>
                </Box>
              )
          )
      )}

      <DialogCentered
        title={false}
        subtitle={false}
        open={openHint?.open}
        setOpen={() =>
          setOpenHint({
            open: false,
            selectedMethod: false,
          })
        }
        hasCloseIcon
        content={
          <PaymentMethodLimit
            payMethodKey={openHint?.selectedMethod?.key}
            setOpenHint={setOpenHint}
          />
        }
      />
    </Box>
  );
}

export default AddAvailablePayMethods;
