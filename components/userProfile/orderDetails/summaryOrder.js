import SharedBtn from "@/components/shared/SharedBtn";
import {
  CALCULATE_RECEIPT,
  CONFIRM_PRICING,
  ORDERS,
  RE_OPEN,
  SPARE_PARTS,
} from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import {
  generateApplePaySignature,
  generateHmacSignature,
  generateHmacSignatureChatGpt,
  generateSignature,
  generateSignatureApple,
  generateSignatureApplePay,
} from "@/constants/helpers";
import { ORDERSENUM, STATUS, PAYMENT_METHODS } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress, Divider } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useReducer } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import crypto from "crypto";

function SummaryOrder({
  orderDetails: { receipt = {} } = {},
  orderDetails = {},
  callSingleOrder = () => {},
  calculateReceiptResFromMainPage,
}) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const router = useRouter();
  const { idOrder, type, status } = router.query;
  const { user } = useAuth();
  const { selectedPaymentMethod } = useSelector(
    (state) => state.selectedPaymentMethod
  );
  const merchanteRefrence = `${user?.data?.user?.id}_${idOrder}`;
  const hasRun = useRef(false);
  const [redirectToPayfort, setRedirectToPayfort] = useState(false);

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

  const renderUrlDependOnType = () => {
    switch (type) {
      case ORDERSENUM?.marketplace:
        return `/marketplace${ORDERS}/${idOrder}`;
      case ORDERSENUM?.spareParts:
        return `${SPARE_PARTS}${ORDERS}/${idOrder}${RE_OPEN}`;
      default:
        return type;
    }
  };

  const {
    data,
    isFetching: repeatPriceFetch,
    refetch: callRepeatPricing,
  } = useCustomQuery({
    name: "reopenTheOrderAgain",
    url: renderUrlDependOnType(),
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: false,
    method: "post",
    onSuccess: (res) => {
      callSingleOrder();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.first_error || t.someThingWrong);
    },
  });

  //   change the status after redirect from payfort
  //   redirect to confirm page directly for now
  //   useEffect(() => {
  //     if (status && !hasRun.current) {
  //       hasRun.current = true; // Mark that it has run
  //       toast.success(t.checkPayment);
  //       callSingleOrder();
  //       router.push({
  //         pathname: `/userProfile/myOrders/${idOrder}`,
  //         query: { type },
  //       });
  //     }
  //   }, [router, status]);

  //     card_number: "4111111111111111",
  //     expiry_date: "1226",
  //     card_holder_name: "micheal abid",
  //     cvv: "123",

  const {
    data: confirmPriceRes,
    isFetching: confirmPriceFetch,
    refetch: callConfirmPricing,
  } = useCustomQuery({
    name: "confirmPriceOrder",
    url: `${SPARE_PARTS}${ORDERS}/${idOrder}${CONFIRM_PRICING}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: false,
    method: "post",
    body: {
      payment_method: selectedPaymentMethod?.key,
      payment_reference: merchanteRefrence,
    },
    onSuccess: (res) => {
      if (
        selectedPaymentMethod?.key === PAYMENT_METHODS?.credit &&
        +calculateReceiptResFromMainPage?.amount_to_pay > 0
      ) {
        form.submit();
        setTimeout(() => {
          setRedirectToPayfort(false);
        }, 6000);
        return;
      }
      toast.success(t.successPayOrder);
      router.push(`/spareParts/confirmation/${res?.id}`);
    },
    onError: (err) => {
      setRedirectToPayfort(false);
      toast.error(err?.response?.data?.message || t.someThingWrong);
    },
  });

  const renderUrlForCaluclate = () => {
    switch (type) {
      case ORDERSENUM?.marketplace:
        return `/marketplace${ORDERS}/${idOrder}`;
      case ORDERSENUM?.spareParts:
        return `${SPARE_PARTS}${ORDERS}/${idOrder}${CALCULATE_RECEIPT}`;
      default:
        return type;
    }
  };

  JSON.stringify({
    amount: 28112.05,
    currency: "SAR",
    digital_wallet: "APPLE_PAY",
    command: "PURCHASE",
    access_code: "fwmGcdC3DvtpUvUfIYdy",
    merchant_identifier: "merchant.com.atlobha.atlobhadebug",
    merchant_reference: "424445_223396",
    language: "ar",
    customer_email: "user@example.com",
  });

  const {
    data: calculateReceipt,
    isFetching: fetchReceipt,
    refetch: callCalculateReceipt,
  } = useCustomQuery({
    name: ["calculateReceiptForTotalPay"],
    url: renderUrlForCaluclate(),
    refetchOnWindowFocus: false,
    enabled: false,
    method: "post",
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      //   check if amount to pay changed before pay
      if (+res?.amount_to_pay !== +receipt?.amount_to_pay) {
        toast.error(`${t.remainingtotal} ${t.beChanged}`);
        setTimeout(() => {
          callSingleOrder();
        }, 500);
        return;
      }
      if (+res?.amount_to_pay > 0) {
        callConfirmPricing();
      } else {
        callConfirmPricing();
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.first_error || t.someThingWrong);
    },
  });

  const requestData = {
    command: "PURCHASE",
    access_code: process.env.NEXT_PUBLIC_PAYFORT_ACCESS,
    merchant_identifier: process.env.NEXT_PUBLIC_PAYFORT_IDENTIFIER,
    language: locale,
    currency: "SAR",
    customer_email: "user@example.com",
    // return_url: `${process.env.NEXT_PUBLIC_PAYFORT_RETURN_URL}/${orderDetails?.id}/?type=${type}&status=CREDIT`,
    return_url: `${process.env.NEXT_PUBLIC_PAYFORT_RETURN_URL}?order_id=${orderDetails?.id}&type=${type}&status=CREDIT`,
  };

  requestData.merchant_reference = merchanteRefrence;
  requestData.amount = (calculateReceipt?.amount_to_pay * 100)?.toFixed(0);
  // Generate Signature
  requestData.signature = generateSignature(
    requestData,
    process.env.NEXT_PUBLIC_PAYFORT_REQ_PHRASE
  );

  // Create a form and submit it
  const form = document.createElement("form");
  form.method = "POST";
  form.action = process.env.NEXT_PUBLIC_PAYFORT_URL;

  // Append inputs to form
  Object.keys(requestData).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = requestData[key];
    form.appendChild(input);
  });
  document.body.appendChild(form);

  const handleApplePayPayment = async () => {
    if (!window.ApplePaySession) {
      alert("Apple Pay is not supported on this device.");
      return;
    }

    const request = {
      countryCode: "SA",
      currencyCode: "SAR",
      supportedNetworks: ["visa", "masterCard", "amex"],
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

    // // ✅ Payment Authorization
    // session.onpaymentauthorized = async (event) => {
    //   try {
    //     console.log("Apple Pay Payment Data:", event.payment);
    //     console.error("Apple Pay Payment Data:", event.payment);

    //     const applePayData =
    //       event.payment.token || event.payment.token.paymentData;

    //     const generateSignatureKey = generateApplePaySignature({
    //       digital_wallet: "APPLE_PAY",
    //       command: "PURCHASE",
    //       access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
    //       merchant_identifier: process.env.NEXT_PUBLIC_APPLE_IDENTIFIER,
    //       merchant_reference: merchanteRefrence,
    //       amount: calculateReceiptResFromMainPage?.amount_to_pay,
    //       currency: "SAR",
    //       language: locale,
    //       customer_email: "user@example.com",
    //       apple_data: applePayData?.paymentData?.data,
    //       apple_signature: applePayData?.paymentData?.signature,
    //       apple_header: {
    //         apple_transactionId:
    //           applePayData?.paymentData?.header?.transactionId,
    //         apple_ephemeralPublicKey:
    //           applePayData?.paymentData?.header?.ephemeralPublicKey,
    //         apple_publicKeyHash:
    //           applePayData?.paymentData?.header?.publicKeyHash,
    //       },
    //       apple_paymentMethod: {
    //         apple_displayName: applePayData?.paymentMethod?.displayName,
    //         apple_network: applePayData?.paymentMethod?.network,
    //         apple_type: applePayData?.paymentMethod?.type,
    //       },
    //       customer_ip: "192.178.1.10",
    //     });

    //     const response = await fetch(process.env.NEXT_PUBLIC_APPLE_URL, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         digital_wallet: "APPLE_PAY",
    //         command: "PURCHASE",
    //         access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
    //         merchant_identifier: process.env.NEXT_PUBLIC_APPLE_IDENTIFIER,
    //         merchant_reference: merchanteRefrence,
    //         amount: calculateReceiptResFromMainPage?.amount_to_pay,
    //         currency: "SAR",
    //         language: locale,
    //         customer_email: "user@example.com",
    //         apple_data: applePayData?.paymentData?.data,
    //         apple_signature: applePayData?.paymentData?.signature,
    //         apple_header: {
    //           apple_transactionId:
    //             applePayData?.paymentData?.header?.transactionId,
    //           apple_ephemeralPublicKey:
    //             applePayData?.paymentData?.header?.ephemeralPublicKey,
    //           apple_publicKeyHash:
    //             applePayData?.paymentData?.header?.publicKeyHash,
    //         },
    //         apple_paymentMethod: {
    //           apple_displayName: applePayData?.paymentMethod?.displayName,
    //           apple_network: applePayData?.paymentMethod?.network,
    //           apple_type: applePayData?.paymentMethod?.type,
    //         },
    //         customer_ip: "192.178.1.10",
    //         signature: generateSignatureKey,
    //       }),
    //     });

    //     const result = await response.json();
    //     console.log("Payment API Response:", result);

    //     if (!response.ok || result.error) {
    //       throw new Error(result.error || "Payment failed");
    //     }

    //     session.completePayment(ApplePaySession.STATUS_SUCCESS);
    //     alert("Payment successful!");
    //   } catch (error) {
    //     console.error("Payment error:", error);
    //     alert(`Payment failed: ${error.message}`);
    //     session.completePayment(ApplePaySession.STATUS_FAILURE);
    //   }
    // };

    // // second signature
    // session.onpaymentauthorized = async (event) => {
    //   try {
    //     console.log("Apple Pay Payment Data:", event.payment);
    //     console.error("Apple Pay Payment Data:", event.payment);

    //     const applePayData =
    //       event.payment.token || event.payment.token.paymentData;

    //     const generateSignatureKey = generateSignature({
    //       digital_wallet: "APPLE_PAY",
    //       command: "PURCHASE",
    //       access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
    //       merchant_identifier: process.env.NEXT_PUBLIC_APPLE_IDENTIFIER,
    //       merchant_reference: merchanteRefrence,
    //       amount: calculateReceiptResFromMainPage?.amount_to_pay,
    //       currency: "SAR",
    //       language: locale,
    //       customer_email: "user@example.com",
    //       apple_data: applePayData?.paymentData?.data,
    //       apple_signature: applePayData?.paymentData?.signature,
    //       apple_header: {
    //         apple_transactionId:
    //           applePayData?.paymentData?.header?.transactionId,
    //         apple_ephemeralPublicKey:
    //           applePayData?.paymentData?.header?.ephemeralPublicKey,
    //         apple_publicKeyHash:
    //           applePayData?.paymentData?.header?.publicKeyHash,
    //       },
    //       apple_paymentMethod: {
    //         apple_displayName: applePayData?.paymentMethod?.displayName,
    //         apple_network: applePayData?.paymentMethod?.network,
    //         apple_type: applePayData?.paymentMethod?.type,
    //       },
    //       customer_ip: "192.178.1.10",
    //     });

    //     const response = await fetch(process.env.NEXT_PUBLIC_APPLE_URL, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         digital_wallet: "APPLE_PAY",
    //         command: "PURCHASE",
    //         access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
    //         merchant_identifier: process.env.NEXT_PUBLIC_APPLE_IDENTIFIER,
    //         merchant_reference: merchanteRefrence,
    //         amount: calculateReceiptResFromMainPage?.amount_to_pay,
    //         currency: "SAR",
    //         language: locale,
    //         customer_email: "user@example.com",
    //         apple_data: applePayData?.paymentData?.data,
    //         apple_signature: applePayData?.paymentData?.signature,
    //         apple_header: {
    //           apple_transactionId:
    //             applePayData?.paymentData?.header?.transactionId,
    //           apple_ephemeralPublicKey:
    //             applePayData?.paymentData?.header?.ephemeralPublicKey,
    //           apple_publicKeyHash:
    //             applePayData?.paymentData?.header?.publicKeyHash,
    //         },
    //         apple_paymentMethod: {
    //           apple_displayName: applePayData?.paymentMethod?.displayName,
    //           apple_network: applePayData?.paymentMethod?.network,
    //           apple_type: applePayData?.paymentMethod?.type,
    //         },
    //         customer_ip: "192.178.1.10",
    //         signature: generateSignatureKey,
    //       }),
    //     });

    //     const result = await response.json();
    //     console.log("Payment API Response:", result);

    //     if (!response.ok || result.error) {
    //       throw new Error(result.error || "Payment failed");
    //     }

    //     session.completePayment(ApplePaySession.STATUS_SUCCESS);
    //     alert("Payment successful!");
    //   } catch (error) {
    //     console.error("Payment error:", error);
    //     alert(`Payment failed: ${error.message}`);
    //     session.completePayment(ApplePaySession.STATUS_FAILURE);
    //   }
    // };

    // //   third signature
    // session.onpaymentauthorized = async (event) => {
    //   try {
    //     console.log("Apple Pay Payment Data:", event.payment);
    //     console.error("Apple Pay Payment Data:", event.payment);

    //     const applePayData =
    //       event.payment.token || event.payment.token.paymentData;

    //     const generateSignatureKey = generateSignatureApple({
    //       digital_wallet: "APPLE_PAY",
    //       command: "PURCHASE",
    //       access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
    //       merchant_identifier: process.env.NEXT_PUBLIC_APPLE_IDENTIFIER,
    //       merchant_reference: merchanteRefrence,
    //       amount: calculateReceiptResFromMainPage?.amount_to_pay,
    //       currency: "SAR",
    //       language: locale,
    //       customer_email: "user@example.com",
    //       apple_data: applePayData?.paymentData?.data,
    //       apple_signature: applePayData?.paymentData?.signature,
    //       apple_header: {
    //         apple_transactionId:
    //           applePayData?.paymentData?.header?.transactionId,
    //         apple_ephemeralPublicKey:
    //           applePayData?.paymentData?.header?.ephemeralPublicKey,
    //         apple_publicKeyHash:
    //           applePayData?.paymentData?.header?.publicKeyHash,
    //       },
    //       apple_paymentMethod: {
    //         apple_displayName: applePayData?.paymentMethod?.displayName,
    //         apple_network: applePayData?.paymentMethod?.network,
    //         apple_type: applePayData?.paymentMethod?.type,
    //       },
    //       customer_ip: "192.178.1.10",
    //     });

    //     const response = await fetch(process.env.NEXT_PUBLIC_APPLE_URL, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         digital_wallet: "APPLE_PAY",
    //         command: "PURCHASE",
    //         access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
    //         merchant_identifier: process.env.NEXT_PUBLIC_APPLE_IDENTIFIER,
    //         merchant_reference: merchanteRefrence,
    //         amount: calculateReceiptResFromMainPage?.amount_to_pay,
    //         currency: "SAR",
    //         language: locale,
    //         customer_email: "user@example.com",
    //         apple_data: applePayData?.paymentData?.data,
    //         apple_signature: applePayData?.paymentData?.signature,
    //         apple_header: {
    //           apple_transactionId:
    //             applePayData?.paymentData?.header?.transactionId,
    //           apple_ephemeralPublicKey:
    //             applePayData?.paymentData?.header?.ephemeralPublicKey,
    //           apple_publicKeyHash:
    //             applePayData?.paymentData?.header?.publicKeyHash,
    //         },
    //         apple_paymentMethod: {
    //           apple_displayName: applePayData?.paymentMethod?.displayName,
    //           apple_network: applePayData?.paymentMethod?.network,
    //           apple_type: applePayData?.paymentMethod?.type,
    //         },
    //         customer_ip: "192.178.1.10",
    //         signature: generateSignatureKey,
    //       }),
    //     });

    //     const result = await response.json();
    //     console.log("Payment API Response:", result);

    //     if (!response.ok || result.error) {
    //       throw new Error(result.error || "Payment failed");
    //     }

    //     session.completePayment(ApplePaySession.STATUS_SUCCESS);
    //     alert("Payment successful!");
    //   } catch (error) {
    //     console.error("Payment error:", error);
    //     alert(`Payment failed: ${error.message}`);
    //     session.completePayment(ApplePaySession.STATUS_FAILURE);
    //   }
    // };

    // fourth signature
    session.onpaymentauthorized = async (event) => {
      try {
        console.log("Apple Pay Payment Data:", event.payment);

        const applePayData = event.payment.token.paymentData;
        const paymentMethod = event.payment.token.paymentMethod;

        const requestBody = {
          digital_wallet: "APPLE_PAY",
          command: "PURCHASE",
          access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
          merchant_identifier: process.env.NEXT_PUBLIC_APPLE_IDENTIFIER,
          merchant_reference: merchanteRefrence,
          amount: calculateReceiptResFromMainPage?.amount_to_pay,
          currency: "SAR",
          language: locale,
          customer_email: "user@example.com",
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
        requestBody.signature = generateHmacSignatureChatGpt(requestBody);

        const response = await fetch(process.env.NEXT_PUBLIC_APPLE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const result = await response.json();
        console.log("Payment API Response:", result);

        if (!response.ok || result.error) {
          throw new Error(result.error || "Payment failed");
        }

        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        alert("Payment successful!");
      } catch (error) {
        console.error("Payment error:", error);
        alert(`Payment failed: ${error.message}`);
        session.completePayment(ApplePaySession.STATUS_FAILURE);
      }
    };

    session.begin();
  };

  //   fetch("/api/payfortApplePay", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       digital_wallet: "APPLE_PAY",
  //       command: "PURCHASE",
  //       access_code: "fwmGcdC3DvtpUvUfIYdy",
  //       merchant_identifier: "merchant.com.atlobha.atlobhadebug",
  //       merchant_reference: "424445_223396",
  //       amount: 28112.05,
  //       currency: "SAR",
  //       language: "ar",
  //       customer_email: "user@example.com",
  //       apple_data:
  //         "f47K+PdFzOofLT85nUApvTq8RSnbDbenal2YaGhA5kQhbt9ttASZbtPd9lED7DgmPnARQozTCxdc21Z4ktr+RQotfejmaK7c9G++pP7OWq+0g9EVSXkuBEErQ+fMNTo7usg8m1F1SHDH9NgReHWbw5Z6Wt/mKpm6lz5KVIwFdO20VeedUTjq1SzptGP8ntTTJJxGxKvQ4SqsfV6q3xOLC/jigow0LQP4IM9S5uK5hPh5MV+OEeEvi7otp2O+C6/9w+Hn66/xqle8DSJpCG9eHC/s0JDbRyd2t+eCApr9t1wagkDf7IN9ISbnshNX+X5mMBWl7qKC641sjKPRYeS6DcdII0tfNFjKPKtJ1KI8VZ55hOkWNgPPqQJ3LcdlgSzyVQ5ZlTvkNTo4mumztv/WMB4Ut0azfuMUSJHftst8eGtxPNY=",
  //       apple_signature:
  //         "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",
  //       apple_header: {
  //         apple_transactionId:
  //           "d7de7f16d9080634241acb82817a49d6472b75087debea18dfc0ecb6f2d25ae4",
  //         apple_ephemeralPublicKey:
  //           "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE53a7xY2CGmUJxrhRRdLG1acqYcx0GU0Czdd5jXUuzaViMkHG3nBNeQZuj4LnsKyFbectJDR5NFmvVexippnLFA==",
  //         apple_publicKeyHash: "0KkuwmIfSSjWYYDycDU6P9C7z2VUt75hOqXTaDkPGNk=",
  //       },
  //       apple_paymentMethod: {
  //         apple_displayName: "Visa 0121",
  //         apple_network: "Visa",
  //         apple_type: "credit",
  //       },
  //       customer_ip: "192.178.1.10",

  //       signature: generateHmacSignature({
  //         digital_wallet: "APPLE_PAY",
  //         command: "PURCHASE",
  //         access_code: "fwmGcdC3DvtpUvUfIYdy",
  //         merchant_identifier: "merchant.com.atlobha.atlobhadebug",
  //         merchant_reference: "424445_223396",
  //         amount: 28112.05,
  //         currency: "SAR",
  //         language: "ar",
  //         customer_email: "user@example.com",
  //         apple_data:
  //           "f47K+PdFzOofLT85nUApvTq8RSnbDbenal2YaGhA5kQhbt9ttASZbtPd9lED7DgmPnARQozTCxdc21Z4ktr+RQotfejmaK7c9G++pP7OWq+0g9EVSXkuBEErQ+fMNTo7usg8m1F1SHDH9NgReHWbw5Z6Wt/mKpm6lz5KVIwFdO20VeedUTjq1SzptGP8ntTTJJxGxKvQ4SqsfV6q3xOLC/jigow0LQP4IM9S5uK5hPh5MV+OEeEvi7otp2O+C6/9w+Hn66/xqle8DSJpCG9eHC/s0JDbRyd2t+eCApr9t1wagkDf7IN9ISbnshNX+X5mMBWl7qKC641sjKPRYeS6DcdII0tfNFjKPKtJ1KI8VZ55hOkWNgPPqQJ3LcdlgSzyVQ5ZlTvkNTo4mumztv/WMB4Ut0azfuMUSJHftst8eGtxPNY=",
  //         apple_signature:
  //           "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",
  //         apple_header: {
  //           apple_transactionId:
  //             "d7de7f16d9080634241acb82817a49d6472b75087debea18dfc0ecb6f2d25ae4",
  //           apple_ephemeralPublicKey:
  //             "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE53a7xY2CGmUJxrhRRdLG1acqYcx0GU0Czdd5jXUuzaViMkHG3nBNeQZuj4LnsKyFbectJDR5NFmvVexippnLFA==",
  //           apple_publicKeyHash: "0KkuwmIfSSjWYYDycDU6P9C7z2VUt75hOqXTaDkPGNk=",
  //         },
  //         apple_paymentMethod: {
  //           apple_displayName: "Visa 0121",
  //           apple_network: "Visa",
  //           apple_type: "credit",
  //         },
  //         customer_ip: "192.178.1.10",
  //       }),
  //     }),
  //   });

  //   console.log(
  //     JSON.stringify({
  //       digital_wallet: "APPLE_PAY",
  //       command: "PURCHASE",
  //       access_code: "fwmGcdC3DvtpUvUfIYdy",
  //       merchant_identifier: "merchant.com.atlobha.atlobhadebug",
  //       merchant_reference: "424445_223403",
  //       amount: 26.6,
  //       currency: "SAR",
  //       language: "ar",
  //       customer_email: "user@example.com",
  //       apple_data:
  //         "0zBQWmSNqd1y4k+jCrCtFzVmS50bhuXvgz21pTJ9O2Wq0mmWsb0BILEoOX2MFQAXVm06S/NKy4W7CbUh0SGEfRFJkkEDocYbF8Uwv0AimlsfGNT5z4jd9+n9lSRQT+k8veMYFHGzUGl5qF7g2FCJ6T6ypEMFb9+rD+ESUm5HpOgeDIwskm7TOvS3ha/VGosBQbEtOMQ7a7QpeQvh/LE5UVPxD9w16li3CwkDIfEEVLIXdy0+LIX6B9OUiyycC9HnPpgvf+j14icg35FVQxX5cl/vGemoBg24s3sHKhnpx90jlFSPCyyFmp5viGMW2oG2C/uFIV1gSu+IKWjrMP+ONjmYDvxztzye5ZgyiZ01NsUut63mpL4JrDS4dgETZ/lVsM7LPoQNlTD5RMFSApJ09yDdzbAfrTVcUdFNmZx8110=",
  //       apple_signature:
  //         "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",
  //       apple_header: {
  //         apple_transactionId:
  //           "403f54569644c4c4f94a31698339dcd56286711a4ab08a40781363613d710ae8",
  //         apple_ephemeralPublicKey:
  //           "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEVxRK2wvAQEL3ybppfB1SQbx/DYmyxSXzLLr7GkmG+wzA3IfgfTipSKporhB1n54K8y94379+0szbaqVqrWFhIA==",
  //         apple_publicKeyHash: "0KkuwmIfSSjWYYDycDU6P9C7z2VUt75hOqXTaDkPGNk=",
  //       },
  //       apple_paymentMethod: {
  //         apple_displayName: "Visa 0121",
  //         apple_network: "Visa",
  //         apple_type: "credit",
  //       },
  //       customer_ip: "192.178.1.10",
  //     })
  //   );

  //   this is the last acurate payload that return signature mismatch
//   console.log({
//     digital_wallet: "APPLE_PAY",
//     command: "PURCHASE",
//     access_code: "fwmGcdC3DvtpUvUfIYdy",
//     merchant_identifier: "merchant.com.atlobha.atlobhadebug",
//     merchant_reference: "424445_223405",
//     amount: 18.55,
//     currency: "SAR",
//     language: "ar",
//     customer_email: "user@example.com",
//     customer_ip: "192.168.1.1",
//     apple_data:
//       "PLJRBtTXhh5W/uFi4yF1fltYcrpu3TYzTY6qxCeDBzUxMOsYfZnFON7QJhmY9l3D3XyMISbFGPNsaiBZV6mXf0s6Qi/nlDqhWbXqBNPyUwiPQwdOlM9/5TZ6XtmWMCK3YUfURgjSsWTxIKScW2IR5Me+meKNbxuUOSQgUx58GuYOIhwJd7yENACSvLfPE3h9iOynYLl0WlHCFMg7Giu/clfIH2nKGkcFj4MxFHTKrRZ8JII/RQrfZB5iwMUyjE7TH8Y4AyPbdE9h8GlqK7AuZg8nljw2K69/BAlH7y87ptopdk8zSnlkLQGuFhlB7pncIzHy67tjcpWeBwwMMqth0qNufeZgIA8N4M5CuCHCs1NODo0iXEe1cXKj+k4UsjhR9nmXdcmoF2enLUSaicNB7C6/faRNWhSXnz+EoaJgrPc=",
//     apple_signature:
//       "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",
//     apple_header: {
//       apple_transactionId:
//         "8b956c8642202bdd59285f3ccd09b4246e7e405312f29e734ef759576c13d17d",
//       apple_ephemeralPublicKey:
//         "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEtNDmj8E8SpfFnVZpkOT1361P6z1daUAeQ1Kx8awf3loe+hiYKe+biZ3NNVG6NEfRx+ai/KzIcmHmqlX2Ir27Ug==",
//       apple_publicKeyHash: "0KkuwmIfSSjWYYDycDU6P9C7z2VUt75hOqXTaDkPGNk=",
//     },
//     apple_paymentMethod: {
//       apple_displayName: "Visa 0121",
//       apple_network: "Visa",
//       apple_type: "credit",
//     },
//     signature:
//       "5C40BD16F3E4BA5C6699E339136B9EFE154C2943F2288348AE28EB893466ACB313EA1B16EE5512B17D166FE29F7497C29EF696694719718989421D2D4BE3A1D5",
//   });

  return (
    <Box
      sx={{
        width: isMobile ? "unset" : "30vw",
        padding: isMobile ? "8px 13px" : "8px 30px",
      }}
    >
      <Box sx={header}>{t.orderSummary}</Box>
      {/* products price */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.productsPrice}</Box>
        <Box sx={text}>
          {orderDetails?.parts
            ?.reduce(
              (accumulator, current) => accumulator + current.total_price,
              0
            )
            ?.toFixed(2)}{" "}
          {t.sar}
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
          {t.sar}
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
          {t.sar}
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
          {t.sar}
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
          {t.sar}
        </Box>
      </Box>
      {/* vat  percentage */}
      <Box sx={vat}>
        {t.include}{" "}
        {((calculateReceiptResFromMainPage?.tax_percentage ??
          receipt?.tax_percentage) === receipt?.tax_percentage
          ? receipt?.tax_percentage
          : calculateReceiptResFromMainPage?.tax_percentage) * 100}
        ٪ {t.vatPercentage} ({receipt?.tax} {t.sar})
      </Box>
      <Divider sx={{ background: "#EAECF0", mb: 2 }} />
      {/* rest to pay */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.remainingtotal}</Box>
        <Box sx={text}>
          {((calculateReceiptResFromMainPage?.amount_to_pay ??
            receipt?.amount_to_pay) === receipt?.amount_to_pay
            ? receipt?.amount_to_pay
            : calculateReceiptResFromMainPage?.amount_to_pay
          )?.toFixed(2)}{" "}
          {t.sar}
        </Box>
      </Box>
      {/* logic for incomplete */}
      {orderDetails?.status === STATUS?.incomplete && (
        <>
          <Box className="d-flex justify-content-between mb-2">
            <Box sx={boldText}>{t.total}</Box>
            <Box sx={boldText}>
              {(calculateReceiptResFromMainPage?.total_price ??
                receipt?.total_price) === receipt?.total_price
                ? receipt?.total_price
                : calculateReceiptResFromMainPage?.total_price}{" "}
              {t.sar}
            </Box>
          </Box>
          <SharedBtn
            className="big-main-btn"
            customClass="w-100"
            text="repeatPricing"
            onClick={() => {
              callRepeatPricing();
              window.webengage.onReady(() => {
                webengage.track("ORDER_SPAREPARTS_REPRICE", {
                  car_brand: orderDetails?.vehicle?.brand?.name || "",
                  car_model: orderDetails?.vehicle?.model?.name || "",
                  car_year: orderDetails?.vehicle?.year || "",
                  order_items:
                    orderDetails?.parts?.map((part) => ({
                      Part_Name_or_Number: part?.name || part?.id || "",
                      Quantity: part?.quantity || 0,
                      Image: part?.image || "",
                    })) || [],
                  shipping_address: orderDetails?.address?.address || "",
                  promo_code: orderDetails?.promo_code?.code || "",
                  comment: orderDetails?.notes || "",
                  order_number: orderDetails?.id || "",
                  creation_date: orderDetails?.created_at || "",
                  status: orderDetails?.status || "",
                  order_url: router?.asPath || "",
                  total_price:
                    calculateReceiptResFromMainPage?.total_price ||
                    receipt?.total_price ||
                    0,
                });
              });
            }}
            disabled={repeatPriceFetch}
            comAfterText={
              repeatPriceFetch ? (
                <CircularProgress color="inherit" size={15} />
              ) : null
            }
          />
        </>
      )}
      {/* logic for delivered */}
      {orderDetails?.status === STATUS?.delivered && (
        <>
          <Box className="d-flex justify-content-between mb-2">
            <Box sx={boldText}>{t.total}</Box>
            <Box sx={boldText}>
              {(calculateReceiptResFromMainPage?.total_price ??
                receipt?.total_price) === receipt?.total_price
                ? receipt?.total_price
                : calculateReceiptResFromMainPage?.total_price}{" "}
              {t.sar}
            </Box>
          </Box>
          <SharedBtn
            className="black-btn"
            customClass="w-100"
            text="orderAgain"
          />
        </>
      )}
      {/* logic for priced order */}
      {orderDetails?.status === STATUS?.priced && (
        <>
          <Box className="d-flex justify-content-between mb-2">
            <Box sx={boldText}>{t.total}</Box>
            <Box sx={boldText}>
              {(calculateReceiptResFromMainPage?.total_price ??
                receipt?.total_price) === receipt?.total_price
                ? receipt?.total_price
                : calculateReceiptResFromMainPage?.total_price}{" "}
              {t.sar}
            </Box>
          </Box>
          <SharedBtn
            disabled={
              !selectedPaymentMethod?.id ||
              confirmPriceFetch ||
              fetchReceipt ||
              redirectToPayfort
            }
            className="big-main-btn"
            customClass="w-100"
            text="payAndConfirm"
            comAfterText={
              confirmPriceFetch || fetchReceipt || redirectToPayfort ? (
                <CircularProgress color="inherit" size={15} />
              ) : null
            }
            onClick={() => {
              if (selectedPaymentMethod?.key === PAYMENT_METHODS?.credit) {
                setRedirectToPayfort(true);
                callCalculateReceipt();
              } else if (
                selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay
              ) {
                handleApplePayPayment();
              } else {
                callCalculateReceipt();
              }
            }}
          />
        </>
      )}
    </Box>
  );
}

export default SummaryOrder;
