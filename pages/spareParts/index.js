import AddsparePart from "@/components/spareParts/AddSparePart";
import ColoredHint from "@/components/ColoredHint";
import MetaTags from "@/components/shared/MetaTags";
import PaymentMethodSpare from "@/components/spareParts/PaymentMethodSpare";
import PromoCodeSpare from "@/components/spareParts/PromoCodeSpare";
import SharedTextArea from "@/components/shared/SharedTextArea";
import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import {
  MEDIA,
  ORDERS,
  SPARE_PARTS,
  USERS,
} from "@/config/endPoints/endPoints";
import { useAuth } from "@/config/providers/AuthProvider";
import useCustomQuery from "@/config/network/Apiconfig";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {
  addOrUpdateSparePart,
  clearSpareParts,
  setPromoCodeForSpareParts,
} from "@/redux/reducers/addSparePartsReducer";
import MigrationPhoneLogic from "@/components/spareParts/migrationPhoneLogic";
import LimitedSupportCar from "@/components/LimitedSupportCar/LimitedSupportCar";
import LimitedCarDontShowAgain from "@/components/LimitedSupportCar/LimitedCarDontShowAgain";

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
  const { selectedParts, isLoading } = useSelector(
    (state) => state.addSpareParts
  );
  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();
  const [promoCodeId, setPromoCodeId] = useState(false);
  const [comment, setComment] = useState("");
  const [openAddMobile, setOpenAddMobile] = useState(false);
  const [migrationStep, setMigrationStep] = useState(1);
  const [otpCode, setOtpCode] = useState("");
  const [phoneNum, setPhoneNum] = useState(false);
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const [finalPartsAfterImgUpload, setFinalPartsAfterImageUpload] = useState(
    []
  );
  const [openLimitSupport, setOpenLimitSupport] = useState(false);
  const [openLimitDontShow, setOpenLimitDontShow] = useState(false);
  const formDataImagesUploader = new FormData();
  const defaultValue = {
    quantity: 1,
    imgSrc: "",
    imgFile: "",
    id: null,
    name: "",
  };
  const [addedPart, setAddedPart] = useState(defaultValue);
  //  clear the part that may be selected from order details
  useEffect(() => {
    if (selectedParts?.some((obj) => obj.showPrice === true)) {
      dispatch(clearSpareParts());
    }
	// check if sparePartsProducts saved in localStorage for reload happen in (social login)
    const sparePartProducts = JSON.parse(
      localStorage.getItem("sparePartsProducts")
    );
    if (sparePartProducts && sparePartProducts?.length) {
      dispatch(addOrUpdateSparePart(sparePartProducts));
    }

    window.webengage.onReady(() => {
      webengage.track("SPAREPARTS_VIEWED", {
        event_status: true,
      });
    });
  }, []);

  useEffect(() => {
    let car = selectedCar?.id ? selectedCar : defaultCar;
    if (!car?.brand?.enabled_for_spare_parts && isAuth()) {
      const stored = localStorage.getItem("carLimitSupport");

      if (!stored) {
        // Show popup for the first time
        setTimeout(() => {
          setOpenLimitDontShow(true);
        }, 2000);
        return;
      }

      try {
        const parsed = JSON.parse(stored);

        const isSameCar = parsed.openedWithChaseNum === car?.chassis_no;
        const dontShowAgain = parsed.dontShowAgain === "true";

        // never open if dont show again is selected
        if (dontShowAgain) {
          return setOpenLimitDontShow(false);
        }
        if (!isSameCar) {
          // Show popup if it's a new car or user hasn’t opted out
          setOpenLimitDontShow(true);
        }
      } catch (e) {
        console.error("Invalid carLimitSupport data", e);
        setOpenLimitDontShow(true); // fallback to showing
      }
    }
  }, [selectedCar, defaultCar]);

  const {
    data,
    refetch: addPricing,
    isLoading: loadOrder,
  } = useCustomQuery({
    name: ["makePricingRequest", finalPartsAfterImgUpload?.length],
    url: `${SPARE_PARTS}${USERS}/${user?.data?.user?.id}${ORDERS}`,
    refetchOnWindowFocus: false,
    enabled: finalPartsAfterImgUpload?.length ? true : false,
    method: "post",
    retry: 0,
    body: {
      address: {
        id: selectedAddress?.id || defaultAddress?.id,
      },
      vehicle: {
        id: selectedCar?.id || defaultCar?.id,
      },
      parts: (finalPartsAfterImgUpload?.length
        ? finalPartsAfterImgUpload
        : selectedParts
      )?.map((part) => ({
        ...part,
        image_path: part?.imgPathForBe || part?.image_path || "",
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
      dispatch(setPromoCodeForSpareParts({ data: null }));
      dispatch(clearSpareParts());
    },
    onError: (err) => {
      if (err?.response?.data?.error?.includes("phone")) {
        return setOpenAddMobile(true);
      }
      toast.error(
        err?.response?.data?.first_error ||
          err?.response?.data?.error ||
          t.someThingWrong
      );
    },
  });

  const {
    data: mediaRes,
    refetch: callUploadMedia,
    isFetching: fetchMedia,
  } = useCustomQuery({
    name: ["uploadMediaForSpareParts"],
    url: `${SPARE_PARTS}${ORDERS}${MEDIA}`,
    refetchOnWindowFocus: false,
    method: "post",
    body: formDataImagesUploader,
    enabled: false,
    retry: 0,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      const indexThatWillMerge = selectedParts
        ?.map((d, index) => (!d?.imgPathForBe && d?.imgSrc ? index : null))
        .filter((index) => index !== null);

      setFinalPartsAfterImageUpload(
        selectedParts.map((part, index) => {
          if (indexThatWillMerge.includes(index)) {
            const mergedData = res[indexThatWillMerge.indexOf(index)]; // Find corresponding data from anotherArray
            return {
              ...part,
              image_path: part?.imgPathForBe || mergedData?.image || "",
            };
          }
          return {
            ...part,
            image_path: part?.imgPathForBe || "",
          };
        })
      );
    },
    onError: (err) => {
      toast.error(t.someThingWrong);
    },
  });

  const handleRequestSparePart = () => {
    if (!isAuth()) {
      return setOpenLogin(true); // Open login modal if no user is authenticated
    }

    if (
      isAuth() &&
      ((selectedCar?.id && !selectedCar?.brand?.enabled_for_spare_parts) ||
        (defaultCar?.id && !defaultCar?.brand?.enabled_for_spare_parts))
    ) {
      return setOpenLimitSupport(true); // Open login modal if no user is authenticated
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
    const checkImgForBe = selectedParts?.some(
      (d) => !d?.imgPathForBe && d?.imgSrc
    );
    const imgWithoutPathBe = selectedParts?.filter(
      (d) => !d?.imgPathForBe && d?.imgSrc
    );

    if (checkImgForBe) {
      // Ensure this logic is inside an async function
      (async () => {
        imgWithoutPathBe?.forEach((part, index) => {
          formDataImagesUploader.append(`media[${index}]`, part.imgFile); // Append files with keys like media[0], media[1], etc.
        });

        try {
          const response = await callUploadMedia(); // Await the endpoint call
        } catch (error) {
          //   console.error("Error uploading media:", error);
        }
      })();
    } else {
      addPricing();
    }
  };

  const returnConfirmBtn = () => {
    return (
      <SharedBtn
        className="big-main-btn"
        customClass={`${isMobile && "data-over-foot-nav"} w-100`}
        text="makeSpare"
        disabled={
          !selectedParts?.length || loadOrder || fetchMedia || isLoading
        }
        compBeforeText={
          (loadOrder || fetchMedia || isLoading) && (
            <CircularProgress color="inherit" size={10} />
          )
        }
        onClick={() => {
          handleRequestSparePart();
        }}
      />
    );
  };

  return (
    <Box className="position-relative">
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
            <AddsparePart
              setOpenPricingDialog={setOpenPricingDialog}
              loadOrder={loadOrder}
              fetchMedia={fetchMedia}
            />
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
            <Box sx={{ margin: "30px 0px" }}>{returnConfirmBtn()}</Box>
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
            {/* {isMobile && (
              <Box sx={{ marginTop: "30px" }}>button</Box>
            )} */}
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

      {/* dialog to add new spare parts info and image */}
      <DialogCentered
        hasCloseIcon={true}
        open={openPricingDialog}
        setOpen={setOpenPricingDialog}
        title={false}
        subtitle={false}
        customTransition={true}
        customClass="minimize-center-dialog-width"
        closeAction={() => setAddedPart(defaultValue)}
        content={
          <AddPartDialogContent
            setOpenPricingDialog={setOpenPricingDialog}
            setAddedPart={setAddedPart}
            addedPart={addedPart}
            defaultValue={defaultValue}
          />
        }
      />

      <Login
        showBtn={!showBtn}
        open={openLogin}
        setOpen={setOpenLogin}
        id="fiveLogin"
        customIDOtpField="fiveOtpField"
        customIDLogin="fiveBtnLogin"
      />

      <LimitedSupportCar
        openLimitSupport={openLimitSupport}
        setOpenLimitSupport={setOpenLimitSupport}
      />

      <LimitedCarDontShowAgain
        openLimitDontShow={openLimitDontShow}
        setOpenLimitDontShow={setOpenLimitDontShow}
      />
    </Box>
  );
}

export default SpareParts;
