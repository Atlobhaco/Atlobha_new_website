import ProductCardSkeleton from "@/components/cardSkeleton";
import ComingSoon from "@/components/comingSoon";
import MetaTags from "@/components/shared/MetaTags";
import useCustomQuery from "@/config/network/Apiconfig";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";

function ProductDetails() {
  const {
    query: { idProd },
  } = useRouter();

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
        <ComingSoon />
      )}
    </Box>
  );
}

export default ProductDetails;
