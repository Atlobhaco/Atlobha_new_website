import { CATEGORY, MARKETPLACE } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

function CategoryFilter({
  filters,
  mergedShowHideFilters,
  setFilters,
  setAllCategories,
  allCategories,
  colorHeaders,
}) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const lat = selectedAddress?.lat || defaultAddress?.lat || 24.7136;
  const lng = selectedAddress?.lng || defaultAddress?.lng || 46.6753;

  useCustomQuery({
    name: ["categoriesForfilters", lng],
    url: `${MARKETPLACE}${CATEGORY}?lat=${lat}&lng=${lng}`,
    enabled: !!lng,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => setAllCategories(res),
  });

  return (
    mergedShowHideFilters?.categoryFilter && (
      <>
        <h3
          style={{
            color: colorHeaders,
          }}
        >
          {t.category}
        </h3>
        <Box
          sx={{
            display: "flex",
            gap: isMobile ? "10px" : "15px",
            flexWrap: "wrap",
          }}
        >
          {allCategories?.map((category) => (
            <Box
              key={category?.id}
              sx={{
                padding: isMobile ? "6px 10px" : "8px 15px",
                background:
                  +category?.id === +filters?.category_id
                    ? "#232323"
                    : "#FFFFFF",
                borderRadius: "10px",
                fontSize: isMobile ? "12px" : "18px",
                fontWeight: "500",
                color:
                  +category?.id === +filters?.category_id ? "white" : "black",
                minWidth: "fit-content",
                cursor: "pointer",
                "&:hover": {
                  opacity: "0.8",
                },
                border: "1px solid #F0F0F0",
              }}
              onClick={() => {
                setFilters((prev) => ({ ...prev, category_id: category?.id }));
              }}
            >
              {category?.name}
            </Box>
          ))}
        </Box>
      </>
    )
  );
}

export default CategoryFilter;
