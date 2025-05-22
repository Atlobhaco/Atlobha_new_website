import useLocalization from "@/config/hooks/useLocalization";
import { Box, CircularProgress, Divider } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import OrderNumCopyWhatsapp from "./orderNumCopyWhatsapp";
import TrackOrder from "./trackOrder";
import RateProductsSection from "./rateProductsSection";
import { STATUS } from "@/constants/enums";
import OrderProducts from "./orderProducts";
import OrderAddress from "./orderAddress";
import DeliveryDateOrder from "./deliveryDateOrder";
import PaymentMethodOrder from "./paymentMethodOrder";
import SummaryOrder from "./summaryOrder";

function MarketplaceOrderDetails({
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

  /* -------------------------------------------------------------------------- */
  /*                     logic  for cancel order marketplace                    */
  /* -------------------------------------------------------------------------- */
  //   const {
  //     data,
  //     isFetching,
  //     refetch: callCancelOrder,
  //   } = useCustomQuery({
  //     name: ["cancelMarketplacceOrder"],
  //     url: `${DASHBOARD}${SPARE_PARTS}${ORDERS}/${orderDetails?.id}${CANCELLED}`,
  //     refetchOnWindowFocus: false,
  //     select: (res) => res?.data?.data,
  //     enabled: false,
  //     method: "post",
  //     onSuccess: (res) => {
  //       callSingleOrder();
  //     },
  //     onError: (err) => {
  //       toast.error(err?.response?.data?.first_error || t.someThingWrong);
  //     },
  //   });

  useEffect(() => {
    if (orderDetails?.id && router?.asPath && window?.webengage) {
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
      });
    }
  }, [orderDetails?.id, router]);

  const returnDivider = () => <Divider sx={{ background: "#EAECF0", mb: 2 }} />;

  return (
    <>
      {/* copy order num with whatsapp chat */}
      <OrderNumCopyWhatsapp
        orderDetails={orderDetails}
        handleCopy={handleCopy}
      />
      {/* tracking for order status */}
      <TrackOrder orderDetails={orderDetails} handleCopy={handleCopy} />

      {/* rate Product  section */}
      {orderDetails?.status === STATUS?.delivered && (
        <RateProductsSection orderDetails={orderDetails} />
      )}

      {/* show product image and price */}
      <OrderProducts
        orderDetails={orderDetails}
        callSingleOrder={callSingleOrder}
        orderDetailsFetching={orderDetailsFetching}
      />

      {/* show delivery address for order */}
      <OrderAddress
        orderDetails={orderDetails}
        callSingleOrder={callSingleOrder}
      />
      {returnDivider()}

      {/* delivery date order */}
      <DeliveryDateOrder orderDetails={orderDetails} />
      {returnDivider()}

      <PaymentMethodOrder orderDetails={orderDetails} />
      {returnDivider()}

      <Box sx={{ mt: 4 }}>
        <SummaryOrder
          orderDetails={orderDetails}
          callSingleOrder={callSingleOrder}
          calculateReceiptResFromMainPage={orderDetails?.status}
          // send object if it priced only
        />
      </Box>
    </>
  );
}

export default MarketplaceOrderDetails;
