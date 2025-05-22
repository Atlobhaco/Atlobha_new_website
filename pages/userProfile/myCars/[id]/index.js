import BreadCrumb from "@/components/BreadCrumb";
import { usersVehiclesQuery } from "@/config/network/Shared/GetDataHelper";
import React, { useEffect, useRef, useState } from "react";
import { setAllCars, setDefaultCar } from "@/redux/reducers/selectedCarReducer";
import useLocalization from "@/config/hooks/useLocalization";
import { useAuth } from "@/config/providers/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import AddNewCarData from "@/components/AddNewCarData";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import DialogCentered from "@/components/DialogCentered";
import VinNumIInfo from "@/components/VinNumInfo";
import { useRouter } from "next/router";
import { setModels, setBrands } from "@/redux/reducers/LookupsReducer";
import {
  useModelsQuery,
  userBrandsQuery,
} from "@/config/network/Shared/lookupsDataHelper";
import UserProfile from "../..";

function EditCarProfile() {
  const formikRef = useRef();
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();

  const [popupVinNumHint, setPopupinNumHint] = useState(false);
  const [brandId, setBrandId] = useState(null);

  const { allCars } = useSelector((state) => state.selectedCar);

  const [editableCar, setEditableCar] = useState(null);

  const clickTooltipOpenVinHint = () => {
    if (isMobile) {
      setPopupinNumHint(true);
    }
  };

  usersVehiclesQuery({
    setAllCars,
    user,
    dispatch,
    setDefaultCar,
  });

  useModelsQuery({
    setModels,
    dispatch,
    brandId,
  });

  userBrandsQuery({
    setBrands,
    dispatch,
  });

  useEffect(() => {
    if (id) {
      const carToEdit = allCars?.find((car) => +car?.id === +id);
      setBrandId(carToEdit?.brand?.id);
      setEditableCar({
        id: carToEdit?.id,
        brand: carToEdit?.brand?.id,
        model: carToEdit?.model?.id,
        year: carToEdit?.year,
        vin_number: carToEdit?.chassis_no,
        default_car: +carToEdit?.is_default === 1 ? true : false,
      });
    }
  }, [id]);

  return (
    <div className="container-fluid">
      <div className="row">
        {!isMobile && (
          <div className="col-md-4">
            <UserProfile />
          </div>
        )}
        <div className="col-md-8 col-12 pt-4">
          <div className="row mb-2">
            <BreadCrumb />
          </div>
          <div className="row mb-2">
            <div className="col-12 mt-4">
              <AddNewCarData
                formikRef={formikRef}
                hideDividerAndShowBtn={false}
                clickTooltipOpenVinHint={clickTooltipOpenVinHint}
                editableCar={editableCar}
                customIDs={{
                  brandId: "thirdBrandID",
                  modalId: "thirdModalID",
                  yearId: "thirdYearID",
                  vinId: "thirdVinID",
                  toggleId: "thirdToggleID",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* vin number hint with image appear in mobile */}
      <DialogCentered
        title={false}
        subtitle={false}
        open={popupVinNumHint}
        setOpen={setPopupinNumHint}
        hasCloseIcon
        content={<VinNumIInfo />}
        renderCustomBtns={false}
      />
    </div>
  );
}

export default EditCarProfile;
