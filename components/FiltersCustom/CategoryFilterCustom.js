import { CATEGORY, MARKETPLACE } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

function CategoryFilterCustom({
  filters,
  mergedShowHideFilters,
  setFilters,
  setAllCategories,
  allCategories,
  colorHeaders,
}) {
  const { t, locale } = useLocalization();
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
    onSuccess: setAllCategories,
  });

  const selectedCategory = filters?.category;
  const getLocalizedName = (cat) =>
    locale === "ar" ? cat?.name_ar : cat?.name_en;
  const isSelected = (cat) => getLocalizedName(cat) === selectedCategory;

  if (!mergedShowHideFilters?.categoryFilter) return null;

  return (
    <>
      <h3 style={{ color: colorHeaders }}>{t.category}</h3>
      <Box
        sx={{
          display: "flex",
          gap: isMobile ? "10px" : "15px",
          flexWrap: "wrap",
        }}
      >
        {allCategories?.map((cat) => (
          <Box
            key={cat?.id}
            sx={{
              p: isMobile ? "6px 10px" : "8px 15px",
              background: isSelected(cat) ? "#232323" : "#FFFFFF",
              borderRadius: "10px",
              fontSize: isMobile ? "12px" : "18px",
              fontWeight: 500,
              color: isSelected(cat) ? "white" : "black",
              minWidth: "fit-content",
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
              border: "1px solid #F0F0F0",
            }}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                category: isSelected(cat) ? null : getLocalizedName(cat),
              }))
            }
          >
            {cat?.name}
          </Box>
        ))}
      </Box>
    </>
  );
}

export default CategoryFilterCustom;
