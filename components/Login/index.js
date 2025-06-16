import React, { useState } from "react";
import DialogCentered from "../DialogCentered";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";
import Image from "next/image";
import { Box, CircularProgress, Divider } from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";
import SharedBtn from "../shared/SharedBtn";
import { checkApplePayAvailability } from "@/constants/helpers";
import { styled } from "@mui/system";
import SharedTextField from "../shared/SharedTextField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import SharedPhoneInput from "../shared/SharedPhoneInput";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import OtpView from "./otpView";
import { useRequestOtp } from "@/config/network/Shared/AuthHelpers";
import useCustomQuery from "@/config/network/Apiconfig";
import { AUTH, REGISTER } from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "@/redux/reducers/authReducer";
import SocialLogins from "./socialLogins";

const Root = styled("div")(({ theme }) => ({
  width: "90%",
  margin: "auto",
  ...theme.typography.body2,
  color: "#1C1C28",
  fontWeight: "bold",
  fontSize: "20px",
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

function Login({
  showBtn = false,
  open = false,
  setOpen = () => {},
  id = "customID",
  customIDLogin = "login-btn",
  customIDOtpField = "otpField",
}) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const dispatch = useDispatch();

  const [timer, setTimer] = useState(120);
  const [otpView, setOtpView] = useState(false);
  const [textInput, setTextInput] = useState(true); // Default view is text field
  const [otpPayload, setOtpPayload] = useState(false);

  const { saveUserinput } = useSelector((state) => state.auth);
  const initialValues = {
    text_input: "",
    phone: "",
    country: "SA",
  };

  const validatePhoneNumber = (phone, countryCode) => {
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
    return phoneNumber && phoneNumber.isValid();
  };

  const validationSchema = Yup.object().shape({
    text_input: textInput
      ? Yup.string().email(t.invalid_email).required(t.invalid_email)
      : Yup.string(),
    phone: !textInput
      ? Yup.string()
          .required(t.required)
          .test("is-valid-phone", t.invalid_phone, function (value) {
            const { country } = this.parent;
            return validatePhoneNumber(value, country);
          })
      : Yup.string(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        saveUser({
          data: textInput
            ? { email: values?.text_input }
            : { phone: values?.phone?.replace(/\s/g, "") },
        })
      );

      setOtpPayload(
        textInput
          ? { email: values?.text_input }
          : { phone: values?.phone?.replace(/\s/g, "") }
      );
      setTimeout(() => {
        recallReqOtp();
      }, 500);
    },
  });

  const handleInputChange = (e) => {
    let value = e.target.value;
    // if (value?.includes("+")) {
    //   value = value.replace("+", "").replace(/\s/g, "");
    // }
    // Check if the value contains only numbers
    const isNumeric = /^\d+$/.test(value);

    // Toggle input type based on value
    if (value) {
      //   formik.handleChange(e);
      //   formik.handleBlur(e);
      formik.setErrors({});
      setTextInput(!isNumeric);
      if (isNumeric) {
        // console.log("value", value);
        formik.setFieldValue("phone", value);
      } else {
        formik.setFieldValue("text_input", value);
      }
    }
    // formik.handleChange(e);
    // formik.handleBlur(e);

    // formik.setFieldTouched("text_input", true);
    // formik.setFieldTouched("phone", true);

    // Update formik values
  };

  const {
    data: registerRes,
    refetch: callRegister,
    isLoading: registerLoad,
  } = useCustomQuery({
    name: ["registerNewUserReqss"],
    url: `${AUTH}${REGISTER}`,
    refetchOnWindowFocus: false,
    method: "post",
    body: saveUserinput,
    enabled: false,
    retry: 0,
    select: (res) => res,
    onSuccess: (res) => {
      setOtpView(true);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.first_error ||
          err?.response?.data?.message ||
          t.someThingWrong,
        { toastId: "uniqueErrorId" } // Use a unique ID to deduplicate
      );
    },
  });

  const {
    data: OtpResponse,
    refetch: recallReqOtp,
    isFetching: otpLoad,
  } = useRequestOtp({
    setOtpView,
    otpPayload,
    t,
    callRegister,
    setTimer,
  });

  const containerStyle = {
    padding: `0px ${isMobile ? "0px" : "90px"}`,
  };

  return (
    <DialogCentered
      actionsWhenClose={() => {
        setOtpView(false);
      }}
      open={open}
      setOpen={setOpen}
      title={false}
      subtitle={false}
      hasCloseIcon={true}
      customClass="modal-login-width-web"
      closeAction={() => formik?.resetForm()}
      content={
        !otpView ? (
          <>
            <Box sx={containerStyle}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: isMobile ? 2 : 4,
                }}
              >
                <Image
                  src="/logo/road-atlobha-text.svg"
                  alt="logo"
                  width={103}
                  height={103}
                  loading="lazy"
                />
              </Box>
              <Box
                sx={{
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "500",
                  lineHeight: "29px",
                  mb: isMobile ? 1 : 2,
                  color: "#1C1C28",
                }}
              >
                {t.loginNow}
              </Box>
              {/* buttons for social login */}
              <SocialLogins />
            </Box>
            <Root>
              <Divider>{t.or}</Divider>
            </Root>
            <Box sx={containerStyle}>
              <Box sx={{ mt: 2, position: "relative" }}>
                {true ? (
                  <SharedTextField
                    id={id}
                    customPadding={`${
                      formik?.values?.phone?.length && !textInput
                        ? "0px 55px"
                        : ""
                    }`}
                    placeholder={t.emailOrPhone}
                    handleChange={(e) => {
                      formik.handleChange(e);
                      handleInputChange(e);
                    }} // Custom handler
                    handleBlur={formik.handleBlur}
                    error={
                      textInput
                        ? formik.errors["text_input"]
                        : formik.errors["phone"]
                    }
                    name={`${textInput ? "text_input" : "phone"}`}
                    value={
                      textInput
                        ? formik.values?.text_input
                        : formik.values?.phone
                    }
                    setFieldValue={formik.setFieldValue}
                    label={false}
                    imgIcon={false}
                    toolTipTitle={t.vinNumHint}
                    alignPosition={locale === "en" ? "start" : "end"}
                  />
                ) : (
                  <SharedPhoneInput
                    touched={formik.touched}
                    errors={formik.errors}
                    values={formik.values}
                    setFieldValue={formik.setFieldValue}
                    handleBlur={formik.handleBlur}
                    name="phone"
                    handleInputChange={handleInputChange}
                  />
                )}
                {!textInput && formik?.values?.phone && (
                  <Box className="code-num" lang={locale}>
                    {locale === "en" && "+"}966{locale === "ar" && "+"}
                  </Box>
                )}
              </Box>
              <Box sx={{ mt: 4 }}>
                <SharedBtn
                  id={customIDLogin}
                  disabled={!formik.isValid || registerLoad || otpLoad}
                  text={registerLoad || otpLoad ? null : "continue"}
                  className="black-btn"
                  customClass="w-100"
                  type="submit"
                  compBeforeText={
                    registerLoad || otpLoad ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null
                  }
                  onClick={() => formik.handleSubmit()}
                  //   onClick={() => setOtpView(true)}
                />
              </Box>
              <Box
                sx={{
                  mt: isMobile ? 2 : 3,
                  fontSize: isMobile ? "11px" : "14px",
                  fontWeight: "400",
                  color: "#6B7280",
                  textAlign: "center",
                }}
              >
                {t.loginHintOne}{" "}
                <Box
                  component="span"
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  {t.loginHintTwo}
                </Box>{" "}
                {t.loginHintThree}
              </Box>
            </Box>
          </>
        ) : (
          <OtpView
            customIDOtpField={customIDOtpField}
            containerStyle={containerStyle}
            setOtpView={setOtpView}
            recallReqOtp={recallReqOtp}
            otpLoad={otpLoad}
            setTimer={setTimer}
            timer={timer}
            otpPayload={otpPayload}
            setOpen={setOpen}
            textInput={textInput}
          />
        )
      }
    />
  );
}

export default Login;
