import React, { useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import "dayjs/locale/ar"; // Import Arabic locale
import "dayjs/locale/en"; // Import English locale
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { InputAdornment } from "@mui/material";
import Image from "next/image";

function SharedDatePicker({
  value,
  setValue,
  disablePast = false,
  label = "label",
  showAstrick = false,
  handleChange = () => {},
  disableFuture = false,
  error = false,
}) {
  const { locale } = useLocalization();
  const { isMobile } = useScreenSize();

  // Update Day.js locale based on the current locale
  useEffect(() => {
    dayjs.locale(locale); // Set Day.js locale (e.g., "en" or "ar")
  }, [locale]);

  const handleDateChange = (newValue) => {
    if (newValue) {
      const formattedDate = dayjs(newValue).format(
        "YYYY-MM-DDTHH:mm:ss.SSSSSSZ"
      );
      handleChange(formattedDate);
      //   setValue(formattedDate); // Save the formatted date
    } else {
      handleChange(null);
      //   setValue(null); // Handle clearing the date
    }
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={locale} // Pass locale to MUI DatePicker
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            fontWeight: "500",
            fontSize: "12px",
            color: "#374151",
          }}
        >
          {label}{" "}
          {showAstrick && (
            <Box
              component="span"
              sx={{
                color: "#EB3C24",
              }}
            >
              *
            </Box>
          )}
        </Box>
        <DesktopDatePicker
          value={value ? dayjs(value) : null} // Ensure value is a Day.js object
          onChange={handleDateChange}
          disablePast={disablePast}
          disableFuture={disableFuture}
          showDaysOutsideCurrentMonth={true}
          yearsPerRow={3}
          slotProps={{
            textField: {
              sx: {
                "& .MuiOutlinedInput-notchedOutline": {
                  border: error
                    ? "1px solid red !important"
                    : "1px solid rgba(0, 0, 0, 0.23)", // Add custom border
                },
                input: {
                  height: "13px",
                },
                "& .MuiButtonBase-root": {
                  borderRadius: "8px !important",
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  left: "0px",
                  justifyContent: "flex-end",
                  ":hover": {
                    background: "transparent !important",
                  },
                },
                "& .MuiInputBase-root": {
                  height: "44px",
                  borderRadius: "8px !important",
                },
                inputProps: {
                  readOnly: true, // Prevents manual typing
                },
              },
              //   InputProps: {
              //     endAdornment: (
              //       <InputAdornment position="end">
              //         <Image
              //           src="/icons/date-picker-icon.svg"
              //           alt="icon"
              //           width={20}
              //           height={20}
              //         />
              //       </InputAdornment>
              //     ),
              //   },
            },
            popper: {
              sx: {
                "& .MuiPaper-root": {
                  boxShadow: "0px 0px 10px 6px rgba(0, 0, 0, 0.14)",
                  borderRadius: "8px",
                  padding: "10px !important",
                  "& .MuiPickersCalendarHeader-root": {
                    margin: "0px !important",
                    padding: "0px",
                    "& .MuiPickersCalendarHeader-labelContainer": {
                      marginLeft: "auto !important",
                    },
                    "& .MuiPickersArrowSwitcher-root": {
                      "& .MuiButtonBase-root": {
                        transform:
                          locale === "ar" ? "rotate(180deg)" : "rotate(0deg)",
                      },
                    },
                  },
                },
                "& .MuiDateCalendar-root": {
                  height: "280px !important",
                },
              },
            },
            day: {
              sx: {
                "&.Mui-selected": {
                  backgroundColor: "#f9dd4b !important",
                  color: "black !important",
                  borderRadius: "50%",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "#FFD400 !important",
                },
                "&.MuiPickersDay-today": {
                  // Highlight today's date
                },
              },
            },
          }}
        />
        <Image
          src="/icons/date-picker-icon.svg"
          alt="icon"
          width={22}
          height={22}
          style={{
            position: "absolute",
            ...(locale === "ar" ? { left: "9px" } : { right: "9px" }),
            top: "46%",
            background: "white",
          }}
        />
        {error && (
          <Box
            className="error-msg-inputs"
            sx={{
              position: "absolute",
              bottom: "-23px",
            }}
          >
            {error}
          </Box>
        )}{" "}
      </Box>
    </LocalizationProvider>
  );
}

export default SharedDatePicker;
