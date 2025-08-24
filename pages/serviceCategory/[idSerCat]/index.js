import DialogCentered from "@/components/DialogCentered";
import Filters from "@/components/Filters";
import MetaTags from "@/components/shared/MetaTags";
import SharedBtn from "@/components/shared/SharedBtn";
import { SERVICES, USERS, VEHICLES } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import { getFilterParams, hasAnyFilterValue } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Ads from "@/pages/category/[idCategory]/Ads";
import { Box, Divider } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CategoriesServiceSelection from "./CategoriesServiceSelection";
import Image from "next/image";
import PaginateComponent from "@/components/Pagination";
import ProductCardSkeleton from "@/components/cardSkeleton";
import ErrorIcon from "@mui/icons-material/Error";
import useLocalization from "@/config/hooks/useLocalization";
import ServiceDataInfo from "./ServiceDataInfo";
import NoServiceInsideSections from "@/components/sectionsInfo/NoServiceInsideSections";

function ServiceCategory() {
  const { t } = useLocalization();
  const router = useRouter();
  const { idSerCat, portableService } = router.query;
  const { user } = useAuth();
  const { isMobile } = useScreenSize();
  const [filters, setFilters] = useState(false);
  const [openFiltersModal, setOpenfiltersModal] = useState(false);
  const [tempFilters, setTempfilters] = useState(false);
  const [prodInfo, setProdInfo] = useState(false);
  const [page, setPage] = useState(1);
  const { selectedCar } = useSelector((state) => state.selectedCar);
  const [allServiceCategory, setAllServiceCategory] = useState([]);
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const lat = selectedAddress?.lat || defaultAddress?.lat || 24.7136;
  const lng = selectedAddress?.lng || defaultAddress?.lng || 46.6753;

  const requiredParamsReady = isAuth()
    ? Boolean(
        filters?.category_id ||
          (filters?.brand_id &&
            filters?.model_id &&
            filters?.year &&
            filters?.category_id)
      )
    : true;

  const productsQueryEnabled =
    !!idSerCat && requiredParamsReady && (!isAuth() || (isAuth() && idSerCat));

  const { data: defaultCar } = useCustomQuery({
    name: "carForServicesProducts",
    url: `${USERS}/${user?.data?.user?.id}${VEHICLES}`,
    refetchOnWindowFocus: false,
    enabled: user?.data?.user?.id && idSerCat ? true : false,
    select: (res) => res?.data?.data?.find((d) => d?.is_default),
    onSuccess: (res) => {
      setFilters({
        brand_id: selectedCar?.brand?.id || res?.brand?.id || "",
        model_id: selectedCar?.model?.id || res?.model?.id || "",
        year: selectedCar?.year || res?.year || "",
        has_active_offer: false,
        category_id: idSerCat,
      });
    },
  });

  const productsUrl = React.useMemo(() => {
    if (!requiredParamsReady || idSerCat === "first-id" || !idSerCat)
      return null;

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("per_page", isMobile ? 15 : 16);

    // Add filters, but skip any category_id in them
    const otherParams = getFilterParams(filters);
    if (otherParams) {
      const tempParams = new URLSearchParams(otherParams);
      tempParams.delete("category_id"); // remove old category_id
      tempParams.forEach((value, key) => {
        params.append(key, value);
      });
    }

    // Always append the new category_id at the end
    params.set("category_id", idSerCat);

    return `${SERVICES}?lat=${lat}&lng=${lng}&${params.toString()}`;
  }, [page, isMobile, filters, requiredParamsReady, idSerCat]);

  const { isLoading: loadPRoducts, isFetching } = useCustomQuery({
    name: [
      "products-per-category-for-service",
      page,
      idSerCat,
      defaultCar?.year,
      isMobile,
      filters,
    ],
    url: productsUrl,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    enabled:
      productsQueryEnabled && idSerCat && idSerCat !== "first-id"
        ? true
        : false,
    onSuccess: (res) => {
      const element = document.getElementById("categroy_id");
      if (element) {
        const y =
          element?.getBoundingClientRect()?.top + window.pageYOffset - 80;
        window?.scrollTo({ top: y, behavior: "smooth" });
      }
      setProdInfo(res);
    },
  });

  useEffect(() => {
    if (
      idSerCat === "first-id" &&
      allServiceCategory?.length &&
      router?.isReady
    ) {
      const newQuery = { ...router.query };
      delete newQuery.idSerCat;

      router.replace(
        {
          pathname: `/serviceCategory/${allServiceCategory[0].id}`,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [idSerCat, allServiceCategory, router]);

  return (
    <Box>
      <MetaTags title={"serviceCategory"} content={"serviceCategory"} />
      <Box className="container">
        <Box className="row">
          <Box
            className="col-12"
            sx={{
              background: "rgba(196, 225, 253, 0.10)",
              padding: isMobile ? "4px 8px" : "7px 20px",
              borderRadius: "8px",
              display: "flex",
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "500",
              color: "#429DF8",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ErrorIcon
              sx={{
                color: "#429DF8",
                width: isMobile ? 15 : "auto",
              }}
            />
            {portableService === "false"
              ? t.serviceAfterOrder
              : t.servicePortbaleAfterOrder}
          </Box>
          <Box className="col-12">
            <Ads id={idSerCat} />
          </Box>
          {!isMobile && false && (
            <Box className={`col-md-3  mt-5`}>
              <Filters
                filters={filters}
                setFilters={setFilters}
                showHideFilters={{
                  categoryFilter: false,
                }}
              />
            </Box>
          )}

          <Box className={`${true ? "col-12" : "col-9"}`}>
            <Box className="row">
              {isMobile && false && (
                <Box className="d-flex justify-content-end mt-2">
                  <Image
                    loading="lazy"
                    src={`/icons/${
                      hasAnyFilterValue({ filters })
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
                </Box>
              )}

              <Box
                className={`col-12 ${isMobile ? "mt-4" : "mt-5"}`}
                id="categroy_id"
              >
                <CategoriesServiceSelection
                  setPage={setPage}
                  setAllServiceCategory={setAllServiceCategory}
                  allServiceCategory={allServiceCategory}
                />
              </Box>
            </Box>
            <Box className="row mt-3">
              {loadPRoducts || !prodInfo ? (
                [...Array(12)].map((_, i) => (
                  <Box className="col-12 mt-1">
                    <ProductCardSkeleton
                      key={i}
                      height={isMobile ? "90px" : "115px"}
                    />
                  </Box>
                ))
              ) : (
                <>
                  {prodInfo?.data?.map((prod, index) => (
                    <Box className="col-12 mb-3 px-0" key={prod?.id}>
                      <ServiceDataInfo product={prod} />

                      {index !== prodInfo?.data?.length - 1 && (
                        <Divider
                          sx={{
                            background: "#EAECF0",
                            my: 0,
                            height: "5px",
                            borderBottomWidth: "0px",
                          }}
                        />
                      )}
                    </Box>
                  ))}
                  <Box
                    className="col-12 mt-4"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {prodInfo?.data?.length ? (
                      <PaginateComponent
                        meta={prodInfo?.meta}
                        setPage={setPage}
                        isLoading={isFetching}
                      />
                    ) : (
                      <Box
                        sx={{
                          mt: 3,
                          fontWeight: "500",
                          fontSize: "20px",
                          justifyItems: "center",
                        }}
                      >
                        {!loadPRoducts && <NoServiceInsideSections />}
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* filters appear in mobile screen only */}
      <DialogCentered
        title={null}
        subtitle={false}
        open={openFiltersModal}
        setOpen={setOpenfiltersModal}
        hasCloseIcon
        content={
          <Filters
            filters={tempFilters}
            setFilters={setTempfilters}
            showHideFilters={{
              categoryFilter: false,
            }}
          />
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
                  category_id: filters?.category_id,
                });
                updateQueryParams({
                  filters: {
                    brand_id: "",
                    model_id: "",
                    year: "",
                    category_id: filters?.category_id,
                  },
                  router: router,
                });
                setTempfilters({
                  brand_id: "",
                  model_id: "",
                  year: "",
                  category_id: filters?.category_id,
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
    </Box>
  );
}

export default ServiceCategory;
