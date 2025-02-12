import BreadCrumb from "@/components/BreadCrumb";
import React from "react";
import * as Yup from "yup";
import UserProfile from "..";
import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import ComingSoon from "@/components/comingSoon";
import useScreenSize from "@/constants/screenSize/useScreenSize";

const flexBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

function EditInfo() {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const { userDataProfile } = useSelector((state) => state.quickSection);

  console.log("userDataProfile", userDataProfile);

  const initialValues = false || {
    brand: "",
    model: "",
    year: "",
    vin_number: "",
    default_car: false,
  };

  const validationSchema = Yup.object().shape({
    brand: Yup.string().required(t.required),
    model: Yup.string().required(t.required),
    year: Yup.string().required(t.required),
    vin_number: Yup.string()
      .min(14, t.vinNumLengthValidate)
      .max(17, t.vinNumLengthValidate)
      .required(t.required),
  });

  const handleSubmit = (values) => {
    // setAddPayload({
    //   model_id: values?.model,
    //   year: values?.year,
    //   chassis_no: values?.vin_number,
    //   is_default: values?.default_car,
    // });
  };

  return (
    <div className="container-fluid">
      <div className="row mb-2">
        {!isMobile && (
          <div className="col-md-4">
            <UserProfile />
          </div>
        )}
        <div className="col-md-8 col-12 pt-4">
          <div className="row">
            <BreadCrumb />
          </div>
          <div className="row mb-4 mt-3">
            {/* <Box sx={flexBox}>
              <Box
                sx={{
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                {t.editInfo}
              </Box>
            </Box> */}
            <ComingSoon />

            {/* <Formik
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
              }) => {
                // Log errors to the console
                //   console.log("Formik values:", values);

                return (
                  <>
                    <div className="col-12">line-1</div>
                    <div className="col-12">line-2</div>
                  </>
                );
              }}
            </Formik> */}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default EditInfo;
