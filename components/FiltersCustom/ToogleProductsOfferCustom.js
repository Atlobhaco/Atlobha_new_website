import React from "react";
import SharedToggle from "../shared/SharedToggle";
import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";

function ToogleProductsOfferCustom({ mergedShowHideFilters, filters, setFilters }) {
  const { t } = useLocalization();

  return (
    mergedShowHideFilters?.toggleExpressProducts && (
      <Box sx={{ mt: 2 }}>
        <SharedToggle
          label={t.OnlyProductsOffer}
          value={filters?.has_express_delivery}
          handleChange={() =>
            setFilters((prev) => ({
              ...prev,
              has_express_delivery: !prev?.has_express_delivery,
            }))
          }
        />
      </Box>
    )
  );
}

export default ToogleProductsOfferCustom;
