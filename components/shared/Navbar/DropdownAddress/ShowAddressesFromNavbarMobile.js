import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SharedCheckbox from "../../SharedCheckbox";
import Image from "next/image";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import {
  getUserCurrentLocation,
  translateAddressName,
} from "@/constants/helpers";

import {
  setAllAddresses,
  setSelectedAddress,
  setDefaultAddress,
} from "@/redux/reducers/selectedAddressReducer";
import { toast } from "react-toastify";
import useCustomQuery from "@/config/network/Apiconfig";
import { usersAddressesQuery } from "@/config/network/Shared/GetDataHelper";
import { useAuth } from "@/config/providers/AuthProvider";
import { ADDRESS, DEFAULT, USERS } from "@/config/endPoints/endPoints";

const header = {
  fontSize: "20px",
  fontWeight: "500",
  color: "black",
};

function ShowAddressesFromNavbarMobile({ setSelectCarPopUpModal = () => {} }) {
  // Hooks must always be at the top and in the same order
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const { user } = useAuth();

  const { allAddresses, selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const [addressIdDefault, setAddressIdDefault] = useState(false);

  const { refetch: callAddresses } = usersAddressesQuery({
    setAllAddresses,
    user,
    dispatch,
    setDefaultAddress,
  });

  useCustomQuery({
    name: ["changeDefaultAddressMobile", addressIdDefault],
    url: `${USERS}${ADDRESS}${DEFAULT}/${addressIdDefault}`,
    refetchOnWindowFocus: false,
    enabled: addressIdDefault ? true : false,
    select: (res) => res?.data?.data,
    method: "post",
    onSuccess: (res) => {
      setAddressIdDefault(false);
      callAddresses();
      setAddressIdDefault(false);
    },
    onError: (err) => {
      setAddressIdDefault(false);
    },
  });

  const handleCheckboxChange = async (addressSelected) => {
    try {
      if (addressSelected?.id === "currentLocation") {
        const location = await getUserCurrentLocation();
        dispatch(
          setSelectedAddress({
            data: { ...addressSelected, ...location },
          })
        );
      } else {
        setAddressIdDefault(addressSelected?.id);
        dispatch(
          setSelectedAddress({
            data: { ...addressSelected },
          })
        );
      }
    } catch (error) {
      toast.error(
        error.message ||
          "Please enable your location services for better accuracy."
      );
    }
    setSelectCarPopUpModal(false);
  };

  return (
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
      {allAddresses.map((address) => (
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

          {/* Address Icon */}
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
              loading="lazy"
              alt={address?.name}
              src={"/icons/home-address.svg"}
              width={isMobile ? 30 : 48}
              height={isMobile ? 30 : 48}
              style={{
                width: "auto",
                height: "auto",
                maxHeight: "20px",
                maxWidth: "20px",
                marginTop: "1px",
              }}
            />
          </Box>

          {/* Address Details */}
          <Box
            sx={{
              flexGrow: 1,
              textAlign: "right",
              display: "flex",
              gap: "15px",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Box onClick={() => handleCheckboxChange(address)}>
              <Typography
                sx={{
                  fontSize: isMobile ? "12px" : "16px",
                  fontWeight: 500,
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {typeof translateAddressName === "function"
                  ? translateAddressName(address?.name, locale)
                  : address?.name}
                {!!address?.is_default && (
                  <Box
                    sx={{
                      background: "#E9F4FC",
                      color: "#3D96F7",
                      padding: isMobile ? "2px 5px" : "2px 8px",
                      fontSize: isMobile ? "12px" : "16px",
                      fontWeight: "400",
                      borderRadius: "50px",
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
      {/* Current Location Section */}
      <Box
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

        {/* GPS Icon */}
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
            loading="lazy"
            alt={"GPS"}
            src={"/icons/gps-detector.svg"}
            width={isMobile ? 30 : 48}
            height={isMobile ? 30 : 48}
            style={{
              width: "auto",
              height: "auto",
              maxHeight: "20px",
              maxWidth: "20px",
              marginTop: "1px",
            }}
          />
        </Box>

        {/* Current Location Details */}
        <Box
          sx={{
            flexGrow: 1,
            textAlign: "right",
            display: "flex",
            gap: "15px",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Box
            onClick={() =>
              handleCheckboxChange({
                id: "currentLocation",
                address: t.noAddressSelected,
              })
            }
          >
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ShowAddressesFromNavbarMobile;
