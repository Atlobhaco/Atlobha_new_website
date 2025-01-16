import SharedToggle from "@/components/shared/SharedToggle";
import { ADDRESS, DEFAULT, USERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { usersAddressesQuery } from "@/config/network/Shared/GetDataHelper";
import { translateAddressName } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  setAllAddresses,
  setDefaultAddress,
} from "@/redux/reducers/selectedAddressReducer";
import { useAuth } from "@/config/providers/AuthProvider";
import { useDispatch } from "react-redux";

function SingleAddressItem({
  address,
  setDeleteAddressId,
  isLoading,
  deleteAddressId,
}) {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();

  const [addressIdDefault, setAddressIdDefault] = useState(false);

  const { refetch: callUserAddresses } = usersAddressesQuery({
    setAllAddresses,
    user,
    dispatch,
    setDefaultAddress,
  });

  const { data, refetch: addCar } = useCustomQuery({
    name: ["setDefaultAddress", addressIdDefault],
    url: `${USERS}${ADDRESS}${DEFAULT}/${addressIdDefault}`,
    refetchOnWindowFocus: false,
    enabled: addressIdDefault ? true : false,
    select: (res) => res?.data?.data,
    method: "post",
    onSuccess: (res) => {
      toast.success(t.editedSuccessfully);
      callUserAddresses();
      setTimeout(() => {
        setAddressIdDefault(false);
      }, 500);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.first_error);
      setAddressIdDefault(false);
    },
  });

  const box = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "5px",
    // flexWrap: "wrap",
  };

  const actionBox = {
    width: isMobile ? "35px" : "50px",
    height: isMobile ? "30px" : "40px",
    borderRadius: "10px",
    padding: isMobile ? "8px" : "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <Box
      sx={{
        padding: isMobile ? "12px" : "24px",
        borderRadius: "10px",
        border: "2px solid #F4F4F4",
        background: "#FFF",
        mb: 2,
      }}
    >
      <Box sx={box}>
        <Box
          key={address?.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 0px",
          }}
        >
          {/* address Logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: isMobile ? "30px" : "48px",
              height: isMobile ? "30px" : "48px",
            }}
          >
            <Image
              alt="home-address"
              src={"/icons/home-address.svg"} // address logo
              width={isMobile ? 25 : 48}
              height={isMobile ? 25 : 48}
              style={{
                width: "auto",
                height: "auto",
                maxHeight: isMobile ? "25px" : "48px",
                maxWidth: isMobile ? "25px" : "48px",
              }}
            />
          </Box>
          {/* address Details */}
          <Box
            sx={{
              flexGrow: 1,
              textAlign: "right",
              display: "flex",
              gap: "15px",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: isMobile ? "12px" : "16px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {translateAddressName(address?.name, locale) || address?.id}
                {!!address?.is_default && (
                  <Box
                    sx={{
                      background: "#E9F4FC",
                      color: "#3D96F7",
                      padding: "2px 8px",
                      fontSize: "10px",
                      fontWeight: "400",
                      borderRadius: "50px",
                      display: "flex",
                    }}
                  >
                    {t.default}
                  </Box>
                )}
              </Typography>
              <Typography
                sx={{
                  fontSize: isMobile ? "12px" : "16px",
                  fontWeight: 500,
                  textAlign: "start",
                  color: "#6B7280",
                }}
              >
                {address?.address}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: isMobile ? "5px" : "10px",
          }}
        >
          {/* <Box
          sx={{
            ...actionBox,
            background: "#E9FAEF",
          }}
        >
          <Image
            alt="info"
            src={"/icons/exclamation-green.svg"}
            width={isMobile ? 15 : 24}
            height={isMobile ? 15 : 24}
          />
        </Box> */}
          {!address?.is_default && (
            <>
              {/* <Box
                sx={{
                  ...actionBox,
                  background: "#E7F5FF",
                }}
                onClick={() => {
                  // router.push(`/userProfile/myAddresses/${address?.id}`);
                  alert("make  default");
                }}
              >
                <Image
                  alt="info"
                  src={"/icons/pen-blue.svg"}
                  width={isMobile ? 15 : 24}
                  height={isMobile ? 15 : 24}
                />
              </Box> */}
              <Box
                sx={{
                  ...actionBox,
                  background: "#FFE4DD",
                }}
                onClick={() => {
                  setDeleteAddressId(address?.id);
                }}
              >
                {isLoading && +address?.id === +deleteAddressId ? (
                  <CircularProgress color="inherit" size={10} />
                ) : (
                  <Image
                    alt="info"
                    src={"/icons/basket-red.svg"}
                    width={isMobile ? 15 : 24}
                    height={isMobile ? 15 : 24}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
      {!address?.is_default && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <SharedToggle
            id="addressDefaultToggle"
            applyMargin={false}
            label={t.addressAsDefault}
            value={addressIdDefault === address?.id || address?.is_default}
            handleChange={() => setAddressIdDefault(address?.id)}
          />
        </Box>
      )}
    </Box>
  );
}

export default SingleAddressItem;
