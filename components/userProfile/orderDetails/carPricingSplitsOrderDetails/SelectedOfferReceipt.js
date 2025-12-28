import SharedBtn from "@/components/shared/SharedBtn";
import {
  OFFERS,
  PAY_DEPOSIT,
  VEHICLE_PRICING_ORDERS,
} from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import { usersAddressesQuery } from "@/config/network/Shared/GetDataHelper";
import { useAuth } from "@/config/providers/AuthProvider";
import { PAYMENT_METHODS, STATUS, VEHICLE_PRICING } from "@/constants/enums";
import {
  generateSignature,
  generateSignatureApplePay,
  riyalImgBlack,
} from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllAddresses,
  setDefaultAddress,
} from "@/redux/reducers/selectedAddressReducer";
import useCustomQuery from "@/config/network/Apiconfig";
import { toast } from "react-toastify";

function SelectedOfferReceipt({
  receipt,
  orderDetails = {},
  selectedOffer = {},
}) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  const { idOrder } = router.query;
  const merchanteRefrence = `${user?.data?.user?.id}_${idOrder}`;
  const { selectedPaymentMethod } = useSelector(
    (state) => state.selectedPaymentMethod
  );
  const [redirectToPayfort, setRedirectToPayfort] = useState(false);
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const userAddress = selectedAddress?.id ? selectedAddress : defaultAddress;
  const { userDataProfile } = useSelector((state) => state.quickSection);

  usersAddressesQuery({
    setAllAddresses,
    user,
    dispatch,
    setDefaultAddress,
  });

  const text = {
    color: "#232323",
    fontSize: isMobile ? "12px" : "15px",
    fontWeight: "500",
  };
  const header = {
    color: "#232323",
    fontSize: isMobile ? "16px" : "22px",
    fontWeight: "700",
    mb: 1,
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
    name: "confirmVehicleOrder",
    url: `${VEHICLE_PRICING_ORDERS}/${idOrder}${OFFERS}/${selectedOffer?.id}${PAY_DEPOSIT}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: false,
    method: "post",
    body: {
      deposit_payment_method: selectedPaymentMethod?.key,
      deposit_payment_reference: merchanteRefrence,
    },
    onSuccess: (res) => {
      const oldData =
        JSON.parse(localStorage.getItem("carPricingDetails")) || {};

      const updatedData = {
        ...oldData,
        created_order_car_res: {
          orderDetails: orderDetails,
          payment_method: selectedPaymentMethod?.key,
        },
        selectedOffer: selectedOffer,
      };

      localStorage.setItem("carPricingDetails", JSON.stringify(updatedData));
      if (
        selectedPaymentMethod?.key === PAYMENT_METHODS?.credit &&
        +receipt?.deposit_amount > 0
      ) {
        form.submit();
        return;
      }
      if (selectedPaymentMethod?.key === PAYMENT_METHODS?.cash) {
        router.push(`/confirmation/carPricing/?secType=${VEHICLE_PRICING}`);
        return;
      }
      if (
        selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay &&
        +receipt?.deposit_amount > 0
      ) {
        return;
      }
      if (
        selectedPaymentMethod?.key === PAYMENT_METHODS?.tamara &&
        +receipt?.deposit_amount > 0
      ) {
        handlePayWithTamara();
        return;
      }
      if (
        selectedPaymentMethod?.key === PAYMENT_METHODS?.tabby &&
        +receipt?.deposit_amount > 0
      ) {
        handlePayWithTabby();
        return;
      }
      if (
        selectedPaymentMethod?.key === PAYMENT_METHODS?.mis &&
        +receipt?.deposit_amount > 0
      ) {
        handleMisPay();
        return;
      }
      setTimeout(() => {
        setRedirectToPayfort(false);
      }, 12000);
      toast.success(t.successPayOrder);
      router.push(`/confirmation/carPricing/?secType=${VEHICLE_PRICING}`);
    },
    onError: (err) => {
      setRedirectToPayfort(false);
      toast.error(err?.response?.data?.message || t.someThingWrong);
    },
  });

  const requestData = {
    command: "PURCHASE",
    access_code: process.env.NEXT_PUBLIC_PAYFORT_ACCESS,
    merchant_identifier: process.env.NEXT_PUBLIC_PAYFORT_IDENTIFIER,
    language: locale,
    currency: "SAR",
    customer_email: "user@example.com",
    return_url: `${process.env.NEXT_PUBLIC_PAYFORT_RETURN_GIFT_CARD}?carPricing=true&orderDetailsId=${idOrder}`,
  };

  requestData.merchant_reference = merchanteRefrence;
  requestData.amount = (receipt?.deposit_amount * 100)?.toFixed(0);
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
        amount: receipt?.deposit_amount, // Adjust dynamically if needed
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
              Authorization: `Bearer ${localStorage?.getItem("access_token")}`,
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
          amount: (receipt?.deposit_amount * 100)?.toFixed(0),
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

        if (!response.ok || result.error) {
          console.log(error in res, result.error);
          throw new Error(result.error || "Payment failed");
        }

        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        router.push(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/confirmation/carPricing/?secType=${VEHICLE_PRICING}`
        );
      } catch (error) {
        alert(`Payment failed: ${error.message}`);
        session.completePayment(ApplePaySession.STATUS_FAILURE);
      }
    };

    session.oncancel = (event) => {
      alert(t.paymentCancelled);
      setRedirectToPayfort(false);
      console.log("Apple Pay cancelled:", event);
    };

    session.begin();
  };

  /* -------------------------------------------------------------------------- */
  /*                            tamara payment logic                            */
  /* -------------------------------------------------------------------------- */
  const handlePayWithTamara = async () => {
    setRedirectToPayfort(true);

    const res = await fetch("/api/tamara/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipping_address: {
          city: userAddress?.city?.name,
          country_code: userAddress?.city?.country?.code,
          first_name: userDataProfile?.name,
          last_name: "",
          line1: userAddress?.address,
        },
        description: `order-car-confirmed-for-user-with-id=${userDataProfile?.id}`,
        order_reference_id: merchanteRefrence,
        totalAmount: receipt?.deposit_amount,
        successUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/confirmation/carPricing/?secType=${VEHICLE_PRICING}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/carPricing/checkout/?secType=${VEHICLE_PRICING}`,
        failureUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/carPricing/checkout/?secType=${VEHICLE_PRICING}`,
        customer: {
          first_name: userDataProfile?.name,
          last_name: "",
          phone_number: userDataProfile?.phone?.replace(/^(\+?966)/, ""),
          email:
            userDataProfile?.email ||
            userDataProfile?.secondary_email ||
            `${userDataProfile?.phone}@atlobha.com`,
        },
        items: [
          {
            reference_id: orderDetails?.brand?.name,
            sku: orderDetails?.brand?.name,
            name: orderDetails?.brand?.name,
            quantity: 1,
            type: "Digital",
            total_amount: {
              amount: receipt?.deposit_amount,
              currency: "SAR",
            },
          },
        ],
      }),
    });

    const data = await res.json();
    setRedirectToPayfort(false);

    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert("Failed to create Tamara order.");
      console.error(data);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             tabby payment logic                            */
  /* -------------------------------------------------------------------------- */
  const handlePayWithTabby = async () => {
    const testingBuyer = {
      phone: "500000001",
      email: "card.success@tabby.ai",
      name: "micheal abid",
    };
    //   otp is 8888
    const realBuyer = {
      phone: userDataProfile?.phone?.replace(/^(\+?966)/, ""),
      email:
        userDataProfile?.email ||
        userDataProfile?.secondary_email ||
        `${userDataProfile?.phone}@atlobha.com`,

      name: userDataProfile?.name,
    };
    const shippingDetails = {
      city: userAddress?.city?.name,
      address: userAddress?.address,
      zip: "12345",
    };

    const response = await fetch("/api/tabby/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment: {
          amount: receipt?.deposit_amount,
          currency: "SAR",
          buyer: testingBuyer,
          shipping_address: shippingDetails,
          order: {
            reference_id: merchanteRefrence,
            items: [
              {
                title: orderDetails?.brand?.name,
                quantity: 1,
                unit_price: receipt?.deposit_amount,
                category: orderDetails?.brand?.name,
              },
            ],
          },
          buyer_history: {
            registered_since: new Date().toISOString(),
            loyalty_level: 0,
          },
          order_history: [
            {
              purchased_at: new Date().toISOString(),
              amount: receipt?.deposit_amount,
              status: "new",
              buyer: testingBuyer,
              shipping_address: shippingDetails,
            },
          ],
        },
        lang: locale,
        merchant_code: "Atolbha",
        merchant_urls: {
          cancel: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/carPricing/checkout/?secType=${VEHICLE_PRICING}`,
          failure: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/carPricing/checkout/?secType=${VEHICLE_PRICING}`,
          success: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/confirmation/carPricing/?secType=${VEHICLE_PRICING}`,
        },
      }),
    });

    const data = await response.json();

    if (data?.configuration?.available_products?.installments) {
      const checkoutUrl =
        data.configuration.available_products.installments[0].web_url;
      window.location.href = checkoutUrl; // Open in same tab
    } else {
      alert("Failed to create Tabby checkout.");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                              MIS payment logic                             */
  /* -------------------------------------------------------------------------- */
  const handleMisPay = async () => {
    // userTestPhone:520008105
    // otp:111111
    const res = await fetch("/api/mis/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        orderId: merchanteRefrence,
        totalPrice: receipt?.deposit_amount,
        shippingAmount: "0",
        vat: "0",
        purchaseAmount: receipt?.deposit_amount,
        purchaseCurrency: "SAR",
        lang: locale,
        version: "v1.1",
        customerDetails: {
          mobileNumber: userDataProfile?.phone,
        },
        orderDetails: {
          items: [
            {
              nameArabic: orderDetails?.brand?.name,
              nameEnglish: orderDetails?.brand?.name,
              quantity: 1,
              unitPrice: receipt?.deposit_amount,
            },
          ],
        },
        callbackUri: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/confirmation/carPricing/?secType=${VEHICLE_PRICING}`,
      }),
    });

    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url; // redirect to MIS Pay
    } else {
      alert("Payment initiation failed");
    }
  };

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       const orderId = Cookies.get("created_order_id");
  //       const orderType = Cookies.get("order_type");
  //       const paymentMethod = Cookies.get("payment_method");
  //       if (orderId && orderType && paymentMethod) {
  //         setTimeout(() => {
  //           Cookies.set("payment_failed", "failed", { expires: 1, path: "/" });
  //         }, 1000);
  //         clearInterval(interval);
  //       }
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }, [
  //     Cookies.get("created_order_id"),
  //     Cookies.get("order_type"),
  //     isMobile,
  //     router,
  //     router.isReady,
  //   ]);

  return (
    <Box>
      <Box sx={header}>{t.orderSummary}</Box>
      {/* products price */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.productsPrice}</Box>
        <Box sx={text}>
          {receipt?.vehicle_price}
          {riyalImgBlack()}
        </Box>
      </Box>
      {/* deposit percentage */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>
          {t.percentageForDesposit} ({receipt?.deposit_percentage_applied} %)
        </Box>
        <Box sx={text}>
          {receipt?.deposit_amount} {riyalImgBlack()}
        </Box>
      </Box>
      {/* extra fees */}
      <Box className="d-flex justify-content-between mb-2">
        <Box sx={text}>{t.extraFees}</Box>
        <Box sx={text}>
          {receipt?.admin_extra_fees} {riyalImgBlack()}
        </Box>
      </Box>

      {/* vat  percentage */}
      <Box sx={vat}>{t.WillPayRest}</Box>

      {orderDetails?.status === STATUS?.priced && (
        <>
          {/* rest to pay */}
          <Box className="d-flex justify-content-between mb-2">
            <Box sx={{ ...text, ...boldText }}>{t.totalDepositNow}</Box>
            <Box sx={{ ...text, ...boldText }} id="amount-to-pay">
              {receipt?.deposit_amount?.toFixed(2)} {riyalImgBlack()}
            </Box>
          </Box>

          {/* button to pay the deposit */}
          <SharedBtn
            disabled={
              !selectedPaymentMethod?.id ||
              confirmPriceFetch ||
              redirectToPayfort
            }
            className="big-main-btn"
            customClass="w-100"
            text="payAndConfirm"
            comAfterText={
              confirmPriceFetch || redirectToPayfort ? (
                <CircularProgress color="inherit" size={15} />
              ) : null
            }
            onClick={() => {
              setRedirectToPayfort(true);

              if (selectedPaymentMethod?.key === PAYMENT_METHODS?.credit) {
                callConfirmPricing();
              } else if (
                selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay
              ) {
                callConfirmPricing();
                handleApplePayPayment();
              } else if (
                selectedPaymentMethod?.key === PAYMENT_METHODS?.tamara ||
                selectedPaymentMethod?.key === PAYMENT_METHODS?.tabby ||
                selectedPaymentMethod?.key === PAYMENT_METHODS?.mis
              ) {
                // if (
                //   (!orderDetails?.user?.name && !userDataProfile?.name) ||
                //   (!orderDetails?.user?.email && !userDataProfile?.phone)
                // ) {
                //   setOpenEditUserModal(true);
                //   return;
                // }
                callConfirmPricing();
              } else {
                callConfirmPricing();
              }
            }}
          />
        </>
      )}
    </Box>
  );
}

export default SelectedOfferReceipt;
