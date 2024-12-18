import React from "react";
import { Box, Switch, Tooltip } from "@mui/material";

function SharedToggle({
  label = "label-here",
  value = false,
  handleChange = () => {},
  handleBlur = () => {},
  error = null,
  name = "name",
  showAstrick = false,
  tooltipTitle = "Tooltip Title",
  applyMargin = true,
}) {
  return (
    <Box
      sx={{
        position: "relative",
        marginBottom: applyMargin ? "16px" : "unset",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          //   gap: "8px",
          fontWeight: "500",
          fontSize: "16px",
          color: "#374151",
        }}
      >
        {label}
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <Switch
          name={name}
          checked={value}
          onChange={handleChange}
          //   onBlur={handleBlur}
          inputProps={{ "aria-label": label }}
          sx={{
            "& .MuiSwitch-track": {
              backgroundColor: error ? "#D1D5DB !important" : "#D1D5DB",
              height: "20px",
              borderRadius: "20px",
            },
            "& .MuiSwitch-thumb": {
              backgroundColor: "#fff", // Default thumb color
              position: "relative",
              top: "2px",
            },
            "& .MuiSwitch-switchBase.Mui-checked": {
              "& .MuiSwitch-thumb": {
                backgroundColor: "white", // Yellow color when checked
                position: "relative",
                top: "2px",
                boxShadow: "0px 1px 4px 2.5px rgba(0, 0, 0, 0.20)",
              },
              "& + .MuiSwitch-track": {
                backgroundColor: "#FFCE21", // Green track color when checked
                height: "20px",
                borderRadius: "20px",
                opacity: "1",
              },
            },
          }}
        />
      </Box>
      {error && (
        <Box
          className="error-msg-inputs"
          sx={{
            position: "absolute",
            bottom: "-23px",
            color: "#EB3C24",
            fontSize: "12px",
          }}
        >
          {error}
        </Box>
      )}
    </Box>
  );
}

export default SharedToggle;
