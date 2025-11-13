import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";

import ar from "react-phone-input-2/lang/ar.json";
import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function SharedPhoneInput({
  touched,
  errors,
  values,
  setFieldValue,
  handleBlur,
  name,
  handleInputChange,
  inputRef,
  label = false,
  showAstrick = false,
  hintBelowInput = false,
  disabled = false,
}) {
  const { locale, t } = useLocalization();
  const { isMobile } = useScreenSize();
  const defaultCountry = "sa"; // Default country (Saudi Arabia)
  const defaultDialCode = "966";

  return (
    <div style={{ marginBottom: "16px", position: "relative" }}>
      {label && (
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
      )}
      <PhoneInput
        disableCountryCode={false}
        disableDropdown={true}
        disabled={disabled}
        ref={inputRef}
        style={{
          height: "40px",
        }}
        buttonStyle={{ display: "none" }}
        searchNotFound={t.no_results_title}
        searchPlaceholder={t.common.search}
        dropdownStyle={{ bottom: "100%" }}
        className={`phone-input ${
          touched.phone && errors.phone ? "error-border" : ""
        }`}
        value={values?.phone}
        onChange={(phone, country) => {
          // If the user clears the input, restore the default country code
          if (!phone || phone === "+") {
            setFieldValue(name, `+${defaultDialCode}`);
          } else {
            setFieldValue(name, phone);
          }

          setFieldValue("country", country.countryCode.toUpperCase());
        }}
        onBlur={handleBlur}
        enableSearch={true}
        disableSearchIcon={true}
        inputProps={{
          name: name,
          onBlur: handleBlur,
          onChange: handleInputChange,
          // Add any additional input props you need here
        }}
        // preferredCountries={["sa", "eg"]}
        country={defaultCountry}
        localization={locale === "ar" && ar}
        defaultErrorMessage={null}
        isValid={(inputNumber, country, countries) => {
          return countries.some((country) => {
            return (
              startsWith(inputNumber, country.dialCode) ||
              startsWith(country.dialCode, inputNumber)
            );
          });
        }}
      />
      {touched.phone && errors.phone ? (
        <div
          className="error-msg-inputs"
          style={{
            position: "absolute",
            paddingTop: "3px",
          }}
        >
          {errors.phone}
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            paddingTop: "3px",
            color: "#6B7280",
            fontSize: "12px",
          }}
        >
          {hintBelowInput}{" "}
        </div>
      )}
    </div>
  );
}

export default SharedPhoneInput;
