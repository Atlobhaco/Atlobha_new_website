import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
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

function Checkout() {
  const tamaraRef = useRef();
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

  useEffect(() => {
    if (selectedAddress?.id || defaultAddress?.id) {
      setSelectAddress(selectedAddress?.id ? selectedAddress : defaultAddress);
    }
  }, [selectedAddress, defaultAddress]);

  const handleChangeAddress = (data) => {
    setSelectAddress(data);
  };

  const triggerChildPayment = () => {
    tamaraRef.current?.triggerTamaraPayment();
  };

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
    </div>
  );
}

export default Checkout;
