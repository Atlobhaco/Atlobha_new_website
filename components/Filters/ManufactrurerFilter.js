import { MANUFACTURERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React, { useState } from "react";

function ManufactrurerFilter({
  filters,
  mergedShowHideFilters,
  setFilters,
  colorHeaders,
}) {
  const { t } = useLocalization();
  const { user } = useAuth();
  const { isMobile } = useScreenSize();
  const [manufactures, setManufacturers] = useState([]);

  useCustomQuery({
    name: ["manufactureFilters", filters?.category_id],
    url: `${MANUFACTURERS}?category_ids[]=${filters?.category_id}&is_active=1`,
    refetchOnWindowFocus: false,
    enabled: user && filters?.category_id ? true : false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      // clear manufactrurer selection if not found
      if (!res?.find((man) => +man?.id === +filters?.manufacturer_id)) {
        setFilters((prev) => ({
          ...prev,
          manufacturer_id: null,
        }));
      }
      setManufacturers(res);
    },
  });

  return (
    !!mergedShowHideFilters?.manufacturerFilter &&
    !!manufactures?.length && (
      <>
        <h3 style={{ marginTop: "16px", color: colorHeaders }}>
          {t.manufacturers}
        </h3>

        <Box
          sx={{
            display: "flex",
            gap: isMobile ? "10px" : "15px",
            flexWrap: "wrap",
          }}
        >
          {manufactures?.map((manufacturer) => (
            <Box
              key={manufacturer?.id}
              sx={{
                padding: isMobile ? "6px 10px" : "8px 15px",
                background:
                  +manufacturer?.id === +filters?.manufacturer_id
                    ? "#232323"
                    : "#FFFFFF",
                borderRadius: "10px",
                fontSize: isMobile ? "12px" : "18px",
                fontWeight: "500",
                color:
                  +manufacturer?.id === +filters?.manufacturer_id
                    ? "white"
                    : "black",
                minWidth: "fit-content",
                cursor: "pointer",
                "&:hover": {
                  opacity: "0.8",
                },
                border: "1px solid #F0F0F0",
              }}
              onClick={() => {
                // click to release selection
                if (+filters?.manufacturer_id === +manufacturer?.id) {
                  setFilters((prev) => ({
                    ...prev,
                    manufacturer_id: null,
                  }));
                } else {
                  setFilters((prev) => ({
                    ...prev,
                    manufacturer_id: manufacturer?.id,
                  }));
                }
              }}
            >
              {manufacturer?.name}
            </Box>
          ))}
        </Box>
      </>
    )
  );
}

export default ManufactrurerFilter;
