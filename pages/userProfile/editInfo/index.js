import BreadCrumb from "@/components/BreadCrumb";
import React, { useState } from "react";
import * as Yup from "yup";
import UserProfile from "..";
import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import EditInfoForm from "../../../components/userProfile/editInfo/editInfoForm";
import useCustomQuery from "@/config/network/Apiconfig";
import { EMAIL, ME, OTP, PHONE, USERS } from "@/config/endPoints/endPoints";
import OtpView from "@/components/Login/otpView";
import DialogCentered from "@/components/DialogCentered";
import { toast } from "react-toastify";
import moment from "moment";
import MergeStep from "@/components/spareParts/migrationPhoneLogic/mergeStep";

const flexBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

function EditInfo({
  hideSomeComponent = false,
  setOpenEditUserModal = () => {},
}) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const { userDataProfile } = useSelector((state) => state.quickSection);
  const [editPayload, setEditPayload] = useState(false);
  const [changedField, setChangedField] = useState(false);
  const [otpView, setOtpView] = useState(false);
  const [otpPayload, setOtpPayload] = useState(false);
  const [timer, setTimer] = useState(120);
  const [saveUserNewData, setSaveUserNewData] = useState(false);
  const [migrationStep, setMigrationStep] = useState(false);

  const containerStyle = {
    padding: `0px ${isMobile ? "0px" : "90px"}`,
  };

  const { data, refetch: EditUserData } = useCustomQuery({
    name: ["editUserInfo", editPayload],
    url: `${USERS}/${userDataProfile?.id}`,
    refetchOnWindowFocus: false,
    method: "put",
    body: editPayload,
    select: (res) => res?.data?.data,
    enabled: editPayload ? true : false,
    onSuccess: (res) => {
      setSaveUserNewData(true);
      setTimeout(() => {
        setSaveUserNewData(false);
      }, 500);
      setEditPayload(false);
      toast.success(hideSomeComponent ? t.canPayNow : t.editedSuccessfully);
      setOpenEditUserModal(false);
    },
    onError: (err) => {
      setEditPayload(false);
      setSaveUserNewData(false);
      toast.error(
        err?.response?.data?.first_error || err?.response?.data?.message
      );
    },
  });
  /* -------------------------------------------------------------------------- */
  /*                          send otp to changed field                         */
  /* -------------------------------------------------------------------------- */
  const { refetch: recallReqOtp, isFetching: otpLoad } = useCustomQuery({
    name: ["sendOtpToChangedField", changedField?.type],
    url: `${
      changedField?.type === "email" ? `${OTP}${EMAIL}` : `${OTP}${PHONE}`
    } `,
    refetchOnWindowFocus: false,
    method: "post",
    body:
      changedField?.type === "email"
        ? { email: changedField["value"] }
        : { phone: changedField["value"]?.replace(/\s+/g, "") },
    select: (res) => res?.data?.data,
    enabled: changedField?.type ? true : false,
    retry: 0,
    onSuccess: (res) => {
      setOtpView(true);
      setTimer(120);
      setOtpPayload({
        otp: null,
        type: changedField?.type,
      });
    },
    onError: (err) => {
      toast.error(t.OtpHourlyExceed);
      setChangedField(false);
      setOtpPayload(false);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                         confirm the  otp for field                         */
  /* -------------------------------------------------------------------------- */
  const { refetch: editPhoneOrEmail, isFetching: confirmOtpFetch } =
    useCustomQuery({
      name: ["ConfirmOtp"],
      url: `${
        changedField?.type === "email" ? `${ME}${EMAIL}` : `${ME}${PHONE}`
      } `,
      refetchOnWindowFocus: false,
      method: "patch",
      body:
        changedField?.type === "email"
          ? { email: changedField["value"], otp: otpPayload?.otp }
          : {
              phone: changedField["value"]?.replace(/\s+/g, ""),
              otp: otpPayload?.otp,
            },
      select: (res) => res?.data?.data,
      retry: 0,
      enabled: false,
      onSuccess: (res) => {
        setOtpView(false);
        setMigrationStep(false);
        toast.success(t.confirmedSuccess);
        setChangedField(false);
        setOtpPayload(false);
      },
      onError: (err) => {
        if (err?.response?.status === 409) {
          setMigrationStep(true);
          setOtpView(true);
          return null;
        }
        toast.error(err?.response?.data?.first_error || t.someThingWrong);
      },
    });

  const initialValues = {
    name: userDataProfile?.name || "",
    email: userDataProfile?.email || "",
    phone: userDataProfile?.phone || "",
    birthdate: userDataProfile?.birthdate || "",
    gender: userDataProfile?.gender || "male",
  } || {
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: "male",
  };

  const validatePhoneNumber = (phone, countryCode) => {
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
    return phoneNumber && phoneNumber.isValid();
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t.required).min(4, t.minLength4),
    email: Yup.string()
      .required(t.required)
      .email(t.invalidEmail)
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t.invalidEmail
      ),
    phone: Yup.string()
      .required(t.required)
      .test("is-valid-phone", t.invalid_phone, function (value) {
        const { country } = this.parent;
        return validatePhoneNumber(value, country);
      }),
    birthdate: Yup.string()
      .test("is-not-future", t.invalidDate, (value) => {
        return value ? new Date(value) <= new Date() : true;
      })
      .test("is-adult", t.invalidDate, (value) => {
        if (!value) return true; // Allow empty values (optional field)

        const birthDate = moment(value, "YYYY-MM-DD");
        const today = moment();
        const age = today.diff(birthDate, "years"); // Calculate age

        return age >= 18; // Must be 18 or older
      }),
  });

  const handleSubmit = (values) => {
    if (values?.birthdate?.length) {
      setEditPayload({
        ...values,
        language: locale,
        birthdate: values?.birthdate?.length
          ? moment(values?.birthdate)?.locale("en")?.format("YYYY-MM-DD")
          : null,
      });
    } else {
      const { birthdate, ...rest } = values;
      setEditPayload({
        ...rest,
        language: locale,
      });
    }
  };

  const handleInputChange = (e, setFieldValue) => {
    if (!e?.target?.value.startsWith("+966")) {
      setFieldValue("phone", `+966`);
    } else {
      setFieldValue("phone", e?.target?.value);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mb-2">
        {!isMobile && !hideSomeComponent && (
          <div className="col-md-4">
            <UserProfile recallUserData={saveUserNewData} />
          </div>
        )}
        <div className={`${!hideSomeComponent && "col-md-8 pt-4"} col-12`}>
          {!hideSomeComponent && (
            <div className="row">
              <BreadCrumb />
            </div>
          )}
          <div className="row mb-4 mt-3">
            {!hideSomeComponent && (
              <Box sx={flexBox}>
                <Box
                  sx={{
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  {t.editInfo}
                </Box>
              </Box>
            )}

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
              }) => {
                // Log errors to the console
                // console.log("Formik values:", errors);

                return (
                  <EditInfoForm
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    touched={touched}
                    values={values}
                    setFieldValue={setFieldValue}
                    handleSubmit={handleSubmit}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    setChangedField={setChangedField}
                    otpLoad={otpLoad}
                    changedField={changedField}
					hideSomeComponent={hideSomeComponent}
                  />
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
      <DialogCentered
        actionsWhenClose={() => {
          setMigrationStep(false);
          setOtpView(false);
          setChangedField(false);
          setOtpPayload(false);
        }}
        open={otpView}
        setOpen={setOtpView}
        title={false}
        subtitle={false}
        hasCloseIcon={true}
        customClass="modal-login-width-web"
        content={
          migrationStep && migrationStep !== 1 ? (
            <MergeStep
              setOpenAddMobile={setOtpView}
              setMigrationStep={setMigrationStep}
              phoneNum={changedField["value"]
                ?.replace(/\s+/g, "")
                ?.replace(/^\+966/, "")}
              otpCode={otpPayload?.otp}
              setPhoneNum={() => {}}
              setOtpCode={setOtpPayload}
              setChangedField={setChangedField}
              editProfile={true}
            />
          ) : (
            <OtpView
              customIDOtpField="editInfoId"
              containerStyle={containerStyle}
              setOtpView={setOtpView}
              recallReqOtp={recallReqOtp}
              otpLoad={otpLoad}
              setTimer={setTimer}
              timer={timer}
              otpPayload={otpPayload}
              setOpen={setOtpView}
              textInput={changedField?.type === "email"}
              confirmOtpEntered={editPhoneOrEmail}
              setOtpPayload={setOtpPayload}
              confirmOtpFetch={confirmOtpFetch}
            />
          )
        }
      />
    </div>
  );
}

export default EditInfo;
