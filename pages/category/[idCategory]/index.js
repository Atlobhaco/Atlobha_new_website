import MetaTags from "@/components/shared/MetaTags";
import {
  MARKETPLACE,
  PRODUCTS,
  USERS,
  VEHICLES,
} from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Ads from "./Ads";
import CategoriesSelection from "./CategoriesSelection";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useAuth } from "@/config/providers/AuthProvider";
import SubCategorySelection from "./SubCategorySelection";
import ProductCardSkeleton from "@/components/cardSkeleton";
import ProductCard from "@/components/shared/ProductCard";
import PaginateComponent from "@/components/Pagination";
import useLocalization from "@/config/hooks/useLocalization";
import { isAuth } from "@/config/hooks/isAuth";
import Head from "next/head";
import Filters from "@/components/Filters";
import { useSelector } from "react-redux";
import {
  getFilterParams,
  hasAnyFilterValue,
  updateQueryParams,
} from "@/constants/helpers";
import Image from "next/image";
import DialogCentered from "@/components/DialogCentered";
import SharedBtn from "@/components/shared/SharedBtn";
import useResetPageOnFilterChange from "@/config/hooks/useResetPageOnFilterChange";

function Category() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, locale } = useLocalization();
  const { idCategory, idSub } = router.query;
  const [page, setPage] = useState(1);
  const { isMobile } = useScreenSize();
  const [prodInfo, setProdInfo] = useState(false);
  const [subCatId, setSubCatId] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const { selectedCar } = useSelector((state) => state.selectedCar);
  const [filters, setFilters] = useState(false);
  const [openFiltersModal, setOpenfiltersModal] = useState(false);
  const [tempFilters, setTempfilters] = useState(false);

  useEffect(() => {
    if (idCategory) {
      setSelectedCategory(+idCategory);
      setFilters({
        ...filters,
        category_id: idCategory,
        conditionalAttributes:
          +idCategory !== +filters?.category_id
            ? {}
            : filters?.conditionalAttributes,
      });
    }
  }, [idCategory]);

  useEffect(() => {
    if (idSub) {
      setSubCatId(+idSub);
    }
  }, [idSub]);

  const { data: defaultCar } = useCustomQuery({
    name: "carForProducts",
    url: `${USERS}/${user?.data?.user?.id}${VEHICLES}`,
    refetchOnWindowFocus: false,
    enabled: user?.data?.user?.id ? true : false,
    select: (res) => res?.data?.data?.find((d) => d?.is_default),
    onSuccess: (res) => {
      setFilters({
        brand_id: selectedCar?.brand?.id || res?.brand?.id,
        model_id: selectedCar?.model?.id || res?.model?.id,
        year: selectedCar?.year || res?.year,
        has_active_offer: false,
        category_id: idCategory,
      });
    },
  });

  const returnUrlDependOnUserLogin = () => {
    const params = new URLSearchParams();

    params.set("page", page);
    params.set("per_page", isMobile ? 15 : 16);
    params.set("subcategory_id", subCatId);

    if (filters?.year) params.append("years[]", filters.year);
    if (filters?.model_id) params.append("model_ids[]", filters.model_id);
    if (filters?.brand_id) params.append("brand_ids[]", filters.brand_id);

    // Append other filters from getFilterParams
    const otherParams = getFilterParams(filters);
    if (otherParams) {
      new URLSearchParams(otherParams).forEach((value, key) => {
        params.append(key, value);
      });
    }

    return `${MARKETPLACE}${PRODUCTS}?${params.toString()}`;
  };

  const { isLoading: loadPRoducts, isFetching } = useCustomQuery({
    name: [
      "products-per-category",
      page,
      //   selectedCategory,
      defaultCar?.year,
      subCatId,
      isMobile,
      filters,
    ],
    url: returnUrlDependOnUserLogin(),
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    enabled: !!(
      (isAuth() && selectedCategory && subCatId) ||
      (!isAuth() && subCatId)
    ),
    onSuccess: (res) => {
      //   const element = document.getElementById("categroy_id");
      //   if (element) {
      //     const y =
      //       element?.getBoundingClientRect()?.top + window.pageYOffset - 80;
      //     window?.scrollTo({ top: y, behavior: "smooth" });
      //   }
      setProdInfo(res);
    },
  });

  useEffect(() => {
    if (allCategories?.length) {
      const selected = allCategories.find((d) => +d.id === +idCategory);
      window.webengage.onReady(() => {
        webengage.track("FEATURED_PRODUCT_VIEWED", {
          category_name: selected?.name || "",
          category_id: selected?.id || "",
          category_url: router?.asPath || "",
        });
      });
    }
  }, [allCategories]);

  //  reset page  into default if the filters chaged its value
  useResetPageOnFilterChange(filters, setPage);

  return (
    <Box>
      <MetaTags title={t.selectedProducts} content={t.selectedProducts} />
      <h1
        style={{
          visibility: "hidden",
          height: "0px",
        }}
      >
        {locale === "en"
          ? `Atlobha- ${
              allCategories.find((d) => +d.id === +idCategory)?.seo?.title_en
            }`
          : `اطلبها- ${
              allCategories.find((d) => +d.id === +idCategory)?.seo?.title_ar
            }`}
      </h1>

      {!!allCategories?.length && (
        <Head>
          <title>
            {locale === "en"
              ? `Atlobha- ${
                  allCategories.find((d) => +d.id === +idCategory)?.seo
                    ?.title_en
                }`
              : `اطلبها- ${
                  allCategories.find((d) => +d.id === +idCategory)?.seo
                    ?.title_ar
                }`}
          </title>
          <meta
            name="description"
            content={
              allCategories.find((d) => +d.id === +idCategory)?.seo
                ?.meta_description
            }
          />
          <meta
            property="og:description"
            content={
              allCategories.find((d) => +d.id === +idCategory)?.seo
                ?.meta_description
            }
          />
          <meta
            name="twitter:description"
            content={
              allCategories.find((d) => +d.id === +idCategory)?.seo
                ?.meta_description
            }
          />
          <link
            rel="canonical"
            href={`https://atlobha.com/category/${
              allCategories.find((d) => +d.id === +idCategory)?.seo?.seoable_id
            }?name${
              allCategories.find((d) => +d.id === +idCategory)?.seo?.slug
            }&idSub=${idSub}`}
          />
          <meta
            property="og:image"
            content={
              allCategories.find((d) => +d.id === +idCategory)?.seo?.image_alt
            }
          />
          <meta
            name="twitter:image"
            content={
              allCategories.find((d) => +d.id === +idCategory)?.seo?.image_alt
            }
          />
          <meta
            name="keywords"
            content={allCategories
              .find((d) => +d.id === +idCategory)
              ?.seo?.keywords?.join(", ")}
          />
        </Head>
      )}
      <Box className="container">
        <Box className="row">
          {!isMobile && (
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
          <Box className={`${isMobile ? "col-12" : "col-9"}`}>
            <Box className="row">
              {isMobile && (
                <Box className="d-flex justify-content-end">
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
              <Box className="col-12">
                <Ads id={selectedCategory} />
              </Box>
              <Box
                className={`col-12 ${isMobile ? "mt-4" : "mt-5"}`}
                id="categroy_id"
              >
                <CategoriesSelection
                  setSelectedCategory={setSelectedCategory}
                  selectedCategory={selectedCategory}
                  setSubCatId={setSubCatId}
                  setSubCategories={setSubCategories}
                  setPage={setPage}
                  setAllCategories={setAllCategories}
                />
              </Box>
              <Box className="col-12 mt-3">
                <SubCategorySelection
                  subCategories={subCategories}
                  subCatId={subCatId}
                  setSubCatId={setSubCatId}
                  setPage={setPage}
                  selectedCategory={selectedCategory}
                />
              </Box>
            </Box>
            <Box className="row mt-3">
              {loadPRoducts || !prodInfo ? (
                [...Array(12)].map((_, i) => (
                  <Box className="col-md-3 col-4 mt-1">
                    <ProductCardSkeleton
                      key={i}
                      height={isMobile ? "200px" : "440px"}
                    />
                  </Box>
                ))
              ) : (
                <>
                  {prodInfo?.data?.map((prod) => (
                    <Box className="col-md-4 col-4 mb-3 px-0">
                      <ProductCard product={prod} />
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
                        }}
                      >
                        {t.noResultsFound}
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

export default Category;
