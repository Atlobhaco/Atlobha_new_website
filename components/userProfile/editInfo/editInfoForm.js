import React from "react";
import { Box, CircularProgress, Divider } from "@mui/material";

import SharedTextField from "@/components/shared/SharedTextField";
import SharedPhoneInput from "@/components/shared/SharedPhoneInput";
import SharedDatePicker from "@/components/shared/SharedDatePicker";
import SharedCheckbox from "@/components/shared/SharedCheckbox";
import SharedBtn from "@/components/shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function EditInfoForm({
  handleChange,
  handleBlur,
  touched,
  values,
  setFieldValue,
  handleSubmit,
  errors,
  handleInputChange,
  setChangedField,
  otpLoad,
  changedField,
}) {
  const { t } = useLocalization();
  const { userDataProfile } = useSelector((state) => state.quickSection);
  const router = useRouter();

  return (
    <>
      <div className="col-12 mt-3">
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
        />
      </div>
      <div className="col-12 mt-3 d-flex align-items-center gap-2">
        <Box
          sx={{
            width:
              values?.email &&
              touched["email"] &&
              !errors["email"] &&
              userDataProfile?.email !== values?.email
                ? "90%"
                : "100%",
          }}
        >
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
            showAstrick
            imgIcon={false}
            customPadding="0px 10px"
            alignPosition="start"
            disabled={userDataProfile?.email?.length}
          />
        </Box>
        {values?.email &&
          touched["email"] &&
          !errors["email"] &&
          userDataProfile?.email !== values?.email && (
            <SharedBtn
              text={`${
                otpLoad && changedField?.type === "email"
                  ? ""
                  : "common.confirm"
              }`}
              className="big-main-btn"
              customStyle={{ height: "42px" }}
              onClick={() => {
                setChangedField({
                  type: "email",
                  value: values?.email,
                });
              }}
              comAfterText={
                otpLoad && changedField?.type === "email" ? (
                  <CircularProgress color="inherit" size={15} />
                ) : null
              }
              disabled={otpLoad}
            />
          )}
      </div>
      <div className="col-12 mt-3 d-flex align-items-center gap-2">
        <Box
          sx={{
            width:
              values?.phone &&
              touched["phone"] &&
              !errors["phone"] &&
              userDataProfile?.phone !== values?.phone?.replace(/\s+/g, "")
                ? "90%"
                : "100%",
          }}
        >
          <SharedPhoneInput
            touched={touched}
            errors={errors}
            values={values}
            setFieldValue={setFieldValue}
            handleBlur={handleBlur}
            name="phone"
            handleInputChange={(e) => handleInputChange(e, setFieldValue)}
            label={t.phoneNumber}
            showAstrick
            hintBelowInput={t.pleaseUseEnglishNum}
          />
        </Box>
        {values?.phone &&
          touched["phone"] &&
          !errors["phone"] &&
          userDataProfile?.phone !== values?.phone?.replace(/\s+/g, "") && (
            <SharedBtn
              text={`${
                otpLoad && changedField?.type === "phone"
                  ? ""
                  : "common.confirm"
              }`}
              className="big-main-btn"
              customStyle={{ height: "42px" }}
              onClick={() => {
                setChangedField({
                  type: "phone",
                  value: values?.phone,
                });
              }}
              comAfterText={
                otpLoad && changedField?.type === "phone" ? (
                  <CircularProgress color="inherit" size={15} />
                ) : null
              }
              disabled={otpLoad}
            />
          )}
      </div>
      <div className="col-12 mt-4 mb-3">
        <SharedDatePicker
          value={values?.birthdate}
          label={t.birthdate}
          handleChange={(value) => {
            setFieldValue("birthdate", value);
          }}
          disableFuture
          error={touched["birthdate"] && errors["birthdate"]}
        />
      </div>
      <div className="col-12 mt-3 d-flex flex-column">
        <Box
          sx={{
            fontWeight: "500",
            fontSize: "12px",
            color: "#374151",
            mb: 1,
          }}
        >
          {t.gender}
        </Box>
        <Box className="d-flex gap-5">
          <Box
            className="cursor-pointer"
            onClick={() => {
              setFieldValue("gender", "male");
            }}
          >
            <SharedCheckbox
              selectedId={values?.gender}
              handleCheckboxChange={(object) => {
                setFieldValue("gender", object?.id);
              }}
              data={{ id: "male" }}
            />
            <span className="mx-2">{t.male}</span>
          </Box>
          <Box
            className="cursor-pointer"
            onClick={() => {
              setFieldValue("gender", "female");
            }}
          >
            <SharedCheckbox
              selectedId={values?.gender}
              handleCheckboxChange={(object) => {
                setFieldValue("gender", object?.id);
              }}
              data={{ id: "female" }}
            />
            <span className="mx-2">{t.female}</span>
          </Box>
        </Box>
      </div>
      <div className="col-12 mt-5">
        <Divider sx={{ background: "#EAECF0", mb: 5 }} />
      </div>
      <div className="col-12 d-flex gap-2 justify-content-end">
        <SharedBtn
          className="big-main-btn"
          text="saveChanges"
          type="submit"
          onClick={() => {
            handleSubmit();
          }}
        />
      </div>
    </>
  );
}

export default EditInfoForm;
