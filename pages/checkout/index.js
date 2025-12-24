import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "../spareParts/confirmation/confirmation.module.scss";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";
import CheckoutData from "./CheckoutData";
import CheckoutSummary from "./CheckoutSummary";
import { useRouter } from "next/router";
import SharedBtn from "@/components/shared/SharedBtn";
import DialogCentered from "@/components/DialogCentered";
import MigrationPhoneLogic from "@/components/spareParts/migrationPhoneLogic";
import EnterPhoneNumber from "@/components/EnterPhoneNumber";
import EditInfo from "../userProfile/editInfo";
import { Box } from "@mui/material";
import { useAuth } from "@/config/providers/AuthProvider";
import { CITY_SETTINGS, LAT_LNG, USERS } from "@/config/endPoints/endPoints";
import { setUserData } from "@/redux/reducers/quickSectionsProfile";
import useCustomQuery from "@/config/network/Apiconfig";
import EditUserInfoDialog from "@/components/editUserInfoDialog";
import { toast } from "react-toastify";
import moment from "moment";

function Checkout() {
  const tamaraRef = useRef();
  const { user } = useAuth();
  const phoneRef = useRef();
  const { t } = useLocalization();
  const router = useRouter();
  const { isMobile } = useScreenSize();
  const { basket } = useSelector((state) => state.basket);
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const [selectAddress, setSelectAddress] = useState(false);
  const [promoCodeId, setPromoCodeId] = useState(false);
  const [migrationStep, setMigrationStep] = useState(1);
  const [openAddMobile, setOpenAddMobile] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phoneNum, setPhoneNum] = useState(false);
  const [addPhoneForTamara, setAddPhoneForTamara] = useState(false);
  const [phoneAddedForTamara, setPhoneAddedForTamara] = useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const dispatch = useDispatch();
  const [recallUserDataAgain, setRecallUserDataAgain] = useState(false);
  const tomorrow = moment().add(1, "day").locale("en").format("YYYY-MM-DD");
  const [expressDelivery, setExpressDelivery] = useState("normal");

  useEffect(() => {
    if (selectedAddress?.id || defaultAddress?.id) {
      setSelectAddress(selectedAddress?.id ? selectedAddress : defaultAddress);
    }
  }, [selectedAddress, defaultAddress]);

  const { data } = useCustomQuery({
    name: ["getProfileInfoForCheckout", openEditUserModal, recallUserDataAgain],
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

  const handleChangeAddress = (data) => {
    setSelectAddress(data);
  };

  const triggerChildPayment = () => {
    tamaraRef.current?.triggerTamaraPayment();
  };

  const { data: estimateRes, isLoading: loadDate } = useCustomQuery({
    name: ["deliveryDate", selectAddress?.lat, selectAddress?.lng],
    url: `${CITY_SETTINGS}${LAT_LNG}?latitude=${selectAddress?.lat}&longitude=${selectAddress?.lng}&date=${tomorrow}`,
    refetchOnWindowFocus: false,
    enabled: selectAddress?.lat || selectAddress?.lng ? true : false,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.first_error);
    },
  });

  return (
    <div className="container">
      <div className="row">
        {!basket?.length ? (
          <div className="col-12 mt-3">
            <div className="text-center p-5 mb-5">
              <Image
                loading="lazy"
                src="/icons/empty-basket.svg"
                width={117}
                height={106}
                alt="empty-basket"
              />
              <div className={style["basket-empty"]}>{t.emptyBasket}</div>
              <div className={style["basket-hint"]}>{t.canShopParts}</div>
              <SharedBtn
                className="big-main-btn"
                customClass={`${isMobile ? "w-75" : "w-50"} mt-3`}
                text="continueShopping"
                onClick={() => router.push("/")}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="col-md-8 col-12">
              <CheckoutData
                selectAddress={selectAddress}
                handleChangeAddress={handleChangeAddress}
                promoCodeId={promoCodeId}
                setPromoCodeId={setPromoCodeId}
                loadDate={loadDate}
                estimateRes={estimateRes}
                setExpressDelivery={setExpressDelivery}
                expressDelivery={expressDelivery}
              />
            </div>
            <div className={`col-md-4 col-12 mb-4 ${isMobile && "mt-3"}`}>
              {selectAddress?.id && (
                <CheckoutSummary
                  selectAddress={selectAddress}
                  setOpenAddMobile={setOpenAddMobile}
                  promoCodeId={promoCodeId}
                  setAddPhoneForTamara={setAddPhoneForTamara}
                  phoneAddedForTamara={phoneAddedForTamara}
                  ref={tamaraRef}
                  setOpenEditUserModal={setOpenEditUserModal}
                  estimateRes={estimateRes}
                  expressDelivery={expressDelivery}
                />
              )}
            </div>
          </>
        )}
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

export default Checkout;
