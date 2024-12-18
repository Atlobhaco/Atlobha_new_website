import BreadCrumb from "@/components/BreadCrumb";
import React, { useRef, useState } from "react";
import AddNewCarData from "@/components/AddNewCarData";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import DialogCentered from "@/components/DialogCentered";
import VinNumIInfo from "@/components/VinNumInfo";

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
    <div className="container-fluid pt-3">
      <div className="row mb-2">
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
