import React, { useEffect, useState } from "react";
import OrderNumCopyWhatsapp from "./orderNumCopyWhatsapp";
import TrackOrder from "./trackOrder";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";
import OrderProducts from "./orderProducts";
import OrderAddress from "./orderAddress";
import SharedBtn from "@/components/shared/SharedBtn";
import { Box, CircularProgress, Divider } from "@mui/material";
import { ORDERSENUM, STATUS } from "@/constants/enums";
import useCustomQuery from "@/config/network/Apiconfig";
import {
  CALCULATE_RECEIPT,
  CANCELLED,
  DASHBOARD,
  ORDERS,
  SPARE_PARTS,
} from "@/config/endPoints/endPoints";
import DeliveryDateOrder from "./deliveryDateOrder";
import PaymentMethodOrder from "./paymentMethodOrder";
import SummaryOrder from "./summaryOrder";
import RateProductsSection from "./rateProductsSection";
import AddAvailablePayMethods from "./addAvailablePayMethods";
import { useRouter } from "next/router";

function SparePartsOrderDetails({
  orderDetails = {},
  callSingleOrder = () => {},
  orderDetailsFetching = false,
}) {
  if (orderDetailsFetching) {
    return (
      <Box className="d-flex align-items-center justify-content-center">
        <CircularProgress
          size={60}
          sx={{
            color: "#FFD400",
            mt: 5,
          }}
        />
      </Box>
    );
  }

  const { t } = useLocalization();
  const router = useRouter();
  const { idOrder, type, status } = router.query;

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(
      () => {
        toast.success(`${t.copySuccess}, ${id}`);
      },
      (err) => {}
    );
  };

  const {
    data,
    isFetching,
    refetch: callCancelOrder,
  } = useCustomQuery({
    name: ["cancelYOurOrder"],
    url: `${DASHBOARD}${SPARE_PARTS}${ORDERS}/${orderDetails?.id}${CANCELLED}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: false,
    method: "post",
    onSuccess: (res) => {
      callSingleOrder();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.first_error || t.someThingWrong);
    },
  });

  const renderUrlDependOnType = () => {
    switch (type) {
      case ORDERSENUM?.marketplace:
        return `/marketplace${ORDERS}/${idOrder}`;
      case ORDERSENUM?.spareParts:
        return `${SPARE_PARTS}${ORDERS}/${idOrder}${CALCULATE_RECEIPT}`;
      default:
        return type;
    }
  };

  const {
    data: calculateReceipt,
    isFetching: fetchReceipt,
    refetch: callCalculateReceipt,
  } = useCustomQuery({
    name: ["calculateReceipt"],
    url: renderUrlDependOnType(),
    refetchOnWindowFocus: false,
    enabled: STATUS?.priced === orderDetails?.status && idOrder ? true : false,
    method: "post",
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.first_error || t.someThingWrong);
    },
  });

  useEffect(() => {
    if (orderDetails?.id && router?.asPath && window?.webengage) {
      if (type === ORDERSENUM?.spareParts) {
        window.webengage.onReady(() => {
          webengage.track("ORDER_SPAREPARTS_VIEWED", {
            car_brand: orderDetails?.vehicle?.brand?.name || "",
            car_model: orderDetails?.vehicle?.model?.name || "",
            car_year: orderDetails?.vehicle?.year || "",
            order_items:
              orderDetails?.parts?.map((part) => ({
                Part_Name_or_Number: part?.name || part?.id || "",
                Quantity: part?.quantity || 0,
                Image: part?.image || "",
              })) || [],
            shipping_address: orderDetails?.address?.address || "",
            promo_code: orderDetails?.promo_code?.code || "",
            comment: orderDetails?.notes || "",
            order_number: orderDetails?.id ? String(orderDetails.id) : "",
            creation_date: orderDetails?.created_at
              ? new Date(orderDetails?.created_at?.replace(" ", "T") + "Z")
              : new Date().toISOString(),
            status: orderDetails?.status || "",
            order_url: router?.asPath || "",
          });
          window.gtag("event", "ORDER_SPAREPARTS_VIEWED", {
            car_brand: orderDetails?.vehicle?.brand?.name || "",
            car_model: orderDetails?.vehicle?.model?.name || "",
            car_year: orderDetails?.vehicle?.year || "",
            order_items:
              orderDetails?.parts?.map((part) => ({
                Part_Name_or_Number: part?.name || part?.id || "",
                Quantity: part?.quantity || 0,
                Image: part?.image || "",
              })) || [],
            shipping_address: orderDetails?.address?.address || "",
            promo_code: orderDetails?.promo_code?.code || "",
            comment: orderDetails?.notes || "",
            order_number: orderDetails?.id ? String(orderDetails.id) : "",
            creation_date: orderDetails?.created_at
              ? new Date(orderDetails?.created_at?.replace(" ", "T") + "Z")
              : new Date().toISOString(),
            status: orderDetails?.status || "",
            order_url: router?.asPath || "",
          });
        });
      }
      /* -------------------------------------------------------------------------- */
      /*                           order viewed webengege                           */
      /* -------------------------------------------------------------------------- */
      window.webengage.onReady(() => {
        webengage.track("ORDER_VIEWED", {
          order_number: orderDetails?.id ? String(orderDetails.id) : "",
          creation_date: orderDetails?.created_at
            ? new Date(orderDetails?.created_at?.replace(" ", "T") + "Z")
            : new Date().toISOString(),
          order_items:
            orderDetails?.parts?.map((part) => ({
              Part_Name_or_Number: part?.name || part?.id || "",
              Quantity: part?.quantity || 0,
              Image: part?.image || "",
            })) || [],
          shipping_address: orderDetails?.address?.address || "",
          deleivery_date: orderDetails?.estimated_delivery_date || "",
          payment: orderDetails?.payment_method || "",
          total_price: orderDetails?.receipt?.total_price || 0,
          status: orderDetails?.status || "",
          order_type: type || "",
          order_url: router?.asPath || "",
        });
        window.gtag("event", "ORDER_VIEWED", {
          order_number: orderDetails?.id ? String(orderDetails.id) : "",
          creation_date: orderDetails?.created_at
            ? new Date(orderDetails?.created_at?.replace(" ", "T") + "Z")
            : new Date().toISOString(),
          order_items:
            orderDetails?.parts?.map((part) => ({
              Part_Name_or_Number: part?.name || part?.id || "",
              Quantity: part?.quantity || 0,
              Image: part?.image || "",
            })) || [],
          shipping_address: orderDetails?.address?.address || "",
          deleivery_date: orderDetails?.estimated_delivery_date || "",
          payment: orderDetails?.payment_method || "",
          total_price: orderDetails?.receipt?.total_price || 0,
          status: orderDetails?.status || "",
          order_type: type || "",
          order_url: router?.asPath || "",
        });
      });
    }
  }, [orderDetails?.id, router]);

  return (
    <>
      <OrderNumCopyWhatsapp
        orderDetails={orderDetails}
        handleCopy={handleCopy}
      />
      <TrackOrder orderDetails={orderDetails} handleCopy={handleCopy} />
      {orderDetails?.status === STATUS?.delivered && (
        <RateProductsSection orderDetails={orderDetails} />
      )}

      <OrderProducts
        orderDetails={orderDetails}
        callSingleOrder={callSingleOrder}
        orderDetailsFetching={orderDetailsFetching}
      />

      <OrderAddress
        orderDetails={orderDetails}
        callSingleOrder={callSingleOrder}
      />
      <Divider sx={{ background: "#EAECF0", mb: 2 }} />

      {(orderDetails?.status === STATUS?.confirmed ||
        orderDetails?.status === STATUS?.new ||
        orderDetails?.status === STATUS?.priced) && (
        <>
          <DeliveryDateOrder orderDetails={orderDetails} />
          <Divider sx={{ background: "#EAECF0", mb: 2 }} />
        </>
      )}
      {(orderDetails?.status === STATUS?.confirmed ||
        orderDetails?.status === STATUS?.delivered ||
        type === ORDERSENUM?.marketplace) && (
        <>
          <PaymentMethodOrder orderDetails={orderDetails} />
          <Divider sx={{ background: "#EAECF0", mb: 2 }} />
        </>
      )}

      {orderDetails?.status === STATUS?.priced && (
        <AddAvailablePayMethods orderDetails={orderDetails} />
      )}

      {(orderDetails?.status === STATUS?.confirmed ||
        orderDetails?.status === STATUS?.incomplete ||
        orderDetails?.status === STATUS?.delivered ||
        (orderDetails?.status === STATUS?.new &&
          type === ORDERSENUM?.marketplace) ||
        orderDetails?.status === STATUS?.priced) && (
        <Box sx={{ mt: 4 }}>
          <SummaryOrder
            orderDetails={orderDetails}
            callSingleOrder={callSingleOrder}
            calculateReceiptResFromMainPage={
              STATUS?.priced === orderDetails?.status ? calculateReceipt : {}
            }
            // send object if it priced only
          />
        </Box>
      )}

      {orderDetails?.status === STATUS?.new && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SharedBtn
            className="outline-btn"
            text="cancelYourOrder"
            customClass="w-50"
            onClick={() => callCancelOrder()}
          />
        </Box>
      )}
    </>
  );
}

export default SparePartsOrderDetails;
