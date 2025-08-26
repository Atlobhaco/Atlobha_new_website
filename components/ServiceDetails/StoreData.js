import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Button } from "@mui/material";
import Image from "next/image";
import React from "react";
import WillCallLater from "./WillCallLater";
import { isAuth } from "@/config/hooks/isAuth";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useLocalization from "@/config/hooks/useLocalization";
import LoginFirstToShowTimes from "./LoginFirstToShowTimes";
import moment from "moment";
import { useSelector } from "react-redux";
import UserHasNoAddress from "./UserHasNoAddress";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isToday from "dayjs/plugin/isToday";
import "dayjs/locale/ar"; // Arabic
import "dayjs/locale/en"; // English

dayjs.extend(localizedFormat);
dayjs.extend(isToday);

function StoreData({
  store,
  selectedStore,
  setSelectedStore,
  prod,
  setOpenAppointments,
  setOpenLogin,
  selectedStoreTime,
  userConfirmStoreDate,
  setSelectedStoreTime,
  setUserConfirmStoreDate,
  setSelectNewDate,
}) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const { selectedAddress, defaultAddress } = useSelector(
    (s) => s.selectedAddress
  );
  //   useEffect(() => {
  //     dayjs.locale(locale); // Set Day.js locale (e.g., "en" or "ar")
  //   }, [locale]);

  const userHasAddress =
    selectedAddress?.id ||
    defaultAddress?.id !== "currentLocation" ||
    !defaultAddress?.id;

  const buttonStyle = {
    background: "#FFD400",
    padding: isMobile ? "6px 10px" : "7px 12px",
    borderRadius: "8px",
    color: "black",
    display: "flex",
    gap: "2px",
    fontSize: isMobile ? "10px" : "15px",
  };

  const openInGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const formatSlotDate = (dateStr) => {
    const date = moment(dateStr);
    if (date.isSame(moment(), "day")) {
      // same day as today
      return `${t.todayAtTime} ${date.format("h:mm A")}`;
    }

    // otherwise full date
    return locale === "ar"
      ? date.format("YYYY/MM/DD, hh:mm A")
      : date.format("DD/MM/YYYY, hh:mm A");
  };

  const toArabicDigits = (str) => str.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

  const formatSelectedUserDate = (dateStr) => {
    if (!dateStr) return "";

    const date = dayjs(dateStr).locale(locale);

    if (date.isToday()) {
      return `${t.todayAtTime}`;
    }

    const formatted = date.format("YYYY/MM/DD,");
    return locale === "ar" ? toArabicDigits(formatted) : formatted;
  };

  return (
    <Box
      key={store?.id}
      sx={{
        border:
          store?.id === selectedStore?.id
            ? "1px solid #FFD400"
            : "1px solid #F0F0F0",
        borderRadius: "12px",
        minWidth: isMobile ? "fit-content" : "440px",
        padding: "19px 9px",
        cursor: "pointer",
      }}
      onClick={() => {
        setSelectedStore(store);
        setSelectedStoreTime(null);
        setUserConfirmStoreDate(false);
        setSelectNewDate(dayjs());
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Image
            src="/imgs/no-prod-img.svg"
            width={isMobile ? 50 : 60}
            height={isMobile ? 50 : 60}
            alt="store-img"
          />
          <Box>
            <Box
              component="span"
              sx={{
                color: "#1C1C28",
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "700",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                //   minHeight: "42px",
              }}
            >
              {store?.name}
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: "5px",
              }}
            >
              <Image
                loading="lazy"
                src="/icons/location-yellow.svg"
                alt="alert"
                width={24}
                height={24}
              />
              <Box
                component="span"
                sx={{
                  color: "#6B7280",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "400",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  minHeight: "42px",
                }}
              >
                {store?.address}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "5px",
          }}
        >
          <Button
            sx={buttonStyle}
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();
              openInGoogleMaps(store?.store?.latitude, store?.store?.longitude);
            }}
          >
            <Image
              loading="lazy"
              alt={"GPS-lo"}
              src={"/icons/gps-detector.svg"}
              width={isMobile ? 18 : 20}
              height={isMobile ? 18 : 20}
              style={{
                marginBottom: "4px",
              }}
            />
            {t.storeLocation}
          </Button>
          <Button
            sx={buttonStyle}
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();
              window.location.href = `tel:${store?.phone}`;
            }}
          >
            <Image
              loading="lazy"
              alt={"calling"}
              src={"/icons/call-us.svg"}
              width={isMobile ? 18 : 22}
              height={isMobile ? 18 : 22}
              style={{
                marginBottom: "4px",
              }}
            />
            {t.callStore}
          </Button>{" "}
        </Box>
      </Box>
      <Box
        sx={{
          borderTop: "1px solid #F0F0F0",
          padding: isMobile ? "8px 1px 0 1px" : "12px 19px 0 19px",
        }}
      >
        <Box
          sx={{
            color: "#1C1C28",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: "700",
            mb: 1,
          }}
        >
          {t.chooseTime}
        </Box>

        {isAuth() ? (
          prod?.slots_disabled ? (
            !userHasAddress ? (
              <UserHasNoAddress />
            ) : (
              <WillCallLater />
            )
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: isMobile ? "5px" : "15px",
              }}
            >
              <Box
                sx={{
                  background: "#232323",
                  borderRadius: "8px",
                  padding: isMobile ? "6px 4px" : "7px 12px",
                  color: "white",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "500",
                  minWidth: "fit-content",
                }}
              >
                {selectedStoreTime
                  ? `${formatSelectedUserDate(userConfirmStoreDate)} ${moment(
                      selectedStoreTime?.start
                    ).format("h:mm")} -
                  ${moment(selectedStoreTime?.end).format("h:mm")}`
                  : formatSlotDate(store?.next_available_slot?.start)}
              </Box>
              <Box
                sx={{
                  minWidth: "fit-content",
                  cursor: "pointer",
                  fontSize: isMobile ? "11px" : "14px",
                }}
                onClick={(e) => {
                  e?.stopPropagation();
                  e?.preventDefault();
                  setSelectedStore(store);
                  setOpenAppointments(true);
                }}
              >
                {t.chooseAnotherTime}
                <ArrowDropDownIcon />
              </Box>
            </Box>
          )
        ) : (
          <LoginFirstToShowTimes setOpenLogin={setOpenLogin} />
        )}
      </Box>
    </Box>
  );
}

export default StoreData;
