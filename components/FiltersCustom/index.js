import React, { useEffect, useState } from "react";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import CarFiltersCustom from "./CarFiltersCustom";
import ToogleProductsOfferCustom from "./ToogleProductsOfferCustom";
import CategoryFilterCustom from "./CategoryFilterCustom";
import ConditionalAttributesFilterCustom from "./ConditionalAttributesFilterCustom";
import ManufactrurerFilterCustom from "./ManufactrurerFilterCustom";
import { useRouter } from "next/router";

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
  openFiltersModal = false,
}) {
  const router = useRouter();
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
  const [brandName, setBrandName] = useState("");
  const [modelName, setModelName] = useState("");
  const [yearName, setYearName] = useState("");
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

  //   console.log(filters);
  //   {
  //     "brand": "",
  //     "model": "",
  //     "year": "",
  //     "has_active_offer": false,
  //     "manufacturer": null,
  //     "conditionalAttributes": {
  //         "oil_category": "Transmission"
  //     },
  //     "category": "Oils"
  // }

//   useEffect(() => {
//     if (router?.isReady) {
//       const {
//         brand,
//         model,
//         year,
//         has_active_offer,
//         manufacturer,
//         conditionalAttributes,
//         category,
//       } = router.query;
//       console.log("router", router?.query);
//       setFilters({
//         // ...filters,
//         brand: +brand ? +brand : filters?.brand,
//         model: +brand ? (+model ? +model : "") : filters?.model,
//         year: +brand ? (+year ? +year : "") : filters?.year,
//         has_active_offer: has_active_offer === "true" ? true : false,
//         manufacturer: manufacturer?.length
//           ? manufacturer
//           : filters?.manufacturer,
//         conditionalAttributes: conditionalAttributes
//           ? JSON.parse(conditionalAttributes)
//           : filters?.conditionalAttributes,
//         category: category?.length ? category : filters?.category,
//       });
//     }
//   }, [router.isReady]);

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
        brandName={brandName}
        setBrandName={setBrandName}
        modelName={modelName}
        setModelName={setModelName}
        yearName={yearName}
        setYearName={setYearName}
        colorHeaders={colorHeaders}
		openFiltersModal={openFiltersModal}
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
