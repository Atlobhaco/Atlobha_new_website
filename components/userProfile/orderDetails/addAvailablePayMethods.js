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
  hidePayment = [],
  noPadding = false,
  queryParams = {},
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

  const buildQueryString = (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value);
      }
    });

    return searchParams.toString();
  };
  const extraQuery = buildQueryString(queryParams);

  const { data: availablePayments, isFetching } = useCustomQuery({
    name: [
      "getPaymentsMethods",
      orderDetails?.address?.lat,
      orderDetails?.address?.lng,
      queryParams,
    ],
    url: `${PAYMENT}?lat=${orderDetails?.address?.lat}&lng=${
      orderDetails?.address?.lng
    }${extraQuery ? `&${extraQuery}` : ""}`,
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
        padding: noPadding ? "" : "16px 13px",
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
          ?.filter((d) => {
            // Skip inactive method
            if (!d?.is_active) return false;

            // Skip if method is in hidePayment array
            if (hidePayment.includes(d?.key)) return false;

            // Allow only your listed methods
            return [
              PAYMENT_METHODS.cash,
              PAYMENT_METHODS.credit,
              PAYMENT_METHODS.applePay,
              PAYMENT_METHODS.tamara,
              PAYMENT_METHODS.tabby,
              PAYMENT_METHODS.mis,
            ].includes(d?.key);
          })
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
