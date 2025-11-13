import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import AddAvailablePayMethods from "../orderDetails/addAvailablePayMethods";
import useLocalization from "@/config/hooks/useLocalization";
import { Box, CircularProgress } from "@mui/material";
import {
  generateSignature,
  generateSignatureApplePay,
  riyalImgBlack,
} from "@/constants/helpers";
import SharedBtn from "@/components/shared/SharedBtn";
import { PAYMENT_METHODS } from "@/constants/enums";
import useCustomQuery from "@/config/network/Apiconfig";
import { useRouter } from "next/router";
import { useAuth } from "@/config/providers/AuthProvider";
import DialogCentered from "@/components/DialogCentered";
import MigrationPhoneLogic from "@/components/spareParts/migrationPhoneLogic";
import EditUserInfoDialog from "@/components/editUserInfoDialog";
import { USERS, VOUCHER_PURCHASE } from "@/config/endPoints/endPoints";
import { setUserData } from "@/redux/reducers/quickSectionsProfile";
import { usersAddressesQuery } from "@/config/network/Shared/GetDataHelper";
import {
  setAllAddresses,
  setDefaultAddress,
} from "@/redux/reducers/selectedAddressReducer";
import { toast } from "react-toastify";
import EnterPhoneNumber from "@/components/EnterPhoneNumber";

