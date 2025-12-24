"use client";

import CarPricingCheckoutData from "@/pages/carPricing/checkout/CarPricingCheckoutData";
import CarPricingCheckoutSummary from "@/pages/carPricing/checkout/CarPricingCheckoutSummary";
import DialogCentered from "@/components/DialogCentered";
import EnterPhoneNumber from "@/components/EnterPhoneNumber";
import EditUserInfoDialog from "@/components/editUserInfoDialog";
import MigrationPhoneLogic from "@/components/spareParts/migrationPhoneLogic";
import { USERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { setUserData } from "@/redux/reducers/quickSectionsProfile";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function CheckoutCarPricing() {
  const tamaraRef = useRef();
  const { user } = useAuth();
  const phoneRef = useRef();
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const dispatch = useDispatch();
  const [carPricing, setCarPricing] = useState(null);
  const [migrationStep, setMigrationStep] = useState(1);
  const [openAddMobile, setOpenAddMobile] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phoneNum, setPhoneNum] = useState(false);
  const [recallUserDataAgain, setRecallUserDataAgain] = useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [addPhoneForTamara, setAddPhoneForTamara] = useState(false);
  const [phoneAddedForTamara, setPhoneAddedForTamara] = useState(false);
  const [promoCodeId, setPromoCodeId] = useState(false);
  const [selectAddress, setSelectAddress] = useState(false);
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );

  useEffect(() => {
    const data = localStorage.getItem("carPricingDetails");
    if (data) {
      setCarPricing(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (selectedAddress?.id || defaultAddress?.id) {
      setSelectAddress(selectedAddress?.id ? selectedAddress : defaultAddress);
    }
  }, [selectedAddress, defaultAddress]);

  const { data } = useCustomQuery({
    name: [
      "getProfileInfoForCarCheckout",
      openEditUserModal,
      recallUserDataAgain,
    ],
    url: `${USERS}/${user?.data?.user?.id}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: user?.data?.user?.id ? true : false,
    onSuccess: (res) => {
      setRecallUserDataAgain(false);
      dispatch(
        setUserData({
          data: res,
        })
      );
    },
  });

  const triggerChildPayment = () => {
    tamaraRef.current?.triggerTamaraPayment();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 col-12">
          <CarPricingCheckoutData
            promoCodeId={promoCodeId}
            setPromoCodeId={setPromoCodeId}
            carPricing={carPricing}
          />
        </div>
        <div className={`col-md-4 col-12 mb-4 ${isMobile && "mt-3"}`}>
          <CarPricingCheckoutSummary
            setOpenAddMobile={setOpenAddMobile}
            setOpenEditUserModal={setOpenEditUserModal}
            phoneAddedForTamara={phoneAddedForTamara}
            promoCodeId={promoCodeId}
            carPricing={carPricing}
			selectAddress={selectAddress}
          />
        </div>
      </div>

      {/* migration logic for phone */}
      <DialogCentered
        showTitle={isMobile ? false : true}
        title={
          migrationStep === 1
            ? t.addPhoneNum
            : migrationStep === 2
            ? t.mergeAccount
            : t.confirmPhone
        }
        subtitle={false}
        open={openAddMobile}
        setOpen={setOpenAddMobile}
        closeAction={() => {
          setMigrationStep(1);
          setOtpCode("");
          setPhoneNum(false);
        }}
        hasCloseIcon
        customClass="minimize-center-dialog-width"
        content={
          <MigrationPhoneLogic
            setMigrationStep={setMigrationStep}
            migrationStep={migrationStep}
            setOpenAddMobile={setOpenAddMobile}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            phoneNum={phoneNum}
            setPhoneNum={setPhoneNum}
            setRecallUserDataAgain={setRecallUserDataAgain}
          />
        }
      />

      {/* dialog to enter phone for user to can  pay with tamara */}
      <DialogCentered
        showTitle={true}
        title={t.addPhoneNum}
        subtitle={false}
        open={addPhoneForTamara}
        setOpen={setAddPhoneForTamara}
        closeAction={() => {
          setAddPhoneForTamara(false);
          setPhoneAddedForTamara(false);
          phoneRef?.current?.resetForm();
        }}
        hasCloseIcon
        customClass="minimize-center-dialog-width"
        content={
          <EnterPhoneNumber
            ref={phoneRef}
            onSubmit={(phone) => {
              setPhoneAddedForTamara(phone);
              setAddPhoneForTamara(false);
              setTimeout(() => {
                triggerChildPayment();
              }, 500);
              phoneRef?.current?.resetForm(); // 👈 Reset form on close
            }}
          />
        }
      />

      {/* modal to edit user info data */}
      <EditUserInfoDialog
        openEditUserModal={openEditUserModal}
        setOpenEditUserModal={setOpenEditUserModal}
      />
    </div>
  );
}

export default CheckoutCarPricing;
