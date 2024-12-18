import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import SharedBtn from "../../SharedBtn";
import { useDispatch, useSelector } from "react-redux";
import { setBrands } from "@/redux/reducers/LookupsReducer";
import {
  setAllCars,
  setSelectedCar,
  setDefaultCar,
} from "@/redux/reducers/selectedCarReducer";
import DialogCentered from "@/components/DialogCentered";
import AddNewCarData from "@/components/AddNewCarData";
import CarSelectionFromNavbarWeb from "./CarSelectionFromNavbarWeb";
import CarSelectionFromNavMobile from "./CarSelectionFromNavMobile";
import VinNumIInfo from "@/components/VinNumInfo";
import { userBrandsQuery } from "@/config/network/Shared/lookupsDataHelper";
import { isAuth } from "@/config/hooks/isAuth";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";
import Login from "@/components/Login";
import { useAuth } from "@/config/providers/AuthProvider";
import { usersVehiclesQuery } from "@/config/network/Shared/GetDataHelper";

function CarPalette() {
  const { user } = useAuth();
  const formikRef = useRef();
  const dispatch = useDispatch();

  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const [anchorEl, setAnchorEl] = useState(null);
  const { brands } = useSelector((state) => state.lookups);
  const [openAddNewCar, setOpenAddNewCar] = useState(false);
  const [popupVinNumHint, setPopupinNumHint] = useState(false);
  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();
  const [selectCarPopUpMobile, setSelectCarPopUpModal] = useState(false);
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    if (!isAuth()) {
      setOpenLogin(true);
    } else {
      if (!brands?.length) {
        callBrands();
      }
      if (isMobile) {
        setSelectCarPopUpModal(true);
      } else {
        setAnchorEl(event.currentTarget); // Set the anchor element for the dropdown
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the dropdown
  };

  const mainComponent = {
    background: "white",
    borderRadius: "9px",
    border: "1.5px solid #B3B3B3",
    width: isMobile ? "178px" : "245px",
    height: isMobile ? "38px" : "56px",
    display: "flex",
    alignItems: "center",
  };
  const paletteImg = {
    width: "27px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    transform: locale === "ar" ? "rotateY(0deg)" : "rotateY(180deg)",
  };

  const selectedCarBox = {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    cursor: "pointer",
  };

  const noSelectedCarBox = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    color: "#374151",
    cursor: "pointer",
    fontSize: isMobile ? "10px" : "16px",
  };

  const textStyle = {
    fontSize: isMobile ? "10px" : "14px",
    color: "#232323",
    fontWeight: "500",
    textAlign: "center",
    width: "30%",
  };

  const clickTooltipOpenVinHint = () => {
    if (isMobile) {
      setPopupinNumHint(true);
    }
  };

  //   call user vehicle when component render
  useEffect(() => {
    if (isAuth()) {
      callUserVehicles();
    }
  }, []);

  const { refetch: callBrands } = userBrandsQuery({
    setBrands,
    dispatch,
  });

  const { refetch: callUserVehicles } = usersVehiclesQuery({
    setAllCars,
    user,
    dispatch,
    setSelectedCar,
    setOpenAddNewCar,
    setDefaultCar,
  });

  return (
    <>
      <Box sx={mainComponent}>
        <Box sx={paletteImg}>
          <Image
            alt="logo"
            width={130}
            height={isMobile ? 37 : 55}
            src="/icons/ksa-palette.svg"
          />
        </Box>
        {selectedCar?.id || defaultCar?.id ? (
          <Box sx={selectedCarBox} onClick={handleOpen}>
            <Box sx={textStyle}>
              {selectedCar?.brand?.name || defaultCar?.brand?.name}
            </Box>
            <Box>
              <Image
                alt={selectedCar?.brand?.name || defaultCar?.brand?.name}
                width={isMobile ? 30 : 43}
                height={isMobile ? 30 : 43}
                src={selectedCar?.brand?.image || defaultCar?.brand?.image}
              />
            </Box>
            <Box sx={textStyle}>
              {selectedCar?.year || defaultCar?.year}
              <Box> {selectedCar?.year || defaultCar?.year}</Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={noSelectedCarBox}
            onClick={handleOpen} // Trigger dropdown
          >
            <Image alt="add" width={22} height={22} src="/icons/add.svg" />
            <Box className="mt-1" component="span">
              {t.addVehicle}
            </Box>
          </Box>
        )}
      </Box>

      {/* Dropdown Menu for web */}
      <CarSelectionFromNavbarWeb
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
        setOpenAddNewCar={setOpenAddNewCar}
      />
      {/* poup car selection for mobile */}
      <DialogCentered
        title={false}
        subtitle={false}
        open={selectCarPopUpMobile}
        setOpen={setSelectCarPopUpModal}
        hasCloseIcon
        // customClass={!isMobile ? "sm-popup-width" : ""}
        content={<CarSelectionFromNavMobile />}
        renderCustomBtns={
          <Box sx={{ mt: 1, width: "100%" }}>
            <SharedBtn
              onClick={() => {
                handleClose();
                setOpenAddNewCar(true);
                setSelectCarPopUpModal(false);
              }}
              className="btn-outline-green"
              customClass="w-100"
              text="addNewCar"
              compBeforeText={
                <Image
                  alt="location"
                  width={20}
                  height={20}
                  src="/icons/location-green.svg"
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
        // customClass={!isMobile ? "sm-popup-width" : ""}
        content={
          <AddNewCarData
            formikRef={formikRef}
            clickTooltipOpenVinHint={clickTooltipOpenVinHint}
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

      {/* vin number hint with image appear in mobile */}
      <DialogCentered
        title={false}
        subtitle={false}
        open={popupVinNumHint}
        setOpen={setPopupinNumHint}
        hasCloseIcon
        // customClass={!isMobile ? "sm-popup-width" : ""}
        content={<VinNumIInfo />}
        renderCustomBtns={false}
      />
      <Login showBtn={!showBtn} open={openLogin} setOpen={setOpenLogin} />
    </>
  );
}

export default CarPalette;
