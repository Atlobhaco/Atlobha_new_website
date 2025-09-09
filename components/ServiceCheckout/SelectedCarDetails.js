import { usersVehiclesQuery } from "@/config/network/Shared/GetDataHelper";
import React, { useRef, useState } from "react";
import { setAllCars, setDefaultCar } from "@/redux/reducers/selectedCarReducer";
import { useAuth } from "@/config/providers/AuthProvider";
import { useDispatch } from "react-redux";
import Image from "next/image";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import DialogCentered from "../DialogCentered";
import CarSelectionFromNavMobile from "../shared/Navbar/CarPalette/CarSelectionFromNavMobile";
import SharedBtn from "../shared/SharedBtn";
import AddNewCarData from "../AddNewCarData";

function SelectedCarDetails({ userCar }) {
  const formikRef = useRef();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();

  const [openChangeCar, setOpenChangeCar] = useState(false);
  const [openAddNewCar, setOpenAddNewCar] = useState(false);
  const [popupVinNumHint, setPopupinNumHint] = useState(false);

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

  const mainBox = {
    padding: "16px 13px",
    gap: "10px",
    justifyContent: "space-between",
    cursor: "pointer",
  };
  const detailsBox = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  };
  const header = {
    color: "#232323",
    fontSize: "20px",
    fontWeight: "700",
  };

  const FlexCenter = {
    display: "flex",
    alignItems: "center",
  };

  return (
    <Box
      sx={{
        ...mainBox,
        ...FlexCenter,
      }}
    >
      <Box
        id="openTheCarSelectionModal"
        sx={{
          width: "100%",
          ...FlexCenter,
        }}
        onClick={(e) => {
          e?.stopPropagation();
          e?.preventDefault();
          setOpenChangeCar(true);
        }}
      >
        <Box>
          <Image
            loading="lazy"
            alt="car-logo"
            src={"/icons/car-yellow-logo.svg"}
            width={isMobile ? 30 : 48}
            height={isMobile ? 30 : 48}
            style={{
              width: "auto",
              height: "auto",
              maxHeight: "25px",
              maxWidth: "25px",
              ...(locale === "ar"
                ? { marginLeft: "8px" }
                : { marginRight: "8px" }),
            }}
          />
        </Box>
        <Box
          sx={{
            ...detailsBox,
          }}
        >
          <Box
            sx={{
              ...header,
            }}
          >
            {t.car}
          </Box>
          <Box
            sx={{
              gap: "15px",
              ...FlexCenter,
              color: "#232323",
              fontSize: isMobile ? "10px" : "16px",
              fontWeight: "600",
            }}
          >
            <Image
              loading="lazy"
              alt={userCar?.brand?.name}
              width={isMobile ? 30 : 45}
              height={isMobile ? 30 : 45}
              src={userCar?.brand?.image}
              style={{
                width: isMobile ? 30 : "auto",
                height: isMobile ? 30 : "auto",
                maxWidth: isMobile ? 30 : "45px",
                maxHeight: isMobile ? 30 : "45px",
              }}
            />
            <Box>
              {userCar?.brand?.name}
              <br />
              {userCar?.model?.name}
            </Box>
            <Box>
              {userCar?.year
                ?.toString()
                ?.replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[digit])}
              <Box>{userCar?.year}</Box>
            </Box>
          </Box>{" "}
        </Box>
      </Box>
      <Box
        onClick={(e) => {
          e?.stopPropagation();
          e?.preventDefault();
          setOpenChangeCar(true);
        }}
        sx={{ p: isMobile ? 0 : 3, cursor: "pointer" }}
      >
        <Image
          loading="lazy"
          src="/icons/arrow-left-sm.svg"
          width={isMobile ? 9 : 20}
          height={15}
          alt="arrow"
          style={{
            transform: locale === "ar" ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
      </Box>

      <DialogCentered
        title={false}
        subtitle={false}
        open={openChangeCar}
        setOpen={setOpenChangeCar}
        hasCloseIcon
        content={
          <Box
            sx={{
              maxHeight: "500px",
              overflow: "auto",
            }}
          >
            <CarSelectionFromNavMobile
              setSelectCarPopUpModal={setOpenChangeCar}
            />
          </Box>
        }
        renderCustomBtns={
          <Box sx={{ mt: 1, width: "100%" }}>
            <SharedBtn
              onClick={(e) => {
                e?.stopPropagation();
                e?.preventDefault();
                setOpenAddNewCar(true);
                setOpenChangeCar(false);
              }}
              className="btn-outline-green"
              customClass="w-100"
              text="addNewCar"
              compBeforeText={
                <Image
                  loading="lazy"
                  alt="location"
                  width={20}
                  height={20}
                  src="/icons/location-green.svg"
                  style={{
                    marginBottom: "4px",
                  }}
                />
              }
            />
          </Box>
        }
      />

      {/* add new car  data inputs */}
      <DialogCentered
        title={t.carDetails}
        subtitle={false}
        open={openAddNewCar}
        setOpen={setOpenAddNewCar}
        hasCloseIcon
        actionsWhenClose={() => formikRef.current.resetForm()}
        content={
          <AddNewCarData
            formikRef={formikRef}
            clickTooltipOpenVinHint={clickTooltipOpenVinHint}
            customIDs={{
              brandId: "fourthBrandID",
              modalId: "fourthModalID",
              yearId: "fourthYearID",
              vinId: "fourthVinID",
              toggleId: "fourthToggleID",
              color: "fourthColor",
              registration_plate_letters_ar:
                "fourthRegistration_plate_letters_ar",
              registration_plate_letters_en:
                "fourthRegistration_plate_letters_en",
              registration_plate_numbers_ar:
                "fourthRegistration_plate_numbers_ar",
              registration_plate_numbers_en:
                "fourthRegistration_plate_numbers_en",
            }}
          />
        }
        renderCustomBtns={
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              borderTop: "1px solid rgba(24, 24, 27, 0.06)",
              width: "100%",
              justifyContent: "flex-end",
              pt: 3,
              pb: 1,
            }}
          >
            <SharedBtn
              type="submit"
              text="addCar"
              className="big-main-btn"
              customClass={`${isMobile ? "w-100" : ""}`}
              onClick={() => {
                formikRef.current.submitForm();
              }}
            />

            {!isMobile && (
              <SharedBtn
                text="common.cancel"
                className="outline-btn"
                onClick={() => {
                  formikRef.current.resetForm();
                  setOpenAddNewCar(false);
                }}
              />
            )}
          </Box>
        }
      />
    </Box>
  );
}

export default SelectedCarDetails;
