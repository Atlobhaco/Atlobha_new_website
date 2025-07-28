import PaginateComponent from "@/components/Pagination";
import ProductCardSkeleton from "@/components/cardSkeleton";
import ProductCard from "@/components/shared/ProductCard";
import { MARKETPLACE, PRODUCTS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function Products() {
  const {
    query: { tagId },
  } = useRouter();
  const { t, locale } = useLocalization();
  const [page, setPage] = useState(1);
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);
  const { isMobile } = useScreenSize();
  const [allProducts, setAllProducts] = useState(false);

  const returnUrlDependOnCar = () => {
    if (selectedCar?.model?.id || defaultCar?.model?.id) {
      return `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${
        isMobile ? 12 : 16
      }&model_id=${
        selectedCar?.model?.id || defaultCar?.model?.id
      }&tag_id=${tagId}`;
    }
    return `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${
      isMobile ? 12 : 16
    }&tag_id=${tagId}`;
  };

  const {
    data: productsResult,
    isLoading,
    isFetching,
  } = useCustomQuery({
    name: ["products", tagId, page, isMobile],
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

  return (
    <div>
      {isLoading || !allProducts ? (
        <div className="container">
          <div className="row">
            {[...Array(8)].map((_, i) => (
              <div className="col-md-3 col-4">
                <ProductCardSkeleton
                  key={i}
                  height={isMobile ? "200px" : "440px"}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mt-5" id="all-products">
          <div className="row mt-1">
            {allProducts?.map((prod) => (
              <div
                className="col-md-3 col-4 mb-3 px-0 d-flex justify-content-center"
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
      )}
    </div>
  );
}

export default Products;
