import React from "react";
import DialogCentered from "../DialogCentered";
import useLocalization from "@/config/hooks/useLocalization";
import SharedSelectionDatePicker from "../shared/SharedSelectionDatePicker";
import useCustomQuery from "@/config/network/Apiconfig";
import { useSelector } from "react-redux";
import {
  AREAS,
  SERVICES,
  SERVICE_CENTERS,
  SLOTS,
} from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { isAuth } from "@/config/hooks/isAuth";

function AvailabletimeForServiceFixed({
  selectNewDate,
  handleDateChange,
  openAppointments,
  setOpenAppointments,
  selectedStore,
  selectedStoreTime,
  setSelectedStoreTime,
  prod,
}) {
  const {
    query: { idService },
  } = useRouter();
  const { isMobile, isTablet } = useScreenSize();
  const { t } = useLocalization();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const lat = selectedAddress?.lat || defaultAddress?.lat || 24.7136;
  const lng = selectedAddress?.lng || defaultAddress?.lng || 46.6753;

  const { data: slots, isFetching } = useCustomQuery({
    name: ["availabletime", selectNewDate, selectedStore?.id, isAuth()],
    url: `${SERVICE_CENTERS}/${selectedStore?.id}${SLOTS}?date=${dayjs(
      selectNewDate
    ).format("YYYY-MM-DD HH:mm:ss")}`,
    refetchOnWindowFocus: false,
    enabled:
      selectedStore?.id && selectNewDate && !prod?.slots_disabled && isAuth()
        ? true
        : false,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(t.someThingWrong);
    },
  });

  return (
    <DialogCentered
      title={t.availableAppointments}
      open={openAppointments}
      setOpen={setOpenAppointments}
      subtitle={false}
      hasCloseIcon={true}
      customClass={!isMobile && !isTablet ? "sm-popup-width" : ""}
      content={
        <Box
          sx={{
            mx: isMobile ? 0 : 3,
          }}
        >
          <Box>
            <SharedSelectionDatePicker
              value={selectNewDate}
              handleChange={handleDateChange}
              disablePast={true}
            />
          </Box>
          <Box
            sx={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#1C1C28",
              mb: 1,
            }}
          >
            {t.chooseSuitableTime}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              minHeight: "100px",
            }}
          >
            {isFetching ? (
              <CircularProgress
                size={20}
                sx={{
                  color: "#FFD400",
                  mx: "auto",
                  mt: 2,
                }}
              />
            ) : slots?.length === 0 ? (
              <Box
                sx={{
                  mx: "auto",
                  color: "#000",
                  fontWeight: "500",
                  mt: 2,
                }}
              >
                {t.noResultsFound}
              </Box>
            ) : (
              slots?.map((time) => (
                <Box
                  onClick={() => setSelectedStoreTime(time)}
                  key={time?.id}
                  sx={{
                    minWidth: "fit-content",
                    border: "1px  solid #F0F0F0",
                    padding: "6px 10px;",
                    background:
                      selectedStoreTime?.id === time?.id ? "#232323" : "#fff",
                    borderRadius: "8px",
                    color:
                      selectedStoreTime?.id === time?.id ? "#FFF" : "#232323",
                    fontWeight: "500",
                    fontSize: "15px",
                    cursor: "pointer",
                    height: "fit-content",
                    "&:hover": {
                      opacity: selectedStoreTime?.id !== time?.id && "0.8",
                    },
                  }}
                >
                  {moment(time?.start).format("h:mm")} -{" "}
                  {moment(time?.end).format("h:mm")}
                </Box>
              ))
            )}
          </Box>
        </Box>
      }
    />
  );
}

export default AvailabletimeForServiceFixed;
