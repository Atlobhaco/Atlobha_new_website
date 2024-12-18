import React from "react";
import { Box, Popover, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import useLocalization from "@/config/hooks/useLocalization";
import SharedCheckbox from "../../SharedCheckbox";

import {
  setAllAddresses,
  setSelectedAddress,
  setDefaultAddress,
} from "@/redux/reducers/selectedAddressReducer";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SharedBtn from "../../SharedBtn";
import Image from "next/image";
import { userDefaultCar } from "@/config/network/Shared/SetDataHelper";
import { usersAddressesQuery } from "@/config/network/Shared/GetDataHelper";
import { useAuth } from "@/config/providers/AuthProvider";
import { getUserCurrentLocation } from "@/constants/helpers";

function AddressSelectionFromNavbarWeb({
  open,
  anchorEl,
  handleClose,
  setOpenAddNewAddress,
}) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();

  const { allAddresses, selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );

  const Addresses = allAddresses?.length ? allAddresses : [];

  const menuPopup = {
    background: "#6B7280",
    borderRadius: " 20px",
    boxShadow: "0px 24px 24px 0px rgba(0, 0, 0, 0.14)",
    background: "white",
    width: "375px",
    left: "10px",
    position: "absolute",
    mt: 0,
    ...(locale === "ar"
      ? { right: "4vw !important" }
      : { left: "5vw !important" }),
    padding: "24px 20px",
    maxWidth: "75vw",
    top: "35px !important",
  };

  const header = {
    fontSize: "20px",
    fontWeight: "500",
    color: "black",
  };

  const handleCheckboxChange = async (addressSelected) => {
    try {
      const location = await getUserCurrentLocation();
      dispatch(
        setSelectedAddress({
          data: { ...addressSelected, ...location },
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const { refetch: callAddresses } = usersAddressesQuery({
    setAllAddresses,
    user,
    dispatch,
    setDefaultAddress,
  });

  const { refetch: callUserDefaultCar } = userDefaultCar({
    user,
    dispatch,
    setSelectedAddress,
    selectedAddress,
    callAddresses,
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
        mt: selectedAddress?.id || defaultAddress?.id ? 0 : 2, // Add spacing between the box and dropdown
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
        <Box sx={header}>{!!allAddresses?.length && t.deliveryAddresses}</Box>
        {Addresses.map((address) => (
          <Box
            key={address.id}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              padding: "10px 0px",
            }}
          >
            {/* Checkbox */}
            <SharedCheckbox
              selectedId={selectedAddress?.id || defaultAddress?.id}
              handleCheckboxChange={handleCheckboxChange}
              data={address}
            />

            {/* Car Logo */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                width: isMobile ? "30px" : "20px",
                height: isMobile ? "30px" : "20px",
              }}
            >
              <Image
                alt={address?.name}
                src={"/icons/home-address.svg"}
                width={isMobile ? 30 : 48}
                height={isMobile ? 30 : 48}
                style={{
                  width: "auto",
                  height: "auto",
                  maxHeight: isMobile ? "20px" : "20px",
                  maxWidth: isMobile ? "20px" : "20px",
                  marginTop: "1px",
                }}
              />
            </Box>
            {/* Car Details */}
            <Box
              sx={{
                flexGrow: 1,
                textAlign: "right",
                //   background: "red",
                display: "flex",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: isMobile ? "12px" : "16px",
                    fontWeight: 500,
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  {address?.name}
                  {!!address?.is_default && (
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
                </Typography>
                <Typography
                  sx={{
                    fontSize: isMobile ? "12px" : "16px",
                    fontWeight: 400,
                    textAlign: "start",
                    color: "#6B7280",
                  }}
                >
                  {address?.address}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
        <Box
          //   key={address.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 0px",
          }}
        >
          {/* Checkbox */}
          <SharedCheckbox
            selectedId={selectedAddress?.id || defaultAddress?.id}
            handleCheckboxChange={handleCheckboxChange}
            data={{ id: "currentLocation", address: t.noAddressSelected }}
          />

          {/* Car Logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: isMobile ? "30px" : "20px",
              height: isMobile ? "30px" : "20px",
            }}
          >
            <Image
              alt={"GPS"}
              src={"/icons/gps-detector.svg"}
              width={isMobile ? 30 : 48}
              height={isMobile ? 30 : 48}
              style={{
                width: "auto",
                height: "auto",
                maxHeight: isMobile ? "20px" : "20px",
                maxWidth: isMobile ? "20px" : "20px",
                marginTop: "1px",
              }}
            />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              textAlign: "right",
              //   background: "red",
              display: "flex",
              gap: "15px",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: isMobile ? "12px" : "16px",
                  fontWeight: 500,
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {t.currentLocation}
              </Typography>
              {/* <Typography
                  sx={{
                    fontSize: isMobile ? "12px" : "16px",
                    fontWeight: 400,
                    textAlign: "start",
                    color: "#6B7280",
                  }}
                >
                  {address?.address}
                </Typography> */}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 1 }}>
        <SharedBtn
          onClick={() => {
            handleClose();
            setOpenAddNewAddress(true);
          }}
          className="btn-outline-green"
          text="addNewAddress"
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
    </Popover>
  );
}

export default AddressSelectionFromNavbarWeb;
