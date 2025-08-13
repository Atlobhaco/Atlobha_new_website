import React, { forwardRef, useImperativeHandle } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import SharedTextField from "../shared/SharedTextField";
import SharedBtn from "../shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";

const EnterPhoneNumber = forwardRef(({ onSubmit }, ref) => {
  const { t, locale } = useLocalization();

  const validatePhoneNumber = (phone, countryCode = "SA") => {
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
    return phoneNumber && phoneNumber.isValid();
  };

  const formik = useFormik({
    initialValues: { phone: "" },
    validationSchema: Yup.object().shape({
      phone: Yup.string()
        .required(t.required)
        .test("is-valid-phone", t.invalid_phone, function (value) {
          return validatePhoneNumber(value, "SA");
        }),
    }),
    onSubmit: (values) => {
      onSubmit(values.phone);
    },
  });

  // Expose resetForm to parent
  useImperativeHandle(ref, () => ({
    resetForm: formik.resetForm,
  }));

  return (
    <Box sx={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <Box sx={{ mt: 2, mb: 4, position: "relative" }}>
        <SharedTextField
          id="enter-phone-number"
          customPadding={`${formik?.values?.phone?.length ? "0px 55px" : ""}`}
          placeholder={t.enterPhone}
          name="phone"
          value={formik.values.phone}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          error={formik.errors.phone}
          label={false}
          imgIcon={false}
        />
        <Box className="code-num" lang={locale}>
          {locale === "en" && "+"}966{locale === "ar" && "+"}
        </Box>
      </Box>
      <Box mt={2}>
        <SharedBtn
          text={formik.isSubmitting ? null : t.continue}
          type="submit"
          className="black-btn"
          customClass="w-100"
          disabled={!formik.isValid || formik.isSubmitting}
          compBeforeText={
            formik.isSubmitting ? (
              <CircularProgress color="inherit" size={20} />
            ) : null
          }
          onClick={formik.handleSubmit}
        />
      </Box>
    </Box>
  );
});

export default EnterPhoneNumber;
