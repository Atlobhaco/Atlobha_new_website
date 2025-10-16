import React, { useEffect, useState } from "react";
import style from "./confirmation.module.scss";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";
import Image from "next/image";
import { useRouter } from "next/router";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SharedBtn from "@/components/shared/SharedBtn";
import useCustomQuery from "@/config/network/Apiconfig";
import {
  ESTIMATED_DELIVERY,
  MAINTENANCE_RESERVATIONS,
  ORDERS,
  PORTABLE_MAINTENANCE_RESERVATIONS,
  SETTINGS,
  SPARE_PARTS,
} from "@/config/endPoints/endPoints";
import { FIXED, MARKETPLACE, PORTABLE, SERVICES } from "@/constants/enums";
import moment from "moment";
import { STATUS } from "@/constants/enums";
import { Box, CircularProgress } from "@mui/material";
import {
  availablePaymentMethodImages,
  riyalImgOrange,
  servicePrice,
} from "@/constants/helpers";
import { useSelector } from "react-redux";
import { decryptAES } from "@/lib/mispay";

function Confirmation() {
  const router = useRouter();
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);

  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const [LngLat, setLngLat] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const { id, type, serviceType } = router.query;
  const [serciceTypeFromStorage, setServiceType] = useState(false);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(
      () => {
        toast.success(`${t.copySuccess}, ${id}`);
      },
      (err) => {}
    );
  };

  const { data: estimateRes, isLoading: loadDate } = useCustomQuery({
    name: ["getEstimateDelivery", LngLat?.lat, LngLat?.lng],
    url: `${SETTINGS}${ESTIMATED_DELIVERY}?latitude=${LngLat?.lat}&longitude=${LngLat?.lng}`,
    refetchOnWindowFocus: false,
    enabled: LngLat?.lat && LngLat?.lng ? true : false,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.first_error);
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const orderIdFromStorage =
        type === MARKETPLACE || type === SERVICES
          ? sessionStorage.getItem("order_id_market")
          : null;

      const serviceType =
        type === SERVICES ? sessionStorage.getItem("service_type") : null;
      setServiceType(serviceType);
      setOrderId(orderIdFromStorage);
    }
  }, [type]);

  const renderUrlDependOnType = () => {
    switch (type) {
      case MARKETPLACE:
        return `/marketplace${ORDERS}/${+id || orderId}`;
      case SERVICES:
        if (serviceType === PORTABLE || serciceTypeFromStorage === PORTABLE) {
          return `${PORTABLE_MAINTENANCE_RESERVATIONS}/${+id || orderId}`;
        }
        return `${MAINTENANCE_RESERVATIONS}/${+id || orderId}`;

      default:
        return `${SPARE_PARTS}${ORDERS}/${+id || orderId}`;
    }
  };

  const { data } = useCustomQuery({
    name: ["getDataforPricing", id, orderId],
    url: renderUrlDependOnType(),
    refetchOnWindowFocus: false,
    enabled: id || orderId ? true : false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      if (!res?.estimated_packaging_date && !res?.estimated_delivery_date) {
        setLngLat({
          lng: res?.address?.lng,
          lat: res?.address?.lat,
        });
      }
      sessionStorage.removeItem("order_id_market");
      sessionStorage.removeItem("service_type");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.first_error);
    },
  });

  const deliveryDate = () => {
    if (!data) return null;

    if (!data?.slot?.start) return "";
    const dateStart = moment(data?.slot?.start);
    const today = moment();

    if (type === SERVICES) {
      if (dateStart.isSame(today, "day")) {
        return `${t.todayAtTime} ${dateStart.format("H:mm")}`;
      } else {
        return `${moment(dateStart).format("h:mm")} (${dateStart.format(
          locale === "ar" ? "YYYY/MM/DD" : "DD/MM/YYYY"
        )})`;
      }
    }

    if (data?.status === STATUS?.new && type !== MARKETPLACE)
      return t.dateLater;

    const date =
      data?.estimated_packaging_date || data?.estimated_delivery_date;

    if (date)
      return `${t.deliveryFrom} ${moment(date).format("dddd, D MMMM YYYY")}`;

    return estimateRes?.estimated_delivery_date_from &&
      estimateRes?.estimated_delivery_date_to
      ? `${t.deliveryFrom} ${moment
          .unix(estimateRes.estimated_delivery_date_from)
          .format("dddd, D MMMM YYYY")} ${t.and} ${moment
          .unix(estimateRes.estimated_delivery_date_to)
          .format("dddd, D MMMM YYYY")}`
      : t.dateLater;
  };

  const HeaderAddressForType = () => {
    if (type === SERVICES && serviceType === FIXED) {
      return t.centerLocation;
    }
    if (type === SERVICES && serviceType === PORTABLE) {
      return t.serviceLocation;
    }
    return t.deliveryAddress;
  };

  const headerTimeType = () => {
    if (type === SERVICES) {
      return t.serviceTime;
    }
    return t.deliveryTime;
  };

  const headerParts = () => {
    if (type === SERVICES) {
      return t.selectedServices;
    }
    return (
      <>
        <Image
          loading="lazy"
          src="/icons/brakes-black.svg"
          alt="alert"
          width={24}
          height={24}
        />
        {type === MARKETPLACE ? t.marketData : t.partsData}
      </>
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
      const decrypted = decryptAES(
        Buffer.from(enc, "base64").toString("utf8"),
        secret
      );

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

      if (messages[decrypted?.code]) {
        toast.error(messages[decrypted.code]);
        router.push("/");
      }
    } catch (e) {
      console.error("Decrypt error:", e);
    }
  }, [router]);

  return (
    <div className={`${style["confirmation"]}`}>
      <div className={`${style["confirmation_thank"]}`}>{t.thankYou}</div>
      <div className={`${style["numberSection"]}`}>
        <div className={`${style["numberSection_num"]}`}>
          <div className={`${style["numberSection_num-holder"]}`}>
            {t.orderNum}:
          </div>
          <div className={`${style["numberSection_num-id"]}`}>
            {data?.reference_code || ""}
          </div>
          <div>
            <ContentCopyIcon
              sx={{ cursor: "pointer", width: isMobile ? "17px" : "auto" }}
              onClick={() => handleCopy(data?.reference_code)} // Add onClick handler
            />
          </div>
        </div>
        <div className={`${style["numberSection_hint"]}`}>
          {t.confirmMessage}
        </div>
      </div>
      <div className={`${style["deliverySec"]}`}>
        <div>
          <Image
            loading="lazy"
            src="/icons/location-yellow.svg"
            alt="alert"
            width={24}
            height={24}
          />
        </div>
        <div className={`${style["deliverySec_address"]}`}>
          <div className={`${style["deliverySec_address-holder"]}`}>
            {HeaderAddressForType()}
          </div>
          <div className={`${style["deliverySec_address-location"]}`}>
            {data?.address?.address || data?.service_center?.address || ""}{" "}
            {data?.address?.city?.name}
          </div>
        </div>
      </div>
      <div className={`${style["timeSec"]}`}>
        <div>
          <Image
            loading="lazy"
            src="/icons/yellow-calendar.svg"
            alt="alert"
            width={24}
            height={24}
          />
        </div>
        <div className={`${style["timeSec_appoin"]}`}>
          <div className={`${style["timeSec_appoin-holder"]}`}>
            {headerTimeType()}
          </div>
          <div className={`${style["timeSec_appoin-date"]}`}>
            {type !== SERVICES && (
              <Image
                loading="lazy"
                src="/icons/alert-blue.svg"
                alt="alert"
                width={isMobile ? 14 : 20}
                height={isMobile ? 14 : 20}
              />
            )}
            {loadDate ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              deliveryDate()
            )}
          </div>
        </div>
      </div>

      {/* show payment method for marketplace or services */}
      {type === MARKETPLACE || type === SERVICES ? (
        <div className={`${style["deliverySec"]}`}>
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
                { payment_method: data?.payment_method },
                isMobile
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className={`${style["details"]}`}>
        <div className={`${style["details-header"]}`}>{headerParts()}</div>
        {(data?.products || data?.parts || [data?.service])?.map((part) => (
          <div className={`${style["details-parts"]}`} key={part?.id}>
            <div className={`${style["details-parts_imgHolder"]}`}>
              <Image
                loading="lazy"
                src={part?.image || "/imgs/no-img-holder.svg"}
                width={isMobile ? 50 : 70}
                height={isMobile ? 50 : 70}
                alt={part?.quantity || 1}
                onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
              />
            </div>
            <div className={`${style["details-parts_details"]}`}>
              <div className={`${style["details-parts_details-name"]}`}>
                {part?.name}
              </div>
              {type === SERVICES && (
                <div className={`${style["details-parts_details-desc"]}`}>
                  {part?.description}
                </div>
              )}
              {part?.quantity && (
                <div className={`${style["details-parts_details-qty"]}`}>
                  {part?.quantity} {t.piece}{" "}
                </div>
              )}
            </div>
            {type === SERVICES && (
              <Box
                sx={{
                  px: isMobile ? 0 : 3,
                  color: "#ee772f",
                  fontSize: isMobile ? "16px" : "20px",
                  fontWeight: "500",
                  minWidth: "fit-content",
                }}
              >
                {servicePrice({
                  service: data?.service,
                  userCar: selectedCar?.id ? selectedCar : defaultCar,
                })}
                {riyalImgOrange()}
              </Box>
            )}
          </div>
        ))}
      </div>
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

export default Confirmation;
