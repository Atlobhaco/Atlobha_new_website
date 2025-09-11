import React, { useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import useLocalization from "@/config/hooks/useLocalization";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/en";

function SharedSelectionDatePicker({
  value,
  disablePast = false,
  handleChange = () => {},
  error,
}) {
  const { locale } = useLocalization();

  useEffect(() => {
    dayjs.locale(locale); // Set Day.js locale (e.g., "en" or "ar")
  }, [locale]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <DateCalendar
        disablePast={disablePast}
        value={value}
        onChange={(newValue) => handleChange(newValue)}
        dayOfWeekFormatter={
          (date) => dayjs(date).locale(locale).format("ddd") // e.g. "Sun", "Mon", "Tue"
        }
        slotProps={{
          calendarHeader: {
            sx: {
              display: "flex",
              justifyContent: "space-between", // header items spaced
              "& .MuiPickersArrowSwitcher-root .MuiButtonBase-root": {
                transform: locale === "ar" ? "rotate(180deg)" : "none",
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
            },
          },
          popper: {
            sx: {
              "& .MuiPaper-root": {
                width: "100%", // make popper full width
                margin: 0,
                "& .MuiDateCalendar-root": {
                  width: "100% !important",
                },
                "& .MuiDayCalendar-weekContainer": {
                  display: "flex",
                  justifyContent: "space-between", // spacing for days
                },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default SharedSelectionDatePicker;
