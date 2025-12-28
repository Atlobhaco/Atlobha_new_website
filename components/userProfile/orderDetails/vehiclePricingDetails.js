import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React, { useState } from "react";
import { toast } from "react-toastify";
import OrderNumCopyWhatsapp from "./orderNumCopyWhatsapp";
import OrderStatus from "../ordersList/orderStatus/orderStatus";
import style from "../../../pages/carPricing/carPricing.module.scss";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import PurchaseMethodPricing from "./carPricingSplitsOrderDetails/PurchaseMethodPricing.";
import CarDetailsOrderPricings from "./carPricingSplitsOrderDetails/CarDetailsOrderPricings";
import PaymentMethodOrder from "./paymentMethodOrder";
import AddAddressToShowTimes from "@/components/ServiceDetails/AddAddressToShowTimes";
import { STATUS } from "@/constants/enums";
import OffersPricing from "./carPricingSplitsOrderDetails/OffersPricing";
import SharedBtn from "@/components/shared/SharedBtn";
import CheckoutCarPricingOrder from "./carPricingSplitsOrderDetails/CheckoutCarPricingOrder";
import SummaryReceipt from "./carPricingSplitsOrderDetails/SummaryReceipt";
import ExpiredOffers from "./carPricingSplitsOrderDetails/ExpiredOffers";
import Image from "next/image";
import OfferContent from "./carPricingSplitsOrderDetails/OfferContent";
import DialogCentered from "@/components/DialogCentered";
import StoreData from "@/components/ServiceDetails/StoreData";
import styleSpareParts from "../../../pages/spareParts/confirmation/confirmation.module.scss";
import SelectedOfferReceipt from "./carPricingSplitsOrderDetails/SelectedOfferReceipt";

