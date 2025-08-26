import { riyalImgRed, servicePrice } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Divider } from "@mui/material";
import React from "react";
import SharedBtn from "../shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import { useSelector } from "react-redux";
import { isAuth } from "@/config/hooks/isAuth";
import { useRouter } from "next/router";

function RedirectToCheckoutService({
  prod,
  setOpenLogin,
  selectedPortableTime,
  tabValue,
  allStores,
  selectedStoreTime,
  selectedDatePortable,
  userConfirmStoreDate,
  selectedStore,
}) {
  const router = useRouter();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );

  const handleCheckoutRedirection = () => {
    if (!isAuth()) {
      return setOpenLogin(true);
    }
    // maybe logicfor not supported car is missing

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
        document?.getElementById(elementId)?.click();
        return;
      }
    }
    router.push({
      pathname: "/service/checkout",
      query: {
        secType: router?.query?.secType,
        serviceDetails: encodeURIComponent(JSON.stringify(prod)), // encode it
        serviceTimeFixedOrPortable: selectedPortableTime
          ? encodeURIComponent(JSON.stringify(selectedPortableTime))
          : encodeURIComponent(JSON.stringify(selectedStoreTime)),
        serviceDatePortable: encodeURIComponent(
          JSON.stringify(selectedDatePortable)
        ),
        serviceDatefixed: encodeURIComponent(
          JSON.stringify(userConfirmStoreDate)
        ),
        type: tabValue,
        selectedStore: encodeURIComponent(JSON.stringify(selectedStore)),
      },
    });
  };

  return (
    <Box
      className={`${
        isMobile ? "data-over-foot-nav bg-white mt-3 px-2" : "mt-4"
      }`}
      sx={{
        width: "100% !important",
      }}
    >
      <Divider
        sx={{
          background: "#EAECF0",
          my: 1,
          height: "5px",
          borderBottomWidth: "0px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{
              color: "#EB3C24",
              fontWeight: "500",
              fontSize: isMobile ? "19px" : "24px",
            }}
          >
            {servicePrice({
              service: prod,
              userCar: selectedCar?.id ? selectedCar : defaultCar,
            })}
            {riyalImgRed()}
          </Box>
          {!!prod?.price_before_discount && (
            <Box
              sx={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  textDecoration: "line-through",
                  fontSize: isMobile ? "16px" : "16px",
                  color: "grey",
                  letterSpacing: "1.4px",
                }}
              >
                {prod?.price_before_discount?.toFixed(2)}
              </Box>
              <Box
                component="span"
                sx={{
                  textDecoration: "unset",
                  color: "#EB3C24",
                  fontSize: isMobile ? "12px" : "12px",
                  fontWeight: "500",
                }}
              >
                {Math.round(
                  ((prod?.price_before_discount?.toFixed(2) -
                    prod?.price?.toFixed(2)) /
                    prod?.price_before_discount?.toFixed(2)) *
                    100
                )}
                % {t.discount}
              </Box>
            </Box>
          )}
        </Box>
        <SharedBtn
          text="chooseService"
          className="big-main-btn"
          onClick={() => handleCheckoutRedirection()}
          disabled={
            (tabValue === "portable" && !selectedPortableTime) ||
            !allStores?.length
          }
        />
      </Box>
    </Box>
  );
}

export default RedirectToCheckoutService;
