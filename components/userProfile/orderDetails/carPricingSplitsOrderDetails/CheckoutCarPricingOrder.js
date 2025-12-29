import useLocalization from "@/config/hooks/useLocalization";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import OfferContent from "./OfferContent";
import AddAvailablePayMethods from "../addAvailablePayMethods";
import { useSelector } from "react-redux";
import AtlobhaPlusHint from "../../atlobhaPlusHint";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SelectedOfferReceipt from "./SelectedOfferReceipt";

function CheckoutCarPricingOrder({ selectedOffer, setSteps, orderDetails }) {
  const { t } = useLocalization();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const { isMobile } = useScreenSize();
  const lat = selectedAddress?.lat || defaultAddress?.lat || 24.7136;
  const lng = selectedAddress?.lng || defaultAddress?.lng || 46.6753;

  return (
    <>
      <Box
        sx={{
          background: "#F2F9EC",
          padding: "9px 16px",
          borderRadius: "10px",
        }}
        display="flex"
        gap={2}
        mt={4}
      >
        <Image
          loading="lazy"
          src={"/icons/money.svg"}
          alt="header"
          width={53}
          height={37}
        />
        <Box>
          <Typography color="#78C340" fontSize="18px" fontWeight="700">
            {t.confirmOffer}
          </Typography>
          <Typography color="#6B7280" fontSize="15px" fontWeight="500">
            {t.forConfirmOrder}{" "}
            {selectedOffer?.store_receipt?.deposit_percentage_applied}%{" "}
            {t.FromCarPrice}
          </Typography>
        </Box>
      </Box>
      {/* header for selected offer */}
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
            {t.theSelectedOffer}
          </Typography>
        </Box>
      </Box>{" "}
      {/* selected offer */}
      <OfferContent
        offer={selectedOffer}
        selectedOffer={selectedOffer}
        setSteps={setSteps}
        hideButton={true}
      />
      {/* payment method selections */}
      <Box
        sx={{
          width: isMobile ? "100%" : "50%",
        }}
      >
        <AddAvailablePayMethods
          orderDetails={{
            ...orderDetails,
            address: {
              lat: lat,
              lng: lng,
            },
          }}
          hidePayment={["CASH"]}
          queryParams={{
            exclude_cash: true,
          }}
        />
      </Box>
      <Box
        my={2}
        sx={{
          width: isMobile ? "100%" : "50%",
        }}
      >
        <AtlobhaPlusHint alwaysHorizontalDesgin={true} />
      </Box>
      <Box
        my={2}
        sx={{
          width: isMobile ? "100%" : "50%",
        }}
      >
        <SelectedOfferReceipt
          receipt={selectedOffer?.store_receipt}
          orderDetails={orderDetails}
          selectedOffer={selectedOffer}
        />
      </Box>
    </>
  );
}

export default CheckoutCarPricingOrder;
