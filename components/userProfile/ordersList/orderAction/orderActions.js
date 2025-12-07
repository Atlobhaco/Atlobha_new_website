import React from "react";
import style from "./orderAction.module.scss";
import InfoIcon from "@mui/icons-material/Info";
import { ORDERSENUM, STATUS } from "@/constants/enums";
import SharedBtn from "@/components/shared/SharedBtn";
import moment from "moment";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

function OrderActions({
  order,
  setOrderDetailsRePrice,
  repeatPriceFetch,
  orderDetailsReprice,
}) {
  const { t } = useLocalization();
  const router = useRouter();

  const orderStatus = (status) => {
    switch (status) {
      case STATUS?.new:
        if (
          order?.class === ORDERSENUM?.marketplace ||
          order?.class === ORDERSENUM?.PORTABLE ||
          order?.class === ORDERSENUM?.maintenance
        ) {
          return (
            <div className={`${style["new"]}`}>
              <div className={`${style["title"]}`}>{t.orderUnderReview}</div>
              {/* <div className={`${style["text"]}`}>
                <SharedBtn
                  text="cancelOrder"
                  className="outline-btn"
                  id="cancelOrder"
                  customClass={`${style["btn-style"]}`}
                />
              </div> */}
            </div>
          );
        } else if (order?.class === ORDERSENUM?.gift) {
          return null;
        } else {
          return (
            <div className={`${style["new"]}`}>
              <div className={`${style["title"]}`}>{t.waitForPricing}</div>
            </div>
          );
        }

      case STATUS?.processing:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>{t.orderUnderReview}</div>
          </div>
        );

      case STATUS?.cancelled:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>
              {t.orderCancelledOn}
              <span className={`${style["sub-title"]}`}>
                {order?.status_updated_at
                  ? moment(order?.status_updated_at)?.format("DD-MM-YYYY")
                  : " - "}
              </span>
            </div>
          </div>
        );
      case STATUS?.shipping:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>
              {t.outForDelivery}
              <span className={`${style["sub-title"]}`}>
                {order?.status_updated_at
                  ? moment(order?.status_updated_at)?.format("DD-MM-YYYY")
                  : null}
              </span>
            </div>
            <div className={`${style["text"]}`}>
              <SharedBtn
                text="trackOrder"
                className="outline-btn"
                id="shippingOrder"
                customClass={`${style["btn-style"]}`}
              />
            </div>
          </div>
        );
      // need to enhance this step it is wrong(design)
      case STATUS?.readyToShip:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>
              {t.status["ready-to-ship"]}
              <span className={`${style["sub-title"]}`}>
                {order?.status_updated_at
                  ? moment(order?.status_updated_at)?.format("DD-MM-YYYY")
                  : null}
              </span>
            </div>
            {/* <div className={`${style["text"]}`}>
              <SharedBtn
                text="trackOrder"
                className="outline-btn"
                id="shippingOrder"
                customClass={`${style["btn-style"]}`}
              />
            </div> */}
          </div>
        );
      case STATUS?.delivered:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>
              {t.deliveredOn}
              <span className={`${style["sub-title"]}`}>
                {moment(order?.created_at)?.format("DD-MM-YYYY")}
              </span>
            </div>
            <div className={`${style["text"]}`}>
              <SharedBtn
                text="rateOrder"
                className="outline-btn"
                id="deliveredOrder"
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
                {t.confirmOrderNow}
              </span>
            </div>
            <div className={`${style["text"]}`}>
              <SharedBtn
                className="outline-btn"
                text="confimrOrderBtn"
                id="payPendingOrder"
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
                {t.orderCanReprice}
              </span>
            </div>
            <div className={`${style["text"]}`}>
              <SharedBtn
                text="repriceOrderAgain"
                className="outline-btn"
                id="cancelOrder"
                customClass={`${style["btn-style"]}`}
                disabled={
                  repeatPriceFetch && order?.id === orderDetailsReprice?.id
                }
                comAfterText={
                  repeatPriceFetch && order?.id === orderDetailsReprice?.id ? (
                    <CircularProgress color="inherit" size={15} />
                  ) : null
                }
                onClick={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();
                  setOrderDetailsRePrice(order);
                  window.webengage.onReady(() => {
                    webengage.track("ORDER_SPAREPARTS_REPRICE", {
                      car_brand: order?.vehicle?.brand?.name || "",
                      car_model: order?.vehicle?.model?.name || "",
                      car_year: order?.vehicle?.year || Number("1990"),
                      order_items:
                        order?.parts?.map((part) => ({
                          Part_Name_or_Number: part?.name || part?.id || "",
                          Quantity: part?.quantity || 0,
                          Image: part?.image || "",
                        })) || [],
                      shipping_address: order?.address?.address || "",
                      promo_code: order?.promo_code?.code || "",
                      comment: order?.notes || "",
                      order_number: order?.id ? String(order.id) : "",
                      creation_date: order?.created_at
                        ? new Date(order?.created_at?.replace(" ", "T") + "Z")
                        : new Date().toISOString(),
                      status: order?.status || "",
                      order_url: router?.asPath || "",
                      total_price: order?.receipt?.total_price || 0,
                    });
                  });
                }}
              />
            </div>
          </div>
        );
      case STATUS?.priced:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>
              <InfoIcon className={`${style["svg"]}`} />
              <span className={`${style["green-sub-title"]}`}>
                {t.confirmOrderNow}
              </span>
            </div>
            <div className={`${style["text"]}`}>
              <SharedBtn
                text="confimrOrderBtn"
                className="outline-btn"
                id="priceOrder"
                customClass={`${style["btn-style"]}`}
              />
            </div>
          </div>
        );

      case STATUS?.confirmed:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>{t.orderUnderReview}</div>
            {/* <div className={`${style["text"]}`}>
					<SharedBtn
					  text="cancelOrder"
					  className="outline-btn"
					  id="cancelOrder"
					  customClass={`${style["btn-style"]}`}
					/>
				  </div> */}
          </div>
        );

      case STATUS?.priceUnavailable:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>{t.priceNotAvaiilable}</div>
            {/* <div className={`${style["text"]}`}>
						<SharedBtn
						  text="cancelOrder"
						  className="outline-btn"
						  id="cancelOrder"
						  customClass={`${style["btn-style"]}`}
						/>
					  </div> */}
          </div>
        );

      case STATUS?.completed:
        return (
          <div className={`${style["new"]}`}>
            <div className={`${style["title"]}`}>{t.completedSuccess}</div>
          </div>
        );

      default:
        return status;
    }
  };

  return <div>{orderStatus(order?.status)}</div>;
}

export default OrderActions;
