import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

function SharedDatePicker({ value, setValue }) {
  const handleDateChange = (newValue) => {
    if (newValue) {
      const formattedDate = dayjs(newValue).format(
        "YYYY-MM-DDTHH:mm:ss.SSSSSSZ"
      );
      setValue(formattedDate); // Save the formatted date
    } else {
      setValue(null); // Handle clearing the date
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
        <Box>inProgress</Box>
        <DesktopDatePicker
          value={value ? dayjs(value) : null} // Ensure value is a Day.js object
          onChange={handleDateChange}
          slotProps={{
            textField: {
              sx: {
                input: {
                  height: "13px",
                },
                "& .MuiButtonBase-root": {
                  //   background: "red", // Add custom styles here
                  borderRadius: "8px", // Example: Add rounded corners
                  //   color: "#fff", // Example: Change text color
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  left: "0px",
                  justifyContent: "flex-end",

                  ":hover": {
                    background: "transparent !important", // Example: Add hover effect
                  },
                  "& .MuiButtonBase-root": {
                    height: "44px",
                  },
                },
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default SharedDatePicker;
