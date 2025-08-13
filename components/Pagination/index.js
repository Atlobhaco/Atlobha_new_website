import React, { useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

function PaginateComponent({ meta, setPage, isLoading }) {
  const { locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const router = useRouter();

  // Function to format page numbers based on locale
  const formatNumber = (number) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(
      number
    );
  };

  // Update query params
  const handlePageChange = (e, newPage) => {
    setPage(newPage); // update internal state

    const currentQuery = { ...router.query };
    currentQuery.current_active_page = newPage;

    router.push(
      {
        pathname: router.pathname,
        query: currentQuery,
      },
      undefined,
      { shallow: true } // Don't reload the page, just update URL
    );
  };

  useEffect(() => {
    if (router?.query?.current_active_page) {
      setPage(+router?.query?.current_active_page);

      const currentQuery = { ...router.query };
      currentQuery.current_active_page = +router?.query?.current_active_page;

      router.push(
        {
          pathname: router.pathname,
          query: currentQuery,
        },
        undefined,
        { shallow: true } // Don't reload the page, just update URL
      );
    }
  }, [router?.query?.current_active_page]);

  return (
    <div className="position-relative">
      <Pagination
        boundaryCount={1}
        siblingCount={1}
        count={meta?.last_page || 100}
        page={meta?.current_page || 1}
        defaultPage={meta?.current_page || 1}
        onChange={handlePageChange}
        disabled={isLoading}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            page={item.page ? formatNumber(item.page) : item.page}
            sx={{
              "& .MuiSvgIcon-root": {
                width: isMobile ? 30 : 32,
                height: isMobile ? 30 : 32,
                borderRadius: "50%",
                border: "1px solid #6B7280",
                backgroundColor: "#fff",
                color: "#6B7280",
                padding: "3px",
                margin: "0px 0px",
                fontSize: isMobile ? "12px" : "16px",
                transform: locale === "ar" ? "rotate(180deg)" : "none",
              },
            }}
          />
        )}
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#6B7280",
            fontSize: "14px",
            fontWeight: "500",
            margin: isMobile ? 0 : "auto",
            "&.Mui-selected": {
              backgroundColor: "#FFCE21",
              color: "black",
              fontWeight: "600",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "#FFCE21",
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
            left: "-15px",
          }}
        />
      )}
    </div>
  );
}

export default PaginateComponent;
