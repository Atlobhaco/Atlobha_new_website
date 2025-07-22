import PaginateComponent from "@/components/Pagination";
import ProductCardSkeleton from "@/components/cardSkeleton";
import MetaTags from "@/components/shared/MetaTags";
import ProductCard from "@/components/shared/ProductCard";
import {
  MANUFACTURERS,
  MARKETPLACE,
  PRODUCTS,
  USERS,
  VEHICLES,
} from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";

function ManufactureDetails() {
  const { t, locale } = useLocalization();
  const router = useRouter();
  const { user } = useAuth();
  const { idManufacturee, name } = router.query;
  const { isMobile } = useScreenSize();
  const [page, setPage] = useState(1);
  const [manData, setManData] = useState(false);

  const { data: defaultCar } = useCustomQuery({
    name: "defaultCarForEndpoint",
    url: `${USERS}/${user?.data?.user?.id}${VEHICLES}`,
    refetchOnWindowFocus: false,
    enabled: user?.data?.user?.id ? true : false,
    select: (res) => res?.data?.data?.find((d) => d?.is_default),
  });

  const { data: manufactureInfo } = useCustomQuery({
    name: [`manufactureInfo`, idManufacturee],
    url: `${MANUFACTURERS}/${idManufacturee}`,
    refetchOnWindowFocus: false,
    enabled: idManufacturee ? true : false,
    select: (res) => res?.data?.data,
  });

  const {
    data: manufactureProducts,
    isLoading,
    isFetching,
  } = useCustomQuery({
    name: [
      `manufacturerProducts`,
      idManufacturee,
      page,
      isMobile,
      defaultCar?.year,
    ],
    url: `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${
      isMobile ? 12 : 16
    }&manufacturer_id=${idManufacturee}&years[]=${
      defaultCar?.year || ""
    }&model_ids[]=${defaultCar?.model?.id || ""}`,
    refetchOnWindowFocus: false,
    enabled: idManufacturee ? true : false,
    select: (res) => res?.data,
    onSuccess: (res) => {
      const element = document.getElementById("products-man");
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      setManData(res);
    },
  });

  return (
    <>
      <MetaTags
        title={manufactureInfo?.name || "manufacture"}
        content={manufactureInfo?.name || "manufacture"}
      />
      {isLoading || !manData ? (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <ProductCardSkeleton height={isMobile ? "200px" : "440px"} />
            </div>
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
        <div className="container">
          <Head>
            <title>
              {locale === "en"
                ? `Atlobha- ${manufactureInfo?.seo?.title_en}`
                : `اطلبها- ${manufactureInfo?.seo?.title_ar}`}
            </title>
            <meta
              name="description"
              content={manufactureInfo?.seo?.meta_description}
            />
            <meta
              property="og:description"
              content={manufactureInfo?.seo?.meta_description}
            />
            <meta
              name="twitter:description"
              content={manufactureInfo?.seo?.meta_description}
            />
            <link
              rel="canonical"
              href={`https://atlobha.com/manufacture/${manufactureInfo.seo?.seoable_id}?name${manufactureInfo?.seo?.slug}`}
            />
            <meta
              property="og:image"
              content={manufactureInfo?.seo?.image_alt}
            />
            <meta
              name="twitter:image"
              content={manufactureInfo?.seo?.image_alt}
            />
            <meta
              name="keywords"
              content={manufactureInfo?.seo?.keywords?.join(", ")}
            />
          </Head>
          <h1
            style={{
              visibility: "hidden",
              height: "0px",
            }}
          >
            {locale === "en"
              ? `Atlobha- ${manufactureInfo?.seo?.title_en}`
              : `اطلبها- ${manufactureInfo?.seo?.title_ar}`}
          </h1>
          <div className="row">
            <div className="col-12" id="products-man">
              <Box
                sx={{
                  backgroundImage: `url(${
                    manufactureInfo?.cover_image?.url || "/imgs/no-prod-img.svg"
                  })`,
                  backgroundSize: isMobile ? "cover" : "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: manufactureInfo?.cover_image?.url
                    ? "top"
                    : "center",
                  width: "100%",
                  height: isMobile ? "115px" : "350px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  position: "relative",
                  top: "-10px",
                  zIndex: "-1",
                }}
              ></Box>
            </div>
          </div>
          <div className="row mt-1">
            {manData?.data?.map((prod) => (
              <div
                className="col-md-3 col-4 mb-3 px-0 d-flex justify-content-center"
                key={prod?.id}
              >
                <ProductCard product={prod} />
              </div>
            ))}
            {!manData?.data?.length && (
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
            {!!manData?.data?.length && (
              <PaginateComponent
                meta={manData?.meta}
                setPage={setPage}
                isLoading={isFetching}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ManufactureDetails;
