import { riyalImgRed, servicePrice } from "@/constants/helpers";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Divider } from "@mui/material";
import React from "react";
import SharedBtn from "../shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import { useSelector } from "react-redux";
import { isAuth } from "@/config/hooks/isAuth";

function ChooseServiceFromDetails({ prod }) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const { selectedCar, defaultCar } = useSelector((state) => state.selectedCar);

  //   will need this logic
  //   const triggers = [
  // 	{
  // 	  condition: !selectedCar?.id && !defaultCar?.id,
  // 	  elementId: "openAddCarModalProgramatically",
  // 	},
  // 	{
  // 	  condition:
  // 		(!selectedAddress?.id && defaultAddress?.id === "currentLocation") ||
  // 		!defaultAddress?.id,
  // 	  elementId: "openAddAddressModalProgramatically",
  // 	},
  //   ];
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
          disabled={!isAuth()}
        />
      </Box>
    </Box>
  );
}

export default ChooseServiceFromDetails;