function VehiclePricingDetails({
  orderDetails = {},
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
  const { isMobile } = useScreenSize();
  const [steps, setSteps] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

  const cololredBoxStyle = {
    border: "1px solid rgba(255,212,0,0.30)",
    background: "linear-gradient(180deg, #FFFEF7, #FFFBE6)",
    borderRadius: 2,
    p: isMobile ? "10px" : "17px 17px 10px",
    color: "#364153",
    fontSize: isMobile ? "12px" : "18px",
    fontWeight: "500",
    width: isMobile ? "100%" : "50%",
    marginBottom: "16px",
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(
      () => {
        toast.success(`${t.copySuccess}, ${id}`);
      },
      (err) => {}
    );
  };
  const returnDivider = () => <Divider sx={{ background: "#EAECF0", mb: 2 }} />;

  // first step for pricing
  // page of confirmed and new order
  return steps === 1 ? (
    <>
      {/* copy order num with whatsapp chat and status */}
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

      {orderDetails?.status === STATUS?.confirmed && (
        <>
          <Box display="flex" gap={1} my={2} alignItems="center">
            <Image
              loading="lazy"
              src={"/imgs/pricing-bg-icon.svg"}
              alt="header"
              width={53}
              height={37}
            />

            <Box>
              <Typography color="#1C1C28" fontSize="18px" fontWeight="700">
                {t.confirmedOffer}
              </Typography>
            </Box>
          </Box>{" "}
          {/* selected offer */}
          <OfferContent
            offer={orderDetails?.accepted_offer}
            selectedOffer={orderDetails?.accepted_offer}
            hideButton={true}
            actionButton={
              <SharedBtn
                text="confirmationDetails"
                onClick={() => {
                  setOpenDetails(true);
                }}
                className="big-main-btn"
                customClass="w-100"
                comAfterText={
                  <Image
                    loading="lazy"
                    src="/icons/arrow-left-sm.svg"
                    width={12}
                    height={12}
                    alt="arrow-left"
                    style={{
                      transform: locale === "en" ? "rotate(180deg)" : "",
                    }}
                  />
                }
              />
            }
          />
        </>
      )}

      {(orderDetails?.status === STATUS?.new ||
        orderDetails?.status === STATUS?.priced) && (
        <Box mb={3}>
          {orderDetails?.status === STATUS?.new && (
            <AddAddressToShowTimes text={t.bestPrice} />
          )}
          {orderDetails?.status === STATUS?.priced && (
            <OffersPricing
              setSteps={setSteps}
              selectedOffer={selectedOffer}
              setSelectedOffer={setSelectedOffer}
            />
          )}
        </Box>
      )}

      {returnDivider()}

      {orderDetails?.status === STATUS?.confirmed && (
        <>
          <ExpiredOffers
            offers={orderDetails?.offers?.filter(
              (d) => d?.status === "rejected"
            )}
          />
          {returnDivider()}
        </>
      )}

      {/* show car details */}
      <CarDetailsOrderPricings
        style={style}
        orderDetails={orderDetails}
        cololredBoxStyle={cololredBoxStyle}
      />
      {returnDivider()}

      <PurchaseMethodPricing
        style={style}
        orderDetails={orderDetails}
        cololredBoxStyle={cololredBoxStyle}
      />
      {returnDivider()}

      <Box mb={3}>
        <PaymentMethodOrder orderDetails={orderDetails} noPadding={true} />
      </Box>
      {returnDivider()}

      {/* if  order is priced i want to add receipt for the selected order */}
      <SummaryReceipt
        orderDetails={orderDetails}
        selectedOffer={selectedOffer}
        setSteps={setSteps}
      />

      {/* show details of accepted offer */}
      <DialogCentered
        title={null}
        subtitle={false}
        open={openDetails}
        setOpen={setOpenDetails}
        hasCloseIcon
        content={
          <Box
            sx={{
              maxHeight: "70vh",
              overflow: "auto",
              px: 1,
            }}
          >
            <Box className={`${styleSpareParts["numberSection"]} py-0 mb-4`}>
              <Box className={`${styleSpareParts["numberSection_num"]}`}>
                <Box color="#6B7280" fontWeight="700">
                  {t.orderNum}:
                </Box>
                <Box color="#232323" fontWeight="500">
                  {orderDetails?.reference_code || ""}
                </Box>
                <Box>
                  <ContentCopyIcon
                    sx={{
                      cursor: "pointer",
                      width: "17px",
                    }}
                    onClick={() => handleCopy(orderDetails?.reference_code)} // Add onClick handler
                  />
                </Box>
              </Box>
              <Box className={`${styleSpareParts["numberSection_hint"]}`}>
                {t.offerConfirmedWithDeposit}
              </Box>
            </Box>
            {returnDivider()}

            <Box display="flex" alignItems="center" gap="5px" mb="10px">
              <Image
                loading="lazy"
                src="/icons/location-yellow.svg"
                alt="alert"
                width={24}
                height={24}
              />
              <Typography fontWeight="700" color="#000">
                {t.storeDetails}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <StoreData
                prod={{}}
                store={orderDetails?.accepted_offer?.store}
                selectedStore={null}
                setSelectedStore={() => {}}
                setOpenAppointments={() => {}}
                setOpenLogin={() => {}}
                selectedStoreTime={null}
                userConfirmStoreDate={false}
                setSelectedStoreTime={() => {}}
                setUserConfirmStoreDate={() => {}}
                setSelectNewDate={() => {}}
                workWithProduct={true}
                selectNewDate={null}
                handleDateChange={() => {}}
                setAllStores={() => {}}
              />
            </Box>
            {returnDivider()}

            <Box sx={{ mb: 4 }}>
              <PaymentMethodOrder
                orderDetails={orderDetails}
                noPadding={true}
              />
            </Box>
            {returnDivider()}

            <SelectedOfferReceipt
              receipt={orderDetails?.accepted_offer?.store_receipt}
            />
          </Box>
        }
      />
    </>
  ) : (
    <CheckoutCarPricingOrder
      selectedOffer={selectedOffer}
      setSteps={setSteps}
      orderDetails={orderDetails}
    />
  );
}

export default VehiclePricingDetails;
