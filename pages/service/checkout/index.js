import DialogCentered from "@/components/DialogCentered";
import EnterPhoneNumber from "@/components/EnterPhoneNumber";
import ServiceCheckoutData from "@/components/ServiceCheckout/ServiceCheckoutData";
import ServiceCheckoutSummary from "@/components/ServiceCheckout/ServiceCheckoutSummary";
import EditUserInfoDialog from "@/components/editUserInfoDialog";
import MigrationPhoneLogic from "@/components/spareParts/migrationPhoneLogic";
import { CHECKOUT_FIELDS, USERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { setUserData } from "@/redux/reducers/quickSectionsProfile";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function CheckoutService() {
  const phoneRef = useRef();
  const tamaraRef = useRef();

  const { query } = useRouter();
  const {
    query: {
      serviceDetails,
      serviceTimeFixedOrPortable,
      serviceDatePortable,
      serviceDatefixed,
      type,
      selectedStore,
    },
  } = useRouter();
  const { isMobile } = useScreenSize();
  const { user } = useAuth();
  const { t, locale } = useLocalization();

  const [selectAddress, setSelectAddress] = useState(false);
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);
  const userCar = selectedCar?.id ? selectedCar : defaultCar;

  const [otpCode, setOtpCode] = useState("");
  const [phoneNum, setPhoneNum] = useState(false);
  const [migrationStep, setMigrationStep] = useState(1);
  const [promoCodeId, setPromoCodeId] = useState(false);
  const [openAddMobile, setOpenAddMobile] = useState(false);
  const [addPhoneForTamara, setAddPhoneForTamara] = useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [recallUserDataAgain, setRecallUserDataAgain] = useState(false);
  const [phoneAddedForTamara, setPhoneAddedForTamara] = useState(false);
  const [checkoutServiceDetails, setCheckoutServiceDetails] = useState(false);
  const [selectedFields, setSelectedFields] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedAddress?.id || defaultAddress?.id) {
      setSelectAddress(selectedAddress?.id ? selectedAddress : defaultAddress);
    }
  }, [selectedAddress, defaultAddress]);

  useCustomQuery({
    name: [
      "getProfileInfoForCheckoutService",
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
  const { data: checkoutRes } = useCustomQuery({
    name: "getChekoutFields",
    url: `/service/${checkoutServiceDetails?.serviceDetails?.id}${CHECKOUT_FIELDS}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: checkoutServiceDetails?.serviceDetails?.id ? true : false,
    onSuccess: (res) => {
      console.log("res-checkout", res);
      //   const filtered = Object.entries(res).reduce((acc, [key, arr]) => {
      //     const required = arr.filter((f) => f.is_required);
      //     if (required.length > 0) {
      //       acc[key] = required;
      //     }
      //     return acc;
      //   }, {});
      //   setSelectedFields(filtered);
    },
  });

  useEffect(() => {
    if (query?.serviceDetails) {
      setCheckoutServiceDetails({
        serviceDetails: JSON.parse(decodeURIComponent(serviceDetails || {})),
        serviceTimeFixedOrPortable: JSON.parse(
          decodeURIComponent(serviceTimeFixedOrPortable || {})
        ),
        serviceDatePortable: JSON.parse(
          decodeURIComponent(serviceDatePortable || {})
        ),
        serviceDatefixed: JSON.parse(
          decodeURIComponent(serviceDatefixed || {})
        ),
        type: type,
        selectedStore: JSON.parse(decodeURIComponent(selectedStore || {})),
      });
    }
  }, [query?.serviceDetails]);

  const carAvailable = !checkoutServiceDetails?.serviceDetails?.service_models
    ?.length
    ? true
    : checkoutServiceDetails?.serviceDetails?.service_models?.some(
        (c) =>
          +c.model.id === +userCar?.model?.id &&
          +c.model?.vehicle_brand?.id === +userCar?.brand?.id &&
          +userCar?.year >= +c.year_from &&
          +userCar?.year <= +c.year_to
      );
  const triggerChildPayment = () => {
    tamaraRef.current?.triggerTamaraPayment();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 col-12">
          <ServiceCheckoutData
            selectAddress={selectAddress}
            handleChangeAddress={(data) => setSelectAddress(data)}
            checkoutServiceDetails={checkoutServiceDetails}
            userCar={userCar}
            carAvailable={carAvailable}
            promoCodeId={promoCodeId}
            setPromoCodeId={setPromoCodeId}
            checkoutRes={checkoutRes}
            selectedFields={selectedFields}
            setSelectedFields={setSelectedFields}
          />
        </div>
        <div className={`col-md-4 col-12 mb-4 ${isMobile && "mt-3"}`}>
          <ServiceCheckoutSummary
            selectAddress={selectAddress}
            promoCodeId={promoCodeId}
            userCar={userCar}
            checkoutServiceDetails={checkoutServiceDetails}
            setOpenAddMobile={setOpenAddMobile}
            setOpenEditUserModal={setOpenEditUserModal}
            phoneAddedForTamara={phoneAddedForTamara}
            ref={tamaraRef}
            carAvailable={carAvailable}
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

export default CheckoutService;
