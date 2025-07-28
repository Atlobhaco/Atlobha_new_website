import React, { useEffect, useState } from "react";
import useLocalization from "@/config/hooks/useLocalization";
import CarFilters from "./CarFilters";
import ToogleProductsOffer from "./ToogleProductsOffer";
import CategoryFilter from "./CategoryFilter";
import ConditionalAttributesFilter from "./ConditionalAttributesFilter";
import ManufactrurerFilter from "./ManufactrurerFilter";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function Filters({
  filters = {
    brand_id: 3,
    model_id: 280,
    year: 2024,
    has_active_offer: false,
    category_id: 11,
    conditionalAttributes: {},
    manufacturer_id: null,
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

  const { t } = useLocalization();
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
  }, [filters?.category_id, isMobile]);

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

      <CarFilters
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

      <ToogleProductsOffer
        mergedShowHideFilters={mergedShowHideFilters}
        filters={filters}
        setFilters={setFilters}
      />

      <CategoryFilter
        filters={filters}
        mergedShowHideFilters={mergedShowHideFilters}
        setFilters={setFilters}
        setAllCategories={setAllCategories}
        allCategories={allCategories}
        colorHeaders={colorHeaders}
      />

      {(filters?.category_id === "11" ||
        filters?.category_id === "7" ||
        filters?.category_id === "2") && (
        <ConditionalAttributesFilter
          mergedShowHideFilters={mergedShowHideFilters}
          filters={filters}
          allCategories={allCategories}
          setFilters={setFilters}
          colorHeaders={colorHeaders}
        />
      )}

      <ManufactrurerFilter
        filters={filters}
        mergedShowHideFilters={mergedShowHideFilters}
        setFilters={setFilters}
        colorHeaders={colorHeaders}
      />
    </div>
  );
}

export default Filters;
