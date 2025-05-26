import HeaderSection from "@/components/HeaderSection";
import PaginateComponent from "@/components/Pagination";
import ProductCard from "@/components/shared/ProductCard";
import { CATEGORY, MARKETPLACE, PRODUCTS } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

function CategoriesProducts({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const router = useRouter();

  const { t } = useLocalization();
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);

  const returnUrlDependOnCar = () => {
    if (selectedCar?.model?.id || defaultCar?.model?.id) {
      return `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${
        isMobile ? 10 : 10
      }&category_id=${sectionInfo?.marketplace_category?.id}&model_id=${
        selectedCar?.model?.id || defaultCar?.model?.id
      }`;
    }
    return `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${
      isMobile ? 10 : 10
    }&category_id=${sectionInfo?.marketplace_category?.id}`;
  };

  const { isLoading } = useCustomQuery({
    name: [
      `marketplace-category${sectionInfo?.id}`,
      sectionInfo?.is_active,
      isMobile,
      page,
      selectedCar?.model?.id,
      defaultCar?.model?.id,
    ],
    url: returnUrlDependOnCar(),
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active,
    select: (res) => res?.data,
    onSuccess: (res) => setAllData(res),
  });
  return !sectionInfo?.is_active || !allData?.data?.length ? null : (
    <Box
      sx={{
        display: "flex",
        gap: isMobile ? "10px" : "25px",
        flexDirection: "column",
      }}
    >
      <HeaderSection
        showArrow={true}
        subtitle={t.showAll}
        title={sectionInfo?.title}
        onClick={() =>
          router.push(`/category/${sectionInfo?.marketplace_category?.id}`)
        }
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: isMobile ? "no-wrap" : "wrap",
          gap: isMobile ? "5px" : "20px",
          justifyContent: isMobile ? "start" : "start",
          overflow: "auto hidden",
        }}
      >
        {allData?.data?.map((prod) => (
          <Box>
            <ProductCard product={prod} hasNum={prod?.image} />
          </Box>
        ))}
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", mt: isMobile ? 1 : 2 }}
      >
        <PaginateComponent
          meta={allData?.meta}
          setPage={setPage}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
}

export default CategoriesProducts;
