import React, { useEffect } from "react";
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
import PromocodeSpareOrders from "./PromoCodeSpareOrders";
import { useSelector } from "react-redux";

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
  const { idOrder, type } = router.query;
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);
  const userCar = selectedCar?.id ? selectedCar : defaultCar;
  const { voucherCode, allPromoCodeData, usePromoThenDeleteit } = useSelector(
    (state) => state.addSpareParts
  );

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
    name: "calculateReceipt",
    url: renderUrlDependOnType(),
    refetchOnWindowFocus: true,
    enabled: STATUS?.priced === orderDetails?.status && idOrder ? true : false,
    method: "post",
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.first_error || t.someThingWrong);
    },
  });

  useEffect(() => {
    if (voucherCode || allPromoCodeData?.id || usePromoThenDeleteit) {
      setTimeout(() => {
        callCalculateReceipt();
      }, 800);
    }
  }, [allPromoCodeData?.id, voucherCode]);

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
        orderDetails?.status === STATUS?.new) && (
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
        <>
          <AddAvailablePayMethods orderDetails={orderDetails} />
          <PromocodeSpareOrders
            promoCodeId={false}
            setPromoCodeId={() => {}}
            query={{
              brand_id: userCar?.brand?.id,
              model_id: userCar?.model?.id,
              year: userCar?.year,
              order_type: "spare-parts-order",
            }}
            idOrder={idOrder}
          />
        </>
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
