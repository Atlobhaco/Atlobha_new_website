import FiltersCustom from "@/components/FiltersCustom";
import PaginateComponent from "@/components/Pagination";
import ProductCardSkeleton from "@/components/cardSkeleton";
import ProductCard from "@/components/shared/ProductCard";
import { SEARCH } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import { getFilterParams, hasAnyFilterValue } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import SharedBtn from "@/components/shared/SharedBtn";
import DialogCentered from "@/components/DialogCentered";
import SearchSuggestionsMobile from "@/components/SearchPageMobile";
import GlobalSearchNoResults from "@/components/GlobalSearchNoResults";
import { useRouteTracker } from "@/config/providers/RouteTracker";
import { isAuth } from "@/config/hooks/isAuth";

function Search() {
  const router = useRouter();
  const {
    query: { keyword, type },
  } = useRouter();
  const { prevRoute } = useRouteTracker();

  const [page, setPage] = useState(+router?.current_active_page || 1);
  const [allData, setAllData] = useState([]);
  const { isMobile } = useScreenSize();
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    year: "",
    has_active_offer: false,
    category: "",
    conditionalAttributes: {},
    manufacturer: "",
  });
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);
  const [openFiltersModal, setOpenfiltersModal] = useState(false);
  const [tempFilters, setTempfilters] = useState(false);
  const [canSavefilters, setCanSaveFilters] = useState(false);
  const urlsForBackActions = ["product", "spareParts"];

  const { isFetching, isLoading } = useCustomQuery({
    name: ["searchFor", keyword, type, page, filters],
    url: `${SEARCH}?page=${page}&per_page=12&keyword=${keyword}&class=${type}&${getFilterParams(
      filters
    )}`,
    enabled: keyword && type ? true : false,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    onSuccess: (res) => {
      setAllData(res);
    },
  });

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

  useEffect(() => {
    if (canSavefilters) {
      const globalSearchData = {
        keyword, // <-- save keyword
        ...filters,
      };
      localStorage.setItem("globalSearch", JSON.stringify(globalSearchData));
    }
  }, [filters, canSavefilters, keyword]);

  //   const returnPageIntoOriginal = (router) => {
  // 	if (!router?.isReady) return;

  // 	const newQuery = {
  // 	  ...router.query,
  // 	  current_active_page: 1,
  // 	};

  // 	router.replace(
  // 	  {
  // 		pathname: router.pathname,
  // 		query: newQuery,
  // 	  },
  // 	  undefined,
  // 	  { shallow: true }
  // 	);
  //   };

  useEffect(() => {
    const savedSearch = JSON.parse(localStorage.getItem("globalSearch"));
    const savedKeyword = savedSearch?.keyword;

    if (!router?.isReady) return;

    if (!isAuth()) {
      setCanSaveFilters(true);
      return;
    }

    const car = selectedCar?.id ? selectedCar : defaultCar;

    if (prevRoute) {
      if (savedKeyword && savedKeyword === keyword) {
        const { keyword: _, ...filtersOnly } = savedSearch;
        setTimeout(() => {
          setFilters({ ...filtersOnly });
          setCanSaveFilters(true);
        }, 500);
      } else {
        setFilters({
          brand: car?.brand?.name_en || "",
          model: car?.model?.name_en || "",
          year: car?.year || "",
          has_active_offer: false,
          category: "",
          conditionalAttributes: {},
          manufacturer: "",
        });
        setCanSaveFilters(true);
        returnPageIntoOriginal(router);
      }
    } else {
      setFilters({
        brand: car?.brand?.name_en || "",
        model: car?.model?.name_en || "",
        year: car?.year || "",
        has_active_offer: false,
        category: "",
        conditionalAttributes: {},
        manufacturer: "",
      });
      setCanSaveFilters(true);
      returnPageIntoOriginal(router);
    }
  }, [prevRoute, keyword, selectedCar, defaultCar, router.isReady]);

  return isMobile && !keyword ? (
    <SearchSuggestionsMobile />
  ) : (
    <>
      <div className={`container ${isMobile ? "mt-3" : "mt-5"}`}>
        <div className="row mt-1">
          {!isMobile && (
            <div className={`col-md-3`}>
              <FiltersCustom filters={filters} setFilters={setFilters} />
            </div>
          )}
          <div className={`${isMobile ? "col-12" : "col-9"}`}>
            {isMobile && (
              <div className="d-flex justify-content-end">
                <Image
                  loading="lazy"
                  src={`/icons/${
                    hasAnyFilterValue({ filters, excludeKeys: [] })
                      ? "colored-filter.svg"
                      : "filter.svg"
                  }`}
                  width={isMobile ? 24 : 30}
                  height={isMobile ? 24 : 30}
                  alt="filter"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpenfiltersModal(true);
                    setTempfilters(filters);
                  }}
                />
              </div>
            )}{" "}
            <div className={`row ${isMobile && "mt-3"}`}>
              {isLoading || isFetching || !allData ? (
                <div className="container">
                  <div className="row">
                    {[...Array(12)].map((_, i) => (
                      <div className="col-md-4 col-4">
                        <ProductCardSkeleton
                          key={i}
                          height={isMobile ? "200px" : "440px"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {allData?.data?.map((prod) => (
                    <div
                      className="col-md-4 col-4 mb-3 px-0 d-flex justify-content-center"
                      key={prod?.id}
                    >
                      <ProductCard product={prod} />
                    </div>
                  ))}
                  {!allData?.data?.length && !isFetching && (
                    <Box
                      sx={{
                        mt: 5,
                        fontWeight: "500",
                        fontSize: "20px",
                        textAlign: "center",
                      }}
                    >
                      <GlobalSearchNoResults />
                    </Box>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {!!allData?.data?.length && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <PaginateComponent
            meta={allData?.meta}
            setPage={setPage}
            isLoading={isLoading}
          />
        </Box>
      )}

      {/* filters appear in mobile screen only */}
      <DialogCentered
        title={null}
        subtitle={false}
        open={openFiltersModal}
        setOpen={setOpenfiltersModal}
        hasCloseIcon
        content={
          <FiltersCustom filters={tempFilters} setFilters={setTempfilters} />
        }
        renderCustomBtns={
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              gap: "5px",
            }}
          >
            <SharedBtn
              customStyle={{
                width: "100%",
              }}
              onClick={() => {
                setFilters(tempFilters);
                setOpenfiltersModal(false);
                returnPageIntoOriginal();
              }}
              className="big-main-btn"
              text="showResults"
            />
            <SharedBtn
              customStyle={{
                width: "100%",
              }}
              onClick={() => {
                setOpenfiltersModal(false);
                setFilters({
                  brand: "",
                  model: "",
                  year: "",
                  category: "",
                });
                setTempfilters({
                  brand: "",
                  model: "",
                  year: "",
                  category: "",
                });
                returnPageIntoOriginal();
              }}
              className="outline-btn"
              text="reset"
            />
          </Box>
        }
        actionsWhenClose={() => {
          setOpenfiltersModal(false);
          setTempfilters(filters);
        }}
      />
    </>
  );
}

export default Search;
