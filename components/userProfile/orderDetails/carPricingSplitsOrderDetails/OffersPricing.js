import { OFFERS, VEHICLE_PRICING_ORDERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import OfferContent from "./OfferContent";

function OffersPricing({ setSteps, selectedOffer, setSelectedOffer }) {
  const router = useRouter();
  const { idOrder } = router.query;
  const { t } = useLocalization();

  const { data: offers, isFetching } = useCustomQuery({
    name: ["offers-for-cars", idOrder],
    url: `${VEHICLE_PRICING_ORDERS}/${idOrder}${OFFERS}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
  });

  return (
    <Box className="row">
      <Box display="flex" gap={1} mb={2} alignItems="center">
        <Image
          loading="lazy"
          src={"/imgs/pricing-bg-icon.svg"}
          alt="header"
          width={53}
          height={37}
        />
        <Box>
          <Typography color="#1C1C28" fontSize="18px" fontWeight="700">
            {t.availableOffer}
          </Typography>
          <Typography color="#1C1C28" fontSize="15px" fontWeight="500">
            {t.selectOffer}
          </Typography>
        </Box>
      </Box>{" "}
      {isFetching ? (
        <Box p={2} fontWeight="700" textAlign="center">
          <CircularProgress
            sx={{
              color: "#FFD400",
            }}
          />
        </Box>
      ) : offers?.length ? (
        offers?.map((offer, index) => (
          <OfferContent
            key={index}
            offer={offer}
            selectedOffer={selectedOffer}
            setSelectedOffer={setSelectedOffer}
            setSteps={setSteps}
          />
        ))
      ) : (
        <Box p={2} fontWeight="700" textAlign="center">
          {t.noResultsFound}
        </Box>
      )}
    </Box>
  );
}
export default OffersPricing;
