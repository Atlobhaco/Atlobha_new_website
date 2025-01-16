import React, { useRef, useState } from "react";
import SharedDropDown from "../shared/SharedDropDown";
import { Formik, Form, ErrorMessage } from "formik";
import useLocalization from "@/config/hooks/useLocalization";
import SharedTextArea from "../shared/SharedTextArea";
import SharedTextField from "../shared/SharedTextField";
import SharedToggle from "../shared/SharedToggle";
import { useDispatch, useSelector } from "react-redux";
import { useModelsQuery } from "@/config/network/Shared/lookupsDataHelper";
import { setModels } from "@/redux/reducers/LookupsReducer";
import SharedAutoComplete from "../SharedAutoComplete";

function FormNewCar({
  initialValues,
  validationSchema,
  handleSubmit,
  formikRef = {},
  clickTooltipOpenVinHint = () => {},
  editableCar = null,
}) {
  const { t } = useLocalization();
  const dispatch = useDispatch();
  const { brands, models, years } = useSelector((state) => state.lookups);
  const [brandId, setBrandId] = useState(null);

  const { refetch: callModels } = useModelsQuery({
    setModels,
    dispatch,
    brandId,
  });

  return (
    <div>
      <Formik
        innerRef={formikRef}
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
            <Form>
              <div className="row">
                <div className="col-6">
                  <SharedDropDown
                    id="brandSelection"
                    handleChange={(e) => {
                      setBrandId(e?.target?.value);
                      setFieldValue("model", "");
                      handleChange(e);
                    }}
                    handleBlur={handleBlur}
                    error={touched["brand"] && errors["brand"]}
                    name="brand"
                    value={values?.brand || ""}
                    setFieldValue={setFieldValue}
                    label={t.brand}
                    showAstrick
                    items={brands}
                    disabled={editableCar?.id}
                  />
                </div>

                <div className="col-6">
                  <SharedDropDown
                    id="modelSelection"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    error={touched["model"] && errors["model"]}
                    name="model"
                    value={values?.model || ""}
                    setFieldValue={setFieldValue}
                    label={t.model}
                    showAstrick
                    items={models}
                    disabled={editableCar?.id}
                  />
                </div>
                <div className="col-12 mt-3">
                  <SharedDropDown
                    id="yearSelection"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    error={touched["year"] && errors["year"]}
                    name="year"
                    value={values?.year || ""}
                    setFieldValue={setFieldValue}
                    label={t.year}
                    showAstrick
                    items={years}
                    disabled={editableCar?.id}
                  />
                </div>

                <div className="col-12 mt-3">
                  <SharedTextField
                    id="vinNumField"
                    placeholder={t.vinNum}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    error={touched["vin_number"] && errors["vin_number"]}
                    name="vin_number"
                    value={values?.vin_number || ""}
                    setFieldValue={setFieldValue}
                    label={t.vinNum}
                    showAstrick
                    imgIcon="/icons/exclumation.svg"
                    toolTipTitle={t.vinNumHint}
                    actionClickIcon={clickTooltipOpenVinHint}
                  />
                </div>
                <div className="col-12 mt-3">
                  <SharedToggle
                    id="carDefaultToggle"
                    label={t.carAsDefault}
                    value={values?.default_car || ""}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    error={errors["default_car"]}
                    name="default_car"
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default FormNewCar;
