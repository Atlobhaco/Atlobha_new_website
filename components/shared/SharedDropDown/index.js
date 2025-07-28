import React, { useRef, useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  ListItemText,
  Box,
  IconButton,
} from "@mui/material";
import SharedCheckbox from "../SharedCheckbox";
import useLocalization from "@/config/hooks/useLocalization";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close"; // Use the Close icon from MUI
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function SharedDropDown({
  label = "label-here",
  value = "",
  setValue = () => {},
  ArrayData = [{}],
  handleChange = () => {},
  handleBlur = () => {},
  error = null,
  name = "name",
  setFieldValue = () => {},
  showAstrick = false,
  items = [],
  disabled = false,
  id = "",
  showCloseIcon = true,
  hint = false,
}) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const selectRef = useRef(null); // Create a ref for the Select component

  const handleClear = (event) => {
    event.stopPropagation();
    // setFieldValue(name, null);
    handleChange({ target: { name, value: "" } });
  };

  return (
    <Box sx={{ direction: locale === "ar" ? "rtl" : "ltr" }}>
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
      <FormControl
        // id={id}
        fullWidth
        sx={{
          //   border: false
          //     ? "1px solid #4CAF50"
          //     : error
          //     ? "1px solid #EB3C24"
          //     : "1px solid #D1D5DB", // Light gray border
          borderRadius: "8px", // Border radius
          background: "white",
          height: "44px !important", // Set the height of the container
          marginBottom: "10px",
          //   "&:hover": {
          //     border: "1px solid yellow", // Add a border on hover
          //     cursor: "pointer", // Change cursor to pointer when hovering
          //   },
          "& fieldset": {
            // border: "unset", // Remove the border of the fieldset
            border: error
              ? "1px solid #EB3C24 !important"
              : "1px solid #D1D5DB",
            //   borderColor: "unset !important",

            borderRadius: "8px", // Border radius
            "&:hover": {
              border: "unset", // Add a border on hover
              outline: "unset",
            },
          },
        }}
      >
        <Select
          id={id}
          disabled={disabled}
          ref={selectRef}
          name={name}
          onChange={(e) => {
            handleBlur(e);
            handleChange(e);
          }}
          //   onBlur={(e) => {
          //     handleBlur(e);
          //   }}
          error={error}
          value={value}
          renderValue={(selected) => {
            const selectedItem = items.find((item) => item.id === selected);
            return selectedItem ? selectedItem.name : "";
          }}
          IconComponent={(props) =>
            ((typeof value === "object" && value?.length) ||
              (typeof value !== "object" && value)) &&
            !disabled ? (
              showCloseIcon ? (
                <IconButton
                  onClick={handleClear}
                  sx={{
                    position: "absolute",
                    right: locale === "ar" ? "unset" : 8,
                    left: locale === "ar" ? 8 : "unset",
                  }}
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : (
                <ArrowDropDownIcon />
              )
            ) : (
              <ArrowDropDownIcon />
            )
          }
          MenuProps={{
            PaperProps: {
              sx: {
                border: "1px solid #E6E6E6", // Example: add border to Paper
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)", // Add box shadow to Paper
                borderRadius: "8px",
                minWidth: "250px !important",
                "& .MuiMenuItem-root:last-child": {
                  borderBottom: "none", // Remove the bottom border for the last menu item
                },
              },
            },
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right", // Align to the start of the input
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "right", // Ensure the dropdown aligns at the start
            },
          }}
          sx={{
            height: "44px !important", // Set the height of the select component
            padding: "0 12px", // Adjust padding for height consistency
            "&:hover": {
              border: "unset", // Add a border on hover
            },
            "& .MuiSelect-icon": {
              ...(locale === "ar"
                ? { left: "7px", right: "unset" }
                : { right: "7px", left: "unset" }),
              color: "#4B5563", // Icon color
            },
            "& .MuiSelect-select": {
              fontSize: "14px",
              fontWeight: "500 !important",
              color: "#6B7280", // Text color of the selected value
              height: "44px !important", // Ensure text area height matches
              display: "flex",
              alignItems: "center",
              padding: "0px 14px !important",
            },
          }}
        >
          {items?.length ? (
            items.map((item) => (
              <MenuItem
                id={item?.id}
                key={item.id}
                value={item.id}
                sx={{
                  borderBottom: "1px solid #ddd",
                  padding: isMobile ? "8px 20px" : "13px 20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                {item?.image && (
                  <Image
                    loading="lazy"
                    src={item?.image}
                    alt={item.name}
                    width={isMobile ? 24 : 30}
                    height={isMobile ? 24 : 30}
                    sx={{ marginRight: 10 }}
                  />
                )}
                <ListItemText
                  primary={item.name}
                  sx={{ mx: 2, display: "flex", alignItems: "center", pt: 1 }}
                />
                {value === item?.id && (
                  <SharedCheckbox selectedId={value} data={item} />
                )}
              </MenuItem>
            ))
          ) : (
            <MenuItem
              value={null}
              sx={{
                borderBottom: "1px solid #ddd",
                padding: isMobile ? "8px 20px" : "13px 20px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
              disabled
            >
              <ListItemText
                primary={t.noData}
                sx={{ mx: 2, display: "flex", alignItems: "center", pt: 1 }}
              />
            </MenuItem>
          )}
        </Select>
        {error && <Box className="error-msg-inputs">{error}</Box>}
        {hint && !error && <Box className="hint-msg-inputs">{hint}</Box>}
      </FormControl>
    </Box>
  );
}

export default SharedDropDown;
