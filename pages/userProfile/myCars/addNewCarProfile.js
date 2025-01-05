import BreadCrumb from "@/components/BreadCrumb";
import React, { useRef, useState } from "react";
import AddNewCarData from "@/components/AddNewCarData";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import DialogCentered from "@/components/DialogCentered";
import VinNumIInfo from "@/components/VinNumInfo";
import UserProfile from "..";

function AddNewCar() {
  const formikRef = useRef();

  const { isMobile } = useScreenSize();
  const [popupVinNumHint, setPopupinNumHint] = useState(false);

  const clickTooltipOpenVinHint = () => {
    if (isMobile) {
      setPopupinNumHint(true);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {!isMobile && (
          <div className="col-md-4">
            <UserProfile />
          </div>
        )}
        <div className="col-md-8 col-12 pt-4">
          <div className="row">
            <BreadCrumb />
          </div>
          <div className="row mb-2">
            <div className="col-12 mt-4">
              <AddNewCarData
                formikRef={formikRef}
                hideDividerAndShowBtn={false}
                clickTooltipOpenVinHint={clickTooltipOpenVinHint}
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

export default AddNewCar;
