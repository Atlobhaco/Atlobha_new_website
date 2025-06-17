import SharedTextField from "@/components/shared/SharedTextField";
import useLocalization from "@/config/hooks/useLocalization";
import { Box, CircularProgress, Divider } from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";
import React from "react";
import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import SharedBtn from "@/components/shared/SharedBtn";
import useScreenSize from "@/constants/screenSize/useScreenSize";

const closeHolder = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

function EnterPhoneStep({ setPhoneNum, canUseLoad, setOpenAddMobile }) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();

  const initialValues = {
    phone: "",
    country: "SA",
  };

  const validatePhoneNumber = (phone, countryCode) => {
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
    return phoneNumber && phoneNumber.isValid();
  };

  const validationSchema = Yup.object().shape({
    phone: Yup.string()
      .required(t.required)
      .test("is-valid-phone", t.invalid_phone, function (value) {
        const { country } = this.parent;
        return validatePhoneNumber(value, country);
      }),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setPhoneNum(values?.phone);
    },
  });

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (value) {
      formik.setErrors({});
      formik.setFieldValue("phone", value);
    }
  };

  return (
    <Box>
      {isMobile ? (
        <Box sx={closeHolder}>
          <Image
            loading="lazy"
            onClick={() => {
              setOpenAddMobile(false);
              setPhoneNum(false);
            }}
            style={{
              cursor: "pointer",
            }}
            src="/icons/close-circle.svg"
            alt="close"
            width={34}
            height={34}
          />
        </Box>
      ) : (
        <Divider></Divider>
      )}
      <Box
        className={`d-flex align-items-center justify-content-center ${
          isMobile ? "mt-0" : "mt-4"
        } flex-column`}
      >
        {!isMobile && (
          <Image
            loading="lazy"
            src="/imgs/add-phone.svg"
            width={122}
            height={102}
            alt="add-phone"
          />
        )}
        <Box
          sx={{
            fontSize: "24px",
            fontWeight: "700",
            mt: isMobile ? 1 : 2,
            color: "#1C1C28",
            textAlign: isMobile ? "start" : "center",
            width: "100%",
          }}
        >
          {t.enterPhoneToCall}
        </Box>
        <Box
          sx={{
            fontSize: isMobile ? "14px" : "20px",
            fontSize: "20px",
            fontWeight: "400",
            mt: isMobile ? 1 : 2,
            color: "#1C1C28",
            textAlign: isMobile ? "start" : "center",
            width: "100%",
          }}
        >
          {t.logWithPhone}
        </Box>
        <Box
          sx={{
            mt: isMobile ? 1 : 2,
            position: "relative",
            width: "95%",
            mx: "auto",
          }}
        >
          <SharedTextField
            id="phoneStepField"
            customPadding="0px 55px"
            placeholder={t.enterPhone}
            handleChange={(e) => {
              formik.handleChange(e);
              handleInputChange(e);
            }} // Custom handler
            handleBlur={formik.handleBlur}
            error={formik.errors["phone"]}
            name="phone"
            value={formik.values?.phone}
            setFieldValue={formik.setFieldValue}
            label={t.phoneNum}
            showAstrick
            imgIcon={false}
            toolTipTitle={t.vinNumHint}
            alignPosition={locale === "en" ? "start" : "end"}
          />

          <Box
            className="code-num"
            sx={{
              top: "17px !important",
            }}
            lang={locale}
          >
            {locale === "en" && "+"}966{locale === "ar" && "+"}
          </Box>
        </Box>
        <Box sx={{ width: isMobile ? "100%" : "70%", mt: 2 }}>
          <SharedBtn
            id="fisrt-step"
            disabled={!formik.isValid || canUseLoad}
            text={canUseLoad ? null : "choose"}
            className="big-main-btn"
            customClass="w-100"
            type="submit"
            compBeforeText={
              canUseLoad ? <CircularProgress color="inherit" size={20} /> : null
            }
            onClick={() => formik.handleSubmit()}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default EnterPhoneStep;
