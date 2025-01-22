import React from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import useLocalization from "@/config/hooks/useLocalization";
import SharedCheckbox from "../../SharedCheckbox";
import {
  setSelectedCar,
  setDefaultCar,
  setAllCars,
} from "@/redux/reducers/selectedCarReducer";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SharedBtn from "../../SharedBtn";
import Image from "next/image";
import { userDefaultCar } from "@/config/network/Shared/SetDataHelper";
import { usersVehiclesQuery } from "@/config/network/Shared/GetDataHelper";
import { useAuth } from "@/config/providers/AuthProvider";

function CarSelectionFromNavbarWeb({
  open,
  anchorEl,
  handleClose,
  setOpenAddNewCar,
}) {
  const { user } = useAuth();
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();

  const dispatch = useDispatch();

  const { selectedCar, defaultCar, allCars } = useSelector(
    (state) => state.selectedCar
  );

  const cars = allCars?.length ? allCars : [];

  const menuPopup = {
    background: "#6B7280",
    borderRadius: " 20px",
    boxShadow: "0px 24px 24px 0px rgba(0, 0, 0, 0.14)",
    background: "white",
    width: "375px",
    left: "10px",
    position: "absolute",
    mt: 1,
    ...(locale === "ar"
      ? { right: "4vw !important" }
      : { left: "5vw !important" }),
    padding: "24px 20px",
    maxWidth: "75vw",
  };

  const header = {
    fontSize: "20px",
    fontWeight: "500",
    color: "black",
  };

  const handleCheckboxChange = (car) => {
    dispatch(setSelectedCar({ data: car }));
    handleClose();
    // callUserDefaultCar();
  };

  const { refetch: callUserVehicles } = usersVehiclesQuery({
    setAllCars,
    user,
    dispatch,
    setSelectedCar,
    setDefaultCar,
  });

  userDefaultCar({
    user,
    dispatch,
    setSelectedCar,
    selectedCar,
    callUserVehicles,
  });

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      sx={{
        mt: selectedCar?.id || defaultCar?.id ? 0 : 2, // Add spacing between the box and dropdown
        "& .MuiPaper-root": menuPopup,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxHeight: "50vh",
          overflow: "hidden auto",
        }}
      >
        <Box sx={header}>{!!allCars?.length && t.myCars}</Box>
        {cars.map((car) => (
          <Box
            key={car.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 0px",
            }}
          >
            {/* Checkbox */}
            <SharedCheckbox
              selectedId={selectedCar?.id || defaultCar?.id}
              handleCheckboxChange={handleCheckboxChange}
              data={car}
            />

            {/* Car Logo */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: isMobile ? "30px" : "48px",
                height: isMobile ? "30px" : "48px",
                cursor: "pointer",
              }}
              onClick={() => handleCheckboxChange(car)}
            >
              <Image
                alt={car?.brand?.name}
                src={car?.brand?.image} // Car logo
                width={isMobile ? 30 : 48}
                height={isMobile ? 30 : 48}
                style={{
                  width: "auto",
                  height: "auto",
                  maxHeight: isMobile ? "30px" : "48px",
                  maxWidth: isMobile ? "30px" : "48px",
                }}
              />
            </Box>
            {/* Car Details */}
            <Box
              sx={{
                flexGrow: 1,
                textAlign: "right",
                display: "flex",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => handleCheckboxChange(car)}
              >
                <Typography
                  sx={{
                    fontSize: isMobile ? "12px" : "16px",
                    fontWeight: 500,
                    textAlign: "start",
                  }}
                >
                  {car?.brand?.name} {car?.model?.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: isMobile ? "12px" : "16px",
                    fontWeight: 500,
                    textAlign: "start",
                  }}
                >
                  {car.year}
                </Typography>
              </Box>
              {!!car?.is_default && (
                <Box
                  sx={{
                    background: "#E9F4FC",
                    color: "#3D96F7",
                    padding: "2px 8px",
                    fontSize: "16px",
                    fontWeight: "400",
                    borderRadius: "50px",
                    // height: "26px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {t.default}
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 1 }}>
        <SharedBtn
          onClick={() => {
            handleClose();
            setOpenAddNewCar(true);
          }}
          className="btn-outline-green"
          text="addNewCar"
          compBeforeText={
            <Image
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
    </Popover>
  );
}

export default CarSelectionFromNavbarWeb;
