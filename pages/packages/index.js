import PaginateComponent from "@/components/Pagination";
import ProductCardSkeleton from "@/components/cardSkeleton";
import MetaTags from "@/components/shared/MetaTags";
import { MARKETPLACE, PRODUCTS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

function Packages() {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [page, setPage] = useState(1);
  const [data, setAllData] = useState([]);
  const router = useRouter();

  const { isFetching, isLoading } = useCustomQuery({
    name: ["featured-products-packages", page, isMobile],
    url: `${MARKETPLACE}${PRODUCTS}?page=${page}&per_page=${10}&is_featured=1`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    onSuccess: (res) => setAllData(res),
  });

  return (
    <Box>
      <MetaTags title={t.packagesOffers} content={t.packagesOffers} />
      <div className="container">
        <div className="row mt-3">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <div className="col-md-3 col-6">
                  <ProductCardSkeleton
                    key={i}
                    height={isMobile ? "200px" : "440px"}
                  />
                </div>
              ))
            : data?.data?.map((pack) => (
                <Box
                  sx={{
                    height: isMobile ? "200px" : "440px",
                    cursor: "pointer",
                    my: 2,
                  }}
                  className="col-md-3 col-6"
                  key={pack?.id}
                >
                  <Box
                    onClick={() => {
                      router.push(pack?.deep_link);
                    }}
                    sx={{
                      backgroundImage: `url('${pack?.featured_image?.url}')`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "contain",
                      height: "100%",
                      width: "100%",
                      borderRadius: "10px",
                    }}
                  ></Box>
                </Box>
              ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: isMobile ? 1 : 2,
            }}
          >
            <PaginateComponent
              meta={data?.meta}
              setPage={setPage}
              isLoading={isFetching}
            />
          </Box>
        </div>
      </div>
    </Box>
  );
}

export default Packages;