export default function BuyGift({
  selectedGift,
  selectedPrice,
  userDataForBuying,
}) {
  const phoneRef = useRef();
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const [otpCode, setOtpCode] = useState("");
  const [phoneNum, setPhoneNum] = useState(false);
  const [fakeLoader, setFakeLoader] = useState(false);
  const [payFortForm, setPayfortForm] = useState(false);
  const [migrationStep, setMigrationStep] = useState(1);
  const [openAddMobile, setOpenAddMobile] = useState(false);
  const [loadPayRequest, setLoadPayRequest] = useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [addPhoneForTamara, setAddPhoneForTamara] = useState(false);
  const [recallUserDataAgain, setRecallUserDataAgain] = useState(false);
  const [phoneAddedForTamara, setPhoneAddedForTamara] = useState(false);

  const { selectedPaymentMethod } = useSelector(
    (state) => state.selectedPaymentMethod
  );
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const { userDataProfile } = useSelector((state) => state.quickSection);

  const merchanteRefrenceRef = useRef(
    `${user?.data?.user?.id}_${Math.floor(1000 + Math.random() * 9000)}`
  );
  const merchanteRefrence = merchanteRefrenceRef.current;

  const orderAddress = defaultAddress?.id
    ? defaultAddress
    : selectedAddress?.id
    ? selectedAddress
    : {
        lat: 24.7136,
        lng: 46.6753,
        city: { name: "riyadh", country: { code: "SA" } },
      };

  //   call user  addresses
  usersAddressesQuery({
    setAllAddresses,
    user,
    dispatch,
    setDefaultAddress,
  });

  const { data } = useCustomQuery({
    name: ["getProfileInfoForgift", openEditUserModal, recallUserDataAgain],
    url: `${USERS}/${user?.data?.user?.id}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: user?.data?.user?.id ? true : false,
    onSuccess: (res) => {
      setRecallUserDataAgain(false);
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
    name: "confirmationGiftCard",
    url: VOUCHER_PURCHASE,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: false,
    method: "post",
    body: {
      price: selectedPrice?.price,
      message: userDataForBuying?.comment,
      payment_method: selectedPaymentMethod?.key || "CASH",
      image_id: selectedGift?.id,
      payment_reference: merchanteRefrence,
      user: {
        name: userDataForBuying?.name,
        email: userDataForBuying?.email,
        phone: userDataForBuying?.phone,
      },
    },
    onSuccess: async (res) => {
      sessionStorage.setItem(
        "gift_card_details",
        JSON.stringify({
          payment_method: selectedPaymentMethod?.key || "CASH",
          userDataForBuying: userDataForBuying,
          price: selectedPrice?.price,
          selectedGift: selectedGift,
          reference_code: res?.reference_code,
        })
      );
      if (selectedPaymentMethod?.key === PAYMENT_METHODS?.credit) {
        payFortForm.submit();
        setTimeout(() => {
          setFakeLoader(false);
        }, 12000);
        return;
      }
      if (selectedPaymentMethod?.key === PAYMENT_METHODS?.applePay) {
        return;
      }
      if (selectedPaymentMethod?.key === PAYMENT_METHODS?.cash) {
        router.push(`/confirmation/giftCards`);
        return;
      }
      if (selectedPaymentMethod?.key === PAYMENT_METHODS?.tamara) {
        if (userDataProfile?.phone?.length) {
          handlePayWithTamara();
        } else {
          setAddPhoneForTamara();
        }
        return;
      }
      if (selectedPaymentMethod?.key === PAYMENT_METHODS?.tabby) {
        if (userDataProfile?.phone?.length) {
          handlePayWithTabby();
        } else {
          setAddPhoneForTamara();
        }
        return;
      }
      if (selectedPaymentMethod?.key === PAYMENT_METHODS?.mis) {
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

      router.push(`/confirmation/giftCards`);
      setTimeout(() => {
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

  /* -------------------------------------------------------------------------- */
  /*                                payfort form                                */
  /* -------------------------------------------------------------------------- */
  const requestData = {
    command: "PURCHASE",
    access_code: process.env.NEXT_PUBLIC_PAYFORT_ACCESS,
    merchant_identifier: process.env.NEXT_PUBLIC_PAYFORT_IDENTIFIER,
    language: locale,
    currency: "SAR",
    customer_email: "userTest@example.com",
    return_url: `${process.env.NEXT_PUBLIC_PAYFORT_RETURN_GIFT_CARD}`,
  };

  requestData.merchant_reference = merchanteRefrence;
  requestData.amount = (selectedPrice?.price * 100)?.toFixed(0);
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
      +selectedPrice?.price > 0
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
  }, [payFortForm, +selectedPrice?.price]);

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
        amount: selectedPrice?.price, // Adjust dynamically if needed
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
          amount: (selectedPrice?.price * 100)?.toFixed(0),
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
        router.push(`/confirmation/giftCards`);
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
          city: orderAddress?.city?.name,
          country_code: orderAddress?.city?.country?.code,
          first_name: userDataProfile?.name,
          last_name: "",
          line1: orderAddress?.address,
        },
        description: `gift-card-with-user-id=${userDataProfile?.id}`,
        order_reference_id: merchanteRefrence,
        totalAmount: selectedPrice?.price,
        successUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/confirmation/giftCards`,
        cancelUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userProfile/gift/chooseGift`,
        failureUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userProfile/gift/chooseGift`,
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
            reference_id: "123",
            sku: "SA-12436",
            name: selectedGift?.url,
            quantity: 1,
            type: "Digital",
            total_amount: {
              amount: selectedPrice?.price,
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
    const realBuyer = {
      phone: userDataProfile?.phone?.replace(/^(\+?966)/, ""),
      email:
        userDataProfile?.email ||
        userDataProfile?.secondary_email ||
        `${userDataProfile?.phone}@atlobha.com`,

      name: userDataProfile?.name,
    };
    const shippingDetails = {
      city: orderAddress?.city?.name,
      address: orderAddress?.address,
      zip: "12345",
    };

    const response = await fetch("/api/tabby/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment: {
          amount: selectedPrice?.price,
          currency: "SAR",
          buyer: realBuyer,
          shipping_address: shippingDetails,
          order: {
            reference_id: merchanteRefrence,
            items: [
              {
                title: selectedGift?.url,
                quantity: 1,
                unit_price: selectedPrice?.price,
                category: "voucher-gift",
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
              amount: selectedPrice?.price,
              status: "new",
              buyer: realBuyer,
              shipping_address: shippingDetails,
            },
          ],
        },
        lang: locale,
        merchant_code: "Atolbha",
        merchant_urls: {
          cancel: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userProfile/gift/chooseGift`,
          failure: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/userProfile/gift/chooseGift`,
          success: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/confirmation/giftCards`,
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
        totalPrice: selectedPrice?.price,
        shippingAmount: "0",
        vat: "0",
        purchaseAmount: selectedPrice?.price,
        purchaseCurrency: "SAR",
        lang: locale,
        version: "v1.1",
        customerDetails: {
          mobileNumber: userDataProfile?.phone,
        },
        orderDetails: {
          items: [
            {
              nameArabic: selectedGift?.url,
              nameEnglish: selectedGift?.url,
              quantity: 1,
              unitPrice: selectedPrice?.price?.toFixed(2),
            },
          ],
        },
        callbackUri: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/confirmation/giftCards`,
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
    <div className="row my-3">
      <div className="col-12 d-flex">
        <Image
          src={selectedGift?.url}
          alt="main-gift"
          width={280}
          height={260}
          style={{
            width: isMobile ? "100%" : "60%",
            height: "100%",
            maxHeight: 400,
            margin: "auto",
          }}
        />
      </div>
      <div className="col-12  mt-3">
        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
          }}
        >
          <AddAvailablePayMethods
            orderDetails={{ address: orderAddress, status: "new" }}
          />
        </Box>
      </div>

      <div className="col-md-6 col-12 mt-3">
        <Box sx={header}>{t.orderSummary}</Box>
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={text}>{t.giftCardValue}</Box>
          <Box sx={text}>
            {selectedPrice?.price} {riyalImgBlack()}
          </Box>
        </Box>
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={text}>{t.quantity}</Box>
          <Box sx={text}>1</Box>
        </Box>
        <Box className="d-flex justify-content-between mb-2">
          <Box sx={{ ...text, ...boldText }}>{t.total}</Box>
          <Box sx={{ ...text, ...boldText }} id="amount-to-pay">
            {selectedPrice?.price} {riyalImgBlack()}
          </Box>
        </Box>

        <SharedBtn
          disabled={
            loadPayRequest ||
            !selectedPaymentMethod?.id ||
            confirmPriceFetch ||
            fakeLoader
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
            setFakeLoader(true);

            const amount = +selectedPrice?.price;
            const method = selectedPaymentMethod?.key;
            if (
              !userDataProfile?.phone?.length &&
              (method === PAYMENT_METHODS.tamara ||
                method === PAYMENT_METHODS.tabby)
            ) {
              setOpenAddMobile(true);
              setFakeLoader(false);
              return;
            }

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
                return;
              }
            }

            callConfirmPricing();
          }}
        />
      </div>

      {/* migration logic for phone */}
      <DialogCentered
        showTitle={isMobile ? false : true}
        title={
          migrationStep === 1
            ? t.addPhoneNum
            : migrationStep === 2
            ? t.mergeAccount
            : t.confirmPhone
        }
        subtitle={false}
        open={openAddMobile}
        setOpen={setOpenAddMobile}
        closeAction={() => {
          setMigrationStep(1);
          setOtpCode("");
          setPhoneNum(false);
        }}
        hasCloseIcon
        customClass="minimize-center-dialog-width"
        content={
          <MigrationPhoneLogic
            setMigrationStep={setMigrationStep}
            migrationStep={migrationStep}
            setOpenAddMobile={setOpenAddMobile}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            phoneNum={phoneNum}
            setPhoneNum={setPhoneNum}
            setRecallUserDataAgain={setRecallUserDataAgain}
          />
        }
      />

      {/* dialog to enter phone for user to can  pay with tamara */}
      <DialogCentered
        showTitle={true}
        title={t.addPhoneNum}
        subtitle={false}
        open={addPhoneForTamara}
        setOpen={setAddPhoneForTamara}
        closeAction={() => {
          setAddPhoneForTamara(false);
          setPhoneAddedForTamara(false);
          phoneRef?.current?.resetForm();
        }}
        hasCloseIcon
        customClass="minimize-center-dialog-width"
        content={
          <EnterPhoneNumber
            ref={phoneRef}
            onSubmit={(phone) => {
              setPhoneAddedForTamara(phone);
              setAddPhoneForTamara(false);
              setTimeout(() => {
                handlePayWithTamara();
              }, 500);
              phoneRef?.current?.resetForm(); // 👈 Reset form on close
            }}
          />
        }
      />

      {/* modal to edit user info data */}
      <EditUserInfoDialog
        openEditUserModal={openEditUserModal}
        setOpenEditUserModal={setOpenEditUserModal}
      />
    </div>
  );
}
