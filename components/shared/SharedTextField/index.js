import React from "react";
import { TextField, InputAdornment, Tooltip, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Example icon
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useLocalization from "@/config/hooks/useLocalization";

function SharedTextField({
  label = "label-here",
  besideLabel = false,
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
  hasMargin = true,
  plusMinusInput = false,
  rightIcon = false,
  actionClickrightIcon = () => {},
  customPadding = null,
  alignPosition = false,
  id = "",
  disabled = false,
  customHeight = false,
  inputMode = "text", // can be "numeric", "decimal", "tel", "email", etc.
  pattern = null, // optional
  hint = false,
}) {
  const { isMobile } = useScreenSize();
  const { locale } = useLocalization();

  return (
    <Box
      sx={{
        position: "relative",
        marginBottom: hasMargin ? "18px" : "0px",
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
        {besideLabel && (
          <Box
            component="span"
            sx={{
              color: "#B0B0B0",
              fontWeight: "500",
              fontSize: "12px",
              mx: 1,
            }}
          >
            {besideLabel}
          </Box>
        )}
      </Box>
      <TextField
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onKeyDown={handleChange}
        onBlur={handleBlur}
        variant="outlined"
        fullWidth
        disabled={disabled}
        placeholder={placeholder} // Add a placeholder instead of a label
        inputProps={{
          inputMode: inputMode,
          pattern: pattern,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                margin: plusMinusInput || !imgIcon ? "unset" : "8px",
              }}
              onClick={actionClickIcon}
            >
              {imgIcon && (
                <Tooltip title={toolTipTitle}>
                  {/* <SearchIcon style={{ cursor: "pointer" }} /> */}
                  <Image
                    loading="lazy"
                    style={{ cursor: "pointer" }}
                    alt="img"
                    src={imgIcon}
                    width={isMobile ? 18 : 20}
                    height={isMobile ? 18 : 20}
                  />
                </Tooltip>
              )}
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment
              sx={{
                margin: plusMinusInput || !rightIcon ? "unset" : "8px",
              }}
              position="end"
              onClick={actionClickrightIcon}
            >
              {rightIcon && (
                <Tooltip title={toolTipTitle}>
                  <Image
                    loading="lazy"
                    style={{ cursor: "pointer" }}
                    alt="img"
                    src={+value <= 1 ? "/icons/trash-icon.svg" : rightIcon}
                    width={isMobile ? 15 : 20}
                    height={isMobile ? 15 : 20}
                  />
                </Tooltip>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            background: rightIcon ? "white" : "unset",
            height: isMobile && rightIcon ? "31px" : customHeight || "40px", // Set the height of the input
            borderRadius: "8px", // Set border radius
            paddingRight: "8px", // Adjust padding for the icon
            paddingLeft: rightIcon ? "8px" : "inherit", // Adjust padding for the icon
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
            fontSize: isMobile ? "13px" : "16px",
            padding: customPadding ? customPadding : "0 24px", // Adjust padding for input text
            color: "#6B7280",
            textAlign: alignPosition
              ? alignPosition
              : customPadding && !plusMinusInput && locale == "ar"
              ? "end"
              : plusMinusInput
              ? "center"
              : "start",
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
      {!error && hint && (
        <Box
          sx={{
            position: "absolute",
            bottom: "-23px",
            color: "#6B7280",
            fontSize: "12px",
          }}
        >
          {hint}
        </Box>
      )}
    </Box>
  );
}

export default SharedTextField;
