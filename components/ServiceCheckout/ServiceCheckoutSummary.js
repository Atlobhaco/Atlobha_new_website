import {
  MAINTENANCE_RESERVATIONS,
  PORTABLE_MAINTENANCE_RESERVATIONS,
  RECEIPT_PREVIEW,
  USERS,
} from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import {
  MARKETPLACE,
  PAYMENT_METHODS,
  PORTABLE,
  SERVICES,
} from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress, Divider } from "@mui/material";
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { useRouter } from "next/router";
import { setSelectedPayment } from "@/redux/reducers/selectedPaymentMethod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import SharedBtn from "../shared/SharedBtn";
import {
  generateSignature,
  generateSignatureApplePay,
  riyalImgBlack,
  riyalImgRed,
  servicePrice,
} from "@/constants/helpers";
import {
  setPromoCodeAllData,
  setPromoCodeForSpareParts,
} from "@/redux/reducers/addSparePartsReducer";
import Cookies from "js-cookie";

const ServiceCheckoutSummary = forwardRef(
  (
    {
      selectAddress,
      setOpenAddMobile,
      promoCodeId,
      phoneAddedForTamara,
      setOpenEditUserModal,
      userCar,
      checkoutServiceDetails,
      carAvailable,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      triggerTamaraPayment: handlePayWithTamara,
    }));
    const router = useRouter();
    const { voucherCode, allPromoCodeData } = useSelector(
      (state) => state.addSpareParts
    );
    const { selectedPaymentMethod } = useSelector(
      (state) => state.selectedPaymentMethod
    );
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { isMobile } = useScreenSize();
    const { t, locale } = useLocalization();
    const { userDataProfile } = useSelector((state) => state.quickSection);
    const { selectedCar, defaultCar } = useSelector(
      (state) => state.selectedCar
    );
    const merchanteRefrenceRef = useRef(
      `${user?.data?.user?.id}_${Math.floor(1000 + Math.random() * 9000)}`
    );
    const merchanteRefrence = merchanteRefrenceRef.current;

    const [payFortForm, setPayfortForm] = useState(false);
    const [oldAmountToPay, setOldAmountToPay] = useState(false);
    const [loadPayRequest, setLoadPayRequest] = useState(false);
    const [fakeLoader, setFakeLoader] = useState(false);

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
      name: "confirmOrderService",
      url: `${
        checkoutServiceDetails?.type === PORTABLE
          ? PORTABLE_MAINTENANCE_RESERVATIONS
          : `${USERS}/${user?.data?.user?.id}${MAINTENANCE_RESERVATIONS}`
      }`,
      refetchOnWindowFocus: false,
      select: (res) => res?.data?.data,
      enabled: false,
      method: "post",
      body:
        checkoutServiceDetails?.type === PORTABLE
          ? {
              payment_method: selectedPaymentMethod?.key || "CASH",
              service_id: checkoutServiceDetails?.serviceDetails?.id,
              stc_payment_confirm: "e30=",
              slot_id: checkoutServiceDetails?.serviceTimeFixedOrPortable?.id,
              address_id: selectAddress?.id,
              notes: null,
              ref_num: merchanteRefrence,
              payment_reference: merchanteRefrence,
              vehicle_id: userCar?.id,
              service_center_id: checkoutServiceDetails?.selectedStore?.id,
              promo_code_id: allPromoCodeData?.id || null,
            }
          : {
              promo_code_id: allPromoCodeData?.id || null,
              payment_method: selectedPaymentMethod?.key || "CASH",
              service_id: checkoutServiceDetails?.serviceDetails?.id,
              service_center_id: checkoutServiceDetails?.selectedStore?.id,
              address_id: selectAddress?.id,
              vehicle_id: userCar?.id,
              slot_id:
                checkoutServiceDetails?.serviceTimeFixedOrPortable?.id ||
                checkoutServiceDetails?.selectedStore?.next_available_slot?.id,
              stc_payment_confirm: "e30=",
              payment_reference: merchanteRefrence,
            },
      onSuccess: async (res) => {
        sessionStorage.setItem("created_order_id", res?.id);
        sessionStorage.setItem("service_type", checkoutServiceDetails?.type);
        if (
          selectedPaymentMethod?.key === PAYMENT_METHODS?.credit &&
          +oldAmountToPay > 0
        ) {
          payFortForm.submit();
          setTimeout(() => {
            setFakeLoader(false);
          }, 12000);
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
          router.push(
            `/spareParts/confirmation/${res?.id}?type=${SERVICES}&secType=${SERVICES}&serviceType=${checkoutServiceDetails?.type}`
          );
          return;
        }
        if (
          selectedPaymentMethod?.key === PAYMENT_METHODS?.tamara &&
          +oldAmountToPay > 0
        ) {
          if (userDataProfile?.phone?.length) {
            handlePayWithTamara();
          } else {
            setOpenAddMobile(true);
          }
          return;
        }
        if (
          selectedPaymentMethod?.key === PAYMENT_METHODS?.tabby &&
          +oldAmountToPay > 0
        ) {
          if (userDataProfile?.phone?.length) {
            handlePayWithTabby();
          } else {
            setOpenAddMobile(true);
          }
          return;
        }

        if (
          selectedPaymentMethod?.key === PAYMENT_METHODS?.mis &&
          +oldAmountToPay > 0
        ) {
          if (userDataProfile?.phone?.length) {
            handleMisPay();
            setTimeout(() => {
              setFakeLoader(false);
            }, 12000);
          } else {
            setAddPhoneForTamara();
          }
          return;
        }

        router.push(
          `/spareParts/confirmation/${res?.id}?type=${SERVICES}&secType=${SERVICES}&serviceType=${checkoutServiceDetails?.type}`
        );
        setTimeout(() => {
          toast.success(t.successPayOrder);
        }, 1000);
      },
      onError: (err) => {
        setFakeLoader(false);
        if (err?.response?.data?.error?.includes("phone")) {
          setOpenAddMobile(true);
        }
        toast.error(
          err?.response?.data?.first_error ||
            err?.response?.data?.message ||
            t.someThingWrong
        );
      },
    });

    const {
      data: calculateReceiptResFromMainPage,
      isFetching: fetchReceipt,
      refetch: callCalculateReceipt,
    } = useCustomQuery({
      name: [
        "calculateReceiptForService",
        promoCodeId,
        voucherCode,
        selectAddress,
        allPromoCodeData,
        checkoutServiceDetails,
        userCar,
        user,
      ],
      url: `${
        checkoutServiceDetails?.type === PORTABLE
          ? PORTABLE_MAINTENANCE_RESERVATIONS
          : `${USERS}/${user?.data?.user?.id}${MAINTENANCE_RESERVATIONS}`
      }${RECEIPT_PREVIEW}`,
      method: "post",
      refetchOnWindowFocus: true,
      enabled: !!(
        selectAddress?.id &&
        checkoutServiceDetails &&
        userCar?.id &&
        user?.data
      ),
      body:
        checkoutServiceDetails?.type === PORTABLE
          ? {
              address_id: selectAddress?.id,
              service_id: checkoutServiceDetails?.serviceDetails?.id,
              vehicle_id: userCar?.id,
              promo_code_id: allPromoCodeData?.id || null,
            }
          : {
              payment_method: selectedPaymentMethod?.key || "CASH",
              service_id: checkoutServiceDetails?.serviceDetails?.id,
              service_center_id: checkoutServiceDetails?.selectedStore?.id,
              vehicle_id: userCar?.id,
              slot_id:
                checkoutServiceDetails?.serviceTimeFixedOrPortable?.id ||
                checkoutServiceDetails?.selectedStore?.next_available_slot?.id,
              promo_code_id: allPromoCodeData?.id || null,
            },
      select: (res) => res?.data?.data,
      onSuccess: (res) => {
        if (+res?.amount_to_pay === 0)
          dispatch(setSelectedPayment({ data: { id: 1, key: "CASH" } }));
        setOldAmountToPay(res?.amount_to_pay);
      },
      onError: (err) => {
        // redirect to service details if browser back from payment gateway
        if (
          err?.response?.data?.message?.includes("ServiceCenterSlot_not_found")
        ) {
          router?.push(
            `/service/${checkoutServiceDetails?.serviceDetails?.id}/?portableService=${router?.query?.portableService}&secType=${router?.query?.secType}&type=${router?.query?.type}&servicePayFailed=true`
          );
          return;
        }
        // remove promo code in fixed service (free delivery)
        // when come from another checkout saved before
        if (err?.response?.data?.first_error?.includes("promo")) {
          toast.error(t.canNotAddPromoForFixed);
          dispatch(setPromoCodeForSpareParts({ data: "" }));
          dispatch(setPromoCodeAllData({ data: null }));
        } else {
          toast.error(
            err?.response?.data?.first_error ||
              err?.response?.data?.message ||
              t.someThingWrong
          );
        }
      },
    });

    const requestData = {
      command: "PURCHASE",
      access_code: process.env.NEXT_PUBLIC_PAYFORT_ACCESS,
      merchant_identifier: process.env.NEXT_PUBLIC_PAYFORT_IDENTIFIER,
      language: locale,
      currency: "SAR",
      customer_email: "userTest@example.com",
      return_url: `${process.env.NEXT_PUBLIC_PAYFORT_RETURN_URL_SERVICE}?order_id=${confirmPriceRes?.id}&service=true&serviceType=${checkoutServiceDetails?.type}&idService=${checkoutServiceDetails?.serviceDetails?.id}&type=${router?.query?.type}&portableService=${router?.query?.portableService}&secType=${router?.query?.secType}`,
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
      if (typeof window === "undefined") return;

      if (typeof window !== "undefined") {
        const form = window.document.createElement("form");
        setPayfortForm(form);
      }
    }, []);

    useEffect(() => {
      if (typeof window === "undefined") return;

      if (
        typeof window !== "undefined" &&
        payFortForm &&
        +calculateReceiptResFromMainPage?.amount_to_pay > 0
      ) {
        payFortForm.method = "POST";
        payFortForm.action = process.env.NEXT_PUBLIC_PAYFORT_URL;

        Object.keys(requestData).forEach((key) => {
          const input = window.document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = requestData[key];
          payFortForm.appendChild(input);
        });

        window.document.body.appendChild(payFortForm);
      }
    }, [payFortForm, calculateReceiptResFromMainPage?.amount_to_pay]);

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
        merchantCapabilities: [
          "supports3DS",
          "supportsCredit",
          "supportsDebit",
        ],
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
                Authorization: `Bearer ${localStorage?.getItem(
                  "access_token"
                )}`, // Include if needed
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

          if (!response.ok || result.error) {
            console.log(error in res, result.error);
            throw new Error(result.error || "Payment failed");
          }

          session.completePayment(ApplePaySession.STATUS_SUCCESS);
          router.push(
            `/spareParts/confirmation/null?type=${SERVICES}&secType=${SERVICES}&serviceType=${checkoutServiceDetails?.type}`
          );
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
      setLoadPayRequest(true);

      const res = await fetch("/api/tamara/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping_address: {
            city: selectAddress?.city?.name,
            country_code: selectAddress?.city?.country?.code,
            first_name: userDataProfile?.name,
            last_name: "",
            line1: selectAddress?.address,
          },
          description: `service-order-for-user-with-id=${userDataProfile?.id}`,
          order_reference_id: merchanteRefrence,
          totalAmount: calculateReceiptResFromMainPage?.amount_to_pay,
          successUrl: `${
            process.env.NEXT_PUBLIC_WEBSITE_URL
          }/spareParts/confirmation/${null}?type=${SERVICES}&secType=${SERVICES}&serviceType=${
            checkoutServiceDetails?.type
          }`,
          cancelUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/service/${checkoutServiceDetails?.serviceDetails?.id}/?portableService=${router?.query?.portableService}&secType=${router?.query?.secType}&type=${router?.query?.type}&servicePayFailed=true`,
          failureUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/service/${checkoutServiceDetails?.serviceDetails?.id}/?portableService=${router?.query?.portableService}&secType=${router?.query?.secType}&type=${router?.query?.type}&servicePayFailed=true`,
          customer: {
            first_name: userDataProfile?.name,
            last_name: "",
            phone_number:
              phoneAddedForTamara ||
              userDataProfile?.phone?.replace(/^(\+?966)/, ""),
            email:
              userDataProfile?.email ||
              userDataProfile?.secondary_email ||
              `${userDataProfile?.phone}@atlobha.com`,
          },
          items: [
            {
              reference_id: checkoutServiceDetails?.serviceDetails?.id,
              sku: checkoutServiceDetails?.serviceDetails?.id,
              name: checkoutServiceDetails?.serviceDetails?.name,
              quantity: 1,
              type: "Digital",
              total_amount: {
                amount: servicePrice({
                  service: checkoutServiceDetails?.serviceDetails,
                  userCar: selectedCar?.id ? selectedCar : defaultCar,
                }),
                currency: "SAR",
              },
            },
          ],
        }),
      });

      const data = await res.json();
      setLoadPayRequest(false);

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
      const buyerInfo = {
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
        city: selectAddress?.city?.name,
        address: selectAddress?.address,
        zip: "12345",
      };

      const response = await fetch("/api/tabby/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment: {
            amount: calculateReceiptResFromMainPage?.amount_to_pay,
            currency: "SAR",
            buyer: realBuyer,
            shipping_address: shippingDetails,
            order: {
              reference_id: merchanteRefrence,
              items: [
                {
                  title: checkoutServiceDetails?.serviceDetails?.name,
                  quantity: 1,
                  unit_price: servicePrice({
                    service: checkoutServiceDetails?.serviceDetails,
                    userCar: selectedCar?.id ? selectedCar : defaultCar,
                  }),
                  category:
                    checkoutServiceDetails?.serviceDetails?.category?.name,
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
                amount: calculateReceiptResFromMainPage?.amount_to_pay,
                status: "new",
                buyer: realBuyer,
                shipping_address: shippingDetails,
              },
            ],
          },
          lang: locale,
          merchant_code: "Atolbha",
          merchant_urls: {
            cancel: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/service/${checkoutServiceDetails?.serviceDetails?.id}/?portableService=${router?.query?.portableService}&secType=${router?.query?.secType}&type=${router?.query?.type}&servicePayFailed=true`,
            failure: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/service/${checkoutServiceDetails?.serviceDetails?.id}/?portableService=${router?.query?.portableService}&secType=${router?.query?.secType}&type=${router?.query?.type}&servicePayFailed=true`,
            success: `${
              process.env.NEXT_PUBLIC_WEBSITE_URL
            }/spareParts/confirmation/${null}?type=${SERVICES}&secType=${SERVICES}&serviceType=${
              checkoutServiceDetails?.type
            }`,
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
      Cookies.set(
        "url_after_pay_failed",
        `/service/${checkoutServiceDetails?.serviceDetails?.id}/?portableService=${router?.query?.portableService}&secType=${router?.query?.secType}&type=${router?.query?.type}&servicePayFailed=true`,
        {
          expires: 1,
          path: "/",
        }
      );

      const res = await fetch("/api/mis/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          orderId: merchanteRefrence,
          totalPrice: calculateReceiptResFromMainPage?.amount_to_pay,
          shippingAmount: "0",
          vat: "0",
          purchaseAmount: calculateReceiptResFromMainPage?.amount_to_pay,
          purchaseCurrency: "SAR",
          lang: locale,
          version: "v1.1",
          customerDetails: {
            mobileNumber: userDataProfile?.phone,
          },
          orderDetails: {
            items: [
              {
                nameArabic: checkoutServiceDetails?.serviceDetails?.name,
                nameEnglish: checkoutServiceDetails?.serviceDetails?.name,
                quantity: 1,
                unitPrice: servicePrice({
                  service: checkoutServiceDetails?.serviceDetails,
                  userCar: selectedCar?.id ? selectedCar : defaultCar,
                }),
              },
            ],
          },
          callbackUri: `${
            process.env.NEXT_PUBLIC_WEBSITE_URL
          }/spareParts/confirmation/${null}?type=${SERVICES}&secType=${SERVICES}&serviceType=${
            checkoutServiceDetails?.type
          }`,
        }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url; // redirect to MIS Pay
      } else {
        alert("Payment initiation failed");
      }
    };
    return (
      <Box sx={{ pt: 1 }}>
        <Box sx={header}>{t.orderSummary}</Box>
        {/* products price */}
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={text}>{t.priceWithoutVat}</Box>
          <Box sx={text}>
            {calculateReceiptResFromMainPage?.subtotal} {riyalImgBlack()}
          </Box>
        </Box>
        {/* discount */}
        {calculateReceiptResFromMainPage?.discount > 0 && (
          <Box className="d-flex justify-content-between mb-2">
            <Box sx={{ ...text, color: "#EB3C24" }}>{t.codeDiscount}</Box>
            <Box sx={{ ...text, color: "#EB3C24" }}>
              {calculateReceiptResFromMainPage?.discount?.toFixed(2)}{" "}
              {riyalImgRed()}
            </Box>
          </Box>
        )}
        {/* delivery fees */}
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={text}>
            {checkoutServiceDetails?.type === PORTABLE
              ? t.serviceFees
              : t.deliveryFees}
          </Box>
          <Box sx={text}>
            {calculateReceiptResFromMainPage?.delivery_fees} {riyalImgBlack()}
          </Box>
        </Box>
        {/* pay from wallet balance */}
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={text}>{t.payFromBlanace}</Box>
          <Box sx={text}>
            {calculateReceiptResFromMainPage?.wallet_payment_value}{" "}
            {riyalImgBlack()}
          </Box>
        </Box>
        {/* offers discount */}
        {calculateReceiptResFromMainPage?.offers_discount > 0 && (
          <Box className="d-flex justify-content-between mb-2">
            <Box sx={{ ...text, color: "#EB3C24" }}>{t.additionaldiscount}</Box>
            <Box sx={{ ...text, color: "#EB3C24" }}>
              {calculateReceiptResFromMainPage?.offers_discount?.toFixed(2)}{" "}
              {riyalImgRed()}
            </Box>
          </Box>
        )}

        {/* total pay */}
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={text}>{t.totalSum}</Box>
          <Box sx={text}>
            {+calculateReceiptResFromMainPage?.discount > 0
              ? (
                  +calculateReceiptResFromMainPage?.tax +
                  +calculateReceiptResFromMainPage?.subtotal +
                  +calculateReceiptResFromMainPage?.delivery_fees
                )?.toFixed(2)
              : calculateReceiptResFromMainPage?.total_price}{" "}
            {riyalImgBlack()}
          </Box>
        </Box>
        {/* vat  percentage */}
        <Box sx={vat}>
          {t.include}{" "}
          {(calculateReceiptResFromMainPage?.tax_percentage || 0) * 100}٪{" "}
          {t.vatPercentage} ({calculateReceiptResFromMainPage?.tax || 0}{" "}
          {riyalImgBlack()})
        </Box>

        <Divider sx={{ background: "#EAECF0", mb: 2 }} />
        {/* rest to pay */}
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={{ ...text, ...boldText }}>{t.remainingtotal}</Box>
          <Box sx={{ ...text, ...boldText }} id="amount-to-pay">
            {calculateReceiptResFromMainPage?.amount_to_pay?.toFixed(2)}{" "}
            {riyalImgBlack()}
          </Box>
        </Box>
        <SharedBtn
          disabled={
            loadPayRequest ||
            !selectedPaymentMethod?.id ||
            confirmPriceFetch ||
            fakeLoader ||
            !carAvailable ||
            !+calculateReceiptResFromMainPage?.amount_to_pay < 0
          }
          className={`${
            selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay
              ? "black-btn"
              : "big-main-btn"
          }`}
          customClass={`${isMobile && "data-over-foot-nav"} w-100`}
          text={
            selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay
              ? ""
              : "payAndConfirm"
          }
          comAfterText={
            fakeLoader || loadPayRequest || confirmPriceFetch ? (
              <CircularProgress color="inherit" size={15} />
            ) : selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay ? (
              <Image
                loading="lazy"
                src="/icons/payments/apple-pay-white.svg"
                width={61}
                height={25}
                alt="empty-basket"
              />
            ) : null
          }
          onClick={() => {
            const amount = +calculateReceiptResFromMainPage?.amount_to_pay;
            const method = selectedPaymentMethod?.key;
            setFakeLoader(true);

            if (amount === 0) return callConfirmPricing();
            if (!userDataProfile?.phone) return setOpenAddMobile(true);

            if (method === PAYMENT_METHODS.credit) {
              setFakeLoader(true);
            } else if (
              method === PAYMENT_METHODS.applePay &&
              userDataProfile?.phone?.length
            ) {
              handleApplePayPayment();
            } else if (
              method === PAYMENT_METHODS.tamara ||
              method === PAYMENT_METHODS.tabby ||
              method === PAYMENT_METHODS.mis
            ) {
              if (method === PAYMENT_METHODS.mis) {
                setFakeLoader(true);
              }
              if (!userDataProfile?.phone) {
                callConfirmPricing();
                return;
              }
              if (
                ((!userDataProfile?.email &&
                  !userDataProfile?.secondary_email) ||
                  !userDataProfile?.name) &&
                method !== PAYMENT_METHODS.mis
              ) {
                setOpenEditUserModal(true);
                return;
              }
            }

            callConfirmPricing();
          }}
        />
      </Box>
    );
  }
);

export default ServiceCheckoutSummary;
