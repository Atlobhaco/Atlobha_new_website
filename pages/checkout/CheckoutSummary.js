import SharedBtn from "@/components/shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import { PAYMENT_METHODS } from "@/constants/enums";
import {
  generateSignature,
  riyalImgBlack,
  riyalImgRed,
  useArrayChangeDetector,
} from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { fetchCartAsync } from "@/redux/reducers/basketReducer";
import { setSelectedPayment } from "@/redux/reducers/selectedPaymentMethod";
import { Box, CircularProgress, Divider } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function CheckoutSummary({ selectAddress, setOpenAddMobile, promoCodeId }) {
  const { voucherCode, allPromoCodeData } = useSelector(
    (state) => state.addSpareParts
  );
  const [redirectToPayfort, setRedirectToPayfort] = useState(false);
  const [oldAmountToPay, setOldAmountToPay] = useState(false);
  const { basket } = useSelector((state) => state.basket);
  const { selectedPaymentMethod } = useSelector(
    (state) => state.selectedPaymentMethod
  );
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const merchanteRefrence = `${user?.data?.user?.id}_${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const [payFortForm, setPayfortForm] = useState(false);

  const receipt = {};
  const header = {
    color: "#232323",
    fontSize: isMobile ? "16px" : "22px",
    fontWeight: "700",
    mb: 1,
  };
  const text = {
    color: "#232323",
    fontSize: isMobile ? "12px" : "15px",
    fontWeight: "500",
  };
  const vat = {
    color: "#6B7280",
    fontSize: isMobile ? "11px" : "13px",
    fontWeight: "500",
    mb: 2,
  };
  const boldText = {
    fontSize: isMobile ? "15px" : "19px",
    fontWeight: "700",
    color: "#232323",
  };

  const {
    data: confirmPriceRes,
    isFetching: confirmPriceFetch,
    refetch: callConfirmPricing,
  } = useCustomQuery({
    name: "confirmOrderMarketplace",
    url: `/marketplace/users/${user?.data?.user?.id}/orders`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: false,
    method: "post",
    body: {
      address: selectAddress,
      notes: null,
      payment_reference: merchanteRefrence,
      payment_method: selectedPaymentMethod?.key,
      products: basket
        ?.filter((item) => item?.product?.is_active)
        ?.map((d) => ({
          ...d,
          id: d?.product_id,
          service_center_id: null,
        })),
      promo_code: allPromoCodeData ? { id: allPromoCodeData?.id } : null,
      ref_num: null,
    },
    onSuccess: (res) => {
      sessionStorage.setItem("order_id_market", res?.id);
      if (
        selectedPaymentMethod?.key === PAYMENT_METHODS?.credit &&
        +oldAmountToPay > 0
      ) {
        payFortForm.submit();
        setTimeout(() => {
          setRedirectToPayfort(false);
        }, 6000);
        return;
      }
      if (
        selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay &&
        +oldAmountToPay > 0
      ) {
        return;
      }
      if (
        selectedPaymentMethod?.key === PAYMENT_METHODS?.cash &&
        +oldAmountToPay > 0
      ) {
        router.push(`/spareParts/confirmation/${res?.id}?type=marketplace`);
        setTimeout(() => {
          dispatch(fetchCartAsync());
        }, 1000);
        return;
      }
      toast.success(t.successPayOrder);
      router.push(`/spareParts/confirmation/${res?.id}?type=marketplace`);
      setTimeout(() => {
        dispatch(fetchCartAsync());
      }, 1000);
    },
    onError: (err) => {
      console.log(err);
      setRedirectToPayfort(false);
      if (err?.response?.data?.error?.includes("phone")) {
        setOpenAddMobile(true);
      }
      toast.error(err?.response?.data?.message || t.someThingWrong);
    },
  });

  const {
    data: calculateReceiptResFromMainPage,
    isFetching: fetchReceipt,
    refetch: callCalculateReceipt,
  } = useCustomQuery({
    name: [
      "calculateReceiptForMarket",
      basket?.length,
      promoCodeId,
      voucherCode,
      selectAddress,
      allPromoCodeData,
    ],
    url: "/marketplace/orders/calculate",
    refetchOnWindowFocus: true,
    method: "post",
    enabled: selectAddress?.id && basket?.length ? true : false,
    body: {
      address: selectAddress,
      notes: null,
      payment_reference: null,
      payment_method: "CREDIT",
      products: basket
        ?.filter((item) => item?.product?.is_active)
        ?.map((d) => ({ ...d, id: d?.product_id })),
      promo_code: allPromoCodeData ? { id: allPromoCodeData?.id } : null,
      ref_num: null,
    },
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      //   check if amount to pay changed before pay
      //   if (+res?.amount_to_pay !== +oldAmountToPay) {
      //     toast.error(`${t.remainingtotal} ${t.beChanged}`);
      //     return;
      //   }
      //   if (selectedPaymentMethod?.key !== PAYMENT_METHODS?.applePay) {
      //     if (+res?.amount_to_pay > 0) {
      //       callConfirmPricing();
      //     } else {
      //       callConfirmPricing();
      //     }
      //   }
      if (+res?.amount_to_pay === 0) {
        dispatch(setSelectedPayment({ data: { id: 1, key: "CASH" } }));
      }
      setOldAmountToPay(res?.amount_to_pay);
      dispatch(fetchCartAsync());
    },
    onError: (err) => {
      toast.error(err?.response?.data?.first_error || t.someThingWrong);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*           check if there is any change inside  the array of cart           */
  /* -------------------------------------------------------------------------- */
  useArrayChangeDetector(basket, (prev, current) => {
    dispatch(fetchCartAsync());
    callCalculateReceipt();
  });

  const requestData = {
    command: "PURCHASE",
    access_code: process.env.NEXT_PUBLIC_PAYFORT_ACCESS,
    merchant_identifier: process.env.NEXT_PUBLIC_PAYFORT_IDENTIFIER,
    language: locale,
    currency: "SAR",
    customer_email: "userTest@example.com",
    return_url: `${process.env.NEXT_PUBLIC_PAYFORT_RETURN_URL}?order_id=${confirmPriceRes?.id}&marketplace=true`,
  };

  requestData.merchant_reference = merchanteRefrence;
  requestData.amount = (
    calculateReceiptResFromMainPage?.amount_to_pay * 100
  )?.toFixed(0);
  // Generate Signature
  requestData.signature = generateSignature(
    requestData,
    process.env.NEXT_PUBLIC_PAYFORT_REQ_PHRASE
  );

  /* -------------------------------------------------------------------------- */
  /*                   to fix the reference error for document                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (document) {
      setPayfortForm(document.createElement("form"));
    }
  }, [document]);

  useEffect(() => {
    if (payFortForm) {
      payFortForm.method = "POST";
      payFortForm.action = process.env.NEXT_PUBLIC_PAYFORT_URL;

      Object.keys(requestData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = requestData[key];
        payFortForm.appendChild(input);
      });
      document.body.appendChild(payFortForm);
    }
  }, [payFortForm]);

  /* -------------------------------------------------------------------------- */
  /*                              apple pay payment                             */
  /* -------------------------------------------------------------------------- */
  const handleApplePayPayment = async () => {
    if (!window.ApplePaySession) {
      alert("Apple Pay is not supported on this device.");
      return;
    }

    const request = {
      countryCode: "SA",
      currencyCode: "SAR",
      supportedNetworks: ["mada", "visa", "masterCard", "amex"],
      merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"],
      total: {
        label: "Atlobha Store",
        amount: calculateReceiptResFromMainPage?.amount_to_pay, // Adjust dynamically if needed
      },
    };

    const session = new ApplePaySession(3, request);

    // ✅ **1. Merchant Validation (Calls Your Backend)**
    session.onvalidatemerchant = async (event) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/apple-pay/session`, // Your backend endpoint
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "w123",
              Authorization: `Bearer ${localStorage?.getItem("access_token")}`, // Include if needed
            },
          }
        );

        if (!response.ok) throw new Error("Merchant validation failed");

        const merchantSession = await response.json();
        session.completeMerchantValidation(merchantSession);
      } catch (error) {
        console.error("Merchant validation error:", error);
        session.abort();
      }
    };

    // ✅ Payment Authorization
    session.onpaymentauthorized = async (event) => {
      try {
        const applePayData = event.payment.token.paymentData;
        const paymentMethod = event.payment.token.paymentMethod;

        const requestBody = {
          digital_wallet: "APPLE_PAY",
          command: "PURCHASE",
          access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
          merchant_identifier: process.env.NEXT_PUBLIC_PAYFORT_IDENTIFIER,
          merchant_reference: merchanteRefrence,
          amount: (
            calculateReceiptResFromMainPage?.amount_to_pay * 100
          )?.toFixed(0),
          currency: "SAR",
          language: locale,
          customer_email: "userTest@example.com",
          customer_ip: "192.168.1.1",
          apple_data: applePayData.data,
          apple_signature: applePayData.signature,
          apple_header: {
            apple_transactionId: applePayData.header.transactionId,
            apple_ephemeralPublicKey: applePayData.header.ephemeralPublicKey,
            apple_publicKeyHash: applePayData.header.publicKeyHash,
          },
          apple_paymentMethod: {
            apple_displayName: paymentMethod.displayName,
            apple_network: paymentMethod.network,
            apple_type: paymentMethod.type,
          },
        };
        requestBody.signature = generateSignatureApplePay(requestBody);

        const response = await fetch("/api/payfortApplePay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const result = await response.json();
        console.log("Payment API Response:", result);

        if (!response.ok || result.error) {
          console.log(error in res, result.error);
          throw new Error(result.error || "Payment failed");
        }

        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        router.push(`/spareParts/confirmation/null?type=marketplace`);
      } catch (error) {
        alert(`Payment failed: ${error.message}`);
        session.completePayment(ApplePaySession.STATUS_FAILURE);
      }
    };

    session.begin();
  };

  return (
    <Box sx={{ pt: 1 }}>
      <Box sx={header}>{t.orderSummary}</Box>
      {/* products price */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.productsPrice}</Box>
        <Box sx={text}>
          {basket
            ?.filter((item) => item?.product?.is_active)
            ?.map((d) => ({ total_price: d?.quantity * d?.product?.price }))
            ?.reduce(
              (accumulator, current) => accumulator + current.total_price,
              0
            )
            ?.toFixed(2)}{" "}
          {riyalImgBlack()}
        </Box>
      </Box>
      {/* discount */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={{ ...text, color: "#EB3C24" }}>{t.additionaldiscount}</Box>
        <Box sx={{ ...text, color: "#EB3C24" }}>
          {(calculateReceiptResFromMainPage?.discount ?? receipt?.discount) ===
          receipt?.discount
            ? receipt?.discount
            : calculateReceiptResFromMainPage?.discount}{" "}
          {riyalImgRed()}
        </Box>
      </Box>
      {/* delivery fees */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.deliveryFees}</Box>
        <Box sx={text}>
          {(calculateReceiptResFromMainPage?.delivery_fees ??
            receipt?.delivery_fees) === receipt?.delivery_fees
            ? receipt?.delivery_fees
            : calculateReceiptResFromMainPage?.delivery_fees}{" "}
          {riyalImgBlack()}
        </Box>
      </Box>
      {/* pay from wallet balance */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.payFromBlanace}</Box>
        <Box sx={text}>
          {(calculateReceiptResFromMainPage?.wallet_payment_value ??
            receipt?.wallet_payment_value) === receipt?.wallet_payment_value
            ? receipt?.wallet_payment_value
            : calculateReceiptResFromMainPage?.wallet_payment_value}{" "}
          {riyalImgBlack()}
        </Box>
      </Box>
      {/* total pay */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.totalSum}</Box>
        <Box sx={text}>
          {(calculateReceiptResFromMainPage?.total_price ??
            receipt?.total_price) === receipt?.total_price
            ? receipt?.total_price
            : calculateReceiptResFromMainPage?.total_price}{" "}
          {riyalImgBlack()}
        </Box>
      </Box>
      {/* vat  percentage */}
      <Box sx={vat}>
        {t.include}{" "}
        {(((calculateReceiptResFromMainPage?.tax_percentage ??
          receipt?.tax_percentage) === receipt?.tax_percentage
          ? receipt?.tax_percentage
          : calculateReceiptResFromMainPage?.tax_percentage) || 0) * 100}
        ٪ {t.vatPercentage} ({calculateReceiptResFromMainPage?.tax || 0}{" "}
        {riyalImgBlack()})
      </Box>
      <Divider sx={{ background: "#EAECF0", mb: 2 }} />
      {/* rest to pay */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={{ ...text, ...boldText }}>{t.remainingtotal}</Box>
        <Box sx={{ ...text, ...boldText }}>
          {((calculateReceiptResFromMainPage?.amount_to_pay ??
            receipt?.amount_to_pay) === receipt?.amount_to_pay
            ? receipt?.amount_to_pay
            : calculateReceiptResFromMainPage?.amount_to_pay
          )?.toFixed(2)}{" "}
          {riyalImgBlack()}
        </Box>
      </Box>
      <SharedBtn
        disabled={
          !selectedPaymentMethod?.id ||
          confirmPriceFetch ||
          //   fetchReceipt ||
          redirectToPayfort
        }
        className={`${
          selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay
            ? "black-btn"
            : "big-main-btn"
        }`}
        // customClass="w-100"
        customClass={`${isMobile && "data-over-foot-nav"} w-100`}
        text={
          selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay
            ? ""
            : "payAndConfirm"
        }
        // || fetchReceipt
        comAfterText={
          confirmPriceFetch || redirectToPayfort ? (
            <CircularProgress color="inherit" size={15} />
          ) : selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay ? (
            <Image
              src="/icons/payments/apple-pay-white.svg"
              width={61}
              height={25}
              alt="empty-basket"
            />
          ) : null
        }
        onClick={() => {
          if (+calculateReceiptResFromMainPage?.amount_to_pay === 0) {
            callConfirmPricing();
            return;
          }
          if (selectedPaymentMethod?.key === PAYMENT_METHODS?.credit) {
            setRedirectToPayfort(true);
            callConfirmPricing();
          } else if (selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay) {
            callConfirmPricing();
            handleApplePayPayment();
          } else {
            callConfirmPricing();
          }
        }}
      />
    </Box>
  );
}

export default CheckoutSummary;
