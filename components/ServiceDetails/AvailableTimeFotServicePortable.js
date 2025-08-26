import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Divider } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import moment from "moment";

import { AREAS, SERVICES, SLOTS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SharedSelectionDatePicker from "../shared/SharedSelectionDatePicker";
import SelectedAddressNotSupported from "./SelectedAddressNotSupported";
import LoginFirstToShowTimes from "./LoginFirstToShowTimes";
import { isAuth } from "@/config/hooks/isAuth";
import WillCallLater from "./WillCallLater";
import UserHasNoAddress from "./UserHasNoAddress";
import NoSlotsPortableService from "./NoSlotsPortableService";

function AvailableTimeFotServicePortable({
  selectedDatePortable,
  setSelectedDatePortable,
  selectedPortableTime,
  setSelectedPortableTime,
  setOpenLogin,
  prod,
}) {
  const { t } = useLocalization();
  const {
    query: { idService },
  } = useRouter();
  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (s) => s.selectedAddress
  );

  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthed(isAuth());
  }, []);

  useEffect(() => {
    setAuthed(isAuth());
  }, [isAuth()]);

  const lat = selectedAddress?.lat || defaultAddress?.lat || 24.7136;
  const lng = selectedAddress?.lng || defaultAddress?.lng || 46.6753;
  const portableAreaId =
    selectedAddress?.portable_service_area?.id ||
    defaultAddress?.portable_service_area?.id;
  const userHasAddress =
    selectedAddress?.id || defaultAddress?.id !== "currentLocation";

  const { data: AvailableSlots, isFetching } = useCustomQuery({
    name: [
      "availabletimePortable",
      lat,
      lng,
      selectedDatePortable,
      idService,
      isAuth(),
    ],
    url: `${SERVICES}/${idService}${AREAS}/${portableAreaId}${SLOTS}?from=${dayjs(
      selectedDatePortable
    ).format("YYYY-MM-DD HH:mm:ss")}&to=${dayjs(selectedDatePortable)
      .add(1, "day")
      .format("YYYY-MM-DD HH:mm:ss")}`,
    refetchOnWindowFocus: false,
    enabled: !!(lng && idService && portableAreaId && isAuth()),
    select: (res) => res?.data?.data,
    onSuccess: () => setAuthed(true),
  });

  if (!mounted) return null; // ⛔️ Prevent SSR mismatch

  return (
    <>
      <Divider
        sx={{
          background: "#EAECF0",
          my: 1,
          height: "5px",
          borderBottomWidth: 0,
        }}
      />
      <Box
        sx={{
          color: "black",
          fontSize: isMobile ? "18px" : "27px",
          fontWeight: 500,
          mb: 1,
        }}
      >
        {t.availableAppointments}
      </Box>

      {!prod?.slots_disabled ? (
        <>
          <Box
            sx={{ maxWidth: isMobile ? "100%" : "50%", mx: isMobile ? 0 : 3 }}
          >
            <SharedSelectionDatePicker
              value={selectedDatePortable}
              handleChange={(newValue) => {
                setSelectedPortableTime(null);
                setSelectedDatePortable(newValue);
              }}
              disablePast
            />
          </Box>
          <Box
            sx={{
              fontSize: isMobile ? "12px" : "20px",
              fontWeight: 700,
              color: "#1C1C28",
              mb: 1,
            }}
          >
            {t.chooseSuitableTime}
          </Box>
          {isFetching ? (
            <CircularProgress
              size={20}
              sx={{
                color: "#FFD400",
                mt: 2,
              }}
            />
          ) : !authed ? (
            <Box sx={{ maxWidth: isMobile ? "100%" : "50%" }}>
              <LoginFirstToShowTimes setOpenLogin={setOpenLogin} />
            </Box>
          ) : prod?.slots_disabled ? (
            <Box sx={{ maxWidth: isMobile ? "100%" : "50%" }}>
              <WillCallLater />
            </Box>
          ) : !userHasAddress ? (
            <Box sx={{ maxWidth: isMobile ? "100%" : "50%" }}>
              <UserHasNoAddress />
            </Box>
          ) : !portableAreaId ? (
            <Box sx={{ maxWidth: isMobile ? "100%" : "50%" }}>
              <SelectedAddressNotSupported />
            </Box>
          ) : (
            <Box
              sx={{
                display: AvailableSlots?.length ? "flex" : "block",
                flexWrap: "wrap",
                gap: "10px",
                minHeight: "100px",
              }}
            >
              {AvailableSlots?.length ? (
                AvailableSlots?.map((time) => (
                  <Box
                    onClick={() => setSelectedPortableTime(time)}
                    key={time?.id}
                    sx={{
                      minWidth: "fit-content",
                      border: "1px solid #F0F0F0",
                      padding: "6px 10px",
                      background:
                        selectedPortableTime?.id === time?.id
                          ? "#232323"
                          : "#fff",
                      borderRadius: "8px",
                      color:
                        selectedPortableTime?.id === time?.id
                          ? "#FFF"
                          : "#232323",
                      fontWeight: 500,
                      fontSize: "12px",
                      cursor: "pointer",
                      height: "fit-content",
                      "&:hover": {
                        opacity: selectedPortableTime?.id !== time?.id && "0.8",
                      },
                    }}
                  >
                    {moment(time?.start).format("h:mm")} -{" "}
                    {moment(time?.end).format("h:mm")}
                  </Box>
                ))
              ) : (
                <Box sx={{ maxWidth: isMobile ? "100%" : "50%" }}>
                  <NoSlotsPortableService />
                </Box>
              )}
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ maxWidth: isMobile ? "100%" : "50%" }}>
          {!authed ? (
            <LoginFirstToShowTimes setOpenLogin={setOpenLogin} />
          ) : !userHasAddress ? (
            <UserHasNoAddress />
          ) : !portableAreaId ? (
            <SelectedAddressNotSupported />
          ) : (
            <WillCallLater />
          )}
        </Box>
      )}
    </>
  );
}

export default AvailableTimeFotServicePortable;
