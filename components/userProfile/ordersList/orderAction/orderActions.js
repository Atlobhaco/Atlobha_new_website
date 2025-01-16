import React from "react";
import style from "./orderAction.module.scss";
import InfoIcon from "@mui/icons-material/Info";
import { STATUS } from "@/constants/helpers";
import SharedBtn from "@/components/shared/SharedBtn";
import moment from "moment";

function OrderActions({ order }) {
  const orderStatus = (status) => {
    switch (status) {
      case STATUS?.new:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>يمكنك الغاء او تعديل طلبك</div>
            <div className={`${style["text"]}`}>
              <SharedBtn
                text="cancelOrder"
                className="outline-btn"
                id="cancelOrder"
                customClass={`${style["btn-style"]}`}
              />
            </div>
          </div>
        );
      case STATUS?.cancelled:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>
              طلب ملغي في
              <span className={`${style["sub-title"]}`}>
                {moment(order?.created_at)?.format("DD-MM-YYYY")}
              </span>
            </div>
          </div>
        );
      case STATUS?.shipping:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>
              خرج للتوصيل في
              <span className={`${style["sub-title"]}`}>
                {moment(order?.created_at)?.format("DD-MM-YYYY")}
              </span>
            </div>
            <div className={`${style["text"]}`}>
              <SharedBtn
                text="trackOrder"
                className="outline-btn"
                id="cancelOrder"
                customClass={`${style["btn-style"]}`}
              />
            </div>
          </div>
        );
      case STATUS?.delivered:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>
              تم التوصيل في
              <span className={`${style["sub-title"]}`}>
                {moment(order?.created_at)?.format("DD-MM-YYYY")}
              </span>
            </div>
            <div className={`${style["text"]}`}>
              <SharedBtn
                text="rateOrder"
                className="outline-btn"
                id="cancelOrder"
                customClass={`${style["btn-style"]}`}
              />
            </div>
          </div>
        );
      case STATUS?.payPending:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>
              <InfoIcon className={`${style["svg"]}`} />
              <span className={`${style["green-sub-title"]}`}>
                يمكنك اكمال الدفع و تاكيد الطلب
              </span>
            </div>
            <div className={`${style["text"]}`}>
              <SharedBtn
                text="completePay"
                className="outline-btn"
                id="cancelOrder"
                customClass={`${style["btn-style"]}`}
              />
            </div>
          </div>
        );
      case STATUS?.incomplete:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>
              <InfoIcon
                sx={{
                  color: "#EE772F !important",
                }}
                className={`${style["svg"]}`}
              />
              <span className={`${style["orange-sub-title"]}`}>
                طلب مرجع جزئبا في
              </span>
              <span className={`${style["sub-title"]}`}>
                {moment(order?.created_at)?.format("DD-MM-YYYY")}
              </span>
            </div>
            <div className={`${style["text"]}`}>
              <SharedBtn
                text="completePay"
                className="outline-btn"
                id="cancelOrder"
                customClass={`${style["btn-style"]}`}
              />
            </div>
          </div>
        );
      default:
        return status;
    }
  };

  return <div>{orderStatus(order?.status)}</div>;
}

export default OrderActions;
