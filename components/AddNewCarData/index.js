import React, { useState } from "react";
import FormNewCar from "./formNewCar";
import * as Yup from "yup";
import { Box, Divider, Grid2 } from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";
import VinNumIInfo from "../VinNumInfo";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useCustomQuery from "@/config/network/Apiconfig";
import { USERS, VEHICLES } from "@/config/endPoints/endPoints";
import { useAuth } from "@/config/providers/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { usersVehiclesQuery } from "@/config/network/Shared/GetDataHelper";
import { setAllCars, setDefaultCar } from "@/redux/reducers/selectedCarReducer";
import { toast } from "react-toastify";
import SharedBtn from "../shared/SharedBtn";
import { useRouter } from "next/router";
import { userDefaultCar } from "@/config/network/Shared/SetDataHelper";

function AddNewCarData({
  formikRef,
  clickTooltipOpenVinHint = () => {},
  hideDividerAndShowBtn = true,
  editableCar = null,
}) {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useLocalization();

  const { isMobile } = useScreenSize();
  const [addPayload, setAddPayload] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const initialValues = editableCar || {
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
    setAddPayload({
      model_id: values?.model,
      year: values?.year,
      chassis_no: values?.vin_number,
      is_default: values?.default_car,
    });
  };

  const { refetch: callUserDefaultCar } = userDefaultCar({
    user,
    dispatch,
    selectedCar,
    //   callUserVehicles,
  });

  const { data, refetch: addCar } = useCustomQuery({
    name: ["addNewCarData", addPayload],
    url: `${
      editableCar?.id
        ? `${USERS}/${user?.data?.user?.id}${VEHICLES}/${editableCar?.id}`
        : `${USERS}/${user?.data?.user?.id}${VEHICLES}`
    }`,
    refetchOnWindowFocus: false,
    enabled: addPayload?.chassis_no ? true : false,
    select: (res) => res?.data?.data,
    method: editableCar?.id ? "put" : "post",
    body: addPayload,
    retry: 0,
    onSuccess: (res) => {
      if (res) {
        window.webengage.onReady(() => {
          webengage.track("NEW_CAR_ADDED", {
            car_brand: res?.brand?.name || "",
            car_model: res?.model?.name || "",
            car_year: res?.year || "",
            vin_number: res?.chassis_no || "",
          });
        });
      }
      if (
        router?.pathname === "/userProfile/myCars/addNewCarProfile" ||
        editableCar?.id
      ) {
        router.push("/userProfile/myCars");
      }
      // make car default by update it after success adding
      if (addPayload?.is_default && res) {
        setSelectedCar(res);
        // setTimeout(() => {
        //   callUserDefaultCar();
        // }, 500);
      }

      toast.success(editableCar?.id ? t.editedSuccessfully : t.carAddedSuccess);
      callUserVehicles();
      formikRef?.current?.resetForm();
      setAddPayload(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.first_error);
    },
  });

  const { refetch: callUserVehicles } = usersVehiclesQuery({
    setAllCars,
    user,
    dispatch,
    setDefaultCar,
  });

  return (
    <div className="row">
      {hideDividerAndShowBtn && (
        <div className="col-12">
          <Divider sx={{ background: "#EAECF0", mb: 3 }} />
        </div>
      )}
      <div className="col-md-6">
        <div className="row">
          <div className="col-12">
            {!hideDividerAndShowBtn && (
              <Box sx={{ mb: 2, fontSize: "20px", fontWeight: "500" }}>
                {editableCar?.id ? t.editCar : t.addNewCarProfile}
              </Box>
            )}
            <FormNewCar
              initialValues={initialValues}
              validationSchema={validationSchema}
              handleSubmit={handleSubmit}
              formikRef={formikRef}
              clickTooltipOpenVinHint={clickTooltipOpenVinHint}
              editableCar={editableCar}
            />
          </div>
        </div>
      </div>
      <div className="col-md-1"></div>
      <div className="col-md-5 mx-auto">
        {!isMobile && <VinNumIInfo />}
        {!hideDividerAndShowBtn && (
          <Box
            sx={{
              mt: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SharedBtn
              type="submit"
              text={editableCar?.brand ? "editCar" : "addCar"}
              className="big-main-btn"
              customClass={`${isMobile ? "w-100" : "w-75"}`}
              onClick={() => {
                formikRef.current.submitForm();
              }}
            />
          </Box>
        )}
      </div>
    </div>
  );
}

export default AddNewCarData;
