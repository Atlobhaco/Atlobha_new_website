import { SERVICE_CATEGORIES } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const CategoriesServiceSelection = ({
  setPage,
  setAllServiceCategory,
  allServiceCategory,
}) => {
  const router = useRouter();
  const { idSerCat, secTitle, portableService } = router.query;

  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const lat = selectedAddress?.lat || defaultAddress?.lat || 24.7136;
  const lng = selectedAddress?.lng || defaultAddress?.lng || 46.6753;

  const { data: categories } = useCustomQuery({
    name: ["marketplace-service-categories", lng],
    url: `${SERVICE_CATEGORIES}?lat=${lat}&lng=${lng}`,
    enabled: !!lng,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    onSuccess: (res) =>
      setAllServiceCategory(
        res?.filter((d) => {
          if (portableService === "true") {
            return d?.portable_services_count > 0;
          } else {
            return d?.store_services_count > 0;
          }
        })
      ),
  });

  useEffect(() => {
    if (!categories?.length || !idSerCat) return;
    setPage(1);
  }, [categories, idSerCat]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: isMobile ? "15px" : "20px",
        overflow: "auto hidden",
      }}
    >
      {allServiceCategory?.map((cat) => {
        const isSelected = +cat.id === +idSerCat;

        return (
          <Box
            key={cat.id}
            onClick={() => {
              setPage(1);
              router.replace(
                {
                  pathname: `/serviceCategory/${cat.id}`,
                  query: {
                    ...router?.query,
                    secTitle: secTitle,
                  },
                },
                undefined,
                { shallow: true } // ✅ prevents page data fetching & rerender
              );
            }}
            sx={{
              minWidth: "fit-content",
              cursor: "pointer",
              position: "relative",
              fontSize: isMobile ? "12px" : "24px",
              fontWeight: isSelected ? "700" : "500",
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: 0,
                height: isSelected ? "2.5px" : 0,
                width: "100%",
                backgroundColor: "black",
              },
              "&:hover": { opacity: 0.8 },
            }}
          >
            {cat.name}
          </Box>
        );
      })}
    </Box>
  );
};

export default CategoriesServiceSelection;
