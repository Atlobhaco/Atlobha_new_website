import React, { useState } from "react";
import style from "./orderList.module.scss";
import { Box } from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";
import { ORDERSENUM, STATUS } from "@/constants/enums";
import moment from "moment";
import OrderStatus from "./orderStatus/orderStatus";
import OrderActions from "./orderAction/orderActions";
import { useRouter } from "next/router";
import { ORDERS, RE_OPEN, SPARE_PARTS } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import { toast } from "react-toastify";
import { riyalImgBlack } from "@/constants/helpers";

function OrdersList({ order, callOrders }) {
  const { t } = useLocalization();
  const router = useRouter();
  const [orderDetailsReprice, setOrderDetailsRePrice] = useState(false);

  const renderUrlDependOnType = () => {
    switch (orderDetailsReprice?.class) {
      case ORDERSENUM?.marketplace:
        return `/marketplace${ORDERS}/${order?.id}`;
      case ORDERSENUM?.spareParts:
        return `${SPARE_PARTS}${ORDERS}/${orderDetailsReprice?.id}${RE_OPEN}`;
      default:
        return orderDetailsReprice?.class;
    }
  };

  const {
    data,
    isFetching: repeatPriceFetch,
    refetch: callRepeatPricing,
  } = useCustomQuery({
    name: ["repriceOrder", orderDetailsReprice?.id],
    url: renderUrlDependOnType(),
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: orderDetailsReprice?.id ? true : false,
    method: "post",
    onSuccess: (res) => {
      callOrders();
      toast.success(t.pricedImmedialty);
      router.push(
        `/userProfile/myOrders/${orderDetailsReprice?.id}?type=${orderDetailsReprice?.class}`
      );
      setOrderDetailsRePrice(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.first_error || t.someThingWrong);
      setOrderDetailsRePrice(false);
    },
  });

  const orderType = (order) => {
    switch (order?.class) {
      case ORDERSENUM?.marketplace:
        return t.marketplace;
      case ORDERSENUM?.spareParts:
        return t.spareParts;
      case ORDERSENUM?.estimation:
        return t.estimation;
      case ORDERSENUM?.maintenance:
        return t.maintenance;
      case ORDERSENUM?.PORTABLE:
        return t.portable;
		case ORDERSENUM?.gift:
        return t.gift;
      default:
        return "";
    }
  };

  return (
    <div
      key={order?.id}
      className={`${style["order"]}`}
      onClick={(e) => {
        e?.preventDefault();
        e?.stopPropagation();
        router.push({
          pathname: `/userProfile/myOrders/${order?.id}`,
          query: { type: order?.class },
        });
      }}
    >
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
            {
              <Box className={`${style["price"]}`}>
                {/* can not find price before */}
                {/* <span>{order?.receipt?.total_price}</span>{" "} */}
                {((order?.class === ORDERSENUM?.spareParts &&
                  order?.status !== STATUS?.new) ||
                  (order?.class !== ORDERSENUM?.spareParts &&
                    order?.receipt?.total_price > 0)) && (
                  <Box
                    sx={{
                      color: order?.receipt?.total_price ? "#EE772F" : "red",
                    }}
                  >
                    {order?.receipt?.total_price} {riyalImgBlack()}
                  </Box>
                )}
              </Box>
            }
          </div>
        </div>
      </div>
      <div className={`${style["section-two"]}`}>
        <OrderActions
          order={order}
          setOrderDetailsRePrice={setOrderDetailsRePrice}
          repeatPriceFetch={repeatPriceFetch}
          orderDetailsReprice={orderDetailsReprice}
        />
      </div>
    </div>
  );
}

export default OrdersList;
