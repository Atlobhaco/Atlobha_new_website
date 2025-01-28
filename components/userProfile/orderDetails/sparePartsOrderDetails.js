import React from "react";
import OrderNumCopyWhatsapp from "./orderNumCopyWhatsapp";
import TrackOrder from "./trackOrder";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";
import OrderProducts from "./orderProducts";
import OrderAddress from "./orderAddress";
import SharedBtn from "@/components/shared/SharedBtn";
import { Box, CircularProgress, Divider } from "@mui/material";
import { STATUS } from "@/constants/helpers";
import useCustomQuery from "@/config/network/Apiconfig";
import {
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

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(
      () => {
        toast.success(`${t.copySuccess}, ${id}`);
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
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
        orderDetails?.status === STATUS?.delivered ||
        orderDetails?.status === STATUS?.priced) && (
        <>
          <DeliveryDateOrder orderDetails={orderDetails} />
          <Divider sx={{ background: "#EAECF0", mb: 2 }} />
        </>
      )}
      {(orderDetails?.status === STATUS?.confirmed ||
        orderDetails?.status === STATUS?.delivered) && (
        <>
          <PaymentMethodOrder orderDetails={orderDetails} />
          <Divider sx={{ background: "#EAECF0", mb: 2 }} />
        </>
      )}

      {orderDetails?.status === STATUS?.priced && <AddAvailablePayMethods />}

      {(orderDetails?.status === STATUS?.confirmed ||
        orderDetails?.status === STATUS?.incomplete ||
        orderDetails?.status === STATUS?.delivered ||
        orderDetails?.status === STATUS?.priced) && (
        <Box sx={{ mt: 4 }}>
          <SummaryOrder
            orderDetails={orderDetails}
            callSingleOrder={callSingleOrder}
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
