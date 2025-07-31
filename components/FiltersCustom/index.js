import React, { useEffect, useState } from "react";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import CarFiltersCustom from "./CarFiltersCustom";
import ToogleProductsOfferCustom from "./ToogleProductsOfferCustom";
import CategoryFilterCustom from "./CategoryFilterCustom";
import ConditionalAttributesFilterCustom from "./ConditionalAttributesFilterCustom";
import ManufactrurerFilterCustom from "./ManufactrurerFilterCustom";

function FiltersCustom({
  // filters accpet string (names) for this is custom
  filters = {
    brand: 3,
    model: 280,
    year: 2024,
    has_active_offer: false,
    category: 11,
    conditionalAttributes: {},
    manufacturer: null,
  },
  setFilters = () => {},
  showHideFilters = {},
}) {
  const colorHeaders = "black";
  const { isMobile } = useScreenSize();

  const defaultShowHideFilters = {
    carFilter: true,
    toggleProductsOffer: true,
    categoryFilter: true,
    conditionsAttributes: true,
    manufacturerFilter: true,
  };

  //  Merge passed props with defaults
  const mergedShowHideFilters = {
    ...defaultShowHideFilters,
    ...showHideFilters,
  };

  const { t, locale } = useLocalization();
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [yearId, setYearId] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  /* -------------------------------------------------------------------------- */
  /*               clear condtional attribute with change category              */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      conditionalAttributes: {},
    }));
  }, [filters?.category, isMobile]);

  const getCategoryName = (cat) =>
    locale === "ar" ? cat?.name_ar : cat?.name_en;

  return (
    <div>
      {!isMobile && (
        <h1
          style={{
            color: colorHeaders,
          }}
        >
          {t.filter}
        </h1>
      )}

      <CarFiltersCustom
        mergedShowHideFilters={mergedShowHideFilters}
        filters={filters}
        setFilters={setFilters}
        brandId={brandId}
        setBrandId={setBrandId}
        modelId={modelId}
        setModelId={setModelId}
        yearId={yearId}
        setYearId={setYearId}
        colorHeaders={colorHeaders}
      />

      <ToogleProductsOfferCustom
        mergedShowHideFilters={mergedShowHideFilters}
        filters={filters}
        setFilters={setFilters}
      />

      <CategoryFilterCustom
        filters={filters}
        mergedShowHideFilters={mergedShowHideFilters}
        setFilters={setFilters}
        setAllCategories={setAllCategories}
        allCategories={allCategories}
        colorHeaders={colorHeaders}
      />

      {(allCategories?.find((cat) => getCategoryName(cat) === filters?.category)
        ?.id === 11 ||
        allCategories?.find((cat) => getCategoryName(cat) === filters?.category)
          ?.id === 7 ||
        allCategories?.find((cat) => getCategoryName(cat) === filters?.category)
          ?.id === 2) && (
        <ConditionalAttributesFilterCustom
          mergedShowHideFilters={mergedShowHideFilters}
          filters={filters}
          allCategories={allCategories}
          setFilters={setFilters}
          colorHeaders={colorHeaders}
        />
      )}

      <ManufactrurerFilterCustom
        filters={filters}
        mergedShowHideFilters={mergedShowHideFilters}
        setFilters={setFilters}
        colorHeaders={colorHeaders}
        allCategories={allCategories}
      />
    </div>
  );
}

export default FiltersCustom;
