import useLocalization from "@/config/hooks/useLocalization";
import { Box, CircularProgress, Divider, Button } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import OrderNumCopyWhatsapp from "./orderNumCopyWhatsapp";
import TrackOrder from "./trackOrder";
import RateProductsSection from "./rateProductsSection";
import { ORDERSENUM, STATUS } from "@/constants/enums";
import OrderProducts from "./orderProducts";
import OrderAddress from "./orderAddress";
import PaymentMethodOrder from "./paymentMethodOrder";
import SummaryOrder from "./summaryOrder";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import moment from "moment";
import WillCallLater from "@/components/ServiceDetails/WillCallLater";
import Image from "next/image";
import { openInGoogleMaps } from "@/constants/helpers";
import OrderFieldMultiSelect from "./orderFieldMultiSelect";
import OrderDetailsFiles from "./orderDetailsFiles";
import OrderDetailsText from "./orderDetailsText";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

function ServiceOrderDetails({
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

  const { t, locale } = useLocalization();
  const router = useRouter();
  const { isMobile } = useScreenSize();
  const { type } = router.query;

  const buttonStyle = {
    background: "#FFD400",
    padding: isMobile ? "6px 10px" : "7px 12px",
    borderRadius: "8px",
    color: "black",
    display: "flex",
    gap: "2px",
    fontSize: isMobile ? "10px" : "15px",
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(
      () => {
        toast.success(`${t.copySuccess}, ${id}`);
      },
      (err) => {}
    );
  };

  useEffect(() => {
    if (orderDetails?.id && router?.asPath) {
      /* -------------------------------------------------------------------------- */
      /*                           order viewed webengege                           */
      /* -------------------------------------------------------------------------- */
      if (analytics) {
        logEvent(analytics, "ORDER_VIEWED", {
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
      }
    }
  }, [orderDetails?.id, router]);

  const returnDivider = () => <Divider sx={{ background: "#EAECF0", mb: 2 }} />;

  const returnServiceTime = () => {
    if (orderDetails?.service?.slots_disabled) {
      return <WillCallLater />;
    }

    const startFrom = orderDetails?.slot?.start;
    const endAt = orderDetails?.slot?.end;
    const dateStart = moment(startFrom);
    const today = moment();

    // Check if the slot date is today
    if (dateStart.isSame(today, "day") && false) {
      // Today
      return `${t.todayAtTime} ${dateStart.format("h:mm a")}`;
    } else {
      // Not today → format like 10-10-2025 (4:00 pm - 5:00 pm)
      const dateStr = dateStart.format("DD-MM-YYYY");
      const timeRange =
        startFrom === endAt
          ? moment(startFrom).format("h:mm a")
          : `${moment(startFrom).format("h:mm a")} - ${moment(endAt).format(
              "h:mm a"
            )}`;

      return `${dateStr} (${timeRange})`;
    }
  };

  const returnAddresstitleDependType = () => {
    if (type === ORDERSENUM?.maintenance) {
      return t.centerLocation;
    }
    return t.serviceLocation;
  };

  const addressDependOnType = () => {
    return type === ORDERSENUM?.maintenance
      ? {
          address: orderDetails?.service_center?.address,
          city: orderDetails?.service_center?.store?.city,
        }
      : orderDetails?.address;
  };

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

      {/* show multi-select option if found */}
      {orderDetails?.checkout_fields?.some(
        (item) => item.type === "multi-select"
      ) && (
        <>
          <OrderFieldMultiSelect
            checkoutField={orderDetails?.checkout_fields?.find(
              (item) => item.type === "multi-select"
            )}
          />
          {returnDivider()}
        </>
      )}

      {/* show product image and price */}
      <OrderProducts
        orderDetails={{ ...orderDetails, products: [orderDetails?.service] }}
        callSingleOrder={callSingleOrder}
        orderDetailsFetching={orderDetailsFetching}
      />
      {returnDivider()}

      {/* show  address for order */}
      <OrderAddress
        orderDetails={{
          ...orderDetails,
          address: addressDependOnType(),
        }}
        callSingleOrder={callSingleOrder}
        customtitle={returnAddresstitleDependType()}
        hideArrow={true}
      />
      {returnDivider()}

      {/* show delivery address for order */}
      {orderDetails?.dropoff_address?.id && (
        <OrderAddress
          orderDetails={{
            ...orderDetails,
            address: orderDetails?.dropoff_address,
          }}
          callSingleOrder={callSingleOrder}
          customtitle={t.deliveryAddress}
          hideArrow={true}
        />
      )}
      {/* show store location and calling */}
      {type === ORDERSENUM?.maintenance && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "5px",
            mb: 2,
          }}
        >
          <Button
            sx={buttonStyle}
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();
              openInGoogleMaps(
                orderDetails?.service_center?.store?.latitude,
                orderDetails?.service_center?.store?.longitude
              );
            }}
          >
            <Image
              loading="lazy"
              alt={"GPS-lo"}
              src={"/icons/gps-detector.svg"}
              width={isMobile ? 18 : 20}
              height={isMobile ? 18 : 20}
              style={{
                marginBottom: "4px",
              }}
            />
            {t.storeLocation}
          </Button>
          <Button
            sx={buttonStyle}
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();
              window.location.href = `tel:${orderDetails?.service_center?.phone}`;
            }}
          >
            <Image
              loading="lazy"
              alt={"calling"}
              src={"/icons/call-us.svg"}
              width={isMobile ? 18 : 22}
              height={isMobile ? 18 : 22}
              style={{
                marginBottom: "4px",
              }}
            />
            {t.callStore}
          </Button>{" "}
        </Box>
      )}

      {returnDivider()}

      {/* show files if found */}
      {orderDetails?.checkout_fields?.some((item) => item.type === "file") && (
        <OrderDetailsFiles
          fields={orderDetails?.checkout_fields?.filter(
            (item) => item.type === "file"
          )}
          divider={returnDivider}
        />
      )}

      {/* show comment if found */}
      {orderDetails?.checkout_fields?.some((item) => item.type === "text") && (
        <>
          <OrderDetailsText
            fields={orderDetails?.checkout_fields?.filter(
              (item) => item.type === "text"
            )}
          />
          {returnDivider()}
        </>
      )}

      {/* time for service */}
      <Box
        sx={{
          padding: "16px 13px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box>
          <Image
            loading="lazy"
            src="/icons/yellow-calendar.svg"
            width={20}
            height={20}
            alt="yellow-calendar"
          />
        </Box>
        <Box>
          <Box
            sx={{
              color: "#232323",
              fontSize: isMobile ? "14px" : "20px",
              fontWeight: "700",
              lineHeight: "30px",
              letterSpacing: "-0.4px",
            }}
          >
            {t.serviceTime}
          </Box>
          <Box
            sx={{
              color: "#1FB256",
              fontSize: isMobile ? "12px" : "18px",
              fontWeight: "500",
              lineHeight: "24px",
            }}
          >
            {returnServiceTime()}
          </Box>
        </Box>
      </Box>

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

export default ServiceOrderDetails;
