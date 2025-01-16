import React from "react";
import style from "./orderList.module.scss";
import { Box } from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";
import { ORDERSENUM } from "@/constants/helpers";
import moment from "moment";
import OrderStatus from "./orderStatus/orderStatus";
import OrderActions from "./orderAction/orderActions";

function OrdersList({ order }) {
  const { t } = useLocalization();

  const orderType = (order) => {
    switch (order?.class) {
      case ORDERSENUM?.marketplace:
        return t.marketplace;
      case ORDERSENUM?.spareParts:
        return t.spareParts;
      case ORDERSENUM?.estimation:
        return t.estimation;
      default:
        return "";
    }
  };

  return (
    <div key={order?.id} className={`${style["order"]}`}>
      <div className={`${style["section-one"]}`}>
        <div className={`${style["date"]}`}>
          <div>{moment(order?.created_at)?.format("D")}</div>
          <div>{moment(order?.created_at)?.format("MMM")}</div>
        </div>
        <div className={`${style["info"]}`}>
          <div className={`${style["flex"]}`}>
            <div className={`${style["title"]}`}>
              {t.orderNum} <span>#{order?.id}</span>
            </div>
            <div className={`${style["title"]}`}>
              {t.orderType} <span>{orderType(order)}</span>
            </div>{" "}
          </div>
          <div className={`${style["flex"]}`}>
            <div>
              <OrderStatus status={order?.status} />
            </div>
            <Box className={`${style["price"]}`}>
              {/* can not find price before */}
              {/* <span>{order?.receipt?.total_price}</span>{" "} */}
              {order?.receipt?.total_price && (
                <Box
                  sx={{
                    color: order?.receipt?.total_price ? "#EE772F" : "red",
                  }}
                >
                  {order?.receipt?.total_price} {t.sar}
                </Box>
              )}
            </Box>
          </div>
        </div>
      </div>
      <div className={`${style["section-two"]}`}>
        <OrderActions order={order} />
      </div>
    </div>
  );
}

export default OrdersList;
