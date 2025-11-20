import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import OrderNumCopyWhatsapp from "./orderNumCopyWhatsapp";
import TrackOrder from "./trackOrder";
import OrderStatus from "../ordersList/orderStatus/orderStatus";
import { Box, CircularProgress, Divider } from "@mui/material";
import PaymentMethodOrder from "./paymentMethodOrder";
import ShowGiftDetails from "../gift/showGiftDetails";
import ShowGiftSummary from "../gift/showGiftSummary";

function GiftCardOrderDetails({
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

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(
      () => {
        toast.success(`${t.copySuccess}, ${id}`);
      },
      (err) => {}
    );
  };

  const returnDivider = () => <Divider sx={{ background: "#EAECF0", mb: 2 }} />;

  return (
    <>
      {/* copy order num with whatsapp chat */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <OrderNumCopyWhatsapp
          orderDetails={orderDetails}
          handleCopy={handleCopy}
        />
        {/* order status */}
        <OrderStatus status={orderDetails?.status} />
      </Box>
      {returnDivider()}

      <PaymentMethodOrder orderDetails={orderDetails} />
      {returnDivider()}

      <ShowGiftDetails
        giftCardDetails={{
          selectedGift: orderDetails?.voucher?.image,
          price: orderDetails?.price,
        }}
        noMarginBottom={true}
      />
      {returnDivider()}

      <ShowGiftSummary
        giftCardDetails={{
          price: orderDetails?.price,
        }}
      />
    </>
  );
}

export default GiftCardOrderDetails;
