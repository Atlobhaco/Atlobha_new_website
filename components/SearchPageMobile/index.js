import { HISTORY, POPULAR_TERMS, SEARCH } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
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
  minHeight: items?.length || loading ? "100px" : "0px",
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
            {/* {!items?.length && (
              <Box
                sx={{
                  color: "#1C1C28",
                  fontSize: "20px",
                  fontWeight: 700,
                  mt: 2,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {t.noResultsFound}
              </Box>
            )} */}
          </>
        )}
      </Box>
    </>
  );
};

function SearchSuggestionsMobile() {
  const { t } = useLocalization();
  const router = useRouter();

  const { data: searchHistory, isFetching: loadingHistory } = useCustomQuery({
    name: "searchHistory",
    url: `${SEARCH}${HISTORY}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
  });

  const { data: mostSearched, isFetching: loadingPopular } = useCustomQuery({
    name: "mostSearched",
    url: `${SEARCH}${POPULAR_TERMS}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
  });

  const handleClick = (keyword) =>
    router.push(`/search?keyword=${keyword}&type=MarketplaceProduct`);

  return (
    <Box className="container mt-3">
      <Section
        title={t.searchHistory}
        loading={loadingHistory}
        items={searchHistory}
        onClickTag={handleClick}
      />
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
