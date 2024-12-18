import React from "react";
import { TextField, InputAdornment, Tooltip, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Example icon
import Image from "next/image";

function SharedTextField({
  label = "label-here",
  value = "",
  setValue = () => {},
  ArrayData = [{}],
  handleChange = () => {},
  handleBlur = () => {},
  error = false,
  name = "name",
  setFieldValue = () => {},
  showAstrick = false,
  imgIcon = "/icons/exclumation.svg",
  toolTipTitle = "title",
  placeholder = "placeHolder",
  actionClickIcon = () => {},
}) {
  return (
    <Box
      sx={{
        position: "relative",
        marginBottom: "16px",
      }}
    >
      <Box
        sx={{
          fontWeight: "500",
          fontSize: "12px",
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
      <TextField
        name={name}
        value={value}
        onChange={handleChange}
		onBlur={handleBlur}
        variant="outlined"
        fullWidth
        placeholder={placeholder} // Add a placeholder instead of a label
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" onClick={actionClickIcon}>
              {imgIcon && (
                <Tooltip title={toolTipTitle}>
                  {/* <SearchIcon style={{ cursor: "pointer" }} /> */}
                  <Image
                    style={{ cursor: "pointer" }}
                    alt="img"
                    src={imgIcon}
                    width={20}
                    height={20}
                  />
                </Tooltip>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: "44px", // Set the height of the input
            borderRadius: "8px", // Set border radius
            paddingRight: "8px", // Adjust padding for the icon
            "& fieldset": {
              borderColor: error ? "#EB3C24 !important" : "#D1D5DB", // Default border color
            },
            "&:hover fieldset": {
              // borderColor: "#4CAF50", // Hover border color
            },
            "&.Mui-focused fieldset": {
              // borderColor: "#4CAF50", // Focused border color
            },
          },
          "& .MuiInputBase-input": {
            padding: "0 14px", // Adjust padding for input text
            color: "#6B7280",
          },
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
      )}
    </Box>
  );
}

export default SharedTextField;
