import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, TextField } from "@mui/material";
import React from "react";

function SharedTextArea({
  placeholder = "اكتب هنا",
  label = "أضف تعليق",
  minRows = 4,
  maxRows = 10,
  value = "",
  handleChange = () => {},
  error = null,
  name = "name",
  showAstrick = false,
}) {
  const { isMobile } = useScreenSize();

  return (
    <Box
      sx={{
        borderBottom: isMobile ? "3px solid #F8F8F8" : "unset",
        paddingBottom: isMobile ? "15px" : "unset",
        // borderRadius: isMobile ? "20px" : "unset",
        position: "relative",
        marginBottom: "16px",
      }}
    >
      <Box
        sx={{
          fontSize: isMobile ? "16px" : "20px",
          fontWeight: "500",
          mb: 1,
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
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
        multiline
        minRows={minRows} // Adjust the height of the textarea
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px", // Custom border-radius
            // border: "0.8px solid #D1D5DB", // Custom border
            background: "#FFF", // Custom background
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "#EB3C24 !important" : "#D1D5DB", // Optional hover effect
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#f9dd4b !important", // Optional focus effect
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "#EB3C24" : "#D1D5DB",
            borderRadius: "inherit", // Inherit border-radius for the outline
          },
          "& .MuiInputBase-input": {
            resize: "vertical", // Optional for manual resizing
          },
        }}
      />{" "}
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

export default SharedTextArea;
