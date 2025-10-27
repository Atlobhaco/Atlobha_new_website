import React, { useEffect } from "react";
import { Pagination, PaginationItem, CircularProgress } from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useRouter } from "next/router";

export default function PaginateComponent({ meta, setPage, isLoading }) {
  const { locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const router = useRouter();

  const formatNumber = (n) =>
    new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(n);

  const updatePageQuery = (page) => {
    setPage(page);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, current_active_page: page },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    const page = +router.query.current_active_page;
    if (router.pathname.includes("search") && page) updatePageQuery(page);
  }, [router.query.current_active_page]);

  return (
    <div className="position-relative">
      <Pagination
        boundaryCount={1}
        siblingCount={1}
        count={meta?.last_page || 1}
        page={meta?.current_page || 1}
        defaultPage={meta?.current_page || 1}
        onChange={(_, p) => updatePageQuery(p)}
        disabled={isLoading}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            page={item.page ? formatNumber(item.page) : item.page}
            sx={{
              "& .MuiSvgIcon-root": {
                width: isMobile ? 25 : 32,
                height: isMobile ? 25 : 32,
                borderRadius: "50%",
                border: "1px solid #6B7280",
                backgroundColor: "#fff",
                color: "#6B7280",
                padding: "3px",
                fontSize: isMobile ? "12px" : "16px",
                transform: locale === "ar" ? "rotate(180deg)" : "none",
              },
            }}
          />
        )}
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#6B7280",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: 500,
            margin: isMobile ? '0.7px' : "1px",
            ...(isMobile && { minWidth: "25px", height: "25px" }),
            "&.Mui-selected": {
              backgroundColor: "#FFCE21",
              color: "black",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#FFCE21" },
            },
          },
        }}
      />
      {isLoading && (
        <CircularProgress
          size={20}
          sx={{
            color: "#FFD400",
            position: "absolute",
            top: "5px",
            left: "-25px",
          }}
        />
      )}
    </div>
  );
}
