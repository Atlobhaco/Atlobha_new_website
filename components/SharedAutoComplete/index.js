import React from "react";
import {
  Autocomplete,
  TextField,
  Box,
  IconButton,
  ListItemText,
} from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SharedCheckbox from "../shared/SharedCheckbox";

function SharedAutoComplete({
  label = "label-here",
  value = null,
  setValue = () => {},
  items = [],
  name = "name",
  handleBlur = () => {},
  error = null,
  showAstrick = false,
  disabled = false,
  handleChange = () => {},
  setFieldValue = () => {},
}) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();

  const handleClear = (event) => {
    event.stopPropagation();
    // setValue(null);
    handleChange(event);
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

      <Autocomplete
        // open
        name={name}
        // freeSolo
        disabled={disabled}
        value={value ? items?.find((data) => +data?.id === +value) : ""}
        // inputValue={value ? items?.find((data) => +data?.id === +value) : ""}
        onChange={(event, newValue) => {
          handleChange(event, newValue);
          handleBlur({ target: { name, value: newValue?.id } });
        }}
        options={items}
        noOptionsText={t.noOptions}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        filterOptions={(options, { inputValue }) => {
          const searchValue = inputValue.toLowerCase();
          return options.filter(
            (option) =>
              option.id.toString().includes(searchValue) ||
              (option.name_ar &&
                option.name_ar.toLowerCase().includes(searchValue)) ||
              (option.name_en &&
                option.name_en.toLowerCase().includes(searchValue))
          );
        }}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{
              borderBottom: "1px solid #ddd",
              padding: isMobile
                ? "8px 20px !important"
                : "13px 20px !important",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
              display: "flex",
              alignItems: "center",
              "&:last-of-type": {
                borderBottom: "none", // Remove the bottom border for the last menu item
              },
            }}
          >
            {option?.image && (
              <Image
                loading="lazy"
                src={option?.image}
                alt={option.name}
                width={isMobile ? 24 : 50}
                height={isMobile ? 24 : 50}
                style={{ marginRight: locale === "ar" ? 0 : 10 }}
              />
            )}
            {/* {option.name} */}
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    {option.name}
                  </Box>
                  <Box
                    sx={{
                      fontWeight: "500",
                      fontSize: "10px",
                      color: "#6B7280",
                    }}
                  >
                    {option.id}
                  </Box>
                </Box>
              }
              sx={{ mx: 2, display: "flex", alignItems: "center", pt: 1 }}
            />
            {value === option?.id && (
              <SharedCheckbox selectedId={value} data={option} />
            )}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            error={!!error}
            helperText={error}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {value && !disabled && (
                    <IconButton
                      onClick={handleClear}
                      sx={{
                        position: "absolute",
                        right: locale === "ar" ? "unset" : 6,
                        left: locale === "ar" ? 6 : "unset",
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                padding: "0 12px", // Adjust padding for height consistency
                height: "44px", // Set height
                borderRadius: "8px", // Border radius
                background: "white",
                padding: "9px !important",
                "& fieldset": {
                  border: error ? "1px solid #EB3C24" : "1px solid #D1D5DB",
                },
              },
              "& .MuiAutocomplete-endAdornment": {
                display: "none", // hide the default clear icon
              },
              "& .MuiSelect-icon": {
                ...(locale === "ar"
                  ? { left: "7px", right: "unset" }
                  : { right: "7px", left: "unset" }),
                color: "#4B5563", // Icon color
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "14px",
                fontWeight: "500 !important",
                color: "#6B7280", // Text color of the selected value
                height: "44px !important", // Ensure text area height matches
                display: "flex",
                alignItems: "center",
                padding: "0px 14px !important",
              },
            }}
          />
        )}
        PaperProps={{
          sx: {
            border: "1px solid #E6E6E6",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "8px",
            minWidth: "250px !important",
            "& .MuiMenuItem-root:last-child": {
              borderBottom: "none", // Remove the bottom border for the last menu item
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
      />
    </Box>
  );
}

export default SharedAutoComplete;
