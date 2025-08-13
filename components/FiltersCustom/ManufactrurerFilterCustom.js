import { MANUFACTURERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React, { useState } from "react";

function ManufactrurerFilterCustom({
  filters,
  mergedShowHideFilters,
  setFilters,
  colorHeaders,
  allCategories,
}) {
  const { t, locale } = useLocalization();
  const { user } = useAuth();
  const { isMobile } = useScreenSize();
  const [manufactures, setManufacturers] = useState([]);

  const urlDependOnCatId = () => {
    if (filters?.category) {
      return `${MANUFACTURERS}?category_ids[]=${
        allCategories?.find(
          (cat) =>
            (locale === "ar" ? cat?.name_en : cat?.name_en) ===
            filters?.category
        )?.id
      }&is_active=1`;
    } else {
      return `${MANUFACTURERS}?is_active=1`;
    }
  };

  const selectedManufacture = filters?.manufacturer;
  const getLocalizedName = (man) =>
    locale === "ar" ? man?.name_en : man?.name_en;
  const isSelected = (man) => getLocalizedName(man) === selectedManufacture;

  useCustomQuery({
    name: ["manufactureFilters", filters?.category],
    url: urlDependOnCatId(),
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      // clear manufactrurer selection if not found in response
      if (!res?.find((man) => getLocalizedName(man) === selectedManufacture)) {
        setFilters((prev) => ({
          ...prev,
          manufacturer: null,
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
                background: isSelected(manufacturer) ? "#232323" : "#FFFFFF",
                borderRadius: "10px",
                fontSize: isMobile ? "12px" : "18px",
                fontWeight: "500",
                color: isSelected(manufacturer) ? "white" : "black",
                minWidth: "fit-content",
                cursor: "pointer",
                "&:hover": {
                  opacity: "0.8",
                },
                border: "1px solid #F0F0F0",
              }}
              onClick={() => {
                // click to release selection
                setFilters((prev) => ({
                  ...prev,
                  manufacturer: isSelected(manufacturer)
                    ? null
                    : getLocalizedName(manufacturer),
                }));
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

export default ManufactrurerFilterCustom;
