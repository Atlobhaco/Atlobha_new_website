import React from "react";
import { TextField, InputAdornment, Tooltip, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Example icon
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useLocalization from "@/config/hooks/useLocalization";

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
  hasMargin = true,
  plusMinusInput = false,
  rightIcon = false,
  actionClickrightIcon = () => {},
  customPadding = null,
  alignPosition = false,
  id = "",
}) {
  const { isMobile } = useScreenSize();
  const { locale } = useLocalization();

  return (
    <Box
      sx={{
        position: "relative",
        marginBottom: hasMargin ? "16px" : "0px",
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
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onKeyDown={handleChange}
        onBlur={handleBlur}
        variant="outlined"
        fullWidth
        placeholder={placeholder} // Add a placeholder instead of a label
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
                    style={{ cursor: "pointer" }}
                    alt="img"
                    src={imgIcon}
                    width={isMobile ? 15 : 20}
                    height={isMobile ? 15 : 20}
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
            height: isMobile && rightIcon ? "31px" : "44px", // Set the height of the input
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
    </Box>
  );
}

export default SharedTextField;
