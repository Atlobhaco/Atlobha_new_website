import { Box, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SharedCheckbox from "../../SharedCheckbox";
import { setSelectedAddress } from "@/redux/reducers/selectedAddressReducer";
import Image from "next/image";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import {
  getUserCurrentLocation,
  translateAddressName,
} from "@/constants/helpers";
import { toast } from "react-toastify";

const header = {
  fontSize: "20px",
  fontWeight: "500",
  color: "black",
};

function ShowAddressesFromNavbarMobile() {
  const { t } = useLocalization();
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();

  const { allAddresses, selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );

  const Addresses = allAddresses?.length ? allAddresses : [];

  const handleCheckboxChange = async (addressSelected) => {
    if (addressSelected?.id === "currentLocation") {
      try {
        const location = await getUserCurrentLocation();
        dispatch(
          setSelectedAddress({
            data: { ...addressSelected, ...location },
          })
        );
      } catch (error) {
        toast.error(error);
        console.error(error);
      }
    } else {
      dispatch(
        setSelectedAddress({
          data: { ...addressSelected },
        })
      );
    }
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
                {translateAddressName(address?.name)}
                {!!address?.is_default && (
                  <Box
                    sx={{
                      background: "#E9F4FC",
                      color: "#3D96F7",
                      padding: isMobile ? "2px 5px" : "2px 8px",
                      fontSize: isMobile ? "12px" : "16px",
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
  );
}

export default ShowAddressesFromNavbarMobile;
