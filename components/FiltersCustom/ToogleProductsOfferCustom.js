import React from "react";
import SharedToggle from "../shared/SharedToggle";
import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";

function ToogleProductsOfferCustom({ mergedShowHideFilters, filters, setFilters }) {
  const { t } = useLocalization();

  return (
    mergedShowHideFilters?.toggleProductsOffer && (
      <Box sx={{ mt: 2 }}>
        <SharedToggle
          label={t.OnlyProductsOffer}
          value={filters?.has_active_offer}
          handleChange={() =>
            setFilters((prev) => ({
              ...prev,
              has_active_offer: !prev?.has_active_offer,
            }))
          }
        />
      </Box>
    )
  );
}

export default ToogleProductsOfferCustom;
