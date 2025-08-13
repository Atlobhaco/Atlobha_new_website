import React, { useEffect, useState } from "react";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import CarFiltersCustom from "./CarFiltersCustom";
import ToogleProductsOfferCustom from "./ToogleProductsOfferCustom";
import CategoryFilterCustom from "./CategoryFilterCustom";
import ConditionalAttributesFilterCustom from "./ConditionalAttributesFilterCustom";
import ManufactrurerFilterCustom from "./ManufactrurerFilterCustom";
import { useRouter } from "next/router";
import { useRouteTracker } from "@/config/providers/RouteTracker";
import usePrevious from "@/config/hooks/usePrevious";

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
  const [allCategories, setAllCategories] = useState([]);

  //   useEffect(() => {
  //     const categoryChanged = prevCategory !== filters?.category;

  //     if (filters?.category?.length && categoryChanged && canUpdateLogic) {
  //       setFilters((prev) => ({
  //         ...prev,
  //         ...filters,
  //         conditionalAttributes: {},
  //       }));
  //     }
  //   }, [filters?.category, isMobile, prevCategory]);

  const getCategoryName = (cat) =>
    locale === "ar" ? cat?.name_en : cat?.name_en;

  const returnPageIntoOriginal = () => {
    const newQuery = { ...router.query, current_active_page: 1 };

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };
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
        colorHeaders={colorHeaders}
        openFiltersModal={openFiltersModal}
        returnPageIntoOriginal={returnPageIntoOriginal}
      />

      {/* <ToogleProductsOfferCustom
        mergedShowHideFilters={mergedShowHideFilters}
        filters={filters}
        setFilters={setFilters}
      /> */}

      <CategoryFilterCustom
        filters={filters}
        mergedShowHideFilters={mergedShowHideFilters}
        setFilters={setFilters}
        setAllCategories={setAllCategories}
        allCategories={allCategories}
        colorHeaders={colorHeaders}
        returnPageIntoOriginal={returnPageIntoOriginal}
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
          returnPageIntoOriginal={returnPageIntoOriginal}
        />
      )}

      {!!allCategories?.length && (
        <ManufactrurerFilterCustom
          filters={filters}
          mergedShowHideFilters={mergedShowHideFilters}
          setFilters={setFilters}
          colorHeaders={colorHeaders}
          allCategories={allCategories}
          returnPageIntoOriginal={returnPageIntoOriginal}
        />
      )}
    </div>
  );
}

export default FiltersCustom;
