import ProductCardSkeleton from "@/components/cardSkeleton";
import ComingSoon from "@/components/comingSoon";
import MetaTags from "@/components/shared/MetaTags";
import useCustomQuery from "@/config/network/Apiconfig";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProdImages from "../../../components/ProductDetails/ProdImages";
import ManufactureData from "../../../components/ProductDetails/ManufactureData";
import TitlePrice from "../../../components/ProductDetails/TitlePrice";
import DeliveryTime from "../../../components/ProductDetails/DeliveryTime";
import CompatibleWith from "../../../components/ProductDetails/CompatibleWith";
import DetailsProd from "../../../components/ProductDetails/DetailsProd";
import AnotherProducts from "../../../components/ProductDetails/AnotherProducts";
import AddToBasketProdDetails from "../../../components/ProductDetails/AddToBasketProdDetails";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useLocalization from "@/config/hooks/useLocalization";
import Head from "next/head";

function ProductDetails() {
  const { t, locale } = useLocalization();
  const {
    query: { idProd },
  } = useRouter();
  const router = useRouter();

  const [cityDelivery, setCityDelivery] = useState(14);
  const { isMobile } = useScreenSize();
  const {
    data,
    isFetching: ProdDetailsFetch,
    refetch: callProdDetails,
  } = useCustomQuery({
    name: ["prodDetails", idProd],
    url: `/marketplace/product/${idProd}/show`,
    refetchOnWindowFocus: false,
    enabled: !!idProd,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(t.someThingWrong);
    },
  });

  useEffect(() => {
    if (idProd && data?.name) {
      window.webengage.onReady(() => {
        webengage.track("PRODUCT_VIEWED", {
          product_id: data?.id || "",
          product_name: data?.name || "",
          product_image: data?.image || "",
          price: data?.price || "",
          car_brand: data?.brand?.name || "",
          car_model: data?.model?.name || "",
          car_year: data?.year_from || "",
          reference_number: data?.ref_num || "",
          product_details: data?.desc || "",
          installation_available: false || "",
          category: data?.marketplace_category?.name || "",
          product_url: `/product/${idProd}` || "",
        });
        window.gtag("event", "PRODUCT_VIEWED", {
          product_id: data?.id || "",
          product_name: data?.name || "",
          product_image: data?.image || "",
          price: data?.price || "",
          car_brand: data?.brand?.name || "",
          car_model: data?.model?.name || "",
          car_year: data?.year_from || "",
          reference_number: data?.ref_num || "",
          product_details: data?.desc || "",
          installation_available: false || "",
          category: data?.marketplace_category?.name || "",
          product_url: `/product/${idProd}` || "",
        });
      });

      router.push({
        pathname: router.pathname, // or a specific path like '/products'
        query: {
          ...router.query, // preserve existing
          name: data?.name,
          desc: data?.desc,
          tags: data?.combined_tags[0]?.name_ar,
          category: data?.marketplace_category?.name,
          subCategory: data?.marketplace_subcategory?.name,
          model: data?.model?.name,
          num: data?.ref_num,
          price: data?.price,
          img: data?.image,
        },
      });
    }
  }, [idProd, data]);

  return (
    <Box>
      {ProdDetailsFetch ? (
        <ProductCardSkeleton height={"400px"} />
      ) : (
        <div className={`container`}>
          {data && (
            <Head>
              <title>
                {locale === "en"
                  ? `Atlobha- ${data?.seo?.title_en}`
                  : `اطلبها- ${data?.seo?.title_ar}`}
              </title>
              <meta name="description" content={data?.seo?.meta_description} />
              <meta
                property="og:description"
                content={data?.seo?.meta_description}
              />
              <meta
                name="twitter:description"
                content={data?.seo?.meta_description}
              />
              <link
                rel="canonical"
                href={`https://atlobha.com/product/${data.seo?.seoable_id}?name${data?.seo?.slug}`}
              />
              <meta property="og:image" content={data?.seo?.image_alt} />
              <meta name="twitter:image" content={data?.seo?.image_alt} />
              <meta name="keywords" content={data?.seo?.keywords?.join(", ")} />
            </Head>
          )}
          <div className="row">
            <div className={`col-12 col-md-4 ${isMobile ? "mt-3" : "mt-5"}`}>
              {data && <ProdImages prod={data} />}
              <AddToBasketProdDetails prod={data} />
            </div>
            <div
              className={`col-12 col-md-8  ${isMobile ? "mt-3" : "mt-5 px-4"}`}
            >
              {data?.manufacturer && (
                <Box sx={{ mb: 2 }}>
                  <ManufactureData prod={data} />
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <TitlePrice prod={data} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <DeliveryTime
                  prod={data}
                  cityDelivery={cityDelivery}
                  setCityDelivery={setCityDelivery}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <CompatibleWith prod={data} />
              </Box>
              <Box sx={{ mb: 3 }}>
                <DetailsProd prod={data} />
              </Box>
              {/* <Box sx={{ mb: 2 }}>
                <AnotherProducts prod={data} />
              </Box> */}
            </div>
          </div>
        </div>
      )}
    </Box>
  );
}

export default ProductDetails;
