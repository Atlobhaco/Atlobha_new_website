import { Box, Typography } from "@mui/material";
import React from "react";
import SharedCheckbox from "../../SharedCheckbox";
import Image from "next/image";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedCar,
  setDefaultCar,
} from "@/redux/reducers/selectedCarReducer";
import { userDefaultCar } from "@/config/network/Shared/SetDataHelper";
import { useAuth } from "@/config/providers/AuthProvider";
import { usersVehiclesQuery } from "@/config/network/Shared/GetDataHelper";
import { setAllCars } from "@/redux/reducers/selectedCarReducer";
import NoCarAdded from "@/components/userProfile/myCars/noCarAdded";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function CarSelectionFromNavMobile({ setSelectCarPopUpModal = () => {} }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();

  const { selectedCar, defaultCar, allCars } = useSelector(
    (state) => state.selectedCar
  );

  const header = {
    fontSize: "20px",
    fontWeight: "500",
    color: "black",
  };

  const handleCheckboxChange = (car) => {
    dispatch(setSelectedCar({ data: car }));
    setSelectCarPopUpModal(false);
    // setCar as default everty change happen
    setTimeout(() => {
      callUserDefaultCar();
    }, 500);
  };

  const { refetch: callUserVehicles } = usersVehiclesQuery({
    setAllCars,
    user,
    dispatch,
    setSelectedCar,
    setDefaultCar,
  });

  const { refetch: callUserDefaultCar } = userDefaultCar({
    user,
    dispatch,
    setSelectedCar,
    selectedCar,
    callUserVehicles,
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Box sx={header}>{!!allCars?.length && t.myCars}</Box>
        {allCars?.length ? (
          allCars.map((car) => (
            <Box key={car.id}>
              <Box
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
                    loading="lazy"
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
                        fontSize: "10px",
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
              {!car?.brand?.enabled_for_spare_parts && (
                <Box
                  sx={{
                    marginInlineStart: "40px",
                    background: "#EE772F",
                    width: "fit-content",
                    padding: isMobile ? "1px 4px" : "1px 6px",
                    borderRadius: "4px",
                    marginBottom: "2px",
                    color: "white",
                    fontSize: isMobile ? "10px" : "15px",
                    fontWeight: "500",
                  }}
                >
                  <ErrorOutlineIcon
                    sx={{
                      color: "white",
                      width: isMobile ? "16px" : "20px",
                      marginInlineEnd: "4px",
                    }}
                  />
                  {t.limitSupport}
                </Box>
              )}
            </Box>
          ))
        ) : (
          <NoCarAdded hideBtn />
        )}
      </Box>
    </Box>
  );
}

export default CarSelectionFromNavMobile;
