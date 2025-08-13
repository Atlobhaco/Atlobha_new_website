import DialogCentered from "@/components/DialogCentered";
import Filters from "@/components/Filters";
import PaginateComponent from "@/components/Pagination";
import ProductCardSkeleton from "@/components/cardSkeleton";
import ProductCard from "@/components/shared/ProductCard";
import SharedBtn from "@/components/shared/SharedBtn";
import { MARKETPLACE, PRODUCTS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useResetPageOnFilterChange from "@/config/hooks/useResetPageOnFilterChange";
import useCustomQuery from "@/config/network/Apiconfig";
import {
  getFilterParams,
  hasAnyFilterValue,
  updateQueryParams,
} from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Products() {
  const router = useRouter();
  const {
    query: { tagId, tagName, tagColor, tagNameEn },
  } = useRouter();
  const { t, locale } = useLocalization();
  const [page, setPage] = useState(1);
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);
  const { isMobile } = useScreenSize();
  const [allProducts, setAllProducts] = useState(false);
  const [filters, setFilters] = useState(false);
  const [openFiltersModal, setOpenfiltersModal] = useState(false);
  const [tempFilters, setTempfilters] = useState(false);

  const returnUrlDependOnCar = () => {
    if (selectedCar?.model?.id || defaultCar?.model?.id) {
      return `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${
        isMobile ? 12 : 16
      }&model_id=${selectedCar?.model?.id || defaultCar?.model?.id}&brand_id=${
        selectedCar?.brand?.id || defaultCar?.brand?.id
      }&year=${
        selectedCar?.year || defaultCar?.year
      }&tag_id=${tagId}&${getFilterParams(filters)}`;
    }
    return `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${
      isMobile ? 12 : 16
    }&tag_id=${tagId}&${getFilterParams(filters)}`;
  };

  const {
    data: productsResult,
    isLoading,
    isFetching,
  } = useCustomQuery({
    name: ["products", tagId, page, isMobile, filters],
    url: returnUrlDependOnCar(),
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    onSuccess: (res) => {
      const element = document.getElementById("all-products");
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      setAllProducts(res?.data);
    },
  });

  //   useEffect(() => {
  //     if (selectedCar?.id || defaultCar?.id) {
  //       if (router?.query?.savedQuerys !== "true" && router.isReady) {
  //         setFilters({
  //           brand_id: defaultCar?.brand?.id || selectedCar?.brand?.id,
  //           model_id: defaultCar?.model?.id || selectedCar?.model?.id,
  //           year: defaultCar?.year || selectedCar?.year,
  //           has_active_offer: false,
  //         });
  //         updateQueryParams({
  //           filters: {
  //             ...filters,
  //             brand_id: defaultCar?.brand?.id || selectedCar?.brand?.id,
  //             model_id: defaultCar?.model?.id || selectedCar?.model?.id,
  //             year: defaultCar?.year || selectedCar?.year,
  //             has_active_offer: false,
  //           },
  //           router: router,
  //         });
  //       }
  //     }
  //   }, [defaultCar, selectedCar, router.isReady]);
  //   console.log("router", router?.query);

  //  reset page  into default if the filters chaged its value
  //   useResetPageOnFilterChange(filters, setPage);

  return (
    <div>
      <div
        className={`container ${isMobile ? "mt-3" : "mt-5"}`}
        id="all-products"
      >
        <div className="row mt-1">
          {/* {!isMobile && (
            <div className={`col-md-3`}>
              <Filters filters={filters} setFilters={setFilters} />
            </div>
          )} */}
          <div className="col-12">
            {/* {isMobile && (
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
            )}{" "} */}
            <div className="row">
              <div className="col-12">
                <Box
                  sx={{
                    padding: "0px 4px",
                    borderRadius: "4px",
                    background: tagColor,
                    color: "white",
                    fontWeight: "500",
                    fontSize: isMobile ? "15px" : "18px",
                    cursor: "pointer",
                    width: "fit-content",
                    mb: 2,
                  }}
                >
                  {locale === "ar" ? tagName : tagNameEn}
                </Box>
              </div>

              {isLoading || !allProducts ? (
                <div className="container">
                  <divdiv className="row">
                    {[...Array(8)].map((_, i) => (
                      <div className="col-md-3 col-4">
                        <ProductCardSkeleton
                          key={i}
                          height={isMobile ? "200px" : "440px"}
                        />
                      </div>
                    ))}
                  </divdiv>
                </div>
              ) : (
                <>
                  {allProducts?.map((prod) => (
                    <div
                      className="col-md-3 col-4 mb-3 d-flex justify-content-center"
                      key={prod?.id}
                    >
                      <ProductCard product={prod} />
                    </div>
                  ))}
                  {!allProducts?.length && (
                    <Box
                      sx={{
                        mt: 5,
                        fontWeight: "500",
                        fontSize: "20px",
                        textAlign: "center",
                      }}
                    >
                      {t.noResultsFound}
                    </Box>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-12 d-flex justify-content-center mt-5">
          {!!allProducts?.length && (
            <PaginateComponent
              meta={productsResult?.meta}
              setPage={setPage}
              isLoading={isFetching}
            />
          )}
        </div>
      </div>

      {/* filters appear in mobile screen only */}
      <DialogCentered
        title={null}
        subtitle={false}
        open={openFiltersModal}
        setOpen={setOpenfiltersModal}
        hasCloseIcon
        content={<Filters filters={tempFilters} setFilters={setTempfilters} />}
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
                  brand_id: "",
                  model_id: "",
                  year: "",
                  category: "",
                });
                updateQueryParams({
                  filters: {
                    brand_id: "",
                    model_id: "",
                    year: "",
                    category: "",
                  },
                  router: router,
                });
                setTempfilters({
                  brand_id: "",
                  model_id: "",
                  year: "",
                  category: "",
                });
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
    </div>
  );
}

export default Products;
