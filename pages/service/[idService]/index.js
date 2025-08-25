import Login from "@/components/Login";
import DeliveryTime from "@/components/ProductDetails/DeliveryTime";
import DetailsProd from "@/components/ProductDetails/DetailsProd";
import AvailableTimeFotServicePortable from "@/components/ServiceDetails/AvailableTimeFotServicePortable";
import ChooseServiceFromDetails from "@/components/ServiceDetails/ChooseServiceFromDetails";
import ServiceCompatibleWith from "@/components/ServiceDetails/ServiceCompatibleWith";
import ServiceImages from "@/components/ServiceDetails/ServiceImages";
import ServiceStoreSelections from "@/components/ServiceDetails/ServiceStoreSelections";
import ServiceTitlePrice from "@/components/ServiceDetails/ServiceTitlePrice";
import ProductCardSkeleton from "@/components/cardSkeleton";
import { SERVICES } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Tab, Tabs } from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ServiceDetails() {
  const { t } = useLocalization();
  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();

  const {
    query: { portableService, idService },
  } = useRouter();

  const { isMobile } = useScreenSize();
  const [cityDelivery, setCityDelivery] = useState(14);
  const [tabValue, setTabValue] = React.useState("portable");
  const [selectNewDate, setSelectNewDate] = useState(dayjs());
  const [selectedStore, setSelectedStore] = useState(false);
  const [selectedStoreTime, setSelectedStoreTime] = useState(false);
  const [selectedDatePortable, setSelectedDatePortable] = useState(dayjs());
  const [selectedPortableTime, setSelectedPortableTime] = useState(false);

  const handleChange = (event, newValue) => {
    setSelectedStoreTime(false);
    setTabValue(newValue);
  };

  const {
    data,
    isFetching: ProdDetailsFetch,
    refetch: callProdDetails,
  } = useCustomQuery({
    name: ["serviceDetails", idService],
    url: `${SERVICES}/${idService}`,
    refetchOnWindowFocus: false,
    enabled: !!idService,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(t.someThingWrong);
    },
  });

  useEffect(() => {
    if (data?.id && portableService) {
      if (portableService === "false") {
        return setTabValue("fixed");
      }
      if (portableService === "true") {
        return setTabValue("portable");
      }
      if (portableService === "no-info") {
        if (
          data?.qualifies_as_portable_service &&
          data?.qualifies_as_store_service
        ) {
          return setTabValue("fixed");
        }
        if (data?.qualifies_as_portable_service) {
          return setTabValue("portable");
        }
        if (data?.qualifies_as_store_service) {
          return setTabValue("fixed");
        }
      }
    }
  }, [data]);

  return (
    <Box>
      {ProdDetailsFetch ? (
        <ProductCardSkeleton height={"400px"} />
      ) : (
        <Box className="container">
          <Box className="row">
            <Box
              className={`col-12 col-md-12 ${
                isMobile ? "mt-3 mb-5 pb-3" : "mt-5"
              }`}
            >
              {data && <ServiceImages prod={data} />}

              {data?.qualifies_as_portable_service &&
                data?.qualifies_as_store_service && (
                  <Box
                    sx={{
                      width: "100%",
                      borderBottom: "1px solid #E6E6E6",
                      mb: 3,
                    }}
                  >
                    <Tabs
                      value={tabValue}
                      onChange={handleChange}
                      centered
                      textColor="inherit" // ✅ Allow custom color
                      TabIndicatorProps={{
                        style: {
                          backgroundColor: "black", // ✅ Underline color
                        },
                      }}
                    >
                      <Tab
                        label={t.insideCenter}
                        value="fixed"
                        sx={{
                          color: "black", // ✅ Default text color
                          fontSize: "12px",
                          "&.Mui-selected": {
                            color: "black", // ✅ Selected text color
                          },
                        }}
                      />
                      <Tab
                        label={t.inYourPlace}
                        value="portable"
                        sx={{
                          color: "black",
                          fontSize: "12px",
                          "&.Mui-selected": {
                            color: "black",
                          },
                        }}
                      />
                    </Tabs>
                  </Box>
                )}

              <ServiceTitlePrice prod={data} tabValue={tabValue} />

              <ServiceCompatibleWith
                prod={{ ...data, model: data?.service_models[0] }}
              />

              {/* <DeliveryTime
                prod={data}
                cityDelivery={cityDelivery}
                setCityDelivery={setCityDelivery}
              /> */}

              <DetailsProd prod={data} />

              {tabValue === "fixed" && (
                <ServiceStoreSelections
                  prod={data}
                  selectNewDate={selectNewDate}
                  handleDateChange={(newValue) => setSelectNewDate(newValue)}
                  selectedStore={selectedStore}
                  setSelectedStore={setSelectedStore}
                  selectedStoreTime={selectedStoreTime}
                  setSelectedStoreTime={setSelectedStoreTime}
                  setOpenLogin={setOpenLogin}
                />
              )}

              {tabValue === "portable" && (
                <AvailableTimeFotServicePortable
                  prod={data}
                  selectedDatePortable={selectedDatePortable}
                  setSelectedDatePortable={setSelectedDatePortable}
                  selectedPortableTime={selectedPortableTime}
                  setSelectedPortableTime={setSelectedPortableTime}
                  setOpenLogin={setOpenLogin}
                />
              )}

              <ChooseServiceFromDetails prod={data} />
            </Box>
          </Box>
        </Box>
      )}

      <Login
        showBtn={!showBtn}
        open={openLogin}
        setOpen={setOpenLogin}
        id="fifthLogin"
        customIDOtpField="FifthOtpField"
        customIDLogin="FifthBtnLogin"
      />
    </Box>
  );
}

export default ServiceDetails;
