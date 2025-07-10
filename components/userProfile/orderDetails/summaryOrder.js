import SharedBtn from "@/components/shared/SharedBtn";
import {
  CALCULATE_RECEIPT,
  CONFIRM_PRICING,
  ORDERS,
  RE_OPEN,
  SPARE_PARTS,
  USERS,
} from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import {
  generateSignature,
  generateSignatureApplePay,
  riyalImgBlack,
  riyalImgRed,
} from "@/constants/helpers";
import { ORDERSENUM, STATUS, PAYMENT_METHODS } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress, Divider } from "@mui/material";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import EditUserInfoDialog from "@/components/editUserInfoDialog";
import { setUserData } from "@/redux/reducers/quickSectionsProfile";

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
  const dispatch = useDispatch();
  const merchanteRefrence = `${user?.data?.user?.id}_${idOrder}`;
  const hasRun = useRef(false);
  const [redirectToPayfort, setRedirectToPayfort] = useState(false);
  const { userDataProfile } = useSelector((state) => state.quickSection);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);

  useCustomQuery({
    name: ["getUserInfoForOrder", openEditUserModal],
    url: `${USERS}/${user?.data?.user?.id}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: user?.data?.user?.id ? true : false,
    onSuccess: (res) => {
      dispatch(
        setUserData({
          data: res,
        })
      );
    },
  });

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
      if (
        selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay &&
        +calculateReceiptResFromMainPage?.amount_to_pay > 0
      ) {
        return;
      }
      if (
        selectedPaymentMethod?.key === PAYMENT_METHODS?.tamara &&
        +calculateReceiptResFromMainPage?.amount_to_pay > 0
      ) {
        handlePayWithTamara();
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
      if (
        +res?.amount_to_pay !== +calculateReceiptResFromMainPage?.amount_to_pay
      ) {
        toast.error(`${t.remainingtotal} ${t.beChanged}`);
        setTimeout(() => {
          callSingleOrder();
        }, 500);
        return;
      }
      if (selectedPaymentMethod?.key !== PAYMENT_METHODS?.applePay) {
        if (+res?.amount_to_pay > 0) {
          callConfirmPricing();
        } else {
          callConfirmPricing();
        }
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
      supportedNetworks: ["mada", "visa", "masterCard", "amex"],
      merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"],
      total: {
        label: "Atlobha Store",
        amount: calculateReceipt?.amount_to_pay, // Adjust dynamically if needed
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
          amount: (calculateReceipt?.amount_to_pay * 100)?.toFixed(0),
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
        router.push(`/spareParts/confirmation/${idOrder}`);
      } catch (error) {
        alert(`Payment failed: ${error.message}`);
        session.completePayment(ApplePaySession.STATUS_FAILURE);
      }
    };

    session.begin();
  };

  /* -------------------------------------------------------------------------- */
  /*                            tamara payment logic                            */
  /* -------------------------------------------------------------------------- */
  const handlePayWithTamara = async () => {
    const sourceItems = orderDetails?.parts?.length
      ? orderDetails.parts
      : orderDetails?.products || [];
    // setLoadPayRequest(true);
    const res = await fetch("/api/tamara/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipping_address: {
          city: orderDetails?.address?.city?.name,
          country_code: orderDetails?.address?.city?.country?.code,
          first_name: userDataProfile?.name,
          last_name: "",
          line1: orderDetails?.address?.address,
        },
        description: `spare-part-order-for-user-with-id=${orderDetails?.user?.id}`,
        order_reference_id: merchanteRefrence,
        totalAmount: orderDetails?.receipt?.amount_to_pay,
        successUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/spareParts/confirmation/${idOrder}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
        failureUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
        customer: {
          first_name: userDataProfile?.name,
          last_name: "",
          phone_number: userDataProfile?.phone?.replace(/^(\+?966)/, ""),
          email:
            userDataProfile?.email || `${userDataProfile?.phone}@atlobha.com`,
        },
        items: sourceItems.map((prod) => ({
          reference_id: prod?.id,
          sku: prod?.ref_num || prod?.sku || prod?.id,
          name: prod?.name,
          quantity: prod?.quantity,
          type: "Digital",
          total_amount: {
            amount: prod?.price,
            currency: "SAR",
          },
        })),
      }),
    });

    const data = await res.json();

    if (data.checkout_url) {
      window.location.assign(data.checkout_url);
    } else {
      alert("Failed to create Tamara order.");
      console.error(data);
    }
  };

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
        <Box sx={text}>{t.priceWithoutVat}</Box>
        <Box sx={text}>
          {orderDetails?.parts?.length
            ? orderDetails?.parts
                ?.reduce(
                  (accumulator, current) => accumulator + current.total_price,
                  0
                )
                ?.toFixed(2)
            : orderDetails?.products
                ?.reduce(
                  (accumulator, current) =>
                    accumulator + current.price * current?.quantity,
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
        {((calculateReceiptResFromMainPage?.tax_percentage ??
          receipt?.tax_percentage) === receipt?.tax_percentage
          ? receipt?.tax_percentage
          : calculateReceiptResFromMainPage?.tax_percentage) * 100}
        ٪ {t.vatPercentage} ({receipt?.tax} {riyalImgBlack()})
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
      {/* logic for incomplete */}
      {orderDetails?.status === STATUS?.incomplete && (
        <>
          {/* <Box className="d-flex justify-content-between mb-2">
            <Box sx={boldText}>{t.total}</Box>
            <Box sx={boldText}>
              {(calculateReceiptResFromMainPage?.total_price ??
                receipt?.total_price) === receipt?.total_price
                ? receipt?.total_price
                : calculateReceiptResFromMainPage?.total_price}{" "}
              {riyalImgBlack()}
            </Box>
          </Box> */}
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
          {/* <Box className="d-flex justify-content-between mb-2">
            <Box sx={boldText}>{t.total}</Box>
            <Box sx={boldText}>
              {(calculateReceiptResFromMainPage?.total_price ??
                receipt?.total_price) === receipt?.total_price
                ? receipt?.total_price
                : calculateReceiptResFromMainPage?.total_price}{" "}
              {riyalImgBlack()}
            </Box>
          </Box> */}
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
          {/* <Box className="d-flex justify-content-between mb-2">
            <Box sx={boldText}>{t.total}</Box>
            <Box sx={boldText}>
              {(calculateReceiptResFromMainPage?.total_price ??
                receipt?.total_price) === receipt?.total_price
                ? receipt?.total_price
                : calculateReceiptResFromMainPage?.total_price}{" "}
              {riyalImgBlack()}
            </Box>
          </Box> */}
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
                callConfirmPricing();
                handleApplePayPayment();
              } else if (
                selectedPaymentMethod?.key === PAYMENT_METHODS?.tamara
              ) {
                if (
                  (!orderDetails?.user?.name && !userDataProfile?.name) ||
                  (!orderDetails?.user?.email && !userDataProfile?.phone)
                ) {
                  setOpenEditUserModal(true);
                  return;
                }
                callCalculateReceipt();
              } else {
                callCalculateReceipt();
              }
            }}
          />
        </>
      )}

      {/* modal to edit user info data */}
      <EditUserInfoDialog
        openEditUserModal={openEditUserModal}
        setOpenEditUserModal={setOpenEditUserModal}
      />
    </Box>
  );
}

export default SummaryOrder;
