import React from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import useLocalization from "@/config/hooks/useLocalization";
import {
  ArrowBackIos,
  ArrowForwardIos,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@mui/icons-material"; // Custom icons
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { CircularProgress } from "@mui/material";

function PaginateComponent({ meta, setPage, isLoading }) {
  const { locale } = useLocalization();
  const { isMobile } = useScreenSize();

  // Function to format page numbers based on locale
  const formatNumber = (number) => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(
      number
    );
  };

  return (
    <div className="position-relative">
      <Pagination
        boundaryCount={1}
        siblingCount={1}
        count={meta?.last_page || 100}
        page={meta?.current_page || 1}
        defaultPage={meta?.current_page || 1}
        onChange={(e, page) => setPage(page)}
        disabled={isLoading}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            page={item.page ? formatNumber(item.page) : item.page} // Convert numbers to Arabic if needed
            // slots={{
            //   previous: locale === "ar" ? ArrowRightIcon : ArrowRightIcon, // Custom left arrow
            //   next: locale === "ar" ? ArrowRightIcon : ArrowRightIcon, // Custom right arrow
            // }}
            sx={{
              "& .MuiSvgIcon-root": {
                width: isMobile ? 30 : 32,
                height: isMobile ? 30 : 32,
                borderRadius: "50%", // Make it circular
                border: "1px solid #6B7280", // Circle border
                backgroundColor: "#fff",
                color: "#6B7280", // Arrow color
                padding: "3px", // Space inside circle
                margin: "0px 0px",
                fontSize: isMobile ? "12px" : "16px",
                transform: locale === "ar" ? "rotate(180deg)" : "none", // Add this line
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
