import React from "react";
import {
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import useLocalization from "@/config/hooks/useLocalization";
import OfferContent from "./OfferContent";

function ExpiredOffers({ offers, defaultExpanded = false }) {
  const { t } = useLocalization();

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      sx={{
        boxShadow: "none",
        backgroundColor: "transparent",
        margin: 0,
        "&::before": { display: "none" },
        "&.Mui-expanded": {
          margin: 0, // ✅ ensure no margin when expanded
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          padding: 0,
        }}
      >
        <Typography component="span">
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
                {t.expiredOffer}
              </Typography>
              <Typography color="#1C1C28" fontSize="15px" fontWeight="500">
                {t.offerEndedValidity}
              </Typography>
            </Box>
          </Box>{" "}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        className="row"
        sx={{
          padding: 0,
        }}
      >
        {offers?.length ? (
          offers.map((singleOffer) => (
            <OfferContent
              key={singleOffer?.id} // ✅ important
              offer={singleOffer}
              selectedOffer={singleOffer}
              hideButton={true}
              customBorder="2px solid #EB3C24"
              ExpiredOffer={true}
            />
          ))
        ) : (
          <Box p={2} fontWeight="700" textAlign="center">
            {t.noResultsFound}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default ExpiredOffers;
