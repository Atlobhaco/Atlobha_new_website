import SharedBtn from "@/components/shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import { MARKETPLACE, PAYMENT_METHODS } from "@/constants/enums";
import {
  generateSignature,
  generateSignatureApplePay,
  payInitiateEngage,
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
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import PaymentFailChecker from "@/components/PaymentFailChecker";
import moment from "moment";
import AccordionWalletBalance from "@/components/shared/AccordionWalletBalance";
import { ORDERS, PAYMENT_FAILED } from "@/config/endPoints/endPoints";

const CheckoutSummary = forwardRef(
  (
    {
      selectAddress,
      setOpenAddMobile,
      promoCodeId,
      setAddPhoneForTamara,
      phoneAddedForTamara,
      setOpenEditUserModal,
      estimateRes,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      triggerTamaraPayment: handlePayWithTamara,
    }));
    const { voucherCode, allPromoCodeData } = useSelector(
      (state) => state.addSpareParts
    );
    const [fakeLoader, setFakeLoader] = useState(false);
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
    const merchanteRefrenceRef = useRef(
      `${user?.data?.user?.id}_${Math.floor(1000 + Math.random() * 9000)}`
    );
    const merchanteRefrence = merchanteRefrenceRef.current;
    const [loadPayRequest, setLoadPayRequest] = useState(false);
    const [payFortForm, setPayfortForm] = useState(false);
    const { userDataProfile } = useSelector((state) => state.quickSection);
    let tamaraCheckoutUrl = "";

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
      onSuccess: async (res) => {
        sessionStorage.setItem("created_order_id", res?.id);
        Cookies.set("created_order_id", res?.id, { expires: 1, path: "/" });
        Cookies.set("order_type", MARKETPLACE, { expires: 1, path: "/" });
        Cookies.set("payment_method", selectedPaymentMethod?.key, {
          expires: 1,
          path: "/",
        });

        if (selectedPaymentMethod?.key !== PAYMENT_METHODS?.cash) {
          payInitiateEngage({
            order_items: basket
              ?.filter((item) => item?.product?.is_active)
              ?.map((d) => ({
                id: d?.id,
                quantity: d?.quantity || 0,
                image: d?.product?.image?.url || "N/A",
                name: d?.product?.name || "N/A",
                price: d?.product?.price || "N/A",
              })),
            total_price: Number(calculateReceiptResFromMainPage?.total_price),
            number_of_products: Number(
              basket?.filter((item) => item?.product?.is_active)?.length
            ),
            checkout_url: router?.asPath || "N/A",
            expected_delivery_date: new Date(
              moment
                .unix(estimateRes.estimated_delivery_date_to)
                .format("YYYY-MM-DD HH:mm:ss")
                .replace(" ", "T") + "Z"
            ),
            shipping_address: selectAddress?.address?.toString() || "N/A",
            payment_method: selectedPaymentMethod?.Key || "N/A",
            promo_code: allPromoCodeData?.code?.toString() || "N/A",
            comment: "N/A",
          });
        }

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
          router.push(`/spareParts/confirmation/${res?.id}?type=marketplace`);
          setTimeout(() => {
            dispatch(fetchCartAsync());
          }, 1000);
          return;
        }
        if (
          selectedPaymentMethod?.key === PAYMENT_METHODS?.tamara &&
          +oldAmountToPay > 0
        ) {
          if (userDataProfile?.phone?.length) {
            handlePayWithTamara();
          } else {
            setAddPhoneForTamara();
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
            setAddPhoneForTamara();
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
            return;
          } else {
            setAddPhoneForTamara();
          }
          return;
        }

        router.push(`/spareParts/confirmation/${res?.id}?type=marketplace`);
        setTimeout(() => {
          dispatch(fetchCartAsync());
          toast.success(t.successPayOrder);
        }, 1000);
      },
      onError: (err) => {
        setFakeLoader(false);
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
        Cookies.get("payment_failed"),
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
        const paymentFailed = Cookies.get("payment_failed");
        const orderId = Cookies.get("created_order_id");
        const orderType = Cookies.get("order_type");

        if (paymentFailed === "failed" && orderId) {
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${orderType}${ORDERS}/${orderId}${PAYMENT_FAILED}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": "w123",
                Authorization: `Bearer ${localStorage?.getItem(
                  "access_token"
                )}`,
              },
            }
          )
            .then((res) => {
              if (!res.ok) throw new Error("Request failed");
              console.log(
                "Payment fail (success) status updated for order:",
                orderId
              );
            })
            .catch((err) => console.error(err))
            .finally(() => {
              Cookies.remove("created_order_id");
              Cookies.remove("payment_failed");
              Cookies.remove("order_type");
              Cookies.remove("payment_method");
              Cookies.remove("url_after_pay_failed");
              setFakeLoader(false);
              setLoadPayRequest(false);
              callCalculateReceipt();
            });
        }

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
      if (typeof window === "undefined") return;

      if (typeof window !== "undefined") {
        const form = window.document.createElement("form");
        setPayfortForm(form);
      }
    }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        const orderId = Cookies.get("created_order_id");
        const orderType = Cookies.get("order_type");
        const paymentMethod = Cookies.get("payment_method");
        if (orderId && orderType && paymentMethod) {
          setTimeout(() => {
            Cookies.set("payment_failed", "failed", { expires: 1, path: "/" });
          }, 1000);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [
      Cookies.get("created_order_id"),
      Cookies.get("order_type"),
      isMobile,
      router,
      calculateReceiptResFromMainPage,
      router.isReady,
    ]);

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
          setLoadPayRequest(false);
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
            setLoadPayRequest(false);
            console.log(error in res, result.error);
            throw new Error(result.error || "Payment failed");
          }

          session.completePayment(ApplePaySession.STATUS_SUCCESS);
          router.push(`/spareParts/confirmation/null?type=marketplace`);
        } catch (error) {
          setLoadPayRequest(false);
          alert(`Payment failed: ${error.message}`);
          session.completePayment(ApplePaySession.STATUS_FAILURE);
        }
      };
      session.oncancel = (event) => {
        alert("payment cancelled by user");
        setLoadPayRequest(false);
        setFakeLoader(false);
        console.log("Apple Pay cancelled:", event);
      };
      session.begin();
    };

    const handleWebengageCheckoutClicked = () => {
      const total =
        basket
          ?.filter((item) => item?.product?.is_active)
          ?.map((d) => ({
            total_price: d?.quantity * d?.product?.price,
          }))
          ?.reduce(
            (accumulator, current) => accumulator + current.total_price,
            0
          )
          ?.toFixed(2) || 0;

      const itemsMaping = basket
        ?.filter((item) => item?.product?.is_active)
        ?.map((bas) => ({
          Id: bas?.product?.id || "",
          Title: bas?.product?.name || "",
          Price: bas?.product?.price || "",
          Quantity: bas?.quantity || "",
          Image: bas?.product?.image || "",
        }));
      window.webengage.onReady(() => {
        webengage.track("CART_CHECKOUT_CLICKED", {
          total_price: +total,
          number_of_products:
            basket?.filter((item) => item?.product?.is_active)?.length || 0,
          line_items: itemsMaping || [],
        });
      });
    };

    /* -------------------------------------------------------------------------- */
    /*                            tamara payment logic                            */
    /* -------------------------------------------------------------------------- */
    const redirectToTamara = (url) => {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_self";
      link.rel = "noopener noreferrer";

      // Simulate a user gesture
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

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
          description: `marketplace-order-for-user-with-id=${userDataProfile?.id}`,
          order_reference_id: merchanteRefrence,
          totalAmount: calculateReceiptResFromMainPage?.amount_to_pay,
          successUrl: `${
            process.env.NEXT_PUBLIC_WEBSITE_URL
          }/spareParts/confirmation/${null}?type=marketplace`,
          cancelUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/payment/failed`,
          failureUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/payment/failed`,
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
          items: basket?.map((prod) => ({
            reference_id: prod?.id,
            sku:
              prod?.product?.ref_num || prod?.product?.sku || prod?.product?.id,
            name: prod?.product?.name,
            quantity: prod?.quantity,
            type: "Digital",
            total_amount: {
              amount: prod?.product?.price,
              currency: "SAR",
            },
          })),
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
              items: basket?.map((prod) => ({
                title: prod?.product?.name,
                quantity: prod?.quantity,
                unit_price: +prod?.product?.price?.toFixed(2),
                category: prod?.product?.marketplace_category?.name,
              })),
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
            cancel: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/payment/failed`,
            failure: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/payment/failed`,
            success: `${
              process.env.NEXT_PUBLIC_WEBSITE_URL
            }/spareParts/confirmation/${null}?type=marketplace`,
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
            items: basket?.map((prod) => ({
              nameArabic: prod?.product?.name,
              nameEnglish: prod?.product?.name,
              quantity: prod?.quantity,
              unitPrice: prod?.product?.price?.toFixed(2),
            })),
          },
          callbackUri: `${
            process.env.NEXT_PUBLIC_WEBSITE_URL
          }/spareParts/confirmation/${null}?type=marketplace`,
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
        {/* <PaymentFailChecker /> */}
        <Box sx={header}>{t.orderSummary}</Box>
        {/* products price */}
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={text}>{t.priceWithoutVat}</Box>
          <Box sx={text}>
            {calculateReceiptResFromMainPage?.subtotal} {riyalImgBlack()}
          </Box>
        </Box>
        {/* discount */}
        {(calculateReceiptResFromMainPage?.discount ?? receipt?.discount) >
          0 && (
          <Box className="d-flex justify-content-between mb-2">
            <Box sx={{ ...text, color: "#EB3C24" }}>{t.codeDiscount}</Box>
            <Box sx={{ ...text, color: "#EB3C24" }}>
              {(calculateReceiptResFromMainPage?.discount ??
                receipt?.discount) === receipt?.discount
                ? receipt?.discount?.toFixed(2)
                : calculateReceiptResFromMainPage?.discount?.toFixed(2)}{" "}
              {riyalImgRed()}
            </Box>
          </Box>
        )}

        {/* offers discount */}
        {/* {(calculateReceiptResFromMainPage?.offers_discount ??
          receipt?.offers_discount) > 0 && (
          <Box className="d-flex justify-content-between mb-2">
            <Box sx={{ ...text, color: "#EB3C24" }}>{t.additionaldiscount}</Box>
            <Box sx={{ ...text, color: "#EB3C24" }}>
              {(calculateReceiptResFromMainPage?.offers_discount ??
                receipt?.offers_discount) === receipt?.offers_discount
                ? receipt?.offers_discount?.toFixed(2)
                : calculateReceiptResFromMainPage?.offers_discount?.toFixed(
                    2
                  )}{" "}
              {riyalImgRed()}
            </Box>
          </Box>
        )} */}

        {/* delivery fees */}
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={text}>{t.deliveryFees}</Box>
          <Box sx={text}>
            {(calculateReceiptResFromMainPage?.delivery_fees_with_tax ??
              receipt?.delivery_fees_with_tax) ===
            receipt?.delivery_fees_with_tax
              ? receipt?.delivery_fees_with_tax
              : calculateReceiptResFromMainPage?.delivery_fees_with_tax}{" "}
            {riyalImgBlack()}
          </Box>
        </Box>

        {/* pay from wallet balance */}
        <AccordionWalletBalance
          title={t.payFromBlanace}
          riyalImg={riyalImgBlack}
          textStyle={text}
          receipt={receipt}
          receiptRes={calculateReceiptResFromMainPage}
        />

        {/* offers discount */}
        {calculateReceiptResFromMainPage?.offers_discount > 0 && (
          <Box className="d-flex justify-content-between mb-2">
            <Box sx={{ ...text, color: "#EB3C24" }}>{t.offerDiscount}</Box>
            <Box sx={{ ...text, color: "#EB3C24" }}>
              {(calculateReceiptResFromMainPage?.offers_discount ??
                receipt?.offers_discount) === receipt?.offers_discount
                ? receipt?.offers_discount?.toFixed(2)
                : calculateReceiptResFromMainPage?.offers_discount?.toFixed(
                    2
                  )}{" "}
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
                  +calculateReceiptResFromMainPage?.subtotal_tax +
                  +calculateReceiptResFromMainPage?.subtotal +
                  +calculateReceiptResFromMainPage?.delivery_fees_with_tax
                )?.toFixed(2)
              : (calculateReceiptResFromMainPage?.total_price ??
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
          ٪ {t.vatPercentage} (
          {calculateReceiptResFromMainPage?.subtotal_tax || 0} {riyalImgBlack()}
          )
        </Box>
        <Divider sx={{ background: "#EAECF0", mb: 2 }} />
        {/* rest to pay */}
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={{ ...text, ...boldText }}>{t.remainingtotal}</Box>
          <Box sx={{ ...text, ...boldText }} id="amount-to-pay">
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
            loadPayRequest ||
            !selectedPaymentMethod?.id ||
            confirmPriceFetch ||
            //   fetchReceipt ||
            fakeLoader
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
            confirmPriceFetch || fakeLoader || loadPayRequest ? (
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
            handleWebengageCheckoutClicked();
            setFakeLoader(true);

            const amount = +calculateReceiptResFromMainPage?.amount_to_pay;
            const method = selectedPaymentMethod?.key;

            if (amount === 0) return callConfirmPricing();

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
                setFakeLoader(false);
                setLoadPayRequest(false);
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
export default CheckoutSummary;
