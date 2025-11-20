import React from "react";
import { Box, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function SharedTextArea({
  placeholder = "اكتب هنا",
  label = "أضف تعليق",
  minRows = 4,
  maxRows = 10,
  showAstrick = false,
  name = null, // optional
  value,
  handleChange,
  error: customError,
  labelFontSize = false,
  ...props
}) {
  const { isMobile } = useScreenSize();

  let fieldProps = {};
  let error = customError;

  try {
    const formik = useFormikContext();
    if (name && formik) {
      // Use Formik field
      const [field, meta] = useField(name);
      fieldProps = field;
      error = meta.touched && meta.error ? meta.error : customError;
    } else {
      // Standalone controlled input
      fieldProps = {
        value: value ?? "",
        onChange: handleChange ?? (() => {}),
        name: name ?? "",
      };
    }
  } catch {
    // No Formik context — fallback gracefully
    fieldProps = {
      value: value ?? "",
      onChange: handleChange ?? (() => {}),
      name: name ?? "",
    };
  }

  return (
    <Box
      sx={{
        borderBottom: isMobile ? "3px solid #F8F8F8" : "unset",
        paddingBottom: isMobile ? "15px" : "unset",
        position: "relative",
        marginBottom: "16px",
      }}
    >
      <Box
        sx={{
          fontSize: labelFontSize ? labelFontSize : isMobile ? "16px" : "20px",
          fontWeight: "500",
          mb: 1,
        }}
      >
        {label}
        {showAstrick && (
          <Box component="span" sx={{ color: "#EB3C24" }}>
            *
          </Box>
        )}
      </Box>

      <TextField
        {...fieldProps}
        {...props}
        placeholder={placeholder}
        multiline
        minRows={minRows}
        maxRows={maxRows}
        fullWidth
        error={Boolean(error)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            background: "#FFF",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "#EB3C24 !important" : "#D1D5DB",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#f9dd4b !important",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "#EB3C24" : "#D1D5DB",
            borderRadius: "inherit",
          },
          "& .MuiInputBase-input": {
            resize: "vertical",
          },
        }}
      />

      {error && (
        <Box
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

export default SharedTextArea;
