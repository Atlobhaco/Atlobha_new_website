import ProductCardSkeleton from "@/components/cardSkeleton";
import ComingSoon from "@/components/comingSoon";
import MetaTags from "@/components/shared/MetaTags";
import useCustomQuery from "@/config/network/Apiconfig";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ProdImages from "../ProdImages";
import ManufactureData from "../ManufactureData";
import TitlePrice from "../TitlePrice";
import DeliveryTime from "../DeliveryTime";
import CompatibleWith from "../CompatibleWith";
import DetailsProd from "../DetailsProd";
import AnotherProducts from "../AnotherProducts";
import AddToBasketProdDetails from "../AddToBasketProdDetails";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function ProductDetails() {
  const {
    query: { idProd },
  } = useRouter();
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
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      toast.error(t.someThingWrong);
    },
  });

  return (
    <Box>
      <MetaTags title={data?.name} content={data?.name} />
      {ProdDetailsFetch ? (
        <ProductCardSkeleton height={"400px"} />
      ) : (
        <div className={`container`}>
          <div className="row">
            <div className={`col-12 col-md-4 ${isMobile ? "mt-3" : "mt-5"}`}>
              <ProdImages prod={data} />
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
