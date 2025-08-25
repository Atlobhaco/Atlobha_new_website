import { SERVICE_CENTERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { Box, Divider } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import AvailabletimeForServiceFixed from "./AvailabletimeForServiceFixed";
import StoreData from "./StoreData";

function ServiceStoreSelections({
  prod,
  selectNewDate,
  handleDateChange,
  setSelectedStore,
  selectedStore,
  selectedStoreTime,
  setSelectedStoreTime,
  setOpenLogin,
}) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const [openAppointments, setOpenAppointments] = useState(false);
  const lat = selectedAddress?.lat || defaultAddress?.lat || 24.7136;
  const lng = selectedAddress?.lng || defaultAddress?.lng || 46.6753;

  const { data: stores, isFetching } = useCustomQuery({
    name: ["storeCenters", lat, lng],
    url: `${SERVICE_CENTERS}?service_id=${prod?.id}&latitude=${lat}&longitude=${lng}`,
    refetchOnWindowFocus: false,
    enabled: !!lng,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(t.someThingWrong);
    },
    onSuccess: (res) => {
      if (res?.length) {
        setSelectedStore(res[0]);
      }
    },
  });

  return (
    <>
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
          color: "#1C1C28",
          fontSize: isMobile ? "18px" : "27px",
          fontWeight: "700",
          mb: 1,
        }}
      >
        {t.chooseTestDriveLocation}
      </Box>
      {stores?.length ? (
        <Box
          sx={{
            display: "flex",
            gap: "15px",
            overflow: "auto  hidden",
            pb: 1,
            mx: 2,
          }}
        >
          {stores?.map((store) => (
            // show single store data
            <StoreData
              store={store}
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              prod={prod}
              setOpenAppointments={setOpenAppointments}
			  setOpenLogin={setOpenLogin}
            />
          ))}
          {/* choose another time logic for store */}
          <AvailabletimeForServiceFixed
            selectNewDate={selectNewDate}
            handleDateChange={handleDateChange}
            openAppointments={openAppointments}
            setOpenAppointments={setOpenAppointments}
            selectedStore={selectedStore}
            selectedStoreTime={selectedStoreTime}
            setSelectedStoreTime={setSelectedStoreTime}
            prod={prod}
          />
        </Box>
      ) : (
        <Box
          sx={{
            fontWeight: "bold",
            mx: 1,
          }}
        >
          {!isFetching && t.noResultsFound}
        </Box>
      )}
    </>
  );
}

export default ServiceStoreSelections;
