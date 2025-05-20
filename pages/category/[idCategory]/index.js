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

function Category() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLocalization();
  const { idCategory } = router.query;
  const [page, setPage] = useState(1);
  const { isMobile } = useScreenSize();
  const [prodInfo, setProdInfo] = useState(false);
  const [subCatId, setSubCatId] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(false);

  useEffect(() => {
    if (idCategory) {
      setSelectedCategory(+idCategory);
    }
  }, [idCategory]);

  const { data: defaultCar } = useCustomQuery({
    name: "carForProducts",
    url: `${USERS}/${user?.data?.user?.id}${VEHICLES}`,
    refetchOnWindowFocus: false,
    enabled: user?.data?.user?.id ? true : false,
    select: (res) => res?.data?.data?.find((d) => d?.is_default),
  });

  const { isLoading: loadPRoducts, isFetching } = useCustomQuery({
    name: [
      "products-per-category",
      page,
      selectedCategory,
      defaultCar?.year,
      subCatId,
      isMobile,
    ],
    url: `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${
      isMobile ? 15 : 16
    }&category_id=${selectedCategory}&subcategory_id=${subCatId}&years[]=${
      defaultCar?.year
    }&model_ids[]=${defaultCar?.model?.id || ""}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    enabled:
      (isAuth() && selectedCategory && subCatId) || !isAuth() ? true : false,
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

  return (
    <Box>
      <MetaTags title={t.selectedProducts} content={t.selectedProducts} />

      <Box className="container">
        <Box className="row">
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
            />
          </Box>
          <Box className="col-12 mt-3">
            <SubCategorySelection
              subCategories={subCategories}
              subCatId={subCatId}
              setSubCatId={setSubCatId}
              setPage={setPage}
            />
          </Box>
          {/* <Box className="col-12 mt-5">{loadPRoducts?}</Box> */}
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
                <Box className="col-md-3 col-4 mb-3 px-0">
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
  );
}

export default Category;
