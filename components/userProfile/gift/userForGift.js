import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useLocalization from "@/config/hooks/useLocalization";
import SharedCheckbox from "@/components/shared/SharedCheckbox";
import SharedTextField from "@/components/shared/SharedTextField";
import { Formik } from "formik";
import SharedPhoneInput from "@/components/shared/SharedPhoneInput";
import SharedTextArea from "@/components/shared/SharedTextArea";
import SharedBtn from "@/components/shared/SharedBtn";
import { useSelector } from "react-redux";
import { riyalImgBlack } from "@/constants/helpers";
import DialogCentered from "@/components/DialogCentered";
import TermsCondition from "@/pages/userProfile/termsCondition";
import { useRouter } from "next/router";

function UserForGift({
  initialValues,
  validationSchema,
  handleSubmit,
  handlePhoneInputChange,
  selectedPrice,
}) {
  const router = useRouter();
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const [useCurrentUser, setUseCurrentUser] = useState(false);
  const { userDataProfile } = useSelector((state) => state.quickSection);
  const [openTerms, setOpenTerms] = useState(false);

  const handleCheckboxMySelf = async ({
    setFieldValue,
    validateForm,
    setTouched,
  }) => {
    if (!useCurrentUser) {
      // Fill form with user data
      setFieldValue("phone", userDataProfile?.phone || "+966");
      setFieldValue("name", userDataProfile?.name);
      setFieldValue("email", userDataProfile?.email);

      // Mark fields as touched so error messages disappear
      setTouched({ phone: false, name: false, email: false });

      // Revalidate form after autofill
      await validateForm();
    } else {
      setFieldValue("name", "");
      setFieldValue("email", "");
      setFieldValue("phone", `+966`);
    }
    setUseCurrentUser(!useCurrentUser);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        resetForm,
        setFieldValue,
        setFieldTouched,
        handleSubmit,
        isValid,
        setFieldError,
        validateForm,
        setTouched,
      }) => {
        return (
          <>
            <Box className="d-flex">
              <InfoOutlinedIcon
                sx={{
                  width: isMobile ? "18px" : "25px",
                  height: isMobile ? "18px" : "25px",
                  color: "#FFD400",
                  ...(locale === "ar" ? { ml: 1 } : { mr: 1 }),
                }}
              />
              <Typography
                sx={{
                  fontWeight: "700",
                  color: "#374151",
                  fontSize: `${isMobile ? "15px" : "20px"}`,
                }}
              >
                {t.deliveryDetails}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#232323",
                fontSize: isMobile ? "12px" : "18px",
                cursor: "pointer",
                width: "fit-content",
                my: 1,
              }}
            >
              <SharedCheckbox
                selectedId={useCurrentUser}
                handleCheckboxChange={() =>
                  handleCheckboxMySelf({
                    setFieldValue,
                    validateForm,
                    setTouched,
                  })
                }
                data={{ id: true }}
                showCircle={false}
              />
              <Box
                onClick={() =>
                  handleCheckboxMySelf({
                    setFieldValue,
                    validateForm,
                    setTouched,
                  })
                }
                sx={{ mt: 1 }}
              >
                {t.buyForSelf}
              </Box>
            </Box>

            <Box
              className="row"
              sx={isMobile ? { paddingBottom: "105px" } : {}}
            >
              <div className="col-md-6 col-12 mt-3">
                <SharedTextField
                  id="name"
                  placeholder={t.fullName}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  error={touched["name"] && errors["name"]}
                  name="name"
                  value={values?.name || ""}
                  setFieldValue={setFieldValue}
                  label={t.fullName}
                  showAstrick
                  imgIcon={false}
                  alignPosition="start"
                  customPadding="0px 10px"
                  disabled={
                    useCurrentUser &&
                    userDataProfile?.name &&
                    userDataProfile?.name === values?.name
                  }
                />
              </div>

              <div className="col-md-6 col-12 mt-3">
                <SharedPhoneInput
                  touched={touched}
                  errors={errors}
                  values={values}
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  name="phone"
                  handleInputChange={(e) =>
                    handlePhoneInputChange(e, setFieldValue)
                  }
                  label={t.phoneNumber}
                  showAstrick
                  disabled={
                    useCurrentUser &&
                    userDataProfile?.phone &&
                    userDataProfile?.phone === values?.phone
                  }
                />
              </div>

              <div className="col-md-6 col-12 mt-3">
                <SharedTextField
                  id="email"
                  placeholder={t.email}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  error={touched["email"] && errors["email"]}
                  name="email"
                  value={values?.email || ""}
                  setFieldValue={setFieldValue}
                  label={t.email}
                  imgIcon={false}
                  customPadding="0px 10px"
                  alignPosition="start"
                  disabled={
                    useCurrentUser &&
                    userDataProfile?.email &&
                    userDataProfile?.email === values?.email
                  }
                />
              </div>

              <div className="col-12 mt-3">
                <SharedTextArea
                  name="comment"
                  label={t.addMessage}
                  placeholder={t.writeHere}
                  minRows={4}
                  labelFontSize="12px"
                />
              </div>

              <div className="col-12">
                <Box
                  className={`${
                    isMobile
                      ? "data-over-foot-nav bg-white d-flex flex-column align-items-center"
                      : "d-flex flex-column align-items-center mt-3"
                  }`}
                  sx={
                    isMobile
                      ? {
                          width: "100% !important",
                          mx: 0,
                          p: 2,
                        }
                      : {}
                  }
                >
                  <Box
                    className="d-flex justify-content-between w-100"
                    sx={{
                      color: "#232323",
                      fontWeight: "700",
                    }}
                  >
                    <Box>1 {t.giftCards}</Box>
                    <Box>
                      {selectedPrice?.price || 0}
                      {riyalImgBlack()}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      color: "#6B7280",
                      fontWeight: "400",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    onClick={() => {
                      router.push(
                        {
                          pathname: router.pathname,
                          query: {
                            ...router.query,
                            customScreens: "true",
                          },
                        },
                        undefined,
                        { shallow: true } // prevents full reload
                      );
                      setOpenTerms(true);
                    }}
                  >
                    {t.youCanCheckTerms}
                  </Box>
                  <SharedBtn
                    className="big-main-btn"
                    customClass={`${isMobile ? "w-100" : "w-50"} mt-2`}
                    text="continueBuying"
                    type="submit"
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={
                      !selectedPrice?.price ||
                      !values.name || // check name field
                      !values.phone ||
                      !isValid
                    }
                  />
                </Box>
              </div>
            </Box>

            <DialogCentered
              hasCloseIcon={true}
              title={false}
              open={openTerms}
              setOpen={setOpenTerms}
              content={
                <Box sx={{ maxHeight: isMobile ? "85vh" : "50vh" }}>
                  <TermsCondition />
                </Box>
              }
            />
          </>
        );
      }}
    </Formik>
  );
}

export default UserForGift;
