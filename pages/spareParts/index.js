import AddsparePart from "@/components/spareParts/AddSparePart";
import ColoredHint from "@/components/ColoredHint";
import MetaTags from "@/components/shared/MetaTags";
import PaymentMethodSpare from "@/components/spareParts/PaymentMethodSpare";
import PromoCodeSpare from "@/components/spareParts/PromoCodeSpare";
import SharedTextArea from "@/components/shared/SharedTextArea";
import { Box, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import DialogCentered from "@/components/DialogCentered";
import DialogMultiDirection from "@/components/DialogMultiDirection";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import HowMakePrice from "@/components/spareParts/HowMakePrice";
import SharedBtn from "@/components/shared/SharedBtn";
import AvailablePaymentMethodsImgs from "@/components/spareParts/AvailablePaymentMethodsImgs";
import PartsImages from "@/components/spareParts/PartsImages";
import useLocalization from "@/config/hooks/useLocalization";
import AddPartDialogContent from "@/components/spareParts/AddPartDialogContent";
import { useDispatch, useSelector } from "react-redux";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";
import Login from "@/components/Login";
import { isAuth } from "@/config/hooks/isAuth";
import { ORDERS, SPARE_PARTS, USERS } from "@/config/endPoints/endPoints";
import { useAuth } from "@/config/providers/AuthProvider";
import useCustomQuery from "@/config/network/Apiconfig";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { addOrUpdateSparePart } from "@/redux/reducers/addSparePartsReducer";

const style = {
  marginTop: "32px",
};

function SpareParts() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [openHowPricing, setOpenhowPricing] = useState(false);
  const [openPricingDialog, setOpenPricingDialog] = useState(false);
  const { selectedParts } = useSelector((state) => state.addSpareParts);
  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();
  const [promoCodeId, setPromoCodeId] = useState(false);
  const [comment, setComment] = useState("");
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );

  const {
    data,
    refetch: addPricing,
    isLoading,
  } = useCustomQuery({
    name: "makePricingRequest",
    url: `${SPARE_PARTS}${USERS}/${user?.data?.user?.id}${ORDERS}`,
    refetchOnWindowFocus: false,
    enabled: false,
    method: "post",
    body: {
      address: {
        id: selectedAddress?.id || defaultAddress?.id,
      },
      vehicle: {
        id: selectedCar?.id || defaultCar?.id,
      },
      parts: selectedParts?.map((part) => ({
        ...part,
        image_path: part?.imgPathForBe || "",
      })),
      promo_code: {
        id: promoCodeId,
      },
      notes: comment,
    },
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      router.push(`/spareParts/confirmation/${res?.id}`);
      selectedParts?.map((singlePart) =>
        dispatch(addOrUpdateSparePart({ ...singlePart, delete: true }))
      );
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.first_error ||
          err?.response?.data?.error ||
          t.someThingWrong
      );
    },
  });
  const handleRequestSparePart = () => {
    if (!isAuth()) {
      return setOpenLogin(true); // Open login modal if no user is authenticated
    }

    const triggers = [
      {
        condition: !selectedCar?.id && !defaultCar?.id,
        elementId: "openAddCarModalProgramatically",
      },
      {
        condition:
          (!selectedAddress?.id && defaultAddress?.id === "currentLocation") ||
          !defaultAddress?.id,
        elementId: "openAddAddressModalProgramatically",
      },
    ];

    for (const { condition, elementId } of triggers) {
      if (condition) {
        document.getElementById(elementId)?.click();
        return;
      }
    }
    addPricing();
  };

  const returnConfirmBtn = () => {
    return (
      <SharedBtn
        className="big-main-btn"
        customClass="w-100"
        text="makeSpare"
        disabled={!selectedParts?.length}
        compBeforeText={
          isLoading && <CircularProgress color="inherit" size={10} />
        }
        onClick={() => {
          handleRequestSparePart();
        }}
      />
    );
  };

  return (
    <Box>
      <MetaTags title={t.sparePartPricing} content={t.discoverPricingMade} />
      <div className="container pb-5 mb-5">
        <div className="row" style={style}>
          <div className="col-12">
            <ColoredHint
              bgColor="#FEFCED"
              header={t.howPricingMade}
              subHeader={t.discoverPricingMade}
              iconPath="/icons/money.svg"
              onClick={() => setOpenhowPricing(true)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 col-12 mt-4">
            <AddsparePart setOpenPricingDialog={setOpenPricingDialog} />
            <div className="mt-4">
              <PromoCodeSpare
                promoCodeId={promoCodeId}
                setPromoCodeId={setPromoCodeId}
              />
            </div>
            <div className="mt-4">
              <SharedTextArea
                value={comment}
                label={t.addComment}
                placeholder={t.writeHere}
                handleChange={(e) => setComment(e?.target?.value)}
              />
            </div>
          </div>
          <div className="col-md-4 col-12 mt-4">
            <PaymentMethodSpare />
            {!isMobile && (
              <Box sx={{ margin: "30px 0px" }}>{returnConfirmBtn()}</Box>
            )}
            <AvailablePaymentMethodsImgs />
          </div>
        </div>
        <div
          className="row"
          style={{
            marginTop: isMobile ? "30px" : "48px",
          }}
        >
          <div className="col-12 text-center">
            <PartsImages />
            {isMobile && (
              <Box sx={{ marginTop: "30px" }}>{returnConfirmBtn()}</Box>
            )}
          </div>
        </div>
      </div>

      {/* popup for how to make price */}
      <DialogCentered
        showTitle={null}
        open={openHowPricing}
        setOpen={setOpenhowPricing}
        hasCloseIcon
        customClass={!isMobile ? "sm-popup-width" : ""}
        content={<HowMakePrice setOpenhowPricing={setOpenhowPricing} />}
      />

      {/* dialog to add new spare parts info and image */}
      <DialogCentered
        hasCloseIcon={true}
        open={openPricingDialog}
        setOpen={setOpenPricingDialog}
        title={false}
        subtitle={false}
        customTransition={true}
        customClass="minimize-center-dialog-width"
        content={
          <AddPartDialogContent setOpenPricingDialog={setOpenPricingDialog} />
        }
      />

      <Login showBtn={!showBtn} open={openLogin} setOpen={setOpenLogin} />
    </Box>
  );
}

export default SpareParts;
