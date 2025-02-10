import useLocalization from "@/config/hooks/useLocalization";
import React from "react";
import style from "./orderStatus.module.scss";
import InfoIcon from "@mui/icons-material/Info";
import { STATUS } from "@/constants/helpers";
import CancelIcon from "@mui/icons-material/Cancel";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function OrderStatus({ status }) {
  const { t } = useLocalization();

  const orderStatus = (status) => {
    switch (status) {
      case STATUS?.new:
        return (
          <div className={`${style["new"]} ${style["status"]}`}>
            <InfoIcon className={`${style["svg"]}`} />
            <div className={`${style["text"]}`}>{t.new}</div>
          </div>
        );
      case STATUS?.cancelled:
        return (
          <div className={`${style["cancelled"]} ${style["status"]}`}>
            <CancelIcon className={`${style["svg"]}`} />
            <div className={`${style["text"]}`}>{t.cancelled}</div>
          </div>
        );
      case STATUS?.shipping:
        return (
          <div className={`${style["shipping"]} ${style["status"]}`}>
            <Image
              src="/icons/shipping.svg"
              width={24}
              height={12}
              alt="shipping"
              className={`${style["image"]}`}
            />
            <div className={`${style["text"]}`}>{t.shipping}</div>
          </div>
        );
      case STATUS?.delivered:
        return (
          <div className={`${style["delivered"]} ${style["status"]}`}>
            <CheckCircleIcon className={`${style["svg"]}`} />
            <div className={`${style["text"]}`}>{t.delivered}</div>
          </div>
        );
      case STATUS?.payPending:
        return (
          <div className={`${style["pay-pending"]} ${style["status"]}`}>
            <Image
              src="/icons/wait-confirm.svg"
              width={24}
              height={12}
              alt="wait-confirm"
              className={`${style["image"]}`}
            />{" "}
            <div className={`${style["text"]}`}>{t.waitConfirm}</div>
          </div>
        );
      case STATUS?.returned:
        return (
          <div className={`${style["returnbale"]} ${style["status"]}`}>
            <Image
              src="/icons/returnable.svg"
              width={24}
              height={12}
              alt="return"
              className={`${style["image"]}`}
            />{" "}
            <div className={`${style["text"]}`}>{t.returnbale}</div>
          </div>
        );
      case STATUS?.incomplete:
        return (
          <div className={`${style["incomplete"]} ${style["status"]}`}>
            <Image
              src="/icons/incomplete.svg"
              width={24}
              height={12}
              alt="return"
              className={`${style["image"]}`}
            />{" "}
            <div className={`${style["text"]}`}>{t.status.incomplete}</div>
          </div>
        );
      case STATUS?.confirmed:
        return (
          <div className={`${style["confirmed"]} ${style["status"]}`}>
            <Image
              src="/icons/confirmed-tick.svg"
              width={24}
              height={12}
              alt="return"
              className={`${style["image"]}`}
            />{" "}
            <div className={`${style["text"]}`}>{t.status.confirmed}</div>
          </div>
        );
      case STATUS?.priced:
        return (
          <div className={`${style["priced"]} ${style["status"]}`}>
            <Image
              src="/icons/priced-status.svg"
              width={24}
              height={12}
              alt="return"
              className={`${style["image"]}`}
            />{" "}
            <div className={`${style["text"]}`}>{t.status.priced}</div>
          </div>
        );
      case STATUS?.priceUnavailable:
        return (
          <div className={`${style["cancelled"]} ${style["status"]}`}>
            <CancelIcon className={`${style["svg"]}`} />
            <div className={`${style["text"]}`}>{t.status['pricing-unavailable']}</div>
          </div>
        );
      default:
        return status;
    }
  };

  return <div>{orderStatus(status)}</div>;
}

export default OrderStatus;
