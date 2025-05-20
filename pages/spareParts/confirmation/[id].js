import React, { useEffect, useState } from "react";
import style from "./confirmation.module.scss";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Image from "next/image";
import { useRouter } from "next/router";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SharedBtn from "@/components/shared/SharedBtn";
import useCustomQuery from "@/config/network/Apiconfig";
import {
  ESTIMATED_DELIVERY,
  ORDERS,
  SETTINGS,
  SPARE_PARTS,
} from "@/config/endPoints/endPoints";
import { MARKETPLACE } from "@/constants/enums";
import moment from "moment";
import { STATUS } from "@/constants/enums";
import { CircularProgress } from "@mui/material";
import { availablePaymentMethodImages } from "@/constants/helpers";

function Confirmation() {
  const [orderId, setOrderId] = useState(null);
  const [LngLat, setLngLat] = useState(null);
  const { isMobile } = useScreenSize();
  const router = useRouter();
  const { id, type } = router.query;
  const { t } = useLocalization();

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
        type === MARKETPLACE ? sessionStorage.getItem("order_id_market") : null;
      setOrderId(orderIdFromStorage);
    }
  }, [type]);

  const renderUrlDependOnType = () => {
    switch (type) {
      case MARKETPLACE:
        return `/marketplace/orders/${+id || orderId}`;
      default:
        return `${SPARE_PARTS}${ORDERS}/${+id || orderId}`;
    }
  };

  const { data, refetch: addPricing } = useCustomQuery({
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
    },
    onError: (err) => {
      toast.error(err?.response?.data?.first_error);
    },
  });

  const deliveryDate = () => {
    if (!data) return null;

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
            src="/icons/location-yellow.svg"
            alt="alert"
            width={24}
            height={24}
          />
        </div>
        <div className={`${style["deliverySec_address"]}`}>
          <div className={`${style["deliverySec_address-holder"]}`}>
            {t.deliveryAddress}
          </div>
          <div className={`${style["deliverySec_address-location"]}`}>
            {data?.address?.address || ""} {data?.address?.city?.name}
          </div>
        </div>
      </div>
      <div className={`${style["timeSec"]}`}>
        <div>
          <Image
            src="/icons/yellow-calendar.svg"
            alt="alert"
            width={24}
            height={24}
          />
        </div>
        <div className={`${style["timeSec_appoin"]}`}>
          <div className={`${style["timeSec_appoin-holder"]}`}>
            {t.deliveryTime}
          </div>
          <div className={`${style["timeSec_appoin-date"]}`}>
            <Image
              src="/icons/alert-blue.svg"
              alt="alert"
              width={isMobile ? 14 : 20}
              height={isMobile ? 14 : 20}
            />
            {loadDate ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              deliveryDate()
            )}
          </div>
        </div>
      </div>

      {/* show payment method for marketplace */}
      {type === MARKETPLACE ? (
        <div className={`${style["deliverySec"]}`}>
          <div>
            <Image
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
        <div className={`${style["details-header"]}`}>
          <Image
            src="/icons/brakes-black.svg"
            alt="alert"
            width={24}
            height={24}
          />
          {type === MARKETPLACE ? t.marketData : t.partsData}
        </div>
        {(data?.products || data?.parts)?.map((part) => (
          <div className={`${style["details-parts"]}`} key={part?.id}>
            <div className={`${style["details-parts_imgHolder"]}`}>
              <Image
                src={part?.image || "/imgs/no-img-holder.svg"}
                width={isMobile ? 50 : 70}
                height={isMobile ? 50 : 70}
                alt={part?.quantity}
                onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")} // Fallback to default image
              />
            </div>
            <div className={`${style["details-parts_details"]}`}>
              <div className={`${style["details-parts_details-name"]}`}>
                {part?.name}
              </div>
              <div className={`${style["details-parts_details-qty"]}`}>
                {part?.quantity} {t.piece}{" "}
              </div>
            </div>
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
