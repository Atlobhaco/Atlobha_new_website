import React, { useEffect, useState } from "react";
import style from "./carPricing.module.scss";
import ColoredHint from "../../components/ColoredHint";
import useLocalization from "@/config/hooks/useLocalization";
import SelectCar from "./SelectCar";
import dynamic from "next/dynamic";
import CarPurchaseMethod from "./CarPurchaseMethod";
import SharedBtn from "../../components/shared/SharedBtn";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { VEHICLE_PRICING } from "@/constants/enums";
import { isAuth } from "@/config/hooks/isAuth";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";
import Login from "@/components/Login";
import DialogCentered from "@/components/DialogCentered";
import TermsCarPricingContent from "@/components/userProfile/termsCarPricingContent";

const CarSpecification = dynamic(() => import("./CarSpecification"), {
  ssr: false,
  loading: () => <div></div>, // Optional loading placeholder
});

function CarPricingContent({ setOpenhowPricing, setOpenTerms, openTerms }) {
  const router = useRouter();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [selectedCar, setSelectedCar] = useState({
    brandDetails: "",
    modelDetails: "",
    year: "",
  });
  const [selectedSpecify, setSelectedSpecify] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [importedCarSpecification, setImportedCarSpecification] =
    useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState({
    depositeValue: "",
    jobtitle: "",
  });
  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();

  const checkVaribalesForDisabled = () => {
    if (
      !selectedCar?.brandDetails ||
      !selectedCar?.modelDetails ||
      !selectedCar?.year ||
      !selectedSpecify ||
      (selectedSpecify === "Imported" && !importedCarSpecification) ||
      (selectedSpecify === "agency" && !selectedVariant) ||
      !selectedPurchase ||
      (selectedPurchase?.type === "INSTALLMENT" &&
        (!purchaseDetails?.depositeValue || !purchaseDetails?.jobtitle))
    )
      return true;
    else {
      return false;
    }
  };

  const handleCompleteOrderClicked = () => {
    if (!isAuth()) {
      return setOpenLogin(true);
    }
    const termsOpenedBefore = localStorage.getItem("termsOpenOnce");
    if (termsOpenedBefore) {
      const carPricingDetails = {
        brand: selectedCar.brandDetails || "",
        model: selectedCar.modelDetails || "",
        year: selectedCar.year || "",
        specify: selectedSpecify || "",
        variant: selectedVariant || "",
        importedSpec: importedCarSpecification || "",
        purchase: selectedPurchase || "",
        deposit: purchaseDetails.depositeValue || "",
        job: purchaseDetails.jobtitle || "",
      };

      localStorage.setItem(
        "carPricingDetails",
        JSON.stringify(carPricingDetails)
      );

      router.push(`/carPricing/checkout?secType=${VEHICLE_PRICING}`);
    } else {
      setOpenTerms("submit-button");
      localStorage.setItem("termsOpenOnce", true);
    }
  };

  return (
    <div className="container pb-5 mb-5">
      <div className={`${style["hint"]} row`}>
        <div className="col-12">
          <ColoredHint
            bgColor="#FEFCED"
            header={t.howPricingMade}
            subHeader={t.discoverPricingMade}
            iconPath="/icons/money.svg"
            onClick={() => setOpenhowPricing(true)}
          />
        </div>

        <div className="col-12">
          <SelectCar
            setSelectedCar={setSelectedCar}
            selectedCar={selectedCar}
          />
        </div>

        <div className="col-12">
          <CarSpecification
            selectedSpecify={selectedSpecify}
            setSelectedSpecify={setSelectedSpecify}
            selectedCar={selectedCar}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            importedCarSpecification={importedCarSpecification}
            setImportedCarSpecification={setImportedCarSpecification}
          />
        </div>

        <div className="col-12">
          <CarPurchaseMethod
            selectedPurchase={selectedPurchase}
            setSelectedPurchase={setSelectedPurchase}
            purchaseDetails={purchaseDetails}
            setPurchaseDetails={setPurchaseDetails}
          />
        </div>
      </div>
      <Box
        sx={{
          width: "100% !important",
        }}
        className={`d-flex align-items-center justify-content-center mt-4 flex-column ${
          isMobile && "data-over-foot-nav bg-white px-3 mx-0 pb-1"
        }`}
      >
        <SharedBtn
          id="completeOrderBtn"
          text="completeOrder"
          className="big-main-btn"
          customClass={`${isMobile ? "w-100" : "w-50"}`}
          disabled={checkVaribalesForDisabled()}
          onClick={() => handleCompleteOrderClicked()}
        />
        <div
          className={`${style["terms-condition"]}`}
          onClick={() => {
            setOpenTerms("terms-button");
            localStorage.setItem("termsOpenOnce", true);
          }}
        >
          {t.termsAndConditions}
        </div>
      </Box>

      <Login
        showBtn={!showBtn}
        open={openLogin}
        setOpen={setOpenLogin}
        id="sevenLogin"
        customIDOtpField="sevenOtpField"
        customIDLogin="sevenBtnLogin"
      />

      {/* popup for terms and conditions */}
      <DialogCentered
        showTitle={false}
        open={openTerms ? true : false}
        setOpen={setOpenTerms}
        hasCloseIcon
        content={
          <Box
            sx={{
              maxHeight: "60vh",
              overflow: "hidden auto",
              padding: "0px 2px",
            }}
          >
            <TermsCarPricingContent />
          </Box>
        }
        renderCustomBtns={
          <Box
            className={`w-100 gap-2  d-flex ${
              isMobile ? "flex-column" : "flex-row"
            }`}
          >
            <SharedBtn
              text="common.back"
              className="btn-outline-red"
              customClass={`${isMobile ? "w-100" : "w-50"}`}
              onClick={() => setOpenTerms(false)}
            />
            <SharedBtn
              text="AcceptContinue"
              className="big-main-btn"
              customClass={`${isMobile ? "w-100" : "w-50"}`}
              disabled={checkVaribalesForDisabled()}
              onClick={() => {
                handleCompleteOrderClicked();
              }}
            />
          </Box>
        }
      />
    </div>
  );
}

export default CarPricingContent;
