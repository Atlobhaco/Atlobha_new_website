import useLocalization from "@/config/hooks/useLocalization";
import { ORDERSENUM, VEHICLE_PRICING } from "@/constants/enums";
import { decryptAES } from "@/lib/mispay";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import style from "../../spareParts/confirmation/confirmation.module.scss";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";
import styleCarPricing from "../../../pages/carPricing/carPricing.module.scss";
import { availablePaymentMethodImages } from "@/constants/helpers";
import SharedBtn from "@/components/shared/SharedBtn";
import { Box, Typography } from "@mui/material";
import StoreData from "@/components/ServiceDetails/StoreData";
import OfferContent from "@/components/userProfile/orderDetails/carPricingSplitsOrderDetails/OfferContent";
import SelectedOfferReceipt from "@/components/userProfile/orderDetails/carPricingSplitsOrderDetails/SelectedOfferReceipt";

function CarPricingContent() {
  const router = useRouter();
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const [decrypted, setDecrypted] = useState(null);
  const [pricingDetails, setPricingDetails] = useState(null);

  //   get data from session storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("carPricingDetails");
      if (data) {
        setPricingDetails(JSON.parse(data));
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("carPricingDetails");
      }
    };
  }, []);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(
      () => {
        toast.success(`${t.copySuccess}, ${id}`);
      },
      (err) => {}
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                   misPay callback handling after payment                   */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const enc = router?.query?._;
    if (!enc) return;

    try {
      const secret = process.env.NEXT_PUBLIC_MIS_API_KEY;
      const dec = decryptAES(
        Buffer.from(enc, "base64").toString("utf8"),
        secret
      );
      setDecrypted(dec);
    } catch (e) {
      console.error("Decrypt error:", e);
    }
  }, [router]);

  useEffect(() => {
    if (decrypted) {
      //   status code for mispay response
      //   MP00 -> success
      //   MP01 -> timeout
      //   MP02 ->  Cancelled
      //   MP03 -> refunded

      const messages = {
        MP01: t.paymentFailure,
        MP02: t.paymentCancelled,
        MP03: t.paymentCancelled,
      };
      // handle fail in vehicle pricnig
      if (messages[decrypted?.code]) {
        router.push(
          pricingDetails?.created_order_car_res
            ? `/userProfile/myOrders/${pricingDetails?.created_order_car_res?.orderDetails?.id}/?type=${ORDERSENUM?.vehiclePricing}`
            : `/carPricing/checkout/?secType=${VEHICLE_PRICING}`
        );
      }
    }
  }, [decrypted]);

  return (
    <div className={`${style["confirmation"]}`}>
      <div className={`${style["confirmation_thank"]}`}>{t.thankYou}</div>
      <div className={`${style["numberSection"]}`}>
        <div className={`${style["numberSection_num"]}`}>
          <div className={`${style["numberSection_num-holder"]}`}>
            {t.orderNum}:
          </div>
          <div className={`${style["numberSection_num-id"]}`}>
            {pricingDetails?.created_order_car_res?.reference_code ||
              pricingDetails?.created_order_car_res?.orderDetails
                ?.reference_code ||
              ""}
          </div>
          <div>
            <ContentCopyIcon
              sx={{ cursor: "pointer", width: isMobile ? "17px" : "auto" }}
              onClick={() =>
                handleCopy(
                  pricingDetails?.created_order_car_res?.reference_code ||
                    pricingDetails?.created_order_car_res?.orderDetails
                      ?.reference_code
                )
              } // Add onClick handler
            />
          </div>
        </div>
        <div className={`${style["numberSection_hint"]}`}>
          {pricingDetails?.selectedOffer
            ? t.depositConfirmed
            : t.confirmMessage}
        </div>
      </div>

      {/* show store for offer selected */}
      {pricingDetails?.selectedOffer?.store && (
        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
          }}
        >
          <Box display="flex" alignItems="center" gap="5px" mb="10px">
            <Image
              loading="lazy"
              src="/icons/location-yellow.svg"
              alt="alert"
              width={24}
              height={24}
            />
            <Typography fontWeight="700" color="#000">
              {t.storeDetails}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <StoreData
              prod={{}}
              store={pricingDetails?.selectedOffer?.store}
              selectedStore={null}
              setSelectedStore={() => {}}
              setOpenAppointments={() => {}}
              setOpenLogin={() => {}}
              selectedStoreTime={null}
              userConfirmStoreDate={false}
              setSelectedStoreTime={() => {}}
              setUserConfirmStoreDate={() => {}}
              setSelectNewDate={() => {}}
              workWithProduct={true}
              selectNewDate={null}
              handleDateChange={() => {}}
              setAllStores={() => {}}
            />
          </Box>
        </Box>
      )}

      {pricingDetails?.selectedOffer && (
        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
          }}
        >
          <Box display="flex" gap={1} my={2} alignItems="center">
            <Image
              loading="lazy"
              src={"/imgs/pricing-bg-icon.svg"}
              alt="header"
              width={53}
              height={37}
            />

            <Box>
              <Typography color="#1C1C28" fontSize="18px" fontWeight="700">
                {t.theSelectedOffer}
              </Typography>
            </Box>
          </Box>{" "}
          {/* selected offer */}
          <OfferContent
            offer={pricingDetails?.selectedOffer}
            selectedOffer={pricingDetails?.selectedOffer}
            hideButton={true}
          />
        </Box>
      )}

      {/* car details for pricing */}
      {pricingDetails?.brand && (
        <div className={`py-4 d-flex align-items-center gap-2`}>
          <Image
            src="/icons/car-active.svg"
            alt="car"
            width={isMobile ? 20 : 23}
            height={isMobile ? 20 : 23}
          />
          <div>
            <div className={`${styleCarPricing["headers-checkout"]}`}>
              {t.CarForPricing}
            </div>
            <div className="d-flex align-items-center gap-3">
              <Image
                src={pricingDetails?.brand?.image}
                alt="car-image"
                width={isMobile ? 30 : 40}
                height={isMobile ? 30 : 40}
              />
              <div className="d-flex flex-column">
                <div className={`${styleCarPricing["car-info"]}`}>
                  {locale === "ar"
                    ? pricingDetails?.brand?.name_ar
                    : pricingDetails?.brand?.name_en}{" "}
                </div>
                <div className={`${styleCarPricing["car-info"]}`}>
                  {locale === "ar"
                    ? pricingDetails?.model?.name_ar
                    : pricingDetails?.model?.name_en}
                </div>
              </div>
              <div className={`${styleCarPricing["car-info"]}`}>
                {pricingDetails?.year}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* prefered purchase method */}
      {pricingDetails?.purchase?.type && (
        <div className={` py-4 d-flex align-items-center gap-2`}>
          <Image
            src="/icons/yellow-card.svg"
            alt="car"
            width={isMobile ? 20 : 23}
            height={isMobile ? 20 : 23}
          />
          <div>
            <div className={`${styleCarPricing["headers-checkout"]}`}>
              {t.preferedPurchaseMethod}
            </div>
            <div className={`${styleCarPricing["car-info"]}`}>
              {pricingDetails?.purchase?.type === "CASH"
                ? t.cash
                : t.payMethods.INSTALLMENT}
            </div>
          </div>
        </div>
      )}

      {/* purchase method */}
      <div className={`${style["deliverySec"]} px-0 py-4`}>
        <div>
          <Image
            loading="lazy"
            src="/icons/wallet-yellow.svg"
            width={24}
            height={24}
            alt="pay-method"
          />
        </div>
        <div className={`${style["deliverySec_address"]}`}>
          <div className={`${style["deliverySec_address-holder"]}`}>
            {t.paymentMethod}
          </div>
          <div className={`${style["deliverySec_address-location"]}`}>
            {availablePaymentMethodImages(
              {
                payment_method:
                  pricingDetails?.created_order_car_res?.payment_method,
              },
              isMobile
            )}
          </div>
        </div>
      </div>

      {pricingDetails?.selectedOffer && (
        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
          }}
        >
          <SelectedOfferReceipt
            receipt={pricingDetails?.selectedOffer?.store_receipt}
          />
        </Box>
      )}
      {/* ask about receipt order */}
      {/* button  to redirect to orders page */}
      <div className="d-flex justify-content-center">
        <SharedBtn
          onClick={() => router.push("/userProfile/myOrders")}
          text="goOrder"
          className="big-main-btn"
          customStyle={{
            width: "450px",
          }}
        />
      </div>
    </div>
  );
}

export default CarPricingContent;
