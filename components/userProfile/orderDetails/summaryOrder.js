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
  generateSignature,
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

    // JSON.stringify({
    //   token: {
    //     paymentData: {
    //       data: "p3T0CLgwPQo8wbmP7BmAtA5+VNnZIqgKFT5RWj7ExqBkxQGjJvHKueDqkUe4dlRLHy5abjgZdpdpBzkC8GNTUiWLNhIQNOKIBggXMRSboR1F0suY2KLtM96HU+boxdB3cPkJBpr/+YlaepE6ZCiuRMqFZe7XI8Z035bRc1ircMVlZLIY1BWEEmxxPl+J8xws6csg/5Z1KeEUBjzSgKUAgUpB6zCqZfHLqDFlGEC73MmQEsdPfCUfWVkZavUzCswJjJWKQXQmt3spPIfn75pzv5r1/OB0gZNf/VPwrcB2mfCIuDOqXrEXvAra7pF/rifYY8OdQ2CikGnWhgul6xfZ65zu52Z8AfWGZpsjrCw3J0wgO1+JRXIE3EL1kmGklurAxOUJ7m5WGiPgfsasO6hv0YNBILkqFVh3pSk1r3yN0USpM7A=",
    //       signature:
    //         "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",
    //       header: {
    //         publicKeyHash: "0KkuwmIfSSjWYYDycDU6P9C7z2VUt75hOqXTaDkPGNk=",
    //         ephemeralPublicKey:
    //           "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEAgC73Eq5rpMF61urtiekYUVuSwsNdZH4XXVE13HnYfNhX4TCamgaEVDiv3cj4GxhFkk9IruJJfAUktKyQlG1iw==",
    //         transactionId:
    //           "4902afca4144620c511b4c213ac466db047d35af553b08398780f11b54c7df65",
    //       },
    //       version: "EC_v1",
    //     },
    //     paymentMethod: {
    //       displayName: "Visa 0121",
    //       network: "Visa",
    //       type: "credit",
    //     },
    //     transactionIdentifier:
    //       "4902afca4144620c511b4c213ac466db047d35af553b08398780f11b54c7df65",
    //   },
    //   amount: 28112.05,
    //   currency: "SAR",
    //   digital_wallet: "APPLE_PAY",
    //   command: "PURCHASE",
    //   access_code: "fwmGcdC3DvtpUvUfIYdy",
    //   merchant_identifier: "merchant.com.atlobha.atlobhadebug",
    //   merchant_reference: "424445_223396",
    //   language: "ar",
    //   customer_email: "user@example.com",
    //   apple_data: {
    //     paymentData: {
    //       data: "p3T0CLgwPQo8wbmP7BmAtA5+VNnZIqgKFT5RWj7ExqBkxQGjJvHKueDqkUe4dlRLHy5abjgZdpdpBzkC8GNTUiWLNhIQNOKIBggXMRSboR1F0suY2KLtM96HU+boxdB3cPkJBpr/+YlaepE6ZCiuRMqFZe7XI8Z035bRc1ircMVlZLIY1BWEEmxxPl+J8xws6csg/5Z1KeEUBjzSgKUAgUpB6zCqZfHLqDFlGEC73MmQEsdPfCUfWVkZavUzCswJjJWKQXQmt3spPIfn75pzv5r1/OB0gZNf/VPwrcB2mfCIuDOqXrEXvAra7pF/rifYY8OdQ2CikGnWhgul6xfZ65zu52Z8AfWGZpsjrCw3J0wgO1+JRXIE3EL1kmGklurAxOUJ7m5WGiPgfsasO6hv0YNBILkqFVh3pSk1r3yN0USpM7A=",
    //       signature:
    //         "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",
    //       header: {
    //         publicKeyHash: "0KkuwmIfSSjWYYDycDU6P9C7z2VUt75hOqXTaDkPGNk=",
    //         ephemeralPublicKey:
    //           "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEAgC73Eq5rpMF61urtiekYUVuSwsNdZH4XXVE13HnYfNhX4TCamgaEVDiv3cj4GxhFkk9IruJJfAUktKyQlG1iw==",
    //         transactionId:
    //           "4902afca4144620c511b4c213ac466db047d35af553b08398780f11b54c7df65",
    //       },
    //       version: "EC_v1",
    //     },
    //     paymentMethod: {
    //       displayName: "Visa 0121",
    //       network: "Visa",
    //       type: "credit",
    //     },
    //     transactionIdentifier:
    //       "4902afca4144620c511b4c213ac466db047d35af553b08398780f11b54c7df65",
    //   },
    //   signature:
    //     "82651286f6b65733caf1c5bd5bcace77b5178cbd653a8c5beff0fb5060d80e37",
    // });
    // ✅ Payment Authorization
    session.onpaymentauthorized = async (event) => {
      try {
        console.log("Apple Pay Payment Data:", event.payment);
        console.error("Apple Pay Payment Data:", event.payment);

        const paymentToken =
          event.payment.token || event.payment.token.paymentData; // ✅ Extracting correct token format
        const applePayData =
          event.payment.token || event.payment.token.paymentData;

        const signatureString = `${process.env.NEXT_PUBLIC_APPLE_REQ_PHRASE}access_code=${process.env.NEXT_PUBLIC_APPLE_ACCESS}amount=${calculateReceiptResFromMainPage?.amount_to_pay}command=PURCHASEcurrency=SARcustomer_email=user@example.comlanguage=${locale}merchant_identifier=${process.env.NEXT_PUBLIC_APPLE_IDENTIFIER}merchant_reference=${merchanteRefrence}token_name=${paymentToken}${process.env.NEXT_PUBLIC_APPLE_REQ_PHRASE}`;

        const signature = crypto
          .createHash("sha256")
          .update(signatureString)
          .digest("hex");

        const response = await fetch(process.env.NEXT_PUBLIC_APPLE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // token: paymentToken, // ✅ Sending correctly formatted token
            amount: calculateReceiptResFromMainPage?.amount_to_pay,
            currency: "SAR",
            digital_wallet: "APPLE_PAY",
            command: "PURCHASE",
            access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
            merchant_identifier: process.env.NEXT_PUBLIC_APPLE_IDENTIFIER,
            merchant_reference: merchanteRefrence,
            customer_ip: "192.178.1.10",
            language: locale,
            customer_email: "user@example.com",
            apple_data: applePayData?.paymentData?.data,
            apple_signature: applePayData?.paymentData?.signature,
            apple_header: applePayData?.paymentData?.header,
            apple_transactionId:
              applePayData?.paymentData?.header?.transactionId,
            apple_ephemeralPublicKey:
              applePayData?.paymentData?.header?.ephemeralPublicKey,
            apple_publicKeyHash:
              applePayData?.paymentData?.header?.publicKeyHash,
            apple_paymentMethod: applePayData?.paymentMethod,
            apple_displayName: applePayData?.paymentMethod?.displayName,
            apple_network: applePayData?.paymentMethod?.network,
            apple_type: applePayData?.paymentMethod?.type,
            signature: generateSignatureApplePay({
              amount: calculateReceiptResFromMainPage?.amount_to_pay,
              currency: "SAR",
              digital_wallet: "APPLE_PAY",
              command: "PURCHASE",
              access_code: process.env.NEXT_PUBLIC_APPLE_ACCESS,
              merchant_identifier: process.env.NEXT_PUBLIC_APPLE_IDENTIFIER,
              merchant_reference: merchanteRefrence,
              customer_ip: "192.178.1.10",
              language: locale,
              customer_email: "user@example.com",
              apple_data: applePayData?.paymentData?.data,
              apple_signature: applePayData?.paymentData?.signature,
              apple_header: applePayData?.paymentData?.header,
              apple_transactionId:
                applePayData?.paymentData?.header?.transactionId,
              apple_ephemeralPublicKey:
                applePayData?.paymentData?.header?.ephemeralPublicKey,
              apple_publicKeyHash:
                applePayData?.paymentData?.header?.publicKeyHash,
              apple_paymentMethod: applePayData?.paymentMethod,
              apple_displayName: applePayData?.paymentMethod?.displayName,
              apple_network: applePayData?.paymentMethod?.network,
              apple_type: applePayData?.paymentMethod?.type,
            }),
          }),
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

//   const response = fetch("/api/payfortApplePay", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       amount: 28112.05,
//       currency: "SAR",
//       digital_wallet: "APPLE_PAY",
//       command: "PURCHASE",
//       access_code: "fwmGcdC3DvtpUvUfIYdy",
//       merchant_identifier: "merchant.com.atlobha.atlobhadebug",
//       merchant_reference: "424445_223396",
//       customer_ip: "192.178.1.10",
//       language: "ar",
//       customer_email: "user@example.com",
//       apple_data:
//         "f47K+PdFzOofLT85nUApvTq8RSnbDbenal2YaGhA5kQhbt9ttASZbtPd9lED7DgmPnARQozTCxdc21Z4ktr+RQotfejmaK7c9G++pP7OWq+0g9EVSXkuBEErQ+fMNTo7usg8m1F1SHDH9NgReHWbw5Z6Wt/mKpm6lz5KVIwFdO20VeedUTjq1SzptGP8ntTTJJxGxKvQ4SqsfV6q3xOLC/jigow0LQP4IM9S5uK5hPh5MV+OEeEvi7otp2O+C6/9w+Hn66/xqle8DSJpCG9eHC/s0JDbRyd2t+eCApr9t1wagkDf7IN9ISbnshNX+X5mMBWl7qKC641sjKPRYeS6DcdII0tfNFjKPKtJ1KI8VZ55hOkWNgPPqQJ3LcdlgSzyVQ5ZlTvkNTo4mumztv/WMB4Ut0azfuMUSJHftst8eGtxPNY=",
//       apple_signature:
//         "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",
//       apple_header: {
//         publicKeyHash: "0KkuwmIfSSjWYYDycDU6P9C7z2VUt75hOqXTaDkPGNk=",
//         ephemeralPublicKey:
//           "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE53a7xY2CGmUJxrhRRdLG1acqYcx0GU0Czdd5jXUuzaViMkHG3nBNeQZuj4LnsKyFbectJDR5NFmvVexippnLFA==",
//         transactionId:
//           "d7de7f16d9080634241acb82817a49d6472b75087debea18dfc0ecb6f2d25ae4",
//       },
//       apple_transactionId:
//         "d7de7f16d9080634241acb82817a49d6472b75087debea18dfc0ecb6f2d25ae4",
//       apple_ephemeralPublicKey:
//         "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE53a7xY2CGmUJxrhRRdLG1acqYcx0GU0Czdd5jXUuzaViMkHG3nBNeQZuj4LnsKyFbectJDR5NFmvVexippnLFA==",
//       apple_publicKeyHash: "0KkuwmIfSSjWYYDycDU6P9C7z2VUt75hOqXTaDkPGNk=",
//       apple_paymentMethod: {
//         displayName: "Visa 0121",
//         network: "Visa",
//         type: "credit",
//       },
//       apple_displayName: "Visa 0121",
//       apple_network: "Visa",
//       apple_type: "credit",
//       signature:generateSignatureApplePay({
		
// 	  })
//     }),
//   });

//   JSON.stringify({
//     amount: 28112.05,
//     currency: "SAR",
//     digital_wallet: "APPLE_PAY",
//     command: "PURCHASE",
//     access_code: "fwmGcdC3DvtpUvUfIYdy",
//     merchant_identifier: "merchant.com.atlobha.atlobhadebug",
//     merchant_reference: "424445_223396",
//     customer_ip: "192.178.1.10",
//     language: "ar",
//     customer_email: "user@example.com",
//     apple_data:
//       "f47K+PdFzOofLT85nUApvTq8RSnbDbenal2YaGhA5kQhbt9ttASZbtPd9lED7DgmPnARQozTCxdc21Z4ktr+RQotfejmaK7c9G++pP7OWq+0g9EVSXkuBEErQ+fMNTo7usg8m1F1SHDH9NgReHWbw5Z6Wt/mKpm6lz5KVIwFdO20VeedUTjq1SzptGP8ntTTJJxGxKvQ4SqsfV6q3xOLC/jigow0LQP4IM9S5uK5hPh5MV+OEeEvi7otp2O+C6/9w+Hn66/xqle8DSJpCG9eHC/s0JDbRyd2t+eCApr9t1wagkDf7IN9ISbnshNX+X5mMBWl7qKC641sjKPRYeS6DcdII0tfNFjKPKtJ1KI8VZ55hOkWNgPPqQJ3LcdlgSzyVQ5ZlTvkNTo4mumztv/WMB4Ut0azfuMUSJHftst8eGtxPNY=",
//     apple_signature:
//       "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",
//     apple_header: {
//       publicKeyHash: "0KkuwmIfSSjWYYDycDU6P9C7z2VUt75hOqXTaDkPGNk=",
//       ephemeralPublicKey:
//         "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE53a7xY2CGmUJxrhRRdLG1acqYcx0GU0Czdd5jXUuzaViMkHG3nBNeQZuj4LnsKyFbectJDR5NFmvVexippnLFA==",
//       transactionId:
//         "d7de7f16d9080634241acb82817a49d6472b75087debea18dfc0ecb6f2d25ae4",
//     },
//     apple_transactionId:
//       "d7de7f16d9080634241acb82817a49d6472b75087debea18dfc0ecb6f2d25ae4",
//     apple_ephemeralPublicKey:
//       "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE53a7xY2CGmUJxrhRRdLG1acqYcx0GU0Czdd5jXUuzaViMkHG3nBNeQZuj4LnsKyFbectJDR5NFmvVexippnLFA==",
//     apple_publicKeyHash: "0KkuwmIfSSjWYYDycDU6P9C7z2VUt75hOqXTaDkPGNk=",
//     apple_paymentMethod: {
//       displayName: "Visa 0121",
//       network: "Visa",
//       type: "credit",
//     },
//     apple_displayName: "Visa 0121",
//     apple_network: "Visa",
//     apple_type: "credit",
//     signature:
//       "a113c0c82cc99e69a9e9426f72319e7445855334e0ae5cb108df3ba4627d1d89",
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
