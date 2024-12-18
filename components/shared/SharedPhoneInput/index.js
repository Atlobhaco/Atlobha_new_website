import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";

import ar from "react-phone-input-2/lang/ar.json";
import useLocalization from "@/config/hooks/useLocalization";

function SharedPhoneInput({
  touched,
  errors,
  values,
  setFieldValue,
  handleBlur,
  name,
  handleInputChange,
  inputRef,
}) {
  const { locale, t } = useLocalization();

  return (
    <div style={{ marginBottom: "16px", position: "relative" }}>
      <PhoneInput
        ref={inputRef}
        style={{
          height: "44px",
        }}
        searchNotFound={t.no_results_title}
        searchPlaceholder={t.common.search}
        dropdownStyle={{ bottom: "100%" }}
        className={`phone-input ${
          touched.phone && errors.phone ? "error-border" : ""
        }`}
        value={values?.phone}
        onChange={(phone, country) => {
          setFieldValue(name, phone);
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
        preferredCountries={["sa", "eg"]}
        country="sa"
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
      {touched.phone && errors.phone && (
        <div
          className="error-msg-inputs"
          style={{
            position: "absolute",
            paddingTop: "3px",
          }}
        >
          {errors.phone}
        </div>
      )}
    </div>
  );
}

export default SharedPhoneInput;
