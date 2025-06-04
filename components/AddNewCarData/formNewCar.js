import React, { useRef, useState } from "react";
import SharedDropDown from "../shared/SharedDropDown";
import { Formik, Form, ErrorMessage, Field } from "formik";
import useLocalization from "@/config/hooks/useLocalization";
import SharedTextArea from "../shared/SharedTextArea";
import SharedTextField from "../shared/SharedTextField";
import SharedToggle from "../shared/SharedToggle";
import { useDispatch, useSelector } from "react-redux";
import { useModelsQuery } from "@/config/network/Shared/lookupsDataHelper";
import { setModels } from "@/redux/reducers/LookupsReducer";
import SharedAutoComplete from "../SharedAutoComplete";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";

function FormNewCar({
  initialValues,
  validationSchema,
  handleSubmit,
  formikRef = {},
  clickTooltipOpenVinHint = () => {},
  editableCar = null,
  customIDs = {},
}) {
  const { t, locale } = useLocalization();
  const dispatch = useDispatch();
  const { brands, models, years } = useSelector((state) => state.lookups);
  const [brandId, setBrandId] = useState(null);
  const { isMobile } = useScreenSize();

  const { refetch: callModels } = useModelsQuery({
    setModels,
    dispatch,
    brandId,
  });

  const mainComponent = {
    background: "white",
    borderRadius: "9px",
    border: "1.5px solid #B3B3B3",
    width: isMobile ? "245px" : "320px",
    height: isMobile ? "70px" : "90px",
    display: "flex",
    alignItems: "center",
  };

  const paletteImg = {
    width: "35px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    ...(locale === "ar"
      ? { borderLeft: "1px solid #D1D5DB" }
      : { borderRight: "1px solid #D1D5DB" }),
  };

  const fieldsStyle = {
    width: "99%",
    border: "unset",
    outline: "none",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "500",
    color: "#6B7280",
    background: "unset !important",
    backgroundColor: "transparent !important",
    WebkitAppearance: "none !important",
    appearance: "none !important",
    boxShadow: "none !important",
  };
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
                    id={customIDs?.brandId || "brandSelection"}
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
                    id={customIDs?.modalId || "modelSelection"}
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
                    id={customIDs?.yearId || "yearSelection"}
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
                    id={customIDs?.vinId || "vinNumField"}
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
                    id={customIDs?.toggleId || "carDefaultToggle"}
                    label={t.carAsDefault}
                    value={values?.default_car || ""}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    error={errors["default_car"]}
                    name="default_car"
                  />
                </div>

                <div className="col-12">
                  <Box
                    sx={{
                      color: "#1C1C28",
                      fontSize: isMobile ? "15px" : "20px",
                      fontWeight: "500",
                      mb: 2,
                    }}
                  >
                    {t.extraData}
                  </Box>
                  <Box
                    sx={{
                      color: "#1C1C28",
                      fontSize: "12px",
                      fontWeight: "500",
                      mb: 1,
                    }}
                  >
                    {t.paletteInfo}{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "#B0B0B0",
                      }}
                    >
                      {t.optional}
                    </Box>
                  </Box>
                  <Box sx={mainComponent}>
                    <Box sx={paletteImg}>
                      <Image
                        alt="logo"
                        width={130}
                        height={isMobile ? 37 : 63}
                        style={{
                          height: "70%",
                        }}
                        src="/icons/saudi-palette.svg"
                      />
                    </Box>

                    <Box
                      sx={{
                        p: 1,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          justifyContent: "center",
                          width: "40%",
                          gap: "4px",
                        }}
                      >
                        <Field
                          placeholder={t.plateLetterAr}
                          type="text"
                          id={customIDs?.registration_plate_letters_ar}
                          name="registration_plate_letters_ar"
                          style={fieldsStyle}
                        />
                        <Field
                          placeholder={t.plateLetterEn}
                          type="text"
                          id={customIDs?.registration_plate_letters_en}
                          name="registration_plate_letters_en"
                          onChange={handleChange}
                          style={fieldsStyle}
                        />
                      </Box>
                      <Box>
                        <Image
                          alt="logo-sword"
                          width={40}
                          height={isMobile ? 37 : 63}
                          style={{
                            height: "100%",
                          }}
                          src="/icons/sword-palette.svg"
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          justifyContent: "center",
                          width: "40%",
                          gap: "4px",
                        }}
                      >
                        <Field
                          placeholder={t.plateNumAr}
                          type="text"
                          id={customIDs?.registration_plate_numbers_ar}
                          name="registration_plate_numbers_ar"
                          onChange={handleChange}
                          style={fieldsStyle}
                        />
                        <Field
                          placeholder={t.plateNumEn}
                          type="text"
                          id={customIDs?.registration_plate_numbers_en}
                          name="registration_plate_numbers_en"
                          onChange={handleChange}
                          style={fieldsStyle}
                        />
                      </Box>
                    </Box>
                  </Box>
                </div>

                <div className="col-12 mt-4">
                  <SharedTextField
                    id={customIDs?.color}
                    placeholder={t.carColor}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    error={touched["color"] && errors["color"]}
                    name="color"
                    value={values?.color || ""}
                    setFieldValue={setFieldValue}
                    label={t.carColor}
                    imgIcon={false}
                    besideLabel={t.optional}
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
