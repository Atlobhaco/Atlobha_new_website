import { CATEGORY, MARKETPLACE } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const CategoriesSelection = ({
  setSelectedCategory,
  selectedCategory,
  setSubCategories,
  setSubCatId,
  setPage,
  setAllCategories,
}) => {
  const router = useRouter();
  const { idSub } = router.query;

  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const lat = selectedAddress?.lat || defaultAddress?.lat || 24.7136;
  const lng = selectedAddress?.lng || defaultAddress?.lng || 46.6753;

  const { data: categories } = useCustomQuery({
    name: ["marketplace-categories", lng],
    url: `${MARKETPLACE}${CATEGORY}?lat=${lat}&lng=${lng}`,
    enabled: !!lng,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => setAllCategories(res),
  });

  useEffect(() => {
    if (!categories?.length || !selectedCategory) return;

    const selected = categories.find((d) => +d.id === +selectedCategory);
    setSubCategories(selected?.subcategory || []);
    if (!idSub) {
      setSubCatId(selected?.subcategory?.[0]?.id || null);
      router.replace(
        {
          pathname: `/category/${selectedCategory}`,
          query: { idSub: selected?.subcategory?.[0]?.id || null },
        },
        undefined,
        { shallow: true } // ✅ prevents page data fetching & rerender
      );
    }
    setPage(1);
  }, [categories, selectedCategory]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: isMobile ? "15px" : "20px",
        overflow: "auto hidden",
      }}
    >
      {categories?.map((cat) => {
        const isSelected = +cat.id === +selectedCategory;

        return (
          <Box
            key={cat.id}
            onClick={() => {
              setSelectedCategory(+cat.id);
              setSubCatId(cat.subcategory?.[0]?.id);
              setPage(1);
              setSubCatId(cat.subcategory?.[0]?.id || null);
              router.replace(
                {
                  pathname: `/category/${cat.id}`,
                  query: { idSub: cat.subcategory?.[0]?.id || null },
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

export default CategoriesSelection;
