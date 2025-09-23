import {
  MARKETPLACE_PRODUCTS,
  POPULAR_KEYWORD,
  SEARCH,
} from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { SERVICES } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

const tagStyle = (isMobile) => ({
  padding: isMobile ? "6px 10px" : "8px 15px",
  background: "#FFFFFF",
  borderRadius: "10px",
  fontSize: isMobile ? "12px" : "18px",
  fontWeight: "500",
  color: "black",
  minWidth: "fit-content",
  cursor: "pointer",
  border: "1px solid #F0F0F0",
  display: "flex",
  alignItems: "center",
  height: "fit-content",
  "&:hover": { opacity: 0.8 },
});

const sectionWrapperStyle = (isMobile, items, loading) => ({
  display: "flex",
  gap: isMobile ? "10px" : "15px",
  flexWrap: "wrap",
});

const Section = ({ title, loading, items, onClickTag }) => {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  return (
    <>
      {!!items?.length && !loading && (
        <Box
          sx={{
            color: "#1C1C28",
            fontSize: "20px",
            fontWeight: 700,
            mt: 2,
            mb: 1,
          }}
        >
          {title}
        </Box>
      )}
      <Box sx={sectionWrapperStyle(isMobile, items, loading)}>
        {loading ? (
          <CircularProgress
            sx={{ color: "#FFD400", mx: "auto", mt: 2 }}
            size={20}
          />
        ) : (
          <>
            {items?.map((item) => (
              <Box
                key={item}
                sx={tagStyle(isMobile)}
                onClick={() => onClickTag(item)}
              >
                {item}
              </Box>
            ))}
          </>
        )}
      </Box>
    </>
  );
};

function SearchSuggestionsMobile() {
  const { t } = useLocalization();
  const router = useRouter();
  const {
    query: { secType },
  } = useRouter();

  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  const urlDependOnSection = () => {
    if (secType === SERVICES) {
      return `/services${SEARCH}${POPULAR_KEYWORD}`;
    } else {
      return `${MARKETPLACE_PRODUCTS}${SEARCH}${POPULAR_KEYWORD}`;
    }
  };

  const { data: mostSearched, isFetching: loadingPopular } = useCustomQuery({
    name: ["mostSearched", secType],
    url: `${urlDependOnSection()}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
  });

  const handleClick = (keyword) =>
    router.push(
      `/search?keyword=${keyword}&type=${
        secType || "MarketplaceProduct"
      }&secType=${secType}`
    );

  return (
    <Box className="container mt-3">
      {isAuth() && (
        <Section
          title={t.searchHistory}
          loading={false}
          items={searchHistory}
          onClickTag={handleClick}
        />
      )}
      <Section
        title={t.mostSearched}
        loading={loadingPopular}
        items={mostSearched}
        onClickTag={handleClick}
      />
    </Box>
  );
}

export default SearchSuggestionsMobile;
